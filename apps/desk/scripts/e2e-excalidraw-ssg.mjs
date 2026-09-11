// E8 SSG 接入：`<Excalidraw path>` 在站点里是只读岛，字体随产物自包含，
// 客户端读源文件导出 SVG；产物不含用户机器路径，源库不新增派生资源。
// 需要先构建：pnpm --filter @tnotesjs/ssg build
// Run: node apps/desk/scripts/e2e-excalidraw-ssg.mjs
import { createServer } from 'node:http'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(deskDir, '..', '..')
const ssgEntry = join(repoRoot, 'packages', 'ssg', 'dist', 'index.js')
const fixture = mkdtempSync(join(tmpdir(), 'desk-canvas-ssg-'))
const kb = join(fixture, 'ssg-kb')
const notes = join(kb, 'notes')
const assets = join(kb, 'assets')
const shots = join(deskDir, 'scripts', 'shots', 'excalidraw-ssg')
mkdirSync(notes, { recursive: true })
mkdirSync(assets, { recursive: true })
mkdirSync(shots, { recursive: true })

const SCENE = `${JSON.stringify(
  {
    type: 'excalidraw',
    version: 2,
    source: 'desk-ssg-fixture',
    elements: [
      {
        id: 'text-1',
        type: 'text',
        x: 60,
        y: 200,
        width: 180,
        height: 30,
        angle: 0,
        strokeColor: '#1e1e1e',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 2,
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: 2,
        version: 1,
        versionNonce: 2,
        isDeleted: false,
        boundElements: null,
        updated: 2,
        link: null,
        locked: false,
        fontSize: 20,
        fontFamily: 5,
        text: '画布中文',
        textAlign: 'left',
        verticalAlign: 'top',
        containerId: null,
        originalText: '画布中文',
        lineHeight: 1.25
      },
      {
        id: 'rect-1',
        type: 'rectangle',
        x: 60,
        y: 40,
        width: 200,
        height: 120,
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
writeFileSync(join(assets, '0001-drawing.excalidraw'), SCENE)
writeFileSync(
  join(kb, 'tnotes.json'),
  `${JSON.stringify({ title: 'ssg-canvas', description: 'SSG canvas' }, null, 2)}\n`
)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. 画布\n')
writeFileSync(
  join(notes, '0001. 画布.md'),
  [
    '---',
    'id: 88888888-8888-4888-8888-888888888888',
    '---',
    '',
    '# 画布',
    '',
    '<Excalidraw path="../assets/0001-drawing.excalidraw" height="360" />',
    ''
  ].join('\n')
)

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.excalidraw': 'application/json',
  '.txt': 'text/plain; charset=utf-8'
}

/** 静态站点服务器：base '/'，把 URL 直接映射到 dist 目录。 */
function startServer(distRoot) {
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
    for (const candidate of [
      join(distRoot, pathname),
      join(distRoot, `${pathname}.html`),
      join(distRoot, pathname, 'index.html')
    ]) {
      try {
        if (statSync(candidate).isFile()) {
          response.writeHead(200, {
            'content-type': MIME[extname(candidate)] ?? 'application/octet-stream'
          })
          response.end(await readFile(candidate))
          return
        }
      } catch {
        /* try next */
      }
    }
    response.writeHead(404)
    response.end('not found')
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
  })
}

function listFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const next = join(dir, entry.name)
    if (entry.isDirectory()) listFiles(next, out)
    else out.push(next)
  }
  return out
}

async function main() {
  if (!existsSync(ssgEntry)) {
    record('前置：SSG 已构建', false, `未找到 ${ssgEntry}`)
    return
  }
  const { buildSite } = await import(pathToFileURL(ssgEntry).href)
  await buildSite(kb)
  const distRoot = join(kb, '.tnotes', 'dist')

  // 1) 字体随产物自包含
  const fontsDir = join(distRoot, 'excalidraw', 'fonts')
  const fontFiles = existsSync(fontsDir) ? listFiles(fontsDir) : []
  record(
    'SSG 产物自带 Excalidraw 官方字体（离线自包含）',
    fontFiles.some((file) => file.endsWith('.woff2')),
    `fonts=${fontFiles.length}`
  )

  // 2) 只读岛 + 正确的资源 URL
  const htmlFiles = listFiles(distRoot).filter((file) => file.endsWith('.html'))
  const pageFile = htmlFiles.find((file) =>
    readFileSync(file, 'utf8').includes('data-tn-island="excalidraw"')
  )
  const html = pageFile ? readFileSync(pageFile, 'utf8') : ''
  record(
    '站点 HTML：画布是只读岛，src 指向 base 下的源文件',
    html.includes('data-tn-island="excalidraw"') &&
      html.includes('data-src="/assets/0001-drawing.excalidraw"') &&
      html.includes('data-height="360"'),
    `page=${pageFile ? pageFile.slice(distRoot.length) : '(none)'}`
  )
  record(
    '关闭 JS 时是占位提示（第一版客户端渲染边界）',
    html.includes('需要启用 JavaScript') || html.includes('tn-excalidraw-island'),
    ''
  )

  // 3) .excalidraw 复制进产物；不生成派生 svg/png
  record(
    '产物复制 .excalidraw 源文件，不生成派生 svg/png',
    existsSync(join(distRoot, 'assets', '0001-drawing.excalidraw')) &&
      !existsSync(join(distRoot, 'assets', '0001-drawing.svg')) &&
      !existsSync(join(distRoot, 'assets', '0001-drawing.png'))
  )
  record(
    '源知识库没有新增派生资源',
    readdirSync(assets).sort().join(',') === '0001-drawing.excalidraw'
  )

  // 4) 产物不含用户机器路径
  const leaked = listFiles(distRoot).filter((file) => {
    const text = readFileSync(file)
    return text.includes(fixture) || text.includes('/Users/') || text.includes(repoRoot)
  })
  record(
    '产物与应用源码不含用户机器路径',
    leaked.length === 0,
    leaked
      .slice(0, 3)
      .map((file) => file.slice(distRoot.length))
      .join(' | ')
  )

  // 4b) dev 模式：源文件改动后站点读到的是新内容（静态部署则按发布内容）
  const { createDevServer } = await import(pathToFileURL(ssgEntry).href)
  const devServer = await createDevServer(kb, { port: 0 })
  try {
    const address = devServer.httpServer?.address()
    const devPort = typeof address === 'object' && address ? address.port : 0
    const devBase = devServer.config.base ?? '/'
    const sourceUrl = `http://127.0.0.1:${devPort}${devBase}assets/0001-drawing.excalidraw`
    const firstRead = await fetch(sourceUrl).then((response) => response.text())
    const updatedScene = SCENE.replace('"seed": 1', '"seed": 7')
    writeFileSync(join(assets, '0001-drawing.excalidraw'), updatedScene)
    const secondRead = await fetch(sourceUrl).then((response) => response.text())
    writeFileSync(join(assets, '0001-drawing.excalidraw'), SCENE)
    record(
      'dev 预览随源文件变化更新（不是构建时快照）',
      firstRead.includes('"seed": 1') && secondRead.includes('"seed": 7'),
      `first=${firstRead.includes('"seed": 1')} second=${secondRead.includes('"seed": 7')}`
    )
  } finally {
    await devServer.close()
  }

  // 5) 真实 Chromium：岛的 SVG 渲染出来、外部请求 0
  const { chromium } = await import('playwright-core')
  const cachedChromium = [
    '/Users/huyouda/Library/Caches/ms-playwright/chromium-1187/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    '/Users/huyouda/Library/Caches/ms-playwright/chromium_headless_shell-1187/chrome-headless-shell-mac-arm64/chrome-headless-shell'
  ].find((candidate) => existsSync(candidate))
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    ...(cachedChromium ? { executablePath: cachedChromium } : {})
  })
  const { server, port } = await startServer(distRoot)
  const pageErrors = []
  const externalRequests = []
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    page.on('pageerror', (error) => pageErrors.push(String(error.message ?? error)))
    page.on('request', (request) => {
      const url = request.url()
      if (!url.startsWith('http://127.0.0.1')) externalRequests.push(url)
    })
    if (!pageFile) throw new Error('产物里没有包含画布岛的页面')
    await page.goto(`http://127.0.0.1:${port}${pageFile.slice(distRoot.length)}`, {
      waitUntil: 'domcontentloaded'
    })
    const rendered = await page
      .waitForSelector('.tn-excalidraw-island[data-state="ready"] img', { timeout: 60000 })
      .then(() => true)
      .catch(() => false)
    const image = await page.evaluate(() => {
      const img = document.querySelector('.tn-excalidraw-island img')
      return {
        src: img?.getAttribute('src') ?? '',
        naturalWidth: img?.naturalWidth ?? 0,
        length: img?.getAttribute('src')?.length ?? 0
      }
    })
    record(
      '站点画布：客户端读源文件并导出可见 SVG',
      Boolean(rendered) && image.src.startsWith('data:image/svg+xml') && image.naturalWidth > 0,
      JSON.stringify({
        prefix: image.src.slice(0, 26),
        naturalWidth: image.naturalWidth,
        length: image.length
      })
    )
    record(
      '站点画布：渲染过程无外部请求（字体也在本地）',
      externalRequests.length === 0,
      externalRequests.slice(0, 2).join(' | ')
    )
    record('站点画布：无页面错误', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '))
    await page.screenshot({ path: join(shots, 'site-canvas.png') })

    // 无 JS：应看到占位提示
    const noJsContext = await browser.newContext({ javaScriptEnabled: false })
    const noJsPage = await noJsContext.newPage()
    await noJsPage.goto(`http://127.0.0.1:${port}${pageFile.slice(distRoot.length)}`, {
      waitUntil: 'domcontentloaded'
    })
    const placeholderText = await noJsPage.locator('.tn-excalidraw-island').innerText()
    record(
      '关闭 JS：显示占位提示而不是空白',
      placeholderText.includes('JavaScript'),
      JSON.stringify(placeholderText.slice(0, 60))
    )
    await noJsContext.close()

    // 深浅主题：切到 dark 后重新导出，两份都自包含（字体内联，无外部引用）
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await page.waitForTimeout(1200)
    const darkImage = await page.evaluate(() => {
      const img = document.querySelector('.tn-excalidraw-island img')
      return { src: img?.getAttribute('src') ?? '', naturalWidth: img?.naturalWidth ?? 0 }
    })
    const darkSvg = decodeURIComponent(darkImage.src)
    const externalRefs = [...darkSvg.matchAll(/(?:url\(|href=")([^"')]+)/g)]
      .map((match) => match[1])
      .filter((url) => /^https?:\/\//.test(url) && !url.startsWith('http://www.w3.org/'))
    record(
      '深浅主题都有可见 SVG，且字体内联、无外部引用',
      darkImage.naturalWidth > 0 &&
        darkSvg !== decodeURIComponent(image.src) &&
        darkSvg.includes('data:font/woff2') &&
        externalRefs.length === 0,
      `darkWidth=${darkImage.naturalWidth} 外部引用=${externalRefs.length} 变了=${darkSvg !== decodeURIComponent(image.src)} 内联字体=${darkSvg.includes('data:font/woff2')} 长度=${darkSvg.length}/${decodeURIComponent(image.src).length}`
    )
    await page.screenshot({ path: join(shots, 'site-canvas-dark.png') })
  } finally {
    await browser.close().catch(() => {})
    await new Promise((resolve) => server.close(resolve))
  }
}

try {
  await main()
} catch (error) {
  record('运行未完成（未捕获异常）', false, String(error).split('\n')[0])
  throw error
} finally {
  if (!process.env.KEEP_FIXTURE) rmSync(fixture, { recursive: true, force: true })
  const passed = results.length > 0 && results.every((item) => item.ok)
  console.log(`\n${passed ? 'ALL PASS' : 'HAS FAILURES'}（${results.length} 项）`)
  console.log(`screenshots: ${shots}`)
  process.exitCode = passed ? 0 : 1
}
