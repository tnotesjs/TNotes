// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { blobToBase64, protocolMessage } from './bridge'

describe('WebView bridge', () => {
  it('给所有消息附加协议版本', () => {
    expect(protocolMessage({ type: 'ready' })).toEqual({ type: 'ready', protocol: 1 })
  })

  it('只在消息传输时将 Blob 转成 base64', async () => {
    const value = await blobToBase64(new Blob([new Uint8Array([0, 1, 2, 253, 254, 255])], { type: 'image/png' }))
    expect(value).toBe('AAEC/f7/')
  })
})
