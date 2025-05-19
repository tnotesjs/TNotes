# [0031. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0031.%20xxx)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 增强 JSON 功能主要表现在以下几个方面：
- 添加了 `->>` 运算符，相当于调用 `JSON_UNQUOTE()` 的结果。
- 添加了两个 JSON 聚合函数 JSON_ARRAYAGG() 和 JSON_OBJECTAGG()。
  - JSON_ARRAYAGG() 将列或表达式作为其参数，并将结果聚合为单个 JSON 数组。
  - JSON_OBJECTAGG() 取两个列或表达式，将其解释为键和值，并将结果作为单个 JSON 对象返回。
- 添加了 JSON 实用程序功能 JSON_PRETTY()，JSON 以易于阅读的格式输出现有值；每个 JSON 对象成员或数组值都打印在一个单独的行上，子对象或数组相对于其父对象是 2 个空格。
- 添加的 JSON_MERGE_PATCH() 可以合并符合 RFC 7396 标准的 JSON。在两个 JSON 对象上使用时，可以将它们合并为单个 JSON 对象。

JSON 功能增强

- **新增运算符 `->>`**：
  - 相当于 `JSON_UNQUOTE(JSON_EXTRACT(...))`
- **新增聚合函数**：
  - `JSON_ARRAYAGG()`：将多行数据合并为 JSON 数组
  - `JSON_OBJECTAGG(key, value)`：将列转换为 JSON 对象
- **JSON 实用函数**：
  - `JSON_PRETTY()`：美化输出格式
  - `JSON_MERGE_PATCH()`：按 RFC 7396 合并 JSON 对象
