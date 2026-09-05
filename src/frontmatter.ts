/**
 * src/frontmatter.ts
 *
 * Whitelisted frontmatter parse/serialize for single-file notes.
 * Parsing tolerates any YAML; serialization writes whitelist keys only.
 */

import matter from "gray-matter";

import { FRONTMATTER_KEYS } from "./constants";

import type { NoteFrontmatter } from "./types";

export interface ParsedNoteContent {
  frontmatter: NoteFrontmatter;
  /** Markdown body without the frontmatter block. */
  body: string;
}

function cleanString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Parse note content, returning only whitelisted frontmatter fields. */
export function parseNoteContent(content: string): ParsedNoteContent {
  const { data, content: body } = matter(content);
  const frontmatter: NoteFrontmatter = {};
  const id = cleanString(data.id);
  if (id) frontmatter.id = id;
  const description = cleanString(data.description);
  if (description) frontmatter.description = description;
  if (data.draft === true) frontmatter.draft = true;
  return { frontmatter, body };
}

/**
 * Serialize frontmatter + body. Only whitelisted, non-empty keys are written,
 * in a stable order. No frontmatter block is emitted when empty.
 */
export function serializeNoteContent(
  frontmatter: NoteFrontmatter,
  body: string,
): string {
  const ordered: Record<string, unknown> = {};
  for (const key of FRONTMATTER_KEYS) {
    const value = frontmatter[key];
    if (typeof value === "string" && value.trim()) ordered[key] = value.trim();
    else if (value === true) ordered[key] = true;
  }
  const normalizedBody = body.startsWith("\n") ? body.slice(1) : body;
  if (Object.keys(ordered).length === 0) {
    return normalizedBody.endsWith("\n") ? normalizedBody : `${normalizedBody}\n`;
  }
  return matter.stringify(`\n${normalizedBody.replace(/\n$/, "")}\n`, ordered);
}

/** Merge updates into existing file content, preserving the body. */
export function updateNoteFrontmatter(
  content: string,
  updates: Partial<NoteFrontmatter>,
): string {
  const { frontmatter, body } = parseNoteContent(content);
  const next: NoteFrontmatter = { ...frontmatter };
  for (const key of FRONTMATTER_KEYS) {
    if (!(key in updates)) continue;
    const value = updates[key];
    if (value === undefined || value === "" || value === false) {
      delete next[key];
    } else {
      (next as Record<string, unknown>)[key] = value;
    }
  }
  return serializeNoteContent(next, body);
}
