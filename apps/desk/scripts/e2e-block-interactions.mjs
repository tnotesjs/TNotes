// Runtime regression for todos 2026.08.29/0004-0011.
// The knowledge base and Electron profile are isolated under the OS temp dir.
import assert from 'node:assert/strict'
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const require = createRequire(import.meta.url)
const electronPath = require('electron')
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixtureRoot = mkdtempSync(join(tmpdir(), 'desk-block-interactions-e2e-'))
const workspace = join(fixtureRoot, 'workspace')
const profile = join(fixtureRoot, 'profile')
const kb = join(workspace, 'TNotes.block-e2e')
const noteFile = join(kb, 'notes', '0001. blocks.md')
const shots = join(deskDir, 'scripts', 'shots', 'block-interactions')

mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

writeFileSync(join(kb, 'tnotes.json'), `${JSON.stringify({ title: 'block-e2e' }, null, 2)}\n`)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. blocks\n')
writeFileSync(
  noteFile,
  `---\nid: 10000000-0000-4000-8000-000000000012\n---\n\n# Block interactions\n\n顶部段落\n\n组件上方\n\n<B id="selection-e2e" />\n\n组件下方\n\n${Array.from({ length: 28 }, (_, i) => `填充段落 ${i + 1}`).join('\n\n')}\n\n底部段落\n\n<br />\n\n<br />\n\n<br />\n\n::: footprints 2025-01-01 12:00\n\n足迹正文第一段。\n\n:::\n`
)
writeFileSync(
  join(profile, 'workspace.v1.json'),
  `${JSON.stringify({ path: workspace }, null, 2)}\n`
)
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  `${JSON.stringify({ version: 1, defaultNoteView: 'visual', theme: 'light' }, null, 2)}\n`
)

const app = await _electron.launch({
  executablePath: electronPath,
  args: ['out/main/index.js', `--user-data-dir=${profile}`],
  cwd: deskDir,
  timeout: 60000,
  env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: 'true' }
})
const originalClipboard = await app.evaluate(({ clipboard }) => clipboard.readText())

/** @param {import('playwright-core').Page} page @param {import('playwright-core').Locator} host @param {import('playwright-core').Locator} menu */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function assertMenuWithinViewport(page, host, menu) {
  const [hostBox, menuBox, viewport] = await Promise.all([
    host.boundingBox(),
    menu.boundingBox(),
    page.evaluate(() => ({ width: innerWidth, height: innerHeight }))
  ])
  assert.ok(hostBox)
  assert.ok(menuBox)
  const top = Math.max(0, hostBox.y) + 7
  const bottom = Math.min(viewport.height, hostBox.y + hostBox.height) - 7
  const left = 7
  const right = viewport.width - 7
  assert.ok(menuBox.y >= top, `menu top ${menuBox.y} must be >= ${top}`)
  assert.ok(menuBox.y + menuBox.height <= bottom, `menu bottom must be <= ${bottom}`)
  assert.ok(menuBox.x >= left, `menu left ${menuBox.x} must be >= ${left}`)
  assert.ok(menuBox.x + menuBox.width <= right, `menu right must be <= ${right}`)
  return { hostBox, menuBox, viewport }
}

try {
  const page = await app.firstWindow({ timeout: 30000 })
  await page.waitForLoadState('domcontentloaded')
  await page.setViewportSize({ width: 1080, height: 620 })
  await page.getByText('block-e2e', { exact: true }).first().waitFor({ timeout: 30000 })
  await page.getByText('block-e2e', { exact: true }).first().click()
  await page.getByText('blocks', { exact: true }).first().click()

  const host = page.locator('.milkdown-markdown-editor').first()
  const pm = page.locator('.milkdown .ProseMirror').first()
  const menu = page.locator('.milkdown-slash-menu')
  await pm.waitFor({ timeout: 30000 })

  // Consecutive standalone <br /> are Milkdown empty paragraphs, not desk raw atoms.
  const emptyParagraphCount = await pm.evaluate(
    (element) =>
      [...element.querySelectorAll(':scope > p')].filter(
        (paragraph) => (paragraph.textContent ?? '').trim() === ''
      ).length
  )
  assert.ok(emptyParagraphCount >= 3)
  console.log('✓ consecutive standalone <br /> render as empty paragraphs')

  await host.evaluate((element) => {
    element.scrollTop = 0
  })
  const topParagraph = pm.locator(':scope > p').first()
  await topParagraph.click({ clickCount: 3 })
  await page.keyboard.type('/')
  await menu.waitFor({ state: 'visible' })
  await page.waitForTimeout(320)
  const topMeasure = await assertMenuWithinViewport(page, host, menu)
  assert.ok(topMeasure.menuBox.height < 500)
  assert.ok(topMeasure.menuBox.width <= 342)
  const firstItems = menu.locator('li[data-index]')
  const [firstItemBox, secondItemBox] = await Promise.all([
    firstItems.nth(0).boundingBox(),
    firstItems.nth(1).boundingBox()
  ])
  assert.ok(firstItemBox)
  assert.ok(secondItemBox)
  assert.ok(Math.abs(firstItemBox.y - secondItemBox.y) < 2)
  assert.ok(secondItemBox.x > firstItemBox.x)
  const initialHover = Number(await menu.locator('li.hover').getAttribute('data-index'))
  await page.keyboard.press('ArrowDown')
  assert.equal(
    await menu.locator('li.hover').getAttribute('data-index'),
    String(Math.min((await firstItems.count()) - 1, initialHover + 2))
  )
  await page.keyboard.press('ArrowUp')
  assert.equal(await menu.locator('li.hover').getAttribute('data-index'), String(initialHover))
  await page.screenshot({ path: join(shots, '01-menu-top.png') })
  console.log('✓ slash menu stays inside the editor near the top')

  await page.keyboard.press('Escape')
  const bottomParagraph = pm.locator(':scope > p').last()
  await bottomParagraph.scrollIntoViewIfNeeded()
  await bottomParagraph.click()
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await page.keyboard.type('/')
  await menu.waitFor({ state: 'visible' })
  await page.waitForTimeout(320)
  await assertMenuWithinViewport(page, host, menu)
  await page.screenshot({ path: join(shots, '02-menu-bottom.png') })
  console.log('✓ slash menu stays inside the editor near the bottom')

  await page.setViewportSize({ width: 820, height: 430 })
  await page.waitForTimeout(120)
  const smallMeasure = await assertMenuWithinViewport(page, host, menu)
  const groupHeight = await menu.locator('.menu-groups').evaluate((element) => element.clientHeight)
  assert.ok(groupHeight < 420)
  assert.ok(smallMeasure.menuBox.height < smallMeasure.hostBox.height)
  await page.screenshot({ path: join(shots, '03-menu-small-window.png') })
  console.log('✓ small window limits the scrollable menu body and keeps the header visible')

  // 0005: whole-node selection from both keyboard directions and mouse.
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 1080, height: 620 })
  const raw = pm.locator('[data-type="desk-raw-block"][data-kind="raw-component"]').first()
  await raw.waitFor()
  const beforeRaw = raw.locator('xpath=preceding-sibling::p[1]')
  const afterRaw = raw.locator('xpath=following-sibling::p[1]')

  await beforeRaw.scrollIntoViewIfNeeded()
  await beforeRaw.click()
  await page.keyboard.press('End')
  await page.keyboard.press('Shift+ArrowDown')
  // 契约：Shift+方向键产出的是「块范围选择」（BlockRangeSelection），把整个 raw 块
  // 标成 .desk-raw-block--range-selected；`ProseMirror-selectednode` 只属于 NodeSelection
  // （无 Shift 的 ArrowDown / 鼠标点块，见本段末尾那条断言）。
  assert.equal(
    await raw.evaluate((element) => element.classList.contains('desk-raw-block--range-selected')),
    true
  )
  await page.screenshot({ path: join(shots, '04-block-selected-down.png') })
  console.log('✓ Shift+ArrowDown covers the complete raw block with a block range')

  await afterRaw.click()
  await page.keyboard.press('Home')
  await page.keyboard.press('Shift+ArrowUp')
  assert.equal(
    await raw.evaluate((element) => element.classList.contains('desk-raw-block--range-selected')),
    true
  )
  console.log('✓ Shift+ArrowUp covers the complete raw block with a block range')

  await afterRaw.click()
  // 鼠标选块的入口有两条：块上下边缘的边界热区（`.desk-raw-block__boundary-hit`）放
  // 「块前 / 块后光标」，点块体（非交互的预览区）仍然是整块选中。
  await raw
    .locator('.desk-raw-block__boundary-hit[data-side="after"]')
    .first()
    .click({ force: true })
  await page.waitForFunction(
    () => document.querySelector('.desk-block-boundary-caret')?.dataset.side === 'after'
  )
  assert.equal(
    await page.evaluate(
      () => document.querySelector('.desk-block-boundary-caret')?.dataset.side ?? null
    ),
    'after'
  )
  console.log('✓ clicking the raw block edge hit area places the block-after caret')

  // 0006: use the visible six-dot handle and real pointer movement.
  await raw.hover()
  const blockHandle = page.locator('.milkdown-block-handle[data-show="true"]')
  await blockHandle.waitFor()
  assert.equal(await blockHandle.locator('.operation-item:visible').count(), 1)
  assert.equal(await blockHandle.locator('.operation-item:first-child').isVisible(), false)
  const dragGrip = blockHandle.locator('.operation-item').nth(1)
  const dragTarget = pm.locator(':scope > p').filter({ hasText: '填充段落 2' }).first()
  const originalAfterElement = await afterRaw.elementHandle()
  assert.ok(originalAfterElement)
  const [gripBox, targetBox] = await Promise.all([dragGrip.boundingBox(), dragTarget.boundingBox()])
  assert.ok(gripBox)
  assert.ok(targetBox)
  await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height + 10, {
    steps: 16
  })
  await page.mouse.up()
  await page.waitForTimeout(180)
  let movedAfterTarget = await raw.evaluate(
    (element, target) =>
      Boolean(target.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING),
    originalAfterElement
  )
  if (!movedAfterTarget) {
    // Chromium occasionally never promotes an automated mouse move to native
    // HTML-DnD（并发跑时 CPU 竞争会让这个概率变高）。重试同一条浏览器拖拽事件链，
    // 它仍然走 Milkdown 真实的 DataTransfer/slice/drop/dragend 处理；失败就再等一拍重来。
    for (let attempt = 1; attempt <= 3 && !movedAfterTarget; attempt += 1) {
      await page.waitForTimeout(150)
      await raw.hover()
      await blockHandle.waitFor()
      const handleElement = await blockHandle.elementHandle()
      const dropElement = await dragTarget.elementHandle()
      assert.ok(handleElement)
      assert.ok(dropElement)
      await page.evaluate(
        ({ handle, target }) => {
          const dataTransfer = new DataTransfer()
          const handleRect = handle.getBoundingClientRect()
          const targetRect = target.getBoundingClientRect()
          const common = {
            bubbles: true,
            cancelable: true,
            clientX: targetRect.left + targetRect.width / 2,
            clientY: targetRect.bottom - 1,
            dataTransfer
          }
          handle.dispatchEvent(
            new MouseEvent('mousedown', {
              bubbles: true,
              clientX: handleRect.left + handleRect.width / 2,
              clientY: handleRect.top + handleRect.height / 2
            })
          )
          handle.dispatchEvent(new DragEvent('dragstart', common))
          target.dispatchEvent(new DragEvent('dragenter', common))
          target.dispatchEvent(new DragEvent('dragover', common))
          target.dispatchEvent(new DragEvent('drop', common))
          handle.dispatchEvent(new DragEvent('dragend', common))
        },
        { handle: handleElement, target: dropElement }
      )
      await page.waitForTimeout(180)
      movedAfterTarget = await raw.evaluate(
        (element, target) =>
          Boolean(target.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING),
        originalAfterElement
      )
    }
  }
  assert.equal(movedAfterTarget, true, '六点手柄拖拽后块应落到目标之后')
  assert.equal(await pm.getAttribute('data-dragging'), 'false')
  await page.screenshot({ path: join(shots, '05-block-dragged.png') })
  await page.waitForTimeout(400)
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(220)
  const savedAfterDrag = readFileSync(noteFile, 'utf8')
  assert.equal((savedAfterDrag.match(/<B id="selection-e2e" \/>/g) ?? []).length, 1)
  const domOrder = await pm.evaluate((element) =>
    [...element.children]
      .map((child) => {
        const text = child.textContent?.trim() ?? ''
        if (text.includes('selection-e2e')) return 'B'
        if (text === '组件上方') return '组件上方'
        if (text === '组件下方') return '组件下方'
        if (text === '填充段落 1') return '填充段落 1'
        if (text === '填充段落 2') return '填充段落 2'
        return null
      })
      .filter((value) => value !== null)
  )
  const sourceMarkers = ['组件上方', '组件下方', '填充段落 1', '填充段落 2']
  const savedOrder = [...sourceMarkers, 'B']
    .map((marker) => ({
      marker,
      offset:
        marker === 'B'
          ? savedAfterDrag.indexOf('<B id="selection-e2e" />')
          : savedAfterDrag.indexOf(marker)
    }))
    .sort((left, right) => left.offset - right.offset)
    .map(({ marker }) => marker)
  assert.deepEqual(domOrder, savedOrder)
  assert.ok(savedOrder.indexOf('B') > savedOrder.indexOf('填充段落 2'))
  console.log('✓ six-dot pointer drag moves the complete raw block and clears drag state')

  // 0007: mouse edge hits place the boundary caret; Delete/Backspace remove the block; Undo restores.
  await raw.locator('.desk-raw-block__boundary-hit[data-side="before"]').click()
  await page.waitForFunction(
    () => document.querySelector('.desk-block-boundary-caret')?.dataset.side === 'before'
  )
  await page.screenshot({ path: join(shots, '06-block-selected-from-before-hit.png') })
  await page.keyboard.press('Delete')
  assert.equal(await raw.count(), 0)
  await page.keyboard.press('Meta+Z')
  await raw.waitFor()
  console.log('✓ mouse before-hit + Delete removes the whole block and Undo restores it')

  await raw.locator('.desk-raw-block__boundary-hit[data-side="after"]').click()
  await page.waitForFunction(
    () => document.querySelector('.desk-block-boundary-caret')?.dataset.side === 'after'
  )
  await page.screenshot({ path: join(shots, '07-block-selected-from-after-hit.png') })
  await page.keyboard.press('Backspace')
  assert.equal(await raw.count(), 0)
  await page.keyboard.press('Meta+Z')
  await raw.waitFor()
  console.log('✓ mouse after-hit + Backspace removes the whole block and Undo restores it')

  // 0008: short-click menu, presentation action and canonical clipboard.
  await page.setViewportSize({ width: 1500, height: 800 })
  await raw.scrollIntoViewIfNeeded()
  await raw.hover()
  await page.waitForTimeout(260)
  await blockHandle.waitFor()
  await blockHandle.locator('.operation-item').nth(1).click()
  const actionMenu = page.getByRole('menu', { name: '块操作' })
  await actionMenu.waitFor()
  const actionMenuBox = await actionMenu.boundingBox()
  const viewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }))
  assert.ok(actionMenuBox)
  assert.ok(actionMenuBox.x >= 8 && actionMenuBox.x + actionMenuBox.width <= viewport.width - 8)
  assert.ok(actionMenuBox.y >= 8 && actionMenuBox.y + actionMenuBox.height <= viewport.height - 8)
  assert.equal(await actionMenu.getByRole('menuitem', { name: /缩进/ }).count(), 0)
  assert.equal(await actionMenu.getByRole('menuitem', { name: /复制链接/ }).count(), 0)
  assert.equal(await actionMenu.getByRole('menuitem', { name: /全宽显示/ }).count(), 0)
  await page.screenshot({ path: join(shots, '08-block-action-menu.png') })
  await actionMenu.getByRole('menuitem', { name: '复制', exact: true }).click()
  await actionMenu.waitFor({ state: 'detached' })
  assert.equal(
    await app.evaluate(({ clipboard }) => clipboard.readText()),
    '<B id="selection-e2e" />'
  )
  console.log(
    '✓ short click opens a viewport-safe menu; removed actions stay absent and canonical copy works'
  )

  await raw.hover()
  await page.waitForTimeout(260)
  await blockHandle.waitFor()
  await blockHandle.locator('.operation-item').nth(1).click()
  await actionMenu.waitFor()
  await actionMenu.getByRole('menuitem', { name: /在下方添加/ }).hover()
  await menu.waitFor({ state: 'visible' })
  await page.waitForTimeout(320)
  assert.equal(await actionMenu.isVisible(), true)
  const [primaryBox, secondaryBox] = await Promise.all([
    actionMenu.boundingBox(),
    menu.boundingBox()
  ])
  assert.ok(primaryBox)
  assert.ok(secondaryBox)
  assert.equal(
    secondaryBox.x >= primaryBox.x + primaryBox.width + 7 ||
      primaryBox.x >= secondaryBox.x + secondaryBox.width + 7,
    true
  )
  await page.screenshot({ path: join(shots, '09-add-below-submenu.png') })
  await menu.locator('li[data-index]').filter({ hasText: '提示块' }).click()
  await actionMenu.waitFor({ state: 'detached' })
  const addedCallout = pm.locator('[data-type="desk-callout"][data-callout="tip"]').last()
  await addedCallout.waitFor()
  // 提示块插的是结构化 callout 节点（tip/info/warning/danger 不再投影成 raw container），
  // 它没有 data-source；canonical Markdown 以磁盘写回为准来断言。
  assert.equal(await addedCallout.getAttribute('data-title'), '💡 TIP')
  assert.equal(await addedCallout.getAttribute('data-open-colons'), ':::')
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(400)
  assert.match(readFileSync(noteFile, 'utf8'), /::: tip 💡 TIP/)
  const doneButton = page.getByRole('button', { name: '完成', exact: true })
  if (await doneButton.count()) await doneButton.last().click()
  console.log('✓ add-below hover opens the real slash submenu and inserts after the block')

  await raw.hover()
  await page.waitForTimeout(260)
  await blockHandle.waitFor()
  await blockHandle.locator('.operation-item').nth(1).click()
  await actionMenu.waitFor()
  await actionMenu.getByRole('menuitem', { name: '剪切', exact: true }).click()
  await actionMenu.waitFor({ state: 'detached' })
  assert.equal(await raw.count(), 0)
  assert.equal(
    await app.evaluate(({ clipboard }) => clipboard.readText()),
    '<B id="selection-e2e" />'
  )
  await page.keyboard.press('Meta+Z')
  await raw.waitFor()
  console.log('✓ cut copies canonical Markdown, removes the whole block, and remains undoable')

  // 2026-08-29 dark-theme follow-up: verify actual computed contrast for the
  // icon system, text caret and drag indicator instead of relying on CSS text.
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark'
  })
  await page.waitForTimeout(120)

  await raw.scrollIntoViewIfNeeded()
  await raw.hover()
  await page.waitForTimeout(260)
  await blockHandle.waitFor()
  await blockHandle.locator('.operation-item').nth(1).click()
  await actionMenu.waitFor()
  const darkActionStyles = await actionMenu.evaluate((element) => {
    const background = getComputedStyle(element).backgroundColor
    const icons = [...element.querySelectorAll('svg')].map((icon) => getComputedStyle(icon).color)
    return { background, icons }
  })
  // 期望值来自共享 token：暗色 --tn-c-bg-soft=#202127（--panel）、--tn-c-text=#dfdfd6
  // （--editor-text，菜单 color: inherit、图标 currentColor）。见 packages/ui/src/styles/tokens.css:53-54。
  assert.equal(darkActionStyles.background, 'rgb(32, 33, 39)')
  assert.equal(
    darkActionStyles.icons.every((color) => color === 'rgb(223, 223, 214)'),
    true
  )
  await page.screenshot({ path: join(shots, '10-dark-action-menu.png') })
  console.log('✓ dark block-menu icons use the high-contrast foreground token')

  await actionMenu.getByRole('menuitem', { name: /在下方添加/ }).hover()
  await menu.waitFor({ state: 'visible' })
  const darkSlashStyles = await menu.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    icons: [...element.querySelectorAll('.menu-group li svg')].map((icon) => ({
      color: getComputedStyle(icon).color,
      fill: getComputedStyle(icon).fill,
      stroke: getComputedStyle(icon).stroke
    }))
  }))
  // 同上：暗色 --tn-c-bg-soft=#202127（--panel）→ rgb(32, 33, 39)
  assert.equal(darkSlashStyles.background, 'rgb(32, 33, 39)')
  assert.ok(darkSlashStyles.icons.length > 8)
  assert.equal(
    darkSlashStyles.icons.every(
      ({ color, fill, stroke }) =>
        color !== darkSlashStyles.background &&
        (fill !== darkSlashStyles.background || stroke !== darkSlashStyles.background)
    ),
    true
  )
  await page.screenshot({ path: join(shots, '11-dark-slash-menu.png') })
  console.log('✓ dark slash-menu icons remain distinct from the menu surface')

  await page.keyboard.press('Escape')
  if (await menu.isVisible()) await page.keyboard.press('Escape')
  await menu.waitFor({ state: 'hidden' })
  const caretParagraph = pm.locator(':scope > p').first()
  await caretParagraph.click()
  await page.keyboard.press('End')
  const darkCaret = await pm.evaluate((element) => ({
    caret: getComputedStyle(element).caretColor,
    background: getComputedStyle(element.parentElement ?? element).backgroundColor,
    accent: getComputedStyle(element).getPropertyValue('--accent-strong').trim(),
    virtualCursorEnabled: element.classList.contains('virtual-cursor-enabled'),
    virtualCursor: (() => {
      const cursor = element.querySelector('.prosemirror-virtual-cursor')
      if (!cursor) return null
      const style = getComputedStyle(cursor)
      return {
        display: style.display,
        borderLeftColor: style.borderLeftColor,
        borderLeftWidth: style.borderLeftWidth
      }
    })()
  }))
  assert.equal(darkCaret.virtualCursorEnabled, true)
  assert.equal(darkCaret.caret, 'rgba(0, 0, 0, 0)')
  // 暗色 --tn-c-brand-strong=#a8b1ff（--accent-strong → 虚拟光标/插入光标）
  assert.equal(darkCaret.accent, '#a8b1ff')
  assert.ok(darkCaret.virtualCursor)
  assert.equal(darkCaret.virtualCursor.display, 'block')
  assert.equal(darkCaret.virtualCursor.borderLeftColor, 'rgb(168, 177, 255)')
  assert.equal(darkCaret.virtualCursor.borderLeftWidth, '2px')
  await page.screenshot({ path: join(shots, '12-dark-caret.png') })
  console.log('✓ virtual caret is accented while the duplicate native caret stays transparent')

  await raw.click({ position: { x: 12, y: 12 } })
  await raw.scrollIntoViewIfNeeded()
  await raw.hover()
  await blockHandle.waitFor()
  const dragHandleElement = await blockHandle.elementHandle()
  const indicatorTarget = pm.locator(':scope > p').filter({ hasText: '填充段落 6' }).first()
  const indicatorTargetElement = await indicatorTarget.elementHandle()
  assert.ok(dragHandleElement)
  assert.ok(indicatorTargetElement)
  await page.evaluate(
    ({ handle, target }) => {
      const dataTransfer = new DataTransfer()
      const handleRect = handle.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      Object.assign(window, { __deskE2EDragDataTransfer: dataTransfer })
      handle.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          clientX: handleRect.left + handleRect.width / 2,
          clientY: handleRect.top + handleRect.height / 2
        })
      )
      handle.dispatchEvent(
        new DragEvent('dragstart', {
          bubbles: true,
          cancelable: true,
          clientX: handleRect.left + handleRect.width / 2,
          clientY: handleRect.top + handleRect.height / 2,
          dataTransfer
        })
      )
      target.dispatchEvent(
        new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          clientX: targetRect.left + targetRect.width / 2,
          clientY: targetRect.bottom - 1,
          dataTransfer
        })
      )
    },
    { handle: dragHandleElement, target: indicatorTargetElement }
  )
  const dropCursor = page.locator('.crepe-drop-cursor')
  await dropCursor.waitFor({ state: 'visible' })
  const darkDropStyle = await dropCursor.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    opacity: getComputedStyle(element).opacity,
    height: element.getBoundingClientRect().height
  }))
  assert.equal(darkDropStyle.background, 'rgb(168, 177, 255)')
  assert.equal(darkDropStyle.opacity, '1')
  assert.ok(darkDropStyle.height >= 2)
  await page.screenshot({ path: join(shots, '13-dark-drop-cursor.png') })
  await page.evaluate((handle) => {
    const dataTransfer = window.__deskE2EDragDataTransfer
    handle.dispatchEvent(
      new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer })
    )
    delete window.__deskE2EDragDataTransfer
  }, dragHandleElement)
  console.log('✓ dark drag indicator uses an opaque high-contrast accent line')

  // 组件预览区（unhappy path：预览是 contenteditable=false，但浏览器仍会把 DOM 光标放进去，
  // 之后按键全被丢弃）。现在的规则：单击=整块选中；拖选=保留原生选区（照样能复制）；
  // 双击 / 选中后回车=打开源码编辑；整块选中时敲字不会替换组件。
  const footprints = page.locator('.desk-raw-block--footprints').first()
  await footprints.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await footprints.getByText('足迹正文第一段。').first().click()
  await page.waitForTimeout(300)
  const previewClick = await page.evaluate(() => {
    const block = document.querySelector('.desk-raw-block--footprints')
    const selection = window.getSelection()
    const node = selection?.anchorNode
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    return {
      selected: block?.classList.contains('ProseMirror-selectednode') ?? false,
      caretInPreview: Boolean(element?.closest('.desk-raw-block__component-preview'))
    }
  })
  assert.deepEqual(previewClick, { selected: true, caretInPreview: false })
  console.log('✓ 单击组件预览 = 整块选中，光标不再落进不可编辑的预览')

  await page.keyboard.type('X')
  await page.waitForTimeout(200)
  const afterTyping = await footprints.evaluate((element) => ({
    blocks: document.querySelectorAll('.desk-raw-block--footprints').length,
    text: element.textContent ?? ''
  }))
  assert.equal(afterTyping.blocks, 1)
  assert.ok(afterTyping.text.includes('足迹正文第一段。'))
  console.log('✓ 组件整块选中时输入被忽略，不会把组件替换掉')

  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  assert.equal(await footprints.locator('.desk-raw-block__editor').isVisible(), true)
  await footprints.locator('.desk-raw-block__editor-done').first().click({ force: true })
  await page.waitForTimeout(300)
  console.log('✓ 整块选中后回车 = 打开源码编辑')

  await app.evaluate(({ clipboard }) => clipboard.writeText('<<desk-e2e-clipboard>>'))
  const previewBox = await footprints.getByText('足迹正文第一段。').first().boundingBox()
  assert.ok(previewBox)
  await page.mouse.move(previewBox.x + 2, previewBox.y + previewBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(previewBox.x + previewBox.width - 2, previewBox.y + previewBox.height / 2, {
    steps: 8
  })
  await page.mouse.up()
  await page.waitForTimeout(200)
  await page.keyboard.press('ControlOrMeta+c')
  await page.waitForTimeout(300)
  assert.equal(await app.evaluate(({ clipboard }) => clipboard.readText()), '足迹正文第一段。')
  console.log('✓ 拖选组件预览里的文字仍然可以复制（原生选区没被抢）')

  await footprints.getByText('足迹正文第一段。').first().dblclick()
  await page.waitForTimeout(400)
  assert.equal(await footprints.locator('.desk-raw-block__editor').isVisible(), true)
  await footprints.locator('.desk-raw-block__editor-done').first().click({ force: true })
  await page.waitForTimeout(300)
  console.log('✓ 双击组件预览 = 打开源码编辑')
} finally {
  await app.evaluate(({ clipboard }, text) => clipboard.writeText(text), originalClipboard)
  await app.close()
  rmSync(fixtureRoot, { recursive: true, force: true })
}
