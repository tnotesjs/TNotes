/**
 * src/assets.ts
 *
 * Library-level assets/ management: add (with name dedup), list, and
 * garbage-collect files not referenced from any note body.
 */

import fs from "node:fs/promises";
import path from "node:path";

import { ASSETS_DIR, NOTES_DIR } from "./constants";
import { writeFileAtomic } from "./atomic";

import type { AssetEntry } from "./types";

const IMAGE_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".ico",
]);

/** Markdown reference to an asset, e.g. ../assets/a.png or /assets/a.png. */
const ASSET_REF_REGEX = /(?:\.\.\/|\.\/|\/)assets\/([^\s)"'<>]+)/g;

function dedupeFileName(existing: Set<string>, fileName: string): string {
  if (!existing.has(fileName)) return fileName;
  const ext = path.posix.extname(fileName);
  const stem = fileName.slice(0, fileName.length - ext.length);
  for (let i = 1; ; i++) {
    const candidate = `${stem}-${i}${ext}`;
    if (!existing.has(candidate)) return candidate;
  }
}

async function walkAssets(dir: string, prefix: string): Promise<AssetEntry[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const result: AssetEntry[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await walkAssets(full, rel)));
    } else if (entry.isFile()) {
      const stat = await fs.stat(full);
      result.push({ name: entry.name, relPath: `${ASSETS_DIR}/${rel}`, size: stat.size });
    }
  }
  return result;
}

export async function listAssets(rootPath: string): Promise<AssetEntry[]> {
  return walkAssets(path.join(rootPath, ASSETS_DIR), "");
}

/**
 * Write an asset into assets/, deduping the file name. Returns the kb-relative
 * path and the markdown reference to paste into a note (`../assets/...`).
 */
export async function addAsset(
  rootPath: string,
  fileName: string,
  data: Uint8Array,
): Promise<{ relPath: string; markdownPath: string }> {
  const assetsDir = path.join(rootPath, ASSETS_DIR);
  await fs.mkdir(assetsDir, { recursive: true });
  const existing = new Set(await fs.readdir(assetsDir));
  const finalName = dedupeFileName(existing, path.basename(fileName));
  const relPath = `${ASSETS_DIR}/${finalName}`;
  await writeFileAtomic(path.join(rootPath, relPath), data);
  return { relPath, markdownPath: `../${relPath}` };
}

/** Collect asset references from all note bodies. */
export async function collectAssetReferences(rootPath: string): Promise<Set<string>> {
  const refs = new Set<string>();
  let noteFiles: string[] = [];
  try {
    noteFiles = await fs.readdir(path.join(rootPath, NOTES_DIR));
  } catch {
    return refs;
  }
  for (const file of noteFiles) {
    if (!file.endsWith(".md")) continue;
    const content = await fs.readFile(path.join(rootPath, NOTES_DIR, file), "utf8");
    for (const match of content.matchAll(ASSET_REF_REGEX)) {
      refs.add(`${ASSETS_DIR}/${match[1]}`);
    }
  }
  return refs;
}

export interface AssetsGcResult {
  /** kb-relative paths of assets not referenced by any note. */
  unreferenced: string[];
  deleted: string[];
}

/** Find (and optionally delete) assets not referenced from any note. */
export async function gcAssets(
  rootPath: string,
  options: { delete?: boolean } = {},
): Promise<AssetsGcResult> {
  const [assets, refs] = await Promise.all([
    listAssets(rootPath),
    collectAssetReferences(rootPath),
  ]);
  const unreferenced = assets
    .map((a) => a.relPath)
    .filter((relPath) => !refs.has(relPath));
  const deleted: string[] = [];
  if (options.delete) {
    for (const relPath of unreferenced) {
      await fs.rm(path.join(rootPath, relPath), { force: true });
      deleted.push(relPath);
    }
  }
  return { unreferenced, deleted };
}

export function isImageFileName(fileName: string): boolean {
  return IMAGE_EXTENSIONS.has(path.posix.extname(fileName).toLowerCase());
}
