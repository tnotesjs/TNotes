<template>
  <ul class="tn-site-sidebar-list">
    <li v-for="item in items" :key="`${item.text}:${item.link || ''}`">
      <a
        v-if="item.link"
        :class="{ active: normalize(item.link) === normalize(route) }"
        :href="href(item.link)"
      >
        {{ item.text }}
      </a>
      <span v-else class="tn-site-sidebar-heading">{{ item.text }}</span>
      <SidebarTree
        v-if="item.items?.length"
        :items="item.items"
        :route="route"
        :base="base"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { SidebarItem } from "../../types";

const props = defineProps<{
  items: SidebarItem[];
  route: string;
  base: string;
}>();

const normalize = (value: string) =>
  decodeURIComponent(value)
    .replace(/\.(md|html)$/i, "")
    .replace(/\/$/, "") || "/";

const href = (link: string) => {
  if (/^(https?:)?\/\//.test(link)) return link;
  return `${props.base}${link.replace(/^\//, "")}`;
};
</script>
