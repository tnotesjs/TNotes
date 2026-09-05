import { createHash } from 'node:crypto'

import type { KbSnapshot, NoteDoc, TocNode } from '@tnotesjs/kb'
import type {
  DeskTocNode,
  KnowledgeBaseDescriptor,
  KnowledgeBaseDetail,
  NoteDocumentDto
} from '../../shared/contracts'

import type { KnowledgeBaseHandle } from './types'

export function stablePathSuffix(rootPath: string): string {
  return createHash('sha256').update(rootPath).digest('hex').slice(0, 10)
}

/** desk-stable kb id: derived from the root path (survives config edits). */
export function knowledgeBaseId(rootPath: string): string {
  return stablePathSuffix(rootPath)
}

function iconFromConfig(snapshot: KbSnapshot): KnowledgeBaseDescriptor['icon'] {
  const icon = snapshot.config.icon
  if (!icon || typeof icon !== 'object') return null
  const value = icon as Record<string, unknown>
  return {
    src: typeof value.src === 'string' ? value.src : undefined,
    svg: typeof value.svg === 'string' ? value.svg : undefined
  }
}

function httpUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export function descriptor(handle: KnowledgeBaseHandle): KnowledgeBaseDescriptor {
  const snapshot = handle.snapshot
  const hasError = snapshot.diagnostics.some((d) => d.severity === 'error')
  return {
    id: handle.id,
    configId: handle.id,
    name: handle.name,
    rootPath: handle.rootPath,
    displayName: snapshot.config.title?.trim() || handle.name.replace(/^TNotes\./, ''),
    icon: iconFromConfig(snapshot),
    repositoryUrl: httpUrl(snapshot.config.repositoryUrl),
    pageUrl: httpUrl(snapshot.config.pageUrl),
    health: hasError ? 'invalid' : 'ready',
    diagnostics: snapshot.diagnostics,
    noteCount: snapshot.notes.length,
    snapshotRevision: snapshot.revision
  }
}

export function mapToc(nodes: TocNode[], snapshot: KbSnapshot): DeskTocNode[] {
  const noteByIndex = new Map(snapshot.notes.map((note) => [note.index, note]))
  const walk = (items: TocNode[], folderPath: string[]): DeskTocNode[] =>
    items.flatMap((node): DeskTocNode[] => {
      const tocLineIndex = node.lineIndex
      if (node.kind === 'group') {
        const currentPath = [...folderPath, node.title]
        return [
          {
            type: 'group',
            title: node.title,
            tocLineIndex,
            nodeId: `folder:${tocLineIndex}:${currentPath.join('/')}`,
            folderPath: currentPath,
            children: walk(node.children, currentPath)
          }
        ]
      }
      const note = noteByIndex.get(node.index)
      if (!note) return []
      const uuid = note.frontmatter.id ?? note.index
      return [
        {
          type: 'note',
          uuid,
          title: note.title,
          dirName: note.fileName.replace(/\.md$/i, ''),
          noteIndex: note.index,
          tocLineIndex,
          nodeId: `note:${uuid}`,
          completed: node.done,
          children: walk(node.children, folderPath)
        }
      ]
    })
  return walk(nodes, [])
}

export function toDetail(handle: KnowledgeBaseHandle): KnowledgeBaseDetail {
  return {
    ...descriptor(handle),
    toc: mapToc(handle.snapshot.toc, handle.snapshot)
  }
}

export function toNoteDocument(handle: KnowledgeBaseHandle, doc: NoteDoc): NoteDocumentDto {
  const readOnly = handle.snapshot.diagnostics.some((d) => d.severity === 'error')
  return {
    knowledgeBaseId: handle.id,
    uuid: doc.frontmatter.id ?? doc.index,
    index: doc.index,
    title: doc.title,
    dirName: doc.fileName.replace(/\.md$/i, ''),
    fileName: doc.fileName,
    relPath: doc.relPath,
    filePath: `${handle.rootPath}/${doc.relPath}`,
    content: doc.content,
    revision: doc.revision,
    config: {
      done: doc.done,
      description: doc.frontmatter.description
    },
    readOnly
  }
}
