import { listGroups } from '../../editor-groups/layoutModel'
import { pendingEditNoteUuids } from '../../editor/markdown/pendingEdits'

import type { useEditorStore } from '../editor'
import type { DocumentSession } from './helpers'

import type {
  AssetEditorSnapshotDto,
  EditorLayoutNode,
  EditorTab,
  RecoveryRecord
} from '../../../../shared/contracts'

function tabsInLayout(layout: EditorLayoutNode): EditorTab[] {
  return listGroups(layout).flatMap((group) => group.tabs)
}

function knowledgeBaseTabs(
  knowledgeBaseId: string,
  editor: ReturnType<typeof useEditorStore>
): EditorTab[] {
  const tabs = [
    ...tabsInLayout(editor.layout),
    ...Object.entries(editor.knowledgeBaseEditors).flatMap(([id, session]) =>
      id === knowledgeBaseId ? tabsInLayout(session.layout) : []
    )
  ]
  return tabs.filter((tab) => {
    if (
      tab.type === 'note' ||
      tab.type === 'kb-settings' ||
      tab.type === 'kb-assets' ||
      // 画布有未写完的内容时同样不能开始资源事务：重命名/回收会移动它正在写的文件
      tab.type === 'excalidraw'
    ) {
      return tab.knowledgeBaseId === knowledgeBaseId
    }
    return false
  })
}

export function collectAssetEditorSnapshot(input: {
  knowledgeBaseId: string
  editor: ReturnType<typeof useEditorStore>
  documents: Record<string, DocumentSession>
  pendingRecoveries: RecoveryRecord[]
}): AssetEditorSnapshotDto {
  const tabs = knowledgeBaseTabs(input.knowledgeBaseId, input.editor)
  const dirtyDocuments = Object.values(input.documents)
    .filter(
      (session) =>
        session.document.knowledgeBaseId === input.knowledgeBaseId &&
        (session.dirty || session.saving)
    )
    .map((session) => ({
      noteUuid: session.document.uuid,
      title: session.document.title,
      saving: session.saving
    }))
  const dirtyTabs = tabs
    .filter((tab) => tab.type !== 'web' && tab.type !== 'note-history' && Boolean(tab.dirty))
    .map((tab) => ({ type: tab.type, title: tab.title }))
  const pendingRecoveries = input.pendingRecoveries
    .filter((record) => record.knowledgeBaseId === input.knowledgeBaseId)
    .map((record) => ({ noteUuid: record.noteUuid, title: record.title }))
  return {
    dirtyDocuments,
    dirtyTabs,
    pendingRecoveries,
    pendingEdits: pendingEditNoteUuids(input.knowledgeBaseId).map((noteUuid) => ({ noteUuid })),
    kbSettingsDirty: tabs.some((tab) => tab.type === 'kb-settings' && Boolean(tab.dirty))
  }
}
