import type { KbSnapshot, TNotesKbWorkspace } from '@tnotesjs/kb'
import type { ExternalNoteChangeEvent, WorkspaceOverview } from '../../shared/contracts'

export interface KnowledgeBaseHandle {
  id: string
  name: string
  rootPath: string
  workspace: TNotesKbWorkspace
  snapshot: KbSnapshot
}

export interface WorkspaceChangeHint {
  /** 'content' = single note body edit; 'structural' = anything else. */
  kind: 'content' | 'structural'
  knowledgeBaseId?: string
  noteUuid?: string
}

export interface WorkspaceManagerEvents {
  changed: [WorkspaceOverview, WorkspaceChangeHint?]
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
