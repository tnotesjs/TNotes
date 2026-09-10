import type { GitFileChangeDto } from '../../../shared/contracts'

/** Extract the immutable 4-digit note index from a note path (incl. .trash). */
function noteIndexFromPath(path: string): string | null {
  const match = path.replace(/\\/g, '/').match(/(?:^|\/)notes\/(?:\.trash\/)?(\d{4})\./)
  return match ? match[1] : null
}

/**
 * Display-level merge for unstaged note renames / soft-deletes.
 *
 * Git reports an unstaged rename as a tracked deletion plus an untracked
 * new path; a soft-delete may move the file into notes/.trash/. This ONLY
 * reshapes the rendered list: the change COUNT must stay the true git count,
 * so callers keep counting the raw list.
 *
 * TNotes note indexes (first 4 digits) are unique and immutable, so a deleted
 * note file and an untracked note file sharing the same index are exactly
 * one rename (or one trashed move).
 */
export function mergeRenameChanges(changes: readonly GitFileChangeDto[]): GitFileChangeDto[] {
  const pairs = new Map<string, { deleted?: GitFileChangeDto; untracked?: GitFileChangeDto }>()
  for (const change of changes) {
    const index = noteIndexFromPath(change.path)
    if (index === null) continue
    const bucket = pairs.get(index) ?? {}
    if (change.status === 'deleted') bucket.deleted = change
    else if (change.status === 'untracked') bucket.untracked = change
    pairs.set(index, bucket)
  }

  const consumed = new Set<GitFileChangeDto>()
  const result: GitFileChangeDto[] = []
  for (const change of changes) {
    if (consumed.has(change)) continue
    const index = noteIndexFromPath(change.path)
    const bucket = index !== null ? pairs.get(index) : undefined
    if (bucket?.deleted && bucket.untracked) {
      consumed.add(bucket.deleted)
      consumed.add(bucket.untracked)
      result.push({
        ...bucket.untracked,
        path: bucket.untracked.path,
        previousPath: bucket.deleted.path,
        status: 'renamed',
        staged: false,
        worktree: true
      })
      continue
    }
    result.push(change)
  }
  return result
}
