export interface NoteOutlineHeading {
  id: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
}

export function headingOutlineText(element: HTMLElement): string {
  return (element.textContent ?? '').replace(/\s+#+\s*$/, '').trim()
}

const OUTLINE_CHROME =
  '.desk-raw-block, .milkdown-slash-menu, .milkdown-code-block, .cm-editor, .desk-block-action-menu'

function isOutlineChromeHeading(element: HTMLElement): boolean {
  return Boolean(element.closest(OUTLINE_CHROME))
}

/**
 * Collects document headings for the note outline. Headings inside raw-block
 * atoms, code editors, and slash-menu chrome are skipped. When a ProseMirror
 * surface is present, collection stays inside it so editor chrome cannot leak.
 */
export function collectNoteOutlineHeadings(root: ParentNode): NoteOutlineHeading[] {
  const scope =
    root instanceof Element || root instanceof Document
      ? (root.querySelector('.ProseMirror') ?? root)
      : root
  const headings: NoteOutlineHeading[] = []
  const used = new Map<string, number>()
  for (const element of scope.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')) {
    if (isOutlineChromeHeading(element)) continue
    const text = headingOutlineText(element)
    if (!text) continue
    const level = Number(element.tagName.slice(1)) as NoteOutlineHeading['level']
    if (level < 1 || level > 6) continue
    const base = element.id || `heading-${headings.length + 1}`
    const count = (used.get(base) ?? 0) + 1
    used.set(base, count)
    const id = count === 1 ? base : `${base}-${count}`
    if (!element.id) element.id = id
    headings.push({ id, level, text })
  }
  return headings
}

export function headingElementById(root: ParentNode, id: string): HTMLElement | null {
  // IDs like `0001.-标题` are valid HTML ids but not valid `#…` selectors.
  if (root instanceof Document) {
    const hit = root.getElementById(id)
    return hit instanceof HTMLElement ? hit : null
  }
  for (const element of root.querySelectorAll<HTMLElement>('[id]')) {
    if (element.id === id) return element
  }
  return null
}

export function activeOutlineHeadingId(
  root: Element,
  headings: readonly NoteOutlineHeading[],
  offset = 56
): string | null {
  if (headings.length === 0) return null
  const top = root.getBoundingClientRect().top + offset
  let current = headings[0]!.id
  for (const item of headings) {
    const element = headingElementById(root, item.id)
    if (element && element.getBoundingClientRect().top <= top) current = item.id
  }
  return current
}
