export type ChangeCategory = 'noteFile' | 'configFile' | 'otherFile'

/**
 * Classify a git change path into one of the three "变更" sub-groups:
 * - noteFile: the README.md inside each note directory (`notes/<note-dir>/README.md`)
 * - configFile: knowledge-base root TOC.md / tnotes.json (plus leftover sidebar.json / .tnotes.json if present)
 * - otherFile: everything else
 */
export function classifyChangePath(path: string): ChangeCategory {
  const normalized = path.replace(/\\/g, '/')
  if (/^notes\/[^/]+\/README\.md$/.test(normalized)) return 'noteFile'
  if (
    normalized === 'TOC.md' ||
    normalized === 'sidebar.json' ||
    normalized === '.tnotes.json' ||
    normalized === 'tnotes.json'
  ) {
    return 'configFile'
  }
  if (/^notes\/[^/]+\/\.tnotes\.json$/.test(normalized)) return 'configFile'
  return 'otherFile'
}
