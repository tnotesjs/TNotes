import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import { ASSETS_DIR, NOTES_DIR, TOC_FILE } from "./constants";
import { parseNoteContent, serializeNoteContent } from "./frontmatter";
import type { NoteFrontmatter } from "./types";

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
  /** Assets renamed due to kb-level name collisions (old → new). */
  assetsRenamed: Record<string, string>;
  /** Referenced include files that could not be read (left as-is). */
  includeFailures: string[];
  /** Old-layout leftovers the codemod deliberately did not delete. */
  leftovers: string[];
  dryRun: boolean;
}

interface OldNoteConfig {
  id?: unknown;
  description?: unknown;
}

const NOTE_DIR_REGEX = /^(\d{4})\.\s*(.+)$/;
const GENERATED_TITLE_REGEX = /^#\s+\[[^\]]*\]\(https?:\/\/[^)]*\)\s*$/;
const TOC_REGION_START = /^\s*<!--\s*region:toc\s*-->\s*$/;
const TOC_REGION_END = /^\s*<!--\s*endregion:toc\s*-->\s*$/;
const INCLUDE_LINE_REGEX = /^ {0,3}<<<\s+(.+)$/;
/** `./assets/x.png` (and bare `assets/x.png`) references in note bodies. */
const LOCAL_ASSET_REF_REGEX = /\(?\.\/assets\/([^\s)"']+)\)?/g;

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
  const highlightMatch = rest.match(/\s*\{([\d,\-\s]+)\}\s*$/);
  if (highlightMatch) {
    highlights = `{${highlightMatch[1]!.replace(/\s+/g, "")}}`;
    rest = rest.slice(0, highlightMatch.index).trim();
  }

  let lang: string | undefined;
  const langMatch = rest.match(/\s+\{([A-Za-z][\w#+-]*)\}\s*$/);
  if (langMatch) {
    lang = langMatch[1];
    rest = rest.slice(0, langMatch.index).trim();
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

function langForPath(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return EXT_TO_LANG[ext] ?? ext ?? "";
}

function baseName(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath;
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
    const include = parseIncludeLine(line);
    if (!include) {
      out.push(line);
      continue;
    }
    const content = readFile(include.filePath);
    if (content == null) {
      onFailure?.(include.filePath);
      out.push(line);
      continue;
    }
    const lang = include.lang ?? langForPath(include.filePath);
    const title = include.title ?? baseName(include.filePath);
    const info = [lang, include.highlights, `[${title}]`].filter(Boolean).join(" ");
    out.push(`\`\`\`${info}`);
    out.push(content.replace(/\n$/, ""));
    out.push("```");
    inlined += 1;
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
  const report: MigrateReport = {
    notesMigrated: 0,
    includesInlined: 0,
    assetsMoved: 0,
    assetsRenamed: {},
    includeFailures: [],
    leftovers: [],
    dryRun,
  };

  const notesDir = path.join(rootPath, NOTES_DIR);
  const kbAssetsDir = path.join(rootPath, ASSETS_DIR);
  const noteDirs = await listNoteDirs(notesDir);
  if (noteDirs.length === 0) {
    throw new Error(`未找到旧格式笔记目录：${notesDir}`);
  }

  // ---- kb config: old .tnotes.json → minimal tnotes.json ----
  const oldKbConfig = await readJsonFile(path.join(rootPath, ".tnotes.json"));
  const tnotesJsonPath = path.join(rootPath, "tnotes.json");
  if (!(await pathExists(tnotesJsonPath))) {
    const rootItem = (oldKbConfig?.root_item ?? {}) as Record<string, unknown>;
    const title =
      (typeof rootItem.title === "string" && rootItem.title) ||
      (typeof oldKbConfig?.repoName === "string" && oldKbConfig.repoName) ||
      path.basename(rootPath);
    const description =
      typeof rootItem.details === "string" && rootItem.details ? rootItem.details : undefined;
    const config: Record<string, unknown> = { title };
    if (description) config.description = description;
    if (!dryRun) {
      await fs.writeFile(tnotesJsonPath, `${JSON.stringify(config, null, 2)}\n`);
    }
  }

  // Track kb-level asset name occupancy for collision-safe moves.
  const usedAssetNames = new Set<string>(
    await fs.readdir(kbAssetsDir).catch(() => [] as string[]),
  );
  const assetContentByName = new Map<string, Buffer>();

  const claimAssetName = async (
    noteDirName: string,
    name: string,
    content: Buffer,
  ): Promise<string> => {
    if (!usedAssetNames.has(name)) {
      usedAssetNames.add(name);
      assetContentByName.set(name, content);
      return name;
    }
    const existing = assetContentByName.get(name);
    if (existing?.equals(content)) return name; // identical content: share
    const ext = path.extname(name);
    const stem = name.slice(0, name.length - ext.length);
    for (let counter = 2; ; counter += 1) {
      const candidate = `${stem}-${counter}${ext}`;
      if (!usedAssetNames.has(candidate)) {
        usedAssetNames.add(candidate);
        assetContentByName.set(candidate, content);
        report.assetsRenamed[`${noteDirName}/assets/${name}`] = `${ASSETS_DIR}/${candidate}`;
        return candidate;
      }
    }
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

    // Move note-local assets referenced by the body to kb-level assets/.
    const noteAssetsDir = path.join(noteDirPath, "assets");
    const refRewrites = new Map<string, string>();
    const assetRefs = [...body.matchAll(LOCAL_ASSET_REF_REGEX)].map((m) => m[1]!);
    for (const ref of new Set(assetRefs)) {
      const sourcePath = path.join(noteAssetsDir, ref);
      const content = await fs.readFile(sourcePath).catch(() => null);
      if (!content) continue;
      const newName = await claimAssetName(noteDir.dir, baseName(ref), content);
      refRewrites.set(ref, newName);
      report.assetsMoved += 1;
    }
    body = body.replace(LOCAL_ASSET_REF_REGEX, (whole, ref: string) => {
      const newName = refRewrites.get(ref);
      if (!newName) return whole;
      return whole.replace(`./assets/${ref}`, `../${ASSETS_DIR}/${newName}`);
    });

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

  // ---- obsolete kb-level files ----
  for (const obsolete of [".tnotes.json", "sidebar.json"]) {
    if (!dryRun) await fs.rm(path.join(rootPath, obsolete), { force: true });
  }
  for (const leftover of ["index.md", "package.json", "package-lock.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "tsconfig.json", ".vitepress", "public", "docs", "todo"]) {
    if (await pathExists(path.join(rootPath, leftover))) report.leftovers.push(leftover);
  }

  // TOC.md stays as-is (same syntax, done checkboxes already live there).
  if (!(await pathExists(path.join(rootPath, TOC_FILE)))) {
    report.leftovers.push("⚠️ TOC.md 缺失");
  }

  return report;
}
