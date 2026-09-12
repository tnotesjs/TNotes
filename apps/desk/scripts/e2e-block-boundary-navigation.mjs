// 块边界光标 + T1–T6 键盘导航（对齐语雀）。
// Run: node apps/desk/scripts/e2e-block-boundary-navigation.mjs  （需先 electron-vite build）
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-boundary-nav-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.boundary-nav')
const noteFile = join(kb, 'notes', '0001. boundary.md')
const shots = join(deskDir, 'scripts', 'shots', 'boundary-nav')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'boundary-nav' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. boundary\n')

/** 代码块 / 表格 / 只读组件（足迹）/ 空行，覆盖停靠模型的各条路径。 */
const source = [
  '---',
  'id: 10000000-0000-4000-8000-000000000065',
  '---',
  '',
  '# 0001. boundary',
  '',
  '上一段',
  '',
  '```js',
  'const a = 1',
  'console.log(a)',
  '```',
  '',
  '中间段',
  '',
  '| 列 A | 列 B |',
  '| --- | --- |',
  '| A1 | B1 |',
  '',
  '::: footprints 2025-01-01 12:00',
  '',
  '足迹正文。',
  '',
  ':::',
  '',
  '尾段',
  ''
].join('\n')
writeFileSync(noteFile, source)
writeFileSync(
  join(profile, 'workspace.v1.json'),
  `${JSON.stringify({ path: workspace }, null, 2)}\n`
)
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  `${JSON.stringify({ version: 1, theme: 'light', defaultNoteView: 'visual', autosave: { enabled: false, delayMs: 1000 } }, null, 2)}\n`
)

const app = await _electron.launch({
  executablePath: require('electron'),
  args: ['out/main/index.js', `--user-data-dir=${profile}`],
  cwd: deskDir,
  timeout: 60000,
  env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined, ELECTRON_DISABLE_SANDBOX: '1' }
})
const pageErrors = []
const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

try {
  const page = await app.firstWindow()
  page.on('pageerror', (error) => pageErrors.push(String(error)))
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2500)
  await page.getByText('boundary-nav', { exact: true }).first().click()
  await page.locator('.toc-row', { hasText: 'boundary' }).first().locator('.node-label').click()
  const pm = page.locator('.milkdown .ProseMirror:visible').first()
  await pm.waitFor({ timeout: 20000 })
  await page.waitForTimeout(2000)

  /** 当前状态：边界光标侧别 / 文本光标 / 块大纲。 */
  const state = () =>
    page.evaluate(() => {
      const editor = [...document.querySelectorAll('.ProseMirror')].find(
        (el) => el.offsetParent !== null
      )
      const caret = editor?.querySelector('.desk-block-boundary-caret')
      const selection = window.getSelection()
      const node = selection?.anchorNode
      const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
      return {
        side: caret?.dataset.side ?? null,
        caretParent: (caret?.parentElement?.className ?? '').slice(0, 30),
        text: element
          ? `${element.tagName}:${(element.textContent ?? '').replace(/\s+/g, ' ').slice(0, 12)}@${selection.anchorOffset}`
          : null,
        cmFocus: Boolean(document.activeElement?.closest?.('.cm-editor')),
        inTable: Boolean(element?.closest?.('table')),
        outline: [...(editor?.children ?? [])].map((el) =>
          (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 12)
        )
      }
    })

  const press = async (key, times = 1) => {
    for (let index = 0; index < times; index += 1) {
      await page.keyboard.press(key)
      await page.waitForTimeout(220)
    }
  }
  const clickParagraph = async (text) => {
    await page.locator('.ProseMirror p:visible', { hasText: text }).first().click()
    await page.waitForTimeout(150)
  }
  /** 把光标放到「中间段」末尾，然后 ↓ 到它下方第一个停靠点。 */
  const gotoBoundaryBefore = async (text) => {
    await clickParagraph(text)
    await page.keyboard.press('End')
    await page.waitForTimeout(150)
    await press('ArrowDown')
  }

  // T1 → T2：段落 ↓ 落到代码块前光标
  await gotoBoundaryBefore('上一段')
  let current = await state()
  record(
    'T2 段落 ↓ → 代码块前光标（不落光标进块、也不整块选中）',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // T2 → T3：再 ↓ 进 CodeMirror 首行
  await press('ArrowDown')
  current = await state()
  record(
    'T3 块前 ↓ → 进 CodeMirror 首行',
    current.cmFocus && current.text?.includes('const') && current.text?.endsWith('@0'),
    JSON.stringify({ cmFocus: current.cmFocus, text: current.text })
  )

  // T3 → T4：↓ 走到末行行尾（CM 自己移动）
  await press('ArrowDown')
  await press('End')
  current = await state()
  record(
    'T4 CM 内 ↓+End → 末行行尾（CM 自己移动）',
    current.cmFocus && (current.text?.startsWith('SPAN:') ?? false),
    JSON.stringify({ text: current.text })
  )

  // T4 → T5：末行行尾按一次 ↓ 出块
  // （我们的 CM 文档末尾没有空行——markdown 里 fence 的收尾换行不属于代码内容——
  //   所以末行行尾一次 ↓ 就出块；Yuque 的「两次 ↓」来自它有一个末尾空行。）
  await press('ArrowDown')
  current = await state()
  record(
    'T5 末行行尾 ↓ → 块后光标',
    current.side === 'after' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // T5 → T6：↓ 进下一段
  await press('ArrowDown')
  current = await state()
  record(
    'T6 块后 ↓ → 下一段开头',
    current.side === null &&
      (current.text?.includes('中间段') ?? false) &&
      current.text?.endsWith('@0'),
    JSON.stringify({ text: current.text })
  )

  // ←/→ 与 ↑/↓ 的差别：→ 一次就从末行穿出、← 一次就从首行穿出
  await gotoBoundaryBefore('上一段')
  await press('ArrowDown')
  await press('ArrowDown')
  await press('End')
  await press('ArrowRight')
  current = await state()
  record(
    '→ 从 CM 末行一次穿出到块后光标',
    current.side === 'after' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowUp')
  await press('ArrowUp')
  await press('ArrowUp')
  current = await state()
  record(
    '↑ 从 CM 首行一次穿回块前光标',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowDown')
  await press('ArrowLeft')
  current = await state()
  record(
    '← 在 CM 首行一次穿回块前光标',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // 表格：块前 ↓ 直接到块后，→ 进第一格；末行 ↓ 到块后，块后 ← 进最后一格
  await gotoBoundaryBefore('中间段')
  current = await state()
  record(
    '表格前光标（中间段 ↓）',
    current.side === 'before' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowDown')
  current = await state()
  record(
    '表格块前 ↓ → 直接到表格后光标',
    current.side === 'after' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowUp')
  current = await state()
  record(
    '表格块后 ↑ → 回到表格前光标',
    current.side === 'before' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowRight')
  current = await state()
  record(
    '表格块前 → → 进第一个单元格（列 A）',
    current.side === null && current.inTable && (current.text?.includes('列 A') ?? false),
    JSON.stringify({ text: current.text, inTable: current.inTable })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '表格内 ↓ → 下一行（A1）',
    current.inTable && (current.text?.includes('A1') ?? false),
    JSON.stringify(current.text)
  )
  await press('ArrowDown')
  current = await state()
  record(
    '表格末行 ↓ → 表格后光标',
    current.side === 'after' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowLeft')
  current = await state()
  record(
    '表格块后 ← → 进最后一个单元格（B1）',
    current.side === null && current.inTable && (current.text?.includes('B1') ?? false),
    JSON.stringify({ text: current.text, inTable: current.inTable })
  )
  await press('ArrowUp')
  await press('ArrowUp')
  current = await state()
  record(
    '表格首行 ↑ → 表格前光标',
    current.side === 'before' && current.caretParent.includes('table'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // 只读块（足迹）：块前 ↓ 一步穿到块后，再 ↓ 到尾段
  await clickParagraph('尾段')
  await page.keyboard.press('Home')
  await page.waitForTimeout(150)
  await press('ArrowUp')
  current = await state()
  record(
    '尾段 ↑ → 足迹块后光标',
    current.side === 'after' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowUp')
  current = await state()
  record(
    '足迹块后 ↑ → 足迹块前光标',
    current.side === 'before' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '只读组件（足迹）块前 ↓ → 一步穿到块后光标',
    current.side === 'after' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '足迹块后 ↓ → 尾段开头',
    current.side === null && (current.text?.includes('尾段') ?? false),
    JSON.stringify(current.text)
  )

  // 未编辑：导航不产生任何 markdown 变更
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(700)
  record('纯导航 + 保存 → 文件字节零 diff', readFileSync(noteFile, 'utf8') === source)
  await page.screenshot({ path: join(shots, 'boundary-nav.png') })
  record('导航过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 200))

  const failed = results.filter((item) => !item.ok)
  console.log(`\n${results.length - failed.length}/${results.length} 通过`)
  if (failed.length) {
    console.log(`失败：${failed.map((item) => item.name).join('、')}`)
    process.exitCode = 1
  }
} catch (error) {
  console.log(
    `\n运行未完成（未捕获异常） — ${error instanceof Error ? error.message : String(error)}`
  )
  process.exitCode = 1
} finally {
  await app.close()
  rmSync(fixture, { recursive: true, force: true })
}
