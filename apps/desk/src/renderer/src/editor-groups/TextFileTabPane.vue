<script setup lang="ts">
/**
 * 知识库文本文件（只读）面板。
 *
 * 本阶段只读：读失败（二进制 / 超限 / 拒绝名单）时把主进程给的原因原样显示，
 * 不用空编辑器假装成功。Monaco 懒加载，单独 chunk，不进首屏。
 */
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import {
  loadMonaco,
  monacoThemeName,
  refreshMonacoTheme,
  readOnlyEditorOptions
} from '../monaco/monaco'

import KbPathBreadcrumb from './KbPathBreadcrumb.vue'

import type { KbTextFileDto, TextFileEditorTab as TextFileTab } from '../../../shared/contracts'
import type * as MonacoApi from 'monaco-editor'

const props = defineProps<{ tab: TextFileTab; active: boolean; groupId: string }>()

const hostRef = ref<HTMLDivElement | null>(null)
const phase = ref<'loading' | 'ready' | 'error'>('loading')
const message = ref('')
const file = ref<KbTextFileDto | null>(null)
const editor = shallowRef<MonacoApi.editor.IStandaloneCodeEditor | null>(null)

const kindLabel = (relPath: string): string => {
  if (relPath.endsWith('.md') || relPath.endsWith('.markdown')) return 'Markdown'
  const name = relPath.split('/').pop() ?? relPath
  const ext = name.includes('.') ? name.split('.').pop() : ''
  return ext ? ext.toUpperCase() : '文本'
}

async function mountEditor(content: string, language: string): Promise<void> {
  const monaco = await loadMonaco()
  const host = hostRef.value
  // 面板已卸载（或已经有一个实例）时不再建：内容由 load() 的调用时序保证先有宿主
  if (!host || editor.value) return
  editor.value = monaco.editor.create(host, {
    ...readOnlyEditorOptions(),
    value: content,
    language,
    theme: monacoThemeName(),
    wordWrap: language === 'markdown' ? 'on' : 'off'
  })
}

async function load(): Promise<void> {
  phase.value = 'loading'
  message.value = ''
  file.value = null
  const result = await window.desk.kbFiles.read({
    knowledgeBaseId: props.tab.knowledgeBaseId,
    relPath: props.tab.relPath
  })
  if (!result.ok) {
    phase.value = 'error'
    message.value = result.error.message
    return
  }
  file.value = result.value
  phase.value = 'ready'
  try {
    await mountEditor(result.value.content, result.value.language)
  } catch (cause) {
    // Monaco 懒加载失败（依赖预构建 hash 过期 / chunk 404 / 断网）：落成可见错误态
    phase.value = 'error'
    message.value = `编辑器加载失败：${cause instanceof Error ? cause.message : String(cause)}。若刚更新过依赖或代码，重新加载窗口即可恢复。`
  }
}

let themeObserver: MutationObserver | null = null

onMounted(() => {
  void load()
  // 明暗切换：重算主题并应用到已挂载的编辑器
  if (typeof MutationObserver !== 'undefined') {
    themeObserver = new MutationObserver(async () => {
      const monaco = await loadMonaco()
      refreshMonacoTheme(monaco)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
  }
})

watch(
  () => props.tab.relPath,
  () => {
    void load()
  }
)

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
  editor.value?.dispose()
  editor.value = null
})
</script>

<template>
  <section class="text-file-pane">
    <header class="pane-header">
      <!-- 同 NoteTabPane：面包屑是多根组件，class 要落在自己的容器上 -->
      <div class="path">
        <KbPathBreadcrumb
          :knowledge-base-id="tab.knowledgeBaseId"
          :rel-path="tab.relPath"
          :fallback-name="tab.knowledgeBaseName"
        />
      </div>
      <div class="head-meta">
        <span class="kind">{{ kindLabel(tab.relPath) }}</span>
        <span v-if="file" class="bytes">{{ file.bytes }} B</span>
        <span class="readonly" title="当前只支持查看">只读</span>
      </div>
    </header>
    <p v-if="phase === 'loading'" class="pane-note">正在读取…</p>
    <p v-else-if="phase === 'error'" class="pane-note is-error" role="alert">{{ message }}</p>
    <p v-else-if="file && !file.writable" class="pane-note is-hint">
      {{ file.writableReason }}
    </p>
    <div ref="hostRef" class="pane-editor" :data-state="phase" />
  </section>
</template>

<style scoped>
.text-file-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  background: var(--editor-bg);
  color: var(--text);
}
.pane-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border);
  font: 12px/1.6 var(--font-sans);
  flex: none;
}
.path {
  flex: 1 1 0;
  min-width: 0;
  color: var(--muted);
}
.head-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex: none;
  color: var(--muted);
}
.kind {
  padding: 1px 6px;
  border: 1px solid var(--border);
  border-radius: 5px;
}
.readonly {
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--hover);
}
.pane-note {
  margin: 0;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  font: 12px/1.6 var(--font-sans);
  color: var(--muted);
  flex: none;
}
.pane-note.is-error {
  color: var(--danger, #e5484d);
}
.pane-editor {
  flex: 1;
  min-height: 0;
  min-width: 0;
}
</style>
