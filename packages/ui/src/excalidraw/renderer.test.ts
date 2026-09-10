import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createExcalidrawSvgRenderer } from './renderer'
import { SvgCache } from './scene'

const scene = (extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'excalidraw',
    elements: [{ id: 'rect-1' }],
    appState: {},
    files: {},
    ...extra
  })

function setup(options: {
  content: string
  theme?: 'light' | 'dark'
  render?: () => Promise<string>
}) {
  const renderCalls: Array<{ dark: boolean }> = []
  const cache = new SvgCache(4)
  const renderer = createExcalidrawSvgRenderer({
    getContent: () => options.content,
    getTheme: () => options.theme ?? 'light',
    cache,
    loadExporter: async () => ({
      renderExcalidrawSvg: async (_scene, exportOptions) => {
        renderCalls.push(exportOptions)
        if (options.render) return await options.render()
        return `<svg data-dark="${exportOptions.dark}">ok</svg>`
      }
    })
  })
  return { renderer, renderCalls, cache }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('只读画布渲染器', () => {
  it('渲染成功的 SVG 变成 data URL，不触碰文件系统', async () => {
    const { renderer, renderCalls } = setup({ content: scene() })
    await renderer.render()

    expect(renderer.state.value).toBe('ready')
    expect(renderer.dataUrl.value).toMatch(/^data:image\/svg\+xml;charset=utf-8,/)
    expect(decodeURIComponent(renderer.dataUrl.value)).toContain('<svg')
    expect(renderCalls).toHaveLength(1)
  })

  it('相同内容与主题命中缓存，不重复导出', async () => {
    const cache = new SvgCache(4)
    const calls: number[] = []
    const make = () =>
      createExcalidrawSvgRenderer({
        getContent: () => scene(),
        getTheme: () => 'light',
        cache,
        loadExporter: async () => ({
          renderExcalidrawSvg: async () => {
            calls.push(1)
            return '<svg>once</svg>'
          }
        })
      })
    await make().render()
    await make().render()
    expect(calls).toHaveLength(1)
  })

  it('深色主题单独缓存，导出选项跟随主题', async () => {
    const { renderer, renderCalls, cache } = setup({ content: scene(), theme: 'dark' })
    await renderer.render()
    expect(renderCalls[0]).toEqual({ dark: true })
    expect(cache.size).toBe(1)
    expect(decodeURIComponent(renderer.dataUrl.value)).toContain('data-dark="true"')
  })

  it('非法 JSON 与空场景进入错误态，且不调用导出器', async () => {
    const broken = setup({ content: '{ nope' })
    await broken.renderer.render()
    expect(broken.renderer.state.value).toBe('error')
    expect(broken.renderer.errorReason.value).toContain('合法 JSON')
    expect(broken.renderCalls).toHaveLength(0)

    const empty = setup({ content: JSON.stringify({ type: 'excalidraw', elements: [] }) })
    await empty.renderer.render()
    expect(empty.renderer.state.value).toBe('error')
    expect(empty.renderer.errorReason.value).toBe('空画布')
  })

  it('导出抛错时进入错误态而不是崩掉', async () => {
    const { renderer } = setup({
      content: scene(),
      render: async () => {
        throw new Error('导出失败')
      }
    })
    await renderer.render()
    expect(renderer.state.value).toBe('error')
    expect(renderer.errorReason.value).toBe('导出失败')
    expect(renderer.dataUrl.value).toBe('')
  })

  it('在途结果过期时被丢弃（内容已变化）', async () => {
    let release: ((svg: string) => void) | undefined
    const calls: string[] = []
    let content = scene()
    const renderer = createExcalidrawSvgRenderer({
      getContent: () => content,
      getTheme: () => 'light',
      cache: new SvgCache(4),
      loadExporter: async () => ({
        renderExcalidrawSvg: async () => {
          calls.push(content)
          if (calls.length === 1) {
            return await new Promise<string>((resolve) => {
              release = resolve
            })
          }
          return '<svg>new</svg>'
        }
      })
    })

    const first = renderer.render()
    content = scene({ elements: [{ id: 'newer' }] })
    const second = renderer.render()
    // 等两次 render 都进入 exporter（动态 import 需要一个微任务）
    for (let tick = 0; tick < 5 && !release; tick += 1) await Promise.resolve()
    release?.('<svg>stale</svg>')
    await Promise.all([first, second])

    expect(decodeURIComponent(renderer.dataUrl.value)).toContain('new')
    expect(decodeURIComponent(renderer.dataUrl.value)).not.toContain('stale')
  })

  it('释放后清空 data URL，之后再渲染不再产生输出', async () => {
    const { renderer } = setup({ content: scene() })
    await renderer.render()
    renderer.dispose()
    expect(renderer.dataUrl.value).toBe('')
    await renderer.render()
    expect(renderer.state.value).toBe('idle')
    expect(renderer.dataUrl.value).toBe('')
  })
})
