import { describe, expect, it } from 'vitest'

import {
  createHistoryCommitContext,
  historyAssetUrl,
  historyCacheKey,
  normalizeHistoryRelative,
  resolveHistoryRelPath,
  resolveHistoryResource
} from './commitContext'

const COMMIT = 'a'.repeat(40)

function context(noteRelPath = 'notes/0042. 笔记/0042. 笔记.md') {
  return createHistoryCommitContext({
    knowledgeBaseId: 'kb',
    commit: COMMIT,
    noteRelPath,
    entries: [
      { relPath: 'assets/0042-old.png', oid: 'b'.repeat(40) },
      { relPath: 'assets/0042-drawing.excalidraw', oid: 'c'.repeat(40) },
      { relPath: 'notes/0042. 笔记/0043. 别的.md', oid: 'd'.repeat(40) }
    ]
  })
}

describe('历史 commit 上下文', () => {
  it('只按快照白名单解析相对路径，缓存键用 commit + blob OID', () => {
    const resource = resolveHistoryResource(context(), '../../assets/0042-old.png')
    expect(resource.kind).toBe('local')
    if (resource.kind !== 'local') throw new Error('unreachable')
    expect(resource.relPath).toBe('assets/0042-old.png')
    expect(resource.oid).toBe('b'.repeat(40))
    expect(resource.cacheKey).toBe(historyCacheKey(COMMIT, 'b'.repeat(40)))
    expect(resource.url).toBe(
      historyAssetUrl({ knowledgeBaseId: 'kb', commit: COMMIT }, resource.relPath)
    )
    expect(new URL(resource.url).protocol).toBe('tnotes-asset:')
    expect(new URL(resource.url).hostname).toBe('history')
  })

  it('清理查询串与哈希，并支持中文/空格/括号路径', () => {
    const ctx = createHistoryCommitContext({
      knowledgeBaseId: 'kb',
      commit: COMMIT,
      noteRelPath: 'notes/0002. b/0002. b.md',
      entries: [{ relPath: 'assets/0002-图 (1).png', oid: 'e'.repeat(40) }]
    })
    expect(resolveHistoryRelPath(ctx.noteRelPath, '../../assets/0002-图 (1).png?v=2#x')).toBe(
      'assets/0002-图 (1).png'
    )
    const resource = resolveHistoryResource(ctx, '../../assets/0002-图 (1).png?v=2')
    expect(resource.kind).toBe('local')
    if (resource.kind !== 'local') throw new Error('unreachable')
    const url = new URL(resource.url)
    expect(url.searchParams.get('path')).toBe('assets/0002-图 (1).png')
    expect(url.searchParams.get('commit')).toBe(COMMIT)
  })

  it('历史里没有的路径报缺失，不回退当前磁盘', () => {
    const resource = resolveHistoryResource(context(), '../../assets/0042-deleted.png')
    expect(resource.kind).toBe('missing')
    if (resource.kind !== 'missing') throw new Error('unreachable')
    expect(resource.reason).toContain('0042-deleted.png')
    expect(JSON.stringify(resource)).not.toContain('tnotes-asset://asset')
  })

  it('远程、协议、锚点、越界引用都不按历史资源加载', () => {
    const ctx = context()
    expect(resolveHistoryResource(ctx, 'https://example.com/a.png').kind).toBe('remote')
    expect(resolveHistoryResource(ctx, 'http://example.com/a.png').kind).toBe('unsupported')
    expect(resolveHistoryResource(ctx, 'tnotes-asset://asset?path=x').kind).toBe('unsupported')
    expect(resolveHistoryResource(ctx, '//example.com/a.png').kind).toBe('unsupported')
    expect(resolveHistoryResource(ctx, '#anchor').kind).toBe('unsupported')
    // 根目录笔记的相对引用不能越出知识库
    const rootNote = createHistoryCommitContext({
      knowledgeBaseId: 'kb',
      commit: COMMIT,
      noteRelPath: '0001. 首页.md',
      entries: []
    })
    expect(resolveHistoryResource(rootNote, '../outside.png').kind).toBe('unsupported')
    // 在库内但该 commit 不存在的路径算缺失，仍然不加载
    expect(resolveHistoryResource(ctx, '../../outside.png').kind).toBe('missing')
    expect(resolveHistoryResource(ctx, '').kind).toBe('unsupported')
  })

  it('只放行位图 data URL', () => {
    const raster = 'data:image/png;base64,iVBORw0KGgo='
    expect(resolveHistoryResource(context(), raster).kind).toBe('inline')
    expect(resolveHistoryResource(context(), 'data:text/html;base64,PHNjcmlwdD4=').kind).toBe(
      'unsupported'
    )
  })

  it('同一 blob 在不同路径下仍是同一缓存键（改名不改内容）', () => {
    const oid = 'f'.repeat(40)
    const first = createHistoryCommitContext({
      knowledgeBaseId: 'kb',
      commit: COMMIT,
      noteRelPath: 'notes/0042. 旧名/0042. 旧名.md',
      entries: [{ relPath: 'assets/0042-a.png', oid }]
    })
    const second = createHistoryCommitContext({
      knowledgeBaseId: 'kb',
      commit: COMMIT,
      noteRelPath: 'notes/0042. 新名/0042. 新名.md',
      entries: [{ relPath: 'assets/0042-b.png', oid }]
    })
    expect(resolveHistoryResource(first, '../../assets/0042-a.png')).toMatchObject({
      cacheKey: historyCacheKey(COMMIT, oid)
    })
    expect(resolveHistoryResource(second, '../../assets/0042-b.png')).toMatchObject({
      cacheKey: historyCacheKey(COMMIT, oid)
    })
  })

  it('normalizeHistoryRelative 越界返回 null', () => {
    expect(normalizeHistoryRelative('notes/a.md')).toBe('notes/a.md')
    expect(normalizeHistoryRelative('./assets//x.png')).toBe('assets/x.png')
    expect(normalizeHistoryRelative('..')).toBeNull()
    expect(normalizeHistoryRelative('a/../../b')).toBeNull()
  })
})
