// 行内 <br>（段落 + 表格单元格）在可视化视图里的正确性，以及磁盘字节的保真。
// Run: node apps/desk/scripts/e2e-inline-break.mjs   （需先 electron-vite build）
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-inline-break-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.inline-break')
const noteFile = join(kb, 'notes', '0001. inline break.md')
const shots = join(deskDir, 'scripts', 'shots', 'inline-break')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'inline-break' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. inline break\n')

const source = [
  '---',
  'id: 10000000-0000-4000-8000-000000000057',
  '---',
  '',
  '# 0001. inline break',
  '',
  '段内换行：第一行<br/>第二行',
  '',
  '| title1 | title2 | title3 第一行<br/>title3 第二行 |',
  '| --- | --- | --- |',
  '| - | - | - |',
  '',
  '| 其它内联 HTML 的表格 |',
  '| --- |',
  '| a<span>b</span> |',
  '',
  '| 普通表格 | 值 |',
  '| --- | --- |',
  '| plain | 1 |',
  '',
  '结尾段落。',
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
  await page.getByText('inline-break', { exact: true }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('.toc-row', { hasText: 'inline break' }).first().locator('.node-label').click()
  await page.locator('.ProseMirror').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(2000)

  const dom = await page.evaluate(() => {
    const pm = document.querySelector('.ProseMirror')
    const paragraph = [...pm.querySelectorAll('p')].find((el) =>
      (el.textContent ?? '').includes('段内换行')
    )
    const tables = [...pm.querySelectorAll('table')]
    const headerWithBreak = [...pm.querySelectorAll('th')].find((el) =>
      (el.textContent ?? '').includes('title3')
    )
    const spanTable = tables.find((el) => (el.textContent ?? '').includes('ab'))
    const tableSummary = tables.map((el) => ({
      text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 24),
      kind: el.closest('[data-type="desk-raw-block"]')?.dataset.kind ?? 'native',
      hidden: el.offsetParent === null
    }))
    return {
      rawKinds: [...pm.querySelectorAll('[data-type="desk-raw-block"]')].map(
        (el) => el.dataset.kind
      ),
      tableSummary,
      nativeTableCount: tableSummary.filter((item) => item.kind === 'native' && !item.hidden)
        .length,
      paragraphBreaks: paragraph ? paragraph.querySelectorAll('br').length : 0,
      paragraphInRawBlock: Boolean(paragraph?.closest('[data-type="desk-raw-block"]')),
      tableCount: tables.length,
      headerBreaks: headerWithBreak ? headerWithBreak.querySelectorAll('br').length : 0,
      headerHeight: headerWithBreak
        ? Math.round(headerWithBreak.getBoundingClientRect().height)
        : 0,
      spanTableIsNative: Boolean(spanTable)
    }
  })

  record(
    '段落里的行内 <br> 渲染成硬换行（不再静默丢弃）',
    dom.paragraphBreaks === 1 && !dom.paragraphInRawBlock,
    `br=${dom.paragraphBreaks} 在raw块内=${dom.paragraphInRawBlock}`
  )
  record(
    '含 <br> 的表格保持原生表格（单元格里能看到换行）',
    dom.nativeTableCount >= 2 && dom.headerBreaks === 1 && dom.headerHeight > 30,
    `原生表格=${dom.nativeTableCount} 表头 br=${dom.headerBreaks} 表头高=${dom.headerHeight} rawKinds=${JSON.stringify(dom.rawKinds)}`
  )
  record(
    '含其它内联 HTML 的表格仍隔离成 raw block（不误投影）',
    dom.rawKinds.filter((kind) => kind === 'table').length === 1 && !dom.spanTableIsNative,
    `raw table=${dom.rawKinds.filter((kind) => kind === 'table').length} 原生表=${JSON.stringify(dom.tableSummary)}`
  )

  // 打开后不做任何编辑直接保存：字节必须零 diff（未编辑块不受影响）
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(800)
  record('打开未编辑保存 → 文件字节零 diff', readFileSync(noteFile, 'utf8') === source)

  // 编辑段落：磁盘上的 break 必须还在（以前这里会静默丢掉 <br>）
  const paragraph = page.locator('.ProseMirror p', { hasText: '段内换行' }).first()
  await paragraph.click()
  await page.keyboard.press('End')
  await page.keyboard.type('X')
  await page.waitForTimeout(300)
  await page.keyboard.press('ControlOrMeta+s')
  await page.waitForTimeout(900)
  const saved = readFileSync(noteFile, 'utf8')
  const paragraphLine = saved.split('\n').find((line) => line.includes('段内换行')) ?? ''
  record(
    '编辑段落后 break 仍保留在磁盘（不再数据丢失）',
    paragraphLine.includes('第一行') && !paragraphLine.includes('第二行'),
    `段落行=${JSON.stringify(paragraphLine)}`
  )
  record(
    '表格行里的 <br> 原样保留（表格不被改写）',
    saved.includes('| title1 | title2 | title3 第一行<br/>title3 第二行 |'),
    `表格行=${JSON.stringify(saved.split('\n').find((line) => line.includes('title1')) ?? '')}`
  )
  await page.screenshot({ path: join(shots, 'inline-break.png') })
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
