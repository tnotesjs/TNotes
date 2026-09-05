<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import CodeBlock from "../CodeBlock/CodeBlock.vue";
import { parseCodeMeta } from "../../code/highlight";

export interface CodeGroupItem {
  code?: string;
  info?: string;
  highlightedHtml?: string;
  key?: string;
}
const props = defineProps<{ items: CodeGroupItem[] }>();
const root = ref<HTMLElement>();
const active = ref(0);
function syncPanels(): void {
  const panels =
    root.value?.querySelectorAll<HTMLElement>(
      ":scope > .tn-code-group__panels > .tn-code-group__panel",
    ) ?? [];
  panels.forEach((panel, index) => {
    panel.hidden = index !== active.value;
  });
}
watch(active, syncPanels, { flush: "post" });
watch(
  () => props.items.length,
  (length) => {
    active.value = Math.max(0, Math.min(active.value, length - 1));
    nextTick(syncPanels);
  },
);
onMounted(syncPanels);
function navigate(event: KeyboardEvent, index: number): void {
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % props.items.length;
  else if (event.key === "ArrowLeft")
    next = (index - 1 + props.items.length) % props.items.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = props.items.length - 1;
  else return;
  event.preventDefault();
  active.value = next;
  (event.currentTarget as HTMLElement).parentElement
    ?.querySelectorAll<HTMLButtonElement>("button")
    [next]?.focus();
}
</script>

<template>
  <section ref="root" class="tn-code-group">
    <div
      v-if="items.length > 1"
      class="tn-code-group__tabs code-group-tabs"
      role="tablist"
      aria-label="代码分组"
    >
      <button
        v-for="(item, index) in items"
        :key="item.key || index"
        type="button"
        role="tab"
        class="code-group-tab"
        :class="{ active: active === index }"
        :aria-selected="active === index"
        :tabindex="active === index ? 0 : -1"
        @click="active = index"
        @keydown="navigate($event, index)"
      >
        {{
          parseCodeMeta(item.info).title ||
          parseCodeMeta(item.info).language ||
          `代码 ${index + 1}`
        }}
      </button>
    </div>
    <div class="tn-code-group__panels code-group-panels">
      <slot>
        <div
          v-for="(item, index) in items"
          v-show="active === index"
          :key="item.key || index"
          class="tn-code-group__panel code-group-panel"
          :class="{ active: active === index }"
          role="tabpanel"
        >
          <slot name="panel" :item="item" :index="index"
            ><CodeBlock
              :code="item.code || ''"
              :info="item.info"
              :highlighted-html="item.highlightedHtml"
          /></slot>
        </div>
      </slot>
    </div>
  </section>
</template>
