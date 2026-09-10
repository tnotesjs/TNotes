<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import type {
  AssetJournalDto,
  AssetKbSummaryDto,
  AssetOperationPlanDto,
  AssetOptimizeEncoder,
  AssetOptimizePreviewDto,
  AssetOptimizeSettings,
  AssetOptimizeStrength,
  AssetRecordDto,
  AssetScanProgressDto,
  AssetScanReportDto,
  DeskError,
  KbAssetsEditorTab
} from '../../../shared/contracts'
import { focusDialogInput } from '../dialogInputFocus'
import { useEditorStore } from '../stores/editor'
import { useWorkspaceStore } from '../stores/workspace'
import { classifyAssetWriteBlocks, type ClassifiedAssetWriteBlock } from './kbAssetsReasons'

const props = defineProps<{ tab: KbAssetsEditorTab; active: boolean }>()

const editor = useEditorStore()
const workspace = useWorkspaceStore()

const loading = ref(false)
const error = ref<string | null>(null)
const report = ref<AssetScanReportDto | null>(null)
const summaries = ref<AssetKbSummaryDto[]>([])
const progress = ref<AssetScanProgressDto | null>(null)
const query = ref('')
const kindFilter = ref('all')
const statusFilter = ref('all')
const sortKey = ref<'path' | 'size' | 'refs'>('path')
const selectedPath = ref<string | null>(null)
const view = ref<'files' | 'broken' | 'diagnostics' | 'history'>('files')
const history = ref<AssetJournalDto[]>([])
const writeBusy = ref(false)
const writeError = ref<ClassifiedAssetWriteBlock[]>([])
const renameOpen = ref(false)
const renameDest = ref('')
const recycleOpen = ref(false)
const restoreOpen = ref(false)
const mergeOpen = ref(false)
const optimizeOpen = ref(false)
const optimizePreview = ref<AssetOptimizePreviewDto | null>(null)
const optimizeEncoder = ref<AssetOptimizeEncoder>('sharp')
const optimizeStrength = ref<AssetOptimizeStrength>('medium')
const optimizeFormat = ref<'keep' | 'webp' | 'jpeg'>('keep')
const optimizeMax = ref('')
const previewPlan = ref<AssetOperationPlanDto | null>(null)
const restoreTarget = ref<AssetJournalDto | null>(null)
let generation = 0
let unsubscribeProgress: (() => void) | null = null

const knowledgeBase = computed(
  () =>
    workspace.overview.allKnowledgeBases.find((item) => item.id === props.tab.knowledgeBaseId) ??
    null
)

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN')
}

function statusLabel(status: string): string {
  if (status === 'referenced') return '已引用'
  if (status === 'idle-candidate') return '疑似闲置'
  if (status === 'uncertain-idle') return '闲置未确定'
  if (status === 'uncertain-affected') return '不确定影响'
  if (status === 'protected') return '受保护'
  return status
}

function protectionLabel(reason: string): string {
  if (reason === 'kb-icon') return '知识库图标'
  if (reason === 'symlink-escape') return '符号链接越界'
  if (reason === 'excalidraw-source') return '自由绘图真相源，不可清理；派生产物不能覆盖它'
  return reason
}

function kindLabel(kind: string): string {
  if (kind === 'image') return '图片'
  if (kind === 'svg') return 'SVG'
  if (kind === 'gif') return 'GIF'
  if (kind === 'excalidraw') return 'Excalidraw'
  if (kind === 'html') return 'HTML'
  if (kind === 'css') return 'CSS'
  return '其他'
}

function planKindLabel(kind: string): string {
  if (kind === 'rename') return '重命名'
  if (kind === 'recycle') return '回收'
  if (kind === 'restore') return '恢复'
  if (kind === 'merge') return '合并重复'
  if (kind === 'optimize') return optimizeEncoder.value === 'oxipng' ? '无损优化' : '有损压缩'
  return kind
}

function stageLabel(stage: string): string {
  if (stage === 'applied') return '已完成'
  if (stage === 'restored') return '已恢复'
  if (stage === 'pending') return '待执行'
  if (stage === 'backed-up') return '已备份'
  if (stage === 'applying') return '应用中'
  if (stage === 'restoring') return '恢复中'
  if (stage === 'failed') return '失败'
  return stage
}

function canPreviewThumb(asset: AssetRecordDto): boolean {
  return asset.kind === 'image' || asset.kind === 'gif'
}

function thumbSrc(relPath: string): string {
  const params = new URLSearchParams({
    knowledgeBaseId: props.tab.knowledgeBaseId,
    path: relPath,
    v: String(workspace.assetRevisions[props.tab.knowledgeBaseId] ?? 0)
  })
  return `tnotes-asset://asset?${params.toString()}`
}

function moveLabel(move: { fromRelPath: string; toRelPath?: string }): string {
  return move.toRelPath ? `${move.fromRelPath} → ${move.toRelPath}` : move.fromRelPath
}

const filteredAssets = computed(() => {
  const items = report.value?.assets ?? []
  const needle = query.value.trim().toLocaleLowerCase()
  return items
    .filter((asset) => {
      if (kindFilter.value !== 'all' && asset.kind !== kindFilter.value) return false
      if (statusFilter.value === 'duplicates') return Boolean(asset.duplicateGroupId)
      if (statusFilter.value !== 'all' && asset.status !== statusFilter.value) return false
      if (!needle) return true
      return asset.relPath.toLocaleLowerCase().includes(needle)
    })
    .sort((a, b) => {
      if (sortKey.value === 'size') return b.size - a.size
      if (sortKey.value === 'refs') return b.references.length - a.references.length
      return a.relPath.localeCompare(b.relPath)
    })
})

const selected = computed(
  () => report.value?.assets.find((asset) => asset.relPath === selectedPath.value) ?? null
)

const idleCandidates = computed(
  () => report.value?.assets.filter((asset) => asset.status === 'idle-candidate') ?? []
)

const mergeableGroups = computed(
  () => report.value?.duplicateGroups.filter((group) => group.mergeable) ?? []
)

const selectedMergeGroup = computed(() =>
  mergeableGroups.value.find((group) => group.relPaths.includes(selected.value?.relPath ?? ''))
)

function defaultOptimizeSettings(): AssetOptimizeSettings {
  const fromSettings = workspace.settings?.imageUpload.optimize
  return {
    encoder: fromSettings?.encoder ?? 'sharp',
    strength: fromSettings?.strength ?? 'medium',
    // 全局设置不再带最大边；资源面板单次整理仍可选手动缩放。
    maxDimension: null,
    outputFormat: fromSettings?.outputFormat ?? 'keep'
  }
}

const incompleteHistory = computed(() =>
  history.value.filter((item) => item.stage !== 'applied' && item.stage !== 'restored')
)

const coverageMessage = computed(() => {
  if (!report.value) return ''
  if (report.value.coverageComplete) {
    return '当前扫描范围内来源已覆盖。确定性范围内可重命名、回收与恢复；每次只改当前知识库。'
  }
  return '存在未适配或未知范围的引用来源。只读盘点可用；不显示「无闲置 / 无断链」，批量清理与相关重命名保持关闭。'
})

const previewBlocks = computed(() => {
  const fromPlan = classifyAssetWriteBlocks({
    planReasons: previewPlan.value?.blockedReasons ?? []
  })
  return fromPlan.length > 0 ? fromPlan : writeError.value
})

const canApplyPreview = computed(
  () =>
    Boolean(previewPlan.value) &&
    (previewPlan.value?.blockedReasons.length ?? 0) === 0 &&
    !writeBusy.value
)

async function loadSummaries(): Promise<void> {
  const result = await window.desk.assets.summaries()
  if (result.ok) summaries.value = result.value
}

async function loadHistory(): Promise<void> {
  const result = await window.desk.assets.history(props.tab.knowledgeBaseId)
  if (result.ok) history.value = result.value
}

async function scan(force = false): Promise<void> {
  if (!force && loading.value) return
  error.value = null
  loading.value = true
  generation += 1
  const current = generation
  progress.value = {
    knowledgeBaseId: props.tab.knowledgeBaseId,
    generation: current,
    done: 0,
    total: 1
  }
  try {
    const result = await window.desk.assets.scan(props.tab.knowledgeBaseId, current)
    if (current !== generation) return
    if (!result.ok) {
      if (result.error.message.includes('ASSET_SCAN_ABORTED')) return
      error.value = result.error.message
      return
    }
    report.value = result.value
    if (
      selectedPath.value &&
      !result.value.assets.some((asset) => asset.relPath === selectedPath.value)
    ) {
      selectedPath.value = null
    }
  } catch (cause) {
    if (current !== generation) return
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    if (current === generation) {
      loading.value = false
      progress.value = null
    }
  }
}

async function cancel(): Promise<void> {
  generation += 1
  await window.desk.assets.cancel(props.tab.knowledgeBaseId)
  loading.value = false
  progress.value = null
}

function openReference(sourceRelPath: string, noteUuid?: string, noteTitle?: string): void {
  const kb = knowledgeBase.value
  if (!kb || !noteUuid) return
  editor.openNote(kb, noteUuid, noteTitle || sourceRelPath, 'source', undefined, 'permanent')
}

function openOtherKb(knowledgeBaseId: string): void {
  const descriptor = workspace.overview.allKnowledgeBases.find(
    (item) => item.id === knowledgeBaseId
  )
  if (descriptor) editor.openKbAssets(descriptor)
}

function closeDialogs(): void {
  renameOpen.value = false
  recycleOpen.value = false
  restoreOpen.value = false
  mergeOpen.value = false
  optimizeOpen.value = false
  optimizePreview.value = null
  previewPlan.value = null
  restoreTarget.value = null
  writeError.value = []
}

function setWriteError(deskError: DeskError): void {
  writeError.value = classifyAssetWriteBlocks({ error: deskError })
}

function openRename(): void {
  if (!selected.value || writeBusy.value) return
  renameDest.value = selected.value.relPath
  previewPlan.value = null
  writeError.value = []
  renameOpen.value = true
  void focusDialogInput(() => {
    const input = document.querySelector('.kb-assets-dialog .rename-dest')
    return input instanceof HTMLInputElement ? input : null
  })
}

async function previewRename(): Promise<void> {
  const fromRelPath = selected.value?.relPath
  const toRelPath = renameDest.value.trim()
  if (!fromRelPath || !toRelPath || writeBusy.value) return
  writeBusy.value = true
  writeError.value = []
  try {
    const result = await window.desk.assets.planRename(
      props.tab.knowledgeBaseId,
      fromRelPath,
      toRelPath,
      report.value?.generation
    )
    if (!result.ok) {
      previewPlan.value = null
      setWriteError(result.error)
      return
    }
    previewPlan.value = result.value
    writeError.value = classifyAssetWriteBlocks({ planReasons: result.value.blockedReasons })
  } finally {
    writeBusy.value = false
  }
}

async function openRecycle(relPaths: string[]): Promise<void> {
  if (relPaths.length === 0 || writeBusy.value) return
  writeBusy.value = true
  writeError.value = []
  previewPlan.value = null
  try {
    const result = await window.desk.assets.planRecycle(
      props.tab.knowledgeBaseId,
      relPaths,
      report.value?.generation
    )
    recycleOpen.value = true
    if (!result.ok) {
      setWriteError(result.error)
      return
    }
    previewPlan.value = result.value
    writeError.value = classifyAssetWriteBlocks({ planReasons: result.value.blockedReasons })
  } finally {
    writeBusy.value = false
  }
}

async function openMerge(): Promise<void> {
  const group = selectedMergeGroup.value
  if (!group || writeBusy.value) return
  const keepRelPath = selected.value?.relPath ?? group.relPaths[0]
  if (!keepRelPath) return
  writeBusy.value = true
  writeError.value = []
  previewPlan.value = null
  try {
    const result = await window.desk.assets.planMerge(
      props.tab.knowledgeBaseId,
      keepRelPath,
      group.relPaths.filter((relPath) => relPath !== keepRelPath),
      report.value?.generation
    )
    mergeOpen.value = true
    if (!result.ok) {
      setWriteError(result.error)
      return
    }
    previewPlan.value = result.value
    writeError.value = classifyAssetWriteBlocks({ planReasons: result.value.blockedReasons })
  } finally {
    writeBusy.value = false
  }
}

function currentOptimizeOptions(): AssetOptimizeSettings {
  const max = Number.parseInt(optimizeMax.value, 10)
  return {
    encoder: optimizeEncoder.value,
    strength: optimizeStrength.value,
    maxDimension:
      optimizeEncoder.value === 'oxipng' ? null : Number.isFinite(max) && max >= 64 ? max : null,
    outputFormat: optimizeEncoder.value === 'oxipng' ? 'keep' : optimizeFormat.value
  }
}

function openOptimize(): void {
  if (!selected.value || selected.value.kind !== 'image' || writeBusy.value) return
  const defaults = defaultOptimizeSettings()
  optimizeEncoder.value = defaults.encoder
  optimizeStrength.value = defaults.strength
  optimizeFormat.value = defaults.outputFormat
  optimizeMax.value = defaults.maxDimension ? String(defaults.maxDimension) : ''
  optimizePreview.value = null
  previewPlan.value = null
  writeError.value = []
  optimizeOpen.value = true
}

async function previewOptimize(): Promise<void> {
  const relPath = selected.value?.relPath
  if (!relPath || writeBusy.value) return
  writeBusy.value = true
  writeError.value = []
  previewPlan.value = null
  try {
    const result = await window.desk.assets.previewOptimize(
      props.tab.knowledgeBaseId,
      [relPath],
      currentOptimizeOptions(),
      report.value?.generation
    )
    if (!result.ok) {
      optimizePreview.value = null
      setWriteError(result.error)
      return
    }
    optimizePreview.value = result.value
  } finally {
    writeBusy.value = false
  }
}

async function confirmOptimize(): Promise<void> {
  const relPath = selected.value?.relPath
  if (!relPath || writeBusy.value) return
  writeBusy.value = true
  writeError.value = []
  try {
    const planned = await window.desk.assets.planOptimize(
      props.tab.knowledgeBaseId,
      [relPath],
      currentOptimizeOptions(),
      report.value?.generation
    )
    if (!planned.ok) {
      setWriteError(planned.error)
      return
    }
    previewPlan.value = planned.value
    writeError.value = classifyAssetWriteBlocks({ planReasons: planned.value.blockedReasons })
    if (planned.value.blockedReasons.length > 0) return
    const result = await window.desk.assets.apply(props.tab.knowledgeBaseId, planned.value.id)
    if (!result.ok) {
      setWriteError(result.error)
      return
    }
    if (result.value.status !== 'applied') {
      writeError.value = classifyAssetWriteBlocks({
        error: {
          message: result.value.error || '资源操作未完成',
          code: result.value.status
        }
      })
      return
    }
    const dest = planned.value.moves[0]?.toRelPath
    if (dest) selectedPath.value = dest
    closeDialogs()
    await scan(true)
    await loadHistory()
  } finally {
    writeBusy.value = false
  }
}

async function applyPreview(): Promise<void> {
  const plan = previewPlan.value
  if (!plan || plan.blockedReasons.length > 0 || writeBusy.value) return
  const dest =
    plan.kind === 'rename' || plan.kind === 'optimize' ? plan.moves[0]?.toRelPath : undefined
  const recycled =
    plan.kind === 'recycle' || plan.kind === 'merge' || plan.kind === 'optimize'
      ? plan.moves.filter((move) => !move.toRelPath).map((move) => move.fromRelPath)
      : []
  writeBusy.value = true
  writeError.value = []
  try {
    const result = await window.desk.assets.apply(props.tab.knowledgeBaseId, plan.id)
    if (!result.ok) {
      setWriteError(result.error)
      return
    }
    if (result.value.status !== 'applied') {
      writeError.value = classifyAssetWriteBlocks({
        error: {
          message: result.value.error || '资源操作未完成',
          code: result.value.status
        }
      })
      return
    }
    if (dest) selectedPath.value = dest
    else if (selectedPath.value && recycled.includes(selectedPath.value)) selectedPath.value = null
    closeDialogs()
    await scan(true)
    await loadHistory()
  } finally {
    writeBusy.value = false
  }
}

function openRestore(item: AssetJournalDto): void {
  if (!item.restorable || writeBusy.value) return
  restoreTarget.value = item
  writeError.value = []
  restoreOpen.value = true
}

async function confirmRestore(): Promise<void> {
  const item = restoreTarget.value
  if (!item || writeBusy.value) return
  writeBusy.value = true
  writeError.value = []
  try {
    const result = await window.desk.assets.restore(props.tab.knowledgeBaseId, item.planId)
    if (!result.ok) {
      setWriteError(result.error)
      return
    }
    if (result.value.status !== 'applied') {
      writeError.value = classifyAssetWriteBlocks({
        error: {
          message: result.value.error || '资源操作未完成',
          code: result.value.status
        }
      })
      return
    }
    closeDialogs()
    await scan(true)
    await loadHistory()
  } finally {
    writeBusy.value = false
  }
}

watch([optimizeEncoder, optimizeStrength, optimizeFormat, optimizeMax], () => {
  optimizePreview.value = null
  previewPlan.value = null
})

watch(renameDest, (dest) => {
  const planned = previewPlan.value
  if (planned?.kind === 'rename' && planned.moves[0]?.toRelPath !== dest.trim()) {
    previewPlan.value = null
    writeError.value = []
  }
})

watch(
  () => props.tab.knowledgeBaseId,
  () => {
    report.value = null
    selectedPath.value = null
    history.value = []
    closeDialogs()
    void scan(true)
    void loadSummaries()
    void loadHistory()
  }
)

watch(
  () => props.active,
  (active) => {
    if (active && !report.value && !loading.value) void scan(true)
    if (active && history.value.length === 0) void loadHistory()
  }
)

onMounted(() => {
  unsubscribeProgress = window.desk.assets.onScanProgress((event) => {
    if (event.knowledgeBaseId !== props.tab.knowledgeBaseId) return
    if (event.generation !== generation) return
    progress.value = event
  })
  if (props.active) {
    void scan(true)
    void loadSummaries()
    void loadHistory()
  }
})

onUnmounted(() => {
  unsubscribeProgress?.()
  if (loading.value) void window.desk.assets.cancel(props.tab.knowledgeBaseId)
})
</script>

<template>
  <div class="kb-assets-pane">
    <header class="pane-header">
      <div>
        <h2>资源 · {{ tab.knowledgeBaseName }}</h2>
        <p>盘点引用、重命名、回收与本机恢复。操作只作用于当前知识库。</p>
      </div>
      <div class="header-actions">
        <button type="button" class="ghost" :disabled="!loading" @click="cancel">取消</button>
        <button type="button" class="save-button" :disabled="loading" @click="scan(true)">
          {{ loading ? '扫描中…' : '刷新' }}
        </button>
      </div>
    </header>

    <p v-if="progress" class="status">
      扫描进度 {{ progress.done }} / {{ progress.total }}
      <span v-if="progress.current"> · {{ progress.current }}</span>
    </p>
    <p v-if="error" class="status error">{{ error }}</p>
    <p v-if="report" class="coverage" :class="{ warn: !report.coverageComplete }">
      {{ coverageMessage }}
    </p>
    <p v-if="incompleteHistory.length" class="status error">
      事务待恢复：该知识库有未完成的资源事务，请先在「历史」中恢复。未完成前不能开始新的整理。
    </p>

    <section v-if="report" class="stats">
      <span>{{ report.stats.assetCount }} 个文件</span>
      <span>{{ formatBytes(report.stats.assetBytes) }}</span>
      <span>已解析引用 {{ report.stats.determinedReferenceCount }}</span>
      <span>不确定引用 {{ report.stats.uncertainReferenceCount }}</span>
      <span>可合并重复组 {{ report.stats.mergeableDuplicateCount }}</span>
      <span>跨笔记同内容 {{ report.stats.crossNoteDuplicateCount }}</span>
    </section>

    <div class="view-tabs">
      <button type="button" :class="{ active: view === 'files' }" @click="view = 'files'">
        文件
      </button>
      <button type="button" :class="{ active: view === 'broken' }" @click="view = 'broken'">
        已确定断链
      </button>
      <button
        type="button"
        :class="{ active: view === 'diagnostics' }"
        @click="view = 'diagnostics'"
      >
        诊断
      </button>
      <button type="button" :class="{ active: view === 'history' }" @click="view = 'history'">
        历史
      </button>
    </div>

    <template v-if="view === 'files' && report">
      <div class="filters">
        <input v-model="query" type="search" placeholder="搜索路径" />
        <select v-model="kindFilter">
          <option value="all">全部类型</option>
          <option value="image">图片</option>
          <option value="gif">GIF</option>
          <option value="svg">SVG</option>
          <option value="excalidraw">Excalidraw</option>
          <option value="other">其他</option>
        </select>
        <select v-model="statusFilter">
          <option value="all">全部状态</option>
          <option value="referenced">已引用</option>
          <option value="idle-candidate">疑似闲置</option>
          <option value="uncertain-idle">闲置未确定</option>
          <option value="uncertain-affected">不确定影响</option>
          <option value="protected">受保护</option>
          <option value="duplicates">内容重复</option>
        </select>
        <select v-model="sortKey">
          <option value="path">按路径</option>
          <option value="size">按体积</option>
          <option value="refs">按引用数</option>
        </select>
        <button
          type="button"
          class="ghost"
          :disabled="writeBusy || idleCandidates.length === 0"
          @click="openRecycle(idleCandidates.map((asset) => asset.relPath))"
        >
          清理闲置候选
        </button>
      </div>
      <p class="hint">重复内容筛选随内容哈希上线；此处不按同名或同大小冒充重复。</p>
      <div class="split">
        <ul class="file-list">
          <li v-for="asset in filteredAssets" :key="asset.relPath">
            <button
              type="button"
              class="file-row"
              :class="{ selected: selectedPath === asset.relPath }"
              @click="selectedPath = asset.relPath"
            >
              <img
                v-if="canPreviewThumb(asset)"
                class="thumb"
                :src="thumbSrc(asset.relPath)"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span v-else class="thumb placeholder">{{ kindLabel(asset.kind).slice(0, 1) }}</span>
              <span class="file-meta">
                <strong>{{ asset.relPath }}</strong>
                <small>
                  {{ formatBytes(asset.size) }} · 引用 {{ asset.references.length }} ·
                  {{ statusLabel(asset.status) }}
                </small>
              </span>
            </button>
          </li>
        </ul>
        <aside v-if="selected" class="detail">
          <h3>{{ selected.relPath }}</h3>
          <p>
            {{ kindLabel(selected.kind) }} · {{ formatBytes(selected.size) }} ·
            {{ statusLabel(selected.status) }}
          </p>
          <p v-if="selected.protection.length" class="hint">
            保护原因：{{ selected.protection.map(protectionLabel).join('、') }}
          </p>
          <p class="hint">
            重命名：{{
              selected.renameAllowed ? '可生成重命名计划' : '已阻止（未知引用或覆盖未完成）'
            }}
          </p>
          <p v-if="selectedMergeGroup" class="hint">
            同笔记内容重复 {{ selectedMergeGroup.relPaths.length }} 个，可合并到当前文件。
          </p>
          <div class="detail-actions">
            <button type="button" class="save-button" :disabled="writeBusy" @click="openRename">
              重命名
            </button>
            <button
              type="button"
              class="ghost"
              :disabled="writeBusy || !selectedMergeGroup"
              @click="openMerge"
            >
              合并重复
            </button>
            <button
              type="button"
              class="ghost"
              :disabled="writeBusy || selected.kind !== 'image'"
              @click="openOptimize"
            >
              有损压缩
            </button>
            <button
              type="button"
              class="ghost"
              :disabled="writeBusy"
              @click="openRecycle([selected.relPath])"
            >
              移入回收区
            </button>
          </div>
          <h4>已识别引用</h4>
          <ul v-if="selected.references.length" class="refs">
            <li v-for="(item, index) in selected.references" :key="index">
              <code>{{ item.sourceRelPath }}:{{ item.line }}</code>
              · {{ item.syntax }}
              <button
                v-if="item.noteUuid"
                type="button"
                class="linkish"
                @click="openReference(item.sourceRelPath, item.noteUuid, item.noteTitle)"
              >
                打开笔记
              </button>
            </li>
          </ul>
          <p v-else class="hint">没有已解析的确定引用。</p>
          <p class="hint">未覆盖来源见「诊断」。部分扫描不能当成全库无引用。</p>
        </aside>
      </div>
    </template>

    <section v-else-if="view === 'broken' && report">
      <p v-if="!report.coverageComplete" class="hint warn">
        未覆盖来源的断链状态未知，不能显示「无断链」。下列仅为已解析语法中确定缺失的本地目标。
      </p>
      <ul v-if="report.brokenLinks.length" class="plain-list">
        <li v-for="(item, index) in report.brokenLinks" :key="index">
          <code>{{ item.reference.rawUrl }}</code>
          ← {{ item.reference.sourceRelPath }}:{{ item.reference.line }} ({{ item.reason }})
        </li>
      </ul>
      <p v-else class="hint">已解析范围内没有确定的本地断链。</p>
    </section>

    <section v-else-if="view === 'diagnostics' && report">
      <h3>适配器</h3>
      <ul class="plain-list">
        <li v-for="adapter in report.adapters" :key="adapter.id">
          <strong>{{ adapter.id }}</strong>
          · {{ adapter.status }} · {{ adapter.detail }}
        </li>
      </ul>
      <h3>诊断</h3>
      <ul v-if="report.diagnostics.length" class="plain-list">
        <li v-for="(item, index) in report.diagnostics" :key="index">
          {{ item.code }} · {{ item.message }}
        </li>
      </ul>
      <p v-else class="hint">没有诊断项。</p>
    </section>

    <section v-else-if="view === 'history'" class="history">
      <p class="hint">恢复记录保存在本机 userData，不随知识库移动。恢复拒绝覆盖后来编辑的文件。</p>
      <ul v-if="history.length" class="plain-list">
        <li v-for="item in history" :key="item.planId" class="history-row">
          <div>
            <strong>{{ planKindLabel(item.kind) }}</strong>
            · {{ stageLabel(item.stage) }} · {{ formatTime(item.createdAt) }}
            <p class="hint">
              {{ item.moves.map(moveLabel).join('、') || '无路径变更' }}
              · {{ item.estimated.filesTouched }} 个文件 ·
              {{ formatBytes(item.estimated.bytesMoved) }}
            </p>
          </div>
          <button
            v-if="item.restorable"
            type="button"
            class="ghost"
            :disabled="writeBusy"
            @click="openRestore(item)"
          >
            {{ item.stage === 'applied' ? '恢复' : '处理未完成事务' }}
          </button>
          <span v-else class="hint">已恢复</span>
        </li>
      </ul>
      <p v-else class="hint">还没有可恢复的整理记录。</p>
    </section>

    <section class="others">
      <h3>已管理知识库</h3>
      <p class="hint">只读汇总，点击可打开对应资源面板。不会跨库改文件。</p>
      <ul class="plain-list">
        <li v-for="item in summaries" :key="item.knowledgeBaseId">
          <button
            type="button"
            class="linkish"
            :disabled="item.knowledgeBaseId === tab.knowledgeBaseId"
            @click="openOtherKb(item.knowledgeBaseId)"
          >
            {{ item.displayName }}
          </button>
          · {{ item.fileCount }} 个文件 · {{ formatBytes(item.bytes) }}
        </li>
      </ul>
    </section>

    <div
      v-if="renameOpen"
      class="dialog-backdrop"
      @mousedown.self="writeBusy ? undefined : closeDialogs()"
    >
      <form
        class="kb-assets-dialog dialog"
        @submit.prevent="previewPlan ? applyPreview() : previewRename()"
      >
        <header>
          <strong>重命名资源</strong>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            关闭
          </button>
        </header>
        <p class="hint">原路径 {{ selected?.relPath }}</p>
        <label>
          新路径
          <input v-model="renameDest" class="rename-dest" :disabled="writeBusy" />
        </label>
        <div v-if="previewPlan" class="preview">
          <p>
            将改动 {{ previewPlan.estimated.filesTouched }} 个文件，移动
            {{ formatBytes(previewPlan.estimated.bytesMoved) }}。
          </p>
          <ul class="plain-list">
            <li v-for="(move, index) in previewPlan.moves" :key="index">{{ moveLabel(move) }}</li>
          </ul>
          <p v-if="previewPlan.sourceRelPaths.length" class="hint">
            引用补丁：{{ previewPlan.sourceRelPaths.join('、') }}
          </p>
        </div>
        <ul v-if="previewBlocks.length" class="blocked">
          <li v-for="(item, index) in previewBlocks" :key="index">
            <strong>{{ item.label }}</strong>
            · {{ item.message }}
          </li>
        </ul>
        <footer>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            取消
          </button>
          <button
            v-if="!previewPlan"
            type="submit"
            class="save-button"
            :disabled="writeBusy || !renameDest.trim()"
          >
            预览
          </button>
          <button v-else type="submit" class="save-button" :disabled="!canApplyPreview">
            执行
          </button>
        </footer>
      </form>
    </div>

    <div
      v-if="recycleOpen"
      class="dialog-backdrop"
      @mousedown.self="writeBusy ? undefined : closeDialogs()"
    >
      <section class="kb-assets-dialog dialog">
        <header>
          <strong>移入回收区</strong>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            关闭
          </button>
        </header>
        <p class="hint">仅本机可恢复，不永久删除。默认只处理闲置候选。</p>
        <div v-if="previewPlan" class="preview">
          <p>
            将移动 {{ previewPlan.estimated.filesTouched }} 个文件，
            {{ formatBytes(previewPlan.estimated.bytesMoved) }}。
          </p>
          <ul class="plain-list">
            <li v-for="(move, index) in previewPlan.moves" :key="index">{{ moveLabel(move) }}</li>
          </ul>
        </div>
        <ul v-if="previewBlocks.length" class="blocked">
          <li v-for="(item, index) in previewBlocks" :key="index">
            <strong>{{ item.label }}</strong>
            · {{ item.message }}
          </li>
        </ul>
        <footer>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            取消
          </button>
          <button
            type="button"
            class="save-button"
            :disabled="!canApplyPreview"
            @click="applyPreview"
          >
            执行
          </button>
        </footer>
      </section>
    </div>

    <div
      v-if="mergeOpen"
      class="dialog-backdrop"
      @mousedown.self="writeBusy ? undefined : closeDialogs()"
    >
      <section class="kb-assets-dialog dialog">
        <header>
          <strong>合并同笔记重复</strong>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            关闭
          </button>
        </header>
        <p class="hint">只合并同一笔记归属、相同字节的文件。跨笔记同内容只统计，不合并。</p>
        <div v-if="previewPlan" class="preview">
          <p>
            将更新 {{ previewPlan.estimated.filesTouched }} 处，回收
            {{ formatBytes(previewPlan.estimated.bytesMoved) }}。
          </p>
          <ul class="plain-list">
            <li v-for="(move, index) in previewPlan.moves" :key="index">{{ moveLabel(move) }}</li>
          </ul>
        </div>
        <ul v-if="previewBlocks.length" class="blocked">
          <li v-for="(item, index) in previewBlocks" :key="index">
            <strong>{{ item.label }}</strong>
            · {{ item.message }}
          </li>
        </ul>
        <footer>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            取消
          </button>
          <button
            type="button"
            class="save-button"
            :disabled="!canApplyPreview"
            @click="applyPreview"
          >
            执行
          </button>
        </footer>
      </section>
    </div>

    <div
      v-if="optimizeOpen"
      class="dialog-backdrop"
      @mousedown.self="writeBusy ? undefined : closeDialogs()"
    >
      <section class="kb-assets-dialog dialog">
        <header>
          <strong>{{
            optimizeEncoder === 'oxipng' ? '无损优化（oxipng）' : '有损压缩（sharp）'
          }}</strong>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            关闭
          </button>
        </header>
        <p class="hint">
          <template v-if="optimizeEncoder === 'oxipng'">
            无损重压 PNG，更小但较慢（秒级）；仅支持 PNG，不做格式转换与缩放。
          </template>
          <template v-else>
            优先速度和体积，结果是有损的。默认不缩放；转 WebP/JPEG 会改扩展名并改写引用。
          </template>
        </p>
        <fieldset class="field-grid" :disabled="writeBusy" style="border: 0; padding: 0; margin: 0">
          <label class="field">
            <span>编码器</span>
            <select v-model="optimizeEncoder">
              <option value="sharp">sharp（有损，快）</option>
              <option value="oxipng">oxipng（无损，慢）</option>
            </select>
          </label>
          <label class="field">
            <span>压缩强度</span>
            <select v-model="optimizeStrength">
              <option value="low">低 · 少压，偏清晰</option>
              <option value="medium">中 · 均衡（默认）</option>
              <option value="high">高 · 多压，偏体积</option>
            </select>
          </label>
          <template v-if="optimizeEncoder !== 'oxipng'">
            <label class="field">
              <span>输出格式</span>
              <select v-model="optimizeFormat">
                <option value="keep">保持原格式（同路径）</option>
                <option value="webp">转为 WebP（通常更小）</option>
                <option value="jpeg">转为 JPEG</option>
              </select>
            </label>
            <label class="field">
              <span>最大边（可选）</span>
              <input v-model="optimizeMax" type="number" min="64" placeholder="不缩放" />
            </label>
          </template>
        </fieldset>
        <div v-if="optimizePreview" class="preview">
          <p>
            {{ formatBytes(optimizePreview.bytesBefore) }} →
            {{ formatBytes(optimizePreview.bytesAfter) }}
            · 跳过 {{ optimizePreview.skippedCount }}
          </p>
          <ul class="plain-list">
            <li v-for="(item, index) in optimizePreview.items" :key="index">
              <template v-if="item.skipped">{{ item.fromRelPath }} · {{ item.skipped }}</template>
              <template v-else>
                {{ item.fromRelPath }}
                <span v-if="item.toRelPath !== item.fromRelPath"> → {{ item.toRelPath }}</span>
                · {{ formatBytes(item.bytesBefore) }} → {{ formatBytes(item.bytesAfter ?? 0) }} ·
                {{ item.ms }}ms · {{ item.lossy ? '有损' : '无损' }}
              </template>
            </li>
          </ul>
          <img
            v-if="optimizePreview.items[0]?.previewDataUrl"
            class="optimize-preview"
            :src="optimizePreview.items[0].previewDataUrl"
            alt="优化预览"
          />
        </div>
        <ul v-if="previewBlocks.length" class="blocked">
          <li v-for="(item, index) in previewBlocks" :key="index">
            <strong>{{ item.label }}</strong>
            · {{ item.message }}
          </li>
        </ul>
        <footer>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            取消
          </button>
          <button type="button" class="ghost" :disabled="writeBusy" @click="previewOptimize">
            预览
          </button>
          <button
            type="button"
            class="save-button"
            :disabled="
              writeBusy ||
              !optimizePreview ||
              optimizePreview.skippedCount === optimizePreview.items.length
            "
            @click="confirmOptimize"
          >
            执行{{ optimizeEncoder === 'oxipng' ? '无损优化' : '有损压缩' }}
          </button>
        </footer>
      </section>
    </div>

    <div
      v-if="restoreOpen && restoreTarget"
      class="dialog-backdrop"
      @mousedown.self="writeBusy ? undefined : closeDialogs()"
    >
      <section class="kb-assets-dialog dialog">
        <header>
          <strong>恢复资源操作</strong>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            关闭
          </button>
        </header>
        <p>
          {{ planKindLabel(restoreTarget.kind) }} · {{ stageLabel(restoreTarget.stage) }} ·
          {{ formatTime(restoreTarget.createdAt) }}
        </p>
        <ul class="plain-list">
          <li v-for="(move, index) in restoreTarget.moves" :key="index">{{ moveLabel(move) }}</li>
        </ul>
        <p class="hint">若原路径或引用源已被后来编辑，恢复会拒绝覆盖并保留备份。</p>
        <ul v-if="writeError.length" class="blocked">
          <li v-for="(item, index) in writeError" :key="index">
            <strong>{{ item.label }}</strong>
            · {{ item.message }}
          </li>
        </ul>
        <footer>
          <button type="button" class="ghost" :disabled="writeBusy" @click="closeDialogs">
            取消
          </button>
          <button type="button" class="save-button" :disabled="writeBusy" @click="confirmRestore">
            恢复
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>

<style src="../components/settings/settingsShared.css" scoped></style>

<style scoped>
.kb-assets-pane {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px 28px 40px;
  box-sizing: border-box;
}

.pane-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.pane-header h2 {
  margin: 0 0 4px;
  font-size: 18px;
}

.pane-header p,
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.header-actions,
.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.save-button,
.ghost {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}

.save-button {
  border: 0;
  background: var(--accent);
  color: #fff;
}

.ghost {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}

.save-button:disabled,
.ghost:disabled,
.linkish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  color: var(--muted);
}

.status.error,
.hint.warn,
.coverage.warn {
  color: #b58900;
}

.status.error {
  color: #c44;
}

.coverage,
.stats,
.filters,
.view-tabs,
.others,
.history {
  margin: 12px 0;
}

.stats,
.filters,
.view-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.view-tabs button {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  border-radius: 7px;
  padding: 6px 10px;
  cursor: pointer;
}

.view-tabs button.active {
  border-color: var(--accent);
}

.filters input,
.filters select {
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--input-bg);
  color: var(--text);
  padding: 0 8px;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr);
  gap: 16px;
  align-items: start;
}

.file-list,
.plain-list,
.refs {
  list-style: none;
  margin: 0;
  padding: 0;
}

.file-row {
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  padding: 6px;
  cursor: pointer;
}

.file-row.selected,
.file-row:hover {
  border-color: var(--border);
  background: var(--hover, color-mix(in srgb, var(--text) 6%, transparent));
}

.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--panel);
  flex: none;
}

.thumb.placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--muted);
}

.file-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-meta strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  background: var(--panel);
}

.detail h3,
.detail h4,
.others h3 {
  margin: 0 0 8px;
}

.linkish {
  border: 0;
  background: none;
  color: var(--accent);
  cursor: pointer;
  padding: 0;
}

.plain-list li,
.refs li {
  margin: 6px 0;
  font-size: 13px;
}

.history-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #000 35%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.kb-assets-dialog {
  width: min(520px, calc(100vw - 32px));
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel);
  color: var(--text);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kb-assets-dialog header,
.kb-assets-dialog footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.kb-assets-dialog label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.kb-assets-dialog input {
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--input-bg);
  color: var(--text);
  padding: 0 8px;
}

.blocked {
  list-style: none;
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, #c44 10%, transparent);
  color: #c44;
  font-size: 13px;
}

.preview {
  font-size: 13px;
}

.optimize-preview {
  display: block;
  max-width: 100%;
  max-height: 240px;
  margin-top: 8px;
  border-radius: 8px;
  background: var(--input-bg);
}

.field-grid {
  display: grid;
  gap: 10px;
  margin: 12px 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}
</style>
