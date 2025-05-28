# [0046. 使用数据库](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0046.%20%E4%BD%BF%E7%94%A8%E6%95%B0%E6%8D%AE%E5%BA%93)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 使用数据库](#2--使用数据库)

<!-- endregion:toc -->

## 1. 📝 概述

- **使用数据库**
  - 在 MySQL 中，`USE <数据库名>;` 是一个非常基础但常用的命令，用于 **切换当前会话所使用的默认数据库**。
  - 当你连接到 MySQL 服务器后，如果没有指定默认数据库，是不能直接执行对表的操作（如 `SELECT`, `INSERT`, `UPDATE`, `DELETE` 等）的。
  - 此时就需要通过 `USE` 命令来选择一个数据库作为当前操作的目标。
- **相关命令**
  - 使用数据库：`USE <数据库名>;`
    - 示例：`USE test_db;`
  - 查看当前使用的是哪个数据库：`SELECT DATABASE();`
  - 连接时直接使用数据库：`mysql -u <用户名> -p <数据库名>`
    - 示例：`mysql -u root -p test_db;`
    - 这相当于登录后自动执行了 `USE test_db;`。
- **一些注意事项**
  - 数据库必须存在，否则会报错：`Unknown database 'xxx'`。
  - 当前用户必须有访问目标数据库的权限，否则会报错：`Access denied for user 'xxx'@'xxx' to database 'xxx'`。

## 2. 💻 使用数据库

```sql
-- 查看当前 MySQL 服务器中所有的数据库
SHOW DATABASES;
-- +--------------------+
-- | Database           |
-- +--------------------+
-- | information_schema |
-- | mysql              |
-- | performance_schema |
-- | sys                |
-- +--------------------+
-- 4 rows in set (0.001 sec)

-- 查看当前会话正在使用的数据库（此时未使用 USE 命令，所以为 NULL）
SELECT DATABASE();
-- +------------+
-- | DATABASE() |
-- +------------+
-- | NULL       |
-- +------------+
-- 1 row in set (0.000 sec)

-- 创建一个新的数据库 test_db
CREATE DATABASE test_db;
-- Query OK, 1 row affected (0.005 sec)

-- 再次查看所有数据库，发现新增了 test_db
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
-- 5 rows in set (0.001 sec)

-- 再次查看当前会话的默认数据库，依然是 NULL，因为还没有切换
SELECT DATABASE();
-- +------------+
-- | DATABASE() |
-- +------------+
-- | NULL       |
-- +------------+
-- 1 row in set (0.000 sec)

-- 切换到 test_db 数据库，作为当前会话的默认数据库
-- 如果数据库存在，MySQL 会输出 `Database changed`
-- 如果不存在，会提示错误：Unknown database 'xxx'
USE test_db;
-- Database changed

-- 最后确认当前会话所使用的数据库是否已变为 test_db
SELECT DATABASE();
-- +------------+
-- | DATABASE() |
-- +------------+
-- | test_db    |
-- +------------+
-- 1 row in set (0.000 sec)
```
