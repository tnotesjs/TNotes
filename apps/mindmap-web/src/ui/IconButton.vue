<script setup lang="ts">
import AppIcon from './AppIcon.vue'

withDefaults(defineProps<{
  icon: string
  label: string
  size?: number
  active?: boolean
  danger?: boolean
  disabled?: boolean
}>(), { size: 18, active: false, danger: false, disabled: false })

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :class="{ active, danger }"
    :title="label"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <AppIcon :name="icon" :size="size" />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--mm-text-dim);
  cursor: pointer;
}
.icon-button:hover:not(:disabled), .icon-button.active { background: var(--mm-hover); color: var(--mm-text); }
.icon-button.danger { color: #d84d57; }
.icon-button:focus-visible { outline: 2px solid var(--mm-accent); outline-offset: 1px; }
.icon-button:disabled { cursor: default; opacity: .38; }
</style>
