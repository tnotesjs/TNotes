<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import UiTooltip from '../components/UiTooltip.vue'
import OutlineIcon from '../components/OutlineIcon.vue'
import PageWidthIcon from '../components/PageWidthIcon.vue'
import HeadingMenu from './HeadingMenu.vue'
import FormatIcon from './FormatIcon.vue'
import FormatOverflowBar from './FormatOverflowBar.vue'
import KbPathBreadcrumb from './KbPathBreadcrumb.vue'
import NoteAssetsIcon from './NoteAssetsIcon.vue'
import NoteAssetsPanel from './NoteAssetsPanel.vue'
import MarkdownSourceEditor from '../markdown/MarkdownSourceEditor.vue'
import { useEditorStore } from '../stores/editor'
import { useWorkspaceStore } from '../stores/workspace'

import { registerHeadingFoldRunner } from '../commands/headingFoldBridge'
import { findTab } from './layoutModel'
import { decideViewSwitch } from './noteViewSwitch'
import { insertableImageMarkdown } from './noteAssets'
import { pastedImageMarkdown } from '../editor/markdown/pasteImageWidth'
import { HEADING_NUMBER_DEFAULT_MAX_DEPTH } from '../../../shared/headingNumbering'

import type { NoteEditorTab, NoteViewMode } from '../../../shared/contracts'
import type { HeadingFoldCommand } from '../markdown/headingSectionCollapse'

interface MarkdownEditorHandle {
  insertTextAt(text: string, position?: number): void
  /** 可视化编辑器：是否存在尚未 emit 的修改（保存被拦下时为 true）。 */
  hasUnsavedDraft?(): boolean
  /** 可视化编辑器：导出当前 Markdown 草稿（**未经完整性校验**）。 */
  exportDraft?(): string | null
  wrapSelection(prefix: string, suffix: string, placeholder?: string): void
  prefixSelection(prefix: string): void
  setLinePrefix(prefix: string): void
  insertTable(): void
  addHeadingNumbers(maxDepth: number): void
  removeHeadingNumbers(): void
  applyHeadingFold?(command: HeadingFoldCommand): boolean
  flush(): void
}

const MilkdownMarkdownEditor = defineAsyncComponent(
  () => import('../markdown/MilkdownMarkdownEditor.vue')
)

// Warm the editor chunk after idle so the first note open pays less JS parse cost.
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(() => {
    void import('../markdown/MilkdownMarkdownEditor.vue')
  })
} else {
  window.setTimeout(() => {
    void import('../markdown/MilkdownMarkdownEditor.vue')
  }, 1_200)
}

const props = defineProps<{ tab: NoteEditorTab; groupId: string; active: boolean }>()
const editor = useEditorStore()
const workspace = useWorkspaceStore()
const key = computed(() => `${props.tab.knowledgeBaseId}:${props.tab.noteUuid}`)
const session = computed(() =>
  workspace.getDocumentSession(props.tab.knowledgeBaseId, props.tab.noteUuid)
)
const milkdownMarkdownEditor = ref<MarkdownEditorHandle | null>(null)
const markdownSourceEditor = ref<MarkdownEditorHandle | null>(null)
const milkdownFailed = ref(false)
const milkdownMountKey = ref(0)
/**
 * 保存被拦下（编辑器里有尚未 emit 的修改）：状态来自 store，提示常驻直到草稿解决。
 *
 * 之所以要拦切换：这类修改只在编辑器内存里，而两个视图是 `v-if` / `v-else` ——
 * 直接切到源码视图会**销毁可视化编辑器**，用户刚写的内容当场消失。
 */
const draftBlocked = computed(() => Boolean(session.value?.unsavedDraft))
/** 上一次「危险切换被拒」的原因（只在拒绝时出现，不是常驻提示）。 */
const switchBlockedReason = ref('')
/** 受控携带：把草稿作为源码视图初值（仅在完整性校验通过时设置）。 */
const carriedDraft = ref<string | null>(null)
const markdownEditor = computed(() =>
  props.tab.viewMode === 'source' ? markdownSourceEditor.value : milkdownMarkdownEditor.value
)
const pageWidthLabel = computed(() => (props.tab.pageWidth === 'wide' ? '超宽显示' : '标准页宽'))
// 标题编号深度生效值：库级约定（tnotes.json）→ desk 全局 → 内置默认
const headingNumberMaxDepth = computed(
  () =>
    workspace.overview.allKnowledgeBases.find((kb) => kb.id === props.tab.knowledgeBaseId)
      ?.headingNumberMaxDepth ??
    workspace.settings?.headingNumberMaxDepth ??
    HEADING_NUMBER_DEFAULT_MAX_DEPTH
)
const noteAssetsVisible = computed(() => {
  const located = findTab(editor.layout, props.tab.id)
  const tab = located?.tab.type === 'note' ? located.tab : props.tab
  return tab.noteAssetsVisible === true
})

const outlineVisible = computed(() => {
  const located = findTab(editor.layout, props.tab.id)
  const tab = located?.tab.type === 'note' ? located.tab : props.tab
  return tab.outlineVisible !== false
})
const titleInput = ref<HTMLInputElement | null>(null)
const editingTitle = ref(false)
const titleDraft = ref('')
const renaming = ref(false)
const headingLevel = ref<number | null>(null)
const formatDisabled = computed(() => {
  if (!session.value?.document || session.value.document.readOnly) return true
  if (props.tab.viewMode === 'readonly') return true
  return props.tab.viewMode !== 'source' && milkdownFailed.value
})
const formatActions = [
  'bold',
  'italic',
  'strikethrough',
  'inline-code',
  'heading',
  'heading-number',
  'heading-number-remove',
  'quote',
  'unordered-list',
  'ordered-list',
  'checkbox',
  'link',
  'code-block',
  'divider',
  'table'
] as const

watch(key, () => {
  editingTitle.value = false
})

watch(
  [milkdownMarkdownEditor, () => props.active, () => props.tab.viewMode],
  () => {
    if (
      props.active &&
      props.tab.viewMode !== 'source' &&
      milkdownMarkdownEditor.value?.applyHeadingFold
    ) {
      const handle = milkdownMarkdownEditor.value
      registerHeadingFoldRunner((command) => handle.applyHeadingFold?.(command) ?? false)
    } else if (props.active) {
      registerHeadingFoldRunner(null)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (props.active) registerHeadingFoldRunner(null)
})

async function editTitle(): Promise<void> {
  if (!session.value || session.value.document.readOnly || renaming.value) return
  titleDraft.value = session.value.document.title
  editingTitle.value = true
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}

async function commitTitle(): Promise<void> {
  if (!editingTitle.value) return
  editingTitle.value = false
  const title = titleDraft.value.trim()
  if (!title || title === session.value?.document.title) return
  const { knowledgeBaseId, noteUuid } = props.tab
  renaming.value = true
  try {
    await workspace.renameNote(knowledgeBaseId, noteUuid, title)
  } catch (cause) {
    workspace.error = cause instanceof Error ? cause.message : String(cause)
  } finally {
    renaming.value = false
  }
}

function onTitleKeydown(event: KeyboardEvent): void {
  // Enter used to confirm a Chinese IME candidate must not submit the name.
  if (event.isComposing) return
  if (event.key === 'Enter') {
    event.preventDefault()
    titleInput.value?.blur()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    editingTitle.value = false
  }
}

onMounted(() => {
  void workspace.ensureDocument(props.tab.knowledgeBaseId, props.tab.noteUuid)
})

function setMode(mode: NoteViewMode): void {
  if (mode === props.tab.viewMode) return
  // Flush while Milkdown is still mounted and viewMode is still `visual`.
  // Switching first lets the source editor mount with the stale session,
  // or applyReadonly discards an uncommitted Edit draft.
  if (props.tab.viewMode === 'visual' && mode !== 'visual') {
    milkdownMarkdownEditor.value?.flush?.()
    const visual = milkdownMarkdownEditor.value
    const decision = decideViewSwitch({
      // 是否受阻以 store 里的状态为准（编辑器通过事件上报，flush() 内已同步）；
      // 草稿文本只能问编辑器要，且默认不可信。
      // store 标记为准；编辑器自己再报一次兜底（事件万一丢了也不会误切）
      hasUnsavedDraft: draftBlocked.value || (visual?.hasUnsavedDraft?.() ?? false),
      draft: visual?.exportDraft?.() ?? null,
      storeSource: session.value?.content ?? null
    })
    if (decision.kind === 'blocked') {
      // 危险切换：切过去就会销毁编辑器、丢掉用户刚写的内容 —— 不切。
      switchBlockedReason.value = decision.reason
      workspace.status = `未切换视图：${decision.reason}`
      return
    }
    switchBlockedReason.value = ''
    if (decision.kind === 'switch-with-draft') carriedDraft.value = decision.carriedDraft
  }
  // 回到可视化视图后，携带的草稿不再适用（下次要带会重新校验）
  if (mode !== 'source') carriedDraft.value = null
  editor.setNoteViewMode(props.tab.id, mode)
}

/** 复制当前修改：用户最直接的「把刚写的东西拿出来」通道。 */
async function copyDraft(): Promise<void> {
  const draft = milkdownMarkdownEditor.value?.exportDraft?.() ?? null
  if (!draft) {
    workspace.status = '拿不到当前修改（编辑器未就绪）。'
    return
  }
  try {
    await navigator.clipboard.writeText(draft)
    workspace.status = '当前修改已复制到剪贴板（未经完整性校验，粘贴前请自行核对）。'
  } catch {
    workspace.status = '复制失败：剪贴板不可用。'
  }
}

/** 编辑器上报「有/没有尚未 emit 的修改」：状态存 store，提示常驻由它驱动。 */
function handleUnsavedDraftChange(hasDraft: boolean): void {
  workspace.setDocumentUnsavedDraft(key.value, hasDraft)
  if (!hasDraft) switchBlockedReason.value = ''
}

function updateContent(content: string): void {
  // 源码视图里改动过之后，携带的草稿已经变成「当前内容」，别再当初值
  if (props.tab.viewMode === 'source') carriedDraft.value = null
  workspace.updateDocumentContent(key.value, content, props.tab.viewMode === 'visual')
}

function activate(): void {
  editor.activate(props.groupId, props.tab.id)
}

function insertTemplate(text: string): void {
  markdownEditor.value?.insertTextAt(text)
}

/** 资源面板：把已有资源一键插入当前笔记（初版只图片，走与粘贴同一条插入路径） */
function insertAssetReference(relPath: string): void {
  if (session.value?.document.readOnly) return
  const noteRelPath = session.value?.document.relPath ?? ''
  const markdown = insertableImageMarkdown(noteRelPath, relPath)
  if (!markdown) {
    workspace.error = `该类型暂不支持一键插入：${relPath}`
    return
  }
  activeEditor()?.insertTextAt(`${markdown}\n`)
}

/** 资源面板：定位笔记里的引用（可视化视图选中节点，源码视图选中那一段文本） */
function locateAssetReference(rawPath: string): void {
  const found = activeEditor()?.revealReference?.(rawPath) ?? false
  if (!found) workspace.status = `没有在正文里找到这处引用：${rawPath}`
}

/** 当前视图对应的编辑器句柄（两个视图暴露了同一组方法） */
function activeEditor(): {
  insertTextAt: (text: string, position?: number) => void
  revealReference?: (rawPath: string) => boolean
} | null {
  const handle =
    props.tab.viewMode === 'source' ? markdownSourceEditor.value : milkdownMarkdownEditor.value
  return handle as unknown as {
    insertTextAt: (text: string, position?: number) => void
    revealReference?: (rawPath: string) => boolean
  } | null
}

async function pasteImage(file: File, insertAt: number): Promise<void> {
  const targetEditor = markdownSourceEditor.value
  try {
    const attachment = await workspace.uploadImage(
      props.tab.knowledgeBaseId,
      props.tab.noteUuid,
      file
    )
    targetEditor?.insertTextAt(await pastedImageMarkdown(file, attachment.markdownPath), insertAt)
  } catch (cause) {
    workspace.error = cause instanceof Error ? cause.message : String(cause)
  }
}

async function uploadVisualImage(file: File): Promise<{ src: string; alt: string }> {
  try {
    const attachment = await workspace.uploadImage(
      props.tab.knowledgeBaseId,
      props.tab.noteUuid,
      file
    )
    return { src: attachment.markdownPath, alt: '' }
  } catch (cause) {
    workspace.error = cause instanceof Error ? cause.message : String(cause)
    throw cause
  }
}

function handleMilkdownFatal(message: string): void {
  milkdownFailed.value = true
  workspace.error = `Milkdown 无法打开这篇笔记：${message}`
}

function retryMilkdown(): void {
  milkdownMountKey.value += 1
  milkdownFailed.value = false
}

function openLink(url: string): void {
  try {
    editor.openWeb(url)
  } catch (cause) {
    workspace.error = cause instanceof Error ? cause.message : String(cause)
  }
}
</script>

<template>
  <div v-if="session" class="note-pane" @mousedown="activate">
    <div v-if="session.externalConflict" class="conflict-banner">
      <span>磁盘内容已经变化，Desk 没有覆盖你的编辑。</span>
      <button type="button" @click="workspace.reloadCurrentDocument">载入磁盘</button>
      <button type="button" @click="workspace.keepEditorAgainstDisk">保留编辑内容</button>
    </div>

    <!-- 面包屑内部有 Teleport（下拉挂 body），是多根组件：class 无法自动落到 nav 上，
         所以这里必须自己包一层容器，样式与 e2e 选择器都挂在这一层 -->
    <div class="note-path-bar">
      <KbPathBreadcrumb
        :knowledge-base-id="tab.knowledgeBaseId"
        :rel-path="session.document.relPath"
        :fallback-name="tab.knowledgeBaseName"
      />
    </div>

    <div class="document-toolbar">
      <div class="document-path" :title="session.document.filePath">
        <span class="note-index">{{ session.document.index }}.</span>
        <input
          v-if="editingTitle"
          ref="titleInput"
          v-model="titleDraft"
          class="note-title-input"
          aria-label="笔记名称"
          autocomplete="off"
          @blur="commitTitle"
          @keydown="onTitleKeydown"
        />
        <button
          v-else
          type="button"
          class="note-title-button"
          aria-label="重命名笔记"
          :disabled="session.document.readOnly || renaming"
          @click="editTitle"
        >
          {{ session.document.title }}
        </button>
        <span v-if="session.document.readOnly" class="read-only">只读</span>
      </div>
      <FormatOverflowBar :items="formatActions" :disabled="formatDisabled">
        <template #item="{ item }">
          <UiTooltip v-if="item === 'bold'" label="粗体" shortcut="⌘ B">
            <button
              type="button"
              aria-label="粗体"
              :disabled="formatDisabled"
              @click="markdownEditor?.wrapSelection('**', '**')"
            >
              <FormatIcon name="bold" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'italic'" label="斜体" shortcut="⌘ I">
            <button
              type="button"
              aria-label="斜体"
              :disabled="formatDisabled"
              @click="markdownEditor?.wrapSelection('*', '*')"
            >
              <FormatIcon name="italic" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'strikethrough'" label="删除线" shortcut="⇧ ⌘ X">
            <button
              type="button"
              aria-label="删除线"
              :disabled="formatDisabled"
              @mousedown.prevent
              @click="markdownEditor?.wrapSelection('~~', '~~')"
            >
              <FormatIcon name="strikethrough" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'inline-code'" label="行内代码" shortcut="⌘ E">
            <button
              type="button"
              aria-label="行内代码"
              :disabled="formatDisabled"
              @mousedown.prevent
              @click="markdownEditor?.wrapSelection('`', '`')"
            >
              <FormatIcon name="inline-code" />
            </button>
          </UiTooltip>
          <HeadingMenu
            v-else-if="item === 'heading'"
            :level="headingLevel"
            :disabled="formatDisabled"
            :active="active"
            :platform="workspace.runtimePlatform"
            @select="markdownEditor?.setLinePrefix($event === 0 ? '' : `${'#'.repeat($event)} `)"
          />
          <UiTooltip v-else-if="item === 'heading-number'" label="标题编号（重排）">
            <button
              type="button"
              aria-label="标题编号（重排）"
              :disabled="formatDisabled"
              @click="markdownEditor?.addHeadingNumbers(headingNumberMaxDepth)"
            >
              <FormatIcon name="heading-number" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'heading-number-remove'" label="移除标题编号">
            <button
              type="button"
              aria-label="移除标题编号"
              :disabled="formatDisabled"
              @click="markdownEditor?.removeHeadingNumbers()"
            >
              <FormatIcon name="heading-number-remove" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'quote'" label="引用" shortcut="⇧ ⌘ U">
            <button
              type="button"
              aria-label="引用"
              :disabled="formatDisabled"
              @click="markdownEditor?.setLinePrefix('> ')"
            >
              <FormatIcon name="quote" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'unordered-list'" label="无序列表" shortcut="⇧ ⌘ 8">
            <button
              type="button"
              aria-label="无序列表"
              :disabled="formatDisabled"
              @click="markdownEditor?.setLinePrefix('- ')"
            >
              <FormatIcon name="unordered-list" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'ordered-list'" label="有序列表">
            <button
              type="button"
              aria-label="有序列表"
              :disabled="formatDisabled"
              @click="markdownEditor?.setLinePrefix('1. ')"
            >
              <FormatIcon name="ordered-list" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'checkbox'" label="复选框">
            <button
              type="button"
              aria-label="复选框"
              :disabled="formatDisabled"
              @click="markdownEditor?.setLinePrefix('- [ ] ')"
            >
              <FormatIcon name="checkbox" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'link'" label="链接">
            <button
              type="button"
              aria-label="链接"
              :disabled="formatDisabled"
              @click="markdownEditor?.wrapSelection('[', '](https://)', '链接')"
            >
              <FormatIcon name="link" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'code-block'" label="代码块">
            <button
              type="button"
              aria-label="代码块"
              :disabled="formatDisabled"
              @click="insertTemplate('\n```ts\n\n```\n')"
            >
              <FormatIcon name="code-block" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'divider'" label="分割线">
            <button
              type="button"
              aria-label="分割线"
              :disabled="formatDisabled"
              @click="insertTemplate('\n---\n')"
            >
              <FormatIcon name="divider" />
            </button>
          </UiTooltip>
          <UiTooltip v-else-if="item === 'table'" label="表格">
            <button
              type="button"
              aria-label="表格"
              :disabled="formatDisabled"
              @click="markdownEditor?.insertTable()"
            >
              <FormatIcon name="table" />
            </button>
          </UiTooltip>
        </template>
      </FormatOverflowBar>
      <div class="view-controls">
        <div class="layout-toggles">
          <UiTooltip :label="pageWidthLabel">
            <button
              type="button"
              class="page-width-toggle"
              :aria-label="pageWidthLabel"
              @click="editor.toggleNotePageWidth(tab.id)"
            >
              <PageWidthIcon :mode="tab.pageWidth" />
            </button>
          </UiTooltip>
          <UiTooltip :label="outlineVisible ? '隐藏目录' : '显示目录'">
            <button
              type="button"
              class="outline-toggle"
              :class="{ active: outlineVisible }"
              :aria-label="outlineVisible ? '隐藏目录' : '显示目录'"
              :aria-pressed="outlineVisible"
              @click="editor.toggleNoteOutlineVisible(tab.id)"
            >
              <OutlineIcon />
            </button>
          </UiTooltip>
          <UiTooltip :label="noteAssetsVisible ? '隐藏本笔记资源' : '显示本笔记资源'">
            <button
              type="button"
              class="note-assets-toggle"
              data-testid="note-assets-toggle"
              :class="{ active: noteAssetsVisible }"
              :aria-label="noteAssetsVisible ? '隐藏本笔记资源' : '显示本笔记资源'"
              :aria-pressed="noteAssetsVisible"
              @click="editor.toggleNoteAssetsVisible(tab.id)"
            >
              <NoteAssetsIcon />
            </button>
          </UiTooltip>
        </div>
        <span class="view-divider" aria-hidden="true"></span>
        <div class="view-switcher" aria-label="笔记视图">
          <UiTooltip label="可视化编辑">
            <button
              type="button"
              aria-label="可视化编辑"
              :class="{ active: tab.viewMode === 'visual' }"
              @click="setMode('visual')"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m4 20 4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" />
                <path d="m14.5 6.7 2.8 2.8" />
              </svg>
            </button>
          </UiTooltip>
          <UiTooltip label="只读视图">
            <button
              type="button"
              aria-label="只读视图"
              :class="{ active: tab.viewMode === 'readonly' }"
              @click="setMode('readonly')"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5.5A3.5 3.5 0 0 1 7.5 4H11v16H7.5A3.5 3.5 0 0 0 4 21V5.5Z" />
                <path d="M20 5.5A3.5 3.5 0 0 0 16.5 4H13v16h3.5A3.5 3.5 0 0 1 20 21V5.5Z" />
              </svg>
            </button>
          </UiTooltip>
          <UiTooltip label="源码视图">
            <button
              type="button"
              aria-label="源码视图"
              :class="{ active: tab.viewMode === 'source' }"
              @click="setMode('source')"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4l-3 16" />
              </svg>
            </button>
          </UiTooltip>
        </div>
      </div>
    </div>

    <div v-if="draftBlocked" class="note-draft-banner" role="alert">
      <div class="note-draft-banner__text">
        <strong>当前修改尚未保存</strong>
        <span>
          原文件未改动；当前修改仍保留在编辑器中。
          {{ switchBlockedReason }}
        </span>
      </div>
      <div class="note-draft-banner__actions">
        <button type="button" @click="copyDraft">复制当前修改</button>
        <button type="button" title="先复制或处理这些修改，再切换视图" disabled>
          编辑源码（暂不可用）
        </button>
      </div>
    </div>
    <div class="note-body">
      <div class="note-editor-area">
        <MilkdownMarkdownEditor
          v-if="tab.viewMode !== 'source' && !milkdownFailed"
          :key="milkdownMountKey"
          ref="milkdownMarkdownEditor"
          class="editor-surface"
          :content="session.content"
          :mode="tab.viewMode"
          :read-only="session.document.readOnly"
          :knowledge-base-id="tab.knowledgeBaseId"
          :note-uuid="tab.noteUuid"
          :active="active"
          :page-width="tab.pageWidth"
          :outline-visible="outlineVisible"
          :toc-display="workspace.settings?.noteTocDisplay ?? 'expanded'"
          :upload-image="uploadVisualImage"
          @change="updateContent"
          @open-link="openLink"
          @open-note="workspace.openNoteByUuid(tab.knowledgeBaseId, $event)"
          @fatal="handleMilkdownFatal"
          @heading-level-change="headingLevel = $event"
          @unsaved-draft-change="handleUnsavedDraftChange"
        />
        <div v-else-if="tab.viewMode !== 'source'" class="editor-fatal" role="alert">
          <strong>可视化编辑器加载失败</strong>
          <span>内容没有被修改。你可以重试，或切换到源码视图继续编辑。</span>
          <div>
            <button type="button" @click="retryMilkdown">重试</button>
            <button type="button" @click="setMode('source')">打开源码视图</button>
          </div>
        </div>
        <MarkdownSourceEditor
          v-else
          ref="markdownSourceEditor"
          class="editor-surface"
          :content="carriedDraft ?? session.content"
          :mode="tab.viewMode"
          :read-only="session.document.readOnly"
          :knowledge-base-id="tab.knowledgeBaseId"
          :note-uuid="tab.noteUuid"
          :active="active"
          :page-width="tab.pageWidth"
          @change="updateContent"
          @paste-image="pasteImage"
        />
      </div>
      <NoteAssetsPanel
        v-if="noteAssetsVisible"
        class="note-assets-sidebar"
        :knowledge-base-id="tab.knowledgeBaseId"
        :note-uuid="tab.noteUuid"
        :note-rel-path="session.document.relPath"
        :note-index="session.document.index"
        :source="session.content"
        :read-only="session.document.readOnly"
        @insert="insertAssetReference"
        @locate="locateAssetReference"
        @close="editor.toggleNoteAssetsVisible(tab.id)"
      />
    </div>
  </div>
  <div v-else class="loading-note">正在读取笔记…</div>
</template>

<style scoped>
.note-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  container-type: inline-size;
  container-name: desk-note-pane;
}

.document-toolbar {
  position: relative;
  height: 40px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border);
  background: var(--editor-bg);
}

/* 路径面包屑：独立的 slim 行，压在标题工具条上方；不改动标题行的布局与选择器 */
.note-path-bar {
  flex: none;
  height: 22px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border);
  background: var(--editor-bg);
}

.document-path {
  flex: 1 1 0;
  min-width: 72px;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--muted);
  font-size: 10px;
}

.note-index,
.read-only {
  flex: none;
}

.note-title-button,
.note-title-input {
  min-width: 0;
  height: 26px;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0 4px;
  background: transparent;
  color: inherit;
  font: inherit;
}

.note-title-button {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  cursor: text;
}

.note-title-button:hover:not(:disabled) {
  background: var(--hover);
  color: var(--text);
}

.note-title-button:disabled {
  cursor: default;
}

.note-title-input {
  flex: 1;
  outline: none;
  border-color: var(--accent);
  background: var(--panel);
  color: var(--text);
}

.read-only {
  margin-left: 6px;
  border-radius: 4px;
  background: var(--warning-soft);
  color: var(--warning);
  padding: 2px 5px;
}

.view-controls,
.view-switcher {
  flex: none;
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 2px;
  gap: 1px;
}

.view-controls {
  flex: 1 1 0;
  min-width: min-content;
  justify-content: flex-end;
}

.layout-toggles {
  display: flex;
  align-items: center;
  gap: 1px;
}

.view-divider {
  width: 1px;
  height: 16px;
  margin: 0 7px;
  background: var(--border);
}

/* Outline needs ~1080px beside the writing column. Below that, both layout
   toggles do nothing useful, so hide them with the divider. */
@container desk-note-pane (max-width: 1080px) {
  .layout-toggles,
  .view-divider {
    display: none;
  }
}

.view-controls button,
.conflict-banner button,
:deep(.format-overflow button) {
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 10px;
}

:deep(.format-overflow .ui-tooltip-host) {
  flex: none;
}

:deep(.format-overflow button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 14px;
}

:deep(.format-overflow button:hover:not(:disabled)) {
  background: var(--hover);
  color: var(--text);
}

.view-controls button {
  width: 27px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  padding: 0;
}

.view-controls svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.view-switcher button.active,
.outline-toggle.active {
  background: var(--selected);
  color: var(--accent-strong);
}

.outline-toggle svg {
  fill: currentColor;
  stroke: none;
}

.conflict-banner {
  min-height: 35px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: var(--warning-soft);
  color: var(--warning);
  font-size: 10px;
}

.conflict-banner span {
  flex: 1;
}

.conflict-banner button {
  border: 1px solid color-mix(in srgb, var(--warning) 45%, transparent);
  border-radius: 5px;
  color: var(--warning);
  padding: 4px 7px;
}

.editor-surface {
  flex: 1;
  min-height: 0;
}

/* 编辑器 + 右侧「本笔记资源」面板：两者各自滚动，互不影响 */
.note-draft-banner {
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--accent) 12%, var(--editor-bg));
  color: var(--text);
  font: 12px/1.6 var(--font-sans);
}

.note-draft-banner__text {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}

.note-draft-banner__text span {
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-draft-banner__actions {
  display: flex;
  gap: 6px;
  flex: none;
}

.note-draft-banner__actions button {
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--panel);
  color: var(--text);
  font: inherit;
  cursor: pointer;
}

.note-draft-banner__actions button:hover:not(:disabled) {
  background: var(--hover);
}

.note-draft-banner__actions button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.note-body {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: stretch;
}

.note-editor-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.note-assets-sidebar {
  flex: none;
  width: 300px;
  min-width: 0;
  min-height: 0;
  border-left: 1px solid var(--border);
  background: var(--editor-bg);
}

/* 窄面板放不下 300px 侧栏：收窄一些，仍然可用 */
@container desk-note-pane (max-width: 900px) {
  .note-assets-sidebar {
    width: 240px;
  }
}

.note-assets-toggle.active {
  color: var(--accent-strong);
  background: var(--hover);
}

.editor-fatal {
  flex: 1;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  padding: 28px;
  color: var(--muted);
  text-align: center;
  font-size: 12px;
}

.editor-fatal strong {
  color: var(--text);
  font-size: 14px;
}

.editor-fatal > div {
  display: flex;
  gap: 8px;
}

.editor-fatal button {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  background: var(--panel);
  color: var(--text);
  cursor: pointer;
}

.loading-note {
  flex: 1;
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 11px;
}
</style>
