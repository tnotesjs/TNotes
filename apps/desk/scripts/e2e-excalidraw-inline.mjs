// E5 笔记内嵌画布：卡片 → 就地编辑 → 全屏 → 标签页，以及源码保真。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-excalidraw-inline.mjs
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-canvas-inline-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'canvas-inline')
const notes = join(kb, 'notes')
const assets = join(kb, 'assets')
const canvasPath = join(assets, '0001-drawing.excalidraw')
const notePath = join(notes, '0001. 画布组件.md')
const brokenNotePath = join(notes, '0002. 坏组件.md')
const shots = join(deskDir, 'scripts', 'shots', 'excalidraw-inline')
mkdirSync(notes, { recursive: true })
mkdirSync(assets, { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

const SCENE = `${JSON.stringify(
  {
    type: 'excalidraw',
    version: 2,
    source: 'desk-inline-fixture',
    elements: [
      {
        id: 'rect-1',
        type: 'rectangle',
        x: 80,
        y: 60,
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
writeFileSync(canvasPath, SCENE)
writeFileSync(
  join(kb, 'tnotes.json'),
  `${JSON.stringify({ name: 'canvas-inline', title: 'canvas-inline' }, null, 2)}\n`
)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. 画布组件\n- [ ] 0002. 坏组件\n')
const NOTE_BODY = [
  '---',
  'id: 11111111-1111-4111-8111-111111111111',
  '---',
  '',
  '# 画布组件',
  '',
  '组件上方段落。',
  '',
  '<Excalidraw path="../assets/0001-drawing.excalidraw" />',
  '',
  '组件下方段落。',
  ''
].join('\n')
writeFileSync(notePath, NOTE_BODY)
writeFileSync(
  brokenNotePath,
  [
    '---',
    'id: 22222222-2222-4222-8222-222222222222',
    '---',
    '',
    '# 坏组件',
    '',
    '<Excalidraw path="../assets/0002-missing.excalidraw" />',
    ''
  ].join('\n')
)
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
const readNote = (path = notePath) => readFileSync(path, 'utf8')
const countElements = (path = canvasPath) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8')).elements.length
  } catch {
    return -1
  }
}

async function waitFor(check, timeoutMs = 8000, intervalMs = 120) {
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

  const card = page.locator('.desk-excalidraw:visible').first()
  const cardIn = (selector) => card.locator(selector)
  const openNote = async (label) => {
    await page.locator('.toc-row', { hasText: label }).first().click()
    await page.waitForTimeout(600)
  }
  const activePane = () => page.locator('.editor-group .tab-content:visible .milkdown').first()
  const inlineCanvas = () =>
    page.locator('.desk-excalidraw:visible .excalidraw__canvas.interactive')
  const drawRectangle = async (offset = 0) => {
    await page
      .locator('.desk-excalidraw:visible [data-testid="toolbar-rectangle"]')
      .first()
      .click({ force: true })
    const box = await inlineCanvas().boundingBox()
    const x = box.x + box.width * 0.5 + offset
    const y = box.y + box.height * 0.3 + offset
    await page.mouse.move(x, y, { steps: 4 })
    await page.waitForTimeout(150)
    await page.mouse.down()
    await page.waitForTimeout(100)
    for (let step = 1; step <= 4; step += 1) {
      await page.mouse.move(x + step * 26, y + step * 16)
      await page.waitForTimeout(80)
    }
    await page.mouse.up()
  }

  await page.getByText('canvas-inline', { exact: true }).first().click()
  await page.waitForTimeout(1200)
  await openNote('画布组件')
  await activePane().waitFor({ timeout: 30000 })

  // 1) 只读卡片：共享 SVG 组件，不挂编辑器、不写文件
  const noteBefore = readNote()
  const svgReady = await waitFor(
    async () =>
      (await cardIn('.desk-excalidraw__svg img').count()) === 1 &&
      (await card.getAttribute('data-state')) === 'ready',
    20000
  )
  const svgInfo = await cardIn('.desk-excalidraw__svg img')
    .first()
    .evaluate((node) => ({
      src: node.getAttribute('src')?.slice(0, 24) ?? '',
      width: node.naturalWidth,
      height: node.naturalHeight
    }))
  record(
    '内嵌卡片：只读渲染共享 SVG（不挂编辑器）',
    Boolean(svgReady) &&
      svgInfo.src.startsWith('data:image/svg+xml') &&
      svgInfo.width > 0 &&
      (await inlineCanvas().count()) === 0,
    JSON.stringify(svgInfo)
  )
  record('只读卡片不改笔记字节', readNote() === noteBefore)
  await page.screenshot({ path: join(shots, 'card.png') })

  // 2) 点编辑 → 就地挂 E3 编辑器，SVG 让位
  await cardIn('[data-action="edit"]').click()
  await inlineCanvas().waitFor({ timeout: 60000 })
  await page.waitForTimeout(900)
  record(
    '点编辑：卡片就地出现编辑器（SVG 隐藏）',
    (await inlineCanvas().count()) === 1 &&
      (await cardIn('.desk-excalidraw__svg').isHidden()) &&
      (await cardIn('[data-action="done"]').isVisible())
  )
  await page.screenshot({ path: join(shots, 'editing.png') })

  // 3) 画一笔：只写 .excalidraw，不碰笔记源码
  await drawRectangle()
  const grew = await waitFor(() => countElements() === 2)
  record('就地编辑自动写盘：元素 1 → 2', Boolean(grew), `elements=${countElements()}`)
  await page.waitForTimeout(1200)
  record(
    '画布内容更新不序列化笔记：Markdown 字节不变',
    readNote() === noteBefore,
    readNote() === noteBefore ? '' : '笔记内容被改写了'
  )
  record(
    '键盘（Cmd+Z）由画布消费：撤销后元素回到 1，笔记仍不变',
    await (async () => {
      await page.keyboard.press('ControlOrMeta+z')
      const undone = await waitFor(() => countElements() === 1, 4000)
      return Boolean(undone) && readNote() === noteBefore
    })()
  )

  // 4) 结束编辑 → 回到卡片并按新内容重渲染
  await cardIn('[data-action="done"]').click()
  const backToCard = await waitFor(
    async () =>
      (await card.getAttribute('data-state')) === 'ready' && (await inlineCanvas().count()) === 0,
    20000
  )
  record('结束编辑：回到只读卡片并重新渲染 SVG', Boolean(backToCard))
  await page.screenshot({ path: join(shots, 'after-edit.png') })

  // 5) 全屏：CSS overlay + body 标记，退出后复原
  await cardIn('[data-action="fullscreen"]').click()
  await inlineCanvas().waitFor({ timeout: 60000 })
  await page.waitForTimeout(900)
  const fullscreenOn = await page.evaluate(() => ({
    cls: Boolean(document.querySelector('.desk-excalidraw.is-fullscreen')),
    attr: document.body.dataset.tnCanvasFs === '1'
  }))
  record(
    '全屏：卡片切 CSS overlay 并占住 body 标记',
    fullscreenOn.cls && fullscreenOn.attr,
    JSON.stringify(fullscreenOn)
  )
  await page.screenshot({ path: join(shots, 'fullscreen.png') })
  await page.keyboard.press('Escape')
  const fullscreenOff = await waitFor(
    async () =>
      (await page.locator('.desk-excalidraw.is-fullscreen').count()) === 0 &&
      (await page.evaluate(() => document.body.dataset.tnCanvasFs)) === undefined,
    5000
  )
  record('Esc 退出全屏：class 与 body 标记都清掉', Boolean(fullscreenOff))

  // 5b) 全屏互斥：Mindmap 抢全屏时画布退出全屏；画布进全屏时请 Mindmap 先退出
  await cardIn('[data-action="fullscreen"]').click()
  await inlineCanvas().waitFor({ timeout: 60000 })
  await page.waitForTimeout(700)
  const peerExit = await page.evaluate(() => {
    const peer = document.createElement('div')
    peer.className = 'mindmap-preview is-fullscreen'
    let forced = 0
    peer.addEventListener('tnotes-mindmap-force-exit-fullscreen', () => {
      forced += 1
      peer.classList.remove('is-fullscreen')
    })
    document.body.append(peer)
    return { forced: () => forced, className: () => peer.className }
  })
  await cardIn('[data-action="fullscreen"]').click()
  await page.waitForTimeout(300)
  await cardIn('[data-action="fullscreen"]').click()
  await page.waitForTimeout(400)
  const canvasFullscreenNow = await page.locator('.desk-excalidraw.is-fullscreen').count()
  const peerClassName = await page.evaluate(() => {
    const peer = document.querySelector('.mindmap-preview.is-fullscreen, .mindmap-preview')
    return peer?.className ?? ''
  })
  await page.evaluate(() => {
    document.body.dataset.tnMindmapFs = '1'
  })
  const canvasYielded = await waitFor(
    async () => (await page.locator('.desk-excalidraw.is-fullscreen').count()) === 0,
    5000
  )
  record(
    '全屏互斥：画布进全屏会请 Mindmap 退出，Mindmap 抢全屏时画布让位',
    canvasFullscreenNow === 1 && !peerClassName.includes('is-fullscreen') && Boolean(canvasYielded),
    `peer="${peerClassName}" canvasFullscreen=${canvasFullscreenNow} yielded=${Boolean(canvasYielded)} forced=${JSON.stringify(peerExit)}`
  )
  await page.evaluate(() => {
    delete document.body.dataset.tnMindmapFs
    document.querySelector('.mindmap-preview')?.remove()
  })

  // 5d) 画布激活时滚轮只由画布消费，不滚动笔记
  const noteScroller = () =>
    page.evaluate(() => {
      const host = document.querySelector('.tab-content:not([hidden]) .milkdown')
      return host?.parentElement?.scrollTop ?? 0
    })
  await page.waitForTimeout(700)
  const scrollBefore = await noteScroller()
  const canvasBox = await inlineCanvas().boundingBox()
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2)
  await page.mouse.wheel(0, 240)
  await page.waitForTimeout(600)
  const scrollAfter = await noteScroller()
  record(
    '画布激活时滚轮只由画布消费（笔记不滚动）',
    scrollBefore === scrollAfter,
    `scroll ${scrollBefore} → ${scrollAfter}`
  )

  await cardIn('[data-action="done"]').click()
  await page.waitForTimeout(800)

  // 6) 高度写回：只改组件那一行，其它笔记字节不动
  const beforeHeight = readNote()
  await cardIn('[data-testid="desk-excalidraw-height"]').selectOption('640')
  const heightWritten = await waitFor(() => readNote().includes('height="640"'), 8000)
  const afterHeight = readNote()
  const beforeLines = beforeHeight.split('\n')
  const afterLines = afterHeight.split('\n')
  const changedLines = afterLines
    .map((line, index) => (line === beforeLines[index] ? null : index))
    .filter((index) => index != null)
  record(
    '改高度只改组件那一行（其它字节完全不动）',
    Boolean(heightWritten) &&
      afterLines.length === beforeLines.length &&
      changedLines.length === 1 &&
      /^<Excalidraw path=.* height="640" \/>$/.test(afterLines[changedLines[0]] ?? ''),
    `changed=${JSON.stringify(changedLines)}`
  )

  // 7) 在标签页打开：结束内嵌会话，同一文件只保留一个写者
  await cardIn('[data-action="tab"]').click()
  await waitFor(
    async () => (await page.locator('.tab', { hasText: '.excalidraw' }).count()) === 1,
    10000
  )
  await page.waitForTimeout(800)
  record(
    '在标签页打开：生成画布标签页且内嵌编辑已结束',
    (await page.locator('.tab', { hasText: '.excalidraw' }).count()) === 1
  )
  // 回到笔记标签：卡片此时提示「已在标签页打开」，不再开第二个会话
  await page.locator('.tab', { hasText: '画布组件' }).first().click()
  await page.waitForTimeout(600)
  await cardIn('[data-action="edit"]').click()
  await page.waitForTimeout(600)
  record(
    '同一文件已在标签页编辑时：卡片不再开第二个会话',
    (await inlineCanvas().count()) === 0 && (await card.innerText()).includes('已在标签页打开')
  )

  // 8) 只读视图 / 源码视图
  // 先回到编辑再切只读：编辑权必须交还，画布入口关掉
  // （画布标签页还开着，先关掉它才能拿回内嵌编辑权）
  await page.locator('.tab', { hasText: '.excalidraw' }).first().locator('.tab-close').click()
  await waitFor(
    async () => (await page.locator('.tab', { hasText: '.excalidraw' }).count()) === 0,
    10000
  )
  await page.locator('.tab', { hasText: '画布组件' }).first().click()
  await page.waitForTimeout(500)
  await cardIn('[data-action="edit"]').click()
  await inlineCanvas().waitFor({ timeout: 60000 })
  await page.waitForTimeout(600)
  const beforeReadonly = readNote()
  await page.getByRole('button', { name: '只读视图', exact: true }).first().click()
  await page.waitForTimeout(1000)
  record(
    '切只读视图：释放内嵌编辑权（编辑器卸载）且不改笔记',
    (await inlineCanvas().count()) === 0 && readNote() === beforeReadonly
  )
  const readonlyCard = await waitFor(
    async () =>
      (await card.getAttribute('data-state')) === 'ready' &&
      (await cardIn('.desk-excalidraw__svg img').count()) === 1,
    20000
  )
  const readonlyEditEntry = await page.evaluate(() => {
    const button = document.querySelector('.desk-excalidraw [data-action="edit"]')
    return {
      exists: Boolean(button),
      hidden: !button || button.hasAttribute('hidden'),
      display: button ? getComputedStyle(button).display : null
    }
  })
  record(
    '只读视图：显示 SVG 卡片且没有编辑入口',
    Boolean(readonlyCard) && readonlyEditEntry.hidden && readonlyEditEntry.display === 'none',
    `state=${await card.getAttribute('data-state')} imgs=${await cardIn('.desk-excalidraw__svg img').count()} edit=${JSON.stringify(readonlyEditEntry)}`
  )

  // 回到可视化编辑，验证「删除选中图形只动画布内容」
  await page.getByRole('button', { name: '可视化编辑', exact: true }).first().click()
  await page.waitForTimeout(800)
  await cardIn('[data-action="edit"]').click()
  await inlineCanvas().waitFor({ timeout: 60000 })
  await page.waitForTimeout(600)
  // 5c) 删除选中图形只删画布内容：组件与资源文件都还在
  //     先画一笔把元素变成 2，再用画布内的「全选 + 删除」验证删除只作用于画布
  //     （缩放会改变场景→屏幕映射，所以这条要在滚轮用例之前做）
  const beforeDelete = readNote()
  const beforeDeleteCount = countElements()
  const deleteBox = await inlineCanvas().boundingBox()
  await page.mouse.click(deleteBox.x + deleteBox.width / 2, deleteBox.y + deleteBox.height / 2)
  await page.waitForTimeout(200)
  await page.keyboard.press('ControlOrMeta+a')
  await page.waitForTimeout(250)
  await page.keyboard.press('Delete')
  const shapeGone = await waitFor(() => countElements() === beforeDeleteCount - 1, 6000)
  record(
    '删除选中图形只动画布内容：组件与 .excalidraw 文件都保留',
    beforeDeleteCount === 1 &&
      Boolean(shapeGone) &&
      readNote() === beforeDelete &&
      existsSync(canvasPath),
    `删除前=${beforeDeleteCount} 删除后=${countElements()} 笔记不变=${readNote() === beforeDelete}`
  )

  await cardIn('[data-action="done"]').click()
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: '源码视图', exact: true }).first().click()
  await page.waitForTimeout(800)
  const sourceText = await page.locator('.cm-content:visible').first().innerText()
  record(
    '源码视图：显示组件源码，不渲染卡片',
    sourceText.includes('<Excalidraw path="../assets/0001-drawing.excalidraw"') &&
      (await page.locator('.desk-excalidraw').count()) === 0
  )
  // 6b) 删除组件不级联删除资源文件
  await page.locator('.cm-content:visible').first().click()
  await page.keyboard.press('ControlOrMeta+f')
  await page.waitForTimeout(400)
  const findInput = page.locator('.cm-search input, .cm-panel input').first()
  if (await findInput.count()) {
    await findInput.fill('Excalidraw path')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await page.keyboard.press('Home')
    await page.keyboard.press('Shift+End')
    await page.keyboard.press('Backspace')
    await page.waitForTimeout(900)
  }
  record(
    '删除组件不级联删除资源：.excalidraw 文件仍在',
    existsSync(canvasPath),
    `组件行还在=${readNote().includes('<Excalidraw')}`
  )
  await page.getByRole('button', { name: '可视化编辑', exact: true }).first().click()
  await page.waitForTimeout(600)

  // 9) 坏组件：给出可读错误，不崩
  await openNote('坏组件')
  await activePane().waitFor({ timeout: 30000 })
  const brokenCard = page.locator('.desk-excalidraw:visible').first()
  await brokenCard.waitFor({ timeout: 20000 })
  const brokenState = await waitFor(
    async () => (await brokenCard.getAttribute('data-state')) === 'error',
    20000
  )
  record(
    '坏组件（文件不存在）：显示可读错误而不是崩溃，也不创建文件',
    Boolean(brokenState) &&
      (await brokenCard.locator('.desk-excalidraw__placeholder').textContent())?.includes(
        'assets/'
      ) === true &&
      !existsSync(join(assets, '0002-missing.excalidraw')),
    `state=${await brokenCard.getAttribute('data-state')} placeholder=${JSON.stringify(
      await brokenCard.locator('.desk-excalidraw__placeholder').textContent()
    )} created=${existsSync(join(assets, '0002-missing.excalidraw'))}`
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
