<script setup lang="ts">
import type { NoteOutlineHeading } from './noteOutline'

defineProps<{
  headings: NoteOutlineHeading[]
  activeId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <nav v-if="headings.length > 0" class="note-outline" aria-label="本页目录">
    <p class="note-outline__title">本页目录</p>
    <ol class="note-outline__list">
      <li
        v-for="item in headings"
        :key="item.id"
        class="note-outline__item"
        :data-level="item.level"
      >
        <button
          type="button"
          class="note-outline__link"
          :class="{ 'is-active': item.id === activeId }"
          :title="item.text"
          @click="emit('select', item.id)"
        >
          {{ item.text }}
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.note-outline {
  box-sizing: border-box;
  flex: none;
  width: 208px;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 28px 16px 32px 12px;
  border-left: 1px solid var(--border);
  color: var(--muted);
}

.note-outline__title {
  margin: 0 0 10px;
  padding: 0 8px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
}

.note-outline__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.note-outline__item {
  margin: 0;
}

.note-outline__link {
  display: block;
  width: 100%;
  margin: 0;
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-outline__link:hover {
  background: var(--hover);
  color: var(--editor-text);
}

.note-outline__link.is-active {
  color: var(--accent-strong);
  font-weight: 600;
}

.note-outline__item[data-level='2'] .note-outline__link {
  padding-left: 16px;
}

.note-outline__item[data-level='3'] .note-outline__link {
  padding-left: 24px;
}

.note-outline__item[data-level='4'] .note-outline__link {
  padding-left: 32px;
}

.note-outline__item[data-level='5'] .note-outline__link {
  padding-left: 40px;
}

.note-outline__item[data-level='6'] .note-outline__link {
  padding-left: 48px;
}
</style>
