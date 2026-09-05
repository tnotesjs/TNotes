/**
 * @tnotesjs/kb — workspace layer for TNotes single-file knowledge bases.
 *
 * Layout:
 *   tnotes.json   kb config
 *   TOC.md        sole source of structure (groups / order / done)
 *   notes/NNNN. 标题.md
 *   assets/
 */

export * from "./types";
export * from "./constants";
export * from "./errors";
export {
  parseNoteContent,
  serializeNoteContent,
  updateNoteFrontmatter,
} from "./frontmatter";
export {
  parseTocLine,
  buildGroupLine,
  buildNoteLine,
  flattenTocLines,
  parseTocToTree,
  serializeTocTree,
  findNoteLineIndex,
  findGroupLineIndex,
  collectSubtreeNoteIndexes,
  moveSubtree,
  setNoteDoneLine,
  setNoteTitleLine,
  normalizeTocBlankLines,
} from "./toc";
export type { ParsedTocLine, TocLineKind } from "./toc";
export { scanKnowledgeBase, readKbConfig, readTocLines, contentRevision } from "./scanner";
export { createWorkspace, validateTitle } from "./workspace";
export {
  migrateKnowledgeBase,
  stripGeneratedRegions,
  inlineIncludes,
} from "./codemod";
export type { MigrateReport } from "./codemod";
export type {
  TNotesKbWorkspace,
  CreateWorkspaceOptions,
  CreateNoteInput,
  RenameNoteInput,
  SaveNoteInput,
  SetFrontmatterInput,
  MoveTocEntryInput,
} from "./workspace";
