import { existsSync } from 'fs'
import { join } from 'path'
import type {
  KbSnapshot,
  TocEntryRef,
  TocNode as KbTocNode
} from '@tnotesjs/kb'
import {
  collectSubtreeNoteIndexes,
  findGroupLineIndex,
  findNoteLineIndex,
  readTocLines,
  scanKnowledgeBase
} from '@tnotesjs/kb'
import { getWorkspace } from './kbWorkspace'
import { nodeIdForFolder, nodeIdForNote } from './tocNodeId'

export type TocNode =
  | {
      type: 'group'
      title: string
      tocLineIndex: number
      nodeId: string
      folderPath: string[]
      children: TocNode[]
    }
  | {
      type: 'note'
      /** Display title with index, e.g. "0001. 最长回文子串" (the note file stem). */
      title: string
      /** Index-free display title; used for rename pre-fill. */
      noteTitle: string
      /** Note file stem (`NNNN. 标题`) — webview key for open/git-marks. */
      noteDir: string
      noteIndex: string
      tocLineIndex: number
      nodeId: string
      completed: boolean
      children: TocNode[]
    }

function toNavTocNodes(snapshot: KbSnapshot): TocNode[] {
  const byIndex = new Map(snapshot.notes.map((note) => [note.index, note]))
  const build = (nodes: KbTocNode[], folderPath: string[]): TocNode[] => {
    const result: TocNode[] = []
    for (const node of nodes) {
      if (node.kind === 'group') {
        const path = [...folderPath, node.title]
        result.push({
          type: 'group',
          title: node.title,
          tocLineIndex: node.lineIndex,
          nodeId: nodeIdForFolder(path),
          folderPath: path,
          children: build(node.children, path)
        })
        continue
      }
      const note = byIndex.get(node.index)
      if (!note) continue
      const stem = `${node.index}. ${note.title}`
      result.push({
        type: 'note',
        title: stem,
        noteTitle: note.title,
        noteDir: stem,
        noteIndex: node.index,
        tocLineIndex: node.lineIndex,
        nodeId: nodeIdForNote(node.index),
        completed: node.done,
        children: build(node.children, folderPath)
      })
    }
    return result
  }
  return build(snapshot.toc, [])
}

export interface TocReadResult {
  toc: TocNode[]
  /** Snapshot revision of the repo (changes on any structural edit). */
  revision: string
}

/**
 * Nav only reads the single-file format (tnotes.json + TOC.md + notes/*.md).
 * 旧格式（.tnotes.json）已随 core 归档彻底淘汰，遇到时直接报错而非显示空树。
 */
function assertSingleFileFormat(repoRoot: string): void {
  if (existsSync(join(repoRoot, 'tnotes.json'))) return
  if (existsSync(join(repoRoot, '.tnotes.json'))) {
    throw new Error('该知识库仍是旧格式（.tnotes.json），当前版本已不再支持')
  }
}

export async function readToc(repoRoot: string): Promise<TocReadResult> {
  assertSingleFileFormat(repoRoot)
  const snapshot = await getWorkspace(repoRoot).scan()
  return { toc: toNavTocNodes(snapshot), revision: snapshot.revision }
}

/** Titles of the notes that `toc.removeEntry(ref)` would delete (preview). */
export async function previewDelete(
  repoRoot: string,
  ref: TocEntryRef
): Promise<{ notes: Array<{ title: string }> }> {
  const lines = await readTocLines(repoRoot)
  const lineIndex =
    ref.type === 'note'
      ? findNoteLineIndex(lines, ref.index)
      : findGroupLineIndex(lines, ref.groupPath)
  const indexes = collectSubtreeNoteIndexes(lines, lineIndex)
  const snapshot = await scanKnowledgeBase(repoRoot)
  const byIndex = new Map(snapshot.notes.map((note) => [note.index, note]))
  return {
    notes: indexes.map((index) => ({ title: byIndex.get(index)?.title ?? index }))
  }
}

export function noteFilePath(repoRoot: string, noteDir: string): string {
  return join(repoRoot, 'notes', `${noteDir}.md`)
}

export function repoReadmePath(repoRoot: string): string {
  return join(repoRoot, 'README.md')
}

/** Snapshot used by the TOC pinned shortcuts section. */
export type TocPinnedNode = {
  type: 'group' | 'note'
  nodeId: string
  title: string
  noteDir?: string
  completed?: boolean
}

export function findTocNode(
  nodes: TocNode[],
  nodeId: string,
  ancestors: string[] = []
): { node: TocNode; ancestorIds: string[] } | null {
  for (const node of nodes) {
    if (node.nodeId === nodeId) {
      return { node, ancestorIds: ancestors }
    }
    if (node.children.length) {
      const found = findTocNode(node.children, nodeId, [...ancestors, node.nodeId])
      if (found) return found
    }
  }
  return null
}

export function collectTocNodeIds(nodes: TocNode[]): Set<string> {
  const ids = new Set<string>()
  const walk = (list: TocNode[]) => {
    for (const node of list) {
      ids.add(node.nodeId)
      if (node.children.length) walk(node.children)
    }
  }
  walk(nodes)
  return ids
}

export function filterPinnedTocIds(pinnedIds: string[], toc: TocNode[]): string[] {
  const existing = collectTocNodeIds(toc)
  return pinnedIds.filter((id) => existing.has(id))
}

export function flattenPinnedNodes(toc: TocNode[], pinnedIds: string[]): TocPinnedNode[] {
  const result: TocPinnedNode[] = []
  for (const id of pinnedIds) {
    const found = findTocNode(toc, id)
    if (!found) continue
    const { node } = found
    if (node.type === 'group') {
      result.push({ type: 'group', nodeId: node.nodeId, title: node.title })
    } else {
      result.push({
        type: 'note',
        nodeId: node.nodeId,
        title: node.title,
        noteDir: node.noteDir,
        completed: node.completed
      })
    }
  }
  return result
}
