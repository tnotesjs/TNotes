/**
 * src/types.ts
 *
 * Public types for the single-file knowledge-base workspace.
 */

/** Frontmatter whitelist fields of a single-file note. */
export interface NoteFrontmatter {
  /** UUID — stable machine key, currently the giscus comment mapping term. */
  id?: string;
  /** Shown by NotesTable blocks; future SEO description. */
  description?: string;
  /** Draft notes are skipped by builds. */
  draft?: boolean;
}

/** A note as seen by the scanner (file + frontmatter + TOC placement). */
export interface NoteMeta {
  /** 4-digit stable ID, e.g. "0001". */
  index: string;
  /** Title from the file name (`0001. 标题.md`). */
  title: string;
  /** File name inside notes/, e.g. "0001. 标题.md". */
  fileName: string;
  /** POSIX path relative to the kb root, e.g. "notes/0001. 标题.md". */
  relPath: string;
  frontmatter: NoteFrontmatter;
  /** Completion state — owned by the TOC checkbox. */
  done: boolean;
  /** Whether the note appears in TOC.md. */
  inToc: boolean;
  /** Group titles from root to the note's immediate parent. */
  groupPath: string[];
}

/** TOC tree node. Notes may nest children (yuque-style parent notes). */
export type TocNode = TocGroupNode | TocNoteNode;

export interface TocGroupNode {
  kind: "group";
  title: string;
  children: TocNode[];
}

export interface TocNoteNode {
  kind: "note";
  index: string;
  done: boolean;
  children: TocNode[];
}

/** tnotes.json — kb-level configuration. Unknown keys are preserved. */
export interface KbConfig {
  title?: string;
  description?: string;
  /** Deploy base path, e.g. "/TNotes.vite/". Defaults to "/". */
  base?: string;
  /** Note index used as the site home page. Defaults to the first TOC note. */
  home?: string;
  /** kb-level comments switch (giscus). */
  discussions?: boolean;
  [key: string]: unknown;
}

export type DiagnosticSeverity = "error" | "warning" | "info";

export interface KbDiagnostic {
  code:
    | "toc-entry-missing-file"
    | "file-missing-from-toc"
    | "duplicate-index"
    | "missing-title"
    | "missing-note-id"
    | "invalid-config"
    | "invalid-toc";
  message: string;
  severity: DiagnosticSeverity;
  path?: string;
}

export interface KbSnapshot {
  rootPath: string;
  config: KbConfig;
  toc: TocNode[];
  notes: NoteMeta[];
  diagnostics: KbDiagnostic[];
  /** Hash over config + TOC + file listing; changes on any structural edit. */
  revision: string;
}

/** A note with its full content. */
export interface NoteDoc extends NoteMeta {
  /** Markdown body without the frontmatter block. */
  body: string;
  /** Full file content (frontmatter + body). */
  content: string;
  /** sha256 of content — used for optimistic conflict detection. */
  revision: string;
}

export interface ChangedFile {
  /** POSIX path relative to the kb root. */
  path: string;
  kind: "created" | "updated" | "deleted" | "renamed";
  previousPath?: string;
}

export interface MutationResult<T> {
  value: T;
  changedFiles: ChangedFile[];
}

/** Where to place a new note/group inside the TOC. */
export type Placement =
  | { type: "root"; placement?: "start" | "end" }
  | { type: "note"; targetIndex: string; placement: "before" | "after" | "inside" }
  | { type: "group"; groupPath: string[]; placement: "before" | "after" | "inside" };

export type TocEntryRef =
  | { type: "note"; index: string }
  | { type: "group"; groupPath: string[] };

export interface AssetEntry {
  /** File name inside assets/. */
  name: string;
  /** POSIX path relative to the kb root, e.g. "assets/pic/a.png". */
  relPath: string;
  size: number;
}
