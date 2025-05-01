# [0029. 固定的标签换行展示](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0029.%20%E5%9B%BA%E5%AE%9A%E7%9A%84%E6%A0%87%E7%AD%BE%E6%8D%A2%E8%A1%8C%E5%B1%95%E7%A4%BA)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 固定的标签换行展示](#2--固定的标签换行展示)

<!-- endregion:toc -->

## 1. 📝 概述

- 介绍了如何在 vsocde 中，将固定的 tab 和非固定的 tab 换行显示的配置，以及换行显示的应用场景。

## 2. 📒 固定的标签换行展示

- 在配置中，找到 `Wrokbench > Editor: Pinned Tabs On Separate Row`，将其勾选上。这可以让固定的标签展示在非固定标签的上边，可以更方便地管理固定的标签。
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-09-22-50-28.png)
- 在阅读一些大型项目的源码时，通常会将一些比较重要的模块设置为固定标签，以防不小心被关闭掉。
- 如果想要将不重要的标签给关闭掉，可以使用快捷键 `cmd k cmd w` （macOS） `ctrl k ctrl w` （windows） 来关闭，这不会对固定标签有影响。
- **拖拽**：将非固定的标签拖到固定标签所在的行，非固定标签就自动转为固定标签。
