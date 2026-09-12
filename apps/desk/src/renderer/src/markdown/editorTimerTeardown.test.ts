// @vitest-environment happy-dom
/**
 * 回归：`@milkdown/ctx` 的 `Timer` 曾在 setTimeout 回调里裸调 `removeEventListener`，
 * 而且该回调**即使 timer 已经 resolve 也会在 3s 后照常触发**（`#removeListener` 只是
 * 移除监听，没有 clearTimeout）。测试文件结束时 vitest 会拆掉 happy-dom 注入的全局，
 * 于是回调抛 `ReferenceError: removeEventListener is not defined`，作为 unhandled error
 * 让 `vitest run` 退出码 1 —— 表现为 CI 偶发红（实测 run 34626999009：133 文件 / 1060
 * 用例全过，却因 1 个 unhandled error 判失败）。
 *
 * 依赖侧修复走 pnpm patch：`patches/@milkdown__ctx@7.22.1.patch`
 * （移除监听时 clearTimeout + 三处裸全局改 `globalThis.X?.()`）。
 * 本用例在未打补丁的依赖上会失败——务必保留，别在升级 milkdown 时把补丁丢掉。
 */
import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'

import MilkdownMarkdownEditor from './MilkdownMarkdownEditor.vue'

const DOM_GLOBALS = ['addEventListener', 'removeEventListener', 'dispatchEvent'] as const

it('unmount 后没有残留的 ctx Timer 回调（模拟环境拆除后全局缺失）', async () => {
  const wrapper = mount(MilkdownMarkdownEditor, {
    attachTo: document.body,
    props: {
      content: '::: details\n\nbody\n\n:::\n\nplain\n',
      mode: 'visual',
      readOnly: false,
      knowledgeBaseId: 'kb-timer',
      noteUuid: 'note-timer',
      active: true,
      uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
    }
  })
  await vi.waitFor(() => expect(wrapper.find('.ProseMirror').exists()).toBe(true))
  wrapper.unmount()
  // 等异步的 Editor.destroy 走完，否则删全局会干扰我们自己的 destroy 路径
  await new Promise((resolve) => setTimeout(resolve, 150))

  const saved = DOM_GLOBALS.map((key) => [key, Reflect.get(globalThis, key)] as const)
  const uncaught: unknown[] = []
  const onUncaught = (error: unknown): void => {
    uncaught.push(error)
  }
  process.on('uncaughtException', onUncaught)
  for (const key of DOM_GLOBALS) Reflect.deleteProperty(globalThis, key)
  try {
    // ctx 的 Timer 默认超时 3s：未打补丁时这些回调会在这里裸调 removeEventListener
    await new Promise((resolve) => setTimeout(resolve, 3400))
  } finally {
    for (const [key, value] of saved) Reflect.set(globalThis, key, value)
    process.off('uncaughtException', onUncaught)
  }

  expect(uncaught.map((error) => String(error))).toEqual([])
}, 20000)
