// Asset pane: scan → rename (mindmap) → recycle → restore.
// Isolated temporary KB/profile. Verifies built `out/` — run electron-vite build first.
import assert from 'node:assert/strict'
import { _electron } from 'playwright-core'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-kb-assets-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'TNotes.assets-e2e')
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)
const shots = join(deskDir, 'scripts', 'shots', 'kb-assets')
mkdirSync(join(kb, 'notes'), { recursive: true })
mkdirSync(join(kb, 'assets', 'nested'), { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })
writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'assets-e2e' }))
writeFileSync(join(kb, 'TOC.md'), '- [ ] 0001. 图\n')
writeFileSync(join(kb, 'assets', 'used.png'), png)
writeFileSync(join(kb, 'assets', 'idle.png'), png)
writeFileSync(join(kb, 'assets', 'mindmap.png'), png)
writeFileSync(join(kb, 'assets', 'nested', 'deep.png'), png)
writeFileSync(
  join(kb, 'notes', '0001. 图.md'),
  `---
id: note-writable
---

# 图

![宽图](../assets/used.png) {w=400px}

[下载](../assets/used.png?download=1#frag)

![深层](../assets/nested/deep.png)

\`\`\`mindmap [图]
# root

- ![截图|400](./assets/mindmap.png)
\`\`\`
`
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

async function waitFor(check, timeoutMs = 10000, intervalMs = 120) {
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
  env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: 'true' }
})

try {
  const page = await app.firstWindow({ timeout: 30000 })
  await page.waitForLoadState('domcontentloaded')
  await page.getByText('assets-e2e', { exact: true }).first().click()
  await page.waitForTimeout(800)

  await page.keyboard.press('ControlOrMeta+Shift+p')
  const palette = page.locator('.command-palette__input')
  await palette.waitFor({ timeout: 10000 })
  await palette.fill('>open-kb-assets')
  await page.locator('.command-palette__item', { hasText: '资源' }).first().click()
  await page.locator('.kb-assets-pane').waitFor({ timeout: 15000 })
  await page.locator('.file-row', { hasText: 'assets/used.png' }).waitFor({ timeout: 20000 })
  await page.screenshot({ path: join(shots, 'scanned.png') })

  await page.locator('.file-row', { hasText: 'assets/used.png' }).click()
  await page.getByRole('button', { name: '重命名', exact: true }).click()
  await page.locator('.rename-dest').fill('assets/renamed.png')
  await page.locator('.kb-assets-dialog footer .save-button').click()
  await page.getByText('引用补丁').waitFor({ timeout: 15000 })
  await page.locator('.kb-assets-dialog footer .save-button').click()
  await page.locator('.kb-assets-dialog').waitFor({ state: 'detached', timeout: 20000 })
  await page.locator('.file-row', { hasText: 'assets/renamed.png' }).waitFor({ timeout: 20000 })
  // 面板是乐观更新：列表先换名，磁盘写入/引用补丁随后才落地（CI 上偶发差一拍）。
  const renamedWritten = await waitFor(
    () =>
      existsSync(join(kb, 'assets', 'renamed.png')) && !existsSync(join(kb, 'assets', 'used.png')),
    10000
  )
  assert.equal(Boolean(renamedWritten), true, '重命名应在磁盘上生效（新名在、旧名不在）')
  const note = await waitFor(() => {
    const text = readFileSync(join(kb, 'notes', '0001. 图.md'), 'utf8')
    return /\.\.\/assets\/renamed\.png\) \{w=400px\}/.test(text) &&
      /\.\/assets\/mindmap\.png/.test(text)
      ? text
      : null
  }, 10000)
  assert.ok(note, '笔记里的图片引用应同步改写（含 {w=400px} 与 mindmap 相对路径）')
  assert.match(note, /\.\.\/assets\/renamed\.png\) \{w=400px\}/)
  assert.match(note, /\.\/assets\/mindmap\.png/)

  await page.locator('.file-row', { hasText: 'assets/idle.png' }).click()
  await page.getByRole('button', { name: '移入回收区', exact: true }).click()
  await page.locator('.kb-assets-dialog footer .save-button').click()
  await page.locator('.kb-assets-dialog').waitFor({ state: 'detached', timeout: 20000 })
  assert.equal(existsSync(join(kb, 'assets', 'idle.png')), false)

  await page.getByRole('button', { name: '历史', exact: true }).click()
  await page.locator('.history-row').first().waitFor({ timeout: 10000 })
  await page.locator('.history-row .ghost').first().click()
  await page.locator('.kb-assets-dialog footer .save-button').click()
  await page.locator('.kb-assets-dialog').waitFor({ state: 'detached', timeout: 20000 })
  assert.equal(existsSync(join(kb, 'assets', 'idle.png')), true)
  await page.screenshot({ path: join(shots, 'restored.png') })
} finally {
  await app.close()
  rmSync(fixture, { recursive: true, force: true })
}
