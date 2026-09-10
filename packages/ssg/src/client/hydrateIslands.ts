/**
 * Progressive enhancement for SSR article HTML. The client hydrates chrome
 * (search / theme / sidebar) and leaves the article as static markup; these
 * helpers restore tab / copy / diagram behavior without compiling every note
 * SFC into the client graph.
 */

import { createApp } from "vue";
import { hydrateTnSwipers } from "@tnotesjs/ui/swiper";

async function copyText(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    /* fall through */
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.style.cssText = "position:fixed;left:-9999px;opacity:0";
  document.body.append(field);
  try {
    field.select();
    document.execCommand("copy");
  } finally {
    field.remove();
  }
}

function decodeData(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function hydrateCodeGroups(root: ParentNode): void {
  for (const group of root.querySelectorAll<HTMLElement>(".tn-code-group")) {
    if (group.dataset.tnReady === "1") continue;
    group.dataset.tnReady = "1";
    const tabs = [
      ...group.querySelectorAll<HTMLButtonElement>(
        ":scope > .tn-code-group__tabs button, :scope > .code-group-tabs button",
      ),
    ];
    const panels = [
      ...group.querySelectorAll<HTMLElement>(
        ":scope > .tn-code-group__panels > .tn-code-group__panel, :scope > .code-group-panels > .tn-code-group__panel",
      ),
    ];
    if (tabs.length === 0 || panels.length === 0) continue;

    const activate = (index: number) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.classList.toggle("active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        const on = i === index;
        panel.classList.toggle("active", on);
        panel.hidden = !on;
        panel.style.display = on ? "" : "none";
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index));
      tab.addEventListener("keydown", (event) => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft")
          next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(next);
        tabs[next]?.focus();
      });
    });

    // SSR slot content has no v-show — hide all but the active panel now.
    const initial = tabs.findIndex(
      (tab) =>
        tab.classList.contains("active") ||
        tab.getAttribute("aria-selected") === "true",
    );
    activate(initial < 0 ? 0 : initial);
  }
}

function hydrateCodeBlocks(root: ParentNode): void {
  for (const host of root.querySelectorAll<HTMLElement>("[data-tn-code]")) {
    if (host.dataset.tnReady === "1") continue;
    host.dataset.tnReady = "1";
    const code = decodeData(host.dataset.tnCode).replace(/\n$/, "");
    const block = host.querySelector(".tn-code-block");
    const buttons = [
      ...(block?.querySelectorAll<HTMLButtonElement>(
        ":scope > .tn-code-block__header .tn-code-block__icon-btn",
      ) ?? []),
    ];
    const copyBtn = buttons[0];
    const fullBtn = buttons[1];
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        void copyText(code).then(() => {
          const previous = copyBtn.getAttribute("aria-label");
          copyBtn.setAttribute("aria-label", "已复制");
          window.setTimeout(() => {
            if (previous) copyBtn.setAttribute("aria-label", previous);
          }, 1500);
        });
      });
    }
    if (fullBtn) {
      fullBtn.addEventListener("click", () => openCodeFullscreen(block, code));
    }
  }
}

function openCodeFullscreen(block: Element | null, code: string): void {
  const existing = document.querySelector(".tn-code-fullscreen");
  existing?.remove();
  const overlay = document.createElement("div");
  overlay.className = "tn-code-fullscreen";
  overlay.tabIndex = -1;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "代码全屏预览");
  const title =
    block?.querySelector(".tn-code-block__title")?.textContent?.trim() ||
    block?.querySelector(".tn-code-block__language")?.textContent?.trim() ||
    "code";
  const content =
    block?.querySelector(".tn-code-block__content")?.innerHTML ??
    `<pre><code>${escapeHtml(code)}</code></pre>`;
  overlay.innerHTML = `<header><span>${escapeHtml(title)}</span><button type="button">关闭（Esc）</button></header><div class="tn-code-block">${content}</div>`;
  const close = () => overlay.remove();
  overlay.querySelector("button")?.addEventListener("click", close);
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });
  document.body.append(overlay);
  overlay.focus({ preventScroll: true });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const values: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return values[character] ?? character;
  });
}

async function hydrateMermaids(root: ParentNode): Promise<void> {
  const nodes = [
    ...root.querySelectorAll<HTMLElement>('[data-tn-island="mermaid"]'),
  ].filter((el) => el.dataset.tnReady !== "1");
  if (!nodes.length) return;
  const mermaidMod = await import("@tnotesjs/ui/mermaid");
  const Mermaid = mermaidMod.default;
  for (const el of nodes) {
    el.dataset.tnReady = "1";
    createApp(Mermaid, {
      graph: el.dataset.graph ?? "",
      id: el.dataset.id ?? "",
      center: el.dataset.center === "true",
    }).mount(el);
  }
}

async function hydrateMindmaps(root: ParentNode): Promise<void> {
  const nodes = [
    ...root.querySelectorAll<HTMLElement>('[data-tn-island="mindmap"]'),
  ].filter((el) => el.dataset.tnReady !== "1");
  if (!nodes.length) return;
  const mindmapMod = await import("@tnotesjs/ui/mindmap");
  const Mindmap = mindmapMod.default;
  for (const el of nodes) {
    el.dataset.tnReady = "1";
    const expand = el.dataset.expand;
    createApp(Mindmap, {
      content: el.dataset.content ?? "",
      initialExpandLevel: expand === undefined ? undefined : Number(expand),
    }).mount(el);
  }
}

export async function hydrateIslands(root: ParentNode = document): Promise<void> {
  hydrateCodeGroups(root);
  hydrateCodeBlocks(root);
  hydrateTnSwipers(root);
  await Promise.all([hydrateMermaids(root), hydrateMindmaps(root)]);
}
