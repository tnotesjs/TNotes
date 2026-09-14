import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import { Plugin } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

import { ensureCodeCollapseButton } from './codeBlockCollapse'
import { ensureCodeExpandButton } from './codeBlockFullscreen'
import { UNLABELED_CODE_LANGUAGE } from './codeLanguage'

/**
 * Injects a Yuque-style title input and a typed language field into each Crepe
 * code-block tools row, keeping them synced with `title` / `language` attrs.
 *
 * Sync runs on create (with short retries for Crepe's async tools mount), when
 * the document changes, and when Crepe remounts `.tools` — which happens after
 * the note is hidden (`v-show`) by starting site preview and shown again.
 * Caret-only updates are ignored unless injected chrome is already missing.
 */
export function createCodeBlockTitlePlugin(): MilkdownPlugin {
  return $prose(() => {
    return new Plugin({
      view: (view) => {
        let syncRaf = 0
        let bootRaf = 0
        let bootFrames = 0
        const sync = (): void => {
          syncCodeBlockTitles(view)
          syncCodeBlockLanguages(view)
          syncCodeBlockExpand(view)
          syncCodeBlockCollapse(view)
        }
        const schedule = (): void => {
          cancelAnimationFrame(syncRaf)
          syncRaf = requestAnimationFrame(() => {
            sync()
            // Crepe mounts `.tools` asynchronously after the code block appears.
            requestAnimationFrame(sync)
          })
        }
        const boot = (): void => {
          sync()
          bootFrames += 1
          if (bootFrames < 8 && !view.isDestroyed) {
            bootRaf = requestAnimationFrame(boot)
          }
        }
        const restartBoot = (): void => {
          cancelAnimationFrame(bootRaf)
          bootFrames = 0
          boot()
        }
        const observer = new MutationObserver((mutations) => {
          if (mutationsIndicateCodeToolsRemount(mutations)) schedule()
        })
        observer.observe(view.dom, { childList: true, subtree: true })
        // happy-dom's IntersectionObserver often never delivers callbacks.
        const visibility =
          typeof IntersectionObserver === 'function'
            ? new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) restartBoot()
              })
            : null
        visibility?.observe(view.dom)
        const onEditorVisible = (): void => restartBoot()
        view.dom.addEventListener('desk-code-chrome-sync', onEditorVisible)
        boot()
        return {
          update: (current, previous) => {
            if (!previous.doc.eq(current.state.doc) || viewHasIncompleteCodeChrome(current)) {
              schedule()
            }
          },
          destroy: () => {
            observer.disconnect()
            visibility?.disconnect()
            view.dom.removeEventListener('desk-code-chrome-sync', onEditorVisible)
            cancelAnimationFrame(syncRaf)
            cancelAnimationFrame(bootRaf)
          }
        }
      }
    })
  })
}

export function mutationsIndicateCodeToolsRemount(mutations: MutationRecord[]): boolean {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') continue
    // 我们自己插 chrome（标题 / 语言 / 复制 / 全屏 / 折叠）也会动 `.tools` 的子节点，
    // 那不是「重挂载」；只有 Crepe 重建 `.tools` 才算，否则会自激同步。
    if (isSelfInflictedChromeMutation(mutation)) continue
    if (mutation.target instanceof Element && isCodeToolsHost(mutation.target)) return true
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) continue
      if (
        node.classList.contains('tools') ||
        node.classList.contains('milkdown-code-block') ||
        node.querySelector('.tools')
      ) {
        return true
      }
    }
  }
  return false
}

/** 变更只涉及我们注入的 chrome 节点（不是 Crepe 重建 tools）。 */
function isSelfInflictedChromeMutation(mutation: MutationRecord): boolean {
  const nodes = [...mutation.addedNodes, ...mutation.removedNodes].filter(
    (node): node is Element => node instanceof Element
  )
  if (nodes.length === 0) return false
  return nodes.every((node) => CHROME_CLASSES.some((name) => node.classList.contains(name)))
}

const CHROME_CLASSES = [
  'desk-code-title',
  'desk-code-language',
  'desk-code-expand',
  'desk-code-collapse'
]

function isCodeToolsHost(el: Element): boolean {
  return (
    el.classList.contains('tools') ||
    el.classList.contains('tools-button-group') ||
    el.classList.contains('milkdown-code-block')
  )
}

function viewHasIncompleteCodeChrome(view: EditorView): boolean {
  let incomplete = false
  view.state.doc.descendants((node, pos) => {
    if (incomplete || node.type.name !== 'code_block') return
    const dom = view.nodeDOM(pos) as HTMLElement | null
    if (!dom?.classList?.contains('milkdown-code-block')) return
    if (dom.classList.contains('desk-code-tab')) return
    if (standaloneCodeBlockMissingChrome(dom)) incomplete = true
  })
  return incomplete
}

export function standaloneCodeBlockMissingChrome(block: HTMLElement): boolean {
  if (block.classList.contains('desk-code-tab')) return false
  const tools = block.querySelector('.tools')
  if (!tools) return false
  return (
    !tools.querySelector('.desk-code-title') ||
    !tools.querySelector('.desk-code-language') ||
    !tools.querySelector('.desk-code-expand')
  )
}

function syncCodeBlockTitles(view: EditorView): void {
  if (view.isDestroyed) return
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'code_block') return
    const dom = view.nodeDOM(pos) as HTMLElement | null
    if (!dom?.classList?.contains('milkdown-code-block')) return
    const tools = dom.querySelector('.tools') as HTMLElement | null
    if (!tools) return

    let input = tools.querySelector('.desk-code-title') as HTMLInputElement | null
    if (!input) {
      input = document.createElement('input')
      input.type = 'text'
      input.className = 'desk-code-title'
      input.placeholder = '请输入代码块名称'
      input.spellcheck = false
      input.addEventListener('mousedown', (event) => event.stopPropagation())
      input.addEventListener('pointerdown', (event) => event.stopPropagation())
      input.addEventListener('keydown', (event) => event.stopPropagation())
      input.addEventListener('input', () => {
        const title = input!.value
        const currentPos = findCodeBlockPos(view, dom)
        if (currentPos == null) return
        const current = view.state.doc.nodeAt(currentPos)
        if (!current || current.type.name !== 'code_block') return
        if (String(current.attrs.title ?? '') === title) return
        view.dispatch(
          view.state.tr.setNodeMarkup(currentPos, undefined, {
            ...current.attrs,
            title
          })
        )
      })
      tools.prepend(input)
    }

    const title = String(node.attrs.title ?? '')
    if (document.activeElement !== input && input.value !== title) {
      input.value = title
    }
  })
}

function syncCodeBlockLanguages(view: EditorView): void {
  if (view.isDestroyed) return
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'code_block') return
    const dom = view.nodeDOM(pos) as HTMLElement | null
    if (!dom?.classList?.contains('milkdown-code-block')) return
    if (dom.classList.contains('desk-code-tab')) return
    const tools = dom.querySelector('.tools') as HTMLElement | null
    if (!tools) return

    let input = tools.querySelector('.desk-code-language') as HTMLInputElement | null
    if (!input) {
      input = document.createElement('input')
      input.type = 'text'
      input.className = 'desk-code-language'
      input.spellcheck = false
      input.autocomplete = 'off'
      input.placeholder = UNLABELED_CODE_LANGUAGE
      input.title = '语言'
      input.setAttribute('aria-label', '语言')
      const commit = (): void => {
        const language = input!.value.trim()
        input!.value = language
        input!.size = Math.max(2, language.length || 1)
        const currentPos = findCodeBlockPos(view, dom)
        if (currentPos == null) return
        const current = view.state.doc.nodeAt(currentPos)
        if (!current || current.type.name !== 'code_block') return
        if (String(current.attrs.language ?? '') === language) return
        view.dispatch(
          view.state.tr.setNodeMarkup(currentPos, undefined, {
            ...current.attrs,
            language
          })
        )
      }
      input.addEventListener('mousedown', (event) => event.stopPropagation())
      input.addEventListener('pointerdown', (event) => event.stopPropagation())
      input.addEventListener('keydown', (event) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
          event.preventDefault()
          input!.blur()
        }
        if (event.key === 'Escape') {
          event.preventDefault()
          const currentPos = findCodeBlockPos(view, dom)
          const current = currentPos == null ? null : view.state.doc.nodeAt(currentPos)
          const language = String(current?.attrs.language ?? '').trim()
          input!.value = language
          input!.size = Math.max(2, language.length || 1)
          input!.blur()
        }
      })
      input.addEventListener('input', () => {
        input!.size = Math.max(2, input!.value.length || 1)
      })
      input.addEventListener('change', commit)
      input.addEventListener('blur', commit)
      const copyGroup = tools.querySelector('.tools-button-group')
      if (copyGroup) tools.insertBefore(input, copyGroup)
      else tools.append(input)
    }

    const language = String(node.attrs.language ?? '').trim()
    if (document.activeElement !== input && input.value !== language) {
      input.value = language
      input.size = Math.max(2, language.length || 1)
    }
  })
}

/**
 * 代码块标题左侧的折叠 Icon：每个代码块都有，位置固定在 `.tools` 最左侧。
 * 收起状态本身是纯视图状态（不写回 markdown），所以这里只同步 chrome。
 */
function syncCodeBlockCollapse(view: EditorView): void {
  if (view.isDestroyed) return
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'code_block') return
    const dom = view.nodeDOM(pos) as HTMLElement | null
    if (!dom?.classList?.contains('milkdown-code-block')) return
    if (dom.classList.contains('desk-code-tab')) return
    ensureCodeCollapseButton(dom)
  })
}

function syncCodeBlockExpand(view: EditorView): void {
  if (view.isDestroyed) return
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'code_block') return
    const dom = view.nodeDOM(pos) as HTMLElement | null
    if (!dom?.classList?.contains('milkdown-code-block')) return
    if (dom.classList.contains('desk-code-tab')) return
    ensureCodeExpandButton(dom)
  })
}

function findCodeBlockPos(view: EditorView, dom: HTMLElement): number | null {
  try {
    const pos = view.posAtDOM(dom, 0)
    const $pos = view.state.doc.resolve(pos)
    for (let depth = $pos.depth; depth >= 0; depth -= 1) {
      const node = $pos.node(depth)
      if (node.type.name === 'code_block') return $pos.before(depth)
    }
  } catch {
    return null
  }
  return null
}
