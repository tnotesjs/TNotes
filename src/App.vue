<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { MindmapSession, parseMarkdown } from '@tnotesjs/mindmap-core'
import type { CanvasEditor, MarkdownDiagnostic } from '@tnotesjs/mindmap-core'
import { insertImageIntoSource } from './app/imagePaste'
import { getDirectoryPicker, LocalProject } from './app/localProject'
import { generateStressMarkdown, SAMPLE_MARKDOWN } from './sample'
import MarkdownView from './ui/MarkdownView.vue'
import MindmapView from './ui/MindmapView.vue'
import OutlineView from './ui/OutlineView.vue'
import SearchBar from './ui/SearchBar.vue'
import AppIcon from './ui/AppIcon.vue'
import CollapseMenu from './ui/CollapseMenu.vue'
import FocusBreadcrumbs from './ui/FocusBreadcrumbs.vue'
import IconButton from './ui/IconButton.vue'
import { primaryShortcut } from './ui/platform'

const DEFAULT_NAME = '未命名.tn-mindmap.md'
const DEFAULT_SAMPLE_NAME = 'TNotes-Mindmap-使用指南.tn-mindmap.md'
type ViewId = 'outline' | 'map' | 'source'

const fileName = ref(DEFAULT_SAMPLE_NAME)
const session = new MindmapSession({ markdown: SAMPLE_MARKDOWN, fileName: fileName.value })

const markdown = ref(session.getMarkdown())
const view = ref<ViewId>('map')
const docVersion = ref(0)
const searchVisible = ref(false)
const imagePreviewSrc = ref<string | null>(null)
const toast = ref('')
const diagnostics = ref<readonly MarkdownDiagnostic[]>(session.diagnostics)
const sourceValid = computed(() => diagnostics.value.length === 0)
const localProject = shallowRef<LocalProject | null>(null)
const saveState = ref<'memory' | 'saving' | 'saved' | 'saved-invalid' | 'paused' | 'error'>('memory')
const imageObjectUrls = ref(new Map<string, string>())
const saveStateLabel = computed(() => ({
  memory: '内存草稿',
  saving: '保存中…',
  saved: '已保存到本地',
  'saved-invalid': '非法源码已保存，自动保存暂停',
  paused: '格式非法，尚未保存',
  error: '保存失败',
})[saveState.value])

const canvasEditorRef = shallowRef<CanvasEditor | null>(null)
const outlineViewRef = ref<InstanceType<typeof OutlineView> | null>(null)

let toastTimer: ReturnType<typeof setTimeout> | null = null
let autosaveTimer: ReturnType<typeof setTimeout> | null = null
let skipAutosaveOnce = false
function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 5000)
}

// session 事件 → 版本号驱动各视图刷新；markdown 双向同步（等值守卫防回环）
session.on('change', (md) => {
  if (md !== markdown.value) markdown.value = md
  docVersion.value++
  if (skipAutosaveOnce) skipAutosaveOnce = false
  else scheduleAutosave()
})
session.on('selectionChange', () => docVersion.value++)
session.on('collapseChange', () => docVersion.value++)
session.on('matchChange', () => docVersion.value++)
session.on('focusChange', () => docVersion.value++)
session.on('warning', showToast)
session.on('validityChange', (items) => {
  diagnostics.value = [...items]
  if (items.length > 0) {
    view.value = 'source'
    searchVisible.value = false
  }
  docVersion.value++
})

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
const documentMenuRef = ref<HTMLDetailsElement>()

function closeDocumentMenu() {
  documentMenuRef.value?.removeAttribute('open')
}

function clearImageObjectUrls() {
  for (const url of imageObjectUrls.value.values()) URL.revokeObjectURL(url)
  imageObjectUrls.value = new Map()
}

function detachLocalProject() {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  autosaveTimer = null
  localProject.value = null
  saveState.value = 'memory'
  clearImageObjectUrls()
}

function resolveImageSrc(src: string): string {
  return imageObjectUrls.value.get(src) ?? src
}

function registerImageBlob(path: string, blob: Blob) {
  const next = new Map(imageObjectUrls.value)
  const old = next.get(path)
  if (old) URL.revokeObjectURL(old)
  next.set(path, URL.createObjectURL(blob))
  imageObjectUrls.value = next
}

function onNew() {
  if (!window.confirm('新建脑图？当前内容请确认已导出保存。')) return
  fileName.value = DEFAULT_NAME
  detachLocalProject()
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
    const ok = window.confirm(`「${file.name}」不是 *.tn-mindmap.md 脑图格式。\n仍可按源码打开；若格式不合法，大纲和脑图视图会暂时禁用。是否继续？`)
    if (!ok) return
  }
  const reader = new FileReader()
  reader.onload = () => {
    detachLocalProject()
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
  detachLocalProject()
  fileName.value = DEFAULT_SAMPLE_NAME
  markdown.value = SAMPLE_MARKDOWN
}

function loadStress() {
  detachLocalProject()
  fileName.value = '压力测试.tn-mindmap.md'
  markdown.value = generateStressMarkdown(10000)
  showToast('已生成约 10000 节点的压力测试脑图')
}

function pickerUnavailableMessage() {
  showToast('当前浏览器不支持本地目录写入，请使用最新版 Chrome 并通过 localhost 或 HTTPS 打开应用')
}

function defaultProjectName(): string {
  return fileName.value.replace(/\.tn-mindmap\.md$/i, '').replace(/\.md$/i, '') || '未命名'
}

async function ensureLocalProject(): Promise<LocalProject | null> {
  if (localProject.value) return localProject.value
  if (!sourceValid.value) {
    const confirmed = window.confirm('当前 Markdown 格式不合法。继续会把未经转换的原始源码写入本地作品，是否继续？')
    if (!confirmed) return null
  }
  const picker = getDirectoryPicker()
  if (!picker) {
    pickerUnavailableMessage()
    return null
  }
  const rawName = window.prompt('请输入作品名称。将在你选择的位置新建同名作品目录：', defaultProjectName())
  if (rawName === null) return null
  try {
    const parent = await picker({ mode: 'readwrite', id: 'tnotes-mindmap-create' })
    saveState.value = 'saving'
    const project = await LocalProject.create(parent, rawName, markdown.value)
    localProject.value = project
    fileName.value = project.fileName
    saveState.value = sourceValid.value ? 'saved' : 'saved-invalid'
    showToast(`已创建本地作品「${project.name}」`)
    return project
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      saveState.value = 'memory'
      return null
    }
    saveState.value = 'error'
    showToast(error instanceof Error ? error.message : '创建本地作品失败')
    return null
  }
}

async function onOpenLocalProject() {
  const picker = getDirectoryPicker()
  if (!picker) {
    pickerUnavailableMessage()
    return
  }
  try {
    const directory = await picker({ mode: 'readwrite', id: 'tnotes-mindmap-open' })
    const opened = await LocalProject.open(directory)
    const urls = new Map<string, string>()
    const parsed = parseMarkdown(opened.markdown, opened.project.name)
    if (parsed.valid) {
      const paths = new Set<string>()
      parsed.doc.traverse((node) => {
        const src = node.content.image?.src
        if (src?.startsWith('assets/')) paths.add(src)
      })
      for (const path of paths) {
        try {
          const file = await opened.project.readAsset(path)
          urls.set(path, URL.createObjectURL(file))
        } catch {
          // 缺失资源保留相对路径，让视图显示加载失败；不阻止正文打开。
        }
      }
    }
    clearImageObjectUrls()
    imageObjectUrls.value = urls
    localProject.value = opened.project
    fileName.value = opened.project.fileName
    saveState.value = parsed.valid ? 'saved' : 'saved-invalid'
    skipAutosaveOnce = true
    markdown.value = opened.markdown
    showToast(`已打开本地作品「${opened.project.name}」`)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    showToast(error instanceof Error ? error.message : '打开本地作品失败')
  }
}

async function writeCurrentSource(explicit: boolean): Promise<boolean> {
  const hadProject = localProject.value !== null
  const project = localProject.value ?? await ensureLocalProject()
  if (!project) return false
  if (!sourceValid.value && explicit && hadProject) {
    const confirmed = window.confirm('当前 Markdown 格式不合法。确认后将直接写入未经转换的原始源码，是否继续？')
    if (!confirmed) return false
  }
  if (!sourceValid.value && !explicit) {
    saveState.value = 'paused'
    return false
  }
  try {
    saveState.value = 'saving'
    await project.writeMarkdown(markdown.value)
    saveState.value = sourceValid.value ? 'saved' : 'saved-invalid'
    return true
  } catch (error) {
    saveState.value = 'error'
    showToast(error instanceof Error ? error.message : '写入本地作品失败')
    return false
  }
}

async function onSave() {
  await writeCurrentSource(true)
}

function scheduleAutosave() {
  if (!localProject.value) return
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (!session.isSourceValid) {
    saveState.value = 'paused'
    return
  }
  saveState.value = 'saving'
  autosaveTimer = setTimeout(() => {
    autosaveTimer = null
    void writeCurrentSource(false)
  }, 500)
}

async function onPasteImage(anchorId: string, blob: Blob) {
  const project = await ensureLocalProject()
  if (!project) return
  try {
    saveState.value = 'saving'
    const relativePath = await project.writeAsset(blob)
    const prepared = session.prepareImageInsertion(anchorId, relativePath)
    if (!prepared) throw new Error('找不到图片粘贴位置')
    await project.writeMarkdown(prepared.markdown)
    registerImageBlob(relativePath, blob)
    skipAutosaveOnce = true
    prepared.commit()
    saveState.value = 'saved'
  } catch (error) {
    saveState.value = 'error'
    showToast(error instanceof Error ? error.message : '粘贴图片失败；正文未插入图片节点')
  }
}

async function onPasteImageInSource(blob: Blob, selectionStart: number, selectionEnd: number) {
  const project = await ensureLocalProject()
  if (!project) return
  try {
    saveState.value = 'saving'
    const relativePath = await project.writeAsset(blob)
    const next = insertImageIntoSource(markdown.value, selectionStart, selectionEnd, relativePath)
    await project.writeMarkdown(next)
    registerImageBlob(relativePath, blob)
    skipAutosaveOnce = true
    markdown.value = next
    saveState.value = parseMarkdown(next).valid ? 'saved' : 'saved-invalid'
  } catch (error) {
    saveState.value = 'error'
    showToast(error instanceof Error ? error.message : '粘贴图片失败；源码未插入图片引用')
  }
}

// ---------- 搜索跳转（按当前视图路由） ----------

function openSearch() {
  if (!sourceValid.value) return
  // 搜索结果属于大纲编辑体验；脑图仅负责发起搜索，不在画布上叠加结果。
  if (view.value !== 'outline') view.value = 'outline'
  searchVisible.value = true
}

function toggleSearch() {
  if (searchVisible.value) searchVisible.value = false
  else openSearch()
}

function onJumpToNode(id: string) {
  if (!sourceValid.value) return
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
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    void onSave()
    return
  }
  const mod = e.metaKey || e.ctrlKey
  if (sourceValid.value && view.value !== 'source' && mod && e.altKey && !e.defaultPrevented) {
    if (!e.shiftKey && /^[123]$/.test(e.key)) {
      e.preventDefault()
      session.setCollapseLevel(Number(e.key) as 1 | 2 | 3)
      return
    }
    if (e.shiftKey && (e.key === '.' || e.key === '>')) {
      e.preventDefault()
      session.toggleCollapseAll()
      return
    }
  }
  if (sourceValid.value && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f' && !e.defaultPrevented) {
    e.preventDefault()
    openSearch()
  }
}
function onGlobalPointerDown(e: PointerEvent) {
  const menu = documentMenuRef.value
  if (menu?.open && !menu.contains(e.target as Node)) menu.removeAttribute('open')
}
onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('pointerdown', onGlobalPointerDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('pointerdown', onGlobalPointerDown)
  if (toastTimer) clearTimeout(toastTimer)
  if (autosaveTimer) clearTimeout(autosaveTimer)
  clearImageObjectUrls()
})

const viewTabs: Array<{ id: ViewId; label: string }> = [
  { id: 'outline', label: '大纲' },
  { id: 'map', label: '脑图' },
  { id: 'source', label: '源码' },
]

function switchView(next: ViewId) {
  if (!sourceValid.value && next !== 'source') return
  view.value = next
  if (next !== 'outline') searchVisible.value = false
}
</script>

<template>
  <div class="app-shell">
    <header class="toolbar">
      <div class="toolbar-group toolbar-left">
        <details ref="documentMenuRef" class="document-menu">
          <summary title="文档菜单" aria-label="文档菜单"><AppIcon name="menu" :size="20" /></summary>
          <div class="document-menu-popover" @click="closeDocumentMenu">
            <button type="button" @click="onNew"><AppIcon name="new" />新建</button>
            <button type="button" @click="onOpenClick"><AppIcon name="folder" />打开文件</button>
            <button type="button" @click="onOpenLocalProject"><AppIcon name="openProject" />打开本地作品</button>
            <button type="button" @click="onSave"><AppIcon name="save" />保存到本地作品 <kbd>⌘S</kbd></button>
            <button type="button" @click="onExport"><AppIcon name="download" />导出 Markdown</button>
            <span class="menu-divider" />
            <button type="button" @click="loadSample">载入默认测试示例</button>
            <button type="button" @click="loadStress">生成压力测试数据</button>
          </div>
        </details>
        <span class="app-title">TNotes</span>
        <span class="file-name" :title="fileName">{{ fileName }}</span>
        <span class="save-dot" :class="`is-${saveState}`" :title="saveStateLabel" :aria-label="saveStateLabel" />
        <input ref="fileInput" type="file" accept=".md,.markdown,.tn-mindmap.md" hidden @change="onFileChange" />
      </div>

      <nav class="view-tabs">
        <button
          v-for="tab in viewTabs"
          :key="tab.id"
          class="view-tab"
          :class="{ active: view === tab.id }"
          :disabled="!sourceValid && tab.id !== 'source'"
          :title="!sourceValid && tab.id !== 'source' ? '请先在源码视图修复 Markdown 格式' : `${tab.label}视图`"
          :aria-label="`${tab.label}视图`"
          @click="switchView(tab.id)"
        >
          <AppIcon :name="tab.id === 'outline' ? 'outline' : tab.id === 'map' ? 'mindmap' : 'source'" :size="16" />
        </button>
      </nav>

      <div class="toolbar-group toolbar-right">
        <IconButton icon="undo" :label="`撤销 (${primaryShortcut('Z')})`" :disabled="!sessionState.canUndo" @click="session.undo()" />
        <IconButton icon="redo" :label="`重做 (${primaryShortcut('Z', { shift: true })})`" :disabled="!sessionState.canRedo" @click="session.redo()" />
        <CollapseMenu
          v-if="view !== 'source'"
          @all="session.toggleCollapseAll()"
          @level="session.setCollapseLevel"
        />
        <IconButton
          v-if="view !== 'source'"
          icon="focus"
          :label="`聚焦选中主题 (${primaryShortcut(']')})`"
          :disabled="!sessionState.hasSelection"
          @click="session.focusSelected()"
        />
        <IconButton icon="search" :label="`搜索当前文档 (${primaryShortcut('F')})`" :disabled="!sourceValid" :active="searchVisible" @click="toggleSearch" />
      </div>
    </header>

    <FocusBreadcrumbs
      v-if="sourceValid && session.focusPath.length > 0"
      :session="session"
      :version="docVersion"
    />

    <main class="main-area">
      <MindmapView
        v-if="view === 'map'"
        :session="session"
        :resolve-image-src="resolveImageSrc"
        @ready="(ed) => (canvasEditorRef = ed)"
        @request-search="openSearch"
        @image-preview="(src) => (imagePreviewSrc = src)"
        @paste-image="onPasteImage"
      />
      <OutlineView
        v-else-if="view === 'outline'"
        ref="outlineViewRef"
        :session="session"
        :version="docVersion"
        :resolve-image-src="resolveImageSrc"
        @image-preview="(src) => (imagePreviewSrc = src)"
        @request-search="openSearch"
        @paste-image="onPasteImage"
      />
      <MarkdownView v-else v-model="markdown" :diagnostics="diagnostics" @paste-image="onPasteImageInSource" />

      <div v-if="view === 'map'" class="map-controls" aria-label="脑图缩放工具">
        <IconButton icon="zoomOut" label="缩小" @click="canvasEditorRef?.zoomBy(1 / 1.2)" />
        <span class="scale-label">{{ sessionState.scalePercent }}%</span>
        <IconButton icon="zoomIn" label="放大" @click="canvasEditorRef?.zoomBy(1.2)" />
        <IconButton icon="fit" label="缩放适配" @click="canvasEditorRef?.zoomToFit()" />
      </div>

      <SearchBar v-if="sourceValid" :session="session" :visible="searchVisible" :version="docVersion" :on-jump="onJumpToNode" @close="searchVisible = false" />
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
  position: relative;
  z-index: 30;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  height: 48px;
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
  justify-self: end;
}
.toolbar-left {
  min-width: 0;
  justify-self: start;
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
.save-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--mm-text-dim);
  opacity: .65;
}
.save-dot.is-saving { background: #d89428; animation: save-pulse 1s ease-in-out infinite; }
.save-dot.is-saved { background: #36a269; opacity: 1; }
.save-dot.is-paused,
.save-dot.is-saved-invalid,
.save-dot.is-error { background: #d14c4c; opacity: 1; }
@keyframes save-pulse { 50% { opacity: .25; } }

.document-menu {
  position: relative;
  flex: none;
}
.document-menu > summary {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--mm-text-dim);
  cursor: pointer;
  list-style: none;
}
.document-menu > summary::-webkit-details-marker { display: none; }
.document-menu > summary:hover,
.document-menu[open] > summary { background: var(--mm-hover); color: var(--mm-text); }
.document-menu-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 70;
  display: grid;
  width: 244px;
  padding: 6px;
  border: 1px solid var(--mm-border);
  border-radius: 10px;
  background: var(--mm-panel-bg);
  box-shadow: 0 12px 35px rgb(0 0 0 / .2);
}
.document-menu-popover button {
  display: flex;
  min-height: 34px;
  align-items: center;
  gap: 9px;
  padding: 0 9px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--mm-text);
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.document-menu-popover button:hover { background: var(--mm-hover); }
.document-menu-popover kbd {
  margin-left: auto;
  color: var(--mm-text-dim);
  font: inherit;
  font-size: 11px;
}
.menu-divider {
  height: 1px;
  margin: 5px 3px;
  background: var(--mm-border);
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
  display: inline-flex;
  width: 34px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--mm-text-dim);
  font-size: 13px;
  padding: 0;
  border-radius: 6px;
  cursor: pointer;
}
.view-tab.active {
  background: var(--mm-panel-bg);
  color: var(--mm-text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
}
.view-tab:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.main-area {
  position: relative;
  flex: 1;
  min-height: 0;
}

.map-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 20;
  display: flex;
  height: 38px;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--mm-border);
  border-radius: 9px;
  background: color-mix(in srgb, var(--mm-panel-bg) 96%, transparent);
  box-shadow: 0 6px 20px rgb(0 0 0 / .14);
}

@media (max-width: 760px) {
  .toolbar { grid-template-columns: minmax(0, 1fr) auto; }
  .view-tabs { order: 3; }
  .toolbar-right { display: none; }
  .app-title { display: none; }
  .file-name { max-width: 110px; }
  .view-tab { padding-inline: 8px; }
  .view-tab span { display: none; }
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
