import { createSSRApp, defineComponent } from "vue";
import { renderToString } from "@vue/server-renderer";
import { pageData } from "virtual:tnotes-pages";
import site from "virtual:tnotes-site";

import { createSiteApp } from "./runtime";
import { registerTNotesComponents } from "./register";

import type { Component } from "vue";
import type { PageData } from "../types";

const mjxCustomElement = (tag: string) => tag.startsWith("mjx-");

function pageFromHtml(html: string, name: string): Component {
  return defineComponent({
    name,
    compilerOptions: { isCustomElement: mjxCustomElement },
    template: `<div class="tn-prose">${html}</div>`,
  });
}

export async function render(
  route: string,
  data: PageData,
  options: { page?: Component; html?: string },
) {
  // The article renders in a dedicated app (global TNotes components,
  // NotesTable provides). The site app then injects the result via v-html,
  // so server and client chrome templates stay structurally identical and
  // hydration never walks note content.
  const pageApp = createSSRApp(
    options.page ?? pageFromHtml(options.html ?? "", route || "tn-page"),
  );
  registerTNotesComponents(pageApp, site, pageData);
  pageApp.config.compilerOptions.isCustomElement = mjxCustomElement;
  const articleHtml = await renderToString(pageApp);

  const { app } = await createSiteApp(route, { data, articleHtml });
  return { html: await renderToString(app), data };
}
