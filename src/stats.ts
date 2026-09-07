/**
 * Completion-trend statistics from TOC.md git history.
 *
 * Algorithm:
 * 1. Birth date = first commit on HEAD
 * 2. Walk commits oldest→newest; for each TOC.md parse `- [x] NNNN.` indexes (deduped)
 * 3. Snapshots keyed by commit month `YY.MM`
 * 4. Fill empty months from birth month through the current month
 */

import path from "node:path";

import { writeFileAtomic } from "./atomic";
import { CONFIG_FILE, TOC_FILE } from "./constants";
import { KbError } from "./errors";
import {
  isGitRepository,
  listCommitsOldestFirst,
  listRootCommits,
  readFileAtCommit,
} from "./git";
import { readKbConfig } from "./scanner";
import { parseTocLine } from "./toc";

import type { KbConfig, KbStats, MutationResult } from "./types";

/** Parse completed note indexes from a TOC.md body (dedupe by index). */
export function parseCompletedNoteIndexes(tocContent: string): Set<string> {
  const indexes = new Set<string>();
  for (const line of tocContent.split("\n")) {
    const parsed = parseTocLine(line);
    if (parsed.kind !== "note" || !parsed.noteIndex || !parsed.done) continue;
    indexes.add(parsed.noteIndex);
  }
  return indexes;
}

export function toMonthKey(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${yy}.${mm}`;
}

function parseMonthKey(key: string): { year: number; month: number } | null {
  const match = /^(\d{2})\.(\d{2})$/.exec(key);
  if (!match) return null;
  const year = 2000 + Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

/** Inclusive month range from `fromKey` through `toKey`. */
export function enumerateMonthKeys(fromKey: string, toKey: string): string[] {
  const from = parseMonthKey(fromKey);
  const to = parseMonthKey(toKey);
  if (!from || !to) return [];
  const keys: string[] = [];
  let y = from.year;
  let m = from.month;
  while (y < to.year || (y === to.year && m <= to.month)) {
    keys.push(`${String(y).slice(-2)}.${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return keys;
}

/**
 * Fill gaps between birth and current month; carry forward the last known count.
 */
export function fillCompletedNotesCount(
  snapshots: Record<string, number>,
  birthKey: string,
  currentKey: string,
): Record<string, number> {
  const months = enumerateMonthKeys(birthKey, currentKey);
  const result: Record<string, number> = {};
  let prev = 0;
  for (const key of months) {
    if (Object.prototype.hasOwnProperty.call(snapshots, key)) {
      prev = snapshots[key];
    }
    result[key] = prev;
  }
  return result;
}

export interface StatsUpdateResult {
  completedNotesCount: Record<string, number>;
  birthMonth: string;
  currentMonth: string;
  commitsScanned: number;
}

/**
 * Compute monthly completed-note counts from TOC.md history.
 * Does not write config — callers decide when to persist.
 */
export async function computeCompletedNotesCount(
  rootPath: string,
): Promise<StatsUpdateResult> {
  if (!(await isGitRepository(rootPath))) {
    throw new KbError(
      "INVALID_OPERATION",
      "当前目录不是 Git 仓库，无法更新完成趋势统计",
    );
  }

  const roots = await listRootCommits(rootPath);
  if (roots.length === 0) {
    throw new KbError("INVALID_OPERATION", "无法确定知识库首次 commit");
  }
  const birthDate = new Date(roots[0].authorDate || Date.now());
  const birthKey = toMonthKey(birthDate);
  const currentKey = toMonthKey(new Date());

  const commits = await listCommitsOldestFirst(rootPath);
  const monthly: Record<string, number> = {};
  let commitsScanned = 0;

  for (const commit of commits) {
    const toc = await readFileAtCommit(rootPath, commit.hash, TOC_FILE);
    if (toc == null) continue;
    commitsScanned += 1;
    const count = parseCompletedNoteIndexes(toc).size;
    const monthKey = toMonthKey(new Date(commit.authorDate || Date.now()));
    monthly[monthKey] = count;
  }

  // Ensure birth month exists even if TOC appeared later.
  if (!Object.prototype.hasOwnProperty.call(monthly, birthKey)) {
    monthly[birthKey] = 0;
  }

  const completedNotesCount = fillCompletedNotesCount(monthly, birthKey, currentKey);
  return {
    completedNotesCount,
    birthMonth: birthKey,
    currentMonth: currentKey,
    commitsScanned,
  };
}

/** Update `stats.completedNotesCount` when `stats.enabled` is true. */
export async function updateCompletedNotesStats(
  rootPath: string,
): Promise<MutationResult<KbStats>> {
  const { config } = await readKbConfig(rootPath);
  if (!config.stats?.enabled) {
    throw new KbError(
      "INVALID_OPERATION",
      "完成趋势统计未开启（tnotes.json → stats.enabled）",
    );
  }

  const computed = await computeCompletedNotesCount(rootPath);
  const nextStats: KbStats = {
    ...config.stats,
    enabled: true,
    completedNotesCount: computed.completedNotesCount,
  };
  const nextConfig: KbConfig = { ...config, stats: nextStats };
  await writeFileAtomic(
    path.join(rootPath, CONFIG_FILE),
    `${JSON.stringify(nextConfig, null, 2)}\n`,
  );

  return {
    value: nextStats,
    changedFiles: [{ path: CONFIG_FILE, kind: "updated" }],
  };
}
