// 编辑器焦点/光标不变量（计划 C+D）。
//
// 背景（真实 Electron 复现）：可编辑区没铺满面板时，点正文列之外的空白会让焦点掉到
// BODY，而 prosemirror-virtual-cursor 仍按旧 TextSelection 画光标 —— 看起来有光标，
// 但所有按键都没反应。本脚本固化「要么焦点在编辑器里且按键能动，要么页面上没有可见
// 光标元素」这条不变量，覆盖点空白、点工具栏、失焦后按键、长文档滚动与代码块内点击。
//
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-editor-focus.mjs
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-editor-focus-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'focus-kb')
const shots = join(deskDir, 'scripts', 'shots', 'editor-focus')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

const UUID = 'fe44ae48-51db-43c1-b16b-f25f3614c586'
const UUID_LONG = '9d1c2b3a-4e5f-4a6b-8c7d-1e2f3a4b5c6d'

writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'focus-kb', name: 'focus-kb' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0006. 短笔记（代码组）\n- [ ] 0007. 长文档\n')
writeFileSync(
  join(kb, 'notes', '0006. 短笔记（代码组）.md'),
  [
    '---',
    `id: ${UUID}`,
    '---',
    '',
    '# 0006. 短笔记（代码组）',
    '',
    '哈哈哈',
    '',
    '123',
    '',
    '::: code-group',
    '',
    '```js [1]',
    " console.log('123')",
    '```',
    '',
    '```js [2]',
    '```',
    '',
    ':::',
    '',
    '',
    '12',
    '',
    '| 列 A | 列 B |',
    '| --- | --- |',
    '| A1 | B1 |'
  ].join('\n') + '\n'
)
writeFileSync(
  join(kb, 'notes', '0007. 长文档.md'),
  [
    '---',
    `id: ${UUID_LONG}`,
    '---',
    '',
    '# 0007. 长文档',
    '',
    ...Array.from(
      { length: 120 },
      (_, index) => `第 ${index + 1} 段：用于验证滚动后的空白点击。`
    ).flatMap((line) => [line, '']),
    '末尾段落'
  ].join('\n') + '\n'
)

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
const page = await app.firstWindow()
page.on('pageerror', (error) => pageErrors.push(String(error)))
await page.waitForLoadState('domcontentloaded')

async function waitFor(check, timeoutMs = 15000, intervalMs = 120) {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const value = await check()
    if (value) return value
    if (Date.now() > deadline) return null
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
}

/** 焦点/光标状态：activeElement、PM 是否聚焦、可见的虚拟光标数量、选区位置。 */
const state = () =>
  page.evaluate(() => {
    const pm = document.querySelector('.ProseMirror')
    const selection = window.getSelection()
    const active = document.activeElement
    const caretVisible = [...document.querySelectorAll('.prosemirror-virtual-cursor')].some(
      (el) => {
        const style = getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')
          return false
        const rect = el.getBoundingClientRect()
        return rect.width + rect.height > 0
      }
    )
    return {
      active: active
        ? `${active.tagName}${active.className ? '.' + String(active.className).split(' ')[0] : ''}`
        : null,
      pmFocused: pm?.classList.contains('ProseMirror-focused') ?? false,
      caretVisible,
      anchorText: selection?.anchorNode?.textContent?.slice(0, 12) ?? null,
      anchorOffset: selection?.anchorOffset ?? null,
      // 点在块边缘热区上是「块边界光标」，DOM 偏移不会变，用侧别判断按键效果。
      boundarySide: pm?.getAttribute('data-boundary-caret') ?? null
    }
  })

/** 工具栏里同一个按钮存在「测量行」副本，取真正可见的那个。 */
const toolbarButton = (label) =>
  page.locator(`.format-overflow__inline button[aria-label="${label}"]`).first()

const press = async (key) => {
  await page.keyboard.press(key)
  await page.waitForTimeout(200)
}

const geometry = () =>
  page.evaluate(() => {
    const canvas = document.querySelector('.milkdown-markdown-editor__canvas')
    const pm = document.querySelector('.ProseMirror')
    const milkdown = document.querySelector('.milkdown')
    const pane = document.querySelector('.note-pane')
    const rect = (el) => {
      const box = el?.getBoundingClientRect()
      return box
        ? { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom }
        : null
    }
    return {
      window: { width: window.innerWidth, height: window.innerHeight },
      canvas: rect(canvas),
      pm: rect(pm),
      milkdown: rect(milkdown),
      pane: rect(pane)
    }
  })

try {
  // 宽窗口：保证正文列（max 940px）两侧真的存在留白
  await app.evaluate(({ BrowserWindow }) => {
    BrowserWindow.getAllWindows()[0]?.setBounds({ x: 40, y: 40, width: 1800, height: 1100 })
  })
  await page.waitForSelector('.kb-sidebar, aside', { timeout: 20000 })
  await waitFor(async () => (await page.getByText('focus-kb', { exact: true }).count()) > 0)
  await page.getByText('focus-kb', { exact: true }).first().click()
  await waitFor(async () => (await page.locator('.toc-row').count()) >= 2)
  await page.locator('.toc-row').first().click()
  await page.locator('.ProseMirror').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(1500)

  const geo = await geometry()
  record(
    'C-0 可编辑区铺满面板（不再有内容之下的死区）',
    Boolean(geo.pm && geo.milkdown) && geo.pm.height >= geo.milkdown.height - 2,
    `pm=${Math.round(geo.pm?.height ?? 0)} milkdown=${Math.round(geo.milkdown?.height ?? 0)}`
  )

  // F1：点正文下方空白（面板底部）→ 焦点回到编辑器，光标能动
  await page.mouse.click(geo.pane.x + geo.pane.width / 2, geo.pane.bottom - 40)
  await page.waitForTimeout(400)
  const afterBottomClick = await state()
  const movedLeft = await (async () => {
    const before = await state()
    await press('ArrowLeft')
    const after = await state()
    return { before, after }
  })()
  const leftMoved = (before, after) =>
    after.anchorOffset !== before.anchorOffset || after.boundarySide !== before.boundarySide
  record(
    'F1 点正文下方空白 → 编辑器获得焦点且 ← 能移动光标',
    afterBottomClick.pmFocused &&
      afterBottomClick.active?.startsWith('DIV.ProseMirror') &&
      leftMoved(movedLeft.before, movedLeft.after),
    `active=${afterBottomClick.active} offset ${movedLeft.before.anchorOffset}→${movedLeft.after.anchorOffset} 边界=${movedLeft.before.boundarySide}→${movedLeft.after.boundarySide}`
  )

  // F2：宽屏下点正文列左侧留白（可编辑区之外）→ 焦点收回并就近落光标
  const gutterX = Math.max(geo.pane.x + 8, geo.pm.x - 30)
  const hasGutter = geo.pm.x - geo.pane.x > 40
  if (hasGutter) {
    await page.mouse.click(gutterX, geo.pm.y + geo.pm.height / 2)
    await page.waitForTimeout(400)
    const afterGutter = await state()
    const before = afterGutter.anchorOffset
    await press('ArrowLeft')
    const after = await state()
    record(
      'F2 点正文列左侧留白 → 焦点收回编辑器且 ← 能移动光标',
      afterGutter.pmFocused && after.pmFocused && leftMoved(afterGutter, after),
      `x=${Math.round(gutterX)} active=${afterGutter.active} offset ${before}→${after.anchorOffset} 边界=${afterGutter.boundarySide}→${after.boundarySide}`
    )
  } else {
    record(
      'F2 点正文列左侧留白 → 焦点收回编辑器且 ← 能移动光标',
      false,
      '窗口不够宽，留白不足 40px'
    )
  }
  await page.screenshot({ path: join(shots, '01-after-blank-click.png') })

  // F3：长文档滚到底后点下方空白 → 光标能动，滚动位置不被拉回
  await page.locator('.toc-row').nth(1).click()
  await page.locator('.ProseMirror').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(1200)
  const scrolled = await page.evaluate(() => {
    const canvas = document.querySelector('.milkdown-markdown-editor__canvas')
    canvas.scrollTop = canvas.scrollHeight
    return {
      scrollTop: canvas.scrollTop,
      scrollHeight: canvas.scrollHeight,
      clientHeight: canvas.clientHeight
    }
  })
  await page.waitForTimeout(300)
  const longGeo = await geometry()
  await page.mouse.click(longGeo.pane.x + longGeo.pane.width / 2, longGeo.pane.bottom - 40)
  await page.waitForTimeout(400)
  const longState = await state()
  await press('ArrowLeft')
  const longAfter = await state()
  const scrollAfter = await page.evaluate(() => {
    const canvas = document.querySelector('.milkdown-markdown-editor__canvas')
    return { scrollTop: canvas.scrollTop, scrollHeight: canvas.scrollHeight }
  })
  record(
    'F3 长文档滚到底后点空白 → 光标能移动且滚动位置不被拉回顶部',
    longState.pmFocused &&
      longAfter.anchorOffset !== longState.anchorOffset &&
      scrollAfter.scrollTop > scrollAfter.scrollHeight - scrollAfter.scrollTop - 5,
    `scrollTop ${Math.round(scrolled.scrollTop)}→${Math.round(scrollAfter.scrollTop)} / 可滚动 ${Math.round(scrolled.scrollHeight - scrolled.clientHeight)}`
  )

  // F4：点工具栏「粗体」后，不允许残留可见光标（D1 不变量）
  await page.locator('.toc-row').first().click()
  await page.locator('.ProseMirror').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(800)
  const pmBox = (await geometry()).pm
  await page.mouse.click(pmBox.x + 40, pmBox.y + 60)
  await page.waitForTimeout(200)
  await toolbarButton('粗体').click()
  await page.waitForTimeout(300)
  const afterToolbar = await state()
  record(
    'F4 点工具栏后不再残留「看得见但动不了」的光标',
    !(afterToolbar.caretVisible && !afterToolbar.pmFocused),
    `caretVisible=${afterToolbar.caretVisible} pmFocused=${afterToolbar.pmFocused}`
  )

  // F5：焦点掉到 body 后按编辑键 → 焦点回到编辑器且按键生效（D2）
  await page.mouse.click(pmBox.x + 40, pmBox.y + 60)
  await page.waitForTimeout(200)
  await page.evaluate(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  })
  const blurred = await state()
  await press('ArrowLeft')
  const reclaimed = await state()
  await page.keyboard.type('X')
  await page.waitForTimeout(300)
  const typed = await page.locator('.ProseMirror').first().innerText()
  record(
    'F5 失焦时不显示虚拟光标（D1 不变量）',
    blurred.active === 'BODY' && blurred.pmFocused === false && blurred.caretVisible === false,
    `blur 后 active=${blurred.active} pmFocused=${blurred.pmFocused} caretVisible=${blurred.caretVisible}`
  )
  record(
    'F5b 焦点在 body 时按编辑键 → 焦点收回编辑器且按键生效（D2）',
    reclaimed.pmFocused && typed.includes('X'),
    `按 ← 后 focused=${reclaimed.pmFocused}，输入生效=${typed.includes('X')}`
  )
  await page.keyboard.press('Backspace')

  // F6：点代码块内部 CodeMirror 不被抢焦点（白名单回归）
  await page.locator('.toc-row').first().click()
  await page.locator('.ProseMirror').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(800)
  const cm = page.locator('.cm-content').first()
  const cmCount = await cm.count()
  if (cmCount > 0) {
    await cm.click()
    await page.waitForTimeout(300)
    const inCm = await state()
    record(
      'F6 点代码块内部编辑器不被抢焦点',
      inCm.active?.includes('cm-content') === true,
      `active=${inCm.active}`
    )
  } else {
    record('F6 点代码块内部编辑器不被抢焦点', false, '没找到 .cm-content')
  }

  // F7：选中文本后点工具栏「粗体」必须保留选区（防回归）
  const selected = await page.evaluate(() => {
    const pm = document.querySelector('.ProseMirror')
    const paragraph = [...pm.querySelectorAll('p')].find((node) =>
      (node.textContent ?? '').includes('哈哈哈')
    )
    if (!paragraph) return null
    const range = document.createRange()
    range.selectNodeContents(paragraph)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    pm.focus()
    return paragraph.textContent
  })
  await page.waitForTimeout(200)
  await toolbarButton('粗体').click()
  await page.waitForTimeout(400)
  const boldApplied = await page.evaluate(() => {
    const pm = document.querySelector('.ProseMirror')
    return {
      strong: pm.querySelectorAll('strong').length,
      selection: window.getSelection()?.toString() ?? ''
    }
  })
  record(
    'F7 选中文本后点工具栏「粗体」仍作用于该选区',
    Boolean(selected) && boldApplied.strong > 0,
    `选中「${selected ?? ''}」，strong=${boldApplied.strong}`
  )

  // F9：表格里必须有一个看得见的光标。
  // `prosemirror-virtual-cursor` 只在空 TextSelection 下挂唯一 widget，进表格那一步实测会
  // 没重定位/高度为 0；而 .virtual-cursor-enabled 把原生 caret 设成透明 → 「光标消失」
  // （此时按键其实已落在单元格里）。约定：表格内用原生 caret 并隐藏虚拟光标。
  const tableCell = page.locator('.ProseMirror td, .ProseMirror th').first()
  if ((await tableCell.count()) > 0) {
    await tableCell.scrollIntoViewIfNeeded()
    await tableCell.click()
    await page.waitForTimeout(300)
    const inTable = await page.evaluate(() => {
      const root = document.querySelector('.ProseMirror')
      const cell = document.querySelector('.ProseMirror td, .ProseMirror th')
      const cursor = document.querySelector('.prosemirror-virtual-cursor')
      return {
        attr: root.hasAttribute('data-table-caret'),
        cellCaret: cell ? getComputedStyle(cell).caretColor : null,
        cursorDisplay: cursor ? getComputedStyle(cursor).display : 'absent'
      }
    })
    // 点单元格时 PM 可能给出 CellSelection（插件只在空 TextSelection 下挂 widget），
    // 所以「虚拟光标不存在」和「被 display:none 隐藏」都算没有可见虚拟光标。
    const noVisibleVirtualCursor =
      inTable.cursorDisplay === 'none' || inTable.cursorDisplay === 'absent'
    record(
      'F9 表格内改用原生光标（可见，且没有可见的虚拟光标）',
      inTable.attr && noVisibleVirtualCursor && inTable.cellCaret !== 'rgba(0, 0, 0, 0)',
      `data-table-caret=${inTable.attr} caret=${inTable.cellCaret} 虚拟光标=${inTable.cursorDisplay}`
    )
    await page.locator('.ProseMirror p', { hasText: '哈哈哈' }).first().click()
    await page.waitForTimeout(300)
    const outTable = await page.evaluate(() => {
      const root = document.querySelector('.ProseMirror')
      const cursor = document.querySelector('.prosemirror-virtual-cursor')
      return {
        attr: root.hasAttribute('data-table-caret'),
        cursorDisplay: cursor ? getComputedStyle(cursor).display : 'absent'
      }
    })
    record(
      'F9b 出表格后恢复虚拟光标',
      !outTable.attr && outTable.cursorDisplay === 'block',
      `data-table-caret=${outTable.attr} 虚拟光标=${outTable.cursorDisplay}`
    )
  } else {
    record('F9 表格内改用原生光标（可见且虚拟光标隐藏）', false, 'fixture 里没有表格')
  }

  record('F8 渲染过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 300))
  await page.screenshot({ path: join(shots, '02-final.png') })
} catch (error) {
  record('F 断言执行', false, error instanceof Error ? error.message : String(error))
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
