/**
 * Map a legacy `.tnotes.json` object onto the new `tnotes.json` shape.
 */

import { isValidKbName } from "./name";

import type { KbConfig, KbIcon, KbStats } from "./types";

const MONTH_KEY = /^\d{2}\.\d{2}$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function githubUrlFromSocialLinks(oldConfig: Record<string, unknown>): string | undefined {
  const links = oldConfig.socialLinks;
  if (!Array.isArray(links)) return undefined;
  for (const item of links) {
    const rec = asRecord(item);
    if (!rec) continue;
    if (rec.icon !== "github") continue;
    const link = asNonEmptyString(rec.link);
    if (link?.startsWith("https://github.com/")) return link.replace(/\.git$/i, "");
  }
  return undefined;
}

function completedNotesCount(value: unknown): Record<string, number> | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  const counts: Record<string, number> = {};
  for (const [key, raw] of Object.entries(rec)) {
    if (!MONTH_KEY.test(key) || typeof raw !== "number" || !Number.isFinite(raw)) continue;
    counts[key] = raw;
  }
  return Object.keys(counts).length > 0 ? counts : undefined;
}

function iconFromRootItem(rootItem: Record<string, unknown>): KbIcon | undefined {
  const icon = asRecord(rootItem.icon);
  const src = asNonEmptyString(icon?.src);
  if (src && isHttpUrl(src)) return { src };
  return undefined;
}

function portFromOldConfig(oldConfig: Record<string, unknown>): number | undefined {
  const port = oldConfig.port;
  if (typeof port !== "number" || !Number.isInteger(port)) return undefined;
  if (port < 1 || port > 65535) return undefined;
  return port;
}

function baseFromPageUrl(pageUrl: string, name?: string): string | undefined {
  try {
    const url = new URL(pageUrl);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    if (pathname !== "/") {
      return `${pathname}/`;
    }
    if (name && url.hostname.endsWith("github.io")) {
      return `/${name}/`;
    }
  } catch {
    return name ? `/${name}/` : undefined;
  }
  return undefined;
}

export interface MigratedConfigContext {
  directoryName: string;
  /** True when any per-note `.tnotes.json` had `enableDiscussions: true`. */
  discussions?: boolean;
}

/** Build the new kb config. Unknown legacy keys are dropped. */
export function buildMigratedKbConfig(
  oldConfig: Record<string, unknown> | null,
  context: MigratedConfigContext,
): KbConfig {
  const rootItem = asRecord(oldConfig?.root_item) ?? {};
  const repoName = asNonEmptyString(oldConfig?.repoName);
  const name =
    (repoName && isValidKbName(repoName) ? repoName : undefined) ??
    (isValidKbName(context.directoryName) ? context.directoryName : undefined);

  const title = asNonEmptyString(rootItem.title) || repoName || context.directoryName;
  const description = asNonEmptyString(rootItem.details);
  const pageUrl = asNonEmptyString(rootItem.link);
  const icon = iconFromRootItem(rootItem);
  const port = oldConfig ? portFromOldConfig(oldConfig) : undefined;
  const repositoryUrl =
    (oldConfig ? githubUrlFromSocialLinks(oldConfig) : undefined) ??
    (name ? `https://github.com/tnotesjs/${name}` : undefined);
  const counts = completedNotesCount(rootItem.completed_notes_count);
  const stats: KbStats = { enabled: true };
  if (counts) stats.completedNotesCount = counts;

  const config: KbConfig = { title };
  if (name) config.name = name;
  if (description) config.description = description;
  if (icon) config.icon = icon;
  if (repositoryUrl) config.repositoryUrl = repositoryUrl;
  if (port != null) config.port = port;
  if (pageUrl) config.pageUrl = pageUrl;
  const base = pageUrl ? baseFromPageUrl(pageUrl, name) : name ? `/${name}/` : undefined;
  if (base) config.base = base;
  config.stats = stats;
  if (context.discussions) config.discussions = true;
  return config;
}
