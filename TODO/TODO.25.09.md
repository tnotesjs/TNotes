# TODO

## ⏰ PENDING

- ⏰ tnotes core 优化
  - 简化 root 知识库的功能 - 核心实现：子知识库的导航
  - 移除不用再使用的历史脚本
  - 移除不再使用的 npm 包
- ⏰ 评论迁移到 tnotesjs 组织下无法使用的问题
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-09-06-21-48-54.png)
  - 将 discussions 仓库迁移到 tnotesjs 组织下之后，发现无法接入 giscus 评论功能，暂且将 discussions 迁回 Tdahuyou 中。
- ⏰ **TNotes.canvas 笔记快速过一遍**
  - 检查是否有格式错误
  - 将所有 `🔗 References` 改为 `🔗 引用`

## ✅ DONE

- ✅ TNotes.xxx 实现侧边栏可折叠功能
- ✅ TNotes.xxx 实现全屏专注模式功能
- ✅ 对含有大量笔记的知识库的服务启动和更新进行优化
  - ✅ 添加 `tn:dev:safe` 和 `tn:update:safe` 两个脚本，核心原理：在批量更新所有笔记之前，添加一个停服的步骤：`启动开发服务` -> `记录服务 pid` -> `更新笔记之前停止服务` -> `更新笔记` -> `启动服务`，并加入到了 VSCode 的 tasks 中，以便调用。
    - 优化前：`pnpm tn:dev` 批量更新笔记的时候会导致大量的 README.md IO，此时 vite 服务会不断地 restart，导致服务直接噶掉；
    - 优化后：`pnpm tn:dev:safe` 以 3000+ 数量的笔记 TNotes.leetcode 知识库为例，先停服，再更新，再重启，耗时在 5-10s，比死机好多了，目前还可以接受；
    - TODO：vite 没有停服的开关，尝试通过服务配置延迟监听文件更新的时间，但优化效果不明显，有空可以研究研究 Vite 的实现，是否有其它更优雅的优化方案；
- ✅ 将包管理器改为 pnpm
- ✅ 更新浏览器中 home 链接
  - ![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-09-07-07-26-42.png)
- ✅ tnotesjs seo 优化
  - ✅ 通过 bing 搜索关键字 github tnotesjs 能搜到 TNotes 仓库
- ✅ 修正 TNotes 链接
  - ✅ 更新 bilibili 简介和自动回复的消息
  - ✅ 更新 yuque 首页简介
- ✅ 在 github 上创建 tnotesjs 组织
- ✅ 优化 tnotesjs 所有笔记仓库中的 About 信息
- ✅ 将 TNotes.xxx 统一迁移到 tnotesjs 组织下统一管理
  - ✅ transfer notes
    - ✅ notes -> TNotes
    - ✅ 清理 commit log
  - ✅ transfer TNotes.egg
  - ✅ transfer TNotes.miniprogram
  - ✅ transfer TNotes.typescript
  - ✅ transfer TNotes.electron
  - ✅ transfer TNotes.network
  - ✅ transfer TNotes.vite
  - ✅ transfer TNotes.en-notes
  - ✅ transfer TNotes.nodejs
  - ✅ transfer TNotes.vitepress
  - ✅ transfer TNotes.en-words
    - ✅ 将 zm/notes 中的 en-words 移除
    - ✅ 修改 TNotes core 中对源 en-words 的引用链接
  - ✅ transfer TNotes.notes
  - ✅ transfer TNotes.vscode
  - ✅ transfer TNotes.0
  - ✅ transfer TNotes.footprints
  - ✅ transfer TNotes.python
  - ✅ transfer TNotes.vue
  - ✅ transfer TNotes.c-cpp
  - ✅ transfer TNotes.git-notes
  - ✅ transfer TNotes.react
  - ✅ transfer TNotes.webpack
  - ✅ transfer TNotes.canvas
  - ✅ transfer TNotes.html-css-js
    - ✅ 拆分为 TNotes.javascript、TNotes.html、TNotes.css 3 个独立的仓库
  - ✅ transfer TNotes.redis
  - ✅ transfer TNotes.chrome
  - ✅ transfer TNotes.introduction
  - ✅ transfer TNotes.sql
  - ✅ transfer TNotes.cooking
  - ✅ transfer TNotes.leetcode
  - ✅ transfer TNotes.svg
