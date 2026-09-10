# @tnotesjs/ssg

The additive, Vite-powered static-site generator for TNotes knowledge bases. It
owns only the pieces TNotes consumes: Markdown-to-Vue compilation, filesystem
routes, static rendering, dead-link validation, local search, preview and a
small responsive shell. It has no VitePress runtime dependency.

```ts
// tnotes.config.mts
import { defineConfig } from "@tnotesjs/ssg";

export default defineConfig({
  base: "/my-kb/",
  title: "my-kb",
});
```

```sh
tnotes-ssg build
tnotes-ssg dev
tnotes-ssg preview
```

Supported compatibility boundaries are covered by fixtures: Markdown with Vue
SFC blocks and components, literal `{{ }}` in prose (not live interpolations),
base paths, dead-link checks, local search, math, containers, shared Shiki code
blocks and static HTML output.

Markdown notes are documents. `{{` / `}}` in the body, inline code, and raw HTML
are encoded so Vue's template compiler leaves them alone — the same characters
show in Desk, GitHub, and the published site. Interactive values belong in a
sibling `.vue` file or a component prop (`:text="message"`), not in `{{ n }}`
written into the Markdown.

Production pages SSR each note in isolation, then hydrate only the chrome
(search, theme, sidebar). Article widgets (code groups, copy, mermaid, mindmap)
are enhanced from the static HTML so the client bundle never compiles every
note SFC. `tnotes-ssg dev` SSRs the requested page on demand instead of
rebuilding the whole site on each change.
