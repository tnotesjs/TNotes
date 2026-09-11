// E9 画布与 Git 调度：文件级实时写入不等于每画一步就 commit/push；
// 画布内容变化也不该改动笔记源码。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-excalidraw-git.mjs
import { _electron } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-canvas-git-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'canvas-git')
const notes = join(kb, 'notes')
const assets = join(kb, 'assets')
const canvasPath = join(assets, '0001-drawing.excalidraw')
const notePath = join(notes, '0001. 画布.md')
const shots = join(deskDir, 'scripts', 'shots', 'excalidraw-git')
mkdirSync(notes, { recursive: true })
mkdirSync(assets, { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

const SCENE = `${JSON.stringify(
  {
    type: 'excalidraw',
    version: 2,
    source: 'desk-git-fixture',
    elements: [
      {
        id: 'rect-1',
        type: 'rectangle',
        x: 60,
        y: 40,
        width: 180,
        height: 100,
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
  `${JSON.stringify({ name: 'canvas-git', title: 'canvas-git' })}\n`
)
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. 画布\n')
writeFileSync(join(kb, '.gitignore'), 'node_modules/\n.tnotes/dist\n.DS_Store\n')
writeFileSync(
  notePath,
  [
    '---',
    'id: 99999999-9999-4999-8999-999999999999',
    '---',
    '',
    '# 画布',
    '',
    '<Excalidraw path="../assets/0001-drawing.excalidraw" />',
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

const git = (...args) =>
  execFileSync('git', args, { cwd: kb, encoding: 'utf8', env: { ...process.env } }).trim()
git('init', '-q')
git('config', 'user.email', 'desk@example.com')
git('config', 'user.name', 'Desk Test')
git('add', '-A')
git('commit', '-q', '-m', 'fixture: 初始状态')
const commitsBefore = git('rev-list', '--count', 'HEAD')
const noteBefore = readFileSync(notePath, 'utf8')

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}
const countElements = () => {
  try {
    return JSON.parse(readFileSync(canvasPath, 'utf8')).elements.length
  } catch {
    return -1
  }
}

async function waitFor(check, timeoutMs = 10000, intervalMs = 150) {
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
  await page.getByText('canvas-git', { exact: true }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('.toc-row', { hasText: '画布' }).first().click()
  const card = page.locator('.desk-excalidraw:visible').first()
  await card.waitFor({ timeout: 20000 })
  await page.waitForTimeout(800)
  await card.locator('[data-action="edit"]').click()
  const canvas = page.locator('.desk-excalidraw:visible .excalidraw__canvas.interactive')
  await canvas.waitFor({ timeout: 60000 })
  await page.waitForTimeout(1200)

  record('前置：Git 仓库干净', git('status', '--porcelain') === '', git('status', '--porcelain'))

  // 画一笔 → 文件实时写盘，但不产生提交
  await page
    .locator('.desk-excalidraw:visible [data-testid="toolbar-rectangle"]')
    .first()
    .click({ force: true })
  const box = await canvas.boundingBox()
  const x = box.x + box.width * 0.5
  const y = box.y + box.height * 0.3
  await page.mouse.move(x, y, { steps: 4 })
  await page.waitForTimeout(150)
  await page.mouse.down()
  await page.waitForTimeout(100)
  for (let step = 1; step <= 4; step += 1) {
    await page.mouse.move(x + step * 26, y + step * 16)
    await page.waitForTimeout(80)
  }
  await page.mouse.up()
  const written = await waitFor(() => countElements() === 2)
  record('画布编辑实时写盘（元素 1 → 2）', Boolean(written), `elements=${countElements()}`)

  await page.waitForTimeout(1500)
  const commitsAfter = git('rev-list', '--count', 'HEAD')
  record(
    '自动写入不产生 Git 提交（沿用原有调度）',
    commitsAfter === commitsBefore,
    `commits ${commitsBefore} → ${commitsAfter}`
  )
  const status = git('status', '--porcelain')
  record(
    '改动只体现在工作区（画布文件待提交）',
    /^\s?M\s+assets\/0001-drawing\.excalidraw$/m.test(status),
    JSON.stringify(status)
  )
  record('画布内容变化不改笔记源码', readFileSync(notePath, 'utf8') === noteBefore, '')
  record('全流程无页面错误', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '))
  await page.screenshot({ path: join(shots, 'edited-with-git.png') })
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
