// @vitest-environment happy-dom

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ImageOptimizePlayground from './ImageOptimizePlayground.vue'

import type { AppSettings } from '../../../../shared/contracts'

const optimize = {
  encoder: 'sharp' as const,
  quality: 80,
  maxDimension: null,
  outputFormat: 'keep' as const
}
const draft = { imageUpload: { optimize } } as unknown as AppSettings

function installBridge(
  preview: () => Promise<
    { ok: true; value: Record<string, unknown> } | { ok: false; error: object }
  >
): void {
  Object.defineProperty(window, 'desk', {
    configurable: true,
    value: { settings: { previewOptimizeImage: vi.fn(preview) } }
  })
}

async function dropFile(wrapper: ReturnType<typeof mount>): Promise<void> {
  const file = new File([new Uint8Array([1, 2, 3, 4])], 'shot.png', { type: 'image/png' })
  await wrapper.get('.drop-zone').trigger('drop', { dataTransfer: { files: [file] } })
  await flushPromises()
}

afterEach(() => {
  Reflect.deleteProperty(window, 'desk')
  vi.restoreAllMocks()
})

describe('ImageOptimizePlayground', () => {
  it('shows lossy savings and previews via data: URLs the CSP allows', async () => {
    installBridge(async () => ({
      ok: true,
      value: {
        bytesBefore: 1000,
        bytesAfter: 250,
        width: 12,
        height: 8,
        ms: 7,
        lossy: true,
        encoder: 'sharp',
        // 编码器用扩展名口径回传（jpg），不是 MIME 子类型（jpeg）。
        format: 'jpg',
        output: new Uint8Array([1, 2, 3])
      }
    }))
    const wrapper = mount(ImageOptimizePlayground, { props: { draft } })

    expect(wrapper.text()).toContain('压缩效果测试')
    expect(wrapper.text()).toContain('不写入任何知识库')

    await dropFile(wrapper)

    expect(wrapper.get('[data-testid="saved-percent"]').text()).toContain('-75%')
    expect(wrapper.text()).toContain('有损')

    // 回归护栏：应用 CSP 是 `img-src 'self' data: https: tnotes-asset:`，不含 blob:，
    // 预览必须走 data: URL —— 用 createObjectURL 会被 CSP 拦成破图。
    // 同时 MIME 要按扩展名口径映射（format: 'jpg' → image/jpeg，不能落成 octet-stream）。
    const originalSrc = wrapper.get('figure:nth-child(1) img').attributes('src') ?? ''
    const outputSrc = wrapper.get('figure:nth-child(2) img').attributes('src') ?? ''
    expect(originalSrc.startsWith('data:image/png;base64,')).toBe(true)
    expect(outputSrc.startsWith('data:image/jpeg;base64,')).toBe(true)
  })

  it('surfaces the skip reason instead of a fake saving', async () => {
    installBridge(async () => ({
      ok: true,
      value: {
        bytesBefore: 1000,
        ms: 3,
        lossy: true,
        encoder: 'sharp',
        skipped: '优化后没有变小'
      }
    }))
    const wrapper = mount(ImageOptimizePlayground, { props: { draft } })

    await dropFile(wrapper)

    expect(wrapper.text()).toContain('优化后没有变小')
    expect(wrapper.find('[data-testid="saved-percent"]').exists()).toBe(false)
  })
})
