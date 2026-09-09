<script setup lang="ts">
import { computed, ref } from 'vue'

import KnowledgeBaseIcon from './KnowledgeBaseIcon.vue'
import UiTooltip from './UiTooltip.vue'
import { useEditorStore, KNOWLEDGE_SIDEBAR_COMPACT } from '../stores/editor'
import { useWorkspaceStore } from '../stores/workspace'

import type {
  KnowledgeBaseDescriptor,
  KnowledgeSidebarMenuAction
} from '../../../shared/contracts'

const emit = defineEmits<{
  'create-knowledge-base': []
}>()

const store = useWorkspaceStore()
const editor = useEditorStore()
const query = ref('')
const menuBusy = ref(false)
const compact = computed(() => editor.knowledgeSidebarWidth <= KNOWLEDGE_SIDEBAR_COMPACT)

function showIdeMenu(knowledgeBaseId: string): void {
  void window.desk.ide.showKnowledgeBaseMenu(knowledgeBaseId)
}

function matchesKb(item: KnowledgeBaseDescriptor, needle: string): boolean {
  if (!needle) return true
  const haystacks = [item.displayName, item.name, item.configName ?? '', item.rootPath]
  return haystacks.some((value) => value.toLocaleLowerCase().includes(needle))
}

const filteredKnowledgeBases = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase()
  return store.overview.knowledgeBases.filter((item) => matchesKb(item, needle))
})

const emptyMessage = computed(() => {
  if (store.overview.knowledgeBases.length === 0) {
    return {
      title: '没有扫描到知识库',
      detail: '工作区根或其直接子目录中需要存在 tnotes.json'
    }
  }
  return {
    title: '没有匹配的知识库',
    detail: '试试其它名称关键字'
  }
})

async function applyMenuAction(action: KnowledgeSidebarMenuAction): Promise<void> {
  if (action === 'create') {
    emit('create-knowledge-base')
    return
  }
  if (action === 'refresh') {
    await store.refreshWorkspace()
    return
  }
  if (action === 'choose-workspace') {
    await store.chooseWorkspace()
    return
  }
  try {
    const result = await window.desk.workspace.reveal()
    if (!result.ok) store.error = result.error.message
  } catch (cause) {
    store.error = cause instanceof Error ? cause.message : String(cause)
  }
}

async function openHeaderMenu(): Promise<void> {
  if (menuBusy.value || store.loading) return
  menuBusy.value = true
  try {
    const result = await window.desk.app.showKnowledgeSidebarMenu({
      hasWorkspace: Boolean(store.overview.path),
      loading: store.loading
    })
    if (!result.ok) {
      store.error = result.error.message
      return
    }
    if (result.value) await applyMenuAction(result.value)
  } catch (cause) {
    store.error = cause instanceof Error ? cause.message : String(cause)
  } finally {
    menuBusy.value = false
  }
}
</script>

<template>
  <aside class="knowledge-sidebar" :class="{ compact }">
    <div class="knowledge-top">
      <div v-if="!compact" class="search-wrap">
        <span>⌕</span>
        <input v-model="query" type="search" placeholder="搜索知识库" />
      </div>
      <div class="header-actions">
        <UiTooltip label="更多知识库操作">
          <button
            type="button"
            class="menu-button"
            aria-label="更多知识库操作"
            :disabled="store.loading || menuBusy"
            @click="openHeaderMenu"
          >
            ⋯
          </button>
        </UiTooltip>
      </div>
    </div>

    <div v-if="filteredKnowledgeBases.length" class="knowledge-list">
      <button
        v-for="item in filteredKnowledgeBases"
        :key="item.id"
        type="button"
        class="knowledge-item"
        :class="{ active: store.selectedKnowledgeBaseId === item.id }"
        @click="store.selectKnowledgeBase(item.id)"
        @contextmenu.prevent="showIdeMenu(item.id)"
      >
        <span class="knowledge-icon">
          <KnowledgeBaseIcon :icon="item.icon" :fallback="item.displayName" />
        </span>
        <span v-if="!compact" class="knowledge-copy">
          <strong>{{ item.displayName }}</strong>
        </span>
      </button>
    </div>
    <div v-else class="column-empty">
      <strong>{{ emptyMessage.title }}</strong>
      <span>{{ emptyMessage.detail }}</span>
    </div>

    <footer class="workspace-footer" :title="store.overview.path ?? ''">
      <span v-if="!compact">{{ store.overview.path ?? '尚未选择工作区' }}</span>
    </footer>
  </aside>
</template>

<style scoped>
.knowledge-sidebar {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
}

.knowledge-top {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border-bottom: 1px solid var(--border);
}

.search-wrap {
  height: auto;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--input-bg);
  color: var(--muted);
}

.search-wrap > span {
  flex: none;
  font-size: 13px;
}

.search-wrap input {
  flex: 1;
  min-width: 0;
  height: 26px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 11px;
}

.search-wrap input:focus {
  outline: none;
}

.header-actions {
  flex: none;
  position: relative;
  display: flex;
  gap: 6px;
}

.menu-button {
  height: 28px;
  width: 28px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--raised);
  color: var(--text);
  cursor: pointer;
  font-size: 18px;
  line-height: 20px;
}

.menu-button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.menu-button:disabled {
  opacity: 0.4;
}

.knowledge-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 7px;
}

.knowledge-item {
  width: 100%;
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 7px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  padding: 2px 5px;
  text-align: left;
  cursor: pointer;
}

.knowledge-item:hover {
  background: var(--hover);
}

.knowledge-item.active {
  background: var(--selected);
}

.knowledge-icon {
  width: 20px;
  height: 20px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 5px;
  overflow: hidden;
  background: var(--raised);
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
}

.knowledge-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.knowledge-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
}

.knowledge-sidebar.compact .knowledge-top {
  justify-content: center;
}

.knowledge-sidebar.compact .knowledge-item {
  justify-content: center;
  gap: 0;
}

.column-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 20px;
  text-align: center;
  color: var(--muted);
  font-size: 11px;
}

.column-empty strong {
  color: var(--text);
  font-size: 12px;
}

.workspace-footer {
  height: 36px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px 0 14px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 10px;
}

.workspace-footer > span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
