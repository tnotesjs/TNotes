// Excalidraw E0 验证：Vue/DOM 宿主内挂载 React 编辑器、换承载位置后原生撤销历史、
// 首屏代价与产物体积。需要先构建 fixture：
//   cd packages/ui && ../../apps/desk/node_modules/.bin/vite build e0-spike --outDir e0-spike/.e0-dist
// 然后： node apps/desk/scripts/e2e-excalidraw-e0.mjs
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(deskDir, '..', '..')
const siteRoot = join(repoRoot, 'packages', 'ui', 'e0-spike', '.e0-dist')
const shots = join(deskDir, 'scripts', 'shots', 'excalidraw-e0')
mkdirSync(shots, { recursive: true })

// 只读视图要离线自包含：把官方字体复制到站点根目录（默认会指向 esm.sh CDN）
const fontSource = join(
  repoRoot,
  'packages',
  'ui',
  'node_modules',
  '@excalidraw',
  'excalidraw',
  'dist',
  'prod',
  'fonts'
)
const fontTarget = join(siteRoot, 'fonts')
if (existsSync(fontSource) && !existsSync(fontTarget)) {
  cpSync(fontSource, fontTarget, { recursive: true })
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  for (const candidate of [
    join(siteRoot, pathname),
    join(siteRoot, `${pathname}.html`),
    join(siteRoot, pathname, 'index.html')
  ]) {
    try {
      if ((await stat(candidate)).isFile()) {
        response.writeHead(200, {
          'content-type': types[extname(candidate)] ?? 'application/octet-stream'
        })
        response.end(await readFile(candidate))
        return
      }
    } catch {
      // try next
    }
  }
  response.writeHead(404)
  response.end('not found')
})

const port = 8124
await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve))

const { chromium } = await import('playwright-core')
const cachedChromium = [
  '/Users/huyouda/Library/Caches/ms-playwright/chromium-1187/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
  '/Users/huyouda/Library/Caches/ms-playwright/chromium_headless_shell-1187/chrome-headless-shell-mac-arm64/chrome-headless-shell'
].find((candidate) => existsSync(candidate))

/** E2：共享只读组件在真实浏览器里的渲染（中文/箭头/透明图 + 深浅主题） */
async function checkReadOnlyView(page, record, shots) {
  const errors = []
  const externalRequests = []
  page.on('pageerror', (error) => errors.push(String(error.message ?? error)))
  page.on('request', (request) => {
    const url = request.url()
    if (!url.startsWith('http://127.0.0.1')) externalRequests.push(url)
  })

  await page.goto(`http://127.0.0.1:${page.__port}/view.html`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.tn-excalidraw-view[data-state="ready"]', { timeout: 60000 })
  await page.waitForTimeout(800)

  const light = await page.evaluate(() => {
    const image = document.querySelector('.tn-excalidraw-view__image')
    return {
      srcPrefix: image?.getAttribute('src')?.slice(0, 30) ?? '',
      naturalWidth: image?.naturalWidth ?? 0,
      length: image?.getAttribute('src')?.length ?? 0
    }
  })
  record(
    '只读视图：渲染出可见 SVG 图片（中文文本场景）',
    light.naturalWidth > 0 && light.srcPrefix.startsWith('data:image/svg+xml'),
    `naturalWidth=${light.naturalWidth}`
  )
  await page.screenshot({ path: join(shots, 'view-light.png') })

  await page.click('#theme')
  await page.waitForTimeout(1200)
  const dark = await page.evaluate(() => {
    const image = document.querySelector('.tn-excalidraw-view__image')
    return { src: image?.getAttribute('src') ?? '', naturalWidth: image?.naturalWidth ?? 0 }
  })
  record(
    '只读视图：切到深色主题后重新导出且图片仍可见',
    dark.naturalWidth > 0 && dark.src !== light.srcPrefix,
    `naturalWidth=${dark.naturalWidth}`
  )
  const markup = decodeURIComponent(dark.src)
  // 允许 xmlns 里的 w3.org 命名空间，其余外部 URL 一律视为未自包含
  const externalRefs = [...markup.matchAll(/(?:url\(|href=")([^"')]+)/g)]
    .map((match) => match[1])
    .filter((url) => /^https?:\/\//.test(url) && !url.startsWith('http://www.w3.org/'))
  record(
    '只读视图：SVG 自包含（内嵌字体、无外部引用、无 foreignObject）',
    markup.includes('@font-face') &&
      markup.includes('data:font/woff2;base64,') &&
      externalRefs.length === 0 &&
      !markup.includes('foreignObject'),
    `@font-face=${markup.includes('@font-face')} 外部引用=${externalRefs.length}`
  )
  record(
    '只读视图：渲染过程无外部请求',
    externalRequests.length === 0,
    externalRequests.slice(0, 3).join(' | ')
  )
  await page.screenshot({ path: join(shots, 'view-dark.png') })
  record('只读视图：无页面错误', errors.length === 0, errors.slice(0, 2).join(' | '))
}

/** E3：编辑会话自动写盘、承载交接后撤销仍有效、flush 立即落盘 */
async function checkEditorSession(page, record, shots) {
  const errors = []
  page.on('pageerror', (error) => errors.push(String(error.message ?? error)))

  await page.goto(`http://127.0.0.1:${page.__port}/editor.html`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => Boolean(window.__e0api), null, { timeout: 60000 })
  await page.waitForTimeout(1200)

  // 先悬停再按下：Excalidraw 需要 pointermove 置位 isInteractive，否则合成鼠标事件
  // 不会开始绘制（这是测试脚本的坑，不是产品缺陷）
  const draw = async (settleMs = 500) => {
    const canvas = await page.$('.excalidraw__canvas.interactive')
    const box = await canvas.boundingBox()
    const startX = box.x + box.width * 0.25
    const startY = box.y + box.height * 0.35
    await page.evaluate(() => window.__e3.setActiveTool('rectangle'))
    await page.mouse.move(startX, startY)
    await page.waitForTimeout(200)
    await page.mouse.move(startX + 20, startY + 20, { steps: 3 })
    await page.mouse.down()
    await page.mouse.move(startX + 220, startY + 160, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(settleMs)
  }

  await draw()
  const afterDraw = await page.evaluate(() => ({
    elements: window.__e3.elements(),
    saves: window.__e3.saves.length,
    lastSaves: window.__e3.saves.at(-1)?.elements ?? -1
  }))
  record(
    '会话：编辑后自动写盘（无保存按钮）',
    afterDraw.elements === 1 && afterDraw.saves >= 1 && afterDraw.lastSaves === 1,
    JSON.stringify(afterDraw)
  )

  await page.click('#move')
  await page.waitForTimeout(600)
  await page.keyboard.press('ControlOrMeta+z')
  await page.waitForTimeout(600)
  const afterUndo = await page.evaluate(() => window.__e3.elements())
  record('交接：移动到全屏后键盘撤销仍有效（焦点已重建）', afterUndo === 0, `elements=${afterUndo}`)

  // 立刻 flush：防抖还没到点，待写内容必须被同步写出去
  await draw(50)
  const beforeFlush = await page.evaluate(() => ({
    saves: window.__e3.saves.length,
    elements: window.__e3.elements(),
    pending: window.__e3.pending()
  }))
  await page.click('#flush')
  await page.waitForTimeout(400)
  const afterFlush = await page.evaluate(() => ({
    saves: window.__e3.saves.length,
    pending: window.__e3.pending(),
    lastSaves: window.__e3.saves.at(-1)?.elements ?? -1
  }))
  record(
    'flush：立即写盘并清空待写（关闭入口/切换承载时使用）',
    beforeFlush.elements === 1 &&
      beforeFlush.pending === true &&
      afterFlush.saves > beforeFlush.saves &&
      afterFlush.pending === false &&
      afterFlush.lastSaves === 1,
    `before=${JSON.stringify(beforeFlush)} after=${JSON.stringify(afterFlush)}`
  )
  await page.screenshot({ path: join(shots, 'editor-session.png') })
  record('会话：无页面错误', errors.length === 0, errors.slice(0, 2).join(' | '))
}

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch({
  args: ['--no-sandbox'],
  ...(cachedChromium ? { executablePath: cachedChromium } : {})
})
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.__port = port
  const errors = []
  page.on('pageerror', (error) => errors.push(String(error.message ?? error)))

  const editorMode = process.argv.includes('--editor')
  if (editorMode) {
    await checkEditorSession(page, record, shots)
    const passed = results.length > 0 && results.every((item) => item.ok)
    console.log(`\n${passed ? 'ALL PASS' : 'HAS FAILURES'}（${results.length} 项）`)
    console.log(`screenshots: ${shots}`)
    process.exitCode = passed ? 0 : 1
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
    process.exit(process.exitCode ?? 0)
  }

  const viewMode = process.argv.includes('--view')
  if (viewMode) {
    await checkReadOnlyView(page, record, shots)
    const passed = results.length > 0 && results.every((item) => item.ok)
    console.log(`\n${passed ? 'ALL PASS' : 'HAS FAILURES'}（${results.length} 项）`)
    console.log(`screenshots: ${shots}`)
    process.exitCode = passed ? 0 : 1
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
    process.exit(process.exitCode ?? 0)
  }
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.excalidraw', { timeout: 60000 })
  await page.waitForFunction(() => Boolean(window.__e0api), null, { timeout: 60000 })
  await page.waitForTimeout(1200)
  record('挂载：React 编辑器在纯 DOM 宿主内渲染成功', true)

  const firstPaint = await page.evaluate(() => window.__e0.firstPaintMs())
  record('首屏：编辑器 API 就绪耗时已采集', true, `${Math.round(firstPaint)} ms`)
  await page.screenshot({ path: join(shots, 'mounted.png') })

  // 画一个矩形（真实鼠标事件 → 产生撤销历史）
  const canvas = await page.$('.excalidraw__canvas')
  const box = await canvas.boundingBox()
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await page.keyboard.press('r')
  await page.mouse.move(box.x + 200, box.y + 150)
  await page.mouse.down()
  await page.mouse.move(box.x + 420, box.y + 300, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(400)
  const afterDraw = await page.evaluate(() => window.__e0.elements())
  record('编辑：可在画布上绘制图形', afterDraw === 1, `elements=${afterDraw}`)
  await page.screenshot({ path: join(shots, 'drawn.png') })

  const undoState = () => page.evaluate(() => window.__e0.undoButtonState())
  /** mode=js：程序化 focus；mode=mouse：真实鼠标点画布后再按键 */
  const undoByKeyboard = async (mode = 'js') => {
    if (mode === 'mouse') {
      const target =
        (await page.$('.excalidraw__canvas.interactive')) ?? (await page.$('.excalidraw__canvas'))
      const area = await target.boundingBox()
      await page.mouse.click(area.x + area.width - 80, area.y + area.height - 80)
    } else {
      await page.evaluate(() => window.__e0.focusCanvas())
    }
    await page.waitForTimeout(250)
    await page.keyboard.press('ControlOrMeta+z')
    await page.waitForTimeout(500)
  }

  // 基线：不移动承载位置时，键盘撤销必须有效（否则后面的失败说明不了问题）
  const baselineUndoEnabled = await undoState()
  await undoByKeyboard()
  const afterBaselineUndo = await page.evaluate(() => window.__e0.elements())
  record(
    '基线：未移动承载位置时 Ctrl/Cmd+Z 能撤销',
    afterBaselineUndo === 0,
    `elements=${afterBaselineUndo}，撤销按钮之前 ${JSON.stringify(baselineUndoEnabled)}`
  )

  // 再画一个，用于「移动后撤销」的验证
  await page.evaluate(() => window.__e0.focusCanvas())
  await page.keyboard.press('r')
  await page.mouse.move(box.x + 200, box.y + 150)
  await page.mouse.down()
  await page.mouse.move(box.x + 420, box.y + 300, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(400)
  const redrawn = await page.evaluate(() => window.__e0.elements())
  const undoEnabledBeforeMove = await undoState()
  record(
    '重绘一个图形并确认撤销可用',
    redrawn === 1 && undoEnabledBeforeMove.disabled === false,
    `elements=${redrawn}`
  )

  // 关键验证：只移动宿主节点（不卸载 React 树），撤销历史是否保留
  await page.click('#move')
  await page.waitForTimeout(600)
  const moved = await page.evaluate(() => window.__e0.statusText)
  record('交接：宿主节点搬到全屏容器（未重新挂载）', moved === 'moved:fullscreen')
  await page.screenshot({ path: join(shots, 'fullscreen.png') })

  const undoEnabledAfterMove = await undoState()
  await undoByKeyboard('js')
  let afterMoveUndo = await page.evaluate(() => window.__e0.elements())
  let undoRoute = '程序化 focus + 快捷键'
  if (afterMoveUndo !== 0) {
    await undoByKeyboard('mouse')
    afterMoveUndo = await page.evaluate(() => window.__e0.elements())
    undoRoute = '鼠标点击画布 + 快捷键'
  }
  if (afterMoveUndo !== 0) {
    // 最后的判定：直接点工具栏撤销按钮（指针路径）。它若有效，说明历史在、只是快捷键没送到
    await page.click('[data-testid="button-undo"]')
    await page.waitForTimeout(500)
    afterMoveUndo = await page.evaluate(() => window.__e0.elements())
    undoRoute = '点击撤销按钮'
  }
  record(
    '撤销历史：换承载位置后仍能撤销上一个入口的操作',
    afterMoveUndo === 0,
    `elements=${afterMoveUndo}，生效路径：${undoRoute}；移动后撤销按钮 ${JSON.stringify(undoEnabledAfterMove)}`
  )
  await page.screenshot({ path: join(shots, 'undo-after-move.png') })

  // 对照：卸载重挂（新实例）后场景与历史都丢
  await page.click('#back')
  await page.waitForTimeout(300)
  await page.click('#remount')
  await page.waitForTimeout(1500)
  const afterRemount = await page.evaluate(() => window.__e0.elements())
  record(
    '对照：卸载重挂会丢场景与撤销历史（首版靠保留同一实例，而不是重建）',
    afterRemount === 0,
    `elements=${afterRemount}`
  )

  record('运行期无页面错误', errors.length === 0, errors.join(' | '))

  // 首屏真实代价：用 performance resource timing 统计脚本/字体/样式的传输量
  const budget = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource')
    const byType = {}
    let total = 0
    let encoded = 0
    for (const entry of entries) {
      const type = entry.initiatorType || 'other'
      byType[type] = (byType[type] ?? 0) + entry.decodedBodySize
      total += entry.decodedBodySize
      encoded += entry.encodedBodySize
    }
    return { total, encoded, byType, count: entries.length }
  })
  console.log(
    `\n测量：首屏 API 就绪 ${Math.round(firstPaint)} ms · 资源 ${budget.count} 个 / 解码 ${(
      budget.total / 1024
    ).toFixed(0)} KB / 传输 ${(budget.encoded / 1024).toFixed(0)} KB`
  )
  console.log(
    '分类（解码 KB）：',
    JSON.stringify(
      Object.fromEntries(
        Object.entries(budget.byType).map(([key, value]) => [key, Math.round(value / 1024)])
      )
    )
  )
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
  const passed = results.length > 0 && results.every((item) => item.ok)
  console.log(`\n${passed ? 'ALL PASS' : 'HAS FAILURES'}（${results.length} 项）`)
  console.log(`screenshots: ${shots}`)
  process.exitCode = passed ? 0 : 1
}
