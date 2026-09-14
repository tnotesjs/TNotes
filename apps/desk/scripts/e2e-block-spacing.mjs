// 相邻顶层块之间必须有真实间距（不能「贴合」）。
//
// 为什么单独一条：块间距完全由 milkdownMarkdownEditor.scoped.css + crepePort 主题决定，
// 而源码里用空行分开的两个块（尤其是相邻列表、相邻 callout 卡片）一旦上下边距都是 0，
// 渲染出来会连成一条 —— 内容没错、保真没错，单测与其它 e2e 都发现不了。实测 2026-09-13：
// `ul/ol` 上下是 0（两个列表并成一条）、`.desk-callout` 是 `margin: 0`（四张卡片连成色带）。
//
// 判定分两类，这是本套件的关键：
//   · 有底色/边框的卡片块（callout / raw-block / code-block / table）：padding 在卡片内部，
//     看 border-box 间距；
//   · 纯文字块（p / ul / ol / h* / blockquote）：间距靠 padding 撑开，看内容间距。
// 一律用 border-box 会把段落那 8px 的 padding 间距误判成贴合。
//
// Run: node apps/desk/scripts/e2e-block-spacing.mjs   （需先 electron-vite build）
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-block-spacing-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.block-spacing')
const noteFile = join(kb, 'notes', '0001. block spacing.md')
const shots = join(deskDir, 'scripts', 'shots', 'block-spacing')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'block-spacing' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. block spacing\n')

// 覆盖会参与块间距的各族：段落 / 标题 / 相邻列表 / 相邻 callout / callout 后接段落 /
// 引用 / 表格 / 相邻代码块 / 分隔线 / 容器。相邻列表与相邻 callout 是两次真实回归的场景。
const source = [
  '---',
  'id: 20000000-0000-4000-8000-000000000001',
  '---',
  '',
  '# 0001. block spacing',
  '',
  '段落一。',
  '',
  '段落二。',
  '',
  '- 列表一',
  '- 列表一之二',
  '',
  '- 列表二（源码里由空行分开，不能与上一条并成同一个列表）',
  '',
  '1. 有序一',
  '2. 有序二',
  '',
  '- 列表三',
  '',
  '::: tip 💡 TIP',
  '',
  '提示块正文。',
  '',
  ':::',
  '',
  '::: info ℹ️ INFO',
  '',
  '信息块正文。',
  '',
  ':::',
  '',
  '::: warning ⚠️ WARNING',
  '',
  '警告块正文。',
  '',
  ':::',
  '',
  '::: danger ❌ ERROR',
  '',
  '错误块正文。',
  '',
  ':::',
  '',
  'callout 之后紧跟的段落。',
  '',
  '> 引用块。',
  '',
  '| a | b |',
  '| --- | --- |',
  '| 1 | 2 |',
  '',
  '```js',
  'const a = 1',
  '```',
  '',
  '```ts',
  'const b = 2',
  '```',
  '',
  '---',
  '',
  '::: details 可折叠容器',
  '',
  '容器正文。',
  '',
  ':::',
  '',
  '结束段落。',
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

try {
  const page = await app.firstWindow()
  page.on('pageerror', (error) => pageErrors.push(String(error)))
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2500)
  await page.getByText('block-spacing', { exact: true }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('.toc-nodes .node-label').filter({ hasText: 'block spacing' }).click()
  await page.locator('.ProseMirror').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(2000)

  const rows = await page.evaluate(() => {
    const root = document.querySelector('.ProseMirror')
    const kids = [...root.children].filter((el) => {
      // 视觉上不存在的载体（frontmatter / 引用定义）不参与间距判定
      if (el.classList.contains('desk-raw-block--hidden')) return false
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') return false
      // 脱离文档流的覆盖层（虚拟光标、拖拽浮层…）不占块间距
      if (cs.position === 'absolute' || cs.position === 'fixed') return false
      return el.getBoundingClientRect().height >= 4
    })
    return kids.map((el, i) => {
      const cs = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      const next = kids[i + 1]
      if (!next) return { last: true, label: el.tagName }
      const nextCs = getComputedStyle(next)
      const nextRect = next.getBoundingClientRect()
      const bg = cs.backgroundColor
      const hasCard =
        (bg && bg !== 'transparent' && !bg.startsWith('rgba(0, 0, 0, 0)')) ||
        parseFloat(cs.borderTopWidth) > 0 ||
        parseFloat(cs.borderBottomWidth) > 0
      const borderGap = Math.round(nextRect.top - rect.bottom)
      const contentGap = Math.round(
        nextRect.top - rect.bottom + parseFloat(cs.paddingBottom) + parseFloat(nextCs.paddingTop)
      )
      const classes = String(el.className || '')
      const nextClasses = String(next.className || '')
      return {
        last: false,
        tag: el.tagName,
        classes,
        nextTag: next.tagName,
        nextClasses,
        isList: el.tagName === 'UL' || el.tagName === 'OL',
        nextIsList: next.tagName === 'UL' || next.tagName === 'OL',
        isCallout: classes.includes('desk-callout'),
        nextIsCallout: nextClasses.includes('desk-callout'),
        gap: hasCard ? borderGap : contentGap,
        borderGap,
        contentGap,
        // 供失败时一眼看出是哪种组合
        label: `${el.tagName.toLowerCase()}${classes ? '.' + classes.split(' ')[0] : ''}`,
        nextLabel: `${next.tagName.toLowerCase()}${nextClasses ? '.' + nextClasses.split(' ')[0] : ''}`
      }
    })
  })
  const pairs = rows.filter((row) => !row.last)

  // 前置条件：fixture 必须真的产生了相邻列表与相邻 callout，否则本套件会空转通过
  const listCount = rows.filter((row) => row.isList).length
  const calloutCount = rows.filter((row) => row.isCallout).length
  const adjacentListPairs = pairs.filter((p) => p.isList && p.nextIsList)
  const adjacentCalloutPairs = pairs.filter((p) => p.isCallout && p.nextIsCallout)
  record(
    '前置条件：fixture 里有多个顶层列表（相邻列表可观测）',
    listCount >= 3 && adjacentListPairs.length >= 2,
    `顶层列表=${listCount} 相邻列表对=${adjacentListPairs.length}`
  )
  record(
    '前置条件：fixture 里有连排 callout（相邻卡片可观测）',
    calloutCount === 4 && adjacentCalloutPairs.length === 3,
    `callout=${calloutCount} 相邻卡片对=${adjacentCalloutPairs.length}`
  )

  const touching = pairs.filter((p) => p.gap <= 0)
  record(
    '相邻顶层块之间没有贴合（有效间距 > 0）',
    touching.length === 0,
    touching.length
      ? touching.map((p) => `${p.label}→${p.nextLabel}(${p.gap}px)`).join('、')
      : `${pairs.length} 对相邻块全部有间距`
  )

  // 两次真实回归锁死具体量级：与段落同一套节奏 / 与其它卡片块一致
  const tightLists = adjacentListPairs.filter((p) => p.contentGap < 8)
  record(
    '相邻列表保持与段落同一套节奏（内容间距 >= 8px）',
    tightLists.length === 0,
    tightLists.length
      ? tightLists.map((p) => `${p.label}→${p.nextLabel}(${p.contentGap}px)`).join('、')
      : adjacentListPairs.map((p) => `${p.contentGap}px`).join('/')
  )
  const tightCallouts = adjacentCalloutPairs.filter((p) => p.borderGap < 12)
  record(
    '相邻 callout 卡片之间 >= 12px（与其它卡片块一致）',
    tightCallouts.length === 0,
    tightCallouts.length
      ? tightCallouts.map((p) => `${p.label}→${p.nextLabel}(${p.borderGap}px)`).join('、')
      : adjacentCalloutPairs.map((p) => `${p.borderGap}px`).join('/')
  )
  const calloutToText = pairs.filter((p) => p.isCallout && !p.nextIsCallout)
  const tightAfterCallout = calloutToText.filter((p) => p.borderGap < 12)
  record(
    'callout 之后的块也留出卡片间距（>= 12px）',
    calloutToText.length > 0 && tightAfterCallout.length === 0,
    tightAfterCallout.length
      ? tightAfterCallout.map((p) => `${p.label}→${p.nextLabel}(${p.borderGap}px)`).join('、')
      : calloutToText.map((p) => `${p.label}→${p.nextLabel}=${p.borderGap}px`).join('、')
  )

  await page.screenshot({ path: join(shots, 'block-spacing.png') })
  record('渲染过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 200))

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
