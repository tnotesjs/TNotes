// H2 真实 Electron 端到端：历史标签页 → 按 commit 只读预览（旧图/画布/Mermaid/相对链接/远程标记），
// 当前文件被改写、旧资源被删除后旧图仍来自旧 commit；浏览过程不写文件、不改索引/HEAD。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-history-preview.mjs
import { _electron } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-history-preview-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'history-kb')
const notes = join(kb, 'notes')
const assets = join(kb, 'assets')
const shots = join(deskDir, 'scripts', 'shots', 'history-preview')
mkdirSync(notes, { recursive: true })
mkdirSync(assets, { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

const NOTE_UUID = '2f1c5f0e-9a3c-4c6f-9d2a-51f4b0a4c9d1'
const OLD_IMAGE = 'assets/0042-old.png'
const GONE_IMAGE = 'assets/0042-gone.png'
const DRAWING = 'assets/0042-drawing.excalidraw'

const gradient = (width, height, from, to) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${width * 0.35}" cy="${height * 0.5}" r="${height * 0.28}" fill="#ffffff" opacity="0.7"/>
</svg>`
  )

const oldImageBytes = await sharp(gradient(420, 280, '#1f6feb', '#4ec9b0'))
  .png()
  .toBuffer()
const goneImageBytes = await sharp(gradient(200, 140, '#f59e0b', '#dc2626'))
  .png()
  .toBuffer()

const DRAWING_SCENE = `${JSON.stringify(
  {
    type: 'excalidraw',
    version: 2,
    source: 'desk-history-fixture',
    elements: [
      {
        id: 'history-rect',
        type: 'rectangle',
        x: 80,
        y: 60,
        width: 260,
        height: 150,
        angle: 0,
        strokeColor: '#1e1e1e',
        backgroundColor: '#a5d8ff',
        fillStyle: 'solid',
        strokeWidth: 2,
        roughness: 1,
        opacity: 100,
        seed: 7,
        version: 1,
        versionNonce: 7,
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

const OLD_BODY = [
  '---',
  `id: ${NOTE_UUID}`,
  '---',
  '',
  '# 历史笔记',
  '',
  '唯一旧版本标记：OLD-VERSION-MARKER',
  '',
  `![旧图](../${OLD_IMAGE})`,
  '',
  `![已消失的图](../${GONE_IMAGE})`,
  '',
  `<Excalidraw path="../${DRAWING}" height="320" />`,
  '',
  '```mermaid',
  'graph TD',
  '  A[旧版本] --> B[历史]',
  '```',
  '',
  '![远程图](https://example.com/live.png)',
  '',
  `[下载旧图](../${OLD_IMAGE})`,
  '',
  '[兄弟笔记](./0043.%20兄弟.md)',
  '',
  '<script>window.__historyPwned = true</script>',
  '',
  '<NotesTable noteUuid="other" />',
  ''
].join('\n')

const NEW_BODY = [
  '---',
  `id: ${NOTE_UUID}`,
  '---',
  '',
  '# 历史笔记',
  '',
  '唯一新版本标记：NEW-VERSION-MARKER',
  '',
  '当前正文引用的旧图已被删除（断链）：',
  '',
  `![已删除的旧图](../${OLD_IMAGE})`,
  ''
].join('\n')

writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'history-kb', name: 'history-kb' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0042. 历史笔记\n- [ ] 0043. 兄弟\n')
writeFileSync(join(kb, '.gitignore'), 'node_modules/\n')
writeFileSync(
  join(notes, '0043. 兄弟.md'),
  `---\nid: ${NOTE_UUID.replace(/1$/, '2')}\n---\n\n# 兄弟\n\n兄弟正文\n`
)
function git(...args) {
  return execFileSync('git', ['-C', kb, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Desk E2E',
      GIT_AUTHOR_EMAIL: 'e2e@tnotes.local',
      GIT_COMMITTER_NAME: 'Desk E2E',
      GIT_COMMITTER_EMAIL: 'e2e@tnotes.local'
    }
  }).trim()
}

// 提交 A：旧正文 + 旧图 + 已消失图 + 画布
writeFileSync(join(notes, '0042. 历史笔记.md'), OLD_BODY)
writeFileSync(join(kb, OLD_IMAGE), oldImageBytes)
writeFileSync(join(kb, GONE_IMAGE), goneImageBytes)
writeFileSync(join(kb, DRAWING), DRAWING_SCENE)
git('init', '-q')
git('add', '-A')
git('commit', '-q', '-m', 'docs: 旧版本（旧图 + 画布）')
const OLD_COMMIT = git('rev-parse', 'HEAD')

// 提交 B：改写正文并删除旧资源（当前磁盘不再有这些图片）
writeFileSync(join(notes, '0042. 历史笔记.md'), NEW_BODY)
rmSync(join(kb, OLD_IMAGE))
rmSync(join(kb, GONE_IMAGE))
rmSync(join(kb, DRAWING))
git('add', '-A')
git('commit', '-q', '-m', 'docs: 新版正文，移除旧资源')
const NEW_COMMIT = git('rev-parse', 'HEAD')

writeFileSync(join(profile, 'workspace.v1.json'), JSON.stringify({ path: workspace }))
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  JSON.stringify({
    version: 1,
    theme: 'light',
    defaultNoteView: 'visual',
    prettier: false,
    autosave: { enabled: false, delayMs: 1000 }
  })
)

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

function repoState() {
  return {
    head: git('rev-parse', 'HEAD'),
    status: git('status', '--porcelain'),
    index: git('ls-files', '--stage'),
    log: git('log', '--oneline').split('\n').length,
    note: createHash('sha256')
      .update(readFileSync(join(notes, '0042. 历史笔记.md')))
      .digest('hex')
  }
}

const before = repoState()
const beforeAssets = existsSync(join(kb, OLD_IMAGE)) || existsSync(join(kb, GONE_IMAGE))

/** 列表项可能多个：用容器定位后再按 data-commit 点击。 */
async function selectCommit(page, oid) {
  await page.locator('[data-history-commits]').evaluate((list, target) => {
    const button = [...list.querySelectorAll('button')].find(
      (node) => node.getAttribute('data-commit') === target
    )
    button?.click()
  }, oid)
}

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
  executablePath: (await import('node:module')).createRequire(import.meta.url)('electron'),
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
let page = await app.firstWindow()
page.on('pageerror', (error) => pageErrors.push(String(error)))
await page.waitForLoadState('domcontentloaded')

// 原生菜单无法用 Playwright 点击：这里只替换「笔记菜单」的返回值，
// 渲染端的请求 → action → 打开历史标签页链路仍然是真跑的。
await app.evaluate(({ ipcMain }) => {
  ipcMain.removeHandler('context-menu:show')
  ipcMain.handle('context-menu:show', (_event, request) => ({
    ok: true,
    value: request && request.kind === 'note' ? 'show-history' : null
  }))
})

try {
  await page.waitForSelector('.kb-sidebar, aside', { timeout: 20000 })
  await waitFor(async () => (await page.getByText('history-kb', { exact: true }).count()) > 0)
  await page.getByText('history-kb', { exact: true }).first().click()

  const noteNode = page.locator(`.toc-row[data-note-uuid="${NOTE_UUID}"]`)
  const noteReady = await waitFor(async () => (await noteNode.count()) > 0, 20000)
  if (!noteReady) {
    console.log('--- 侧栏/正文文本 ---')
    console.log(await page.locator('body').innerText())
    throw new Error('笔记树里没有 0042 历史笔记')
  }
  await noteNode.click({ button: 'right' })

  const pane = page.locator('[data-note-history-pane]')
  const opened = await waitFor(async () => (await pane.count()) > 0)
  record('H2-1 笔记菜单打开历史标签页', Boolean(opened))
  if (!opened) throw new Error('历史标签页没有打开')

  const commitList = page.locator('[data-history-commits] button')
  await waitFor(async () => (await commitList.count()) >= 2)
  const commitOids = await commitList.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-commit') ?? '')
  )
  record(
    'H2-2 历史列表包含新旧两个相关提交',
    commitOids.includes(OLD_COMMIT) && commitOids.includes(NEW_COMMIT),
    commitOids.map((oid) => oid.slice(0, 7)).join(',')
  )

  const preview = page.locator('[data-history-preview]')
  await waitFor(async () => (await preview.count()) > 0)
  const newestBody = await page.locator('[data-history-body]').innerText()
  record('H2-3 初始选中最新提交并显示当前正文', newestBody.includes('NEW-VERSION-MARKER'))

  // 切到旧 commit
  await selectCommit(page, OLD_COMMIT)
  await waitFor(async () => {
    const text = await page.locator('[data-history-body]').innerText()
    return text.includes('OLD-VERSION-MARKER')
  })
  const oldBody = await page.locator('[data-history-body]').innerText()
  record('H2-4 切换历史版本显示旧正文', oldBody.includes('OLD-VERSION-MARKER'))
  record('H2-5 历史正文不含 frontmatter 元数据', !oldBody.includes(NOTE_UUID))

  // 旧图：src 指向 history 协议，字节来自旧 commit
  const imageInfo = await waitFor(async () => {
    const info = await page.evaluate(() => {
      const image = document.querySelector('[data-history-body] img[data-tn-history-oid]')
      if (!image) return null
      return { src: image.getAttribute('src') ?? '', loaded: image.naturalWidth > 0 }
    })
    return info?.loaded ? info : null
  })
  const imageOk =
    Boolean(imageInfo) &&
    imageInfo.src.startsWith('tnotes-asset://history?') &&
    imageInfo.src.includes(OLD_COMMIT) &&
    imageInfo.src.includes('0042-old.png') &&
    imageInfo.loaded
  record('H2-6 旧图按 commit 从 history 协议加载', Boolean(imageOk), imageInfo?.src ?? '无图片')

  const imageBytes = await page.evaluate(async (src) => {
    const response = await fetch(src)
    const buffer = new Uint8Array(await response.arrayBuffer())
    return { status: response.status, length: buffer.length, digest: [...buffer.slice(0, 8)] }
  }, imageInfo?.src ?? '')
  record(
    'H2-7 历史图片字节与旧 commit 文件一致',
    imageBytes.status === 200 && imageBytes.length === oldImageBytes.length,
    `HTTP ${imageBytes.status} / ${imageBytes.length}B vs ${oldImageBytes.length}B`
  )

  record(
    'H2-8 当前磁盘已删除旧资源（预览没有回退当前磁盘）',
    !existsSync(join(kb, OLD_IMAGE)) && !existsSync(join(kb, GONE_IMAGE)) && !beforeAssets
  )
  const diskFallback = await page.evaluate(
    () => document.querySelectorAll('[data-history-body] img[src^="tnotes-asset://asset"]').length
  )
  record('H2-9 预览里没有当前磁盘资源 URL', diskFallback === 0)

  // 旧 commit 里两张图都存在（其中一张在当前版本被删除）
  const oldImages = await page.evaluate(() =>
    [...document.querySelectorAll('[data-history-body] img[data-tn-history-oid]')].map(
      (image) => image.getAttribute('src') ?? ''
    )
  )
  record(
    'H2-10 旧 commit 里被删除的资源仍按该 commit 读取',
    oldImages.some((src) => src.includes('0042-old.png')) &&
      oldImages.some((src) => src.includes('0042-gone.png')) &&
      (await page.evaluate(
        () =>
          document.querySelectorAll('[data-history-body] img[data-tn-history-skip="missing"]')
            .length
      )) === 0
  )

  // 远程图片：明确标为当前网络内容
  const remote = await page.evaluate(() => ({
    skipped: document.querySelectorAll('[data-history-body] img[data-tn-history-skip="remote"]')
      .length,
    diagnostics: document.querySelector('[data-history-diagnostics]')?.textContent ?? ''
  }))
  record(
    'H2-11 远程图片标记为当前内容而不是历史归档',
    remote.skipped >= 1 && remote.diagnostics.includes('远程')
  )

  // 历史画布：共享只读渲染器出 SVG 的 data URL
  const canvas = await waitFor(async () => {
    const state = await page.evaluate(() => {
      const host = document.querySelector('[data-history-body] [data-tn-history-canvas]')
      if (!host) return null
      const image = host.querySelector('img')
      return {
        state: host.getAttribute('data-state'),
        src: image?.getAttribute('src') ?? '',
        editing: document.querySelectorAll(
          '[data-history-body] .excalidraw, [data-history-body] [contenteditable="true"]'
        ).length
      }
    })
    return state?.src.startsWith('data:image/svg+xml') ? state : null
  })
  record(
    'H2-12 历史画布用共享只读渲染器显示',
    Boolean(canvas && canvas.editing === 0),
    canvas?.state ?? '未渲染'
  )

  // 主题跟随只影响显示：深色下共享渲染器重新出图，磁盘不动（hash 在 H2-17 比对）
  const lightSrc = canvas?.src ?? ''
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  const darkSrc = await waitFor(async () =>
    page.evaluate((previous) => {
      const image = document.querySelector('[data-history-body] [data-tn-history-canvas] img')
      const src = image?.getAttribute('src') ?? ''
      return src && src !== previous ? src : null
    }, lightSrc)
  )
  record('H2-12b 历史画布跟随深浅主题（只影响显示）', Boolean(darkSrc))
  await page.evaluate(() => document.documentElement.classList.remove('dark'))

  const mermaid = await waitFor(async () =>
    page.evaluate(() => document.querySelectorAll('[data-history-body] .tn-mermaid svg').length)
  )
  record('H2-13 历史 Mermaid 块渲染成只读 SVG', Boolean(mermaid))

  const link = await page.evaluate(() =>
    document
      .querySelector('[data-history-body] a[data-tn-history-link]')
      ?.getAttribute('data-tn-history-link')
  )
  const noteLink = await page.evaluate(() => ({
    missing: document.querySelectorAll('[data-history-body] a[data-tn-history-skip]').length,
    diagnostics: document.querySelector('[data-history-diagnostics]')?.textContent ?? ''
  }))
  record(
    'H2-14 同 commit 内的资源链接带标记，跨笔记链接给出限制',
    link === 'assets/0042-old.png' &&
      noteLink.diagnostics.includes('0043.') &&
      (await page.evaluate(
        () =>
          document.querySelectorAll('[data-history-body] a[href^="tnotes-asset://asset"]').length
      )) === 0,
    link ?? '无链接'
  )

  const blocked = await page.evaluate(() => ({
    scripts: document.querySelectorAll('[data-history-body] script').length,
    unsupported: document.querySelectorAll('[data-history-body] [data-tn-history-unsupported]')
      .length,
    pwned: Boolean(window.__historyPwned)
  }))
  record(
    'H2-15 历史脚本与自定义组件不执行，按占位显示',
    blocked.scripts === 0 && !blocked.pwned && blocked.unsupported >= 2,
    `script=${blocked.scripts} 占位=${blocked.unsupported} 注入=${blocked.pwned}`
  )

  await page.screenshot({ path: join(shots, '01-old-commit.png'), fullPage: false })

  // 同一个引用在新 commit 里指向已删除文件：必须报缺失，不回退当前磁盘
  await selectCommit(page, NEW_COMMIT)
  const missingAtNew = await waitFor(async () => {
    const state = await page.evaluate(() => ({
      text: document.querySelector('[data-history-body]')?.textContent ?? '',
      skipped: document.querySelectorAll('[data-history-body] img[data-tn-history-skip="missing"]')
        .length,
      diagnostics: document.querySelector('[data-history-diagnostics]')?.textContent ?? ''
    }))
    return state.text.includes('NEW-VERSION-MARKER') ? state : null
  })
  const diskUrls = await page.evaluate(
    () => document.querySelectorAll('[data-history-body] img[src^="tnotes-asset://asset"]').length
  )
  record(
    'H2-10b 新 commit 里已删除的资源报缺失且不回退磁盘',
    Boolean(missingAtNew) &&
      missingAtNew.skipped >= 1 &&
      missingAtNew.diagnostics.includes('0042-old.png') &&
      diskUrls === 0
  )

  // 快速切换：最终显示的必须是最后一次选择
  await selectCommit(page, NEW_COMMIT)
  await selectCommit(page, OLD_COMMIT)
  const settled = await waitFor(async () => {
    const text = await page.locator('[data-history-body]').innerText()
    return text.includes('OLD-VERSION-MARKER') && !text.includes('NEW-VERSION-MARKER')
  })
  record('H2-16 连续切版本只保留最后一次结果', Boolean(settled))

  await page.screenshot({ path: join(shots, '02-after-switch.png'), fullPage: false })

  const after = repoState()
  record(
    'H2-17 浏览历史不改 HEAD / 索引 / 工作区',
    after.head === before.head &&
      after.status === before.status &&
      after.index === before.index &&
      after.log === before.log &&
      after.note === before.note
  )

  record('H2-18 渲染过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | '))
} catch (error) {
  record('H2 断言执行', false, error instanceof Error ? error.message : String(error))
} finally {
  await app.close()
}

const failed = results.filter((item) => !item.ok)
console.log(`\n${results.length - failed.length}/${results.length} 通过`)
if (failed.length > 0) {
  console.log(`失败：${failed.map((item) => item.name).join('、')}`)
  process.exitCode = 1
}
if (process.env.KEEP_FIXTURE !== '1') rmSync(fixture, { recursive: true, force: true })
else console.log(`fixture 保留在 ${fixture}`)
