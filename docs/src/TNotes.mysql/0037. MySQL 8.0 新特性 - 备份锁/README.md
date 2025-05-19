# [0037. MySQL 8.0 新特性 - 备份锁](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0037.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E5%A4%87%E4%BB%BD%E9%94%81)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

备份锁

- 新类型的备份锁在联机备份期间允许 DML，同时防止可能导致快照不一致的操作。新的备份锁由 LOCK INSTANCE FOR BACKUP 和 UNLOCK INSTANCE 语法支持。管理员拥有 BACKUP_ADMIN 权限才能使用这些语句。

备份锁（Backup Locks）

- **目的**：在不影响 DML 操作的前提下，进行一致性的在线备份
- **语法**：
  ```sql
  LOCK INSTANCE FOR BACKUP;
  -- 执行备份操作
  UNLOCK INSTANCE;
  ```
- **权限要求**：需要 `BACKUP_ADMIN` 权限
