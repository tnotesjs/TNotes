import { describe, expect, it } from "vitest";

import {
  collectCodeLanguages,
  createMarkdownCompiler,
  escapeVueMustaches,
  extractMarkdownLinks,
} from "../src/markdown";

const compilerConfig = {
  root: "/",
  outDir: "/",
  cacheDir: "/",
  publicDir: "/",
  base: "/",
  title: "t",
  description: "",
  lang: "zh",
  port: 0,
  discussions: false,
  ignoreDeadLinks: true,
  head: [] as Array<[string, Record<string, string>, string?]>,
  markdown: { lineNumbers: false, math: false, imageLazyLoading: false },
};

describe("Markdown compatibility helpers", () => {
  it("collects only fenced-code languages needed by a site", () => {
    expect(
      collectCodeLanguages([
        "```ts\nconst value = 1\n```",
        "```TS\nconst other = 2\n```\n```python\npass\n```",
        "```mermaid\ngraph TD\n```",
      ]).sort(),
    ).toEqual(["mermaid", "python", "ts"]);
  });

  it("does not treat markdown-like text inside code as a link", () => {
    expect(
      extractMarkdownLinks(
        [
          "[真实](./0002.%20指南.md)",
          "",
          "```ts",
          "if (prefix === '[' && suffix.startsWith('](')) {}",
          "const href = '[x](./missing.md)'",
          "```",
          "",
          "`[内联](./no.md)`",
        ].join("\n"),
      ),
    ).toEqual(["./0002.%20指南.md"]);
  });

  it("renders standalone image width, caption, and alignment", async () => {
    const compiler = await createMarkdownCompiler(compilerConfig);
    const { html } = compiler.compile(
      "![说明](../assets/pic.png) {w=50% align=center}\n",
      "n.md",
      "/n",
      "n",
    );
    expect(html).toContain('class="tn-image tn-image--center"');
    expect(html).toContain('style="width:50%;max-width:100%"');
    expect(html).toContain("width:100%");
    expect(html).toContain("<figcaption>说明</figcaption>");
  });

  it("wraps a tight-list image in figure so the caption can center", async () => {
    const compiler = await createMarkdownCompiler(compilerConfig);
    const { html } = compiler.compile(
      ["- first", "- ![图 0](https://example.com/pic.png)", ""].join("\n"),
      "n.md",
      "/n",
      "n",
    );
    expect(html).toContain('<figure class="tn-image">');
    expect(html).toContain("<figcaption>图 0</figcaption>");
    expect(html).toMatch(/<li>\s*<figure class="tn-image">/);
    expect(html).not.toMatch(/<li>\s*<img /);
  });

  it("renders tip/info/warning/danger/details as typed custom blocks", async () => {
    const compiler = await createMarkdownCompiler(compilerConfig);
    const { html } = compiler.compile(
      [
        "::: tip 💡 TIP\n\nbody\n\n:::",
        "::: info\n\ninfo\n\n:::",
        "::: warning\n\nwarn\n\n:::",
        "::: danger\n\nerr\n\n:::",
        "::: details 细节\n\nhidden\n\n:::",
      ].join("\n\n"),
      "n.md",
      "/n",
      "n",
    );
    expect(html).toContain('class="tn-custom-block tip"');
    expect(html).toContain('class="tn-custom-block info"');
    expect(html).toContain('class="tn-custom-block warning"');
    expect(html).toContain('class="tn-custom-block danger"');
    expect(html).toContain('<details class="tn-custom-block details">');
    expect(html).toContain("<summary>细节</summary>");
  });

  it("emits hydratable island hosts for mermaid, mindmap, and code", async () => {
    const compiler = await createMarkdownCompiler(compilerConfig);
    await compiler.prepare(["```js\nconsole.log(1)\n```"]);
    const { html } = compiler.compile(
      [
        "```js",
        "console.log(1)",
        "```",
        "",
        "```mermaid",
        "graph TD",
        "  A --> B",
        "```",
        "",
        "```mindmap",
        "- 根",
        "  - 子",
        "```",
      ].join("\n"),
      "n.md",
      "/n",
      "n",
    );
    expect(html).toContain('data-tn-code="');
    expect(html).toContain('data-tn-island="mermaid"');
    expect(html).toContain('data-tn-island="mindmap"');
  });

  it("hides all but the first code-group panel in SSR HTML", async () => {
    const compiler = await createMarkdownCompiler(compilerConfig);
    const source = [
      "::: code-group",
      "",
      "```js [a.js]",
      "console.log(1)",
      "```",
      "",
      "```ts [b.ts]",
      "console.log(2)",
      "```",
      "",
      ":::",
    ].join("\n");
    await compiler.prepare([source]);
    const { html } = compiler.compile(source, "n.md", "/n", "n");
    // Without the initial state every panel paints stacked until
    // hydrateIslands runs — a visible flash on each navigation.
    expect(html).toContain(
      '<div class="tn-code-group__panel active" role="tabpanel">',
    );
    expect(html).toContain(
      '<div class="tn-code-group__panel" role="tabpanel" hidden style="display:none">',
    );
  });

  it("exposes structured outline headings with github-style ids", async () => {
    const compiler = await createMarkdownCompiler(compilerConfig);
    const { html, data } = compiler.compile(
      ["# 标题", "", "## 建议按这个顺序点", "", "### 小节", ""].join("\n"),
      "n.md",
      "/n",
      "n",
    );
    expect(data.headings).toEqual([
      { text: "建议按这个顺序点", level: 2, id: "建议按这个顺序点" },
      { text: "小节", level: 3, id: "小节" },
    ]);
    expect(html).toContain('id="建议按这个顺序点"');
    expect(html).toContain('id="小节"');
  });

  it("treats markdown mustaches as literal text, not Vue interpolations", async () => {
    expect(escapeVueMustaches("{{ n }}")).toBe("&#123;&#123; n &#125;&#125;");
    const compiler = await createMarkdownCompiler(compilerConfig);
    const { html } = compiler.compile(
      [
        "inline `{{ count }}`",
        "",
        "prose {{ n }}",
        "",
        "<span>{{ live }}</span>",
        "",
      ].join("\n"),
      "/notes/n.md",
      "/n",
      "n",
    );
    expect(html).toContain("&#123;&#123; count &#125;&#125;");
    expect(html).toContain("&#123;&#123; n &#125;&#125;");
    expect(html).toContain("&#123;&#123; live &#125;&#125;");
    expect(html).not.toMatch(/\{\{/);
  });
});
