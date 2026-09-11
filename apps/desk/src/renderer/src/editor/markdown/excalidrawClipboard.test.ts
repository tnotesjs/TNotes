import { describe, expect, it } from 'vitest'

import {
  excalidrawPasteDedupeKey,
  normalizeClipboardText,
  parseExcalidrawClipboardPayload,
  planExcalidrawPaste,
  recallExcalidrawClipboard,
  rememberExcalidrawClipboard,
  resetExcalidrawClipboard,
  serializeExcalidrawClipboardPayload,
  type ExcalidrawClipboardPayload
} from './excalidrawClipboard'

const SOURCE_REL = 'assets/0001-26-09-10-15-30-00.excalidraw'

function payload(overrides: Partial<ExcalidrawClipboardPayload> = {}): ExcalidrawClipboardPayload {
  return {
    version: 1,
    knowledgeBaseId: 'kb-a',
    noteUuid: 'note-a',
    noteRelPath: 'notes/0001. A.md',
    noteIndex: '0001',
    entries: [{ rawPath: '../assets/0001-26-09-10-15-30-00.excalidraw', relPath: SOURCE_REL }],
    ...overrides
  }
}

describe('剪贴板载荷序列化', () => {
  it('往返一致', () => {
    const text = serializeExcalidrawClipboardPayload(payload())
    expect(parseExcalidrawClipboardPayload(text)).toEqual(payload())
  })

  it('非本载荷/坏 JSON/空 entries 一律 null', () => {
    expect(parseExcalidrawClipboardPayload(null)).toBeNull()
    expect(parseExcalidrawClipboardPayload('not json')).toBeNull()
    expect(parseExcalidrawClipboardPayload('{"version":2}')).toBeNull()
    expect(
      parseExcalidrawClipboardPayload('{"version":1,"knowledgeBaseId":"kb","entries":[]}')
    ).toBeNull()
    expect(
      parseExcalidrawClipboardPayload('{"version":1,"knowledgeBaseId":"kb","entries":[{}]}')
    ).toBeNull()
  })

  it('rawPath 缺省时退回 relPath', () => {
    const parsed = parseExcalidrawClipboardPayload(
      '{"version":1,"knowledgeBaseId":"kb","entries":[{"relPath":"assets/0001-a.excalidraw"}]}'
    )
    expect(parsed?.entries[0]).toEqual({
      rawPath: 'assets/0001-a.excalidraw',
      relPath: 'assets/0001-a.excalidraw'
    })
  })
})

describe('粘贴计划', () => {
  it('同笔记粘贴：沿用原文件，只按目标笔记目录重算相对引用', () => {
    const decisions = planExcalidrawPaste({
      payload: payload(),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        noteIndex: '0001',
        noteRelPath: 'notes/0001. A.md'
      }
    })
    expect(decisions).toHaveLength(1)
    expect(decisions[0]).toMatchObject({
      kind: 'reuse',
      relPath: SOURCE_REL,
      rawPath: '../assets/0001-26-09-10-15-30-00.excalidraw'
    })
  })

  it('同笔记但目标笔记在子目录：相对引用跟着改，文件不变', () => {
    const decisions = planExcalidrawPaste({
      payload: payload(),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        noteIndex: '0001',
        noteRelPath: 'notes/sub/0001. A.md'
      }
    })
    expect(decisions[0]).toMatchObject({
      kind: 'reuse',
      relPath: SOURCE_REL,
      rawPath: '../../assets/0001-26-09-10-15-30-00.excalidraw'
    })
  })

  it('跨笔记粘贴：按目标笔记编号复制（同库走 copy）', () => {
    const decisions = planExcalidrawPaste({
      payload: payload(),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-b',
        noteIndex: '0002',
        noteRelPath: 'notes/0002. B.md'
      }
    })
    expect(decisions[0]).toMatchObject({
      kind: 'copy',
      crossKnowledgeBase: false,
      source: { knowledgeBaseId: 'kb-a', relPath: SOURCE_REL },
      dedupeKey: excalidrawPasteDedupeKey('kb-a', SOURCE_REL)
    })
  })

  it('跨 KB 粘贴：标记 crossKnowledgeBase（读源库 + 在目标库建新文件）', () => {
    const decisions = planExcalidrawPaste({
      payload: payload({ knowledgeBaseId: 'kb-other' }),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-b',
        noteIndex: '0002',
        noteRelPath: 'notes/0002. B.md'
      }
    })
    expect(decisions[0]).toMatchObject({
      kind: 'copy',
      crossKnowledgeBase: true,
      source: { knowledgeBaseId: 'kb-other', relPath: SOURCE_REL }
    })
  })

  it('同一个源出现两次：两次决策共用同一个去重键（调用方只复制一次）', () => {
    const decisions = planExcalidrawPaste({
      payload: payload({
        entries: [
          { rawPath: '../assets/0001-26-09-10-15-30-00.excalidraw', relPath: SOURCE_REL },
          { rawPath: './other/../assets/0001-26-09-10-15-30-00.excalidraw', relPath: SOURCE_REL }
        ]
      }),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-b',
        noteIndex: '0002',
        noteRelPath: 'notes/0002. B.md'
      }
    })
    expect(decisions.map((decision) => decision.kind)).toEqual(['copy', 'copy'])
    const keys = decisions.map((decision) =>
      decision.kind === 'copy' ? decision.dedupeKey : decision.kind
    )
    expect(new Set(keys).size).toBe(1)
  })

  it('没有前缀 / 目标笔记没有编号：给诊断，不复制', () => {
    const noOwner = planExcalidrawPaste({
      payload: payload({
        entries: [{ rawPath: './assets/x.excalidraw', relPath: 'assets/x.excalidraw' }]
      }),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-b',
        noteIndex: '0002',
        noteRelPath: 'notes/0002. B.md'
      }
    })
    expect(noOwner[0]).toMatchObject({ kind: 'diagnostic', code: 'missing-owner' })

    const noIndex = planExcalidrawPaste({
      payload: payload(),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-b',
        noteIndex: '',
        noteRelPath: 'notes/README.md'
      }
    })
    expect(noIndex[0]).toMatchObject({ kind: 'diagnostic', code: 'unknown-note-index' })
  })

  it('目标会话没有 index 时用笔记文件名兜底', () => {
    const decisions = planExcalidrawPaste({
      payload: payload(),
      target: {
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-b',
        noteIndex: '',
        noteRelPath: 'notes/0001. A.md'
      }
    })
    expect(decisions[0]?.kind).toBe('reuse')
  })
})

describe('复制上下文缓存（按剪贴板原文精确匹配）', () => {
  it('文本完全一致才命中；换行/首尾空白差异不影响', () => {
    resetExcalidrawClipboard()
    const text = '<Excalidraw path="../assets/0001-a.excalidraw" />'
    rememberExcalidrawClipboard(text, payload())
    expect(recallExcalidrawClipboard(text)?.knowledgeBaseId).toBe('kb-a')
    expect(recallExcalidrawClipboard(`  ${text}\r\n`)).not.toBeNull()
    // 围栏示例/多一段文字都不算同一次复制
    expect(recallExcalidrawClipboard(`\`\`\`md\n${text}\n\`\`\``)).toBeNull()
    expect(recallExcalidrawClipboard(`${text}\n\n别的文字`)).toBeNull()
  })

  it('没复制过 / 空文本不命中', () => {
    resetExcalidrawClipboard()
    expect(recallExcalidrawClipboard('<Excalidraw path="a" />')).toBeNull()
    rememberExcalidrawClipboard('', payload())
    expect(recallExcalidrawClipboard('')).toBeNull()
  })

  it('normalizeClipboardText 统一换行并 trim', () => {
    expect(normalizeClipboardText('a\r\nb\r\n')).toBe('a\nb')
  })
})
