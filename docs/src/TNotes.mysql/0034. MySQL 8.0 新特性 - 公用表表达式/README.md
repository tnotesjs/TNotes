# [0034. MySQL 8.0 新特性 - 公用表表达式](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0034.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E5%85%AC%E7%94%A8%E8%A1%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 什么是公用表表达式？](#2--什么是公用表表达式)
- [3. 📒 CTE 的基本语法](#3--cte-的基本语法)
- [4. 📒 非递归 CTE 示例](#4--非递归-cte-示例)
- [5. 📒 递归 CTE 示例](#5--递归-cte-示例)
- [6. 📒 CTE 与子查询的区别](#6--cte-与子查询的区别)
- [7. 📒 使用场景](#7--使用场景)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 8.0 开始支持 **公用表表达式（Common Table Expressions，简称 CTE）**
  - 包括 **非递归 CTE** 和 **递归 CTE**
  - 使用 `WITH` 定义临时结果集
  - 可用于替代复杂的嵌套子查询，提升 SQL 可读性和可维护性
- 在 8.0 之前不支持 CTE，开发者通常使用子查询或临时表来实现类似功能。

| 功能               | MySQL 5.x     | MySQL 8.0       |
| ------------------ | ------------- | --------------- |
| 支持 CTE           | ❌ 不支持     | ✅ 支持         |
| 支持递归 CTE       | ❌ 不支持     | ✅ 支持         |
| 支持命名临时结果集 | ❌ 不支持     | ✅ 支持         |
| 提升查询可读性     | ❌ 依赖子查询 | ✅ CTE 分解逻辑 |
| 处理树形结构数据   | ❌ 困难       | ✅ 强大支持     |

- MySQL 8.0 引入了对公用表表达式（CTE）的支持，包括非递归和递归形式，极大提升了复杂查询的可读性、可维护性和对层级结构数据的处理能力。这是对传统子查询和临时表的一次重要升级。

## 2. 📒 什么是公用表表达式？

- **公用表表达式（CTE）**
  - 是一个命名的临时结果集，可以在一次查询中多次引用。
  - 使用 `WITH` 子句定义，作用范围仅限于当前查询语句。
- **CTE 的特点**：
  - 更清晰的逻辑结构
  - 支持递归查询，适合处理树形、层级数据
  - 可重用、可分解复杂查询逻辑

## 3. 📒 CTE 的基本语法

```sql
WITH [RECURSIVE] cte_name [(column_list)] AS (
    -- 初始化子句（基例成员）
    SELECT ...
    UNION ALL | UNION DISTINCT
    -- 递归子句（仅递归 CTE）
    SELECT ...
)
-- 主查询部分
SELECT * FROM cte_name;
```

- `RECURSIVE`：表示这是一个递归 CTE（非必须）
- `cte_name`：临时结果集名称
- `UNION ALL`：连接初始查询和递归查询

## 4. 📒 非递归 CTE 示例

```sql
-- 查询用户订单信息，使用 CTE 简化嵌套结构
WITH user_orders AS (
    SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_amount
    FROM orders
    GROUP BY user_id
)
-- 主查询使用 CTE 结果
SELECT u.name, o.order_count, o.total_amount
FROM users u
JOIN user_orders o ON u.id = o.user_id;
```

> ✅ 这个 CTE 将“统计每个用户的订单数量和金额”提取为独立模块，使主查询更清晰。

## 5. 📒 递归 CTE 示例

```sql
-- 生成从 1 到 5 的数字序列
WITH RECURSIVE numbers AS (
    -- 基例成员（初始化）
    SELECT 1 AS n
    UNION ALL
    -- 递归成员
    SELECT n + 1 FROM numbers WHERE n < 5
)
-- 最终查询使用递归结果
SELECT * FROM numbers;
```

输出结果：

```
n
---
1
2
3
4
5
```

> 🔁 递归 CTE 非常适用于处理层级结构数据，如组织架构、评论树、目录结构等。

## 6. 📒 CTE 与子查询的区别

| 特性             | 子查询              | CTE                   |
| ---------------- | ------------------- | --------------------- |
| **是否命名**     | ❌ 匿名             | ✅ 有名字             |
| **是否可重用**   | ❌ 不可重复使用     | ✅ 可在多个查询中引用 |
| **是否支持递归** | ❌ 不支持           | ✅ 支持递归查询       |
| **可读性**       | ⚠️ 复杂嵌套时难理解 | ✅ 更清晰、结构化     |
| **性能优化**     | 可能重复执行        | ✅ 可缓存中间结果     |

## 7. 📒 使用场景

- **简化复杂嵌套查询**
  - 替代多层子查询，提高代码可读性
- **递归查询**
  - 处理树状结构（如员工上下级关系、分类目录）
- **分步计算**
  - 将大查询拆分为多个 CTE 步骤，便于调试和复用
- **生成序列或模拟窗口函数**
  - 如生成日期序列、编号列表等

<!-- 公用表表达式

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
``` -->
