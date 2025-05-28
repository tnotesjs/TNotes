# [0009. 单词本概述](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0009.%20%E5%8D%95%E8%AF%8D%E6%9C%AC%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 单词本组件 `EnWordList.vue` 功能介绍](#2--单词本组件-enwordlistvue-功能介绍)

<!-- endregion:toc -->

## 1. 📝 概述

- 每个单词本存储 100 个词。
- 使用自定义的 EnWordList.vue 组件，完成单词本中词汇列表的渲染。
- 按照字母升序排序
- 自动生成编号
- 实现 checkbox 功能，以便临时自测。
  - 实现 checkbox 缓存：将 checkout 状态存储在 local storage 中，以 pathname 和 word 拼接作为 key

## 2. 📒 单词本组件 `EnWordList.vue` 功能介绍

- 单词卡片：
  - 单词卡片预加载。
  - Pin 单词卡片。
  - 支持配置单词卡片是否自动弹出。
- 朗读
  - 单个词汇。
  - 整个单词本的所有词汇。
- 选中：
  - 全选功能。
  - 全部重置功能。
