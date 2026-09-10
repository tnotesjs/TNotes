export type ChangeCategory = 'noteFile' | 'configFile' | 'otherFile'

/**
 * Classify a git change path into one of the three "变更" sub-groups:
 * - noteFile: a note file under notes/ (`notes/NNNN. 标题.md`, including .trash)
 * - configFile: knowledge-base root TOC.md / tnotes.json
 * - otherFile: everything else
 */
export function classifyChangePath(path: string): ChangeCategory {
  const normalized = path.replace(/\\/g, '/')
  if (/^notes\/(?:\.trash\/)?\d{4}(?:\.\s*[^/]+?)?\.md$/.test(normalized)) return 'noteFile'
  if (normalized === 'TOC.md' || normalized === 'tnotes.json') return 'configFile'
  return 'otherFile'
}
