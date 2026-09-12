// desk e2e runner：串行/并发执行 apps/desk/scripts/e2e-*.mjs，支持按改动增量选择。
//
//   node scripts/run-e2e.mjs                       # 全部套件（并发 4）
//   node scripts/run-e2e.mjs --since HEAD~1         # 只跑与改动文件相关的套件
//   node scripts/run-e2e.mjs --only excalidraw      # 按 area 或套件名筛选（可逗号分隔/重复）
//   node scripts/run-e2e.mjs --skip typography
//   node scripts/run-e2e.mjs --smoke                # PR 冒烟核心集
//   node scripts/run-e2e.mjs --shard 1/2            # 分片（CI 可用）
//   node scripts/run-e2e.mjs --list | --dry-run
//
// 选项：--concurrency N（默认 4） --timeout SEC（单套件上限，默认 300） --json <path>
//
// 约定：`serial: true` 的套件（全局快捷键 / 原生菜单 / 拖拽 / 焦点 / app.quit 等）
// 独占跑，不和别人并发；其余按 --concurrency 并发。每个套件独立子进程 + 进程组，
// 超时按进程组 kill，避免留下 Electron 孤儿。
import { execFileSync, spawn } from 'node:child_process'
import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { SUITES } from './e2e-registry.mjs'

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url))
const DESK_DIR = join(SCRIPTS_DIR, '..')
const REPO_ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  cwd: DESK_DIR,
  encoding: 'utf8'
}).trim()

function parseArgs(argv) {
  const options = {
    concurrency: 4,
    timeoutMs: 300_000,
    retries: 0,
    only: [],
    skip: [],
    since: null,
    smoke: false,
    sinceExact: false,
    includeManual: false,
    list: false,
    dryRun: false,
    json: null,
    shard: null
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }
    const next = () => {
      i += 1
      if (i >= argv.length) throw new Error(`${arg} 需要一个值`)
      return argv[i]
    }
    if (arg === '--concurrency') options.concurrency = Number(next())
    else if (arg === '--timeout') options.timeoutMs = Number(next()) * 1000
    else if (arg === '--retries') options.retries = Number(next())
    else if (arg === '--only') options.only.push(...next().split(','))
    else if (arg === '--skip') options.skip.push(...next().split(','))
    else if (arg === '--since') options.since = next()
    else if (arg === '--shard') options.shard = next()
    else if (arg === '--json') options.json = next()
    else if (arg === '--smoke') options.smoke = true
    else if (arg === '--since-exact') options.sinceExact = true
    else if (arg === '--include-manual') options.includeManual = true
    else if (arg === '--list') options.list = true
    else if (arg === '--dry-run') options.dryRun = true
    else throw new Error(`未知参数：${arg}`)
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
    throw new Error('--concurrency 需要正整数')
  }
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error('--timeout 需要正数秒')
  }
  if (!Number.isInteger(options.retries) || options.retries < 0) {
    throw new Error('--retries 需要非负整数')
  }
  return options
}

/** 支持 `**`（跨目录）、`*`（不跨目录）、`?` 的最小 glob 匹配。 */
export function matchesGlob(pattern, file) {
  // 占位符用普通字符串，避免正则里出现控制字符（eslint no-control-regex）
  const GLOBSTAR_SLASH = '@@dsh-globstar-slash@@'
  const GLOBSTAR = '@@dsh-globstar@@'
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  const regex = escaped
    .replace(/\*\*\//g, GLOBSTAR_SLASH)
    .replace(/\*\*/g, GLOBSTAR)
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
    .split(GLOBSTAR_SLASH)
    .join('(?:.*/)?')
    .split(GLOBSTAR)
    .join('.*')
  return new RegExp(`^${regex}$`).test(file)
}

function changedFiles(since) {
  const git = (args) => {
    try {
      return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' })
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    } catch {
      return []
    }
  }
  const files = new Set([
    // 用「ref 对工作区」比较（两点）：--since HEAD 也要能包含未提交的已跟踪改动，
    // PR 上 origin/<base> 比到 merge commit 同样正确。
    ...git(['diff', '--name-only', since ?? 'HEAD']),
    ...git(['diff', '--name-only', '--cached']),
    ...git(['ls-files', '--others', '--exclude-standard'])
  ])
  // 测试文件本身不影响运行时行为；e2e 脚本同理（它们就是被测对象之外的东西）
  return [...files].filter(
    (file) => !/\.test\.ts$/.test(file) && !/^apps\/desk\/scripts\/e2e-/.test(file)
  )
}

/**
 * 依赖/构建配置一变，任何套件都可能受影响（渲染层是单 bundle，且共享包会被打进产物），
 * 这种情况直接全量跑，不要假装能算准影响面。
 */
const GLOBAL_TRIGGERS = [
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'patches/**',
  'package.json',
  '**/package.json',
  'apps/desk/electron.vite.config.*',
  '**/tsconfig*.json',
  'turbo.json'
]

function selectSuites(options) {
  const matches = (selector, suite) =>
    suite.name === selector ||
    suite.name.replace(/^e2e-/, '').replace(/\.mjs$/, '') === selector ||
    suite.area === selector ||
    // area 支持前缀：`--only block` 命中 block-editing / block-menu / block-range
    suite.area.startsWith(`${selector}-`)

  let selected = SUITES.filter((suite) => options.includeManual || suite.tier === 'regression')
  const changed = options.since ? changedFiles(options.since) : null
  if (changed) {
    options.changedFiles = changed
    options.hits = new Map()
    const globalHits = changed.filter((file) =>
      GLOBAL_TRIGGERS.some((glob) => matchesGlob(glob, file))
    )
    if (globalHits.length) {
      options.globalHits = globalHits
      options.hits.set('(全量)', globalHits)
    } else {
      selected = selected.filter((suite) => {
        const reasons = changed.filter((file) =>
          suite.globs.some((glob) => matchesGlob(glob, file))
        )
        if (reasons.length) options.hits.set(suite.name, reasons)
        return reasons.length > 0
      })
      // 受影响集之外再并入冒烟核心集：单 bundle 存在「改了 A 只有 B 的测试能发现」的耦合，
      // 只跑受影响集不足以拦住回归。要精确跑用 --since-exact。
      if (!options.sinceExact) {
        const chosen = new Set(selected.map((suite) => suite.name))
        for (const suite of SUITES) {
          if (suite.tier !== 'regression' && !options.includeManual) continue
          if (suite.smoke && !chosen.has(suite.name)) {
            selected.push(suite)
            options.hits.set(suite.name, ['(冒烟核心集)'])
          }
        }
      }
    }
  }
  if (options.smoke) selected = selected.filter((suite) => suite.smoke)
  if (options.only.length) {
    selected = selected.filter((suite) => options.only.some((s) => matches(s, suite)))
  }
  if (options.skip.length) {
    selected = selected.filter((suite) => !options.skip.some((s) => matches(s, suite)))
  }
  selected.sort((a, b) => a.name.localeCompare(b.name))

  if (options.shard) {
    const [indexText, totalText] = options.shard.split('/')
    const index = Number(indexText)
    const total = Number(totalText)
    if (!Number.isInteger(index) || !Number.isInteger(total) || index < 1 || index > total) {
      throw new Error('--shard 形如 1/2')
    }
    selected = selected.filter((_, i) => i % total === index - 1)
  }
  return selected
}

function killGroup(child, signal) {
  try {
    process.kill(-child.pid, signal)
  } catch {
    try {
      child.kill(signal)
    } catch {
      /* 已经退出 */
    }
  }
}

function runSuiteOnce(suite, options, logDir, attempt) {
  return new Promise((resolve) => {
    const logPath = join(logDir, `${suite.name}${attempt > 1 ? `.attempt-${attempt}` : ''}.log`)
    const log = createWriteStream(logPath)
    const startedAt = Date.now()
    const child = spawn(process.execPath, [join(SCRIPTS_DIR, suite.name)], {
      cwd: DESK_DIR,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    child.stdout.pipe(log)
    child.stderr.pipe(log)
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      killGroup(child, 'SIGTERM')
      setTimeout(() => killGroup(child, 'SIGKILL'), 5000)
    }, options.timeoutMs)
    child.on('close', (code) => {
      clearTimeout(timer)
      log.end()
      resolve({
        name: suite.name,
        area: suite.area,
        serial: suite.serial,
        ok: !timedOut && code === 0,
        exitCode: code,
        timedOut,
        durationMs: Date.now() - startedAt,
        logPath,
        attempt
      })
    })
  })
}

/** 失败重试（CI 用 `--retries 1` 吸收残余 flake）；重试后过会标记 flaky，不静默掩盖。 */
async function runSuite(suite, options, logDir) {
  const attempts = []
  for (let index = 0; index <= options.retries; index += 1) {
    const result = await runSuiteOnce(suite, options, logDir, index + 1)
    attempts.push(result)
    if (result.ok) break
  }
  const last = attempts[attempts.length - 1]
  return {
    ...last,
    attempts: attempts.length,
    flaky: attempts.length > 1 && last.ok,
    firstFailureLogPath: attempts.length > 1 ? attempts[0].logPath : null
  }
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(1)}s`
}

/**
 * 资源感知的并发池：`locks` 里声明的外部资源（目前只有 `clipboard`：OS 粘贴板全局共享，
 * 复制/粘贴类断言会互相覆盖）同一时刻只能被一个套件持有；不冲突的套件照常并发。
 * 这比 `serial`（整机独占）宽松得多——4 个剪贴板套件可以和其他 20 个套件重叠跑。
 */
function runLockedPool(suites, options, logDir) {
  const concurrency = Math.max(1, options.concurrency)
  const pending = [...suites]
  const results = []
  const inUse = new Set()
  const active = new Map()
  return new Promise((resolve) => {
    const settle = () => {
      if (pending.length === 0 && active.size === 0) {
        resolve(results.sort((a, b) => a.name.localeCompare(b.name)))
      }
    }
    const startNext = () => {
      while (active.size < concurrency) {
        const index = pending.findIndex((suite) =>
          (suite.locks ?? []).every((lock) => !inUse.has(lock))
        )
        if (index === -1) break
        const [suite] = pending.splice(index, 1)
        for (const lock of suite.locks ?? []) inUse.add(lock)
        let promise
        promise = runSuite(suite, options, logDir).then((result) => {
          for (const lock of suite.locks ?? []) inUse.delete(lock)
          active.delete(promise)
          results.push(result)
          console.log(
            `  ${result.ok ? (result.flaky ? '⚠' : '✓') : '✗'} ${suite.name} ${formatDuration(result.durationMs)}`
          )
          startNext()
        })
        active.set(promise, suite)
      }
      settle()
    }
    startNext()
  })
}

const USAGE = `desk e2e runner

开发循环（改完代码先在 apps/desk 下重建 out/，再挑最小集跑）：
  pnpm --filter desk build:out                  # 只构建（跳过 typecheck），比 build 快
  node scripts/e2e-block-menus.mjs              # 单套件直跑（2-20s，带逐条 PASS/FAIL + 截图）
  pnpm --filter desk test:e2e --only block      # 按区域（area，支持前缀）跑
  pnpm --filter desk test:e2e --since HEAD      # 受影响 + 冒烟核心集
  pnpm --filter desk test:e2e --since HEAD --since-exact   # 只跑受影响集
全量 / 交付：
  pnpm --filter desk test:e2e                   # 全部 regression 套件
  pnpm --filter desk test:e2e --concurrency 6   # 核多的机器可以再压
其它：--smoke --shard 1/2 --list --dry-run --json <path> --retries N --include-manual
调度：serial 套件整机独占；locks:['clipboard'|'focus'] 只做资源互斥，可与无关套件并行。`

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(USAGE)
    return
  }
  const selected = selectSuites(options)

  if (options.list) {
    for (const suite of SUITES) {
      const flags = [
        suite.tier === 'manual' ? 'manual' : '',
        suite.serial ? 'serial' : '',
        ...(suite.locks ?? []).map((lock) => `lock:${lock}`),
        suite.smoke ? 'smoke' : ''
      ]
        .filter(Boolean)
        .join(',')
      console.log(`${suite.name.padEnd(30)} ${suite.area.padEnd(14)} ${flags}`)
    }
    return
  }

  if (options.since) {
    console.log(`改动文件 ${options.changedFiles.length} 个（since ${options.since}）`)
    if (!selected.length) console.log('没有套件匹配这些改动；用 --smoke 或直接全量跑')
  }

  console.log(
    `选中 ${selected.length}/${SUITES.length} 个套件（tier=${
      options.includeManual ? 'all' : 'regression'
    }）；并发 ${options.concurrency}` +
      `${options.smoke ? '；smoke 子集' : ''}${options.shard ? `；shard ${options.shard}` : ''}`
  )
  if (options.dryRun) {
    if (options.globalHits) {
      console.log(`  （依赖/构建配置变动 → 全量跑：${options.globalHits.slice(0, 3).join(', ')}）`)
    }
    for (const suite of selected) {
      const reason = options.hits?.get(suite.name)
      console.log(
        `  ${suite.name}${suite.serial ? ' [serial]' : ''}` +
          `${(suite.locks ?? []).length ? ` [lock:${(suite.locks ?? []).join(',')}]` : ''}` +
          `${reason ? `  ← ${reason.slice(0, 3).join(', ')}` : ''}`
      )
    }
    return
  }
  if (!selected.length) process.exit(1)

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const logDir = join('/tmp', 'desk-e2e-logs', stamp)
  mkdirSync(logDir, { recursive: true })

  const startedAt = Date.now()
  const serialSuites = selected.filter((suite) => suite.serial)
  const parallelSuites = selected.filter((suite) => !suite.serial)
  const results = []

  // serial 套件独占：全局快捷键 / 原生菜单 / 拖拽 / 焦点 / app.quit 类的断言对
  // 「同时还有别的 Electron 在跑」敏感，必须一个一个来。
  for (const suite of serialSuites) {
    console.log(`▶ ${suite.name} [serial]`)
    const result = await runSuite(suite, options, logDir)
    results.push(result)
    console.log(
      `  ${result.ok ? (result.flaky ? '⚠' : '✓') : '✗'} ${suite.name} ${formatDuration(result.durationMs)}`
    )
  }
  if (parallelSuites.length) {
    results.push(...(await runLockedPool(parallelSuites, options, logDir)))
  }

  const totalMs = Date.now() - startedAt
  const failed = results.filter((result) => !result.ok)
  const slowest = [...results].sort((a, b) => b.durationMs - a.durationMs).slice(0, 5)

  console.log('\n===== E2E SUMMARY =====')
  const flaky = results.filter((result) => result.flaky)
  console.log(
    `${results.length - failed.length}/${results.length} 通过 · 总耗时 ${formatDuration(totalMs)} · 日志 ${logDir}` +
      `${flaky.length ? ` · flaky ${flaky.length}（重试后过：${flaky.map((r) => r.name).join(', ')}）` : ''}`
  )
  console.log(
    `最慢：${slowest.map((r) => `${r.name} ${formatDuration(r.durationMs)}`).join(' · ')}`
  )
  // flaky 的首次失败日志要打出来：否则 CI 上只看到一个 ⚠，无从定位根因
  for (const result of flaky) {
    console.log(`\n⚠ ${result.name} 首次失败日志（重试后通过）：${result.firstFailureLogPath}`)
    try {
      const tail = execFileSync(
        'tail',
        ['-n', '20', relative(REPO_ROOT, result.firstFailureLogPath)],
        { cwd: REPO_ROOT, encoding: 'utf8' }
      )
      console.log(tail.trimEnd())
    } catch {
      console.log('  （读取失败）')
    }
  }
  for (const result of failed) {
    console.log(`\n✗ ${result.name} ${result.timedOut ? '(超时)' : `(exit ${result.exitCode})`}`)
    try {
      const tail = execFileSync('tail', ['-n', '25', relative(REPO_ROOT, result.logPath)], {
        cwd: REPO_ROOT,
        encoding: 'utf8'
      })
      console.log(tail.trimEnd())
    } catch {
      console.log(`  见日志 ${result.logPath}`)
    }
  }
  if (options.json) {
    writeFileSync(
      options.json,
      `${JSON.stringify({ totalMs, selected: selected.map((s) => s.name), results }, null, 2)}\n`
    )
  }
  process.exit(failed.length ? 1 : 0)
}

// 只有直接执行时才跑；被 import（例如单测 matchesGlob）时不应触发 e2e。
const isEntryPoint =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href
if (isEntryPoint) await main()
