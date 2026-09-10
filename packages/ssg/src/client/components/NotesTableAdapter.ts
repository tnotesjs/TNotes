import NotesTable from "@tnotesjs/ui/notes-table";
import { computed, defineComponent, h, inject } from "vue";

import type { NotesTableRow } from "@tnotesjs/ui";
import type { PageData } from "../../types";

export const NOTES_DATA_KEY = Symbol("tnotes-page-data");
export const SITE_BASE_KEY = Symbol("tnotes-site-base");

export default defineComponent({
  name: "NotesTableAdapter",
  props: {
    ids: { type: Array as () => string[], required: true },
  },
  setup(props) {
    const pages = inject<Record<string, PageData>>(NOTES_DATA_KEY, {});
    const base = inject(SITE_BASE_KEY, "/");
    const byId = computed(() => {
      const values = new Map<string, PageData>();
      for (const page of Object.values(pages)) {
        const match = page.relativePath.match(/^notes\/(\d{4})\./);
        if (match) values.set(match[1], page);
      }
      return values;
    });
    const rows = computed<NotesTableRow[]>(() =>
      props.ids.flatMap((id) => {
        const page = byId.value.get(id);
        if (!page) return [];
        return [
          {
            id,
            title: page.title,
            description: page.description,
            url: `${base}${page.route.replace(/^\//, "")}`,
          },
        ];
      }),
    );
    const missing = computed(() =>
      props.ids.filter((id) => !byId.value.has(id)),
    );
    return () =>
      h(NotesTable, { notes: rows.value, missingIds: missing.value });
  },
});
