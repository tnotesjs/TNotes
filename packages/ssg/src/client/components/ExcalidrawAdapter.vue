<script setup lang="ts">
/**
 * SSG 画布只读卡片（计划 E8）。
 *
 * - 只读：不挂编辑器、不写任何文件；内容用客户端 fetch 读取 `.excalidraw`
 * - SSR 阶段没有 DOM/fetch：只输出占位提示（关闭 JS 时也是这段提示）
 * - 字体基址指向站点内的 `excalidraw/`（构建时从官方包复制，见 ssg site.ts）
 * - 加载失败给出可读错误 + 原文件链接，不猜内容
 */
import { ExcalidrawSvg, setExcalidrawAssetPath } from '@tnotesjs/ui/excalidraw-view'
import { computed, inject, onMounted, ref } from 'vue'

import { SITE_BASE_KEY } from './NotesTableAdapter'

const props = withDefaults(
  defineProps<{
    /** 源文件 URL（已按站点 base 解析） */
    src: string
    /** 卡片高度（px） */
    height?: number
  }>(),
  { height: 480 }
)

const base = inject(SITE_BASE_KEY, null) ?? inject('tn-site-base', '/')
const content = ref('')
const phase = ref<'placeholder' | 'loading' | 'ready' | 'error'>('placeholder')
const error = ref('')

const fontBase = computed(() => (base.endsWith('/') ? base : `${base}/`))

onMounted(async () => {
  setExcalidrawAssetPath(`${fontBase.value}excalidraw/`)
  if (!props.src) {
    phase.value = 'error'
    error.value = '画布组件缺少 path'
    return
  }
  phase.value = 'loading'
  try {
    const response = await fetch(props.src, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    content.value = await response.text()
    phase.value = 'ready'
  } catch (cause) {
    phase.value = 'error'
    error.value = cause instanceof Error ? cause.message : String(cause)
  }
})
</script>

<template>
  <div class="tn-excalidraw-island" :data-state="phase">
    <ExcalidrawSvg
      v-if="phase === 'ready'"
      :content="content"
      :height="height"
      label="Excalidraw 绘图"
    />
    <p v-else-if="phase === 'error'" class="tn-excalidraw-island__note" role="alert">
      画布加载失败：{{ error }}
      <a v-if="src" :href="src" target="_blank" rel="noreferrer">打开源文件</a>
    </p>
    <p v-else class="tn-excalidraw-island__note">
      画布需要启用 JavaScript 才能查看。
      <a v-if="src" :href="src" target="_blank" rel="noreferrer">打开源文件</a>
    </p>
  </div>
</template>

<style>
.tn-excalidraw-island {
  margin: 12px 0;
  border: 1px solid var(--tn-border, #3c3c3c);
  border-radius: 8px;
  overflow: hidden;
}
.tn-excalidraw-island__note {
  margin: 0;
  padding: 14px 12px;
  color: var(--tn-muted, #9a9a9a);
  font-size: 13px;
}
</style>
