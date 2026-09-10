import Badge from "@tnotesjs/ui/badge";
import CodeBlock from "@tnotesjs/ui/code-block";
import CodeGroup from "@tnotesjs/ui/code-group";
import ImagePreview from "@tnotesjs/ui/image-preview";
import { defineAsyncComponent, defineComponent, h } from "vue";
import theme from "virtual:tnotes-theme";

import NotesTableAdapter from "./components/NotesTableAdapter";
import SidebarCard from "./components/SidebarCard.vue";

import type { App, Component } from "vue";
import type { PageData, SiteData } from "../types";
import { NOTES_DATA_KEY, SITE_BASE_KEY } from "./components/NotesTableAdapter";

const Discussions = defineComponent({
  name: "Discussions",
  setup: () => () =>
    h(
      "p",
      { class: "tn-discussions-placeholder" },
      "评论请前往 GitHub Discussions。",
    ),
});

function lazyComponent(loader: () => Promise<unknown>) {
  return defineAsyncComponent(async () => {
    const loaded = await loader();
    return ((loaded as { default?: Component }).default ?? loaded) as Component;
  });
}

const BilibiliVideo = lazyComponent(
  () => import("@tnotesjs/ui/bilibili-video"),
);
const Footprints = lazyComponent(() => import("@tnotesjs/ui/footprints"));
const Mermaid = lazyComponent(() => import("@tnotesjs/ui/mermaid"));
const Mindmap = lazyComponent(() => import("@tnotesjs/ui/mindmap"));
const WordList = lazyComponent(() => import("@tnotesjs/ui/word-list"));

export function registerTNotesComponents(
  app: App,
  site: SiteData,
  pages: Record<string, PageData>,
) {
  app.provide(NOTES_DATA_KEY, pages);
  app.provide(SITE_BASE_KEY, site.base);
  for (const [name, component] of Object.entries({
    Badge,
    BilibiliVideo,
    BilibiliOutsidePlayer: BilibiliVideo,
    CodeBlock,
    CodeGroup,
    Discussions,
    Footprints,
    ImagePreview,
    Mermaid,
    Mindmap,
    MindmapPreview: Mindmap,
    NotesTable: NotesTableAdapter,
    SidebarCard,
    WordList,
    EnWordList: WordList,
  })) {
    app.component(name, component as Component);
  }
  theme.enhanceApp?.({ app, site, pages });
}
