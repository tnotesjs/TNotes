import { beforeEach, describe, expect, it, vi } from 'vitest'

const OID = 'a'.repeat(40)

const mocks = vi.hoisted(() => ({
  handler: null as null | ((request: { url: string }) => Promise<Response>),
  readAsset: vi.fn(async () => ({
    bytes: Buffer.from([1, 2, 3]),
    oid: 'd'.repeat(40),
    contentType: 'image/png'
  })),
  resolveNoteAsset: vi.fn(async () => '/kb/assets/0042-x.png'),
  fetch: vi.fn(async () => new Response('asset-bytes', { status: 200 }))
}))

vi.mock('electron', () => ({
  protocol: {
    handle: (_scheme: string, handler: (request: { url: string }) => Promise<Response>) => {
      mocks.handler = handler
    },
    registerSchemesAsPrivileged: vi.fn()
  },
  net: { fetch: mocks.fetch }
}))
vi.mock('./history/historyService', () => ({
  historyService: { readAsset: mocks.readAsset }
}))
vi.mock('./workspaceManager', () => ({
  workspaceManager: { resolveNoteAsset: mocks.resolveNoteAsset }
}))
vi.mock('./log', () => ({ deskLog: vi.fn() }))

import { handleAssetProtocol } from './assetProtocol'

beforeEach(() => {
  vi.clearAllMocks()
  handleAssetProtocol()
})

async function get(url: string) {
  return await mocks.handler!({ url })
}

describe('tnotes-asset 协议', () => {
  it('历史路由按 commit + 路径读字节，并标记为不可变缓存', async () => {
    const response = await get(
      `tnotes-asset://history?knowledgeBaseId=kb&commit=${OID}&path=${encodeURIComponent('assets/0042-x.png')}`
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/png')
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(response.headers.get('cache-control')).toContain('immutable')
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([1, 2, 3])
    expect(mocks.readAsset).toHaveBeenCalledWith('kb', {
      commit: OID,
      relPath: 'assets/0042-x.png'
    })
    // 历史读取绝不能落到当前磁盘
    expect(mocks.resolveNoteAsset).not.toHaveBeenCalled()
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it('拒绝非完整 OID、缺参数的历史请求', async () => {
    const badCommit = await get(
      `tnotes-asset://history?knowledgeBaseId=kb&commit=HEAD~1&path=assets/0042-x.png`
    )
    expect(badCommit.status).toBe(404)

    const noPath = await get(`tnotes-asset://history?knowledgeBaseId=kb&commit=${OID}`)
    expect(noPath.status).toBe(404)

    const noKb = await get(`tnotes-asset://history?commit=${OID}&path=assets/0042-x.png`)
    expect(noKb.status).toBe(404)

    expect(mocks.readAsset).not.toHaveBeenCalled()
  })

  it('历史里不存在该路径时返回 404，不回退到当前磁盘', async () => {
    mocks.readAsset.mockRejectedValueOnce(new Error('该提交里没有这个文件'))
    const response = await get(
      `tnotes-asset://history?knowledgeBaseId=kb&commit=${OID}&path=assets/gone.png`
    )
    expect(response.status).toBe(404)
    expect(mocks.resolveNoteAsset).not.toHaveBeenCalled()
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it('当前资源路由仍走磁盘，不经过历史服务', async () => {
    const response = await get(
      `tnotes-asset://asset?knowledgeBaseId=kb&path=${encodeURIComponent('assets/0042-x.png')}`
    )
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('asset-bytes')
    expect(mocks.resolveNoteAsset).toHaveBeenCalledWith('kb', 'assets/0042-x.png')
    expect(mocks.readAsset).not.toHaveBeenCalled()
  })

  it('app 路由只读渲染端产物目录，越界 404', async () => {
    const escaped = await get(`tnotes-asset://app/../../../../etc/passwd`)
    expect(escaped.status).toBe(404)
  })
})
