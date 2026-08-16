<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type { MindmapEditor } from './engine'
import { SAMPLE_MARKDOWN, generateStressMarkdown } from './sample'
import MarkdownPanel from './ui/MarkdownPanel.vue'
import MindmapEditorView from './ui/MindmapEditor.vue'
import OutlinePanel from './ui/OutlinePanel.vue'
import SearchBar from './ui/SearchBar.vue'

const DEFAULT_NAME = '未命名.tn-mindmap.md'

const markdown = ref(SAMPLE_MARKDOWN)
const fileName = ref('示例.tn-mindmap.md')
const editorRef = shallowRef<MindmapEditor | null>(null)
const docVersion = ref(0)
const showOutline = ref(true)
const showMarkdown = ref(true)
const searchVisible = ref(false)
const imagePreviewSrc = ref<string | null>(null)
const toast = ref('')
const focusPath = ref<string[]>([])

let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 5000)
}

function onReady(editor: MindmapEditor) {
  editorRef.value = editor
  editor.on('selectionChange', () => docVersion.value++)
  editor.on('collapseChange', () => docVersion.value++)
  editor.on('focusChange', (titles) => {
    focusPath.value = titles
    docVersion.value++
  })
}

function bumpVersion() {
  docVersion.value++
}

/** 依赖 docVersion 驱动的编辑器状态快照 */
const editorState = computed(() => {
  // docVersion 恒 >= 0；引用它仅为与编辑器事件建立响应式依赖
  if (docVersion.value < 0) {
    return { canUndo: false, canRedo: false, hasSelection: false, scalePercent: 100 }
  }
  const ed = editorRef.value
  return {
    canUndo: ed?.canUndo ?? false,
    canRedo: ed?.canRedo ?? false,
    hasSelection: ed?.selectedNode != null,
    scalePercent: Math.round((ed?.getScale() ?? 1) * 100),
  }
})

const fileInput = ref<HTMLInputElement>()

function onNew() {
  if (!window.confirm('新建脑图？当前内容请确认已导出保存。')) return
  fileName.value = DEFAULT_NAME
  markdown.value = '# 未命名\n'
}

function onOpenClick() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!file.name.endsWith('.tn-mindmap.md')) {
    const ok = window.confirm(`「${file.name}」不是 *.tn-mindmap.md 脑图格式。\n打开后保存将只保留脑图部分（H1 + 无序列表），是否继续？`)
    if (!ok) return
  }
  const reader = new FileReader()
  reader.onload = () => {
    fileName.value = file.name
    markdown.value = String(reader.result ?? '')
  }
  reader.readAsText(file)
}

function onExport() {
  const blob = new Blob([markdown.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.value || DEFAULT_NAME
  a.click()
  URL.revokeObjectURL(url)
}

function loadSample() {
  fileName.value = '示例.tn-mindmap.md'
  markdown.value = SAMPLE_MARKDOWN
}

function loadStress() {
  fileName.value = '压力测试.tn-mindmap.md'
  markdown.value = generateStressMarkdown(1200)
  showToast('已生成 1200+ 节点的压力测试脑图')
}

function onFocusClick() {
  editorRef.value?.focusSelected()
}

function onBreadcrumbClick(index: number) {
  // index -1：回到全图
  editorRef.value?.exitFocusTo(index + 1)
}
</script>

<template>
  <div class="app-shell">
    <header class="toolbar">
      <div class="toolbar-group">
        <span class="app-title">TNotes Mindmap</span>
        <span class="file-name" :title="fileName">{{ fileName }}</span>
      </div>

      <div class="toolbar-group">
        <button class="tb-btn" @click="onNew">新建</button>
        <button class="tb-btn" @click="onOpenClick">打开</button>
        <button class="tb-btn" @click="onExport">导出</button>
        <input ref="fileInput" type="file" accept=".md,.markdown,.tn-mindmap.md" hidden @change="onFileChange" />
      </div>

      <div class="toolbar-group">
        <button class="tb-btn" :disabled="!editorState.canUndo" title="撤销 (⌘Z)" @click="editorRef?.undo()">↩</button>
        <button class="tb-btn" :disabled="!editorState.canRedo" title="重做 (⇧⌘Z)" @click="editorRef?.redo()">↪</button>
      </div>

      <div class="toolbar-group">
        <button class="tb-btn" title="缩小" @click="editorRef?.zoomBy(1 / 1.2)">−</button>
        <span class="scale-label">{{ editorState.scalePercent }}%</span>
        <button class="tb-btn" title="放大" @click="editorRef?.zoomBy(1.2)">+</button>
        <button class="tb-btn" title="缩放适配" @click="editorRef?.zoomToFit()">适配</button>
      </div>

      <div class="toolbar-group">
        <button class="tb-btn" :disabled="!editorState.hasSelection" title="聚焦选中子树" @click="onFocusClick">聚焦</button>
        <button class="tb-btn" title="搜索 (⌘F)" @click="searchVisible = !searchVisible">搜索</button>
      </div>

      <div class="toolbar-group toolbar-right">
        <button class="tb-btn" :class="{ active: showOutline }" @click="showOutline = !showOutline">大纲</button>
        <button class="tb-btn" :class="{ active: showMarkdown }" @click="showMarkdown = !showMarkdown">源码</button>
        <button class="tb-btn" title="载入示例" @click="loadSample">示例</button>
        <button class="tb-btn" title="生成 1200+ 节点测试数据" @click="loadStress">压测</button>
      </div>
    </header>

    <div v-if="focusPath.length > 0" class="focus-bar">
      <button class="crumb" @click="onBreadcrumbClick(-1)">全图</button>
      <template v-for="(title, i) in focusPath" :key="i">
        <span class="crumb-sep">/</span>
        <button class="crumb" :class="{ current: i === focusPath.length - 1 }" @click="onBreadcrumbClick(i)">
          {{ title }}
        </button>
      </template>
    </div>

    <main class="main-area">
      <aside v-show="showOutline" class="outline-col">
        <OutlinePanel :editor="editorRef" :version="docVersion" />
      </aside>

      <section class="canvas-col">
        <MindmapEditorView
          v-model="markdown"
          :file-name="fileName"
          @ready="onReady"
          @warning="showToast"
          @request-search="searchVisible = true"
          @image-preview="(src) => (imagePreviewSrc = src)"
          @update:model-value="bumpVersion"
        />
        <SearchBar :editor="editorRef" :visible="searchVisible" :version="docVersion" @close="searchVisible = false" />
      </section>
    </main>

    <footer v-show="showMarkdown" class="md-col">
      <MarkdownPanel v-model="markdown" />
    </footer>

    <div v-if="toast" class="toast">{{ toast }}</div>

    <div v-if="imagePreviewSrc" class="image-preview-mask" @click="imagePreviewSrc = null">
      <img class="image-preview" :src="imagePreviewSrc" alt="图片预览" />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--mm-canvas-bg);
  color: var(--mm-text);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
  height: 44px;
  flex: none;
  border-bottom: 1px solid var(--mm-border);
  background: var(--mm-panel-bg);
}
.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}
.toolbar-right {
  margin-left: auto;
}
.app-title {
  font-size: 13px;
  font-weight: 700;
  margin-right: 4px;
}
.file-name {
  font-size: 12px;
  color: var(--mm-text-dim);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tb-btn {
  border: 1px solid transparent;
  background: transparent;
  color: var(--mm-text);
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.tb-btn:hover:not(:disabled) {
  background: var(--mm-hover);
}
.tb-btn:disabled {
  color: var(--mm-text-dim);
  opacity: 0.5;
  cursor: default;
}
.tb-btn.active {
  background: var(--mm-selected-bg);
  border-color: var(--mm-accent);
}
.scale-label {
  font-size: 12px;
  color: var(--mm-text-dim);
  min-width: 42px;
  text-align: center;
  user-select: none;
}

.focus-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 12px;
  border-bottom: 1px solid var(--mm-border);
  background: var(--mm-panel-bg);
  flex: none;
}
.crumb {
  border: none;
  background: transparent;
  color: var(--mm-accent);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
}
.crumb:hover {
  background: var(--mm-hover);
}
.crumb.current {
  color: var(--mm-text);
  font-weight: 600;
}
.crumb-sep {
  color: var(--mm-text-dim);
}

.main-area {
  display: flex;
  flex: 1;
  min-height: 0;
}
.outline-col {
  width: 260px;
  flex: none;
  min-height: 0;
}
.canvas-col {
  position: relative;
  flex: 1;
  min-width: 0;
}

.md-col {
  height: 200px;
  flex: none;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgb(224 122 58 / 0.95);
  color: #fff;
  font-size: 13px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
}

.image-preview-mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgb(0 0 0 / 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.image-preview {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgb(0 0 0 / 0.4);
}
</style>
