<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { MindmapSession } from '@tnotesjs/mindmap-core'
import type { CanvasEditor, MarkdownDiagnostic } from '@tnotesjs/mindmap-core'
import { insertImageIntoSource } from '../app/imagePaste'
import AppIcon from '../ui/AppIcon.vue'
import CollapseMenu from '../ui/CollapseMenu.vue'
import FocusBreadcrumbs from '../ui/FocusBreadcrumbs.vue'
import IconButton from '../ui/IconButton.vue'
import MarkdownView from '../ui/MarkdownView.vue'
import MindmapView from '../ui/MindmapView.vue'
import OutlineView from '../ui/OutlineView.vue'
import SearchBar from '../ui/SearchBar.vue'
import { primaryShortcut } from '../ui/platform'
import { PROTOCOL_VERSION, type DocumentSnapshot, type ExtensionToWebviewMessage } from '../protocol'
import { blobToBase64, createBridge, protocolMessage } from './bridge'

type ViewId = 'outline' | 'map' | 'source'
interface PersistedState { view?: ViewId }
interface PendingAsset {
  resolve: (result: { relativePath: string; webviewUri: string }) => void
  reject: (error: Error) => void
}

const bridge = createBridge<PersistedState>()
const session = shallowRef<MindmapSession | null>(null)
const markdown = ref('')
const fileName = ref('')
const view = ref<ViewId>(bridge.getState()?.view ?? 'map')
const docVersion = ref(0)
const hostDocumentVersion = ref(0)
const diagnostics = ref<readonly MarkdownDiagnostic[]>([])
const searchVisible = ref(false)
const assetUris = ref<Record<string, string>>({})
const toast = ref('')
const imagePreviewSrc = ref<string | null>(null)
const canvasEditorRef = shallowRef<CanvasEditor | null>(null)
const outlineViewRef = ref<InstanceType<typeof OutlineView> | null>(null)
const markdownViewRef = ref<InstanceType<typeof MarkdownView> | null>(null)
const sourceValid = computed(() => diagnostics.value.length === 0)

let suppressEdit = false
let changeId = 0
let inFlight: { id: number; text: string } | null = null
let queuedText: string | null = null
let syncedText = ''
let assetRequestId = 0
let toastTimer: ReturnType<typeof setTimeout> | null = null
const pendingAssets = new Map<number, PendingAsset>()

function showToast(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 5000)
}

function wireSession(next: MindmapSession) {
  next.on('change', (value) => {
    if (value !== markdown.value) markdown.value = value
    docVersion.value++
    scheduleEdit(value)
  })
  next.on('selectionChange', () => docVersion.value++)
  next.on('collapseChange', () => docVersion.value++)
  next.on('matchChange', () => docVersion.value++)
  next.on('focusChange', () => docVersion.value++)
  next.on('warning', showToast)
  next.on('validityChange', (items) => {
    diagnostics.value = [...items]
    if (items.length > 0) {
      view.value = 'source'
      searchVisible.value = false
    }
    docVersion.value++
  })
}

function applySnapshot(snapshot: DocumentSnapshot, notifyConflict = false) {
  suppressEdit = true
  fileName.value = snapshot.fileName
  hostDocumentVersion.value = snapshot.version
  syncedText = snapshot.text
  assetUris.value = snapshot.assetUris
  if (!session.value) {
    const next = new MindmapSession({ markdown: snapshot.text, fileName: snapshot.fileName })
    session.value = next
    markdown.value = snapshot.text
    diagnostics.value = [...next.diagnostics]
    wireSession(next)
  } else {
    markdown.value = snapshot.text
    if (snapshot.text !== session.value.getMarkdown()) session.value.setMarkdown(snapshot.text)
    diagnostics.value = [...session.value.diagnostics]
  }
  suppressEdit = false
  docVersion.value++
  if (!sourceValid.value) view.value = 'source'
  if (notifyConflict) showToast('文件已从 VSCode 重新载入，未确认的本地编辑已取消。')
}

function sendEdit(text: string) {
  if (text === syncedText) return
  const id = ++changeId
  inFlight = { id, text }
  bridge.postMessage(protocolMessage({
    type: 'edit',
    changeId: id,
    baseVersion: hostDocumentVersion.value,
    text,
  }))
}

function scheduleEdit(text: string) {
  if (suppressEdit || text === syncedText) return
  if (inFlight) queuedText = text
  else sendEdit(text)
}

function finishEdit(version: number) {
  if (!inFlight) return
  syncedText = inFlight.text
  hostDocumentVersion.value = version
  inFlight = null
  const next = queuedText
  queuedText = null
  if (next != null && next !== syncedText) sendEdit(next)
}

function onHostMessage(event: MessageEvent<ExtensionToWebviewMessage>) {
  const message = event.data
  if (!message || message.protocol !== PROTOCOL_VERSION) return
  if (message.type === 'document') {
    const isOwnChange = inFlight?.text === message.snapshot.text
    hostDocumentVersion.value = message.snapshot.version
    assetUris.value = message.snapshot.assetUris
    if (isOwnChange) {
      syncedText = message.snapshot.text
    } else if (!inFlight && message.snapshot.text !== markdown.value) {
      applySnapshot(message.snapshot)
    } else if (inFlight && message.snapshot.text !== inFlight.text && message.snapshot.text !== syncedText) {
      inFlight = null
      queuedText = null
      applySnapshot(message.snapshot, true)
    }
  } else if (message.type === 'editApplied') {
    if (inFlight?.id === message.changeId) finishEdit(message.version)
  } else if (message.type === 'editRejected') {
    if (inFlight?.id === message.changeId) {
      inFlight = null
      queuedText = null
      applySnapshot(message.snapshot)
      showToast(message.message)
    }
  } else if (message.type === 'assetWritten') {
    const pending = pendingAssets.get(message.requestId)
    if (pending) {
      pendingAssets.delete(message.requestId)
      pending.resolve({ relativePath: message.relativePath, webviewUri: message.webviewUri })
    }
  } else if (message.type === 'assetWriteFailed') {
    const pending = pendingAssets.get(message.requestId)
    if (pending) {
      pendingAssets.delete(message.requestId)
      pending.reject(new Error(message.message))
    }
  }
}

watch(markdown, (value) => {
  const current = session.value
  if (current && value !== current.getMarkdown()) current.setMarkdown(value)
  scheduleEdit(value)
})

watch(view, (value) => bridge.setState({ view: value }))

function resolveImageSrc(src: string): string {
  return assetUris.value[src] ?? src
}

async function writeAsset(blob: Blob): Promise<{ relativePath: string; webviewUri: string }> {
  const requestId = ++assetRequestId
  const result = new Promise<{ relativePath: string; webviewUri: string }>((resolve, reject) => {
    pendingAssets.set(requestId, { resolve, reject })
  })
  bridge.postMessage(protocolMessage({
    type: 'writeAsset',
    requestId,
    mime: blob.type || 'image/png',
    base64: await blobToBase64(blob),
  }))
  return result
}

async function onPasteImage(anchorId: string, blob: Blob) {
  const current = session.value
  if (!current) return
  try {
    const asset = await writeAsset(blob)
    assetUris.value = { ...assetUris.value, [asset.relativePath]: asset.webviewUri }
    const prepared = current.prepareImageInsertion(anchorId, asset.relativePath)
    if (!prepared) throw new Error('找不到图片粘贴位置')
    prepared.commit()
  } catch (error) {
    showToast(error instanceof Error ? error.message : '图片写入失败')
  }
}

async function onPasteImageInSource(blob: Blob, selectionStart: number, selectionEnd: number) {
  try {
    const asset = await writeAsset(blob)
    assetUris.value = { ...assetUris.value, [asset.relativePath]: asset.webviewUri }
    markdown.value = insertImageIntoSource(markdown.value, selectionStart, selectionEnd, asset.relativePath)
  } catch (error) {
    showToast(error instanceof Error ? error.message : '图片写入失败')
  }
}

function openSearch() {
  if (!sourceValid.value) return
  if (view.value !== 'outline') view.value = 'outline'
  searchVisible.value = true
}

function toggleSearch() {
  if (searchVisible.value) searchVisible.value = false
  else openSearch()
}

function switchView(next: ViewId) {
  if (!sourceValid.value && next !== 'source') return
  view.value = next
  if (next !== 'outline') searchVisible.value = false
}

function onJumpToNode(id: string) {
  if (view.value === 'map') canvasEditorRef.value?.centerOnNode(id)
  else if (view.value === 'outline') outlineViewRef.value?.locateNode(id)
  else {
    view.value = 'outline'
    nextTick(() => outlineViewRef.value?.locateNode(id))
  }
}

const sessionState = computed(() => ({
  canUndo: session.value?.canUndo ?? false,
  canRedo: session.value?.canRedo ?? false,
  hasSelection: session.value?.selectedNode != null,
  scalePercent: Math.round((canvasEditorRef.value?.getScale() ?? 1) * 100),
}))

function onGlobalKeydown(event: KeyboardEvent) {
  const mod = event.metaKey || event.ctrlKey
  if (mod && event.key.toLowerCase() === 's') {
    event.preventDefault()
    if (!sourceValid.value && !window.confirm('当前 Markdown 格式不合法。确认后仍将原始源码保存到文件，是否继续？')) return
    const pendingSource = markdownViewRef.value?.flushDraft()
    if (pendingSource != null) scheduleEdit(pendingSource)
    bridge.postMessage(protocolMessage({ type: 'save' }))
  } else if (sourceValid.value && mod && event.key.toLowerCase() === 'f' && !event.defaultPrevented) {
    event.preventDefault()
    openSearch()
  }
}

function onExternalLink(event: MouseEvent) {
  const anchor = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null
  if (!anchor) return
  const href = anchor.href
  if (!/^https?:/i.test(href)) return
  event.preventDefault()
  bridge.postMessage(protocolMessage({ type: 'openExternal', href }))
}

onMounted(() => {
  window.addEventListener('message', onHostMessage)
  window.addEventListener('keydown', onGlobalKeydown)
  document.addEventListener('click', onExternalLink, true)
  bridge.postMessage(protocolMessage({ type: 'ready' }))
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onHostMessage)
  window.removeEventListener('keydown', onGlobalKeydown)
  document.removeEventListener('click', onExternalLink, true)
  if (toastTimer) clearTimeout(toastTimer)
  for (const pending of pendingAssets.values()) pending.reject(new Error('编辑器已关闭'))
  pendingAssets.clear()
})

const viewTabs: Array<{ id: ViewId; label: string }> = [
  { id: 'outline', label: '大纲' },
  { id: 'map', label: '脑图' },
  { id: 'source', label: '源码' },
]
</script>

<template>
  <div v-if="session" class="vscode-app-shell">
    <header class="vscode-toolbar">
      <div class="toolbar-section file-section">
        <AppIcon name="mindmap" :size="18" />
        <span class="file-name" :title="fileName">{{ fileName }}</span>
        <span class="host-save-label">VSCode 管理保存</span>
      </div>

      <nav class="view-tabs" aria-label="视图切换">
        <button
          v-for="tab in viewTabs"
          :key="tab.id"
          type="button"
          class="view-tab"
          :class="{ active: view === tab.id }"
          :disabled="!sourceValid && tab.id !== 'source'"
          :data-tooltip="!sourceValid && tab.id !== 'source' ? '请先修复 Markdown 格式' : `${tab.label}视图`"
          :aria-label="`${tab.label}视图`"
          @click="switchView(tab.id)"
        >
          <AppIcon :name="tab.id === 'outline' ? 'outline' : tab.id === 'map' ? 'mindmap' : 'source'" :size="17" />
        </button>
      </nav>

      <div class="toolbar-section action-section">
        <IconButton icon="undo" :label="`撤销 (${primaryShortcut('Z')})`" :disabled="!sessionState.canUndo" @click="session.undo()" />
        <IconButton icon="redo" :label="`重做 (${primaryShortcut('Z', { shift: true })})`" :disabled="!sessionState.canRedo" @click="session.redo()" />
        <CollapseMenu v-if="view !== 'source'" @all="session.toggleCollapseAll()" @level="session.setCollapseLevel" />
        <IconButton
          v-if="view !== 'source'"
          icon="focus"
          :label="`聚焦选中主题 (${primaryShortcut(']')})`"
          :disabled="!sessionState.hasSelection"
          @click="session.focusSelected()"
        />
        <IconButton icon="search" :label="`搜索 (${primaryShortcut('F')})`" :disabled="!sourceValid" :active="searchVisible" @click="toggleSearch" />
      </div>
    </header>

    <FocusBreadcrumbs v-if="sourceValid && session.focusPath.length > 0" :session="session" :version="docVersion" />

    <main class="vscode-main-area">
      <MindmapView
        v-if="view === 'map'"
        :session="session"
        :resolve-image-src="resolveImageSrc"
        @ready="(editor) => (canvasEditorRef = editor)"
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
        @request-search="openSearch"
        @image-preview="(src) => (imagePreviewSrc = src)"
        @paste-image="onPasteImage"
      />
      <MarkdownView
        v-else
        ref="markdownViewRef"
        v-model="markdown"
        :diagnostics="diagnostics"
        @paste-image="onPasteImageInSource"
      />

      <div v-if="view === 'map'" class="map-controls" aria-label="脑图缩放工具">
        <IconButton icon="zoomOut" label="缩小" @click="canvasEditorRef?.zoomBy(1 / 1.2)" />
        <span class="scale-label">{{ sessionState.scalePercent }}%</span>
        <IconButton icon="zoomIn" label="放大" @click="canvasEditorRef?.zoomBy(1.2)" />
        <IconButton icon="fit" label="缩放适配" @click="canvasEditorRef?.zoomToFit()" />
      </div>

      <SearchBar :session="session" :visible="searchVisible" :version="docVersion" :on-jump="onJumpToNode" @close="searchVisible = false" />
    </main>

    <div v-if="toast" class="vscode-toast">{{ toast }}</div>
    <div v-if="imagePreviewSrc" class="image-preview-mask" @click="imagePreviewSrc = null">
      <img class="image-preview" :src="imagePreviewSrc" alt="图片预览" />
    </div>
  </div>
  <div v-else class="boot-message">正在连接 VSCode 文档…</div>
</template>
