# [0001. 25.05](https://github.com/Tdahuyou/TNotes.change-log/tree/main/notes/0001.%2025.05)

<!-- region:toc -->

- [1. 🗓 25.05.11](#1--250511)
- [2. 🗓 25.05.10](#2--250510)
- [3. 🗓 25.05.09](#3--250509)
- [4. 🗓 25.05.08](#4--250508)
- [5. 🗓 25.05.07](#5--250507)
- [6. 🗓 25.05.06](#6--250506)
- [7. 🗓 25.05.03](#7--250503)
- [8. 🗓 25.05.02](#8--250502)

<!-- endregion:toc -->

## 1. 🗓 25.05.11

- change-log
  - 初始化 TNotes.change-log 知识库
  - 完成 `0002. 25.04`，将上个月记录的已完成的部分内容搬运到这篇笔记中。
  - 创建 `0001. 25.05`，记录这个月接下来的一些 TNotes 日志。

## 2. 🗓 25.05.10

- en-notes
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-38-38.png)
  - 实现单词发音功能
    - 支持英音、美音
    - 支持批量播放
      - 被朗读的单词会默认高亮
      - ![图 4](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-39-34.png)
      - 在批量播放过程中，播放任意单词，将会中止后续的播放流程。
  - 词汇预加载 - 优化单词卡片的加载体验
- mysql
  - 初始化 TNotes.mysql 知识库
  - 完成笔记 `1. MySQL 8 从入门到精通`
  - 初始化 TNotes.yuque - mysql.0001，将书籍《MySQL 8 从入门到精通》中的相关资源（视频 + 课件）搬运到语雀上，以便后续在线预览。
  - ![图 5](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-22-48-40.png)

## 3. 🗓 25.05.09

- en-notes
  - 优化 TNotes.en-notes 中的单词本用到的词汇渲染组件
  - 实现加载单词卡片功能
    - 鼠标放在单词上，自动加载单词数据，并以 card 的形式来呈现。
    - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-32-43.png)
  - 实现单词卡片的 pin 功能
    - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-34-29.png)
    - 实现单词卡片的拖动功能
    - 实现单词卡片的尺寸调节功能
    - 实现层级自动调节功能（被点击的 card 默认置顶）

## 4. 🗓 25.05.08

- TNotes
  - 优化 TNotes 首页，后续新增的笔记仓库统一汇总到首页中，做成一个卡片的形式来呈现。
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-30-31.png)

## 5. 🗓 25.05.07

- network
  - 初始化 TNotes.network 知识库

## 6. 🗓 25.05.06

- TNotes
  - 首页文案移除 `Tdahuyou の notes`
  - 整理语雀上工具分享相关的笔记内容
  - 修改默认的笔记模板
  - ![图 5](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-43-32.png)
- en-notes
  - consecutive

## 7. 🗓 25.05.03

- electron
  - 将 TNotes.electron 笔记仓库过一遍，优化文档结构。（整理了一小部分）

## 8. 🗓 25.05.02

- TNotes
  - 修复 Swiper 组件的格式问题
- typescript
  - TNotes.typescript 初始化
