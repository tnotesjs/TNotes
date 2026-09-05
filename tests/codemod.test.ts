import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { inlineIncludes, migrateKnowledgeBase, stripGeneratedRegions } from "../src/codemod";
import { createWorkspace } from "../src/workspace";

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  while (cleanups.length > 0) await cleanups.pop()?.();
});

async function makeOldKb(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "kb-codemod-"));
  cleanups.push(async () => fs.rm(root, { recursive: true, force: true }));

  await fs.writeFile(
    path.join(root, ".tnotes.json"),
    JSON.stringify({ id: "old-kb-id", repoName: "TNotes.demo", root_item: { title: "Demo 库", details: "旧格式" } }),
  );
  await fs.writeFile(path.join(root, "sidebar.json"), "[]\n");
  await fs.writeFile(
    path.join(root, "TOC.md"),
    "- 分组甲\n  - [x] 0001. 第一篇\n- [ ] 0002. 第二篇\n",
  );

  const note1 = path.join(root, "notes", "0001. 第一篇");
  await fs.mkdir(path.join(note1, "demos", "1"), { recursive: true });
  await fs.mkdir(path.join(note1, "assets"), { recursive: true });
  await fs.writeFile(
    path.join(note1, ".tnotes.json"),
    JSON.stringify({
      id: "uuid-1",
      description: "第一篇描述",
      done: true,
      enableDiscussions: true,
      bilibili: ["ignored"],
    }),
  );
  await fs.writeFile(
    path.join(note1, "README.md"),
    [
      "# [0001. 第一篇](https://github.com/tnotesjs/TNotes.demo/tree/main/notes/0001)",
      "",
      "<!-- region:toc -->",
      "- [1. A](#1-a)",
      "<!-- endregion:toc -->",
      "",
      "## 1. A",
      "",
      "![图](./assets/pic.png)",
      "",
      "::: code-group",
      "<<< ./demos/1/main.ts {2} [入口]",
      ":::",
      "",
    ].join("\n"),
  );
  await fs.writeFile(path.join(note1, "demos", "1", "main.ts"), "const a = 1\nconst b = 2\n");
  await fs.writeFile(path.join(note1, "assets", "pic.png"), "png-1");

  const note2 = path.join(root, "notes", "0002. 第二篇");
  await fs.mkdir(path.join(note2, "assets"), { recursive: true });
  await fs.writeFile(path.join(note2, ".tnotes.json"), JSON.stringify({ id: "uuid-2" }));
  await fs.writeFile(path.join(note2, "README.md"), "## 正文\n\n![图](./assets/pic.png)\n");
  // 与 note1 同名但内容不同 → 触发重命名
  await fs.writeFile(path.join(note2, "assets", "pic.png"), "png-2-different");

  return root;
}

describe("stripGeneratedRegions", () => {
  it("removes the generated title link and toc region", () => {
    const body = [
      "# [0001. T](https://github.com/x/y)",
      "",
      "<!-- region:toc -->",
      "- [A](#a)",
      "<!-- endregion:toc -->",
      "",
      "## A",
      "",
      "text",
    ].join("\n");
    const stripped = stripGeneratedRegions(body);
    expect(stripped).not.toContain("region:toc");
    expect(stripped).not.toContain("github.com");
    expect(stripped).toContain("## A");
    expect(stripped).toContain("text");
  });
});

describe("inlineIncludes", () => {
  it("inlines file content as a fence with lang, highlights and title", () => {
    const { body, inlined } = inlineIncludes(
      "before\n<<< ./demos/1/main.ts {2} [入口]\nafter\n",
      () => "const a = 1\nconst b = 2\n",
    );
    expect(inlined).toBe(1);
    expect(body).toContain("```ts {2} [入口]");
    expect(body).toContain("const a = 1");
    expect(body).not.toContain("<<<");
  });

  it("derives lang from extension and title from basename", () => {
    const { body } = inlineIncludes("<<< ./x/y.json", () => "{}\n");
    expect(body).toContain("```json [y.json]");
  });

  it("keeps unresolvable includes as-is and reports them", () => {
    const failures: string[] = [];
    const { body, inlined } = inlineIncludes("<<< ./missing.ts", () => null, (p) =>
      failures.push(p),
    );
    expect(inlined).toBe(0);
    expect(body).toContain("<<< ./missing.ts");
    expect(failures).toEqual(["./missing.ts"]);
  });
});

describe("migrateKnowledgeBase", () => {
  it("converts an old kb to the new single-file layout", async () => {
    const root = await makeOldKb();
    const report = await migrateKnowledgeBase(root);

    expect(report.notesMigrated).toBe(2);
    expect(report.includesInlined).toBe(1);
    expect(report.includeFailures).toEqual([]);
    expect(report.assetsMoved).toBe(2);
    // 同名不同内容 → 第二篇的 pic.png 被重命名
    expect(report.assetsRenamed["0002. 第二篇/assets/pic.png"]).toBe("assets/pic-2.png");

    // 新结构可被 kb 扫描且无错误
    const snapshot = await createWorkspace({ rootPath: root }).scan();
    expect(snapshot.diagnostics.filter((d) => d.severity === "error")).toEqual([]);
    expect(snapshot.notes.map((n) => n.index)).toEqual(["0001", "0002"]);

    // frontmatter 白名单：id/description 保留，enableDiscussions/bilibili 丢弃
    const note1 = snapshot.notes.find((n) => n.index === "0001")!;
    expect(note1.frontmatter.id).toBe("uuid-1");
    expect(note1.frontmatter.description).toBe("第一篇描述");
    expect(note1.frontmatter).not.toHaveProperty("enableDiscussions");
    expect(note1.done).toBe(true); // 来自 TOC 复选框

    // 笔记内容：生成区已剥离、include 已内联、assets 引用已改写
    const doc = await createWorkspace({ rootPath: root }).notes.read("0001");
    expect(doc.content).not.toContain("region:toc");
    expect(doc.content).not.toContain("<<<");
    expect(doc.content).toContain("```ts {2} [入口]");
    expect(doc.content).toContain("](../assets/pic.png)");

    const doc2 = await createWorkspace({ rootPath: root }).notes.read("0002");
    expect(doc2.content).toContain("](../assets/pic-2.png)");

    // assets 落盘
    expect(await fs.readFile(path.join(root, "assets", "pic.png"), "utf8")).toBe("png-1");
    expect(await fs.readFile(path.join(root, "assets", "pic-2.png"), "utf8")).toBe(
      "png-2-different",
    );

    // 旧文件清理
    await expect(fs.stat(path.join(root, ".tnotes.json"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, "sidebar.json"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, "notes", "0001. 第一篇"))).rejects.toThrow();

    // tnotes.json 生成
    const config = JSON.parse(await fs.readFile(path.join(root, "tnotes.json"), "utf8"));
    expect(config.title).toBe("Demo 库");
  });

  it("dry-run reports without writing", async () => {
    const root = await makeOldKb();
    const report = await migrateKnowledgeBase(root, { dryRun: true });
    expect(report.notesMigrated).toBe(2);
    // 旧目录仍在，新文件未写
    await fs.stat(path.join(root, "notes", "0001. 第一篇", "README.md"));
    await expect(fs.stat(path.join(root, "notes", "0001. 第一篇.md"))).rejects.toThrow();
  });
});
