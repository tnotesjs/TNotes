// @vitest-environment happy-dom
import { createApp, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import VscodeApp from './VscodeApp.vue'

describe('VSCode WebView 文档闭环', () => {
  let host: HTMLDivElement
  let posted: unknown[]

  beforeEach(() => {
    vi.useFakeTimers()
    posted = []
    vi.stubGlobal('acquireVsCodeApi', () => ({
      postMessage: (message: unknown) => posted.push(message),
      getState: () => ({ view: 'source' }),
      setState: vi.fn(),
    }))
    host = document.createElement('div')
    document.body.append(host)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    document.body.replaceChildren()
  })

  it('接收 TextDocument 快照，源码编辑后携带基准版本回写', async () => {
    const app = createApp(VscodeApp)
    app.mount(host)
    await nextTick()
    expect(posted).toContainEqual({ type: 'ready', protocol: 1 })

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'document',
        protocol: 1,
        reason: 'init',
        snapshot: {
          text: '# 初始文档\n\n- 节点\n',
          version: 7,
          fileName: 'demo.tn-mindmap.md',
          assetUris: {},
        },
      },
    }))
    await nextTick()

    expect(host.querySelector('.file-name')?.textContent).toContain('demo.tn-mindmap.md')
    const textarea = host.querySelector('.md-textarea') as HTMLTextAreaElement
    expect(textarea.value).toBe('# 初始文档\n\n- 节点\n')

    textarea.value = '# 已编辑\n\n- 新节点\n'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(310)
    await nextTick()

    expect(posted).toContainEqual({
      type: 'edit',
      protocol: 1,
      changeId: 1,
      baseVersion: 7,
      text: '# 已编辑\n\n- 新节点\n',
    })
    app.unmount()
  })

  it('非法快照强制停留源码视图并禁用大纲、脑图', async () => {
    const app = createApp(VscodeApp)
    app.mount(host)
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'document',
        protocol: 1,
        reason: 'init',
        snapshot: {
          text: '- 没有 H1\n',
          version: 1,
          fileName: 'invalid.tn-mindmap.md',
          assetUris: {},
        },
      },
    }))
    await nextTick()

    expect(host.querySelector('.source-diagnostics')).not.toBeNull()
    const tabs = [...host.querySelectorAll<HTMLButtonElement>('.view-tab')]
    expect(tabs.slice(0, 2).every((button) => button.disabled)).toBe(true)
    expect(tabs[2].disabled).toBe(false)
    app.unmount()
  })

  it('源码粘贴图片时先请求 Extension Host 落盘，再插入相对路径', async () => {
    const app = createApp(VscodeApp)
    app.mount(host)
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'document',
        protocol: 1,
        reason: 'init',
        snapshot: {
          text: '# 图片测试\n',
          version: 3,
          fileName: 'image.tn-mindmap.md',
          assetUris: {},
        },
      },
    }))
    await nextTick()

    const textarea = host.querySelector('.md-textarea') as HTMLTextAreaElement
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    const transfer = new DataTransfer()
    transfer.items.add(new File([new Uint8Array([1, 2, 3])], 'shot.png', { type: 'image/png' }))
    textarea.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer }))
    await Promise.resolve()
    await nextTick()

    const request = posted.find((message) => (message as { type?: string }).type === 'writeAsset') as {
      requestId: number
      mime: string
      base64: string
    }
    expect(request).toMatchObject({ mime: 'image/png', base64: 'AQID' })

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'assetWritten',
        protocol: 1,
        requestId: request.requestId,
        relativePath: 'assets/image-test.png',
        webviewUri: 'vscode-webview://asset/image-test.png',
      },
    }))
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await nextTick()
    await vi.advanceTimersByTimeAsync(0)

    expect(posted.some((message) => {
      const edit = message as { type?: string; text?: string }
      return edit.type === 'edit' && edit.text?.includes('![截图](assets/image-test.png)')
    })).toBe(true)
    app.unmount()
  })

  it('版本冲突时丢弃未确认草稿并载入 VSCode 最新快照', async () => {
    const app = createApp(VscodeApp)
    app.mount(host)
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'document', protocol: 1, reason: 'init',
        snapshot: { text: '# 原文\n', version: 4, fileName: 'conflict.tn-mindmap.md', assetUris: {} },
      },
    }))
    await nextTick()
    const textarea = host.querySelector('.md-textarea') as HTMLTextAreaElement
    textarea.value = '# 本地草稿\n'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(310)
    await nextTick()

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'editRejected', protocol: 1, changeId: 1, message: '版本冲突',
        snapshot: { text: '# 外部更新\n', version: 5, fileName: 'conflict.tn-mindmap.md', assetUris: {} },
      },
    }))
    await nextTick()

    expect((host.querySelector('.md-textarea') as HTMLTextAreaElement).value).toBe('# 外部更新\n')
    expect(host.querySelector('.vscode-toast')?.textContent).toContain('版本冲突')
    app.unmount()
  })

  it('将 Cmd/Ctrl+S 转交 Extension Host 保存 TextDocument', async () => {
    const app = createApp(VscodeApp)
    app.mount(host)
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'document', protocol: 1, reason: 'init',
        snapshot: { text: '# 保存测试\n', version: 1, fileName: 'save.tn-mindmap.md', assetUris: {} },
      },
    }))
    await nextTick()

    const textarea = host.querySelector('.md-textarea') as HTMLTextAreaElement
    textarea.value = '# 保存最新草稿\n'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 's', code: 'KeyS', metaKey: true, bubbles: true, cancelable: true,
    }))

    expect(posted.slice(-2)).toEqual([
      { type: 'edit', protocol: 1, changeId: 1, baseVersion: 1, text: '# 保存最新草稿\n' },
      { type: 'save', protocol: 1 },
    ])
    app.unmount()
  })
})
