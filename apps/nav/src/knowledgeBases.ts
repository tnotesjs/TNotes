import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { getBlacklist } from './workspace'

export interface KnowledgeBaseInfo {
  repo: string
  title: string
  /** Filename under media/kb-icons, or null to use fallback. */
  iconFile: string | null
}

export interface SingleRepoMeta {
  repoName: string
  title: string
  iconFile: string | null
}

interface KbConfigMeta {
  name?: string
  title?: string
}

export function loadIconManifest(manifestPath: string): Record<string, string> {
  try {
    const raw = readFileSync(manifestPath, 'utf-8')
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

/** Title from the repo's own tnotes.json, or null when absent. */
function readKbConfigTitle(repoRoot: string): string | null {
  try {
    const data = JSON.parse(
      readFileSync(join(repoRoot, 'tnotes.json'), 'utf-8')
    ) as KbConfigMeta
    return data.title?.trim() || null
  } catch {
    return null
  }
}

export function listKnowledgeBases(
  workspaceRoot: string,
  iconManifest: Record<string, string>
): KnowledgeBaseInfo[] {
  if (!workspaceRoot || !existsSync(workspaceRoot)) {
    return []
  }

  const blacklist = getBlacklist()

  const names = readdirSync(workspaceRoot)
    .filter((name) => name.startsWith('TNotes.'))
    .filter((name) => !blacklist.has(name))
    .filter((name) => {
      try {
        return statSync(join(workspaceRoot, name)).isDirectory()
      } catch {
        return false
      }
    })
    .sort((a, b) => a.localeCompare(b))

  return names.map((repo) => {
    const title =
      readKbConfigTitle(join(workspaceRoot, repo)) ??
      repo.replace(/^TNotes\./, '')
    const iconFile = iconManifest[repo] ?? null
    return { repo, title, iconFile }
  })
}

export function loadSingleRepoMeta(
  repoRoot: string,
  repoName: string,
  iconManifest: Record<string, string>
): SingleRepoMeta {
  let title = repoName.replace(/^TNotes\./, '')
  try {
    const raw = readFileSync(join(repoRoot, 'tnotes.json'), 'utf-8')
    const data = JSON.parse(raw) as KbConfigMeta
    const fromTitle = data.title?.trim()
    const fromName = data.name?.trim()
    if (fromTitle) title = fromTitle
    else if (fromName) title = fromName.replace(/^TNotes\./, '')
  } catch {
    // keep fallback title
  }
  return {
    repoName,
    title,
    iconFile: iconManifest[repoName] ?? null
  }
}

/** Pinned repos first (array order), then the rest alphabetically. */
export function sortKnowledgeBases<T extends { repo: string }>(
  list: T[],
  pinnedRepos: string[]
): T[] {
  const byRepo = new Map(list.map((kb) => [kb.repo, kb]))
  const pinned: T[] = []
  for (const repo of pinnedRepos) {
    const kb = byRepo.get(repo)
    if (kb) {
      pinned.push(kb)
      byRepo.delete(repo)
    }
  }
  const rest = [...byRepo.values()].sort((a, b) => a.repo.localeCompare(b.repo))
  return [...pinned, ...rest]
}

/** Keep only pins that still exist; preserve order. */
export function filterPinnedRepos(pinnedRepos: string[], existingRepos: string[]): string[] {
  const existing = new Set(existingRepos)
  return pinnedRepos.filter((repo) => existing.has(repo))
}
