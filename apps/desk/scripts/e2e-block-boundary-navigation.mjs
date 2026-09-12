// 块边界光标 + T1–T6 键盘导航（对齐语雀）。
// Run: node apps/desk/scripts/e2e-block-boundary-navigation.mjs  （需先 electron-vite build）
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-boundary-nav-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.boundary-nav')
const noteFile = join(kb, 'notes', '0001. boundary.md')
const shots = join(deskDir, 'scripts', 'shots', 'boundary-nav')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(join(kb, 'assets'), { recursive: true })
// 1x1 透明 PNG：独立图片段落要有真实图片文件
writeFileSync(
  join(kb, 'assets', '0002-big.png'),
  Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AARAAH/wEKzM3sAAAAAElFTkSuQmCC',
    'base64'
  )
)
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'boundary-nav' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. boundary\n')

/** 代码块 / 表格 / 只读组件（足迹）/ 空行，覆盖停靠模型的各条路径。 */
const source = [
  '---',
  'id: 10000000-0000-4000-8000-000000000065',
  '---',
  '',
  '# 0001. boundary',
  '',
  '上一段',
  '',
  '```js',
  'const a = 1',
  'console.log(a)',
  '```',
  '',
  '中间段',
  '',
  '| 列 A | 列 B |',
  '| --- | --- |',
  '| A1 | B1 |',
  '',
  '::: footprints 2025-01-01 12:00',
  '',
  '足迹正文。',
  '',
  ':::',
  '',
  '尾段',
  '',
  '## 图片区',
  '',
  '![独立图片](../assets/0002-big.png) {w=400px}',
  '',
  '图片后段落',
  '',
  '## 相邻代码块',
  '',
  '```js',
  'const first = 1',
  '```',
  '```css {1} [相邻的第二块]',
  '.demo {',
  '  color: red;',
  '}',
  '```',
  '',
  '相邻代码块结束段落',
  '',
  '## 代码组',
  '',
  '::: code-group',
  '',
  '```js [1]',
  "console.log('tab 1')",
  '```',
  '',
  ':::',
  '',
  '代码组结束段落',
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
  await page.getByText('boundary-nav', { exact: true }).first().click()
  await page.locator('.toc-row', { hasText: 'boundary' }).first().locator('.node-label').click()
  const pm = page.locator('.milkdown .ProseMirror:visible').first()
  await pm.waitFor({ timeout: 20000 })
  await page.waitForTimeout(2000)

  /** 当前状态：边界光标侧别 / 文本光标 / 块大纲。 */
  const state = () =>
    page.evaluate(() => {
      const editor = [...document.querySelectorAll('.ProseMirror')].find(
        (el) => el.offsetParent !== null
      )
      const host = editor?.parentElement ?? document
      const caret = host.querySelector('.desk-block-boundary-caret')
      const selection = window.getSelection()
      const node = selection?.anchorNode
      const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
      return {
        side: caret?.dataset.side ?? null,
        caretParent: (caret?.dataset.boundaryBlock ?? '').slice(0, 30),
        text: element
          ? `${element.tagName}:${(element.textContent ?? '').replace(/\s+/g, ' ').slice(0, 12)}@${selection.anchorOffset}`
          : null,
        cmFocus: Boolean(document.activeElement?.closest?.('.cm-editor')),
        inTable: Boolean(element?.closest?.('table')),
        outline: [...(editor?.children ?? [])].map((el) =>
          (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 12)
        )
      }
    })

  /** 边界光标相对目标块的位置：块头在块左上外侧、块尾在块右下外侧（整根线不压内容）。 */
  const caretBox = () =>
    page.evaluate(() => {
      const editor = [...document.querySelectorAll('.ProseMirror')].find(
        (el) => el.offsetParent !== null
      )
      const host = editor?.parentElement ?? document
      const caret = host.querySelector('.desk-block-boundary-caret')
      const blockClass = (caret?.dataset.boundaryBlock ?? '').split(/\s+/)[0]
      const block = blockClass ? editor?.querySelector(`.${blockClass}`) : null
      if (!caret || !block) return null
      const caretRect = caret.getBoundingClientRect()
      const blockRect = block.getBoundingClientRect()
      return {
        side: caret.dataset.side ?? null,
        outsideLeft: Math.round(blockRect.left - caretRect.right),
        outsideRight: Math.round(caretRect.left - blockRect.right),
        topGap: Math.round(caretRect.top - blockRect.top),
        bottomGap: Math.round(blockRect.bottom - caretRect.bottom),
        blockWidth: Math.round(blockRect.width),
        blockHeight: Math.round(blockRect.height),
        caretColor: getComputedStyle(caret).backgroundColor,
        caretHeight: Math.round(caretRect.height),
        theme: document.documentElement.dataset.theme ?? '(none)'
      }
    })

  /** 光标附近的近距离截图：验收「看得清、不压内容」用。 */
  const caretCloseUp = async (file) => {
    const clip = await page.evaluate(() => {
      const editor = [...document.querySelectorAll('.ProseMirror')].find(
        (el) => el.offsetParent !== null
      )
      const host = editor?.parentElement ?? document
      const caret = host.querySelector('.desk-block-boundary-caret')
      if (!caret) return null
      const rect = caret.getBoundingClientRect()
      return {
        x: Math.max(0, Math.round(rect.left - 90)),
        y: Math.max(0, Math.round(rect.top - 30)),
        width: 220,
        height: 110
      }
    })
    if (clip) await page.screenshot({ path: join(shots, file), clip })
  }

  const press = async (key, times = 1) => {
    for (let index = 0; index < times; index += 1) {
      await page.keyboard.press(key)
      await page.waitForTimeout(220)
    }
  }
  const clickHeading = async (text) => {
    await page
      .locator('.ProseMirror h1:visible, .ProseMirror h2:visible, .ProseMirror h3:visible', {
        hasText: text
      })
      .first()
      .click()
    await page.waitForTimeout(150)
  }
  const clickParagraph = async (text) => {
    await page.locator('.ProseMirror p:visible', { hasText: text }).first().click()
    await page.waitForTimeout(150)
  }
  /** 把光标放到「中间段」末尾，然后 ↓ 到它下方第一个停靠点。 */
  const gotoBoundaryBefore = async (text) => {
    await clickParagraph(text)
    await page.keyboard.press('End')
    await page.waitForTimeout(150)
    await press('ArrowDown')
  }

  // T1 → T2：段落 ↓ 落到代码块前光标
  await gotoBoundaryBefore('上一段')
  let current = await state()
  record(
    'T2 段落 ↓ → 代码块前光标（不落光标进块、也不整块选中）',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // T2 → T3：再 ↓ 进 CodeMirror 首行
  await press('ArrowDown')
  current = await state()
  record(
    'T3 块前 ↓ → 进 CodeMirror 首行',
    current.cmFocus && current.text?.includes('const') && current.text?.endsWith('@0'),
    JSON.stringify({ cmFocus: current.cmFocus, text: current.text })
  )

  // T3 → T4：↓ 走到末行行尾（CM 自己移动）
  await press('ArrowDown')
  await press('End')
  current = await state()
  record(
    'T4 CM 内 ↓+End → 末行行尾（CM 自己移动）',
    current.cmFocus && (current.text?.startsWith('SPAN:') ?? false),
    JSON.stringify({ text: current.text })
  )

  // T4 → T5：末行行尾按一次 ↓ 出块
  // （我们的 CM 文档末尾没有空行——markdown 里 fence 的收尾换行不属于代码内容——
  //   所以末行行尾一次 ↓ 就出块；Yuque 的「两次 ↓」来自它有一个末尾空行。）
  await press('ArrowDown')
  current = await state()
  record(
    'T5 末行行尾 ↓ → 块后光标',
    current.side === 'after' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  await caretCloseUp('block-tail-caret.png')
  const afterBox = await caretBox()
  record(
    '块尾光标在块右下外侧（不压内容、底边对齐）',
    afterBox != null &&
      afterBox.outsideRight >= 2 &&
      afterBox.outsideRight <= 8 &&
      afterBox.outsideLeft < 0 &&
      afterBox.blockWidth > 0 &&
      Math.abs(afterBox.bottomGap) <= 2,
    JSON.stringify(afterBox)
  )

  // T5 → T6：↓ 进下一段
  await press('ArrowDown')
  current = await state()
  record(
    'T6 块后 ↓ → 下一段开头',
    current.side === null &&
      (current.text?.includes('中间段') ?? false) &&
      current.text?.endsWith('@0'),
    JSON.stringify({ text: current.text })
  )

  // ←/→ 与 ↑/↓ 的差别：→ 一次就从末行穿出、← 一次就从首行穿出
  await gotoBoundaryBefore('上一段')
  await press('ArrowDown')
  await press('ArrowDown')
  await press('End')
  await press('ArrowRight')
  current = await state()
  record(
    '→ 从 CM 末行一次穿出到块后光标',
    current.side === 'after' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowUp')
  await press('ArrowUp')
  await press('ArrowUp')
  current = await state()
  record(
    '↑ 从 CM 首行一次穿回块前光标',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  const beforeBox = await caretBox()
  record(
    '块头光标在块左上外侧（不压内容、顶边对齐）',
    beforeBox != null &&
      beforeBox.outsideLeft >= 2 &&
      beforeBox.outsideLeft <= 8 &&
      beforeBox.outsideRight < 0 &&
      beforeBox.blockWidth > 0 &&
      Math.abs(beforeBox.topGap) <= 2,
    JSON.stringify(beforeBox)
  )

  await press('ArrowDown')
  await press('ArrowLeft')
  current = await state()
  record(
    '← 在 CM 首行一次穿回块前光标',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // 表格：块前 ↓ 直接到块后，→ 进第一格；末行 ↓ 到块后，块后 ← 进最后一格
  await gotoBoundaryBefore('中间段')
  current = await state()
  record(
    '表格前光标（中间段 ↓）',
    current.side === 'before' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowDown')
  current = await state()
  record(
    '表格块前 ↓ → 直接到表格后光标',
    current.side === 'after' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowUp')
  current = await state()
  record(
    '表格块后 ↑ → 回到表格前光标',
    current.side === 'before' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowRight')
  current = await state()
  record(
    '表格块前 → → 进第一个单元格（列 A）',
    current.side === null && current.inTable && (current.text?.includes('列 A') ?? false),
    JSON.stringify({ text: current.text, inTable: current.inTable })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '表格内 ↓ → 下一行（A1）',
    current.inTable && (current.text?.includes('A1') ?? false),
    JSON.stringify(current.text)
  )
  await press('ArrowDown')
  current = await state()
  record(
    '表格末行 ↓ → 表格后光标',
    current.side === 'after' && current.caretParent.includes('table'),
    JSON.stringify(current.side)
  )
  await press('ArrowLeft')
  current = await state()
  record(
    '表格块后 ← → 进最后一个单元格（B1）',
    current.side === null && current.inTable && (current.text?.includes('B1') ?? false),
    JSON.stringify({ text: current.text, inTable: current.inTable })
  )
  await press('ArrowUp')
  await press('ArrowUp')
  current = await state()
  record(
    '表格首行 ↑ → 表格前光标',
    current.side === 'before' && current.caretParent.includes('table'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // 只读块（足迹）：块前 ↓ 一步穿到块后，再 ↓ 到尾段
  await clickParagraph('尾段')
  await page.keyboard.press('Home')
  await page.waitForTimeout(150)
  await press('ArrowUp')
  current = await state()
  record(
    '尾段 ↑ → 足迹块后光标',
    current.side === 'after' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowUp')
  current = await state()
  record(
    '足迹块后 ↑ → 足迹块前光标',
    current.side === 'before' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '只读组件（足迹）块前 ↓ → 一步穿到块后光标',
    current.side === 'after' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '足迹块后 ↓ → 尾段开头',
    current.side === null && (current.text?.includes('尾段') ?? false),
    JSON.stringify(current.text)
  )

  // 回归：标题 ↓ → 独立图片段落的块前光标。
  // 曾把光标元素 append 进可编辑 DOM：独立图片段落是普通 paragraph，PM 的
  // DOMObserver 把多出来的子节点当成 DOM 变更，readDOMChange 立刻把选区重置回
  // 文本光标并抹掉光标元素 —— 表现就是「按 ↓ 没反应」。
  await clickHeading('图片区')
  await page.keyboard.press('End')
  await page.waitForTimeout(150)
  await press('ArrowDown')
  current = await state()
  record(
    '标题 ↓ → 独立图片段落块前光标',
    current.side === 'before' && current.caretParent.includes('desk-standalone-image'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await page.waitForTimeout(400)
  current = await state()
  record(
    '块前光标在图片段落上稳定存在（没被 PM 重置）',
    current.side === 'before' && current.caretParent.includes('desk-standalone-image'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await caretCloseUp('block-head-caret.png')
  // 闪烁曲线：VSCode 那种「呼吸」——亮 → 淡出 → 熄灭 → 循环点亮。
  // 采样一轮动画，必须同时出现接近全亮、接近全灭和中间过渡值；
  // 硬切换（steps）会因为采不到中间值而失败。
  const breathe = await page.evaluate(async () => {
    const caret = document.querySelector('.desk-block-boundary-caret')
    if (!caret) return null
    const style = getComputedStyle(caret)
    // 轮询到「看到全亮 + 全灭 + 中间过渡」为止（最多 2.5s）：并发跑时 rAF/定时器
    // 会被拖慢，固定采样次数容易采不到。
    let max = 0
    let min = 1
    let between = 0
    const started = performance.now()
    while (performance.now() - started < 2500) {
      const value = Number(getComputedStyle(caret).opacity)
      if (value > max) max = value
      if (value < min) min = value
      if (value > 0.15 && value < 0.85) between += 1
      if (max >= 0.95 && min <= 0.05 && between >= 2) break
      await new Promise((resolve) => setTimeout(resolve, 40))
    }
    return {
      name: style.animationName,
      timing: style.animationTimingFunction,
      delay: style.animationDelay,
      iterations: style.animationIterationCount,
      max,
      min,
      between
    }
  })
  record(
    '边界光标与文本光标同一套呼吸曲线（1s 线性、落位后 0.5s 实心、有中间过渡）',
    breathe != null &&
      // Vue scoped CSS 会给 keyframes 加哈希后缀，只断言前缀。
      breathe.name.startsWith('desk-block-boundary-caret-breathe') &&
      breathe.timing === 'linear' &&
      breathe.delay === '0.5s' &&
      breathe.iterations === 'infinite' &&
      breathe.max >= 0.95 &&
      breathe.min <= 0.05 &&
      breathe.between >= 2,
    JSON.stringify(breathe)
  )
  const imageBox = await caretBox()
  record(
    '图片块头光标在图片块左上外侧（不再压在图片上）',
    imageBox != null &&
      imageBox.side === 'before' &&
      imageBox.outsideLeft >= 2 &&
      imageBox.outsideLeft <= 8,
    JSON.stringify(imageBox)
  )
  await press('ArrowDown')
  current = await state()
  record(
    '图片块前 ↓ → 块后光标（图片不可进内部）',
    current.side === 'after' && current.caretParent.includes('desk-standalone-image'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )
  await press('ArrowDown')
  current = await state()
  record(
    '图片块后 ↓ → 图片后段落开头',
    current.side === null && (current.text?.includes('图片后段落') ?? false),
    JSON.stringify(current.text)
  )

  // 相邻代码块（中间没有空行）：↓ 进得去，↑ 也必须原路回来。
  const firstFence = pm.locator(':scope > .milkdown-code-block', { hasText: 'const first = 1' })
  const secondFence = pm.locator(':scope > .milkdown-code-block', { hasText: 'color: red' })
  /** 编辑器里是否还有代码编辑器画的光标（边界光标期间必须只有一根线）。 */
  const codeMirrorCursors = () =>
    page.evaluate(() => {
      const cursors = [...document.querySelectorAll('.cm-editor .cm-cursor')]
      const visible = cursors.filter((element) => {
        const style = getComputedStyle(element)
        return (
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          element.getBoundingClientRect().width > 0
        )
      })
      const content = [...document.querySelectorAll('.cm-editor .cm-content')].find(
        (element) => element.offsetParent !== null
      )
      return {
        domCursors: cursors.length,
        visibleCursors: visible.length,
        caretColor: content ? getComputedStyle(content).caretColor : 'none'
      }
    })

  /** 边界光标是否真的画出来了（display 不为 none 且有尺寸）。 */
  const caretVisible = () =>
    page.evaluate(() => {
      const caret = document.querySelector('.desk-block-boundary-caret')
      if (!caret) return false
      const style = getComputedStyle(caret)
      const rect = caret.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0
    })

  /** 连按方向键直到落到指定侧的边界光标（CM 末尾是否有空行会让 ↓ 次数差一次）。 */
  const pressUntilCaret = async (key, side, max = 4) => {
    let current = await state()
    for (let index = 0; index < max && current.side !== side; index += 1) {
      await press(key)
      current = await state()
    }
    return current
  }
  const enterCodeStart = async (block) => {
    const content = block.locator('.cm-content:visible')
    await content.click()
    await page.keyboard.press('ControlOrMeta+Home')
    await page.waitForTimeout(200)
  }
  const enterCodeEnd = async (block) => {
    // 直接点最后一行 + End：比 ControlOrMeta+End 稳（后者在 CM 里偶尔不生效）。
    await block.locator('.cm-line:visible').last().click()
    await page.keyboard.press('End')
    await page.waitForTimeout(200)
  }

  await enterCodeEnd(firstFence)
  current = await pressUntilCaret('ArrowDown', 'after')
  const afterVisible = await caretVisible()
  record(
    '相邻块 ↓：第一块末行 → 第一块块后光标（CM 有焦点时也要可见）',
    current.side === 'after' &&
      current.caretParent.startsWith('milkdown-code-block') &&
      afterVisible,
    JSON.stringify({ side: current.side, parent: current.caretParent, visible: afterVisible })
  )
  current = await pressUntilCaret('ArrowDown', 'before')
  const beforeVisible = await caretVisible()
  const cmCursors = await codeMirrorCursors()
  record(
    '相邻块 ↓：→ 第二块块前光标（只有一根线：不许 CM 再画一个光标）',
    current.side === 'before' &&
      current.caretParent.startsWith('milkdown-code-block') &&
      beforeVisible &&
      cmCursors.visibleCursors === 0,
    JSON.stringify({
      side: current.side,
      parent: current.caretParent,
      visible: beforeVisible,
      ...cmCursors
    })
  )
  await page.screenshot({ path: join(shots, 'adjacent-block-boundary.png') })
  await press('ArrowDown')
  current = await state()
  const enteredCursors = await codeMirrorCursors()
  record(
    '相邻块 ↓：→ 进入第二块 CM（此时 CM 自己的光标要回来）',
    current.cmFocus === true && enteredCursors.visibleCursors > 0,
    JSON.stringify({ text: current.text, ...enteredCursors })
  )

  await enterCodeStart(secondFence)
  await press('ArrowUp')
  current = await state()
  record(
    '相邻块 ↑：第二块首行 → 第二块块前光标',
    current.side === 'before' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent, cmFocus: current.cmFocus })
  )
  await press('ArrowUp')
  current = await state()
  record(
    '相邻块 ↑：→ 第一块块后光标',
    current.side === 'after' && current.caretParent.startsWith('milkdown-code-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent, cmFocus: current.cmFocus })
  )
  await press('ArrowUp')
  current = await state()
  record('相邻块 ↑：→ 回到第一块 CM', current.cmFocus === true, JSON.stringify(current.text))

  // 代码组（raw block 包着 CodeMirror 标签页）：进块后 PM 选区会一直停在
  // 块边界光标上，曾经出现「边界光标钉在块左上角不动、CM 里看不到光标」的假死感。
  await clickHeading('代码组')
  await page.keyboard.press('End')
  await press('ArrowDown')
  current = await state()
  const groupBeforeCursors = await codeMirrorCursors()
  const groupBeforeAttr = await page.evaluate(() => {
    const editor = document.querySelector('.ProseMirror')
    return {
      boundary: editor?.getAttribute('data-boundary-caret') ?? null,
      codeKeyboard: editor?.hasAttribute('data-code-keyboard') ?? null
    }
  })
  record(
    '代码组 ↓ → 块前光标（此时藏起 CM 的光标）',
    current.side === 'before' &&
      current.caretParent.includes('desk-raw-block') &&
      groupBeforeCursors.visibleCursors === 0 &&
      groupBeforeAttr.boundary === 'before' &&
      groupBeforeAttr.codeKeyboard === false,
    JSON.stringify({
      side: current.side,
      parent: current.caretParent,
      ...groupBeforeAttr,
      ...groupBeforeCursors
    })
  )

  await press('ArrowDown')
  current = await state()
  const groupEnteredCursors = await codeMirrorCursors()
  const groupEnteredState = await page.evaluate(() => {
    const caret = document.querySelector('.desk-block-boundary-caret')
    const editor = document.querySelector('.ProseMirror')
    return {
      boundaryHidden: !caret || getComputedStyle(caret).display === 'none',
      codeKeyboard: editor?.hasAttribute('data-code-keyboard') ?? null
    }
  })
  record(
    '代码组 进 CM：CM 自己的光标可见、边界光标隐藏',
    current.cmFocus === true &&
      groupEnteredCursors.visibleCursors > 0 &&
      groupEnteredState.boundaryHidden &&
      groupEnteredState.codeKeyboard === true,
    JSON.stringify({ text: current.text, ...groupEnteredState, ...groupEnteredCursors })
  )

  const groupEntryText = current.text
  await press('ArrowDown')
  current = await state()
  record(
    '代码组 CM 内 ↓ → 光标在代码里后移（不会钉在块边界上）',
    current.cmFocus === true && current.text !== groupEntryText && !/@0$/.test(current.text ?? ''),
    JSON.stringify({ before: groupEntryText, after: current.text })
  )

  current = await pressUntilCaret('ArrowDown', 'after')
  record(
    '代码组 ↓ 末行 → 块后光标',
    current.side === 'after' && current.caretParent.includes('desk-raw-block'),
    JSON.stringify({ side: current.side, parent: current.caretParent })
  )

  // 未编辑：导航不产生任何 markdown 变更
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(700)
  record('纯导航 + 保存 → 文件字节零 diff', readFileSync(noteFile, 'utf8') === source)
  await page.screenshot({ path: join(shots, 'boundary-nav.png') })
  record('导航过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 200))

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
