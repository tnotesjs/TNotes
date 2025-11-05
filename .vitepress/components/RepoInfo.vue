<template>
  <div class="repo-info">
    <div class="repo-header">
      <h2 title="知识库的在线访问链接">
        <a :href="item.link" target="_blank">TNotes.{{ item.title }}</a>
      </h2>
      <p class="repo-details">{{ item.details }}</p>
    </div>

    <div class="repo-actions">
      <a
        v-if="tnotesDir"
        title="打开知识库文件夹"
        target="_blank"
        :href="vsCodeLink"
      >
        <img :src="icon__vscode" alt="VS Code" class="repo-action-icon" />
      </a>

      <a title="打开知识库仓库" target="_blank" :href="githubLink">
        <img :src="icon__github" alt="GitHub" class="repo-action-icon" />
      </a>

      <img
        :title="allCollapsed ? '全部展开' : '全部折叠'"
        :src="icon__fold"
        alt="Fold"
        class="repo-action-icon"
        @click="$emit('toggle-all')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RootItem } from './composables/useNavigator'
import icon__fold from './icon__fold.svg'
import icon__github from './icon__github.svg'
import icon__vscode from './icon__vscode.svg'
import { buildGitHubLink, buildVSCodeLink } from './utils/helpers'

const props = defineProps<{
  item: RootItem
  tnotesDir: string
  allCollapsed: boolean
}>()

defineEmits<{
  'toggle-all': []
}>()

const vsCodeLink = computed(() =>
  buildVSCodeLink(props.tnotesDir, props.item.title)
)
const githubLink = computed(() => buildGitHubLink(props.item.title))
</script>

<style scoped>
.repo-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 0;
  background-color: var(--vp-c-bg);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.repo-header {
  flex: 1;
}

.repo-header h2 {
  margin-top: 0;
  margin-bottom: 10px;
  padding-top: 0px;
  border-top: none;
}

.repo-header h2 a {
  text-decoration: none;
}

.repo-header h2 a:hover {
  text-decoration: underline !important;
}

.repo-details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.repo-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  margin-top: 4px;
}

.repo-action-icon {
  width: 1.2rem;
  height: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
}

.repo-action-icon:hover {
  opacity: 1;
}
</style>
