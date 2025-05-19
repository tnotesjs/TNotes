# [0033. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0033.%20xxx)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

查询的优化

- MySQL 8.0 在查询方面的优化表现如下：
- MySQL 8.0 开始支持不可见索引。优化器根本不使用不可见索引，但会以其他方式正常维护。默认情况下，索引是可见的。通过不可见索引，数据库管理员可以检测索引对查询性能的影响，而不会进行破坏性的更改。
- MySQL8.0 开始支持降序索引。DESC 在索引定义中不再被忽略，而且会降序存储索引字段。

查询优化增强

- **不可见索引（Invisible Indexes）**：
  - 可临时隐藏索引，测试其对查询性能的影响
  - 使用方式：`CREATE INDEX ... INVISIBLE` 或 `ALTER INDEX ... INVISIBLE`
- **降序索引（Descending Indexes）**：
  - 支持 `DESC` 排序物理存储，提升 ORDER BY 查询效率
