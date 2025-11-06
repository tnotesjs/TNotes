# GitHub Copilot 指令

## 项目概述

- 这是一个使用 VitePress 构建的 TNotes 开源知识库项目的根知识库。
- 你可以通过其中一个子知识库 [TNotes.instruction](https://tnotesjs.github.io/TNotes.introduction/) 来了解 TNotes 知识库的基本信息。
- 根知识库不纪录笔记，只提供快速导航功能，核心导航功能封装在 `KnowledgeNavigator.vue` 组件中。
- 所有知识库均存放在 GitHub 上的 [tnotesjs](https://github.com/tnotesjs) 组织中。

## TNotes 知识库架构

```bash
├── TNotes # 根知识库
├── TNotes.algorithms # 算法知识库
├── TNotes.c-cpp # C/C++ 知识库
├── TNotes.canvas # Canvas 知识库
├── TNotes.chrome # Chrome 浏览器知识库
├── TNotes.cooking # 菜谱知识库
├── TNotes.egg # Egg.js 框架知识库
├── TNotes.electron # Electron 知识库
├── TNotes.en-notes # 英语笔记知识库
├── TNotes.en-words # 英语单词知识库（这个知识库比较特殊，里面全都是 .md 文件，代表着一个个单词）
├── TNotes.footprints # 个人足迹知识库
├── TNotes.git-notes # Git 笔记知识库
├── TNotes.introduction # TNotes 知识库介绍知识库
├── TNotes.javascript # JavaScript 笔记知识库
├── TNotes.leetcode # LeetCode 笔记知识库
├── TNotes.miniprogram # 小程序笔记知识库
├── TNotes.network # 网络笔记知识库
├── TNotes.nodejs # Node.js 笔记知识库
├── TNotes.notes # 个人笔记知识库
├── TNotes.python # Python 笔记知识库
├── TNotes.react # React 笔记知识库
├── TNotes.redis # Redis 笔记知识库
├── TNotes.sql # SQL 笔记知识库
├── TNotes.svg # SVG 笔记知识库
├── TNotes.typescript # TypeScript 笔记知识库
├── TNotes.vite # Vite 笔记知识库
├── TNotes.vitepress # VitePress 笔记知识库
├── TNotes.vscode # VSCode 笔记知识库
├── TNotes.vue # Vue 笔记知识库
└── TNotes.webpack # Webpack 笔记知识库
└── TNotes.…… # ……
```

示例：

```bash
TNotes # 假设当前位置是在根知识库
# 可以通过 cd ../TNotes.introduction 相对路径向上找，找到 TNotes.introduction 子知识库
# 所有知识库都位于同一个目录下
```
