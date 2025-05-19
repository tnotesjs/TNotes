# [0036. MySQL 8.0 新特性 - 统计直方图](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0036.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E7%BB%9F%E8%AE%A1%E7%9B%B4%E6%96%B9%E5%9B%BE)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

统计直方图

- MySQL 8.0 实现了统计直方图。利用直方图，用户可以对一张表的一列做数据分布的统计，特别是针对没有索引的字段。这可以帮助查询优化器找到更优的执行计划。

统计直方图（Histogram Statistics）

- **用途**：帮助优化器更准确评估查询代价
- **应用场景**：对无索引字段进行分布统计
- **创建方式**：
  ```sql
  ANALYZE TABLE table_name UPDATE HISTOGRAM ON column_name;
  ```
