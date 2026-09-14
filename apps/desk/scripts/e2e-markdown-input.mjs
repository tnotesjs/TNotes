// Runtime regression for todos 2026.08.29/0001-0003.
// It creates an isolated temporary knowledge base, so editor autosave never
// touches desk/playground or a user's real notes.
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
const fixtureRoot = mkdtempSync(join(tmpdir(), 'desk-markdown-input-e2e-'))
const workspace = join(fixtureRoot, 'workspace')
const profile = join(fixtureRoot, 'profile')
const kb = join(workspace, 'TNotes.input-e2e')
const noteFile = join(kb, 'notes', '0001. input-rules.md')
const shots = join(deskDir, 'scripts', 'shots', 'markdown-input')

mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

writeFileSync(join(kb, 'tnotes.json'), `${JSON.stringify({ title: 'input-e2e' }, null, 2)}\n`)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. input-rules\n')
writeFileSync(
  noteFile,
  '---\nid: 10000000-0000-4000-8000-000000000002\n---\n\n# Input rules\n\n测试起点\n'
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

const results = []
/** @param {string} name @param {string} detail @returns {void} */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const record = (name, detail = '') => {
  results.push({ name, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

try {
  const page = await app.firstWindow({ timeout: 30000 })
  await page.waitForLoadState('domcontentloaded')
  await page.getByText('input-e2e', { exact: true }).first().waitFor({ timeout: 30000 })
  await page.getByText('input-e2e', { exact: true }).first().click()
  await page.getByText('input-rules', { exact: true }).first().click()
  const pm = page.locator('.milkdown .ProseMirror').first()
  await pm.waitFor({ timeout: 30000 })

  const menu = page.locator('.milkdown-slash-menu')
  /** @returns {Promise<import('playwright-core').Locator>} */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const focusEmptyParagraph = async () => {
    let last = pm.locator(':scope > p').last()
    await last.click()
    await page.keyboard.press('End')
    if ((await last.textContent())?.length) {
      await page.keyboard.press('Enter')
      last = pm.locator(':scope > p').last()
      await last.waitFor()
    }
    await last.click()
    return last
  }
  /** @returns {Promise<void>} */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const finishRawEditor = async () => {
    await page.locator('.desk-raw-block__editor-done:visible').last().click()
    await page.waitForTimeout(80)
  }
  /** @param {import('playwright-core').Locator} raw @returns {Promise<string>} */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const rawSource = async (raw) =>
    raw.evaluate((element) => {
      const encoded = element.getAttribute('data-source') ?? ''
      const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    })
  /** @param {import('playwright-core').Locator} raw @returns {Promise<void>} */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /** 结构化 Mermaid 的源码编辑器不会自动聚焦，只要求「已打开且可点击聚焦」。 */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const expectSourceEditorOpened = async (raw) => {
    const sourceEditor = raw.locator('.desk-raw-block__editor:not([hidden]) .cm-content')
    await sourceEditor.waitFor({ timeout: 5000 })
    await sourceEditor.click()
    assert.equal(
      await sourceEditor.evaluate((element) => element.contains(document.activeElement)),
      true
    )
  }
  // 0001: slash eligibility and alias search.
  await focusEmptyParagraph()
  await page.keyboard.type('abc/')
  await page.waitForTimeout(100)
  assert.equal(await menu.isVisible(), false)
  record('slash does not open inside non-empty paragraph')

  await focusEmptyParagraph()
  await page.keyboard.type(' /')
  await page.waitForTimeout(100)
  assert.equal(await menu.isVisible(), false)
  record('slash does not open after leading whitespace')

  await focusEmptyParagraph()
  await page.keyboard.type('- ')
  await page.keyboard.type('/')
  await page.waitForTimeout(100)
  assert.equal(await menu.isVisible(), false)
  assert.equal((await pm.locator('li').last().textContent())?.trim(), '/')
  record('slash does not open in a list item')

  await focusEmptyParagraph()
  await page.keyboard.type('/ mmd ')
  await menu.waitFor({ state: 'visible' })
  const visibleItems = await menu.locator('li[data-index]').allTextContents()
  assert.equal(
    visibleItems.some((text) => text.includes('Mermaid')),
    true
  )
  assert.equal(
    visibleItems.some((text) => text.includes('思维导图')),
    false
  )
  assert.equal(
    await menu
      .locator('li[data-index]')
      .filter({ hasText: 'Mermaid' })
      .locator(':scope > span:not(.milkdown-icon):not(.desk-slash-menu__shortcut)')
      .textContent(),
    'Mermaid'
  )
  await page.screenshot({ path: join(shots, '01-slash-alias-search.png') })
  await menu.locator('li[data-index]').filter({ hasText: 'Mermaid' }).click()
  const slashDiagram = page.locator('[data-type="desk-raw-block"][data-kind="raw-diagram"]').last()
  assert.equal(await rawSource(slashDiagram), '```mermaid\n\n```\n')
  assert.equal(
    (await slashDiagram.locator('.tn-mermaid__empty').textContent())?.trim(),
    '输入 Mermaid 源码后显示预览'
  )
  assert.equal(await slashDiagram.locator('.tn-mermaid__error').count(), 0)
  await expectSourceEditorOpened(slashDiagram)
  record('trimmed mmd alias inserts canonical Mermaid and focuses source at offset 0')
  await finishRawEditor()

  await focusEmptyParagraph()
  await page.keyboard.type('/tip')
  await menu.waitFor({ state: 'visible' })
  await menu.locator('li[data-index]').filter({ hasText: '提示块' }).click()
  // 提示块按设计插成结构化 deskCallout（不再投影成 raw container / 没有 data-source）
  const slashTip = page.locator('[data-type="desk-callout"][data-callout="tip"]').last()
  await slashTip.waitFor()
  assert.equal(await slashTip.getAttribute('data-title'), '💡 TIP')
  assert.equal(await slashTip.getAttribute('data-open-colons'), ':::')
  await page.screenshot({ path: join(shots, '02-slash-tip-source-editor.png') })
  record('tip slash item inserts a structured callout with the canonical title')

  await focusEmptyParagraph()
  await page.keyboard.type('/bilibili')
  await menu.waitFor({ state: 'visible' })
  await menu.locator('li[data-index]').filter({ hasText: 'B站视频' }).click()
  const slashComponent = page
    .locator('[data-type="desk-raw-block"][data-kind="raw-component"]')
    .last()
  assert.equal(await rawSource(slashComponent), '<BilibiliVideo id="" />\n')
  // Structured BVID field opens automatically after slash insert.
  const idInput = slashComponent.locator('.desk-raw-block__editor-title')
  await idInput.waitFor()
  await idInput.fill('BV1E2E')
  await slashComponent.locator('.desk-raw-block__editor-done').click()
  await page.waitForTimeout(100)
  assert.equal(await rawSource(slashComponent), '<BilibiliVideo id="BV1E2E" />\n')
  record('component BilibiliVideo inserts canonical tag and commits BVID edits')

  await focusEmptyParagraph()
  await page.keyboard.type('/code')
  await menu.waitFor({ state: 'visible' })
  const codeMatches = await menu.locator('li[data-index]').allTextContents()
  assert.equal(
    codeMatches.some((text) => text.includes('代码块')),
    true
  )
  assert.equal(
    codeMatches.some((text) => text.includes('代码组')),
    true
  )
  await menu.locator('li[data-index]').filter({ hasText: '代码块' }).click()
  const codeBlock = page.locator('.milkdown-code-block').last()
  await codeBlock.waitFor({ timeout: 5000 })
  const codeContent = codeBlock.locator('.cm-content')
  assert.equal((await codeContent.textContent())?.includes('/'), false)
  assert.equal(
    await codeContent.evaluate((element) => element.contains(document.activeElement)),
    true
  )
  record('code slash item clears /query and focuses an empty code block')

  // 0002: Enter and Space block shortcuts.
  await focusEmptyParagraph()
  await page.keyboard.type(':::TIP')
  await page.keyboard.press('Enter')
  const shortcutTip = page.locator('[data-type="desk-callout"][data-callout="tip"]').last()
  await shortcutTip.waitFor()
  assert.equal(await shortcutTip.getAttribute('data-title'), '💡 TIP')
  record(':::TIP Enter uses the shared canonical tip insert')

  // 复制提示块里的文字再粘贴：不能凭空长出一个提示块（ProseMirror 的 data-pm-slice
  // 会记下「复制时所在的容器」，粘贴时按它重新包一个 —— 规则见 markdown/pasteContext.ts）
  const pasteCallout = page.locator('[data-type="desk-callout"][data-callout="tip"]').last()
  await pasteCallout.locator('.custom-block-body p').first().click()
  await page.keyboard.type('错误块正文。')
  await focusEmptyParagraph()
  await pasteCallout.locator('.custom-block-body').evaluate((element) => {
    const range = document.createRange()
    range.selectNodeContents(element)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  })
  await page.keyboard.press('Meta+c')
  await page.waitForTimeout(200)
  const pastedInto = await focusEmptyParagraph()
  await page.keyboard.press('Meta+v')
  await page.waitForTimeout(400)
  assert.equal(await page.locator('[data-type="desk-callout"]').count(), 2)
  assert.equal((await pastedInto.textContent())?.includes('错误块正文。'), true)
  assert.equal(await pastedInto.locator('[data-type="desk-callout"]').count(), 0)
  record('复制提示块内的文字粘贴到正文：得到文字，不会长出提示块')

  await focusEmptyParagraph()
  await page.keyboard.type('```mmd ')
  const shortcutDiagram = page
    .locator('[data-type="desk-raw-block"][data-kind="raw-diagram"]')
    .last()
  assert.equal(await rawSource(shortcutDiagram), '```mermaid\n\n```\n')
  await shortcutDiagram.locator('.tn-mermaid__empty').waitFor()
  assert.equal(await shortcutDiagram.locator('.tn-mermaid__empty').count(), 1)
  assert.equal(await shortcutDiagram.locator('.tn-mermaid__error').count(), 0)
  await expectSourceEditorOpened(shortcutDiagram)
  record('```mmd Space wins over the generic code-fence rule')
  await finishRawEditor()

  await focusEmptyParagraph()
  await page.keyboard.type('::: tip')
  await page.keyboard.press('Enter')
  const literalContainer = pm.locator('p').filter({ hasText: '::: tip' }).last()
  assert.equal((await literalContainer.textContent())?.trim(), '::: tip')
  record('non-exact ::: tip remains literal')

  // 0003: literal-until-space, consumed space, non-undoable Backspace.
  const emphasisParagraph = await focusEmptyParagraph()
  await page.keyboard.type('*abc*')
  assert.equal((await emphasisParagraph.textContent())?.trim(), '*abc*')
  assert.equal(await emphasisParagraph.locator('em').count(), 0)
  await page.keyboard.type(' ')
  assert.equal(await emphasisParagraph.textContent(), 'abc')
  assert.equal(await emphasisParagraph.locator('em').textContent(), 'abc')
  await page.keyboard.press('Backspace')
  assert.equal(await emphasisParagraph.textContent(), 'ab')
  assert.equal(await emphasisParagraph.locator('em').textContent(), 'ab')
  record('*abc* waits for Space; Space is consumed; Backspace deletes marked content')

  await focusEmptyParagraph()
  await page.keyboard.type('**bold**')
  await page.keyboard.press('Enter')
  const enterLiteral = pm.locator('p').filter({ hasText: '**bold**' }).last()
  assert.equal((await enterLiteral.textContent())?.trim(), '**bold**')
  assert.equal(await enterLiteral.locator('strong').count(), 0)
  record('Enter after closing delimiters leaves literal Markdown')

  const inlineCodeParagraph = await focusEmptyParagraph()
  await page.keyboard.type('`code` ')
  assert.equal(await inlineCodeParagraph.textContent(), 'code')
  assert.equal(await inlineCodeParagraph.locator('code').textContent(), 'code')
  const mathParagraph = await focusEmptyParagraph()
  await page.keyboard.type('$x^2$ ')
  assert.equal(await mathParagraph.locator('[data-type="math_inline"]').count(), 1)
  record('inline code and math also convert only on Space')

  await page.screenshot({ path: join(shots, '03-inline-results.png') })
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(250)
  const savedMarkdown = readFileSync(noteFile, 'utf8')
  assert.equal(savedMarkdown.includes('::: tip 💡 TIP'), true)
  assert.equal(savedMarkdown.includes('```mermaid\n\n```'), true)
  assert.equal(savedMarkdown.includes('<BilibiliVideo id="BV1E2E" />'), true)
  console.log(JSON.stringify({ passed: results.length, results }, null, 2))
} finally {
  await app.close()
  rmSync(fixtureRoot, { recursive: true, force: true })
}
