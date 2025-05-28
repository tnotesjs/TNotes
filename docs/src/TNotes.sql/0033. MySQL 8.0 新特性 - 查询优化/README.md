# [0033. MySQL 8.0 新特性 - 查询优化](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0033.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 不可见索引（Invisible Indexes）](#2--不可见索引invisible-indexes)
- [3. 📒 降序索引（Descending Indexes）](#3--降序索引descending-indexes)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 8.0 在查询优化方面进行了多项增强，提升了数据库在复杂查询、排序、索引使用等方面的性能。其中最重要的两个新特性是：
  - **不可见索引（Invisible Indexes）**：允许临时隐藏索引，用于测试其对查询性能的影响。
  - **降序索引（Descending Indexes）**：支持 `DESC` 排序物理存储，提升 `ORDER BY` 查询效率。
- MySQL 8.0 引入的 **不可见索引** 和 **真正的降序索引**，这两个新特性极大地增强了查询优化能力，使得 DBA 可以更灵活地管理索引、提升查询效率，并安全地进行索引变更测试。

| 功能               | MySQL 8.0 之前   | MySQL 8.0           |
| ------------------ | ---------------- | ------------------- |
| 不可见索引         | ❌ 不支持        | ✅ 支持 `INVISIBLE` |
| 降序索引           | ❌ `DESC` 被忽略 | ✅ 物理存储支持降序 |
| 测试索引影响       | 需手动删除/重建  | 可临时隐藏索引      |
| 提升 ORDER BY 性能 | ❌ 需要 filesort | ✅ 利用降序索引加速 |

- 可以结合 `EXPLAIN` 分析执行计划，判断是否使用了预期的索引。
- 对于频繁使用的排序字段，优先考虑建立合适的升序或降序索引。
- 使用不可见索引来评估索引删除对性能的影响，避免直接删除索引导致系统不稳定。

## 2. 📒 不可见索引（Invisible Indexes）

- 不可见索引
  - **不可见索引（Invisible Index）** 是一种“存在但不被查询优化器使用”的索引。
  - 默认情况下，索引是可见的，并且优化器也会使用索引。
  - 对于不可见索引，优化器根本不使用，但会以其他方式正常维护。
  - 你可以创建或修改一个索引为 `INVISIBLE`，这样 MySQL 的查询优化器将完全忽略该索引的存在，但它仍然会被维护（如插入、更新时会同步更新索引数据）。
- 使用场景
  - **测试索引对查询的影响**
    - 比如你想知道某个索引是否真的有用？可以先设置为不可见，观察查询性能变化。
  - **安全删除索引前的验证**
    - 如果你打算删除某个索引，可以先设为不可见，确认不会影响性能后再删除。
- 基本使用：

```sql
-- 创建不可见索引
CREATE INDEX idx_name ON users(username) INVISIBLE;

-- 修改已有索引为不可见
ALTER INDEX idx_name ON users INVISIBLE;

-- 恢复索引可见性
ALTER INDEX idx_name ON users VISIBLE;

-- 示例：

-- 假设有如下表
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    created_at DATETIME
);

-- 创建一个降序索引并设为不可见
CREATE INDEX idx_created_at_desc ON users(created_at DESC) INVISIBLE;

-- 查询不会使用这个索引
-- 此时执行计划中将不会显示使用 idx_created_at_desc 索引。
EXPLAIN SELECT * FROM users ORDER BY created_at DESC;
```

## 3. 📒 降序索引（Descending Indexes）

- 降序索引
  - 在 MySQL 8.0 之前，虽然可以在定义索引时写上 `DESC`，但 MySQL 实际上并不会按降序存储数据。
  - 但在 **MySQL 8.0 及之后版本中，`DESC` 关键字真正生效了，表示该字段按照降序物理存储在 B+Tree 索引中**。
- 示例

```sql
-- 语句 1、语句 2 在 MySQL 8.0 之前效果是一样的。------------------

-- 语句 1
CREATE INDEX idx_name ON users(created_at DESC);

-- 语句 2
CREATE INDEX idx_name ON users(created_at);

-- 降序索引的作用 -----------------------------------------------

-- 当你经常执行以下形式的查询时：
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
-- 如果 created_at 上有降序索引
-- MySQL 就可以直接从索引头部开始读取数据
-- 避免额外的排序操作的开销
-- 在数据量大时，可大幅提升效率

-- 创建降序/升序索引 -----------------------------------------------

-- 升序索引
CREATE INDEX idx_asc ON orders(created_at);

-- 降序索引
CREATE INDEX idx_desc ON orders(created_at DESC);

-- 示例对比 -------------------------------------------------------

-- 表结构：
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10,2),
    created_at DATETIME
);

-- 创建升序和降序索引：
CREATE INDEX idx_asc ON orders(created_at);
CREATE INDEX idx_desc ON orders(created_at DESC);

-- 查询测试：
-- 使用降序索引更高效
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- 使用升序索引需要额外排序
SELECT * FROM orders ORDER BY created_at ASC LIMIT 10;

-- 通过 EXPLAIN 查看执行计划，可以看到是否使用了索引扫描而无需 filesort。
```
