// 缩进列表折叠（交互对齐语雀）：按钮出现条件 / 悬停显形 / 折叠只改视图 / 箭头键跳过隐藏子树。
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
  '- 一级 A',
  '  - 二级 A1',
  '    - 三级 A1a',
  '  - 二级 A2',
  '- 一级 B',
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

/** 目前可见（没被折叠遮住）的列表项文字。 */
const visibleItems = (target) =>
  target.evaluate(() =>
    [...document.querySelectorAll('.list-item')]
      .filter((item) => item.getBoundingClientRect().height > 0)
      .map((item) => item.querySelector('.content-dom > p')?.textContent ?? '')
  )

try {
  const page = await app.firstWindow()
  page.on('pageerror', (error) => pageErrors.push(String(error)))
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2500)
  await page.getByText('list-fold', { exact: true }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('.toc-row', { hasText: 'list fold' }).first().locator('.node-label').click()
  await page.locator('.milkdown .ProseMirror').waitFor({ timeout: 20000 })
  await page.waitForTimeout(2000)

  const initial = await toggleSnapshot(page)
  record(
    '只有含子列表的项才有折叠按钮（4 个：一级 A / 二级 A1 / 有序一 / 任务 A）',
    initial.length === 4 &&
      initial.map((toggle) => toggle.text).join('|') === '一级 A|二级 A1|有序一|任务 A',
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

  // 只显示指针所在那一层：悬停父项 → 父项显形、子项仍隐藏
  await page.locator('.ProseMirror p', { hasText: '一级 A' }).first().hover()
  await page.waitForTimeout(300)
  const hoverParent = await toggleSnapshot(page)
  record(
    '悬停父项只显形它自己的按钮',
    hoverParent[0]?.opacity === 1 && hoverParent.slice(1).every((toggle) => toggle.opacity === 0),
    JSON.stringify(hoverParent.map(({ text, opacity }) => ({ text, opacity })))
  )

  await page.locator('.ProseMirror p', { hasText: '二级 A1' }).first().hover()
  await page.waitForTimeout(300)
  const hoverChild = await toggleSnapshot(page)
  record(
    '悬停子项时祖先项的按钮收起、子项显形',
    hoverChild[0]?.opacity === 0 && hoverChild[1]?.opacity === 1,
    JSON.stringify(hoverChild.map(({ text, opacity }) => ({ text, opacity })))
  )

  // 折叠「一级 A」
  const beforeCollapseIcon = hoverChild[0]?.icon
  await page.locator('.desk-list-item-toggle').first().click()
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
    collapsed[0]?.opacity === 1 && collapsed[0]?.icon !== beforeCollapseIcon,
    `opacity=${collapsed[0]?.opacity} icon=${collapsed[0]?.icon}`
  )
  const afterCollapse = await visibleItems(page)
  record(
    '折叠只隐藏子树：一级 A 的子孙不可见，其它项不动',
    afterCollapse.join('|') === '一级 A|一级 B|有序一|有序二|任务 A|任务 A1|任务 B',
    afterCollapse.join('|')
  )
  await page.screenshot({ path: join(shots, 'list-fold.png') })

  // 折叠状态只在视图层：保存后磁盘字节零 diff
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(900)
  record(
    '折叠后保存 → 文件字节零 diff（折叠不写进 markdown）',
    readFileSync(noteFile, 'utf8') === source
  )

  // 箭头键跳过隐藏子树
  await page.locator('.ProseMirror p', { hasText: '一级 A' }).first().click()
  await page.keyboard.press('End')
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(200)
  const afterDown = await page.evaluate(() => {
    const selection = window.getSelection()
    const node = selection?.anchorNode
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    return {
      text: element?.textContent ?? '',
      insideCollapsed: Boolean(element?.closest('.desk-list-item--collapsed'))
    }
  })
  record(
    '折叠项里按 ↓ 跳过隐藏的子树',
    !afterDown.insideCollapsed && afterDown.text.includes('一级 B'),
    `text=${afterDown.text} 在折叠子树里=${afterDown.insideCollapsed}`
  )
  await page.keyboard.press('ArrowUp')
  await page.waitForTimeout(200)
  const afterUp = await page.evaluate(() => {
    const selection = window.getSelection()
    const node = selection?.anchorNode
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    return element?.textContent ?? ''
  })
  record('从下方按 ↑ 回到折叠项父项文字', afterUp.includes('一级 A'), `text=${afterUp}`)

  // 再点一次展开
  await page.locator('.desk-list-item-toggle').first().click()
  await page.waitForTimeout(400)
  const expanded = await visibleItems(page)
  record(
    '再点一次恢复子树',
    expanded.join('|') ===
      '一级 A|二级 A1|三级 A1a|二级 A2|一级 B|有序一|有序二|任务 A|任务 A1|任务 B',
    expanded.join('|')
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
