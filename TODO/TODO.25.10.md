# TODO

## ⏰ PENDING

- ⏰ 搬运 TNotes.vite 笔记
- ⏰ 搬运 TNotes.typescript 笔记
- ⏰ 根知识库 TNotes 添加搜索功能
  - 支持对笔记名称、笔记 ID、笔记目录的模糊搜索
  - 知识库区分
    - 需要注意如何区分不同的知识库，比如参考 github search 的效果，支持对不同知识库进行过滤
    - 输入：`xxx：搜索内容`，表示只搜索 `xxx` 知识库下的内容
    - 在自定义的 folder 组件中，添加一个搜索框，用户可以先选中指定的知识库，然后再进行搜索
- ⏰ tnotes core 优化
  - 简化 root 知识库的功能 - 核心实现：子知识库的导航
  - 移除不用再使用的历史脚本
  - 移除不再使用的 npm 包
- ⏰ 评论迁移到 tnotesjs 组织下无法使用的问题
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-09-06-21-48-54.png)
  - 将 discussions 仓库迁移到 tnotesjs 组织下之后，发现无法接入 giscus 评论功能，暂且将 discussions 迁回 Tdahuyou 中。

## ✅ DONE

- ✅ 优化 TNotes.introduction
- ✅ 完成 TNotes.leetcode 0001-3600 非会员题的题目描述搬运工作
- ✅ 完善 Swiper 组件的翻页体验，在头部添加上一页和下一页的切换按钮
