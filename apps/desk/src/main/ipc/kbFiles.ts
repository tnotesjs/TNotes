import { workspaceManager } from '../workspaceManager'
import { IPC_CHANNELS } from '../../shared/contracts'
import { kbFilesListSchema, kbFilesReadSchema } from './schemas'
import { handle, type GetWindow } from './shared'

/**
 * 知识库文件浏览（Monaco 文本入口）。
 *
 * 只读、只列一层：拒绝名单（`.git` / `node_modules` / 生成目录）与"是不是文本"
 * 全部在主进程按字节判定，渲染端拿不到任意文件系统访问，也无法靠改扩展名绕过。
 */
export function registerKbFiles(getWindow: GetWindow): () => void {
  handle(IPC_CHANNELS.kbFilesList, getWindow, kbFilesListSchema, (input) =>
    workspaceManager.listKbFiles(input.knowledgeBaseId, input.relPath)
  )
  handle(IPC_CHANNELS.kbFilesRead, getWindow, kbFilesReadSchema, (input) =>
    workspaceManager.readKbTextFile(input.knowledgeBaseId, input.relPath)
  )
  return () => undefined
}
