# [0037. MySQL 8.0 新特性 - 备份锁](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0037.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E5%A4%87%E4%BB%BD%E9%94%81)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 8.0 的备份锁是一种**轻量级、面向备份场景的锁机制**，它在保证数据一致性的同时，**不限制 DML 操作**，非常适合用于在线备份和物理快照操作，是替代传统全局锁的重要新特性。
- **备份锁（Backup Lock）**
  - 是一种 **实例级别锁**
  - 在执行备份时使用，确保数据处于一致状态
  - 不会阻塞普通的插入、更新、删除操作（DML）
  - 防止元数据更改（如表结构修改、创建/删除表等）
  - 相比传统的 `FLUSH TABLES WITH READ LOCK`（FTWRL），备份锁更轻量、更细粒度、更安全、对业务影响更小，是专为在线备份设计的新机制。
- **目的**：在不影响 DML 操作的前提下，进行一致性的在线备份。
- **语法**
  - `LOCK INSTANCE FOR BACKUP`
    - 获取备份锁
  - `UNLOCK INSTANCE`
    - 释放备份锁
- **权限要求**
  - 需要 `BACKUP_ADMIN` 权限
- **备份锁的作用**

| 功能             | 描述                                         |
| ---------------- | -------------------------------------------- |
| ✅ 允许 DML 操作 | 插入、更新、删除可以正常进行                 |
| ❌ 禁止 DDL 操作 | 表结构变更、增删表等操作会被阻塞             |
| 防止快照不一致   | 确保备份期间不会发生结构变化，避免一致性问题 |
| 替代传统全局锁   | 比 `FLUSH TABLES WITH READ LOCK` 更灵活      |

- **备份锁与全局锁的区别**

| 特性 | 全局锁（FTWRL） | 备份锁（LOCK INSTANCE FOR BACKUP） |
| --- | --- | --- |
| 命令 | `FLUSH TABLES WITH READ LOCK` | `LOCK INSTANCE FOR BACKUP` |
| 是否阻塞 DML | ✅ 阻塞所有写操作 | ❌ 不阻塞 DML |
| 是否阻塞 DDL | ✅ 阻塞 | ✅ 阻塞 |
| 是否适合在线备份 | ⚠️ 影响业务性能 | ✅ 更适合在线备份 |
| 是否可重入 | ❌ 不支持 | ✅ 支持多次加锁 |
| 是否需要手动释放 | ✅ 是 | ✅ 是 |

- **备份锁的使用方式**

```sql
-- 获取备份锁
-- 执行后，系统进入备份保护模式
-- 此时不允许执行 DDL，但 DML 可以继续运行
LOCK INSTANCE FOR BACKUP;

-- 释放备份锁
-- 备份完成后必须手动释放锁
-- 释放后恢复所有操作权限
UNLOCK INSTANCE;

-- 权限要求
-- 必须具有 BACKUP_ADMIN 权限才能执行上述命令
-- 授予用户备份权限
GRANT BACKUP_ADMIN ON *.* TO 'backup_user'@'%';
```

- **使用场景举例：逻辑备份 or 文件系统快照**

```sql
-- 当你使用文件系统工具（如 cp, tar, rsync）做物理备份时：
-- 加锁，保证备份期间表结构不变
LOCK INSTANCE FOR BACKUP;

-- 开始复制数据文件
cp -r /var/lib/mysql /backup/mysql/

-- 释放锁
UNLOCK INSTANCE;

-- 这样可以在不影响业务的前提下完成一致性备份。
```
