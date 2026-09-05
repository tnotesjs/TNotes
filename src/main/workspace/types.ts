import type { KbSnapshot, TNotesKbWorkspace } from '@tnotesjs/kb'
import type { ExternalNoteChangeEvent, WorkspaceOverview } from '../../shared/contracts'

export const KNOWLEDGE_BASE_NAME = /^TNotes\./

export interface KnowledgeBaseHandle {
  id: string
  name: string
  rootPath: string
  workspace: TNotesKbWorkspace
  snapshot: KbSnapshot
}

export interface WorkspaceManagerEvents {
  changed: [WorkspaceOverview]
  noteExternalChanged: [ExternalNoteChangeEvent]
}

export interface GitRepositoryDescriptor {
  knowledgeBaseId: string
  knowledgeBaseName: string
  configId: string
  rootPath: string
  notes: Array<{
    uuid: string
    index: string
    title: string
    dirName: string
    filePath: string
  }>
}
