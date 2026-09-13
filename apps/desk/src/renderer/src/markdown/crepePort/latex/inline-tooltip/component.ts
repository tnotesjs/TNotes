import { Icon } from '@milkdown/kit/component'
import type { EditorView } from '@milkdown/kit/prose/view'
import { defineComponent, h, type PropType, type ShallowRef, type VNodeRef } from 'vue'

import type { LatexConfig } from '../index'

/**
 * 移植自 `@milkdown/crepe@7.22.1` 的 `src/feature/latex/inline-tooltip/component.tsx`（MIT）。
 *
 * 改动：原文件用 JSX，需要额外的 JSX 编译管线与 tsconfig `jsx` 设置；这里用等价的
 * `h()` 渲染函数重写。DOM 结构（`.container` + 内嵌编辑器 div + 按钮）、事件
 * （`pointerdown` → `updateValue`）与图标用法与原来一致。
 */
type LatexTooltipProps = {
  config: Partial<LatexConfig>
  innerView: ShallowRef<EditorView | null>
  updateValue: ShallowRef<() => void>
}

export const LatexTooltip = defineComponent<LatexTooltipProps>({
  props: {
    config: {
      type: Object as PropType<Partial<LatexConfig>>,
      required: true
    },
    innerView: {
      type: Object as PropType<ShallowRef<EditorView | null>>,
      required: true
    },
    updateValue: {
      type: Object as PropType<ShallowRef<() => void>>,
      required: true
    }
  },
  setup(props) {
    const innerViewRef: VNodeRef = (el) => {
      if (!el || !(el instanceof HTMLElement)) return
      while (el.firstChild) {
        el.removeChild(el.firstChild)
      }
      if (props.innerView.value) {
        el.appendChild(props.innerView.value.dom)
      }
    }
    const onUpdate = (event: Event): void => {
      event.preventDefault()
      props.updateValue.value()
    }

    return () =>
      h('div', { class: 'container' }, [
        props.innerView.value ? h('div', { ref: innerViewRef }) : null,
        h('button', { type: 'button', onPointerdown: onUpdate }, [
          h(Icon, { icon: props.config.inlineEditConfirm })
        ])
      ])
  }
})
