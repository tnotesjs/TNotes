# [0035. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0035.%20xxx)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

窗口函数（Window Functions）

- 类似聚合函数，但不合并多行为一行
- 示例函数：
  - `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`
  - `SUM(...) OVER (...)`, `AVG(...) OVER (...)`

```sql
SELECT name, salary,
       RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```
