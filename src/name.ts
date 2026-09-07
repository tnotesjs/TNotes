/**
 * GitHub-style knowledge-base name helpers.
 */

import path from "node:path";

import { KB_NAME_REGEX } from "./constants";

/** True when `value` matches GitHub repo naming rules. */
export function isValidKbName(value: string): boolean {
  return KB_NAME_REGEX.test(value);
}

/**
 * Extract a repo name from a git remote URL.
 * Supports https, ssh (`git@host:org/repo.git`), and scp-like forms.
 */
export function parseRepoNameFromRemoteUrl(remoteUrl: string): string | null {
  const trimmed = remoteUrl.trim();
  if (!trimmed) return null;

  let candidate = trimmed;
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const url = new URL(trimmed);
      candidate = url.pathname;
    } else if (trimmed.startsWith("git@") || trimmed.includes(":")) {
      const afterColon = trimmed.includes(":")
        ? trimmed.slice(trimmed.lastIndexOf(":") + 1)
        : trimmed;
      candidate = afterColon;
    }
  } catch {
    return null;
  }

  const base = path.posix.basename(candidate.replace(/\\/g, "/"));
  const name = base.replace(/\.git$/i, "");
  return isValidKbName(name) ? name : null;
}

/** Prefer configured name, then origin-derived name, then directory basename. */
export function resolveKbName(options: {
  configured?: string | null;
  originUrl?: string | null;
  directoryName?: string | null;
}): string | null {
  const configured = options.configured?.trim();
  if (configured && isValidKbName(configured)) return configured;

  if (options.originUrl) {
    const fromOrigin = parseRepoNameFromRemoteUrl(options.originUrl);
    if (fromOrigin) return fromOrigin;
  }

  const dir = options.directoryName?.trim();
  if (dir && isValidKbName(dir)) return dir;
  return null;
}
