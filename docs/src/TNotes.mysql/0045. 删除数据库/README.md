# [0045. 删除数据库](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0045.%20%E5%88%A0%E9%99%A4%E6%95%B0%E6%8D%AE%E5%BA%93)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 删除数据库](#2--删除数据库)
- [3. 📒 替代方案：归档数据库而非删除、删除标记](#3--替代方案归档数据库而非删除删除标记)
- [4. 🤔 MySQL 支持一条 `DROP DATABASE` 语句直接删除多个数据库吗？](#4--mysql-支持一条-drop-database-语句直接删除多个数据库吗)
- [5. 🤔 删除数据库都会删除哪些内容？](#5--删除数据库都会删除哪些内容)
- [6. 🤔 使用命令删除数据库时，文件系统会如何处理呢？](#6--使用命令删除数据库时文件系统会如何处理呢)
- [7. 🤔 如果确实有删库的需求，那么在生产环境下，应该如何操作呢？](#7--如果确实有删库的需求那么在生产环境下应该如何操作呢)

<!-- endregion:toc -->

## 1. 📝 概述

- `DROP DATABASE <数据库名称>;`
  - 作用：删除数据库
  - 示例：`DROP DATABASE test_db;`
- **数据库不存在**
  - 删除数据库时，如果数据库不存在，则会返回数据库不存在的错误。
  - 上述示例 `DROP DATABASE test_db;` 可以加上 IF 判断：`DROP DATABASE test_db IF EXISTS;`。
    - 如果数据库 `test_db` 存在，则删除数据库。
    - 如果数据库 `test_db` 不存在，则不会执行删除操作。
  - 这样如果数据库不存在，就不会报错了。
  - 这种方式常用于脚本中，确保不会因为数据库不存在而中断整个脚本的执行。
- **注意事项**
  - 操作前务必确认数据库名称。
  - 在删除过程中不会有任何确认提示。
  - 删除数据库是不可逆操作，请谨慎执行。
  - 建议在测试环境验证后再于生产环境中使用。

## 2. 💻 删除数据库

```sql
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

-- 将 test_db 数据库删除
DROP DATABASE test_db;
-- Query OK, 0 rows affected (0.009 sec)

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
```

## 3. 📒 替代方案：归档数据库而非删除、删除标记

- 如果只是“不再使用”但不想永久删除，可以考虑：归档数据库或删除标记。
- 归档数据库：
  - 将数据库重命名为 `xxx_archive`
  - 移动到单独的实例中保存
  - 设置只读权限供未来审计使用
- 删除标记：
  - 比如将数据库中所有的记录都加上一个删除标记字段 `is_deleted`（布尔值：`0` 或 `1`），并将值设置为 `1`。
  - 从语义上表示这些数据已经被删除了，但实际上还存储在数据库中。
  - 好处是方便恢复，坏处是依旧占用空间。

::: tip 逻辑删除

- 数据是很宝贵的，通常情况下都不会去主动删数据，更多时候是采用添加删除标记这样的方式来实现数据的“逻辑删除”。

:::

## 4. 🤔 MySQL 支持一条 `DROP DATABASE` 语句直接删除多个数据库吗？

- MySQL **不支持一条 `DROP DATABASE` 语句直接删除多个数据库**，但可以通过 **多条 `DROP DATABASE` 语句** 或 **脚本方式** 实现同时删除多个数据库。
- 一些常见做法：
  - 方法一：使用多条 `DROP DATABASE` 语句
  - 方法二：使用存储过程批量删除（适用于大量数据库）

::: code-group

```sql [方法 1]
DROP DATABASE IF EXISTS db1;
DROP DATABASE IF EXISTS db2;
DROP DATABASE IF EXISTS db3;
```

```sql [方法 2]
-- 以下是一个示例存储过程，用于批量删除匹配名称的数据库：
DELIMITER $$

CREATE PROCEDURE drop_multiple_dbs()
BEGIN
    DECLARE db_name VARCHAR(255);
    DECLARE done INT DEFAULT 0;
    DECLARE cur CURSOR FOR SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('db1', 'db2', 'db3');
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO db_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET @s = CONCAT('DROP DATABASE ', db_name, ';');
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

-- 调用存储过程
CALL drop_multiple_dbs();

-- 删除存储过程
DROP PROCEDURE drop_multiple_dbs;
```

:::

## 5. 🤔 删除数据库都会删除哪些内容？

- 删除数据库是一个 **不可逆的操作**，这会彻底删除所有数据和结构，包括：
  - 数据表
  - 存储过程
  - 视图
  - 函数
  - 用户权限（如果与数据库绑定）
- **恢复问题**
  - 删除后无法直接恢复，除非有备份或二进制日志可回滚。
- **主从复制架构**
  - 在主从复制架构中，`DROP DATABASE` 是一条 DDL 操作，默认情况下会在从库上同步执行。

## 6. 🤔 使用命令删除数据库时，文件系统会如何处理呢？

- **对应物理文件也会被删除**
  - `DROP DATABASE` 不仅从 MySQL 元数据中移除数据库信息，还会从文件系统中删除对应的目录及文件（通常位于 `datadir` 下）。
  - 如果手动删除了这些文件而未通过 SQL 删除数据库，MySQL 可能仍然显示数据库存在，需重启才能刷新状态。

## 7. 🤔 如果确实有删库的需求，那么在生产环境下，应该如何操作呢？

- 在删除前建议先检查数据库内容

```sql
-- 可以在删除前执行如下查询以确认数据库内有哪些对象：

-- 查看数据库内的所有表
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'your_db_name';

-- 查看存储过程/函数
SELECT routine_name, routine_type FROM information_schema.routines
WHERE routine_schema = 'your_db_name';
```

- 生产环境流程：备份 → 检查依赖 → 测试验证 → 日志记录

| 步骤                | 内容                                   |
| ------------------- | -------------------------------------- |
| 1. 备份数据库       | 删除前必须完整备份目标数据库           |
| 2. 检查依赖         | 是否有服务、应用或用户还在使用该数据库 |
| 3. 使用 `IF EXISTS` | 避免因数据库不存在导致报错中断脚本     |
| 4. 测试环境验证     | 在非生产环境测试删除逻辑               |
| 5. 记录操作日志     | 包括时间、操作人、删除的数据库名称等   |

- 自动化脚本中应加入日志记录
  - 当在脚本中批量删除多个数据库时，建议添加日志输出以便后续排查问题：

```bash
echo "Dropping database: $db" >> /path/to/drop_log.txt
mysql -e "DROP DATABASE IF EXISTS $db;" >> /path/to/drop_log.txt 2>&1
```
