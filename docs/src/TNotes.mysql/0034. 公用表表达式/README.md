# [0034. 公用表表达式](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0034.%20%E5%85%AC%E7%94%A8%E8%A1%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

公用表表达式

- MySQL 现在支持非递归和递归的公用表表达式。公用表表达式允许使用命名的临时结果集，通过允许 WITH 语句之前的子句 SELECT 和某些其他语句来实现。

公用表表达式（CTE）

- 支持递归和非递归 CTE：
  - 使用 `WITH` 定义临时结果集
  - 可用于复杂嵌套查询的逻辑拆分，提升可读性

```sql
WITH RECURSIVE cte AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM cte WHERE n < 5
)
SELECT * FROM cte;
```
