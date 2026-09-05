/**
 * src/atomic.ts
 *
 * Atomic file writes: stage to a temp sibling, fsync, rename into place.
 * Multi-write applies writes in order and restores originals on failure.
 */

import { randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

export interface AtomicWrite {
  path: string;
  data: string | Uint8Array;
  /** Preserve permission bits when replacing an existing file. */
  mode?: number;
}

interface OriginalFile {
  path: string;
  existed: boolean;
  data?: Buffer;
  mode?: number;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function stageWrite(write: AtomicWrite): Promise<string> {
  await fs.mkdir(path.dirname(write.path), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(write.path),
    `.${path.basename(write.path)}.${randomUUID()}.tmp`,
  );
  const handle = await fs.open(temporaryPath, "wx");
  try {
    await handle.writeFile(write.data);
    if (write.mode !== undefined) await handle.chmod(write.mode);
    await handle.sync();
  } finally {
    await handle.close();
  }
  return temporaryPath;
}

async function snapshotOriginal(filePath: string): Promise<OriginalFile> {
  if (!(await pathExists(filePath))) return { path: filePath, existed: false };
  const [data, stat] = await Promise.all([
    fs.readFile(filePath),
    fs.stat(filePath),
  ]);
  return { path: filePath, existed: true, data, mode: stat.mode };
}

/** Atomically replace one file, preserving its permission bits. */
export async function writeFileAtomic(
  filePath: string,
  data: string | Uint8Array,
): Promise<void> {
  const original = await pathExists(filePath)
    ? await fs.stat(filePath)
    : null;
  const staged = await stageWrite({ path: filePath, data, mode: original?.mode });
  await fs.rename(staged, filePath);
}

/** Apply several writes atomically (best-effort rollback on failure). */
export async function applyAtomicWrites(writes: AtomicWrite[]): Promise<void> {
  const originals: OriginalFile[] = [];
  for (const write of writes) {
    originals.push(await snapshotOriginal(write.path));
  }
  const staged: Array<{ from: string; to: string }> = [];
  try {
    for (const write of writes) {
      staged.push({ from: await stageWrite(write), to: write.path });
    }
    for (const { from, to } of staged) {
      await fs.rename(from, to);
    }
  } catch (error) {
    for (const { from } of staged) await fs.rm(from, { force: true });
    for (const original of originals) {
      if (original.existed && original.data) {
        const restore = await stageWrite({
          path: original.path,
          data: original.data,
          mode: original.mode,
        });
        await fs.rename(restore, original.path);
      } else {
        await fs.rm(original.path, { force: true });
      }
    }
    throw error;
  }
}
