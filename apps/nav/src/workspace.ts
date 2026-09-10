import { homedir } from 'os'
import { resolve } from 'path'
import * as vscode from 'vscode'

/** Currently opened folder (first workspace folder). */
export function getOpenedFolder(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
}

/** Expand `~` and normalize a user-entered path. */
export function normalizeRootPath(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (trimmed === '~') return homedir()
  if (trimmed.startsWith('~/') || trimmed.startsWith('~\\')) {
    return resolve(homedir(), trimmed.slice(2))
  }
  return resolve(trimmed)
}

/**
 * Effective scan root: `tnotesNav.rootPath` when set, otherwise the opened folder.
 */
export function getNavRoot(): string | undefined {
  const configured = vscode.workspace
    .getConfiguration('tnotesNav')
    .get<string>('rootPath')
    ?.trim()
  if (configured) {
    return normalizeRootPath(configured)
  }
  return getOpenedFolder()
}

/** Value to show in the address bar (configured path, else opened folder). */
export function getAddressBarPath(): string {
  const configured = vscode.workspace
    .getConfiguration('tnotesNav')
    .get<string>('rootPath')
    ?.trim()
  if (configured) return configured
  return getOpenedFolder() ?? ''
}

export async function setNavRootPath(path: string): Promise<string | undefined> {
  const normalized = normalizeRootPath(path)
  const opened = getOpenedFolder()
  // Empty or same as opened folder → clear override (follow workspace).
  const value =
    !normalized || (opened && resolve(normalized) === resolve(opened))
      ? ''
      : normalized

  await vscode.workspace
    .getConfiguration('tnotesNav')
    .update('rootPath', value, vscode.ConfigurationTarget.Global)

  return value ? value : opened
}

/** @deprecated Use getNavRoot */
export function getWorkspaceRoot(): string | undefined {
  return getNavRoot()
}

export function getBlacklist(): Set<string> {
  const list =
    vscode.workspace.getConfiguration('tnotesNav').get<string[]>('blacklist') ?? []
  return new Set(list.map((name) => name.trim()).filter(Boolean))
}
