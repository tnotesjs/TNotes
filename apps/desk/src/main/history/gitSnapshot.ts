import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import path from 'node:path'

/**
 * H0 验证出来的「按路径提交」能力：用独立临时索引把**明确枚举的路径**提交出去，
 * 完全不碰用户真实索引里其它已暂存/未暂存内容。
 *
 * 设计约束（来自历史版本计划 4.2）：
 * - 不用 `git add -A` 整库提交，也不 stash/reset 其它修改
 * - 不复制用户当前索引（那会把别人已暂存的内容一起带进提交）
 * - 提交后用 pathspec 限定把真实索引中**本次已提交路径**对齐新 HEAD，
 *   无关条目的 blob/mode/stage/标志保持原状
 * - 目标路径存在「部分暂存」时拒绝（index 与 HEAD、工作区都不同），
 *   否则写回会静默丢掉暂存版本
 */

export interface CommitPathsOptions {
  /** 事务开始时记录的 HEAD；不一致说明外部动过仓库，拒绝 */
  expectedHead?: string
  /** 便于测试注入；默认从 PATH 里找 git */
  gitExecutable?: string
  env?: NodeJS.ProcessEnv
}

export interface CommitPathsResult {
  /** null 表示目标路径相对 HEAD 没有变化，未产生提交 */
  commit: string | null
  paths: string[]
}

export class GitSnapshotError extends Error {
  readonly code: 'NO_HEAD' | 'STALE_HEAD' | 'PARTIAL_STAGED' | 'GIT_FAILED' | 'NOT_A_REPO'
  readonly detail?: string

  constructor(code: GitSnapshotError['code'], message: string, detail?: string) {
    super(message)
    this.name = 'GitSnapshotError'
    this.code = code
    this.detail = detail
  }
}

function gitExecutable(override?: string): string {
  return override ?? 'git'
}

async function runGit(
  rootPath: string,
  args: string[],
  options: CommitPathsOptions & { indexFile?: string } = {}
): Promise<{ stdout: string; stderr: string }> {
  return await new Promise((resolve, reject) => {
    // core.quotepath=false：中文/空格路径必须以原始字节返回，否则解析出的路径
    // 会带引号与八进制转义，后续按路径提交就会找不到文件
    const child = spawn(
      gitExecutable(options.gitExecutable),
      ['-c', 'core.quotepath=false', ...args],
      {
        cwd: rootPath,
        env: {
          ...process.env,
          ...options.env,
          ...(options.indexFile ? { GIT_INDEX_FILE: options.indexFile } : {}),
          GIT_TERMINAL_PROMPT: '0',
          LC_ALL: 'C'
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true
      }
    )
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
    child.on('error', reject)
    child.on('close', (code) => {
      const result = {
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8')
      }
      if (code === 0) resolve(result)
      else
        reject(
          new GitSnapshotError(
            'GIT_FAILED',
            `git ${args.join(' ')} 失败（exit ${code}）：${result.stderr.trim() || result.stdout.trim()}`,
            result.stderr
          )
        )
    })
  })
}

/**
 * 目标路径里是否存在「部分暂存」：索引与 HEAD 不同，且工作区又与索引不同。
 * 这种情况下「备份工作区」并不等于保住暂存版本，必须在任何写回前拒绝。
 */
async function findPartiallyStagedPaths(
  rootPath: string,
  paths: string[],
  options: CommitPathsOptions
): Promise<string[]> {
  const staged = await runGit(
    rootPath,
    ['diff', '--name-only', '--cached', '--', ...paths],
    options
  )
  const unstaged = await runGit(rootPath, ['diff', '--name-only', '--', ...paths], options)
  const stagedSet = new Set(staged.stdout.split('\n').filter(Boolean))
  return unstaged.stdout
    .split('\n')
    .filter(Boolean)
    .filter((file) => stagedSet.has(file))
}

export interface PathContentAttributes {
  path: string
  /** clean/smudge 过滤器名；空表示未配置 */
  filter: string
  /** text 属性：auto / set / unset / unspecified */
  text: string
  /** eol 属性：lf / crlf / unspecified */
  eol: string
}

/**
 * H0 结论的一部分：clean/smudge 与 EOL 转换会让「工作区原始字节」和「Git blob」
 * 不是同一份数据。历史恢复若依赖 blob 再写回，可能改掉用户的行尾或命中过滤器，
 * 因此调用方必须在写回前用这个探测结果决定拒绝还是接受。
 */
export async function describePathContentAttributes(
  rootPath: string,
  relPaths: string[],
  options: CommitPathsOptions = {}
): Promise<PathContentAttributes[]> {
  if (relPaths.length === 0) return []
  const { stdout } = await runGit(
    rootPath,
    ['check-attr', '-z', 'filter', 'text', 'eol', '--', ...relPaths],
    options
  )
  const fields = stdout.split('\0')
  const byPath = new Map<string, PathContentAttributes>()
  for (let index = 0; index + 2 < fields.length; index += 3) {
    const path = fields[index]
    const attribute = fields[index + 1]
    const value = fields[index + 2]
    if (!path || !attribute) continue
    const entry = byPath.get(path) ?? { path, filter: '', text: '', eol: '' }
    if (attribute === 'filter') entry.filter = value === 'unspecified' ? '' : value
    if (attribute === 'text') entry.text = value
    if (attribute === 'eol') entry.eol = value
    byPath.set(path, entry)
  }
  return [...byPath.values()]
}

/**
 * 只提交给定路径的当前工作区内容。调用方负责保证路径都在 KB 内且属于同一次操作。
 */
export async function commitPaths(
  rootPath: string,
  paths: string[],
  message: string,
  options: CommitPathsOptions = {}
): Promise<CommitPathsResult> {
  if (paths.length === 0) return { commit: null, paths: [] }

  let head: string
  try {
    head = (await runGit(rootPath, ['rev-parse', 'HEAD'], options)).stdout.trim()
  } catch (error) {
    if (error instanceof GitSnapshotError) {
      throw new GitSnapshotError('NO_HEAD', '当前仓库还没有提交，无法记录历史版本', error.detail)
    }
    throw error
  }
  if (options.expectedHead && options.expectedHead !== head) {
    throw new GitSnapshotError(
      'STALE_HEAD',
      '仓库 HEAD 已被外部改动，请重新预览后再试',
      `expected ${options.expectedHead}, actual ${head}`
    )
  }

  const partial = await findPartiallyStagedPaths(rootPath, paths, options)
  if (partial.length > 0) {
    throw new GitSnapshotError(
      'PARTIAL_STAGED',
      `以下文件存在部分暂存内容，请先处理后重试：${partial.join('、')}`,
      partial.join('\n')
    )
  }

  const indexFile = path.join(
    (await runGit(rootPath, ['rev-parse', '--git-dir'], options)).stdout.trim(),
    `desk-history-${randomUUID()}.index`
  )
  const absoluteIndex = path.isAbsolute(indexFile) ? indexFile : path.join(rootPath, indexFile)

  try {
    // 以 HEAD tree 为基底：只包含 HEAD 里已有的内容，绝不带用户索引里的暂存改动
    await runGit(rootPath, ['read-tree', head], { ...options, indexFile: absoluteIndex })
    // 只把目标路径的工作区状态写进临时索引（含新增/修改/删除）
    await runGit(rootPath, ['add', '-A', '--', ...paths], { ...options, indexFile: absoluteIndex })
    const tree = (
      await runGit(rootPath, ['write-tree'], { ...options, indexFile: absoluteIndex })
    ).stdout.trim()
    const headTree = (
      await runGit(rootPath, ['rev-parse', `${head}^{tree}`], options)
    ).stdout.trim()
    if (tree === headTree) return { commit: null, paths }

    await runGit(rootPath, ['commit', '-m', message], { ...options, indexFile: absoluteIndex })
    const commit = (await runGit(rootPath, ['rev-parse', 'HEAD'], options)).stdout.trim()

    // 真实索引里只对齐本次提交涉及的路径，其它暂存条目保持原样
    await runGit(rootPath, ['reset', '-q', 'HEAD', '--', ...paths], options)
    return { commit, paths }
  } finally {
    await unlink(absoluteIndex).catch(() => undefined)
  }
}
