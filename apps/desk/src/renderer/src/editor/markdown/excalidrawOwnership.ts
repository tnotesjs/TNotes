/**
 * 画布归属校验（计划 2.1 / E7）。
 *
 * 规则：`.excalidraw` 文件的四位前缀是**主人**，引用它的是**使用状态**。
 * - 笔记里内嵌的组件必须指向自己编号的画布，否则只给诊断、不打开写编辑
 *   （手写引用不能绕过归属规则变成可写入口）
 * - 跨笔记的合法路径是「粘贴时自动复制一份自己的画布」，不是共享源文件
 */

export interface ExcalidrawOwnershipOk {
  ok: true
  ownerIndex: string
}

export interface ExcalidrawOwnershipProblem {
  ok: false
  code: 'missing-owner' | 'mismatch' | 'unknown-note-index'
  message: string
}

export type ExcalidrawOwnership = ExcalidrawOwnershipOk | ExcalidrawOwnershipProblem

/** `assets/0004-x.excalidraw` → `0004`；没有四位前缀返回 null。 */
export function excalidrawOwnerIndex(relPath: string): string | null {
  const name = relPath.split('/').pop() ?? ''
  return /^(\d{4})-/.exec(name)?.[1] ?? null
}

/** `notes/0001. 标题.md` → `0001`；没有四位前缀返回 null。 */
export function noteIndexFromRelPath(relPath: string): string | null {
  const name = relPath.split('/').pop() ?? ''
  return /^(\d{4})[.\s-]/.exec(name)?.[1] ?? null
}

export function checkExcalidrawOwnership(input: {
  /** 组件解析出来的知识库相对路径 */
  relPath: string
  /** 当前笔记的编号（来自文档会话；为空时用 noteRelPath 兜底） */
  noteIndex: string
  noteRelPath: string
}): ExcalidrawOwnership {
  const owner = excalidrawOwnerIndex(input.relPath)
  const noteIndex = input.noteIndex || (noteIndexFromRelPath(input.noteRelPath) ?? '')
  if (!owner) {
    return {
      ok: false,
      code: 'missing-owner',
      message: `画布文件名缺少四位笔记编号前缀：${input.relPath}`
    }
  }
  if (!/^\d{4}$/.test(noteIndex)) {
    return {
      ok: false,
      code: 'unknown-note-index',
      message: '当前笔记缺少四位编号，无法判断画布归属；画布以只读卡片展示'
    }
  }
  if (owner !== noteIndex) {
    return {
      ok: false,
      code: 'mismatch',
      message: `该画布属于笔记 ${owner}，当前笔记是 ${noteIndex}；跨笔记引用不打开写编辑，请重新插入它（会复制一份属于当前笔记的画布）`
    }
  }
  return { ok: true, ownerIndex: owner }
}
