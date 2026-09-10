import { createSSRApp } from "vue";
import { pageData } from "virtual:tnotes-pages";
import site from "virtual:tnotes-site";
import theme from "virtual:tnotes-theme";

import App from "./App.vue";

import type { PageData } from "../types";

/**
 * The site app renders chrome only. The article is static HTML injected via
 * `v-html`, so server and client templates are structurally identical and
 * hydration never touches note content.
 */
export async function createSiteApp(
  route: string,
  options: {
    data: PageData;
    articleHtml?: string;
  },
) {
  const app = createSSRApp(App, {
    route,
    data: options.data,
    articleHtml: options.articleHtml ?? "",
  });
  theme.enhanceApp?.({ app, site, pages: pageData });
  return { app, data: options.data };
}
