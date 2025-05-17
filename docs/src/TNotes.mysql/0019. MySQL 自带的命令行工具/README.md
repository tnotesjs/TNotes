# [0019. MySQL 自带的命令行工具](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0019.%20MySQL%20%E8%87%AA%E5%B8%A6%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. ⚙️ `mysql`](#2-️-mysql)
- [3. ⚙️ `mysqldump`](#3-️-mysqldump)
- [4. ⚙️ `mysqladmin`](#4-️-mysqladmin)
- [5. ⚙️ `mysqlimport`](#5-️-mysqlimport)
- [6. ⚙️ `mysqlshow`](#6-️-mysqlshow)
- [7. ⚙️ `mysqld` / `mysqld_safe`](#7-️-mysqld--mysqld_safe)
- [8. ⚙️ `mysqlcheck`](#8-️-mysqlcheck)
- [9. ⚙️ `myisamchk`](#9-️-myisamchk)
- [10. 🤔 如何查看 MySQL 都自带了哪些命令呢？](#10--如何查看-mysql-都自带了哪些命令呢)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 自带了一系列 **命令行工具**，用于数据库的日常管理、维护、备份、恢复等操作。
  - 这些工具通常安装在 MySQL 的 `bin` 目录下（如 `/usr/bin/` 或 `C:\Program Files\MySQL\MySQL Server X.X\bin`），是 MySQL 安装的一部分。
- 常见的 MySQL 命令行工具简介：

| 工具名称      | 功能说明               |
| ------------- | ---------------------- |
| `mysql`       | 连接数据库并执行 SQL   |
| `mysqldump`   | 数据库备份工具         |
| `mysqladmin`  | 管理 MySQL 服务器      |
| `mysqlimport` | 导入文本数据           |
| `mysqlshow`   | 查看数据库、表、列信息 |
| `mysqld`      | MySQL 服务器程序       |
| `mysqld_safe` | 安全启动 MySQL 服务器  |
| `mysqlcheck`  | 检查、修复、优化表     |
| `myisamchk`   | 检查和修复 MyISAM 表   |

## 2. ⚙️ `mysql`

- **功能**：MySQL 的交互式客户端命令行工具，用于连接数据库并执行 SQL 语句。
- **常用用途**：
  - 执行查询、更新数据
  - 创建/删除数据库和表
  - 管理用户权限等
- **示例**：

```bash
mysql -u root -p
```

## 3. ⚙️ `mysqldump`

- **功能**：逻辑备份工具，将数据库结构和数据导出为 SQL 脚本文件。
- **常用用途**：
  - 备份整个数据库或单个表
  - 数据迁移
- **示例**：

```bash
mysqldump -u root -p database_name > backup.sql
```

## 4. ⚙️ `mysqladmin`

- **功能**：用于管理 MySQL 服务器的命令行工具。
- **常用用途**：
  - 启动/停止 MySQL 服务（需配合系统服务）
  - 修改 root 密码
  - 查看服务器状态、进程列表等
- **示例**：

```bash
mysqladmin -u root -p password "new_password"
mysqladmin -u root -p status
```

## 5. ⚙️ `mysqlimport`

- **功能**：导入文本文件（如 CSV）到数据库表中，底层调用的是 `LOAD DATA INFILE`。
- **常用用途**：
  - 批量导入数据
  - 快速加载大量数据到数据库
- **示例**：

```bash
mysqlimport -u root -p --local database_name datafile.txt
```

## 6. ⚙️ `mysqlshow`

- **功能**：查看数据库、表、列的信息。
- **常用用途**：
  - 列出所有数据库
  - 显示某个数据库中的所有表
  - 显示某张表的字段信息
- **示例**：

```bash
mysqlshow -u root -p
mysqlshow -u root -p database_name
mysqlshow -u root -p database_name table_name
```

## 7. ⚙️ `mysqld` / `mysqld_safe`

- **功能**：
  - `mysqld` 是 MySQL 的服务器程序。
  - `mysqld_safe` 是启动 MySQL 服务器的安全脚本，推荐使用。
- **常用用途**：
  - 启动、重启 MySQL 服务
- **示例**：

```bash
sudo service mysql start
# 或者直接运行
mysqld_safe --user=mysql &
```

## 8. ⚙️ `mysqlcheck`

- **功能**：检查、修复、优化和分析数据库表的工具，适用于 MyISAM 和 InnoDB 引擎。
- **常用用途**：
  - 检查表是否损坏
  - 修复损坏的表
  - 优化表空间
- **示例**：

```bash
mysqlcheck -u root -p --auto-repair --check-all-databases
```

## 9. ⚙️ `myisamchk`

- **功能**：MyISAM 存储引擎专用的表检查与修复工具（不通过 MySQL 服务器运行）。
- **注意**：仅适用于 MyISAM 表，InnoDB 不支持。
- **常用用途**：
  - 修复损坏的 MyISAM 表
- **示例**：

```bash
myisamchk /var/lib/mysql/database/table.MYI
```

## 10. 🤔 如何查看 MySQL 都自带了哪些命令呢？

- 到 mysql 安装目录的 bin 目录下查看。
- 以 macOS 环境为例：
  - `sudo find / -name mysqldump 2>/dev/null`
  - 通过该命令可以打印出 mysqldump 的路径。
  - 比如：`/usr/local/mysql-8.0.33-macos13-arm64/bin/mysqldump`
  - 切换到 `bin` 目录：`cd /usr/local/mysql-8.0.33-macos13-arm64/bin`
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-17-08-52-32.png)

| 工具名称 | 功能说明 |
| --- | --- |
| `mysql` | MySQL 客户端程序，用于连接数据库并执行 SQL 语句 |
| `mysqldump` | 数据库逻辑备份工具，导出数据库结构和数据为 SQL 文件 |
| `mysqladmin` | 管理 MySQL 服务器，如启动/停止、修改密码、查看状态等 |
| `mysqlimport` | 导入文本文件（如 CSV）到数据库表 |
| `mysqlshow` | 显示数据库、表、列的信息 |
| `mysqld` | MySQL 服务器程序，用于启动 MySQL 数据库服务 |
| `mysqld_safe` | 安全方式启动 MySQL 服务器的脚本 |
| `mysql_secure_installation` | 增强 MySQL 安装的安全性，设置 root 密码、删除匿名用户等 |
| `mysql_upgrade` | 升级 MySQL 数据库系统表，确保与新版本兼容 |
| `mysqlbinlog` | 查看二进制日志内容，用于数据恢复或调试 |
| `mysqlcheck` | 检查、修复、优化和分析 MyISAM 或 InnoDB 表 |
| `mysqlpump` | 多线程数据库备份工具，支持更灵活的数据导出方式 |
| `mysqlslap` | 性能测试工具，模拟并发访问以测试数据库性能 |
| `mysql_config` | 显示编译 MySQL 应用程序所需的配置信息 |
| `mysql_config_editor` | 编辑加密的登录路径配置文件（`.mylogin.cnf`） |
| `mysql_tzinfo_to_sql` | 将时区信息加载到 MySQL 的时区表中 |
| `mysql_ssl_rsa_setup` | 自动生成 SSL/RSA 证书和密钥，用于安全连接 |
| `my_print_defaults` | 显示从配置文件中读取的选项 |
| `myisamchk` | 检查和修复 MyISAM 存储引擎的表 |
| `myisampack` | 压缩 MyISAM 表以节省空间 |
| `myisam_ftdump` | 导出 MyISAM 表的全文索引信息 |
| `myisamlog` | 查看 MyISAM 表的日志信息 |
| `ibd2sdi` | 将 InnoDB 表空间文件（.ibd）转换为 SDI（序列化字典信息）格式 |
| `innochecksum` | 校验 InnoDB 表空间文件的完整性 |
| `perror` | 显示 MySQL 错误编号对应的错误描述 |
| `lz4_decompress` | 解压使用 LZ4 压缩的文件 |
| `zlib_decompress` | 解压使用 zlib 压缩的文件 |
