import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import { ASSETS_DIR, NOTES_DIR, TOC_FILE } from "./constants";
import { parseNoteContent, serializeNoteContent } from "./frontmatter";
import { buildMigratedKbConfig } from "./migrate-config";
import { extraPackageScripts, writeMigratedScaffold } from "./migrate-scaffold";
import type { KbConfig, NoteFrontmatter } from "./types";

/**
 * Codemod: old directory-based kb → new single-file kb.
 *
 * Old layout per note: `notes/NNNN. Title/README.md` + `.tnotes.json` +
 * note-local `assets/` + `demos/` (referenced via `<<<` includes).
 *
 * New layout per note: `notes/NNNN. Title.md` with a frontmatter whitelist
 * (id/description); assets live at kb level; `<<<` includes are inlined
 * as fenced code blocks (the syntax was removed from the product).
 */

export interface MigrateReport {
  notesMigrated: number;
  includesInlined: number;
  assetsMoved: number;
  /** Assets renamed when moved to kb-level `assets/` (old → new). */
  assetsRenamed: Record<string, string>;
  /** Referenced include files that could not be read (left as-is). */
  includeFailures: string[];
  /** Old-layout leftovers the codemod deliberately did not delete. */
  leftovers: string[];
  /** New tnotes.json payload (omitted when a tnotes.json already existed). */
  config?: KbConfig;
  /** Engineering files written (package.json / deploy.yml / .gitignore). */
  scaffolded: string[];
  /** Custom package.json scripts preserved into the new template. */
  preservedScripts: string[];
  dryRun: boolean;
}

interface OldNoteConfig {
  id?: unknown;
  description?: unknown;
  enableDiscussions?: unknown;
}

const NOTE_DIR_REGEX = /^(\d{4})\.\s*(.+)$/;
const GENERATED_TITLE_REGEX = /^#\s+\[[^\]]*\]\(https?:\/\/[^)]*\)\s*$/;
const TOC_REGION_START = /^\s*<!--\s*region:toc\s*-->\s*$/;
const TOC_REGION_END = /^\s*<!--\s*endregion:toc\s*-->\s*$/;
const INCLUDE_LINE_REGEX = /^ {0,3}<<<\s+(.+)$/;
/** `./assets/x.png` and bare `assets/x.png` in note bodies. Not `../assets/` (already kb-level). */
const LOCAL_ASSET_REF_REGEX = new RegExp(
  String.raw`\((?:\./)?assets/([^\s)"']+)\)`,
  "g",
);

interface ParsedInclude {
  filePath: string;
  lang?: string;
  highlights?: string;
  title?: string;
}

function parseIncludeLine(line: string): ParsedInclude | null {
  const match = line.match(INCLUDE_LINE_REGEX);
  if (!match) return null;
  let rest = match[1]!.trim();

  let title: string | undefined;
  const titleMatch = rest.match(/\s+\[([^\]]+)\]\s*$/);
  if (titleMatch) {
    title = titleMatch[1]!.trim() || undefined;
    rest = rest.slice(0, titleMatch.index).trim();
  }

  let highlights: string | undefined;
  let lang: string | undefined;
  // VitePress include meta is one trailing `{...}`:
  // `{}`, `{4}`, `{1-3,5}`, `{js}`, `{md}`, `{16,21 js}`, `{6 js}`.
  const braceMatch = rest.match(/\s*\{([^}]*)\}\s*$/);
  if (braceMatch) {
    rest = rest.slice(0, braceMatch.index).trim();
    const inner = braceMatch[1]!.trim();
    if (inner) {
      const parts = inner.split(/\s+/);
      const last = parts[parts.length - 1]!;
      const head = parts.slice(0, -1).join("");
      if (/^[A-Za-z][\w#+-]*$/.test(last) && (parts.length === 1 || /^[\d,-]*$/.test(head))) {
        lang = last;
        if (head) highlights = `{${head}}`;
      } else if (/^[\d,\-\s]*$/.test(inner)) {
        const compact = inner.replace(/\s+/g, "");
        if (compact) highlights = `{${compact}}`;
      }
    }
  }

  // Region suffixes (`./file.ts#region`) are not supported by the new
  // architecture; inline the whole file instead.
  rest = rest.replace(/#[\w-]+$/, "").trim();
  const filePath = rest.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2").trim();
  return filePath ? { filePath, lang, highlights, title } : null;
}

const EXT_TO_LANG: Record<string, string> = {
  js: "js",
  mjs: "js",
  cjs: "js",
  jsx: "jsx",
  ts: "ts",
  tsx: "tsx",
  json: "json",
  jsonc: "jsonc",
  md: "md",
  html: "html",
  vue: "vue",
  css: "css",
  scss: "scss",
  less: "less",
  py: "py",
  java: "java",
  go: "go",
  rs: "rs",
  sh: "bash",
  bash: "bash",
  yml: "yaml",
  yaml: "yaml",
  toml: "toml",
  xml: "xml",
  svg: "xml",
  sql: "sql",
};

/** Outer fence must be longer than any backtick run inside the included file. */
function fenceTicksForContent(content: string): string {
  let n = 3;
  for (const line of content.split("\n")) {
    const match = line.match(/^(`{3,})/);
    if (match) n = Math.max(n, match[1]!.length + 1);
  }
  return "`".repeat(n);
}

function langForPath(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return EXT_TO_LANG[ext] ?? ext ?? "";
}

function baseName(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath;
}

/** `0008-1.png` — note index owns the file. Do not double-prefix. */
export function indexedAssetFileName(index: string, originalName: string): string {
  const name = baseName(originalName);
  if (name.startsWith(`${index}-`)) return name;
  const stem = name.replace(/^\.+/, "") || name;
  return `${index}-${stem}`;
}

function contentHash(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

async function listFilesRecursive(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full)));
      continue;
    }
    if (entry.isFile() && entry.name !== ".DS_Store") files.push(full);
  }
  return files;
}

/** Strip desk/VitePress-era generated regions from an old README body. */
export function stripGeneratedRegions(body: string): string {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let inTocRegion = false;
  for (const line of lines) {
    if (TOC_REGION_START.test(line)) {
      inTocRegion = true;
      continue;
    }
    if (inTocRegion) {
      if (TOC_REGION_END.test(line)) inTocRegion = false;
      continue;
    }
    out.push(line);
  }
  // Drop the generated `# [0001. Title](https://github.com/...)` first heading.
  const firstContent = out.findIndex((line) => line.trim() !== "");
  if (firstContent >= 0 && GENERATED_TITLE_REGEX.test(out[firstContent]!)) {
    out.splice(firstContent, 1);
  }
  return out
    .join("\n")
    .replace(/^\n+/, "")
    .replace(/\n{3,}/g, "\n\n");
}

async function readJsonFile(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function pathExists(target: string): Promise<boolean> {
  return fs
    .stat(target)
    .then(() => true)
    .catch(() => false);
}

/** VitePress allows several `<<<` includes on one line (leetcode code-groups). */
function includeSegments(line: string): string[] | null {
  if (!/^ {0,3}<<<\s+\S/.test(line)) return null;
  const parts = line
    .trim()
    .split(/\s*(?=<<<)/)
    .map((part) => part.trim())
    .filter((part) => part.startsWith("<<<"));
  return parts.length > 0 ? parts : null;
}

function renderIncludeFence(include: ParsedInclude, content: string): string {
  const lang = include.lang ?? langForPath(include.filePath);
  const title = include.title ?? baseName(include.filePath);
  const info = [lang, include.highlights, `[${title}]`].filter(Boolean).join(" ");
  const ticks = fenceTicksForContent(content);
  return `${ticks}${info}\n${content.replace(/\n$/, "")}\n${ticks}`;
}

/**
 * Inline `<<<` includes as fenced code blocks. `readFile` resolves an include
 * path (relative to the old note directory) to file content, or null.
 */
export function inlineIncludes(
  body: string,
  readFile: (includePath: string) => string | null,
  onFailure?: (includePath: string) => void,
): { body: string; inlined: number } {
  const lines = body.split("\n");
  const out: string[] = [];
  let inlined = 0;
  for (const line of lines) {
    const segments = includeSegments(line);
    if (!segments) {
      out.push(line);
      continue;
    }
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]!;
      const include = parseIncludeLine(segment);
      if (!include) {
        out.push(segment);
        continue;
      }
      const content = readFile(include.filePath);
      if (content == null) {
        onFailure?.(include.filePath);
        out.push(segment);
        continue;
      }
      if (i > 0 && out.length > 0 && out[out.length - 1] !== "") out.push("");
      out.push(renderIncludeFence(include, content));
      inlined += 1;
    }
  }
  return { body: out.join("\n"), inlined };
}

async function listNoteDirs(notesDir: string): Promise<Array<{ index: string; title: string; dir: string }>> {
  const entries = await fs.readdir(notesDir, { withFileTypes: true }).catch(() => []);
  const dirs: Array<{ index: string; title: string; dir: string }> = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const match = entry.name.match(NOTE_DIR_REGEX);
    if (!match) continue;
    dirs.push({ index: match[1]!, title: match[2]!, dir: entry.name });
  }
  return dirs.sort((a, b) => a.index.localeCompare(b.index));
}

export async function migrateKnowledgeBase(
  rootPath: string,
  options?: { dryRun?: boolean },
): Promise<MigrateReport> {
  const dryRun = options?.dryRun ?? false;
  const root = path.resolve(rootPath);
  const report: MigrateReport = {
    notesMigrated: 0,
    includesInlined: 0,
    assetsMoved: 0,
    assetsRenamed: {},
    includeFailures: [],
    leftovers: [],
    scaffolded: [],
    preservedScripts: [],
    dryRun,
  };

  const notesDir = path.join(root, NOTES_DIR);
  const kbAssetsDir = path.join(root, ASSETS_DIR);
  const noteDirs = await listNoteDirs(notesDir);
  if (noteDirs.length === 0) {
    throw new Error(`未找到旧格式笔记目录：${notesDir}`);
  }

  const oldKbConfig = await readJsonFile(path.join(root, ".tnotes.json"));
  const tnotesJsonPath = path.join(root, "tnotes.json");
  const tnotesJsonExists = await pathExists(tnotesJsonPath);
  let discussions = false;

  // Track kb-level asset name occupancy. Files are named `{index}-{basename}`
  // so ownership is visible. Identical bytes referenced by a later note reuse
  // the first referencing note's name (1:many → first detected index).
  const usedAssetNames = new Set<string>(
    await fs.readdir(kbAssetsDir).catch(() => [] as string[]),
  );
  const assetContentByName = new Map<string, Buffer>();
  const nameByContentHash = new Map<string, string>();

  const occupyName = (name: string, content: Buffer): void => {
    usedAssetNames.add(name);
    assetContentByName.set(name, content);
    nameByContentHash.set(contentHash(content), name);
  };

  const uniqueIndexedName = (index: string, originalName: string, content: Buffer): string => {
    const preferred = indexedAssetFileName(index, originalName);
    if (!usedAssetNames.has(preferred)) return preferred;
    const existing = assetContentByName.get(preferred);
    if (existing?.equals(content)) return preferred;
    const ext = path.extname(preferred);
    const stem = preferred.slice(0, preferred.length - ext.length);
    for (let counter = 2; ; counter += 1) {
      const candidate = `${stem}-${counter}${ext}`;
      if (!usedAssetNames.has(candidate)) return candidate;
    }
  };

  const claimAsset = (
    index: string,
    noteDirName: string,
    originalRel: string,
    content: Buffer,
    shareByContent: boolean,
  ): string => {
    const hash = contentHash(content);
    if (shareByContent) {
      const shared = nameByContentHash.get(hash);
      if (shared) return shared;
    }
    const newName = uniqueIndexedName(index, originalRel, content);
    const oldKey = `${noteDirName}/assets/${originalRel}`;
    if (newName !== baseName(originalRel) || newName !== originalRel) {
      report.assetsRenamed[oldKey] = `${ASSETS_DIR}/${newName}`;
    }
    occupyName(newName, content);
    report.assetsMoved += 1;
    return newName;
  };

  for (const noteDir of noteDirs) {
    const noteDirPath = path.join(notesDir, noteDir.dir);
    const readmePath = path.join(noteDirPath, "README.md");
    const readme = await fs.readFile(readmePath, "utf8").catch(() => null);
    if (readme == null) {
      report.includeFailures.push(`${noteDir.dir}: README.md 缺失，跳过`);
      continue;
    }

    // ---- frontmatter from per-note .tnotes.json ----
    const oldNoteConfig = (await readJsonFile(
      path.join(noteDirPath, ".tnotes.json"),
    )) as OldNoteConfig | null;
    const frontmatter: NoteFrontmatter = {};
    if (typeof oldNoteConfig?.id === "string" && oldNoteConfig.id.trim()) {
      frontmatter.id = oldNoteConfig.id.trim();
    }
    if (typeof oldNoteConfig?.description === "string" && oldNoteConfig.description.trim()) {
      frontmatter.description = oldNoteConfig.description.trim();
    }
    if (oldNoteConfig?.enableDiscussions === true) {
      discussions = true;
    }

    // ---- body: strip generated regions, inline includes, move assets ----
    let body = stripGeneratedRegions(parseNoteContent(readme).body || readme);

    const includeResult = inlineIncludes(
      body,
      (includePath) => {
        const absolute = path.resolve(noteDirPath, includePath);
        if (!absolute.startsWith(noteDirPath + path.sep)) return null;
        try {
          return readFileSync(absolute, "utf8");
        } catch {
          return null;
        }
      },
      (includePath) => report.includeFailures.push(`${noteDir.dir}: ${includePath}`),
    );
    body = includeResult.body;
    report.includesInlined += includeResult.inlined;

    // Move note-local assets to kb-level assets/{index}-{basename}.
    const noteAssetsDir = path.join(noteDirPath, "assets");
    const refRewrites = new Map<string, string>();
    const claimedSources = new Set<string>();
    const assetRefs = [...body.matchAll(LOCAL_ASSET_REF_REGEX)].map((m) => m[1]!);
    for (const ref of new Set(assetRefs)) {
      const sourcePath = path.join(noteAssetsDir, ref);
      const content = await fs.readFile(sourcePath).catch(() => null);
      if (!content) continue;
      const newName = claimAsset(noteDir.index, noteDir.dir, ref, content, true);
      refRewrites.set(ref, newName);
      claimedSources.add(path.resolve(sourcePath));
    }
    body = body.replace(LOCAL_ASSET_REF_REGEX, (whole, ref: string) => {
      const newName = refRewrites.get(ref);
      if (!newName) return whole;
      return `(../${ASSETS_DIR}/${newName})`;
    });

    for (const sourcePath of await listFilesRecursive(noteAssetsDir)) {
      if (claimedSources.has(path.resolve(sourcePath))) continue;
      const content = await fs.readFile(sourcePath).catch(() => null);
      if (!content) continue;
      const originalRel = path.relative(noteAssetsDir, sourcePath).split(path.sep).join("/");
      claimAsset(noteDir.index, noteDir.dir, originalRel, content, false);
    }

    // ---- write the new single-file note ----
    const newFileName = `${noteDir.dir}.md`;
    const newContent = serializeNoteContent(frontmatter, body.replace(/\n+$/, "\n"));
    if (!dryRun) {
      await fs.writeFile(path.join(notesDir, newFileName), newContent);
      await fs.rm(noteDirPath, { recursive: true, force: true });
    }
    report.notesMigrated += 1;
  }

  // Flush all claimed asset writes once (identical-content shares resolved).
  if (!dryRun && assetContentByName.size > 0) {
    await fs.mkdir(kbAssetsDir, { recursive: true });
    for (const [name, content] of assetContentByName) {
      const target = path.join(kbAssetsDir, name);
      if (await pathExists(target)) continue;
      await fs.writeFile(target, content);
    }
  }

  if (!tnotesJsonExists) {
    report.config = buildMigratedKbConfig(oldKbConfig, {
      directoryName: path.basename(root),
      discussions,
    });
    if (!dryRun) {
      await fs.writeFile(tnotesJsonPath, `${JSON.stringify(report.config, null, 2)}\n`);
    }
  }

  // ---- obsolete kb-level files ----
  for (const obsolete of [".tnotes.json", "sidebar.json"]) {
    if (!dryRun) await fs.rm(path.join(root, obsolete), { force: true });
  }

  const oldPackage = await readJsonFile(path.join(root, "package.json"));
  report.preservedScripts = Object.keys(extraPackageScripts(oldPackage));
  if (!dryRun) {
    report.scaffolded = await writeMigratedScaffold(root, oldPackage);
  } else {
    report.scaffolded = ["package.json", ".github/workflows/deploy.yml", ".gitignore", ".gitattributes"];
  }

  const leftoverCandidates = [
    "index.md",
    "package-lock.json",
    "tsconfig.json",
    ".vitepress",
    "docs",
    "todo",
    "demos",
  ];
  for (const leftover of leftoverCandidates) {
    if (await pathExists(path.join(root, leftover))) report.leftovers.push(leftover);
  }

  // TOC.md stays as-is (same syntax, done checkboxes already live there).
  if (!(await pathExists(path.join(root, TOC_FILE)))) {
    report.leftovers.push("⚠️ TOC.md 缺失");
  }

  return report;
}
