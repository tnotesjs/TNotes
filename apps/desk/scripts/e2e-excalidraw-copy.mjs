// E7 跨笔记复制：复制组件 → 粘贴到别的笔记时按目标前缀复制源文件；
// 同一个源一次粘贴只复制一次；纯文本组件粘贴也走同一套归属规则；
// 撤销/重做只影响调用，已复制的文件保留。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-excalidraw-copy.mjs
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-canvas-copy-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'canvas-copy')
const notes = join(kb, 'notes')
const assets = join(kb, 'assets')
const sourceCanvas = join(assets, '0001-26-09-10-15-30-00.excalidraw')
const sourceNote = join(notes, '0001. 源.md')
const targetNote = join(notes, '0002. 目标.md')
const thirdNote = join(notes, '0003. 另一个目标.md')
const shots = join(deskDir, 'scripts', 'shots', 'excalidraw-copy')
mkdirSync(notes, { recursive: true })
mkdirSync(assets, { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

const SCENE = `${JSON.stringify(
  {
    type: 'excalidraw',
    version: 2,
    source: 'desk-copy-fixture',
    elements: [
      {
        id: 'rect-1',
        type: 'rectangle',
        x: 60,
        y: 40,
        width: 180,
        height: 100,
        angle: 0,
        strokeColor: '#1e1e1e',
        backgroundColor: 'transparent',
        fillStyle: 'hachure',
        strokeWidth: 2,
        roughness: 1,
        opacity: 100,
        seed: 1,
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        boundElements: null,
        updated: 1,
        link: null,
        locked: false
      }
    ],
    appState: { gridSize: null, viewBackgroundColor: '#ffffff' },
    files: {}
  },
  null,
  2
)}\n`
writeFileSync(sourceCanvas, SCENE)
writeFileSync(
  join(kb, 'tnotes.json'),
  `${JSON.stringify({ name: 'canvas-copy', title: 'canvas-copy' })}\n`
)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. 源\n- [ ] 0002. 目标\n- [ ] 0003. 另一个目标\n')
writeFileSync(
  sourceNote,
  [
    '---',
    'id: 55555555-5555-4555-8555-555555555555',
    '---',
    '',
    '<Excalidraw path="../assets/0001-26-09-10-15-30-00.excalidraw" />',
    ''
  ].join('\n')
)
writeFileSync(targetNote, '---\nid: 66666666-6666-4666-8666-666666666666\n---\n\n目标笔记正文。\n')
writeFileSync(thirdNote, '---\nid: 77777777-7777-4777-8777-777777777777\n---\n\n另一个目标正文。\n')
writeFileSync(join(profile, 'workspace.v1.json'), JSON.stringify({ path: workspace }))
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  JSON.stringify({
    version: 1,
    theme: 'light',
    defaultNoteView: 'visual',
    prettier: false,
    autosave: { enabled: true, delayMs: 300 }
  })
)

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}
const canvasFiles = () =>
  readdirSync(assets)
    .filter((name) => name.endsWith('.excalidraw'))
    .sort()
const filesFor = (prefix) => canvasFiles().filter((name) => name.startsWith(prefix))
const readNote = (path) => readFileSync(path, 'utf8')

async function waitFor(check, timeoutMs = 10000, intervalMs = 120) {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const value = await check()
    if (value) return value
    if (Date.now() > deadline) return null
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
}

const app = await _electron.launch({
  executablePath: require('electron'),
  args: ['out/main/index.js', `--user-data-dir=${profile}`],
  cwd: deskDir,
  timeout: 60000,
  env: {
    ...process.env,
    ELECTRON_RUN_AS_NODE: undefined,
    ELECTRON_DISABLE_SANDBOX: '1',
    ELECTRON_DISABLE_SECURITY_WARNINGS: 'true'
  }
})

const pageErrors = []

try {
  const page = await app.firstWindow({ timeout: 30000 })
  page.on('pageerror', (error) => pageErrors.push(String(error.message ?? error)))
  await page.waitForLoadState('domcontentloaded')
  await page.getByText('canvas-copy', { exact: true }).first().click()
  await page.waitForTimeout(1200)

  const openNote = async (label) => {
    await page.locator('.toc-row', { hasText: label }).first().click()
    await page.waitForTimeout(700)
    await page.locator('.milkdown:visible .ProseMirror').first().waitFor({ timeout: 30000 })
  }
  const activePane = () => page.locator('.tab-content:visible .milkdown .ProseMirror').first()
  const card = () => page.locator('.desk-excalidraw:visible').first()
  /**
   * 卡片内部事件由节点视图 stopEvent 拦下，点卡片本身不会产生 PM 选择；
   * 用 raw block 的边界热区（pointerdown 选中整个原子）拿到 NodeSelection。
   */
  const selectCardAtomAndCopy = async () => {
    const boundary = page
      .locator('.desk-raw-block--excalidraw:visible .desk-raw-block__boundary-hit')
      .first()
    await boundary.click()
    await page.waitForTimeout(300)
    const selected = await page.locator('.ProseMirror-selectednode').count()
    await page.keyboard.press('ControlOrMeta+c')
    await page.waitForTimeout(500)
    return selected
  }
  const clipboardText = async () => app.evaluate(({ clipboard }) => clipboard.readText())

  // 1) 复制组件时写入带来源上下文的载荷
  await openNote('源')
  await card().waitFor({ timeout: 20000 })
  const selectedNodes = await selectCardAtomAndCopy()
  const payloadText = await clipboardText()
  record(
    '复制组件：剪贴板里带可识别的组件源码（供本 App 与跨应用粘贴）',
    payloadText.includes('assets/0001-26-09-10-15-30-00.excalidraw') &&
      (payloadText.match(/<Excalidraw /g)?.length ?? 0) >= 1,
    `selectedNodes=${selectedNodes} text=${JSON.stringify(payloadText.slice(0, 120))}`
  )

  // 2) 跨笔记粘贴：按目标笔记编号复制源文件
  await openNote('目标')
  await activePane().click()
  await page.keyboard.press('ControlOrMeta+v')
  await waitFor(() => filesFor('0002-').length === 1, 15000)
  const copiedName = filesFor('0002-')[0] ?? ''
  const targetHasNewPath = await waitFor(
    () => readNote(targetNote).includes(`<Excalidraw path="../assets/${copiedName}" />`),
    10000
  )
  record(
    '跨笔记粘贴：按目标笔记编号复制出独立文件并插入新引用',
    Boolean(targetHasNewPath) &&
      readFileSync(sourceCanvas, 'utf8') === SCENE &&
      canvasFiles().length === 2,
    `files=${JSON.stringify(canvasFiles())} noteTail=${JSON.stringify(readNote(targetNote).slice(-60))} 源未变=${readFileSync(sourceCanvas, 'utf8') === SCENE}`
  )
  const pastedEditable = await waitFor(
    async () => (await card().locator('[data-action="edit"]').isVisible()) === true,
    10000
  )
  record('粘贴到本笔记后归属正确：卡片可以编辑', Boolean(pastedEditable))
  await page.screenshot({ path: join(shots, 'cross-note-paste.png') })

  // 3) 再粘一次：独立副本（不共享）
  await page.keyboard.press('ControlOrMeta+v')
  const secondCopy = await waitFor(() => filesFor('0002-').length === 2, 15000)
  record(
    '再次粘贴：创建独立副本，不与上一份共享',
    Boolean(secondCopy) && canvasFiles().length === 3,
    `files=${JSON.stringify(filesFor('0002-'))}`
  )

  // 4) 撤销/重做：只影响调用，文件保留
  await page.waitForTimeout(800)
  // 焦点要落在正文段落上：点卡片/原子时 Cmd+Z 不一定送到 ProseMirror 的历史
  await activePane().locator(':scope > p').last().click()
  await page.keyboard.press('ControlOrMeta+z')
  const undone = await waitFor(
    () => (readNote(targetNote).match(/<Excalidraw /g)?.length ?? 0) === 1,
    8000
  )
  record(
    '撤销粘贴：只移除调用，已复制的文件保留',
    Boolean(undone) && filesFor('0002-').length === 2,
    `组件数=${readNote(targetNote).match(/<Excalidraw /g)?.length ?? 0} 文件数=${filesFor('0002-').length} tail=${JSON.stringify(readNote(targetNote).slice(-60))}`
  )
  await page.keyboard.press('ControlOrMeta+Shift+z')
  const redone = await waitFor(
    () => (readNote(targetNote).match(/<Excalidraw /g)?.length ?? 0) === 2,
    8000
  )
  record(
    '重做粘贴：恢复同一路径且不新建文件',
    Boolean(redone) && filesFor('0002-').length === 2,
    `组件数=${readNote(targetNote).match(/<Excalidraw /g)?.length ?? 0}`
  )

  // 5) 纯文本粘贴：手写跨笔记引用也按归属复制
  await openNote('另一个目标')
  await activePane().click()
  await app.evaluate(({ clipboard }) => {
    clipboard.writeText('<Excalidraw path="../assets/0001-26-09-10-15-30-00.excalidraw" />')
  })
  await page.keyboard.press('ControlOrMeta+v')
  await waitFor(() => filesFor('0003-').length === 1, 15000)
  const plainName = filesFor('0003-')[0] ?? ''
  const plainInserted = await waitFor(
    () => readNote(thirdNote).includes(`<Excalidraw path="../assets/${plainName}" />`),
    10000
  )
  record(
    '纯文本组件粘贴：检查归属后复制成目标笔记自己的文件',
    Boolean(plainInserted),
    `files=${JSON.stringify(filesFor('0003-'))} note=${JSON.stringify(readNote(thirdNote).slice(-80))}`
  )

  // 6) 围栏示例粘贴：不能被当成组件
  const beforeFenced = canvasFiles().length
  await app.evaluate(({ clipboard }) => {
    clipboard.writeText(
      '```md\n<Excalidraw path="../assets/0001-26-09-10-15-30-00.excalidraw" />\n```'
    )
  })
  await page.keyboard.press('ControlOrMeta+v')
  await page.waitForTimeout(1500)
  record(
    '围栏里的示例粘贴：不当作组件、不复制文件',
    canvasFiles().length === beforeFenced,
    `文件数=${canvasFiles().length}`
  )
  record('全流程无页面错误', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '))
  await page.screenshot({ path: join(shots, 'plain-text-paste.png') })
} catch (error) {
  record('运行未完成（未捕获异常）', false, String(error).split('\n')[0])
  throw error
} finally {
  await app.close().catch(() => {})
  if (!process.env.KEEP_FIXTURE) rmSync(fixture, { recursive: true, force: true })
  const passed = results.length > 0 && results.every((item) => item.ok)
  console.log(`\n${passed ? 'ALL PASS' : 'HAS FAILURES'}（${results.length} 项）`)
  console.log(`screenshots: ${shots}`)
  process.exitCode = passed ? 0 : 1
}
