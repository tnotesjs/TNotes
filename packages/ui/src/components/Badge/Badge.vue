<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    type?: 'info' | 'tip' | 'warning' | 'danger'
  }>(),
  { text: '', type: 'info' }
)
</script>

<template>
  <span class="tn-badge" :class="`tn-badge--${type}`"
    ><slot>{{ text }}</slot></span
  >
</template>

<style scoped>
.tn-badge {
  display: inline-block;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 1px 6px;
  font: 600 12px/18px var(--tn-font-sans);
  vertical-align: 1px;
}

.tn-badge--info,
.tn-badge--tip {
  border-color: color-mix(in srgb, var(--tn-c-brand) 40%, transparent);
  background: color-mix(in srgb, var(--tn-c-brand) 12%, transparent);
  color: var(--tn-c-brand-strong);
}

.tn-badge--warning {
  background: var(--tn-c-warning-soft);
  color: var(--tn-c-warning);
}

.tn-badge--danger {
  background: var(--tn-c-danger-soft);
  color: var(--tn-c-danger);
}
</style>
