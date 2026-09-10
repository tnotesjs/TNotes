# @tnotesjs/ui

Shared Vue UI for TNotes built-in blocks. Consumed by:

- `@tnotesjs/ssg` (static sites / `tnotes-ssg dev`)
- TNotes Desk (Electron visual editor)

## Package rules

- No direct `vitepress` imports in components
- Styles use `--tn-*` tokens (`src/styles/tokens.css`)
- Built-ins use short semantic names in markdown (`BilibiliVideo`, `WordList`); third-party components must use a vendor prefix
- Short one-letter tags (`B` / `E` / `N` / `F`) are **not** supported

## Install

```bash
pnpm add @tnotesjs/ui
```

Requires `vue` `^3.5` (peer).

## Local development

From the monorepo root:

```bash
pnpm install
pnpm --filter @tnotesjs/ui test
pnpm --filter @tnotesjs/ui build
```

## Components

### Shared rendering contract

SSG and Desk import the same token, prose, code-block, and code-group implementation. The
`SHARED_CODE_GROUP_CONTRACT` fixture is exercised in workspace CI so changes to
fence metadata, line numbering, titles, or generated markup cannot drift silently.

| Syntax / capability                                       | SSG page                               | Desk visual edit                                        | Desk read-only        | Desk source        |
| --------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------- | --------------------- | ------------------ |
| Markdown prose (headings, links, lists, tables, quotes)   | Shared `prose.css`                     | Shared typography + editor hit areas                    | Shared `prose.css`    | Canonical Markdown |
| Fenced code + lazy Shiki language loading                 | Shared                                 | Shared in code-group previews; CodeMirror while editing | Shared                | Byte-preserved     |
| `::: code-group`                                          | Shared `CodeGroup`                     | Shared atomic preview                                   | Shared                | Byte-preserved     |
| `:line-numbers`, `:line-numbers=N`, `:no-line-numbers`    | Yes                                    | Yes                                                     | Yes                   | Byte-preserved     |
| `{N}` fence line highlights                               | Yes                                    | Yes (CodeMirror)                                        | Yes                   | Byte-preserved     |
| Shiki `[!code]` annotations                               | No (aligned with Desk)                 | No                                                      | No                    | Shown as source    |
| Inline `<Badge>`                                          | Shared `Badge`                         | Shared inline projection                                | Shared                | Byte-preserved     |
| `NotesTable`                                              | Shared component via host data adapter | Shared component projection                             | Shared                | Byte-preserved     |
| Math                                                      | TNotes SSG MathJax pipeline            | Milkdown/KaTeX                                          | Milkdown/KaTeX        | Byte-preserved     |
| Image lightbox, navigation, zoom, and pan                 | Shared `ImagePreview`                  | Shared `ImagePreview`                                   | Shared `ImagePreview` | N/A                |
| Mermaid / Mindmap / Footprints / BilibiliVideo / WordList | Shared                                 | Shared projection                                       | Shared                | Byte-preserved     |

The hosts may add editing handles, navigation offsets, or knowledge-base data adapters. They must
not redefine the shared color tokens, prose typography, or code rendering shell.

### `BilibiliVideo` — `<BilibiliVideo id="BVxxxx" />`

| Prop       | Default  | Notes                                       |
| ---------- | -------- | ------------------------------------------- |
| `id`       | required | BV id                                       |
| `autoplay` | `false`  | Embed URL sends `autoplay=0` unless enabled |
| `muted`    | `false`  | Embed URL sends `muted=0\|1`                |

```md
<BilibiliVideo id="BV1QR4y1y7GG" :autoplay="true" :muted="true" />
```

### `WordList` — `<WordList :words="[…]" />`

| Prop              | Default                   | Notes                        |
| ----------------- | ------------------------- | ---------------------------- |
| `words`           | `[]`                      | Word strings                 |
| `needSort`        | `false`                   | Sort A→Z by first letter     |
| `wordsBaseUrl`    | en-words blob URL         | Optional host override       |
| `wordsRawBaseUrl` | en-words raw URL          | Optional host override       |
| `features`        | `WORD_LIST_FEATURES_FULL` | Capability flags (see below) |

```md
<WordList :words="['cancel', 'salary']" :needSort="true" />
```

**Features presets** (no consumer/`host` field — capability-based):

| Preset                              | Cards | Fetch word data | Menu Pin | Menu Auto Show Card |
| ----------------------------------- | ----- | --------------- | -------- | ------------------- |
| `WORD_LIST_FEATURES_FULL` (default) | ✓     | ✓               | ✓        | ✓                   |
| `WORD_LIST_FEATURES_STATIC`         | —     | —               | —        | —                   |

### `Mermaid`

Shared diagram preview for SSG and Desk. Markdown fence language: `mermaid`.

| Prop                 | Default   | Notes                                            |
| -------------------- | --------- | ------------------------------------------------ |
| `source`             | `''`      | Plain Mermaid text (Desk)                        |
| `graph`              | `''`      | URI-encoded source (SSG fence)                   |
| `id`                 | auto      | Mermaid render id                                |
| `center`             | `false`   | From fence keyword `center`; omit → not centered |
| `isDark`             | auto      | Or pass explicitly                               |
| `securityLevel`      | `'loose'` | Same default for Desk and site preview           |
| `enableCopy`         | `true`    | Hover copy action                                |
| `enableFullscreen`   | `true`    | Hover fullscreen action                          |
| `enableCenterToggle` | `true`    | Hover center toggle (left of fullscreen)         |

Fence:

- ` ```mermaid ` → not centered
- ` ```mermaid center ` → centered

Icons for the toggle live in `src/components/Mermaid/icons/` (`icon__center_on.svg` / `icon__center_off.svg`).
