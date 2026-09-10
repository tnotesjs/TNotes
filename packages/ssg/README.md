# @tnotesjs/ssg

TNotes 知识库的静态站点生成器。

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
