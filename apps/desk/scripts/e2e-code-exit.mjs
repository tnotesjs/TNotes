// CodeMirror final-caret → note-body navigation, against an isolated KB/profile.
import assert from 'node:assert/strict'
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-code-exit-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.code-exit')
const noteFile = join(kb, 'notes', '0001. code-exit.md')
const shots = join(deskDir, 'scripts', 'shots', 'code-exit')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'code-exit' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. code-exit\n')
const markdown = [
  '# Code exit',
  '',
  '```js',
  'const nativeParagraph = 1',
  'console.log(nativeParagraph)',
  '```',
  '',
  'NATIVE-PARAGRAPH',
  '',
  '```js',
  'const nativeHeading = 1',
  'console.log(nativeHeading)',
  '```',
  '',
  '## NATIVE-HEADING',
  '',
  '::: code-group',
  '',
  '```js [inline.js]',
  'const inline = 1',
  'console.log(inline)',
  '```',
  '',
  '```js [included.js]',
  'const included = 1',
  'console.log(included)',
  '```',
  '',
  ':::',
  '',
  'GROUP-PARAGRAPH',
  '',
  '::: code-group',
  '',
  '```js [heading.js]',
  'const heading = 1',
  'console.log(heading)',
  '```',
  '',
  ':::',
  '',
  '## GROUP-HEADING',
  '',
  '```js',
  'const included = 1',
  'console.log(included)',
  '```',
  '',
  '- INCLUDE-LIST',
  '',
  '::: code-group',
  '',
  '```js [blank.js]',
  'const blank = 1',
  'console.log(blank)',
  '```',
  '',
  ':::',
  '',
  '<br />',
  '',
  'AFTER-BLANK',
  '',
  '::: code-group',
  '',
  '```js [eof.js]',
  'const eof = 1',
  'console.log(eof)',
  '```',
  '',
  ':::',
  ''
].join('\n')
const source = `---\nid: 10000000-0000-4000-8000-000000000062\n---\n\n${markdown}`
writeFileSync(noteFile, source)
writeFileSync(join(profile, 'workspace.v1.json'), JSON.stringify({ path: workspace }))
writeFileSync(
  join(profile, '.tn-desk-config.json'),
  JSON.stringify({
    version: 1,
    theme: 'dark',
    defaultNoteView: 'visual',
    prettier: false,
    autosave: { enabled: false, delayMs: 1000 }
  })
)

const app = await _electron.launch({
  executablePath: require('electron'),
  args: ['out/main/index.js', `--user-data-dir=${profile}`],
  cwd: deskDir,
  env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: 'true' }
})

try {
  const page = await app.firstWindow()
  await page.waitForLoadState('domcontentloaded')
  await page.getByText('code-exit', { exact: true }).first().click()
  await page.locator('.toc-nodes .node-label').filter({ hasText: 'code-exit' }).click()
  const pm = page.locator('.milkdown .ProseMirror')
  await pm.waitFor()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const settle = async () =>
    page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    )
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const enterEnd = async (block) => {
    const content = block.locator('.cm-content:visible')
    await content.click()
    await page.keyboard.press('ControlOrMeta+End')
    await settle()
    assert.equal(await content.evaluate((el) => el === document.activeElement), true)
  }
  /** 新模型：从代码末尾出来先落到「块后光标」，再按一次才进下一段。 */
  const assertBoundaryCaret = async (side) => {
    await page.waitForFunction(
      (expected) => document.querySelector('.desk-block-boundary-caret')?.dataset.side === expected,
      side,
      { timeout: 5000 }
    )
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const assertCaret = async (text) => {
    const actual = await page.evaluate(() => {
      const selection = window.getSelection()
      const node = selection.focusNode
      return {
        collapsed: selection.isCollapsed,
        text:
          node?.nodeType === Node.TEXT_NODE
            ? node.textContent
            : node?.textContent?.replace(/\u200b/g, ''),
        offset: selection.focusOffset,
        inNote: document.activeElement?.classList.contains('ProseMirror')
      }
    })
    assert.deepEqual(actual, { collapsed: true, text, offset: 0, inNote: true })
  }
  const groups = pm.locator(':scope > .desk-raw-block--container')
  const cases = [
    [pm.locator(':scope > .milkdown-code-block').nth(0), 'NATIVE-PARAGRAPH'],
    [pm.locator(':scope > .milkdown-code-block').nth(1), 'NATIVE-HEADING'],
    [groups.nth(0), 'GROUP-PARAGRAPH'],
    [groups.nth(1), 'GROUP-HEADING'],
    [pm.locator(':scope > .milkdown-code-block').nth(2), 'INCLUDE-LIST'],
    [groups.nth(2), '']
  ]
  for (const [block, text] of cases) {
    for (const key of ['ArrowDown', 'ArrowRight']) {
      await enterEnd(block)
      await page.keyboard.press(key)
      await settle()
      await assertBoundaryCaret('after')
      await page.keyboard.press(key)
      await settle()
      await assertCaret(text)
      console.log(`✓ ${key}: code → 块后光标 → ${text || 'empty paragraph'} start`)
    }
  }
  // The screenshot uses the second fenced tab inside a code group; test that tab too.
  await groups.nth(0).locator('.code-group-tab').filter({ hasText: 'included.js' }).click()
  for (const key of ['ArrowDown', 'ArrowRight']) {
    await enterEnd(groups.nth(0))
    await page.keyboard.press(key)
    await settle()
    await assertBoundaryCaret('after')
    await page.keyboard.press(key)
    await settle()
    await assertCaret('GROUP-PARAGRAPH')
  }
  console.log('✓ second fenced tab exits the entire code group')

  await enterEnd(groups.nth(0))
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowRight')
  assert.equal(
    await groups
      .nth(0)
      .locator('.cm-content:visible')
      .evaluate((el) => el === document.activeElement),
    true
  )
  await page.keyboard.press('Shift+ArrowLeft')
  await page.keyboard.press('Shift+ArrowDown')
  assert.equal(
    await groups
      .nth(0)
      .locator('.cm-content:visible')
      .evaluate((el) => el === document.activeElement),
    true
  )
  console.log('✓ interior movement and Shift selection retain CodeMirror focus')

  // Navigation without edits must not change canonical Markdown.
  await page.keyboard.press('ControlOrMeta+s')
  await settle()
  assert.equal(readFileSync(noteFile, 'utf8'), source)

  // A dirty inline tab flushes on blur without reclaiming focus from the paragraph.
  await groups.nth(0).locator('.code-group-tab').filter({ hasText: 'inline.js' }).click()
  await enterEnd(groups.nth(0))
  await page.keyboard.type(' // edited')
  await page.keyboard.press('ArrowRight')
  await settle()
  await assertBoundaryCaret('after')
  await page.keyboard.press('ArrowRight')
  await settle()
  await assertCaret('GROUP-PARAGRAPH')
  await page.keyboard.type('BODY-')
  await settle()
  assert.ok((await pm.innerText()).includes('BODY-GROUP-PARAGRAPH'))
  assert.ok((await groups.nth(0).locator('.cm-content:visible').innerText()).endsWith(' // edited'))
  await page.keyboard.press('ControlOrMeta+s')
  await page.locator('.dirty-dot').waitFor({ state: 'hidden' })
  assert.ok(readFileSync(noteFile, 'utf8').includes('console.log(inline) // edited'))
  assert.ok(readFileSync(noteFile, 'utf8').includes('BODY-GROUP-PARAGRAPH'))
  console.log('✓ blur preserves code edits; subsequent typing edits the following paragraph')

  await enterEnd(groups.nth(3))
  await page.keyboard.press('ArrowDown')
  await settle()
  await assertBoundaryCaret('after')
  await page.keyboard.press('ArrowDown')
  await settle()
  await assertCaret('')
  await page.keyboard.type('EOF-TEXT')
  assert.equal(await pm.locator(':scope > p').last().innerText(), 'EOF-TEXT')
  console.log('✓ final block creates an editable trailing paragraph')
  await page.screenshot({ path: join(shots, 'code-exit.png') })
} catch (error) {
  const page = await app.firstWindow()
  await page.screenshot({ path: join(shots, 'failure.png') }).catch(() => undefined)
  throw error
} finally {
  await app.close()
  rmSync(fixture, { recursive: true, force: true })
}
