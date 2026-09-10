import { execFile } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

/** Key in `fileMarks` for the repo-root README.md */
export const GIT_README_MARK_KEY = '__readme__'

export type GitFileMark = 'U' | 'M' | 'A' | 'D' | 'R'

export interface RepoGitStatus {
  changed: number
  ahead: number
  behind: number
  isRepo: boolean
  error: string | null
  /** noteDir or GIT_README_MARK_KEY → single letter */
  fileMarks: Record<string, GitFileMark>
}

const MARK_PRIORITY: Record<GitFileMark, number> = {
  U: 5,
  M: 4,
  A: 3,
  D: 2,
  R: 1
}

async function runGit(
  cwd: string,
  args: string[],
  timeoutMs = 30_000
): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await execFileAsync('git', args, {
    cwd,
    timeout: timeoutMs,
    maxBuffer: 4 * 1024 * 1024,
    env: process.env
  })
  return {
    stdout: stdout.toString(),
    stderr: stderr.toString()
  }
}

async function countAheadBehind(
  repoDir: string
): Promise<{ ahead: number; behind: number }> {
  try {
    const { stdout } = await runGit(repoDir, [
      'rev-list',
      '--left-right',
      '--count',
      '@{upstream}...HEAD'
    ])
    const [behindRaw, aheadRaw] = stdout.trim().split(/\s+/)
    return {
      behind: Number(behindRaw) || 0,
      ahead: Number(aheadRaw) || 0
    }
  } catch {
    return { ahead: 0, behind: 0 }
  }
}

/**
 * Decode git quoted paths.
 * - `core.quotepath=false`: `"notes/0004. 油猴…/README.md"` → strip quotes only
 * - default quotepath: `"notes/0004. \346\262\271…/README.md"` → C-style octal → UTF-8
 */
function unquotePath(raw: string): string {
  const s = raw.trim()
  if (s.length < 2 || !s.startsWith('"') || !s.endsWith('"')) {
    return s
  }
  const body = s.slice(1, -1)
  // Already Unicode inside quotes (no C escapes) — do not byte-decode.
  if (!body.includes('\\')) {
    return body
  }
  const bytes: number[] = []
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== '\\') {
      const code = body.charCodeAt(i)
      // ASCII-only outside escapes in classic quoted paths.
      bytes.push(code <= 0xff ? code : 0x3f)
      continue
    }
    const next = body[i + 1]
    if (next === undefined) break
    if (next >= '0' && next <= '7') {
      let oct = ''
      let j = i + 1
      while (j < body.length && oct.length < 3 && body[j] >= '0' && body[j] <= '7') {
        oct += body[j]
        j++
      }
      bytes.push(parseInt(oct, 8))
      i = j - 1
      continue
    }
    const map: Record<string, number> = {
      a: 0x07,
      b: 0x08,
      t: 0x09,
      n: 0x0a,
      v: 0x0b,
      f: 0x0c,
      r: 0x0d,
      '"': 0x22,
      '\\': 0x5c
    }
    bytes.push(map[next] ?? next.charCodeAt(0))
    i++
  }
  return Buffer.from(bytes).toString('utf8')
}

function charToMark(c: string): GitFileMark {
  if (c === 'A') return 'A'
  if (c === 'D') return 'D'
  if (c === 'R' || c === 'C') return 'R'
  if (c === 'U') return 'U'
  return 'M'
}

function letterFromXy(xy: string): GitFileMark {
  if (xy === '??' || xy.includes('?')) return 'U'
  let best: GitFileMark = 'M'
  let bestP = 0
  for (const c of xy) {
    if (c === ' ' || c === '?') continue
    const letter = charToMark(c)
    const p = MARK_PRIORITY[letter]
    if (p > bestP) {
      best = letter
      bestP = p
    }
  }
  return best
}

function pickBetterMark(
  a: GitFileMark | undefined,
  b: GitFileMark
): GitFileMark {
  if (!a) return b
  return MARK_PRIORITY[b] > MARK_PRIORITY[a] ? b : a
}

function pathToMarkKey(relPath: string): string | null {
  const p = relPath.replace(/\\/g, '/').replace(/^\.\//, '')
  if (p === 'README.md') return GIT_README_MARK_KEY
  const m = /^notes\/([^/]+)/.exec(p)
  if (!m) return null
  // New single-file format: notes/NNNN. 标题.md → key is the stem, matching
  // the old per-note directory name (notes/NNNN. 标题/README.md).
  const segment = m[1]
  return segment.endsWith('.md') ? segment.slice(0, -3) : segment
}

/** Parse porcelain stdout into dirty count + note/README marks. */
export function parsePorcelainStatus(stdout: string): {
  changed: number
  fileMarks: Record<string, GitFileMark>
} {
  const fileMarks: Record<string, GitFileMark> = {}
  let changed = 0

  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim()) continue
    // Ignored paths (rare without --ignored); do not count.
    if (line.startsWith('!! ')) continue
    changed += 1

    let letter: GitFileMark
    let pathPart: string

    if (line.startsWith('?? ')) {
      letter = 'U'
      pathPart = line.slice(3)
    } else if (line.length >= 3) {
      letter = letterFromXy(line.slice(0, 2))
      pathPart = line.slice(3)
    } else {
      continue
    }

    const arrow = ' -> '
    const arrowIdx = pathPart.lastIndexOf(arrow)
    if (arrowIdx >= 0) {
      pathPart = pathPart.slice(arrowIdx + arrow.length)
    }

    const rel = unquotePath(pathPart)
    const key = pathToMarkKey(rel)
    if (!key) continue
    fileMarks[key] = pickBetterMark(fileMarks[key], letter)
  }

  return { changed, fileMarks }
}

async function readPorcelainStatus(repoDir: string): Promise<{
  changed: number
  fileMarks: Record<string, GitFileMark>
}> {
  // Prefer UTF-8 paths; still decode quoted octal escapes if git quotes anyway.
  const { stdout } = await runGit(repoDir, [
    '-c',
    'core.quotepath=false',
    'status',
    '--porcelain'
  ])
  return parsePorcelainStatus(stdout)
}

function emptyStatus(partial?: Partial<RepoGitStatus>): RepoGitStatus {
  return {
    changed: 0,
    ahead: 0,
    behind: 0,
    isRepo: false,
    error: null,
    fileMarks: {},
    ...partial
  }
}

export async function getGitStatus(repoDir: string): Promise<RepoGitStatus> {
  if (!existsSync(join(repoDir, '.git'))) {
    return emptyStatus({ error: '非 git 仓库' })
  }

  try {
    await runGit(repoDir, ['rev-parse', '--is-inside-work-tree'])
    const porcelain = await readPorcelainStatus(repoDir)
    const ab = await countAheadBehind(repoDir)
    return emptyStatus({
      isRepo: true,
      changed: porcelain.changed,
      fileMarks: porcelain.fileMarks,
      ahead: ab.ahead,
      behind: ab.behind
    })
  } catch (e) {
    return emptyStatus({
      isRepo: true,
      error: e instanceof Error ? e.message : String(e)
    })
  }
}

export async function getGitStatusesForRepos(
  repos: Array<{ repo: string; root: string }>
): Promise<Record<string, RepoGitStatus>> {
  const entries = await Promise.all(
    repos.map(async ({ repo, root }) => {
      try {
        return [repo, await getGitStatus(root)] as const
      } catch (e) {
        return [
          repo,
          emptyStatus({
            error: e instanceof Error ? e.message : String(e)
          })
        ] as const
      }
    })
  )
  return Object.fromEntries(entries)
}
