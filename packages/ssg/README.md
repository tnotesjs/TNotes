# @tnotesjs/ssg

TNotes 知识库的静态站点生成器。

自由绘图将与 Desk 共用 `@tnotesjs/ui` 的 Excalidraw 组件，数据源是 `assets/*.excalidraw`。在组件落地前，构建不要丢弃这些文件，也不要用派生 SVG 覆盖它们。`copyAssets` 递归原样复制整个 `assets/`，不要把 journal、回收区或缩略图缓存放进该目录。

```ts
import { defineConfig } from '@tnotesjs/ssg'

export default defineConfig({
  base: '/my-kb/',
  title: 'my-kb'
})
```

```sh
tnotes-ssg build
tnotes-ssg dev
tnotes-ssg preview
```

笔记正文里的 `{{` / `}}` 会被编码，不当 Vue 插值。交互值放进 `.vue` 或组件 prop。
