# [0034. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0034.%20xxx)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

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
