# [0036. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0036.%20xxx)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

统计直方图（Histogram Statistics）

- **用途**：帮助优化器更准确评估查询代价
- **应用场景**：对无索引字段进行分布统计
- **创建方式**：
  ```sql
  ANALYZE TABLE table_name UPDATE HISTOGRAM ON column_name;
  ```
