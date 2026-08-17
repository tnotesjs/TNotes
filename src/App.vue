<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { MindmapSession } from './engine'
import type { CanvasEditor } from './engine'
import { generateStressMarkdown, SAMPLE_MARKDOWN } from './sample'
import MarkdownView from './ui/MarkdownView.vue'
import MindmapView from './ui/MindmapView.vue'
import OutlineView from './ui/OutlineView.vue'
import SearchBar from './ui/SearchBar.vue'

const DEFAULT_NAME = '未命名.tn-mindmap.md'
type ViewId = 'outline' | 'map' | 'source'

const fileName = ref('示例.tn-mindmap.md')
const session = new MindmapSession({ markdown: SAMPLE_MARKDOWN, fileName: fileName.value })

const markdown = ref(session.getMarkdown())
const view = ref<ViewId>('map')
const docVersion = ref(0)
const searchVisible = ref(false)
const imagePreviewSrc = ref<string | null>(null)
const toast = ref('')
const focusPath = ref<string[]>([])

const canvasEditorRef = shallowRef<CanvasEditor | null>(null)
const outlineViewRef = ref<InstanceType<typeof OutlineView> | null>(null)

let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 5000)
}

// session 事件 → 版本号驱动各视图刷新；markdown 双向同步（等值守卫防回环）
session.on('change', (md) => {
  if (md !== markdown.value) markdown.value = md
  docVersion.value++
})
session.on('selectionChange', () => docVersion.value++)
session.on('collapseChange', () => docVersion.value++)
session.on('matchChange', () => docVersion.value++)
session.on('focusChange', (titles) => {
  focusPath.value = titles
  docVersion.value++
})
session.on('warning', showToast)

watch(markdown, (md) => {
  if (md !== session.getMarkdown()) session.setMarkdown(md)
})

/** 依赖 docVersion 驱动的会话状态快照 */
const sessionState = computed(() => {
  if (docVersion.value < 0) {
    return { canUndo: false, canRedo: false, hasSelection: false, scalePercent: 100 }
  }
  return {
    canUndo: session.canUndo,
    canRedo: session.canRedo,
    hasSelection: session.selectedNode != null,
    scalePercent: Math.round((canvasEditorRef.value?.getScale() ?? 1) * 100),
  }
})

// ---------- 文件操作 ----------

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
  markdown.value = generateStressMarkdown(10000)
  showToast('已生成约 10000 节点的压力测试脑图')
}

// ---------- 搜索跳转（按当前视图路由） ----------

function onJumpToNode(id: string) {
  if (view.value === 'map') {
    canvasEditorRef.value?.centerOnNode(id)
  } else if (view.value === 'outline') {
    outlineViewRef.value?.locateNode(id)
  } else {
    view.value = 'outline'
    nextTick(() => outlineViewRef.value?.locateNode(id))
  }
}

// ---------- 全局快捷键：Cmd/Ctrl+F 打开搜索 ----------

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f' && !e.defaultPrevented) {
    e.preventDefault()
    searchVisible.value = true
  }
}
onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))

const viewTabs: Array<{ id: ViewId; label: string }> = [
  { id: 'outline', label: '大纲' },
  { id: 'map', label: '脑图' },
  { id: 'source', label: '源码' },
]
</script>

<template>
  <div class="app-shell">
    <header class="toolbar">
      <div class="toolbar-group">
        <span class="app-title">TNotes Mindmap</span>
        <span class="file-name" :title="fileName">{{ fileName }}</span>
        <button class="tb-btn" @click="onNew">新建</button>
        <button class="tb-btn" @click="onOpenClick">打开</button>
        <button class="tb-btn" @click="onExport">导出</button>
        <input ref="fileInput" type="file" accept=".md,.markdown,.tn-mindmap.md" hidden @change="onFileChange" />
      </div>

      <nav class="view-tabs">
        <button
          v-for="tab in viewTabs"
          :key="tab.id"
          class="view-tab"
          :class="{ active: view === tab.id }"
          @click="view = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="toolbar-group toolbar-right">
        <button class="tb-btn" :disabled="!sessionState.canUndo" title="撤销 (⌘Z)" @click="session.undo()">↩</button>
        <button class="tb-btn" :disabled="!sessionState.canRedo" title="重做 (⇧⌘Z)" @click="session.redo()">↪</button>
        <template v-if="view === 'map'">
          <button class="tb-btn" title="缩小" @click="canvasEditorRef?.zoomBy(1 / 1.2)">−</button>
          <span class="scale-label">{{ sessionState.scalePercent }}%</span>
          <button class="tb-btn" title="放大" @click="canvasEditorRef?.zoomBy(1.2)">+</button>
          <button class="tb-btn" title="缩放适配" @click="canvasEditorRef?.zoomToFit()">适配</button>
        </template>
        <button
          v-if="view !== 'source'"
          class="tb-btn"
          :disabled="!sessionState.hasSelection"
          title="聚焦选中子树（进入主题）"
          @click="session.focusSelected()"
        >
          聚焦
        </button>
        <button class="tb-btn" title="搜索 (⌘F)" @click="searchVisible = !searchVisible">搜索</button>
        <button class="tb-btn" title="载入示例" @click="loadSample">示例</button>
        <button class="tb-btn" title="生成约 10000 节点测试数据" @click="loadStress">压测</button>
      </div>
    </header>

    <div v-if="focusPath.length > 0" class="focus-bar">
      <button class="crumb" @click="session.exitFocusTo(0)">全图</button>
      <template v-for="(title, i) in focusPath" :key="i">
        <span class="crumb-sep">/</span>
        <button class="crumb" :class="{ current: i === focusPath.length - 1 }" @click="session.exitFocusTo(i + 1)">
          {{ title }}
        </button>
      </template>
    </div>

    <main class="main-area">
      <MindmapView
        v-if="view === 'map'"
        :session="session"
        @ready="(ed) => (canvasEditorRef = ed)"
        @request-search="searchVisible = true"
        @image-preview="(src) => (imagePreviewSrc = src)"
      />
      <OutlineView v-else-if="view === 'outline'" ref="outlineViewRef" :session="session" :version="docVersion" @image-preview="(src) => (imagePreviewSrc = src)" />
      <MarkdownView v-else v-model="markdown" />

      <SearchBar :session="session" :visible="searchVisible" :version="docVersion" :on-jump="onJumpToNode" @close="searchVisible = false" />
    </main>

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
  max-width: 160px;
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
.scale-label {
  font-size: 12px;
  color: var(--mm-text-dim);
  min-width: 42px;
  text-align: center;
  user-select: none;
}

.view-tabs {
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  background: var(--mm-hover);
}
.view-tab {
  border: none;
  background: transparent;
  color: var(--mm-text-dim);
  font-size: 13px;
  padding: 4px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.view-tab.active {
  background: var(--mm-panel-bg);
  color: var(--mm-text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
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
  position: relative;
  flex: 1;
  min-height: 0;
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
