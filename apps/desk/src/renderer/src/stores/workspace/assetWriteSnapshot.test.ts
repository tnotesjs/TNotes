import { describe, expect, it } from 'vitest'

import { createGroup } from '../../editor-groups/layoutModel'
import { collectAssetEditorSnapshot } from './assetWriteSnapshot'

import type { DocumentSession } from './helpers'

describe('collectAssetEditorSnapshot', () => {
  it('collects dirty documents, settings tabs, recoveries without requiring path', () => {
    const layout = createGroup([
      {
        id: 'note-1',
        type: 'note',
        knowledgeBaseId: 'kb-a',
        knowledgeBaseName: 'A',
        noteUuid: 'n1',
        title: '笔记一',
        icon: null,
        viewMode: 'visual',
        pageWidth: 'standard',
        dirty: true
      },
      {
        id: 'settings-1',
        type: 'kb-settings',
        knowledgeBaseId: 'kb-a',
        knowledgeBaseName: 'A',
        title: '设置',
        icon: null,
        dirty: true
      }
    ])
    const documents: Record<string, DocumentSession> = {
      'kb-a:n1': {
        document: {
          knowledgeBaseId: 'kb-a',
          uuid: 'n1',
          index: '0001',
          title: '笔记一',
          dirName: '0001. 笔记一',
          fileName: '0001. 笔记一.md',
          filePath: '/tmp/n1.md',
          relPath: 'notes/0001. 笔记一.md',
          content: 'x',
          revision: 'r',
          config: { done: false },
          readOnly: false
        },
        content: 'x',
        dirty: true,
        saving: false,
        preserveSourceOnSave: false,
        externalConflict: false
      }
    }
    const snapshot = collectAssetEditorSnapshot({
      knowledgeBaseId: 'kb-a',
      editor: {
        layout,
        knowledgeBaseEditors: {}
      } as never,
      documents,
      pendingRecoveries: [
        {
          version: 1,
          knowledgeBaseId: 'kb-a',
          noteUuid: 'n2',
          title: '无 path 草稿',
          content: 'y',
          revision: 'r',
          updatedAt: '2026-09-10T00:00:00.000Z'
        }
      ]
    })
    expect(snapshot.dirtyDocuments).toEqual([{ noteUuid: 'n1', title: '笔记一', saving: false }])
    expect(snapshot.kbSettingsDirty).toBe(true)
    expect(snapshot.pendingRecoveries).toEqual([{ noteUuid: 'n2', title: '无 path 草稿' }])
  })
})
