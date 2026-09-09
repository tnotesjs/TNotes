import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  indexedAssetFileName,
  inlineIncludes,
  migrateKnowledgeBase,
  stripGeneratedRegions,
} from "../src/codemod";
import { buildMigratedKbConfig } from "../src/migrate-config";
import { CANONICAL_GITATTRIBUTES, CANONICAL_GITIGNORE } from "../src/migrate-scaffold";
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
    JSON.stringify({
      id: "old-kb-id",
      repoName: "TNotes.demo",
      port: 9220,
      root_item: {
        title: "Demo 库",
        details: "旧格式",
        link: "https://tnotesjs.github.io/TNotes.demo/",
        icon: { src: "https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/assets/icon--demo.svg" },
        completed_notes_count: { "26.08": 1, "26.09": 2 },
      },
      socialLinks: [
        { ariaLabel: "github", link: "https://github.com/tnotesjs/TNotes.demo", icon: "github" },
      ],
    }),
  );
  await fs.writeFile(path.join(root, "sidebar.json"), "[]\n");
  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      type: "module",
      scripts: {
        "tn:build": "tnotes --build",
        "tn:dev": "tnotes --dev",
        extra: "echo keep-me",
      },
      dependencies: { "@tnotesjs/core": "^0.8.0" },
    }),
  );
  await fs.writeFile(path.join(root, ".gitignore"), "node_modules/\nMERGED_README.md\n");
  await fs.writeFile(path.join(root, ".prettierignore"), "TOC.md\n");
  await fs.writeFile(path.join(root, "pnpm-workspace.yaml"), "packages: []\n");
  await fs.mkdir(path.join(root, ".vscode"), { recursive: true });
  await fs.writeFile(path.join(root, ".vscode", "tasks.json"), "{}\n");
  await fs.mkdir(path.join(root, "public"), { recursive: true });
  await fs.writeFile(path.join(root, "public", "favicon.ico"), "ico");
  await fs.mkdir(path.join(root, ".github"), { recursive: true });
  await fs.writeFile(path.join(root, ".github", "copilot-instructions.md"), "# old\n");
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
  await fs.writeFile(path.join(note1, "assets", "notes.md"), "unreferenced sidecar\n");

  const note2 = path.join(root, "notes", "0002. 第二篇");
  await fs.mkdir(path.join(note2, "assets"), { recursive: true });
  await fs.writeFile(path.join(note2, ".tnotes.json"), JSON.stringify({ id: "uuid-2" }));
  await fs.writeFile(path.join(note2, "README.md"), "## 正文\n\n![图](assets/pic.png)\n");
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

  it("uses a longer outer fence when the included file contains ```", () => {
    const { body, inlined } = inlineIncludes("<<< ./readme.md", () => "# hi\n\n```ts\nconst x = 1\n```\n");
    expect(inlined).toBe(1);
    expect(body).toContain("````md [readme.md]");
    expect(body).toContain("```ts\nconst x = 1\n```");
    expect(body.trim().endsWith("````")).toBe(true);
  });

  it("strips empty {} highlight meta so the path still resolves", () => {
    const files = new Map([["./demos/1/1.ts", "const x = 1\n"]]);
    const { body, inlined } = inlineIncludes(
      "<<< ./demos/1/1.ts {}",
      (p) => files.get(p) ?? null,
    );
    expect(inlined).toBe(1);
    expect(body).toContain("```ts [1.ts]");
    expect(body).not.toContain("<<<");
  });

  it("parses combined highlight+lang braces like {16,21 js}", () => {
    const files = new Map([["./demos/8/1.cjs", "console.log(1)\n"]]);
    const { body, inlined } = inlineIncludes(
      "<<< ./demos/8/1.cjs {16,21 js} [1.cjs]",
      (p) => files.get(p) ?? null,
    );
    expect(inlined).toBe(1);
    expect(body).toContain("```js {16,21} [1.cjs]");
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

  it("inlines several <<< includes that share one line", () => {
    const files = new Map([
      ["./solutions/1/1.js", "var a = 1\n"],
      ["./solutions/1/1.c", "int a = 1;\n"],
      ["./solutions/1/1.py", "a = 1\n"],
    ]);
    const { body, inlined } = inlineIncludes(
      "<<< ./solutions/1/1.js [js] <<< ./solutions/1/1.c [c] <<< ./solutions/1/1.py [py]",
      (p) => files.get(p) ?? null,
    );
    expect(inlined).toBe(3);
    expect(body).toContain("```js [js]\nvar a = 1\n```\n\n```c [c]\nint a = 1;\n```\n\n```py [py]\na = 1\n```");
    expect(body).not.toContain("<<<");
  });
});

describe("migrateKnowledgeBase", () => {
  it("converts an old kb to the new single-file layout", async () => {
    const root = await makeOldKb();
    const report = await migrateKnowledgeBase(root);

    expect(report.notesMigrated).toBe(2);
    expect(report.includesInlined).toBe(1);
    expect(report.includeFailures).toEqual([]);
    expect(report.assetsMoved).toBe(3);
    expect(report.assetsRenamed["0001. 第一篇/assets/pic.png"]).toBe("assets/0001-pic.png");
    expect(report.assetsRenamed["0001. 第一篇/assets/notes.md"]).toBe("assets/0001-notes.md");
    expect(report.assetsRenamed["0002. 第二篇/assets/pic.png"]).toBe("assets/0002-pic.png");

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
    expect(doc.content).toContain("](../assets/0001-pic.png)");

    const doc2 = await createWorkspace({ rootPath: root }).notes.read("0002");
    expect(doc2.content).toContain("](../assets/0002-pic.png)");

    // assets 落盘：文件名带笔记索引；未引用 sidecar 也留下
    expect(await fs.readFile(path.join(root, "assets", "0001-pic.png"), "utf8")).toBe("png-1");
    expect(await fs.readFile(path.join(root, "assets", "0002-pic.png"), "utf8")).toBe(
      "png-2-different",
    );
    expect(await fs.readFile(path.join(root, "assets", "0001-notes.md"), "utf8")).toBe(
      "unreferenced sidecar\n",
    );

    // 旧文件清理
    await expect(fs.stat(path.join(root, ".tnotes.json"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, "sidebar.json"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, "notes", "0001. 第一篇"))).rejects.toThrow();

    // tnotes.json 映射旧字段
    const config = JSON.parse(await fs.readFile(path.join(root, "tnotes.json"), "utf8"));
    expect(config).toMatchObject({
      name: "TNotes.demo",
      title: "Demo 库",
      description: "旧格式",
      port: 9220,
      pageUrl: "https://tnotesjs.github.io/TNotes.demo/",
      repositoryUrl: "https://github.com/tnotesjs/TNotes.demo",
      base: "/TNotes.demo/",
      discussions: true,
      icon: { src: "https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/assets/icon--demo.svg" },
      stats: { enabled: true, completedNotesCount: { "26.08": 1, "26.09": 2 } },
    });
    expect(report.config).toEqual(config);

    const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
    expect(pkg.scripts).toMatchObject({
      "tn:update": "tnotes-kb update",
      "tn:build": "tnotes-ssg build",
      extra: "echo keep-me",
    });
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.devDependencies["@tnotesjs/kb"]).toBe("^0.2.1");
    expect(pkg.devDependencies["@tnotesjs/ssg"]).toBe("^0.1.5");
    expect(report.preservedScripts).toEqual(["extra"]);
    expect(report.scaffolded).toEqual(
      expect.arrayContaining([
        "package.json",
        ".github/workflows/deploy.yml",
        ".gitignore",
        ".gitattributes",
      ]),
    );

    const deploy = await fs.readFile(path.join(root, ".github", "workflows", "deploy.yml"), "utf8");
    expect(deploy).toContain("path: .tnotes/dist");
    expect(deploy).toContain("pnpm tn:build");
    expect(deploy).toContain("# notify:");
    expect(deploy).toContain("secrets.TNOTES_DISPATCH_TOKEN");
    expect(deploy).not.toMatch(/^ {2}notify:/m);

    const gitignore = await fs.readFile(path.join(root, ".gitignore"), "utf8");
    expect(gitignore).toBe(CANONICAL_GITIGNORE);
    expect(await fs.readFile(path.join(root, ".gitattributes"), "utf8")).toBe(CANONICAL_GITATTRIBUTES);
    await expect(fs.stat(path.join(root, ".vscode"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, "public"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, ".prettierignore"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, ".github", "copilot-instructions.md"))).rejects.toThrow();
    expect(await fs.readFile(path.join(root, "pnpm-workspace.yaml"), "utf8")).toContain(
      "minimumReleaseAgeExclude",
    );
    expect(await fs.readFile(path.join(root, ".npmrc"), "utf8")).toContain("@tnotesjs:registry");
  });

  it("inlines includes when the kb path is relative", async () => {
    const root = await makeOldKb();
    const cwd = process.cwd();
    try {
      process.chdir(root);
      const report = await migrateKnowledgeBase(".");
      expect(report.includesInlined).toBe(1);
      expect(report.includeFailures).toEqual([]);
    } finally {
      process.chdir(cwd);
    }
  });

  it("dry-run reports without writing", async () => {
    const root = await makeOldKb();
    const report = await migrateKnowledgeBase(root, { dryRun: true });
    expect(report.notesMigrated).toBe(2);
    expect(report.config?.name).toBe("TNotes.demo");
    expect(report.scaffolded).toEqual(
      expect.arrayContaining([
        "package.json",
        ".github/workflows/deploy.yml",
        ".gitignore",
        ".gitattributes",
      ]),
    );
    await fs.stat(path.join(root, "notes", "0001. 第一篇", "README.md"));
    await expect(fs.stat(path.join(root, "notes", "0001. 第一篇.md"))).rejects.toThrow();
    await expect(fs.stat(path.join(root, "tnotes.json"))).rejects.toThrow();
    const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
    expect(pkg.dependencies["@tnotesjs/core"]).toBe("^0.8.0");
  });

  it("does not overwrite an existing tnotes.json", async () => {
    const root = await makeOldKb();
    await fs.writeFile(path.join(root, "tnotes.json"), `${JSON.stringify({ title: "已有配置" }, null, 2)}\n`);
    const report = await migrateKnowledgeBase(root);
    expect(report.config).toBeUndefined();
    const config = JSON.parse(await fs.readFile(path.join(root, "tnotes.json"), "utf8"));
    expect(config).toEqual({ title: "已有配置" });
  });
});

describe("indexedAssetFileName", () => {
  it("prefixes the note index and does not double-prefix", () => {
    expect(indexedAssetFileName("0008", "1.png")).toBe("0008-1.png");
    expect(indexedAssetFileName("0008", "0008-1.png")).toBe("0008-1.png");
    expect(indexedAssetFileName("0001", "sub/pic.svg")).toBe("0001-pic.svg");
    expect(indexedAssetFileName("0021", ".excalidraw")).toBe("0021-excalidraw");
  });
});

describe("migrateKnowledgeBase asset ownership", () => {
  it("reuses the first referencing note's name when two notes share identical bytes", async () => {
    const root = await makeOldKb();
    const note3 = path.join(root, "notes", "0003. 第三篇");
    await fs.mkdir(path.join(note3, "assets"), { recursive: true });
    await fs.writeFile(path.join(note3, ".tnotes.json"), JSON.stringify({ id: "uuid-3" }));
    await fs.writeFile(path.join(note3, "README.md"), "## 正文\n\n![图](./assets/pic.png)\n");
    await fs.writeFile(path.join(note3, "assets", "pic.png"), "png-1");
    await fs.appendFile(path.join(root, "TOC.md"), "- [ ] 0003. 第三篇\n");

    const report = await migrateKnowledgeBase(root);
    expect(report.assetsRenamed["0003. 第三篇/assets/pic.png"]).toBeUndefined();
    const doc3 = await createWorkspace({ rootPath: root }).notes.read("0003");
    expect(doc3.content).toContain("](../assets/0001-pic.png)");
    await expect(fs.stat(path.join(root, "assets", "0003-pic.png"))).rejects.toThrow();
  });
});

describe("buildMigratedKbConfig", () => {
  it("drops non-http icons and invalid ports", () => {
    const config = buildMigratedKbConfig(
      {
        repoName: "TNotes.demo",
        port: 99.5,
        root_item: {
          title: "Demo",
          icon: { src: "../assets/local.svg" },
        },
      },
      { directoryName: "TNotes.demo" },
    );
    expect(config.icon).toBeUndefined();
    expect(config.port).toBeUndefined();
    expect(config.name).toBe("TNotes.demo");
    expect(config.repositoryUrl).toBe("https://github.com/tnotesjs/TNotes.demo");
    expect(config.base).toBe("/TNotes.demo/");
    expect(config.stats).toEqual({ enabled: true });
  });
});

describe("CANONICAL_GITIGNORE", () => {
  it("covers install and SSG output", () => {
    expect(CANONICAL_GITIGNORE).toContain("node_modules/");
    expect(CANONICAL_GITIGNORE).toContain(".tnotes/dist");
  });
});

describe("CANONICAL_GITATTRIBUTES", () => {
  it("keeps markdown on LF and marks images binary", () => {
    expect(CANONICAL_GITATTRIBUTES).toContain("*.md text eol=lf");
    expect(CANONICAL_GITATTRIBUTES).toContain("*.png binary");
  });
});
