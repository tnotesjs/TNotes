# [0015. 创建数据库](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0015.%20%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 查看所有数据库](#2--查看所有数据库)
- [3. 🤔 MySQL 支持一条 CREATE DATABASE 语句直接创建多个数据库吗？](#3--mysql-支持一条-create-database-语句直接创建多个数据库吗)

<!-- endregion:toc -->

## 1. 📝 概述

- 创建数据库：`CREATE DATABASE <数据库名>;`
  - 示例：`CREATE DATABASE test_db;`

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

## 3. 🤔 MySQL 支持一条 CREATE DATABASE 语句直接创建多个数据库吗？

- MySQL **不支持通过单条 `CREATE DATABASE` 语句直接创建多个数据库**，但你可以通过以下几种方式实现“一次性”创建多个数据库的需求。
  - 方法一：使用多条 `CREATE DATABASE` 语句
  - 方法二：使用存储过程动态创建多个数据库
  - 方法三：使用脚本语言（如 Bash）批量创建
  - ……

```sql
-- ❌ 不支持的写法（会报错）
-- 错误示例：MySQL 不支持这种语法
CREATE DATABASE db1, db2, db3;

-- 这将导致语法错误。
```

::: code-group

```sql [1]
-- 这是最常见、推荐的做法：
CREATE DATABASE IF NOT EXISTS db1;
CREATE DATABASE IF NOT EXISTS db2;
CREATE DATABASE IF NOT EXISTS db3;

-- 使用 `IF NOT EXISTS` 可避免数据库已存在时的报错。
-- 适用于脚本或初始化 SQL 文件中批量创建数据库。
```

```sql [2]
-- 如果需要根据列表自动创建多个数据库，可以编写一个简单的存储过程：
DELIMITER $$

CREATE PROCEDURE create_multiple_dbs()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 3 DO
        SET @db_name = CONCAT('db', i);
        SET @stmt = CONCAT('CREATE DATABASE IF NOT EXISTS ', @db_name);
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- 调用存储过程
CALL create_multiple_dbs();

-- 删除存储过程（可选）
DROP PROCEDURE create_multiple_dbs;

-- 这种方式适合自动化部署或测试环境中快速创建一批数据库。
```

```bash [3]
# 你也可以在 Shell 脚本中循环执行：
for db in db1 db2 db3; do
    mysql -e "CREATE DATABASE IF NOT EXISTS $db;"
done

# 适用于运维自动化或 CI/CD 环境。
```

:::
