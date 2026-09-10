export function nodeIdForNote(noteIndex: string): string {
  return `note:${noteIndex}`
}

export function nodeIdForFolder(folderPath: string[]): string {
  return `folder:${folderPath.join('/')}`
}
