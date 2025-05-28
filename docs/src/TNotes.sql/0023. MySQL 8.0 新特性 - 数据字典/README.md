# [0023. MySQL 8.0 新特性 - 数据字典](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0023.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E6%95%B0%E6%8D%AE%E5%AD%97%E5%85%B8)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

| 特性         | 描述                                             |
| ------------ | ------------------------------------------------ |
| **事务支持** | 数据字典的操作现在是事务性的，可以回滚和提交     |
| **一致性**   | 避免了老版本中由于多个来源导致的元数据不一致问题 |
| **原子 DDL** | 支持原子数据定义语句，DDL 操作具备 ACID 特性     |

- **数据字典（Data Dictionary）**
  - 数据字典是数据库管理系统中的一个核心组件，用于存储和管理数据库中所有对象的元数据信息。
  - 在 MySQL 8.0 中引入了事务性数据字典，这是对早期版本的重大改进。
  - **🤔 元数据是？**
    - 元数据是描述数据的数据。
    - 你可以把数据字典想象成一本“数据库的目录”，它记录了数据库中所有的表、列、索引、约束等结构信息。这些信息称为 **元数据**，即描述数据库内容的数据。
- **作用**：
  - **替代旧机制**：MySQL 8.0 之前，这些元数据信息被分散地存储在文件（如 `.frm` 文件）或非事务性表中，这种方式存在一致性差、性能低等问题。
  - **集中管理**：MySQL 8.0 使用事务性数据字典将所有元数据统一存储在一个基于 `InnoDB` 的系统表中，这样可以保证数据的一致性和可靠性。
  - **支持原子 DDL**：事务性数据字典为 MySQL 提供了实现原子数据定义语句（Atomic DDL）的基础，确保 DDL 操作要么完全成功，要么完全失败，不会留下部分更改的状态。
- **优势**：
  - 支持事务操作，提升一致性与可靠性
  - 为原子 DDL 提供基础支持
- **示例**：

```sql
-- 假设我们有一个简单的用户表 `users`
-- 以下是一些通过数据字典查询数据库结构的例子

-- 查询所有数据库中的表信息
SELECT TABLE_NAME, TABLE_TYPE
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'your_database_name';

-- 查询特定表的列信息
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'your_database_name';

-- 上面的 SQL 查询使用了 information_schema，它是访问数据字典的一种方式，提供了关于数据库对象的标准化视图。
```
