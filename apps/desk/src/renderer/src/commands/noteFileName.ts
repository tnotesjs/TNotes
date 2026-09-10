export function noteFileName(note: {
  noteIndex: string
  title: string
  fileName?: string | null
  dirName?: string | null
}): string {
  const real = note.fileName?.trim() || note.dirName?.trim()
  if (real) return real.replace(/\.md$/i, '')
  return `${note.noteIndex}. ${note.title}`
}
