# [0028. InnoDB 简介](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0028.%20InnoDB%20%E7%AE%80%E4%BB%8B)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 创建使用 InnoDB 的表](#2--创建使用-innodb-的表)
- [3. 📒 从 MySQL 8.0 开始，系统表全部换成事务型的 InnoDB 表](#3--从-mysql-80-开始系统表全部换成事务型的-innodb-表)

<!-- endregion:toc -->

## 1. 📝 概述

- **InnoDB**
  - **InnoDB 是 MySQL 中支持事务、行锁、外键等高级特性的存储引擎，是现代 MySQL 应用中最常用的引擎，适合高并发、数据一致性要求高的场景。**
- **InnoDB 的核心特性**

| 特性 | 描述 |
| --- | --- |
| **事务支持（ACID）** | 支持完整的事务（Transaction），包括原子性、一致性、隔离性和持久性 |
| **行级锁（Row-level Locking）** | 提供更细粒度的并发控制，提高多用户访问时的性能 |
| **外键约束（Foreign Key）** | 支持外键，确保数据完整性和关联表之间的一致性 |
| **崩溃恢复能力（Crash Recovery）** | 自动恢复未完成的事务，保证数据一致性 |
| **MVCC（多版本并发控制）** | 实现高并发访问时的数据一致性视图 |
| **缓冲池（Buffer Pool）** | 将热点数据缓存在内存中，加快查询速度 |

- **InnoDB 和 MyISAM 的区别（简要对比）**

| 功能     | InnoDB             | MyISAM                 |
| -------- | ------------------ | ---------------------- |
| 事务支持 | ✅ 支持            | ❌ 不支持              |
| 行级锁   | ✅ 支持            | ❌ 仅支持表级锁        |
| 外键支持 | ✅ 支持            | ❌ 不支持              |
| 崩溃恢复 | ✅ 强大            | ⚠️ 较弱                |
| 适用场景 | OLTP（高并发读写） | OLAP（只读或批量处理） |

- **适用场景**
  - 高并发写入场景（如电商订单系统）
  - 需要事务和一致性保障的业务
  - 需要外键约束维护数据一致性的系统
  - 对崩溃恢复有要求的生产环境

## 2. 💻 创建使用 InnoDB 的表

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
) ENGINE=InnoDB;

-- ENGINE=InnoDB
-- 这一部分指定了使用的存储引擎为 InnoDB。
-- 如果你没有显式指定 ENGINE=InnoDB，在 MySQL 5.5 及之后版本中也会默认使用 InnoDB。
```

## 3. 📒 从 MySQL 8.0 开始，系统表全部换成事务型的 InnoDB 表

```sql {10}
-- 从 MySQL 8.0 开始，系统表全部换成事务型的 InnoDB 表，默认的 MySQL 实例将不包含任何 MyISAM 表，除非手动创建 MyISAM 表。

-- 在 MySQL 5.7 版本中查看系统表类型，结果如下：
SELECT DISTINCT(ENGINE) FROM information_schema.tables;
-- +--------------------+
-- | ENGINE             |
-- +--------------------+
-- | MEMORY             |
-- | InnoDB             |
-- | MyISAM             |
-- | CSV                |
-- | PERFORMANCE_SCHEMA |
-- | NULL               |
-- +--------------------+

-- 当前 25.05 所使用的 mysql 版本：
-- mysql --version
-- mysql  Ver 9.3.0-commercial for macos15 on arm64 (MySQL Enterprise Server - Commercial)

-- 查看系统表类型，结果如下：
SELECT DISTINCT(ENGINE) FROM information_schema.tables;
-- +--------------------+
-- | ENGINE             |
-- +--------------------+
-- | InnoDB             |
-- | NULL               |
-- | PERFORMANCE_SCHEMA |
-- | CSV                |
-- +--------------------+
-- 4 rows in set (0.003 sec)
```
