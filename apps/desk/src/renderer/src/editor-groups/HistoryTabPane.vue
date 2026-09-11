<script setup lang="ts">
/**
 * 笔记历史标签页（计划 H2/H3）。
 *
 * - 左侧列出该编号相关的历史提交（H1 IPC），右侧是只读预览（H2）
 * - 恢复按钮在 H4/H5 门禁通过前禁用并给出原因：现在只支持浏览
 * - 任何操作都不写文件：切版本只改本标签页选中的 commit
 */
import { computed, onMounted, ref } from 'vue'

import HistoryNotePreview from '../history/HistoryNotePreview.vue'
import { useEditorStore } from '../stores/editor'

import type {
  HistoryCommitSummaryDto,
  HistoryListResultDto,
  NoteHistoryEditorTab as NoteHistoryTab
} from '../../../shared/contracts'

const props = defineProps<{ tab: NoteHistoryTab; active: boolean; groupId: string }>()

const editor = useEditorStore()
const loading = ref(false)
const error = ref('')
const commits = ref<HistoryCommitSummaryDto[]>([])
const head = ref('')
const hasMore = ref(false)
const skipped = ref(0)
const PAGE_SIZE = 50

const selectedCommit = computed(() => props.tab.commit)

function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000)
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

async function loadPage(reset: boolean): Promise<void> {
  loading.value = true
  error.value = ''
  if (reset) {
    skipped.value = 0
    commits.value = []
  }
  try {
    const result = await window.desk.history.list({
      knowledgeBaseId: props.tab.knowledgeBaseId,
      noteIndex: props.tab.noteIndex,
      skip: skipped.value,
      limit: PAGE_SIZE
    })
    if (!result.ok) {
      error.value = result.error.message
      return
    }
    const value: HistoryListResultDto = result.value
    head.value = value.head
    commits.value = reset ? value.commits : [...commits.value, ...value.commits]
    hasMore.value = value.hasMore
    skipped.value = commits.value.length
    // 打开时定位到最新相关提交；切换 commit 只更新本页选中版本
    if (reset && !selectedCommit.value && value.commits[0]) {
      editor.selectHistoryCommit(props.tab.id, value.commits[0].oid)
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    loading.value = false
  }
}

function select(commit: HistoryCommitSummaryDto): void {
  editor.selectHistoryCommit(props.tab.id, commit.oid)
}

onMounted(() => void loadPage(true))
</script>

<template>
  <div class="history-pane" data-note-history-pane>
    <aside class="history-pane__list">
      <header class="history-pane__list-header">
        <strong>历史版本 · {{ tab.noteIndex }}</strong>
        <span v-if="head" class="history-pane__head" data-history-head>{{ head.slice(0, 7) }}</span>
      </header>
      <p v-if="loading && commits.length === 0" class="history-pane__status">正在读取历史…</p>
      <p v-else-if="error" class="history-pane__status is-error" data-history-list-error>
        {{ error }}
      </p>
      <p v-else-if="commits.length === 0" class="history-pane__status" data-history-empty>
        该笔记还没有历史提交
      </p>
      <ul v-else class="history-pane__commits" data-history-commits>
        <li v-for="commit in commits" :key="commit.oid">
          <button
            type="button"
            class="history-pane__commit"
            :class="{ 'is-active': commit.oid === selectedCommit }"
            :data-commit="commit.oid"
            @click="select(commit)"
          >
            <span class="history-pane__commit-subject">{{ commit.subject }}</span>
            <span class="history-pane__commit-meta">
              {{ commit.shortOid }} · {{ formatTime(commit.committedAt) }}
              <template v-if="commit.touchesIndex"> · 含本体/资源</template>
              <template v-if="commit.isMerge"> · 合并</template>
            </span>
          </button>
        </li>
      </ul>
      <button
        v-if="hasMore"
        type="button"
        class="history-pane__more"
        data-history-more
        :disabled="loading"
        @click="loadPage(false)"
      >
        {{ loading ? '加载中…' : '加载更多' }}
      </button>
    </aside>

    <div class="history-pane__preview">
      <HistoryNotePreview
        v-if="selectedCommit"
        :key="selectedCommit"
        :knowledge-base-id="tab.knowledgeBaseId"
        :note-index="tab.noteIndex"
        :note-uuid="tab.noteUuid"
        :commit="selectedCommit"
      />
      <div v-else class="history-pane__placeholder" data-history-no-selection>
        <strong>选择一个历史版本</strong>
        <span>左侧列表按时间列出与编号 {{ tab.noteIndex }} 相关的提交。</span>
      </div>
      <footer class="history-pane__actions">
        <button type="button" class="history-pane__restore" disabled title="恢复功能尚未开放">
          恢复到该版本
        </button>
        <span class="history-pane__hint">恢复需要备份与事务日志（计划 H4/H5），当前只能浏览。</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.history-pane {
  display: grid;
  grid-template-columns: minmax(220px, 300px) 1fr;
  min-height: 0;
  height: 100%;
}

.history-pane__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  overflow: auto;
  border-right: 1px solid var(--tn-border, #e5e7eb);
  padding: 8px;
}

.history-pane__list-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.history-pane__head {
  color: var(--tn-text-muted, #6b7280);
  font-size: 11px;
}

.history-pane__status {
  margin: 4px 0;
  color: var(--tn-text-muted, #6b7280);
  font-size: 12px;
}

.history-pane__status.is-error {
  color: var(--tn-danger, #dc2626);
}

.history-pane__commits {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.history-pane__commit {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  border: none;
  border-radius: 6px;
  background: transparent;
  padding: 6px 8px;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.history-pane__commit:hover {
  background: var(--tn-surface-muted, #f3f4f6);
}

.history-pane__commit.is-active {
  background: var(--tn-surface-active, #e0e7ff);
}

.history-pane__commit-subject {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-pane__commit-meta {
  color: var(--tn-text-muted, #6b7280);
  font-size: 11px;
}

.history-pane__preview {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.history-pane__placeholder {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--tn-text-muted, #6b7280);
  font-size: 13px;
}

.history-pane__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid var(--tn-border, #e5e7eb);
  padding: 8px 16px;
}

.history-pane__restore:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.history-pane__hint {
  color: var(--tn-text-muted, #6b7280);
  font-size: 11px;
}
</style>
