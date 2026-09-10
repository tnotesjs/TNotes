/**
 * Lightweight git helpers for kb settings and completion stats.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

async function git(
  rootPath: string,
  args: string[]
): Promise<{ ok: true; stdout: string } | { ok: false; stderr: string }> {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd: rootPath,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024
    })
    return { ok: true, stdout: stdout.trim() }
  } catch (error) {
    const stderr =
      error instanceof Error && 'stderr' in error
        ? String((error as { stderr?: unknown }).stderr ?? error.message)
        : String(error)
    return { ok: false, stderr }
  }
}

/** `git init` in `rootPath`. Throws Error with stderr when it fails. */
export async function initGitRepository(rootPath: string): Promise<void> {
  const result = await git(rootPath, ['init'])
  if (!result.ok) {
    throw new Error(result.stderr.trim() || 'git init 失败')
  }
}

/** True when `rootPath` is inside a git work tree. */
export async function isGitRepository(rootPath: string): Promise<boolean> {
  const result = await git(rootPath, ['rev-parse', '--is-inside-work-tree'])
  return result.ok && result.stdout === 'true'
}

/** `git remote get-url origin`, or null when missing / not a git repo. */
export async function readOriginRemoteUrl(rootPath: string): Promise<string | null> {
  if (!(await isGitRepository(rootPath))) return null
  const result = await git(rootPath, ['remote', 'get-url', 'origin'])
  if (!result.ok || !result.stdout) return null
  return result.stdout
}

export interface GitCommitMeta {
  hash: string
  /** ISO-ish author date from `%aI`. */
  authorDate: string
}

/** Root commit(s) of HEAD (usually one). */
export async function listRootCommits(rootPath: string): Promise<GitCommitMeta[]> {
  const result = await git(rootPath, ['rev-list', '--max-parents=0', '--format=%H %aI', 'HEAD'])
  if (!result.ok) return []
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('commit '))
    .map((line) => {
      const [hash, authorDate] = line.split(/\s+/, 2)
      return { hash, authorDate: authorDate ?? '' }
    })
    .filter((item) => Boolean(item.hash))
}

/** All commits on HEAD, oldest first. */
export async function listCommitsOldestFirst(rootPath: string): Promise<GitCommitMeta[]> {
  const result = await git(rootPath, ['log', '--reverse', '--format=%H %aI', 'HEAD'])
  if (!result.ok) return []
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, authorDate] = line.split(/\s+/, 2)
      return { hash, authorDate: authorDate ?? '' }
    })
    .filter((item) => Boolean(item.hash))
}

/** Blob contents of `filePath` at `commit`, or null if missing. */
export async function readFileAtCommit(
  rootPath: string,
  commit: string,
  filePath: string
): Promise<string | null> {
  const result = await git(rootPath, ['show', `${commit}:${filePath}`])
  if (!result.ok) return null
  return result.stdout
}
