/**
 * 单测用的自组编辑器夹具。
 *
 * 迁移前这些测试借 `new Crepe(...)` 拿一个「真编辑器」；去掉 Crepe 之后统一走这里，
 * 装配与生产同源（`createDeskEditor`），测试只按需追加自己的插件。
 */
import type { Editor } from '@milkdown/kit/core'

import { createDeskEditor, type DeskEditorHandle } from './deskEditor'

export interface TestDeskEditor {
  root: HTMLElement
  handle: DeskEditorHandle
}

export async function createTestDeskEditor(
  options: {
    /** 已经是投影后的文档（调用方自行决定要不要 `projectRawBlocksForMilkdown`）。 */
    defaultValue?: string
    isReadOnly?: () => boolean
    /** 追加测试需要的插件（必须在 create() 之前注册）。 */
    configure?: (editor: Editor) => void
    /** 额外装配配置（如带菜单/工具条的场景）。 */
    features?: Parameters<typeof createDeskEditor>[0] extends infer T
      ? Omit<NonNullable<T>, 'root' | 'defaultValue' | 'codeBlock' | 'isReadOnly' | 'uploadImage'>
      : never
  } = {}
): Promise<TestDeskEditor> {
  const root = document.createElement('div')
  document.body.append(root)
  const handle = createDeskEditor({
    root,
    defaultValue: options.defaultValue ?? '',
    codeBlock: {},
    isReadOnly: options.isReadOnly ?? (() => false),
    uploadImage: async () => ({ src: 'https://example.com/uploaded.png' }),
    ...options.features
  })
  options.configure?.(handle.editor)
  await handle.create()
  return { root, handle }
}
