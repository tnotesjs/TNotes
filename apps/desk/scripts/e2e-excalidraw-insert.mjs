// E6 插入流程与删除语义：斜杠菜单「Excalidraw 画布」→ 主进程先建文件 → 定点插入组件；
// 撤销/重做/删除组件都不动已创建的资源。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-excalidraw-insert.mjs
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
const canvasFiles = () =>
  readdirSync(assets)
    .filter((name) => name.endsWith('.excalidraw'))
    .sort()
const readNote = () => readFileSync(notePath, 'utf8')

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
  await page.locator('.toc-row', { hasText: '画布' }).first().click()
  const pm = page.locator('.milkdown .ProseMirror')
  await pm.waitFor({ timeout: 30000 })
  await page.waitForTimeout(600)

  /** 在正文末尾开一个空段落并打开斜杠菜单。 */
  const openSlashMenu = async () => {
    await pm.locator(':scope > p').last().click()
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
    return waitFor(async () => canvasFiles().length, 15000)
  }
  /** 等笔记落盘出现组件（自动保存有 300ms 防抖）。 */
  const waitForComponentCount = (count) =>
    waitFor(() => (readNote().match(/<Excalidraw /g)?.length ?? 0) === count, 10000)
  const doneButton = () => page.locator('.desk-excalidraw [data-action="done"]:visible').first()

  // 1) 斜杠菜单插入：主进程先建文件，再定点插入组件，并直接进入编辑
  const firstCount = await insertCanvas()
  const firstFiles = canvasFiles()
  record(
    '斜杠菜单插入：先建文件再插组件，文件名带笔记编号',
    firstCount === 1 &&
      /^0001-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.excalidraw$/.test(firstFiles[0] ?? ''),
    `files=${JSON.stringify(firstFiles)}`
  )
  await waitForComponentCount(1)
  const insertedSource = readNote()
  const match = insertedSource.match(/<Excalidraw path="([^"]+)" \/>/)
  record(
    '插入的组件指向刚创建的相对路径',
    match?.[1] === `../assets/${firstFiles[0]}`,
    `path=${match?.[1]}`
  )
  const editing = await waitFor(
    async () =>
      (await page.locator('.desk-excalidraw:visible .excalidraw__canvas.interactive').count()) ===
      1,
    30000
  )
  record('新插入的卡片直接进入编辑状态', Boolean(editing))
  await page.screenshot({ path: join(shots, 'inserted.png') })

  // 2) 同一篇笔记再插一次：不重名
  await doneButton().click()
  await page.waitForTimeout(800)
  await insertCanvas()
  await waitForComponentCount(2)
  const secondFiles = canvasFiles()
  record(
    '同一篇笔记多张画布不重名',
    secondFiles.length === 2 && new Set(secondFiles).size === 2,
    `files=${JSON.stringify(secondFiles)}`
  )
  await doneButton().click()
  await page.waitForTimeout(800)

  // 3) 撤销插入：组件消失但文件保留
  const noteWithTwo = readNote()
  await pm.locator(':scope > p').last().click()
  await page.keyboard.press('ControlOrMeta+z')
  const undone = await waitFor(() => readNote() !== noteWithTwo, 8000)
  const afterUndo = readNote()
  record(
    '撤销插入：组件消失、已创建文件保留',
    Boolean(undone) &&
      (afterUndo.match(/<Excalidraw /g)?.length ?? 0) === 1 &&
      canvasFiles().length === 2,
    `组件数=${afterUndo.match(/<Excalidraw /g)?.length ?? 0} 文件数=${canvasFiles().length}`
  )

  // 4) 重做：同一个 path 回来，不会创建第二份文件
  await page.keyboard.press('ControlOrMeta+Shift+z')
  const redone = await waitFor(() => (readNote().match(/<Excalidraw /g)?.length ?? 0) === 2, 8000)
  record(
    '重做插入：恢复同一路径且不新建文件',
    Boolean(redone) && canvasFiles().length === 2,
    `组件数=${readNote().match(/<Excalidraw /g)?.length ?? 0} 文件数=${canvasFiles().length}`
  )
  await page.screenshot({ path: join(shots, 'undo-redo.png') })

  // 5) 删除组件：不级联删除资源
  const componentCount = readNote().match(/<Excalidraw /g)?.length ?? 0
  await pm.locator('.desk-excalidraw').last().click()
  await page.keyboard.press('ControlOrMeta+a')
  await page.waitForTimeout(150)
  await page.keyboard.press('Backspace')
  const removed = await waitFor(
    () => (readNote().match(/<Excalidraw /g)?.length ?? 0) < componentCount,
    8000
  )
  record(
    '删除组件（画布内全选删除）不级联删除资源',
    Boolean(removed) && canvasFiles().length === 2,
    `组件数=${readNote().match(/<Excalidraw /g)?.length ?? 0} 文件数=${canvasFiles().length}`
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
