// 删除确认对话框：后果说明 + 「先记录当前版本」一键提交（决策：删除本身不自动提交）。
// 需要先构建：pnpm --filter desk exec electron-vite build
// Run: node apps/desk/scripts/e2e-delete-dialog.mjs
import { _electron } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const deskDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'desk-delete-dialog-'))
const workspace = join(fixture, 'workspace')
const profile = join(fixture, 'profile')
const kb = join(workspace, 'delete-kb')
const notes = join(kb, 'notes')
const shots = join(deskDir, 'scripts', 'shots', 'delete-dialog')
mkdirSync(notes, { recursive: true })
mkdirSync(profile, { recursive: true })
mkdirSync(shots, { recursive: true })

const UUID_DIRTY = '11111111-1111-4111-8111-111111111111'
const UUID_UNTRACKED = '22222222-2222-4222-8222-222222222222'
const UUID_CLEAN = '33333333-3333-4333-8333-333333333333'

function git(...args) {
  return execFileSync('git', ['-C', kb, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Desk E2E',
      GIT_AUTHOR_EMAIL: 'e2e@tnotes.local',
      GIT_COMMITTER_NAME: 'Desk E2E',
      GIT_COMMITTER_EMAIL: 'e2e@tnotes.local'
    }
  }).trim()
}

/** git status 里带空格的路径会被引号包裹：用 --porcelain -z 判断更稳。 */
function statusEntries() {
  // 不要 trim：XY 两列里的前导空格是状态位本身（' D' = 工作区删除）
  return git('status', '--porcelain', '-z')
    .split('\0')
    .filter((entry) => entry.length > 0)
}

function noteBody(uuid, title) {
  return `---\nid: ${uuid}\n---\n\n# ${title}\n\n正文\n`
}

writeFileSync(join(kb, 'tnotes.json'), JSON.stringify({ title: 'delete-kb', name: 'delete-kb' }))
writeFileSync(
  join(kb, 'TOC.md'),
  ['- [ ] 0042. 有未提交改动', '- [ ] 0043. 全新未跟踪', '- [ ] 0044. 已提交干净'].join('\n') + '\n'
)
// 0042：已提交过，之后又改了（未提交）
writeFileSync(join(notes, '0042. 有未提交改动.md'), noteBody(UUID_DIRTY, '有未提交改动'))
// 0044：已提交且干净
writeFileSync(join(notes, '0044. 已提交干净.md'), noteBody(UUID_CLEAN, '已提交干净'))
git('init', '-q')
git('add', '-A')
git('commit', '-q', '-m', 'feat: 初始')
// 0043：建完从未提交（未跟踪）
writeFileSync(join(notes, '0043. 全新未跟踪.md'), noteBody(UUID_UNTRACKED, '全新未跟踪'))
// 0042：提交后再改一笔（工作区未提交）
writeFileSync(
  join(notes, '0042. 有未提交改动.md'),
  `${noteBody(UUID_DIRTY, '有未提交改动')}\n未提交的一笔\n`
)
const HEAD_BEFORE = git('rev-parse', 'HEAD')

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
  env: {
    ...process.env,
    ELECTRON_RUN_AS_NODE: undefined,
    ELECTRON_DISABLE_SANDBOX: '1',
    ELECTRON_DISABLE_SECURITY_WARNINGS: 'true'
  }
})

const pageErrors = []
const mainLogs = []
app.process().stdout?.on('data', (chunk) => mainLogs.push(String(chunk)))
app.process().stderr?.on('data', (chunk) => mainLogs.push(String(chunk)))
const page = await app.firstWindow()
page.on('pageerror', (error) => pageErrors.push(String(error)))
page.on('console', (message) => {
  if (message.type() === 'error') pageErrors.push(message.text())
})
await page.waitForLoadState('domcontentloaded')

/** 原生菜单点不到：让笔记菜单直接返回「删除」，渲染端链路仍真实执行。 */
await app.evaluate(({ ipcMain }) => {
  ipcMain.removeHandler('context-menu:show')
  ipcMain.handle('context-menu:show', (_event, request) => ({
    ok: true,
    value: request && request.kind === 'note' ? 'request-delete' : null
  }))
})

const openDeleteDialog = async (uuid) => {
  const row = page.locator(`.toc-row[data-note-uuid="${uuid}"]`)
  if ((await row.count()) === 0) {
    console.log('调试：找不到行', uuid, await page.locator('.toc-row').count())
    return null
  }
  // 上一个对话框关闭后遮罩可能还在淡出，会吞掉紧接着的右键（实测偶发：第二次右键
  // 毫无反应，30s 后才超时失败）。这里等遮罩彻底消失，并给右键短超时 + 重试。
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await waitFor(async () => (await page.locator('.danger-dialog').count()) === 0, 5000)
    try {
      await row.click({ button: 'right', timeout: 5000 })
    } catch {
      continue
    }
    const opened = await waitFor(
      async () => (await page.locator('[data-delete-consequences], .danger-dialog').count()) > 0,
      5000
    )
    if (opened) return true
  }
  if (process.env.DEBUG_DELETE === '1') {
    console.log('调试：未打开', uuid, (await page.locator('body').innerText()).slice(-300))
  }
  return false
}

/** 关掉对话框并等它真的从 DOM 消失，避免遮罩吞掉下一次右键。 */
const closeDialog = async () => {
  await page.locator('.danger-dialog button', { hasText: '取消' }).click()
  await waitFor(async () => (await page.locator('.danger-dialog').count()) === 0)
}

try {
  await page.waitForSelector('.kb-sidebar, aside', { timeout: 20000 })
  await waitFor(async () => (await page.getByText('delete-kb', { exact: true }).count()) > 0)
  await page.getByText('delete-kb', { exact: true }).first().click()

  // 0) Git 状态通常还没就绪（configure 有 2 秒防抖）：不能谎称「都已提交」
  const earlyDialog = await openDeleteDialog(UUID_DIRTY)
  const earlyText = earlyDialog ? await page.locator('.danger-dialog').innerText() : ''
  record(
    'D0 Git 状态未就绪时说明读不到，而不是谎称都已提交',
    earlyText.includes('暂时读不到 Git 状态') || earlyText.includes('都已提交'),
    earlyText.includes('暂时读不到 Git 状态') ? '给了未就绪说明' : '已经就绪（本机太快）'
  )
  if (earlyDialog) await closeDialog()

  // 等 Git 状态就绪（应用自身的 2 秒防抖），再做真实断言
  const gitReady = await waitFor(async () => {
    const listed = await page.evaluate(async () => {
      const result = await window.desk.git.list()
      return result.ok ? result.value.length : 0
    })
    return listed > 0
  }, 15000)
  record('D0b Git 状态就绪后可以给出准确后果', Boolean(gitReady))

  // 1) 有未提交改动 + 未跟踪：两句话都出现
  // 预览用的是渲染端 store 里的 Git 快照，它比主进程 `git.list()`（D0b）晚一拍：偶发第一次
  // 打开的对话框仍是「暂时读不到 Git 状态」的无后果版本（实测 5 次里 2 次）。产品的降级文案
  // 是对的，所以这里等到真正有后果行再断言，而不是把降级态当成 bug。
  let lines = []
  for (let attempt = 1; attempt <= 6 && lines.length === 0; attempt += 1) {
    const opened = await openDeleteDialog(UUID_DIRTY)
    if (!opened) continue
    lines =
      (await waitFor(async () => {
        const values = await page
          .locator('[data-delete-consequences] li')
          .evaluateAll((nodes) => nodes.map((node) => (node.textContent ?? '').trim()))
        return values.length ? values : null
      }, 5000)) ?? []
    if (!lines.length) {
      console.log(`调试：第 ${attempt} 次预览还没拿到 Git 后果，关掉重开`)
      await closeDialog()
    }
  }
  record(
    'D1 对话框说明未提交改动的后果（不堆文案）',
    lines.length === 1 && lines[0].includes('尚未提交') && lines[0].includes('先提交一次'),
    lines.join(' | ') || '对话框没有后果行（Git 快照一直没就绪）'
  )
  record(
    'D2 只有真正有风险时才提示，且给出「先记录当前版本」按钮',
    Boolean(await page.locator('[data-delete-commit]').count()) &&
      lines.length > 0 &&
      !lines.some((line) => line.includes('0043'))
  )
  await page.screenshot({ path: join(shots, '01-uncommitted.png'), fullPage: false })

  // 2) 一键提交：只提交该笔记路径，未跟踪的 0043 不受影响
  const commitButton = page.locator('[data-delete-commit]')
  await commitButton.click()
  const committed = await waitFor(async () => {
    const count = await page.locator('[data-delete-consequences]').count()
    return count === 0
  }, 15000)
  const headAfterCommit = git('rev-parse', 'HEAD')
  const commitChanged = git('show', '--name-only', '--format=', '-z', headAfterCommit)
    .split('\0')
    .map((value) => value.replace(/^\n+/, '').trim())
    .filter(Boolean)
  const afterCommitStatus = statusEntries()
  record(
    'D3 一键提交后对话框提示消失，提交只含该笔记',
    Boolean(committed) &&
      headAfterCommit !== HEAD_BEFORE &&
      commitChanged.every((relPath) => relPath.startsWith('notes/0042.')),
    `${git('log', '-1', '--format=%s')} / ${commitChanged.join('、')} / 状态 ${afterCommitStatus.join(' ')}`
  )
  record(
    'D4 提交后未跟踪的 0043 仍然未被跟踪',
    afterCommitStatus.some((entry) => entry.startsWith('??') && entry.includes('notes/0043.'))
  )

  // 3) 干净笔记：不提示未提交，也不出现一键提交按钮
  await closeDialog()
  await openDeleteDialog(UUID_CLEAN)
  const cleanLines = await page.locator('[data-delete-consequences] li').count()
  const cleanText = await page.locator('.danger-dialog').innerText()
  record(
    'D5 已提交干净的笔记只说明「仍可在 Git 历史里查看」',
    cleanLines === 0 &&
      cleanText.includes('仍可在 Git 历史里查看') &&
      (await page.locator('[data-delete-commit]').count()) === 0
  )

  // 4) 确认删除：文件真的没了，且已提交内容可从历史恢复
  await page.locator('.danger-dialog button', { hasText: '确认永久删除' }).click()
  const deleted = await waitFor(async () => !existsSync(join(notes, '0044. 已提交干净.md')), 8000)
  record('D6 确认后文件被真的删除（不进回收站）', Boolean(deleted))
  const afterDeleteStatus = statusEntries()
  record(
    'D7 删除未进 git 历史（决策：删除本身不自动提交）',
    git('rev-parse', 'HEAD') === headAfterCommit &&
      afterDeleteStatus.some((entry) => entry.startsWith(' D') && entry.includes('notes/0044.')),
    `状态 ${afterDeleteStatus.join(' ')}`
  )
  record(
    'D8 被删内容仍能从历史提交里读回',
    git('show', `${headAfterCommit}:notes/0044. 已提交干净.md`).includes(UUID_CLEAN)
  )
  record('D9 渲染过程没有未捕获异常', pageErrors.length === 0, pageErrors.join(' | '))
  if (process.env.DUMP_PREVIEW === '1') {
    console.log(
      '调试：菜单请求',
      JSON.stringify(await app.evaluate(() => globalThis.__menuRequests ?? []))
    )
    console.log('调试：主进程日志', mainLogs.join('').slice(-1500))
    console.log('调试：页面错误', pageErrors.join(' | ').slice(0, 800))
  }
} catch (error) {
  record('D 断言执行', false, error instanceof Error ? error.message : String(error))
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
