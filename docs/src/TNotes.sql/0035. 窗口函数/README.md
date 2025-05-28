# [0035. 窗口函数](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0035.%20%E7%AA%97%E5%8F%A3%E5%87%BD%E6%95%B0)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

窗口函数

- 在 MySQL 8.0 版本中，新增了一个窗口函数，用它可以实现很多新的查询方式。窗口函数类似于 SUM()、COUNT()那样的集合函数，但它并不会将多行查询结果合并为一行，而是将结果放回多行当中。

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
