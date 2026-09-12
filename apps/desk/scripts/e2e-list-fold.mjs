// 缩进列表折叠（交互对齐语雀）：按钮出现条件 / 悬停显形 / 折叠只改视图 / 箭头键跳过隐藏子树 /
// 折叠状态下回车的三种语义。
// Run: node apps/desk/scripts/e2e-list-fold.mjs   （需先 electron-vite build）
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-list-fold-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.list-fold')
const noteFile = join(kb, 'notes', '0001. list fold.md')
const shots = join(deskDir, 'scripts', 'shots', 'list-fold')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'list-fold' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. list fold\n')

const source = [
  '---',
  'id: 10000000-0000-4000-8000-000000000059',
  '---',
  '',
  '# 0001. list fold',
  '',
  '- 无序项 B',
  '  - 嵌套项 B-1',
  '    - 深层项 B-1-1',
  '- 尾项 C',
  '',
  '1. 有序一',
  '   1. 有序二',
  '',
  '- [ ] 任务 A',
  '  - [ ] 任务 A1',
  '- [x] 任务 B',
  ''
].join('\n')
writeFileSync(noteFile, source)
writeFileSync(
  join(profile, 'workspace.v1.json'),
  `${JSON.stringify({ path: workspace }, null, 2)}\n`
)
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  `${JSON.stringify({ version: 1, theme: 'light', defaultNoteView: 'visual', autosave: { enabled: false, delayMs: 1000 } }, null, 2)}\n`
)

const app = await _electron.launch({
  executablePath: require('electron'),
  args: ['out/main/index.js', `--user-data-dir=${profile}`],
  cwd: deskDir,
  timeout: 60000,
  env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined, ELECTRON_DISABLE_SANDBOX: '1' }
})
const pageErrors = []
const results = []
let page
const record = (name, ok, detail = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

/** 折叠按钮的几何 / 状态快照。 */
const toggleSnapshot = (target) =>
  target.evaluate(() =>
    [...document.querySelectorAll('.desk-list-item-toggle')].map((button) => {
      const item = button.closest('.list-item')
      const label = item.querySelector('.label-wrapper')
      const rect = button.getBoundingClientRect()
      const css = getComputedStyle(button)
      return {
        text: item.querySelector('.content-dom > p')?.textContent ?? '',
        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        radius: css.borderRadius,
        gapToMarker: Math.round(label.getBoundingClientRect().x - rect.right),
        opacity: Number(css.opacity),
        expanded: button.getAttribute('aria-expanded'),
        icon: button.querySelector('path')?.getAttribute('d') ?? ''
      }
    })
  )

/** 列表结构：层级 / 自己的文字 / 自己是否折叠 / 是否被上层折叠遮住。 */
const outline = (target) =>
  target.evaluate(() =>
    [...document.querySelectorAll('.list-item')].map((item) => {
      let lists = 0
      let node = item.parentElement
      while (node) {
        if (node.tagName === 'UL' || node.tagName === 'OL') lists += 1
        node = node.parentElement
      }
      return {
        text: item.querySelector('.content-dom > p')?.textContent ?? '',
        indent: lists - 1,
        collapsed: item.parentElement?.classList.contains('desk-list-item--collapsed') ?? false,
        hidden: item.getBoundingClientRect().height === 0
      }
    })
  )

const caretInfo = (target) =>
  target.evaluate(() => {
    const selection = window.getSelection()
    const node = selection?.anchorNode
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    return {
      text: element?.textContent ?? '',
      offset: selection?.anchorOffset ?? -1,
      inCollapsed: Boolean(element?.closest('.desk-list-item--collapsed'))
    }
  })

/** 把光标放到某项自己那段文字里：end | start | after:N。 */
async function placeCaret(text, where) {
  await page.locator('.content-dom > p', { hasText: text }).first().click()
  await page.keyboard.press('Home')
  await page.waitForTimeout(300)
  if (where === 'end') {
    await page.keyboard.press('End')
  } else if (typeof where === 'object') {
    for (let index = 0; index < where.after; index += 1) await page.keyboard.press('ArrowRight')
  }
  // ProseMirror 从 DOM 选区同步 state 是异步的，等它落地再按键
  await page.waitForTimeout(300)
}

/** 某个列表项自己的折叠按钮（不要点到嵌套子项的按钮）。 */
function listItemToggle(text) {
  const item = page
    .locator('.list-item')
    .filter({ has: page.locator(`:scope > .children > .content-dom > p:text-is("${text}")`) })
    .first()
  return item.locator(':scope > .children > .content-dom > .desk-list-item-toggle')
}

/** 折叠某个列表项（已经折叠就跳过）。 */
async function collapseItem(text) {
  const toggle = listItemToggle(text)
  if ((await toggle.getAttribute('aria-expanded')) === 'true') {
    await toggle.click()
    await page.waitForTimeout(300)
  }
}

try {
  page = await app.firstWindow()
  const currentPage = page
  currentPage.on('pageerror', (error) => pageErrors.push(String(error)))
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2500)
  await page.getByText('list-fold', { exact: true }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('.toc-row', { hasText: 'list fold' }).first().locator('.node-label').click()
  await page.locator('.milkdown .ProseMirror').waitFor({ timeout: 20000 })
  await page.waitForTimeout(2000)

  const initialOutline = await outline(page)
  const initial = await toggleSnapshot(page)
  record(
    '只有含子列表的项才有折叠按钮（4 个：无序项 B / 嵌套项 B-1 / 有序一 / 任务 A）',
    initial.length === 4 &&
      initial.map((toggle) => toggle.text).join('|') === '无序项 B|嵌套项 B-1|有序一|任务 A',
    initial.map((toggle) => toggle.text).join('|')
  )
  record(
    '按钮几何与语雀一致：16×16 / 圆角 4px / 距 marker 列 4px / 平时透明',
    initial.every(
      (toggle) =>
        toggle.size === '16x16' &&
        toggle.radius === '4px' &&
        toggle.gapToMarker === 4 &&
        toggle.opacity === 0
    ),
    JSON.stringify(
      initial.map(({ size, radius, gapToMarker, opacity }) => ({
        size,
        radius,
        gapToMarker,
        opacity
      }))
    )
  )

  await page.locator('.content-dom > p', { hasText: '无序项 B' }).first().hover()
  await page.waitForTimeout(300)
  const hoverParent = await toggleSnapshot(page)
  record(
    '悬停父项只显形它自己的按钮',
    hoverParent[0]?.opacity === 1 && hoverParent.slice(1).every((toggle) => toggle.opacity === 0),
    JSON.stringify(hoverParent.map(({ text, opacity }) => ({ text, opacity })))
  )

  await page.locator('.content-dom > p', { hasText: '嵌套项 B-1' }).first().hover()
  await page.waitForTimeout(300)
  const hoverChild = await toggleSnapshot(page)
  record(
    '悬停子项时祖先项的按钮收起、子项显形',
    hoverChild[0]?.opacity === 0 && hoverChild[1]?.opacity === 1,
    JSON.stringify(hoverChild.map(({ text, opacity }) => ({ text, opacity })))
  )

  const openIcon = hoverChild[0]?.icon
  await listItemToggle('无序项 B').click()
  await page.waitForTimeout(400)
  const collapsed = await toggleSnapshot(page)
  const childDisplay = await page.evaluate(() => {
    const item = document.querySelector('.desk-list-item--collapsed')
    const child = item?.querySelector('.content-dom > ul')
    return child ? getComputedStyle(child).display : null
  })
  record(
    '点击后子列表从布局里消失，父项文字与 marker 不动',
    childDisplay === 'none' && collapsed[0]?.expanded === 'false',
    `子列表 display=${childDisplay} aria=${collapsed[0]?.expanded}`
  )
  record(
    '折叠后按钮常显且图标转成朝右',
    collapsed[0]?.opacity === 1 && collapsed[0]?.icon !== openIcon,
    `opacity=${collapsed[0]?.opacity} icon=${collapsed[0]?.icon}`
  )
  const afterCollapse = await outline(page)
  record(
    '折叠只隐藏子树：子孙都在文档里但不可见',
    afterCollapse
      .filter((item) => !item.hidden)
      .map((item) => item.text)
      .join('|') === '无序项 B|尾项 C|有序一|有序二|任务 A|任务 A1|任务 B' &&
      afterCollapse
        .filter((item) => item.hidden)
        .map((item) => item.text)
        .join('|') === '嵌套项 B-1|深层项 B-1-1',
    JSON.stringify(afterCollapse.map(({ text, hidden }) => ({ text, hidden })))
  )
  await page.screenshot({ path: join(shots, 'list-fold.png') })

  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(900)
  record(
    '折叠后保存 → 文件字节零 diff（折叠不写进 markdown）',
    readFileSync(noteFile, 'utf8') === source
  )

  // 箭头键跳过隐藏子树
  await page.locator('.content-dom > p', { hasText: '无序项 B' }).first().click()
  await page.keyboard.press('End')
  await page.waitForTimeout(200)
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(200)
  const afterDown = await caretInfo(page)
  record(
    '折叠项里按 ↓ 跳过隐藏的子树',
    !afterDown.inCollapsed && afterDown.text.includes('尾项 C'),
    `text=${afterDown.text} 在折叠子树里=${afterDown.inCollapsed}`
  )
  await page.keyboard.press('ArrowUp')
  await page.waitForTimeout(200)
  const afterUp = await caretInfo(page)
  record('从下方按 ↑ 回到折叠项父项文字', afterUp.text.includes('无序项 B'), `text=${afterUp.text}`)

  // ---- 回车语义（语雀）：尾 / 中 / 头 ----
  await collapseItem('无序项 B')

  // 尾：新项插在整棵子树之后，子列表留在原项上，折叠状态不变
  await placeCaret('无序项 B', 'end')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const enterEnd = await outline(page)
  const caretEnd = await caretInfo(page)
  record(
    '光标在折叠项尾部回车：新项插在子树之后、子列表留在原项、保持折叠',
    JSON.stringify(enterEnd.slice(0, 4)) ===
      JSON.stringify([
        { text: '无序项 B', indent: 0, collapsed: true, hidden: false },
        { text: '嵌套项 B-1', indent: 1, collapsed: false, hidden: true },
        { text: '深层项 B-1-1', indent: 2, collapsed: false, hidden: true },
        { text: '', indent: 0, collapsed: false, hidden: false }
      ]) && caretEnd.text === '',
    JSON.stringify(enterEnd.slice(0, 4))
  )
  await page.keyboard.press('ControlOrMeta+z')
  await page.waitForTimeout(400)

  // 中：展开并拆成「前半 + 后半（带子列表）」
  await collapseItem('无序项 B')
  await placeCaret('无序项 B', { after: 2 })
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const enterMiddle = await outline(page)
  const caretMiddle = await caretInfo(page)
  record(
    '光标在折叠项中间回车：自动展开并拆成「前半 / 后半（带子列表）」',
    JSON.stringify(enterMiddle.slice(0, 4)) ===
      JSON.stringify([
        { text: '无序', indent: 0, collapsed: false, hidden: false },
        { text: '项 B', indent: 0, collapsed: false, hidden: false },
        { text: '嵌套项 B-1', indent: 1, collapsed: false, hidden: false },
        { text: '深层项 B-1-1', indent: 2, collapsed: false, hidden: false }
      ]) &&
      caretMiddle.text === '项 B' &&
      caretMiddle.offset === 0,
    JSON.stringify(enterMiddle.slice(0, 4)) + ` caret=${JSON.stringify(caretMiddle)}`
  )
  await page.keyboard.press('ControlOrMeta+z')
  await page.waitForTimeout(400)

  // 头：空项插在项之前，并展开这一项
  await collapseItem('无序项 B')
  await placeCaret('无序项 B', 'start')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const enterStart = await outline(page)
  const caretStart = await caretInfo(page)
  record(
    '光标在折叠项开头回车：空项插在项之前，并展开这一项',
    JSON.stringify(enterStart.slice(0, 4)) ===
      JSON.stringify([
        { text: '', indent: 0, collapsed: false, hidden: false },
        { text: '无序项 B', indent: 0, collapsed: false, hidden: false },
        { text: '嵌套项 B-1', indent: 1, collapsed: false, hidden: false },
        { text: '深层项 B-1-1', indent: 2, collapsed: false, hidden: false }
      ]) && caretStart.text === '',
    JSON.stringify(enterStart.slice(0, 4)) + ` caret=${JSON.stringify(caretStart)}`
  )
  await page.keyboard.press('ControlOrMeta+z')
  await page.waitForTimeout(400)

  const restored = await outline(page)
  record(
    '三次回车都被撤销后回到初始结构',
    JSON.stringify(restored.map((item) => item.text)) ===
      JSON.stringify(initialOutline.map((item) => item.text)),
    restored.map((item) => item.text).join('|')
  )
  record('折叠过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 200))

  const failed = results.filter((item) => !item.ok)
  console.log(`\n${results.length - failed.length}/${results.length} 通过`)
  if (failed.length) {
    console.log(`失败：${failed.map((item) => item.name).join('、')}`)
    process.exitCode = 1
  }
} catch (error) {
  console.log(
    `\n运行未完成（未捕获异常） — ${error instanceof Error ? error.message : String(error)}`
  )
  process.exitCode = 1
} finally {
  await app.close()
  rmSync(fixture, { recursive: true, force: true })
}
