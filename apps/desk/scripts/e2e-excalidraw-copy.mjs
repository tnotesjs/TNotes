// E7 跨笔记复制：引用的资源一律**拷贝、不共享**。
// 复制笔记里的画布图（`![](./assets/NNNN-x.svg)`）→ 粘贴到别的笔记时，
// `.excalidraw` 与同名派生 `.svg` 一起换成目标笔记编号重新生成，
// 同一个源一次粘贴只复制一次；纯文本粘贴也走同一套归属规则；
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
const sourceDerived = join(assets, '0001-26-09-10-15-30-00.svg')
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
  sourceDerived,
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140"><rect width="240" height="140" fill="#ffffff"/></svg>\n'
)
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
    '![画布](../assets/0001-26-09-10-15-30-00.svg)',
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
const derivedFiles = () =>
  readdirSync(assets)
    .filter((name) => name.endsWith('.svg'))
    .sort()
const filesFor = (prefix) => canvasFiles().filter((name) => name.startsWith(prefix))
const derivedFor = (prefix) => derivedFiles().filter((name) => name.startsWith(prefix))
/** 笔记里的画布图片引用（KB 相对路径） */
const noteCanvasRefs = (path) =>
  [...readNote(path).matchAll(/!\[画布\]\(([^)]+)\)/g)].map((m) => m[1].replace(/^\.\.\//, ''))
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
  const figure = () => page.locator('.desk-image:visible').first()
  /**
   * 复制整篇笔记：ProseMirror 复制图片节点时 text/plain 只有 alt，
   * 真正的引用在 text/html 里（这也正是插件要处理的那条路径）。
   */
  const selectAllAndCopy = async () => {
    await activePane().click()
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.press('ControlOrMeta+c')
    await page.waitForTimeout(500)
  }
  const clipboardText = async () => app.evaluate(({ clipboard }) => clipboard.readText())
  const clipboardHtml = async () => app.evaluate(({ clipboard }) => clipboard.readHTML())

  // 1) 复制：text/plain 里只有 alt，真正的引用在富文本里（插件必须认这条路径）
  await openNote('源')
  await figure().waitFor({ timeout: 20000 })
  await selectAllAndCopy()
  const payloadText = await clipboardText()
  const payloadHtml = await clipboardHtml()
  record(
    '复制画布图：引用出现在富文本剪贴板里（text/plain 只有 alt）',
    payloadHtml.includes('0001-26-09-10-15-30-00.svg') && payloadText.includes('画布'),
    `html=${JSON.stringify(payloadHtml.slice(0, 140))} text=${JSON.stringify(payloadText.slice(0, 30))}`
  )

  // 2) 跨笔记粘贴：按目标笔记编号复制源文件
  await openNote('目标')
  await activePane().click()
  await page.keyboard.press('ControlOrMeta+v')
  await waitFor(() => filesFor('0002-').length === 1, 20000)
  const copiedName = filesFor('0002-')[0] ?? ''
  const copiedDerived = copiedName.replace(/\.excalidraw$/, '.svg')
  const targetHasNewPath = await waitFor(
    () => noteCanvasRefs(targetNote).includes(`assets/${copiedDerived}`),
    15000
  )
  record(
    '跨笔记粘贴：源文件与派生图一起按目标编号复制，并插入新引用',
    Boolean(targetHasNewPath) &&
      derivedFor('0002-').length === 1 &&
      readFileSync(sourceCanvas, 'utf8') === SCENE &&
      canvasFiles().length === 2,
    `canvas=${JSON.stringify(canvasFiles())} svg=${JSON.stringify(derivedFiles())} refs=${JSON.stringify(noteCanvasRefs(targetNote))} 目标正文=${JSON.stringify(readNote(targetNote).slice(-160))} 源未变=${readFileSync(sourceCanvas, 'utf8') === SCENE}`
  )
  // 「可编辑」= 同名源画布在 → 图上出现「编辑」按钮
  await figure().click()
  const pastedEditable = await waitFor(
    async () => (await page.locator('.desk-image__canvas-edit:visible').count()) === 1,
    10000
  )
  record('粘贴到本笔记后归属正确：画布图可以编辑', Boolean(pastedEditable))
  await page.screenshot({ path: join(shots, 'cross-note-paste.png') })

  // 3) 再粘一次：独立副本（不共享）
  await page.keyboard.press('ControlOrMeta+v')
  const secondCopy = await waitFor(
    () => filesFor('0002-').length === 2 && derivedFor('0002-').length === 2,
    20000
  )
  record(
    '再次粘贴：创建独立副本，不与上一份共享',
    Boolean(secondCopy) && canvasFiles().length === 3,
    `canvas=${JSON.stringify(filesFor('0002-'))} svg=${JSON.stringify(derivedFor('0002-'))}`
  )

  // 4) 撤销/重做：只影响调用，文件保留
  await page.waitForTimeout(800)
  // 焦点要落在正文段落上：点卡片/原子时 Cmd+Z 不一定送到 ProseMirror 的历史
  await activePane().locator(':scope > p').last().click()
  await page.keyboard.press('ControlOrMeta+z')
  const undone = await waitFor(() => noteCanvasRefs(targetNote).length === 1, 8000)
  record(
    '撤销粘贴：只移除引用，已复制的文件保留',
    Boolean(undone) && filesFor('0002-').length === 2 && derivedFor('0002-').length === 2,
    `refs=${noteCanvasRefs(targetNote).length} canvas=${filesFor('0002-').length} svg=${derivedFor('0002-').length}`
  )
  await page.keyboard.press('ControlOrMeta+Shift+z')
  const redone = await waitFor(() => noteCanvasRefs(targetNote).length === 2, 8000)
  record(
    '重做粘贴：恢复同一路径且不新建文件',
    Boolean(redone) && filesFor('0002-').length === 2 && derivedFor('0002-').length === 2,
    `refs=${noteCanvasRefs(targetNote).length}`
  )

  // 5) 纯文本粘贴：手写跨笔记引用也按归属复制
  await openNote('另一个目标')
  await activePane().click()
  await app.evaluate(({ clipboard }) => {
    clipboard.writeText('![画布](../assets/0001-26-09-10-15-30-00.svg)')
  })
  await page.keyboard.press('ControlOrMeta+v')
  await waitFor(() => filesFor('0003-').length === 1, 20000)
  const plainDerived = (filesFor('0003-')[0] ?? '').replace(/\.excalidraw$/, '.svg')
  const plainInserted = await waitFor(
    () => noteCanvasRefs(thirdNote).includes(`assets/${plainDerived}`),
    15000
  )
  record(
    '纯文本图片引用粘贴：检查归属后复制成目标笔记自己的资源',
    Boolean(plainInserted) && derivedFor('0003-').length === 1,
    `canvas=${JSON.stringify(filesFor('0003-'))} svg=${JSON.stringify(derivedFor('0003-'))}`
  )

  // 6) 同笔记内粘贴：编号相同不复制（还是同一张画布）
  const beforeSameNote = canvasFiles().length
  await app.evaluate(({ clipboard }, svg) => {
    clipboard.writeText(`![画布](../assets/${svg})`)
  }, plainDerived)
  await page.keyboard.press('ControlOrMeta+v')
  await page.waitForTimeout(1500)
  record(
    '同编号引用粘贴：不复制文件（同一张画布）',
    canvasFiles().length === beforeSameNote,
    `canvas=${canvasFiles().length}`
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
