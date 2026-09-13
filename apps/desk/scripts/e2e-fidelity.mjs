// 渲染忠实性：结构性不忠实的区域按**普通正文**暴露（可编辑/可删除），其余内容照常，磁盘不变。
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-fidelity-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.fidelity')
const noteFile = join(kb, 'notes', '0001. fidelity.md')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'fidelity' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. fidelity\n')

// 嵌套容器是已知的「结构性不忠实」：这段要按普通正文暴露（看得见 ::: 符号）。
// 后面的 222 段落与正常提示块都与它无关，必须照常渲染 —— 验证「只处理出问题的区域」。
const markdown = [
  '---',
  'id: fidelity-e2e',
  '---',
  '',
  '::: tip 正常提示块',
  '',
  '正常正文',
  '',
  ':::',
  '',
  '::: tip T',
  '',
  '外层',
  '',
  '::: info I',
  '',
  '内层',
  '',
  ':::',
  '',
  ':::',
  '',
  '222',
  ''
].join('\n')
writeFileSync(noteFile, markdown)
writeFileSync(
  join(profile, 'workspace.v1.json'),
  `${JSON.stringify({ path: workspace }, null, 2)}\n`
)
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  `${JSON.stringify(
    {
      version: 1,
      theme: 'light',
      defaultNoteView: 'visual',
      autosave: { enabled: false, delayMs: 1000 }
    },
    null,
    2
  )}\n`
)

const app = await _electron.launch({
  executablePath: require('electron'),
  args: ['out/main/index.js', `--user-data-dir=${profile}`],
  cwd: deskDir,
  timeout: 60000,
  env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined, ELECTRON_DISABLE_SANDBOX: '1' }
})

let failures = 0
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures += 1
}

try {
  const page = await app.firstWindow()
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2500)
  await page.getByText('fidelity', { exact: true }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('.toc-row', { hasText: '0001' }).first().locator('.node-label').click()
  await page.waitForTimeout(3000) // 降级在空闲时发生

  const state = () =>
    page.evaluate(() => {
      const editor = [...document.querySelectorAll('.ProseMirror')].find(
        (el) => el.offsetParent !== null
      )
      if (!editor) return { error: 'no-editor' }
      const paragraphs = [...editor.querySelectorAll('p')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => el.textContent ?? '')
      const literal = paragraphs.filter((text) => text.trim().startsWith(':::'))
      return {
        literal: literal.length,
        literalText: literal.join('\n'),
        unparsedCards: editor.querySelectorAll('.desk-raw-block--unparsed').length,
        has222: paragraphs.some((text) => text.trim() === '222'),
        callouts: editor.querySelectorAll('.desk-callout').length
      }
    })

  const before = await state()
  check(
    '问题区域按普通正文暴露（看得见 ::: 符号）',
    before.literal >= 1,
    `literal=${before.literal}`
  )
  check(
    '降级内容逐字可见',
    String(before.literalText).includes('::: info I'),
    String(before.literalText).replace(/\n/g, '⏎').slice(0, 60)
  )
  check('不再是专门的 raw 卡片', before.unparsedCards === 0, `cards=${before.unparsedCards}`)
  check(
    '无关段落 222 仍照常渲染',
    before.has222 === true && before.literalText.includes('222') === false
  )
  check('正常提示块没有被处理', before.callouts === 1, `callouts=${before.callouts}`)
  await page.screenshot({ path: join(deskDir, 'scripts', 'shots', 'fidelity-literal.png') })

  // 切到源码视图：磁盘必须逐字未变
  await page.getByRole('button', { name: '源码视图', exact: true }).click()
  await page.waitForTimeout(1200)
  check('切视图后磁盘文件逐字未变', readFileSync(noteFile, 'utf8') === markdown)

  // 切回可视化：仍是普通正文
  await page.getByRole('button', { name: '可视化编辑', exact: true }).click()
  await page.waitForTimeout(3000)
  const after = await state()
  check('切回可视化后仍按普通正文显示', after.literal >= 1, `literal=${after.literal}`)
  check('切回后磁盘仍然未变', readFileSync(noteFile, 'utf8') === markdown)

  // 关键：这段内容现在是**真的普通内容** —— 能直接编辑（用户反馈过"通过把手删不掉、改不了"）
  const target = page.locator('.ProseMirror p').filter({ hasText: '::: tip T' }).first()
  await target.click()
  await page.keyboard.press('End')
  await page.keyboard.type('X')
  await page.waitForTimeout(700)
  const edited = await state()
  check(
    '降级区域可以直接编辑（普通段落）',
    String(edited.literalText).includes('X'),
    String(edited.literalText).replace(/\n/g, '⏎').slice(0, 60)
  )

  console.log(failures === 0 ? '\nfidelity e2e: 全部通过' : `\nfidelity e2e: ${failures} 项失败`)
  if (failures > 0) process.exitCode = 1
} finally {
  await app.close()
  rmSync(fixture, { recursive: true, force: true })
}
