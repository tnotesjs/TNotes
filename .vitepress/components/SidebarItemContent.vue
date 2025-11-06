<template>
  <div class="section-item">
    <!-- 第一级 -->
    <div class="level-1">
      <a :href="item.link" target="_blank" class="item-link">{{ item.text }}</a>
      <a
        v-if="item.link && tnotesDir"
        title="打开笔记文件夹"
        :href="buildVSCodeLink(tnotesDir, '', item.link)"
        target="_blank"
      >
        <img :src="icon__vscode" alt="VS Code" class="repo-action-icon" />
      </a>
    </div>

    <!-- 第二级 -->
    <div v-if="item.items?.length" class="level-2-container">
      <div
        v-for="(subItem, subIndex) in item.items"
        :key="subIndex"
        class="level-2"
      >
        <div class="level-2-content">
          <a :href="subItem.link" target="_blank" class="item-link">{{
            subItem.text
          }}</a>
          <a
            v-if="subItem.link && tnotesDir"
            title="打开笔记文件夹"
            :href="buildVSCodeLink(tnotesDir, '', subItem.link)"
            target="_blank"
          >
            <img :src="icon__vscode" alt="VS Code" class="repo-action-icon" />
          </a>
        </div>

        <!-- 第三级 -->
        <div v-if="subItem.items?.length" class="level-3-container">
          <div
            v-for="(subSubItem, subSubIndex) in subItem.items"
            :key="subSubIndex"
            class="level-3"
          >
            <div class="level-3-content">
              <a :href="subSubItem.link" class="item-link" target="_blank">{{
                subSubItem.text
              }}</a>
              <a
                v-if="subSubItem.link && tnotesDir"
                title="打开笔记文件夹"
                :href="buildVSCodeLink(tnotesDir, '', subSubItem.link)"
                target="_blank"
              >
                <img
                  :src="icon__vscode"
                  alt="VS Code"
                  class="repo-action-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildVSCodeLink } from './utils/helpers'
import icon__vscode from '/icon__vscode.svg'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
}

defineProps<{
  item: SidebarItem
  tnotesDir: string
}>()
</script>

<style scoped>
.section-item {
  padding: 8px 15px 8px 35px;
}

.level-1,
.level-2-content,
.level-3-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 5px 0;
}

.level-1 {
  padding: 0;
  margin-bottom: 5px;
}

.level-2 {
  padding: 5px 0;
}

.level-3 {
  padding: 5px 0;
}

.level-2-container {
  padding-left: 20px;
  margin-top: 5px;
}

.level-3-container {
  padding-left: 20px;
  margin-top: 5px;
}

.item-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-size: 14px;
}

.item-link:hover {
  text-decoration: underline;
}

.repo-action-icon {
  width: 1.2rem;
  height: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
  flex-shrink: 0;
}

.repo-action-icon:hover {
  opacity: 1;
}
</style>
