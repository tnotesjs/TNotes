<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import CodeBlock from '../CodeBlock/CodeBlock.vue'
import { parseCodeMeta } from '../../code/highlight'
import {
  applyCollapseChrome,
  codeBlockIn,
  expandCollapsedCodeBlocks,
  isCodeBlockCollapsed,
  toggleCodeBlockCollapsed
} from '../../code/collapse'

export interface CodeGroupItem {
  code?: string
  info?: string
  highlightedHtml?: string
  key?: string
}
const props = defineProps<{ items: CodeGroupItem[] }>()
const root = ref<HTMLElement>()
const collapseButton = ref<HTMLButtonElement>()
const active = ref(0)

function panels(): HTMLElement[] {
  return [
    ...(root.value?.querySelectorAll<HTMLElement>(
      ':scope > .tn-code-group__panels > .tn-code-group__panel'
    ) ?? [])
  ]
}

function activePanel(): HTMLElement | null {
  return panels()[active.value] ?? null
}

function activeBlock(): HTMLElement | null {
  return codeBlockIn(activePanel())
}

function toggleCollapse(): void {
  const block = activeBlock()
  if (!block) return
  toggleCodeBlockCollapsed(block)
  applyCollapseChrome(collapseButton.value ?? null, isCodeBlockCollapsed(block))
}

/** 面板自带的那颗折叠按钮在分组里会被 tab 行盖住，所以 chrome 挂在 tab 行这颗上。 */
function syncCollapseButton(): void {
  applyCollapseChrome(collapseButton.value ?? null, isCodeBlockCollapsed(activeBlock()))
}

function syncPanels(): void {
  const list = panels()
  list.forEach((panel, index) => {
    panel.hidden = index !== active.value
  })
  // 切到的面板如果处于收起状态就自动展开：读者不该看到一片被裁掉的代码。
  expandCollapsedCodeBlocks(activePanel())
  syncCollapseButton()
}

watch(active, syncPanels, { flush: 'post' })
watch(
  () => props.items.length,
  (length) => {
    active.value = Math.max(0, Math.min(active.value, length - 1))
    nextTick(syncPanels)
  }
)
onMounted(syncPanels)

function navigate(event: KeyboardEvent, index: number): void {
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % props.items.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + props.items.length) % props.items.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = props.items.length - 1
  else return
  event.preventDefault()
  active.value = next
  ;(event.currentTarget as HTMLElement).parentElement
    ?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
    [next]?.focus()
}
</script>

<template>
  <section ref="root" class="tn-code-group" :class="{ 'has-tabs': items.length > 1 }">
    <div
      v-if="items.length > 1"
      class="tn-code-group__tabs code-group-tabs"
      role="tablist"
      aria-label="代码分组"
    >
      <button
        ref="collapseButton"
        type="button"
        class="tn-code-block__icon-btn tn-code-group__collapse-btn"
        aria-expanded="true"
        aria-label="收起代码"
        title="收起代码"
        @click="toggleCollapse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <button
        v-for="(item, index) in items"
        :key="item.key || index"
        type="button"
        role="tab"
        class="code-group-tab"
        :class="{ active: active === index }"
        :aria-selected="active === index"
        :tabindex="active === index ? 0 : -1"
        @click="active = index"
        @keydown="navigate($event, index)"
      >
        {{
          parseCodeMeta(item.info).title || parseCodeMeta(item.info).language || `代码 ${index + 1}`
        }}
      </button>
    </div>
    <div class="tn-code-group__panels code-group-panels">
      <slot>
        <div
          v-for="(item, index) in items"
          v-show="active === index"
          :key="item.key || index"
          class="tn-code-group__panel code-group-panel"
          :class="{ active: active === index }"
          role="tabpanel"
        >
          <slot name="panel" :item="item" :index="index"
            ><CodeBlock
              :code="item.code || ''"
              :info="item.info"
              :highlighted-html="item.highlightedHtml"
          /></slot>
        </div>
      </slot>
    </div>
  </section>
</template>
