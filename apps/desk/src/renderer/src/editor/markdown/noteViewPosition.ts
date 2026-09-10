/**
 * Clamp a document offset pair after a reload so restore cannot throw.
 * Does not serialize or mark the document dirty.
 */

export interface NoteViewPosition {
  from: number
  to: number
  scrollTop: number
}

export function clampOffsets(from: number, to: number, max: number): { from: number; to: number } {
  const limit = Math.max(0, max)
  return {
    from: Math.max(0, Math.min(from, limit)),
    to: Math.max(0, Math.min(to, limit))
  }
}

export function clampScrollTop(scrollTop: number, maxScroll: number): number {
  if (!Number.isFinite(scrollTop) || scrollTop < 0) return 0
  if (!Number.isFinite(maxScroll) || maxScroll <= 0) return 0
  return Math.min(scrollTop, maxScroll)
}

export function clampViewPosition(
  position: NoteViewPosition,
  docSize: number,
  maxScroll: number
): NoteViewPosition {
  const offsets = clampOffsets(position.from, position.to, docSize)
  return {
    from: offsets.from,
    to: offsets.to,
    scrollTop: clampScrollTop(position.scrollTop, maxScroll)
  }
}
