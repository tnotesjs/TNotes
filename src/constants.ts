/**
 * src/constants.ts
 *
 * New-architecture knowledge-base layout constants and grammar.
 */

export const NOTES_DIR = "notes";
export const ASSETS_DIR = "assets";
export const TOC_FILE = "TOC.md";
export const CONFIG_FILE = "tnotes.json";

/**
 * Note file name: `0001. 标题.md`. The 4-digit index is the stable ID and is
 * never reused or renumbered. A missing title is tolerated by the scanner but
 * reported as a diagnostic.
 */
export const NOTE_FILE_REGEX = /^(\d{4})(?:\.\s*(.+?))?\.md$/;

/** Spaces per indent level in TOC.md. */
export const TOC_INDENT_SPACES = 2;

/** Canonical note line: `- [x] 0001. 标题` / `- [ ] 0001`. */
export const TOC_NOTE_LINE_REGEX =
  /^( *)(-\s+\[(x|X| )\])\s+(\d{4})(?:\.\s*(.*?))?\s*$/;

/** Group line: `- 标题` (no checkbox). */
export const TOC_GROUP_LINE_REGEX = /^( *)(-\s+(?!\[(?:x|X| )\]).+?)\s*$/;

/** Legacy linked note line: `- [x] [0001. 标题](/notes/...)` (read-only). */
export const TOC_LEGACY_NOTE_LINE_REGEX =
  /^( *)(-\s+\[(x|X| )\])\s+\[(\d{4})(?:\.[^\]]*)?\]\(([^)]+)\)/;

/** Frontmatter whitelist — everything else is stripped by migrations. */
export const FRONTMATTER_KEYS = ["id", "description", "draft"] as const;
