<template>
  <section class="tn-sidebar-card">
    <h2>知识库目录</h2>
    <div class="tn-sidebar-card-grid">
      <article v-for="item in flattened" :key="item.text">
        <a v-if="item.link" :href="href(item.link)">{{ item.text }}</a>
        <strong v-else>{{ item.text }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import site from "virtual:tnotes-site";

import type { SidebarItem } from "../../types";

defineProps<{ pending?: boolean }>();

const flattened = computed(() => {
  const values: SidebarItem[] = [];
  const visit = (items: SidebarItem[]) => {
    for (const item of items) {
      if (item.link) values.push(item);
      if (item.items) visit(item.items);
    }
  };
  visit(site.sidebar);
  return values.slice(0, 12);
});

const href = (link: string) => `${site.base}${link.replace(/^\//, "")}`;
</script>
