<script setup lang="ts">
/**
 * 恢复影响范围确认（计划 H4）。
 *
 * - 打开时先受控 flush（画布 settle → 保存笔记），再把写者快照交给主进程建计划
 * - 计划由主进程验证并固化：正文写当前路径、历史资源、保留的较新资源、备份说明、
 *   限制项；渲染端只拿到计划 ID 与影响范围
 * - **写回在 H5 开放**：这里的确认按钮保持禁用并说明原因，H4 只做「看清楚要改什么」
 */
import { onMounted, ref } from 'vue'

import { HistoryFlushError } from '../history/flushWriters'
import { pushToast } from '../stores/toast'
import { useWorkspaceStore } from '../stores/workspace'

import type { HistoryRestorePlanDto, NoteHistoryEditorTab } from '../../../shared/contracts'

const props = defineProps<{
  tab: NoteHistoryEditorTab
  commit: string
  /** 历史列表拿到的 HEAD；与主进程不一致时主进程会拒绝 */
  expectedHead?: string
}>()

const emit = defineEmits<{ close: [] }>()

const workspace = useWorkspaceStore()
const loading = ref(true)
const applying = ref(false)
const error = ref('')
const plan = ref<HistoryRestorePlanDto | null>(null)
const result = ref<{ restoreCommit: string | null; backupCommit: string | null } | null>(null)

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

async function loadPlan(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    // 受控 flush：拿到「最后一笔」之后再让主进程验证并固化
    const writers = await workspace.flushForHistoryRestore(props.tab.knowledgeBaseId)
    const result = await window.desk.history.plan({
      knowledgeBaseId: props.tab.knowledgeBaseId,
      noteIndex: props.tab.noteIndex,
      commit: props.commit,
      expectedHead: props.expectedHead,
      writers
    })
    if (!result.ok) {
      error.value = result.error.message
      return
    }
    plan.value = result.value
  } catch (cause) {
    error.value =
      cause instanceof HistoryFlushError
        ? cause.message
        : cause instanceof Error
          ? cause.message
          : String(cause)
  } finally {
    loading.value = false
  }
}

/**
 * 确认恢复：只把计划 ID + revision 交给主进程，写回/提交/回滚全在主进程完成。
 * 成功后让所有编辑会话重新读盘，避免旧缓存 autosave 覆盖恢复结果。
 */
async function confirmRestore(): Promise<void> {
  if (!plan.value || applying.value) return
  applying.value = true
  error.value = ''
  try {
    const applied = await window.desk.history.apply({
      planId: plan.value.planId,
      revision: plan.value.revision
    })
    if (!applied.ok) {
      error.value = applied.error.message
      return
    }
    result.value = {
      restoreCommit: applied.value.restoreCommit,
      backupCommit: applied.value.backupCommit
    }
    // 失效旧编辑会话：笔记按 uuid 重新读盘；画布会话由主进程的资源变更事件处理
    const noteUuid = props.tab.noteUuid
    if (noteUuid) await workspace.reloadNoteFromDisk(props.tab.knowledgeBaseId, noteUuid)
    pushToast(
      `已恢复到 ${props.commit.slice(0, 7)}：${applied.value.writtenPaths.length} 个文件` +
        (applied.value.restoreCommit
          ? `，恢复提交 ${applied.value.restoreCommit.slice(0, 7)}`
          : ''),
      'success'
    )
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    applying.value = false
  }
}

onMounted(() => void loadPlan())
</script>

<template>
  <div class="history-restore" data-history-restore-dialog>
    <header class="history-restore__header">
      <strong>恢复影响范围 · {{ tab.noteIndex }}</strong>
      <button
        type="button"
        class="history-restore__close"
        data-history-restore-close
        @click="emit('close')"
      >
        ×
      </button>
    </header>

    <p v-if="loading" class="history-restore__status" data-history-restore-loading>
      正在收集未保存内容并验证历史快照…
    </p>
    <p v-else-if="error" class="history-restore__status is-error" data-history-restore-error>
      {{ error }}
    </p>
    <template v-else-if="plan">
      <dl class="history-restore__facts" data-history-restore-facts>
        <dt>恢复正文</dt>
        <dd data-history-restore-note>{{ plan.note.relPath }}</dd>
        <dt>历史资源</dt>
        <dd data-history-restore-resources>
          {{ plan.resources.length }} 个<template v-if="plan.resources.length">
            ：{{ plan.resources.map((item) => item.relPath).join('、') }}</template
          >
        </dd>
        <dt>保留的较新资源</dt>
        <dd data-history-restore-preserved>
          {{ plan.preserved.length }} 个<template v-if="plan.preserved.length">
            ：{{ plan.preserved.map((item) => item.relPath).join('、') }}</template
          >
        </dd>
        <dt>写入规模</dt>
        <dd data-history-restore-size>
          {{ plan.writeCount }} 个文件 / {{ formatBytes(plan.totalBytes) }}
        </dd>
        <dt>备份提交</dt>
        <dd data-history-restore-backup>
          {{ plan.backupRequired ? plan.backupMessage : '无需备份提交' }}
        </dd>
      </dl>

      <ul
        v-if="plan.limitations.length"
        class="history-restore__limits"
        data-history-restore-limits
      >
        <li v-for="(item, index) in plan.limitations" :key="index">{{ item.message }}</li>
      </ul>

      <p v-if="result" class="history-restore__done" data-history-restore-done>
        恢复完成：写入 {{ plan.writeCount }} 个文件<template v-if="result.backupCommit">
          ，备份提交 {{ result.backupCommit.slice(0, 7) }}</template
        ><template v-if="result.restoreCommit">
          ，恢复提交 {{ result.restoreCommit.slice(0, 7) }}</template
        >。
      </p>
      <footer class="history-restore__actions">
        <button type="button" data-history-restore-cancel @click="emit('close')">
          {{ result ? '关闭' : '取消' }}
        </button>
        <button
          type="button"
          class="history-restore__confirm"
          data-history-restore-confirm
          :disabled="applying || Boolean(result)"
          @click="confirmRestore"
        >
          {{ applying ? '正在恢复…' : '确认恢复' }}
        </button>
        <span class="history-restore__hint" data-history-restore-hint>
          恢复会先为相关未提交改动生成备份提交，再按历史字节写回并生成一个恢复提交；TOC
          与其它笔记不动。
        </span>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.history-restore {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--tn-border, #e5e7eb);
  border-radius: 8px;
  background: var(--tn-surface, #fff);
  margin: 12px 16px;
  padding: 12px 16px;
}

.history-restore__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.history-restore__close {
  border: none;
  background: transparent;
  color: var(--tn-text-muted, #6b7280);
  cursor: pointer;
  font-size: 14px;
}

.history-restore__status {
  margin: 0;
  color: var(--tn-text-muted, #6b7280);
  font-size: 12px;
}

.history-restore__status.is-error {
  color: var(--tn-danger, #dc2626);
}

.history-restore__facts {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 4px 12px;
  margin: 0;
  font-size: 12px;
}

.history-restore__facts dt {
  color: var(--tn-text-muted, #6b7280);
}

.history-restore__facts dd {
  margin: 0;
  word-break: break-all;
}

.history-restore__limits {
  margin: 0;
  padding-left: 20px;
  color: var(--tn-text-muted, #6b7280);
  font-size: 12px;
}

.history-restore__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-restore__confirm:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.history-restore__done {
  margin: 0;
  color: var(--tn-success, #15803d);
  font-size: 12px;
}

.history-restore__done {
  margin: 0;
  color: var(--vn-success, #15803d);
  font-size: 12px;
}

.history-restore__hint {
  color: var(--tn-text-muted, #6b7280);
  font-size: 11px;
}
</style>
