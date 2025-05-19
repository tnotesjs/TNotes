# [0032. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0032.%20xxx)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

数据类型的支持

- MySQL 8.0 支持将表达式用作数据类型的默认值，包括 BLOB、TEXT、GEOMETRY 和 JSON 数据类型，在以前的版本中是根本不会被分配默认值的。

支持表达式作为默认值

- 在以前的版本中，某些类型（如 BLOB、TEXT、JSON）不能指定默认值。
- MySQL 8.0 支持使用表达式作为字段的默认值。

```sql
CREATE TABLE t1 (
    id INT PRIMARY KEY,
    created_at DATETIME DEFAULT (NOW())
);
```
