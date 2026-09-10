import { workspaceManager } from '../workspaceManager'
import { IPC_CHANNELS } from '../../shared/contracts'
import {
  excalidrawCopySchema,
  excalidrawCreateSchema,
  excalidrawReadSchema,
  excalidrawWriteSchema
} from './schemas'
import { handle, type GetWindow } from './shared'

/**
 * 画布源文件的受限读写：只允许 assets/ 下的 .excalidraw，归属前缀与 realpath 校验
 * 在 @tnotesjs/kb 层完成；渲染端拿不到任意文件系统访问。
 */
export function registerExcalidraw(getWindow: GetWindow): () => void {
  handle(IPC_CHANNELS.excalidrawCreate, getWindow, excalidrawCreateSchema, (input) =>
    workspaceManager.createExcalidraw(input.knowledgeBaseId, input.noteUuid, input.content)
  )
  handle(IPC_CHANNELS.excalidrawRead, getWindow, excalidrawReadSchema, (input) =>
    workspaceManager.readExcalidraw(input.knowledgeBaseId, input.relPath)
  )
  handle(IPC_CHANNELS.excalidrawWrite, getWindow, excalidrawWriteSchema, (input) =>
    workspaceManager.writeExcalidraw(input.knowledgeBaseId, {
      relPath: input.relPath,
      content: input.content,
      expectedRevision: input.expectedRevision
    })
  )
  handle(IPC_CHANNELS.excalidrawCopy, getWindow, excalidrawCopySchema, (input) =>
    workspaceManager.copyExcalidraw(input.knowledgeBaseId, input.fromRelPath, input.toNoteUuid)
  )
  return () => undefined
}
