/** @vitest-environment happy-dom */

import { describe, expect, it } from "vitest";

import { hydrateIslands } from "../src/client/hydrateIslands";

describe("hydrateIslands", () => {
  it("switches code-group tabs without Vue", async () => {
    document.body.innerHTML = `
      <section class="tn-code-group">
        <div class="tn-code-group__tabs">
          <button type="button" class="active" aria-selected="true">one.js</button>
          <button type="button" aria-selected="false">two.ts</button>
        </div>
        <div class="tn-code-group__panels">
          <div class="tn-code-group__panel active">first</div>
          <div class="tn-code-group__panel" style="display:none">second</div>
        </div>
      </section>
    `;
    await hydrateIslands(document.body);
    const tabs = document.querySelectorAll("button");
    const panels = document.querySelectorAll<HTMLElement>(".tn-code-group__panel");
    tabs[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(tabs[1]?.classList.contains("active")).toBe(true);
    expect(panels[0]?.hidden).toBe(true);
    expect(panels[1]?.hidden).toBe(false);
  });
});
