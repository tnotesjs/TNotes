/**
 * src/constants.ts
 *
 * New-architecture knowledge-base layout constants and grammar.
 */

export const NOTES_DIR = "notes";
export const ASSETS_DIR = "assets";
export const TOC_FILE = "TOC.md";
export const CONFIG_FILE = "tnotes.json";

/** Fixed basename for the knowledge-base icon (extension varies). */
export const KB_ICON_BASENAME = ".tn-kb-icon";

/** Allowed extensions for knowledge-base icon uploads. */
export const KB_ICON_EXTENSIONS = [
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
] as const;

/** Default site-preview / SSG port when `tnotes.json` omits `port`. */
export const DEFAULT_PREVIEW_PORT = 9193;

/** GitHub repository name rules. */
export const KB_NAME_REGEX = /^[A-Za-z0-9._-]{1,100}$/;

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
export const FRONTMATTER_KEYS = ["id", "description"] as const;
