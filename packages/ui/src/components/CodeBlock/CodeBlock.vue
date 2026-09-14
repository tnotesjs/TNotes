<script setup lang="ts">
import { computed, onBeforeUnmount, onServerPrefetch, ref, watch } from 'vue'
import { highlightCode, parseCodeMeta } from '../../code/highlight'
import { isCollapsibleCode, toggleCodeBlockCollapsed } from '../../code/collapse'
import { copyText } from '../../browser/clipboard'

const props = withDefaults(
  defineProps<{
    code: string
    info?: string
    highlightedHtml?: string
    lineNumbers?: boolean
    title?: string
  }>(),
  { info: '', lineNumbers: true }
)
const meta = computed(() => parseCodeMeta(props.info, props.lineNumbers))
/**
 * 折叠是**纯视图状态**：默认展开、不落库、不写 localStorage，刷新后回到展开。
 * 只有长代码块才露出折叠 Icon（见 code/collapse.ts 的行数阈值）。
 */
const collapsible = computed(() => isCollapsibleCode(props.code))
const root = ref<HTMLElement>()
const html = ref(props.highlightedHtml || '')
const error = ref('')
const copied = ref(false)
const fullscreen = ref(false)
const trigger = ref<HTMLButtonElement>()
let generation = 0
let copyTimer: ReturnType<typeof setTimeout> | undefined

async function renderCode(): Promise<void> {
  const version = ++generation
  error.value = ''
  if (props.highlightedHtml !== undefined) {
    html.value = props.highlightedHtml
    return
  }
  try {
    const output = await highlightCode(props.code, props.info)
    if (version === generation) html.value = output
  } catch (cause) {
    if (version === generation) {
      html.value = ''
      error.value = `高亮失败：${cause instanceof Error ? cause.message : String(cause)}`
    }
  }
}
watch(() => [props.code, props.info, props.highlightedHtml], renderCode, {
  immediate: true
})
onServerPrefetch(renderCode)
async function copy(): Promise<void> {
  try {
    await copyText(props.code.replace(/\n$/, ''))
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    error.value = '复制失败，请检查剪贴板权限'
  }
}
function toggleCollapse(): void {
  toggleCodeBlockCollapsed(root.value ?? null)
}
function closeFullscreen(): void {
  fullscreen.value = false
  trigger.value?.focus({ preventScroll: true })
}
onBeforeUnmount(() => {
  generation++
  clearTimeout(copyTimer)
})
</script>

<template>
  <section ref="root" class="tn-code-block" :class="{ 'has-line-numbers': meta.lineNumbers }">
    <header class="tn-code-block__header">
      <button
        v-if="collapsible"
        type="button"
        class="tn-code-block__icon-btn tn-code-block__collapse-btn"
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
      <span class="tn-code-block__title">{{ title || meta.title }}</span>
      <slot name="language" :language="meta.language"
        ><span class="tn-code-block__language">{{ meta.language }}</span></slot
      >
      <button
        type="button"
        class="tn-code-block__icon-btn tn-code-block__copy-btn"
        :aria-label="copied ? '已复制' : '复制代码'"
        @click="copy"
      >
        <svg
          v-if="copied"
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
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else
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
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      <button
        ref="trigger"
        type="button"
        class="tn-code-block__icon-btn tn-code-block__fullscreen-btn"
        aria-label="全屏代码"
        @click="fullscreen = true"
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
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </button>
    </header>
    <slot>
      <div class="tn-code-block__content">
        <div v-if="html" v-html="html" />
        <pre v-else class="tn-code-block__plain"><code>{{ code }}</code></pre>
      </div>
    </slot>
    <p v-if="error" role="status" class="tn-code-block__error">{{ error }}</p>
    <Teleport v-if="fullscreen" to="body">
      <div
        class="tn-code-fullscreen"
        role="dialog"
        aria-modal="true"
        aria-label="代码全屏预览"
        tabindex="-1"
        @keydown.esc.stop.prevent="closeFullscreen"
      >
        <header>
          <span>{{ title || meta.title || meta.language }}</span
          ><button type="button" autofocus @click="closeFullscreen">关闭（Esc）</button>
        </header>
        <div class="tn-code-block" :class="{ 'has-line-numbers': meta.lineNumbers }">
          <div v-if="html" class="tn-code-block__content" v-html="html" />
          <pre v-else><code>{{ code }}</code></pre>
        </div>
      </div>
    </Teleport>
  </section>
</template>
