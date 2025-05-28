# [0043. 查看所有数据库](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0043.%20%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%E5%BA%93)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 查看所有数据库](#2--查看所有数据库)
- [3. 📒 mysql 默认自带的数据库简介](#3--mysql-默认自带的数据库简介)

<!-- endregion:toc -->

## 1. 📝 概述

- `SHOW DATABASES;`
- 作用：查看所有数据库

## 2. 💻 查看所有数据库

```sql {26}
-- 查看所有数据库
SHOW DATABASES;
-- +--------------------+
-- | Database           |
-- +--------------------+
-- | information_schema |
-- | mysql              |
-- | performance_schema |
-- | sys                |
-- +--------------------+
-- 4 rows in set (0.002 sec)

-- 创建一个名为 test_db 的数据库
CREATE DATABASE test_db;
-- Query OK, 1 row affected (0.003 sec)

-- 再次查看所有数据库
SHOW DATABASES;
-- +--------------------+
-- | Database           |
-- +--------------------+
-- | information_schema |
-- | mysql              |
-- | performance_schema |
-- | sys                |
-- | test_db            |
-- +--------------------+
-- 5 rows in set (0.002 sec)
```

## 3. 📒 mysql 默认自带的数据库简介

```sql {6-9}
-- 查看所有数据库
SHOW DATABASES;
-- +--------------------+
-- | Database           |
-- +--------------------+
-- | information_schema |
-- | mysql              |
-- | performance_schema |
-- | sys                |
-- +--------------------+
-- 4 rows in set (0.002 sec)

-- 当你安装好 mysql 之后，即便你还没有创建任何数据库，
-- 当你运行 `SHOW DATABASES;` 命令时，也会打印一些数据库出来。

-- 因为这 4 个数据库是 MySQL 默认自带的系统数据库。

-- 以下是它们的简要介绍：
```

| Database | 说明 |
| --- | --- |
| `information_schema` | 提供了关于数据库元数据的信息，如数据库名、表名、列的数据类型等。 |
| `mysql` | 存储了 MySQL 的用户权限信息、日志、时区等核心数据。 |
| `performance_schema` | 用于性能监控，记录 MySQL 内部运行过程中的性能相关数据。 |
| `sys` | 基于 `performance_schema` 提供的一组视图，简化性能数据的查询和分析。 |
