import {
  createHighlighterCore,
  type HighlighterCore,
  type ShikiTransformer,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages, bundledLanguagesAlias } from "shiki/langs";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
} from "@shikijs/transformers";

export interface CodeMeta {
  language: string;
  title: string;
  lineNumbers: boolean;
  startLine: number;
  highlightedLines: number[];
}

/**
 * A single cross-repository fixture. Core and Desk both consume this contract in
 * their own test suites, so a parser or DOM change cannot silently diverge.
 */
export const SHARED_CODE_GROUP_CONTRACT = {
  source: [
    "::: code-group",
    "```js:line-numbers=4 {2} [one.js]",
    "console.log(1)",
    "console.log(2)",
    "```",
    "```ts:no-line-numbers [two.ts]",
    "const value: number = 2",
    "```",
    ":::",
  ].join("\n"),
  items: [
    {
      info: "js:line-numbers=4 {2} [one.js]",
      code: "console.log(1)\nconsole.log(2)",
      title: "one.js",
      language: "js",
      lineNumbers: true,
      startLine: 4,
      highlightedLines: [2],
    },
    {
      info: "ts:no-line-numbers [two.ts]",
      code: "const value: number = 2",
      title: "two.ts",
      language: "ts",
      lineNumbers: false,
      startLine: 1,
      highlightedLines: [],
    },
  ],
} as const;

export function parseCodeMeta(info = "", defaultLineNumbers = true): CodeMeta {
  const language =
    info
      .trim()
      .match(/^[^\s{\[]+/)?.[0]
      ?.split(":")[0] || "text";
  const highlightedLines = new Set<number>();
  const ranges = info.match(/\{([\d,\s-]+)\}/)?.[1] || "";
  for (const range of ranges.split(",")) {
    const match = range.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) continue;
    const start = Number(match[1]);
    const end = Number(match[2] ?? start);
    if (start < 1 || end < start || end - start > 10000) continue;
    for (let line = start; line <= end; line++) highlightedLines.add(line);
  }
  return {
    language,
    title: info.match(/\[([^\]]*)\]/)?.[1]?.trim() || "",
    lineNumbers: /:no-line-numbers\b/.test(info)
      ? false
      : /:line-numbers\b/.test(info) || defaultLineNumbers,
    startLine: Math.max(1, Number(info.match(/:line-numbers=(\d+)/)?.[1] || 1)),
    highlightedLines: [...highlightedLines].sort((a, b) => a - b),
  };
}

let singleton: Promise<HighlighterCore> | undefined;
let ready: HighlighterCore | undefined;
const loading = new Map<string, Promise<void>>();

export function normalizeCodeLanguage(language: string): string {
  const id = language.toLowerCase();
  if (id === "plain" || id === "txt" || id === "plaintext" || !id)
    return "text";
  if (id in bundledLanguages || id in bundledLanguagesAlias) return id;
  // Unknown labels retain their caption, but display safely as plain text.
  return "text";
}

/** One engine and one grammar cache for build-time and browser consumers. */
export async function prepareCodeHighlighter(
  languages: string[] = [],
): Promise<HighlighterCore> {
  singleton ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [
      import("shiki/themes/github-light.mjs"),
      import("shiki/themes/github-dark.mjs"),
    ],
    langs: [],
  }).then((highlighter) => (ready = highlighter));
  const highlighter = await singleton;
  await Promise.all(
    languages.map(async (requested) => {
      const language = normalizeCodeLanguage(requested);
      if (
        language === "text" ||
        highlighter.getLoadedLanguages().includes(language)
      )
        return;
      let pending = loading.get(language);
      if (!pending) {
        const loader =
          bundledLanguages[language as keyof typeof bundledLanguages] ??
          bundledLanguagesAlias[language as keyof typeof bundledLanguagesAlias];
        pending = highlighter.loadLanguage(loader).then(() => undefined);
        loading.set(language, pending);
        pending.catch(() => loading.delete(language));
      }
      await pending;
    }),
  );
  return highlighter;
}

function transformers(meta: CodeMeta): ShikiTransformer[] {
  return [
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationFocus(),
    transformerNotationErrorLevel(),
    {
      name: "tnotes-code-meta",
      pre(node) {
        this.addClassToHast(node, "tn-code-highlight");
        node.properties.tabindex = 0;
      },
      line(node, line) {
        node.properties["data-line"] = String(meta.startLine + line - 1);
        if (meta.highlightedLines.includes(line))
          this.addClassToHast(node, "highlighted");
      },
    },
  ];
}

/** Markdown renderers prewarm document languages before their synchronous render pass. */
export function highlightCodeSync(code: string, info = ""): string {
  if (!ready)
    throw new Error("Call prepareCodeHighlighter before rendering Markdown");
  const meta = parseCodeMeta(info);
  const normalizedLanguage = normalizeCodeLanguage(meta.language);
  const language = ready.getLoadedLanguages().includes(normalizedLanguage)
    ? normalizedLanguage
    : "text";
  return ready.codeToHtml(code.replace(/\n$/, ""), {
    lang: language,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: transformers(meta),
  });
}

export async function highlightCode(code: string, info = ""): Promise<string> {
  await prepareCodeHighlighter([parseCodeMeta(info).language]);
  return highlightCodeSync(code, info);
}
