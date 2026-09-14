// 插入流程与删除语义：斜杠菜单「Excalidraw 画布」→ 主进程建 `.excalidraw` + 同名
// 占位 `.svg` → 笔记里插入图片引用 → 打开画布标签页；撤销/重做/删除引用都不动资源。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-excalidraw-insert.mjs
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-canvas-insert-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'canvas-insert')
const notes = join(kb, 'notes')
const assets = join(kb, 'assets')
const notePath = join(notes, '0001. 画布.md')
const shots = join(deskDir, 'scripts', 'shots', 'excalidraw-insert')
mkdirSync(notes, { recursive: true })
mkdirSync(assets, { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

writeFileSync(
  join(kb, 'tnotes.json'),
  `${JSON.stringify({ name: 'canvas-insert', title: 'canvas-insert' })}\n`
)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. 画布\n')
const NOTE_BODY = [
  '---',
  'id: 33333333-3333-4333-8333-333333333333',
  '---',
  '',
  '# 画布',
  '',
  '插入位置之前的段落。',
  ''
].join('\n')
writeFileSync(notePath, NOTE_BODY)
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
const filesWith = (extension) =>
  readdirSync(assets)
    .filter((name) => name.endsWith(extension))
    .sort()
const canvasFiles = () => filesWith('.excalidraw')
const derivedFiles = () => filesWith('.svg')
const readNote = () => readFileSync(notePath, 'utf8')
/** 笔记里的画布图片引用（相对路径） */
const noteCanvasRefs = () => [...readNote().matchAll(/!\[画布\]\(([^)]+)\)/g)].map((m) => m[1])

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
  await page.getByText('canvas-insert', { exact: true }).first().click()
  await page.waitForTimeout(1200)

  /** 回到笔记标签页（插入画布会打开画布标签页） */
  const openNote = async () => {
    await page.locator('.toc-row', { hasText: '画布' }).first().click()
    const pm = page.locator('.milkdown .ProseMirror')
    await pm.waitFor({ timeout: 30000 })
    await page.waitForTimeout(400)
  }
  await openNote()
  const pm = page.locator('.milkdown .ProseMirror')

  /** 在正文末尾开一个空段落并打开斜杠菜单 */
  const openSlashMenu = async () => {
    // 插入图片后末段会是图片段落（不可见），固定点第一个正文段落
    await pm.locator(':scope > p').first().click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.keyboard.type('/')
    const menu = page.locator('.milkdown-slash-menu')
    await menu.waitFor({ timeout: 10000 })
    return menu
  }
  const insertCanvas = async () => {
    const menu = await openSlashMenu()
    await menu.getByText('Excalidraw 画布', { exact: true }).first().click()
    return waitFor(async () => (readNote().includes('.svg') ? true : null), 15000)
  }
  const waitForRefCount = (count) => waitFor(() => noteCanvasRefs().length === count, 10000)
  /** 画布标签页是否打开（标题是 relPath） */
  const canvasTabCount = async () => page.locator('.tab', { hasText: '.excalidraw' }).count()

  // 1) 斜杠菜单插入：一次建两个文件、插入图片引用、并打开画布标签页
  const inserted = await insertCanvas()
  record(
    '斜杠菜单插入：笔记里出现图片引用',
    Boolean(inserted),
    `refs=${JSON.stringify(noteCanvasRefs())}`
  )
  await waitForRefCount(1)
  const firstCanvases = canvasFiles()
  const firstDerived = derivedFiles()
  record(
    '插入同时创建 .excalidraw 与同名占位 .svg（文件名带笔记编号）',
    firstCanvases.length === 1 &&
      firstDerived.length === 1 &&
      /^0001-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.excalidraw$/.test(firstCanvases[0] ?? '') &&
      firstDerived[0] === firstCanvases[0]?.replace(/\.excalidraw$/, '.svg'),
    `canvas=${JSON.stringify(firstCanvases)} svg=${JSON.stringify(firstDerived)}`
  )
  record(
    '插入的引用指向刚创建的那张派生 SVG',
    noteCanvasRefs()[0] === `../assets/${firstDerived[0]}`,
    `ref=${noteCanvasRefs()[0]}`
  )
  const placeholder = readFileSync(join(assets, firstDerived[0] ?? ''), 'utf8')
  record(
    '占位 SVG 是合法 SVG（还不是真图）',
    placeholder.trimStart().startsWith('<svg') && placeholder.includes('画布'),
    `bytes=${placeholder.length}`
  )
  const tabOpened = await waitFor(async () => (await canvasTabCount()) === 1, 15000)
  record('插入后直接打开该画布的标签页', Boolean(tabOpened), `tabs=${await canvasTabCount()}`)
  await page.screenshot({ path: join(shots, 'inserted.png') })

  // 2) 同一篇笔记再插一次：不重名
  await openNote()
  await insertCanvas()
  await waitForRefCount(2)
  const secondCanvases = canvasFiles()
  record(
    '同一篇笔记多张画布不重名（源文件与派生图各两份）',
    secondCanvases.length === 2 &&
      new Set(secondCanvases).size === 2 &&
      derivedFiles().length === 2,
    `canvas=${JSON.stringify(secondCanvases)} svg=${JSON.stringify(derivedFiles())}`
  )
  await page.screenshot({ path: join(shots, 'two-canvases.png') })

  // 3) 撤销插入：引用消失但文件保留
  // 插入会打开画布标签页，先回到笔记标签页再操作正文
  await openNote()
  const noteWithTwo = readNote()
  await pm.locator(':scope > p').first().click()
  await page.keyboard.press('ControlOrMeta+z')
  const undone = await waitFor(() => readNote() !== noteWithTwo, 8000)
  record(
    '撤销插入：图片引用消失、已创建的两个文件都保留',
    Boolean(undone) && noteCanvasRefs().length === 1 && canvasFiles().length === 2,
    `refs=${noteCanvasRefs().length} canvas=${canvasFiles().length} svg=${derivedFiles().length}`
  )

  // 4) 重做：同一个引用回来，不会创建第二份文件
  await page.keyboard.press('ControlOrMeta+Shift+z')
  const redone = await waitForRefCount(2)
  record(
    '重做插入：恢复同一路径且不新建文件',
    Boolean(redone) && canvasFiles().length === 2 && derivedFiles().length === 2,
    `refs=${noteCanvasRefs().length} canvas=${canvasFiles().length}`
  )
  await page.screenshot({ path: join(shots, 'undo-redo.png') })

  // 5) 删除引用：不级联删除资源
  await pm.locator('.desk-image').last().click()
  await page.waitForTimeout(150)
  await page.keyboard.press('Backspace')
  const removed = await waitFor(() => noteCanvasRefs().length < 2, 8000)
  record(
    '删除图片引用不级联删除资源',
    Boolean(removed) && canvasFiles().length === 2 && derivedFiles().length === 2,
    `refs=${noteCanvasRefs().length} canvas=${canvasFiles().length} svg=${derivedFiles().length}`
  )
  record('全流程无页面错误', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '))
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
