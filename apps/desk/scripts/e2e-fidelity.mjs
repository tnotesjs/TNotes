// 渲染忠实性：结构性不忠实的区域降级为「按原文显示」，其余内容照常渲染，且不改磁盘。
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

// 嵌套容器是已知的「结构性不忠实」（纯文本层对不齐）：这段必须被降级成按原文显示。
// 后面的 222 段落与被降级区域无关，必须照常渲染 —— 用来验证「只降级出问题的区域」。
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
  // 降级在空闲时发生，留足时间
  await page.waitForTimeout(3000)

  const state = () =>
    page.evaluate(() => {
      const editor = [...document.querySelectorAll('.ProseMirror')].find(
        (el) => el.offsetParent !== null
      )
      if (!editor) return { error: 'no-editor' }
      const unparsed = [...editor.querySelectorAll('.desk-raw-block--unparsed')]
      const paragraphs = [...editor.querySelectorAll('p')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => el.textContent ?? '')
      return {
        unparsed: unparsed.length,
        unparsedText: unparsed.map((el) => el.textContent ?? '').join('\n---\n'),
        has222: paragraphs.some((text) => text.trim() === '222'),
        callouts: editor.querySelectorAll('.desk-callout').length,
        status:
          document.querySelector('.status-bar, .app-status, [role="status"]')?.textContent ?? ''
      }
    })

  const before = await state()
  check('问题区域被降级为「按原文显示」', before.unparsed >= 1, `unparsed=${before.unparsed}`)
  check(
    '降级内容逐字来自原文',
    typeof before.unparsedText === 'string' && before.unparsedText.includes('::: info I'),
    String(before.unparsedText).replace(/\n/g, '⏎').slice(0, 60)
  )
  // 222 的内容必须保住（要么仍是段落，要么作为原文卡片的文字保留），绝不丢
  check(
    '无关内容 222 没有丢失',
    before.has222 === true || String(before.unparsedText).includes('222'),
    `paragraph=${before.has222}`
  )
  check('正常提示块没有被降级', before.callouts === 1, `callouts=${before.callouts}`)
  await page.screenshot({ path: join(deskDir, 'scripts', 'shots', 'fidelity-degraded.png') })

  // 切到源码视图：磁盘必须逐字未变
  await page.getByRole('button', { name: '源码视图', exact: true }).click()
  await page.waitForTimeout(1200)
  const onDisk = readFileSync(noteFile, 'utf8')
  if (onDisk !== markdown) {
    console.log('--- 磁盘内容 ---')
    console.log(JSON.stringify(onDisk))
    console.log('--- 期望内容 ---')
    console.log(JSON.stringify(markdown))
  }
  check('切视图后磁盘文件逐字未变', onDisk === markdown)

  // 切回可视化：降级仍然生效
  await page.getByRole('button', { name: '可视化编辑', exact: true }).click()
  await page.waitForTimeout(3000)
  const after = await state()
  check('切回可视化后仍然按原文显示', after.unparsed >= 1, `unparsed=${after.unparsed}`)
  check('切回后磁盘仍然未变', readFileSync(noteFile, 'utf8') === markdown)

  console.log(failures === 0 ? '\nfidelity e2e: 全部通过' : `\nfidelity e2e: ${failures} 项失败`)
  if (failures > 0) process.exitCode = 1
} finally {
  await app.close()
  rmSync(fixture, { recursive: true, force: true })
}
