# [0011. 数据库访问接口](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0011.%20%E6%95%B0%E6%8D%AE%E5%BA%93%E8%AE%BF%E9%97%AE%E6%8E%A5%E5%8F%A3)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 数据库访问接口在数据库系统中的位置](#2--数据库访问接口在数据库系统中的位置)
- [3. 📒 数据库访问接口的作用](#3--数据库访问接口的作用)
- [4. 📒 常见的数据库访问接口](#4--常见的数据库访问接口)
  - [4.1. Sequelize ORM](#41-sequelize-orm)
  - [4.2. ODBC（Open Database Connectivity）](#42-odbcopen-database-connectivity)
  - [4.3. JDBC（Java Database Connectivity）](#43-jdbcjava-database-connectivity)
  - [4.4. ADO.NET](#44-adonet)
  - [4.5. DB-API（Python Database API）](#45-db-apipython-database-api)
  - [4.6. PDO（PHP Data Objects）](#46-pdophp-data-objects)
- [5. 📒 现代趋势：ORM 框架](#5--现代趋势orm-框架)
- [6. 📒 实际应用场景](#6--实际应用场景)

<!-- endregion:toc -->

## 1. 📝 概述

- **数据库访问接口（Database Access Interface）** 是应用程序与数据库之间进行通信的桥梁。
  - 数据库访问接口是程序语言访问数据库时所使用的标准接口或协议。
  - 数据库访问接口定义了应用程序如何连接、操作和管理数据库。
  - 数据库访问接口允许开发者使用高级语言（如 Node.js、Java、Python、PHP、C# 等）来操作数据库，而不需要关心底层数据库的具体实现细节。
  - 不同的程序设计语言会有各自不同的数据库访问接口，程序语言通过这些接口执行 SQL 语句，进行数据库管理。
- **数据库访问接口是应用程序与数据库之间的中间层，它屏蔽了底层数据库的差异，使开发者可以用统一的方式访问不同的数据库系统。**

## 2. 📒 数据库访问接口在数据库系统中的位置

```mermaid
graph TD
    A[应用程序层 - DB Application] --> B[**数据库访问接口层 - DB Access Interface**]
    B --> C[数据库管理系统层 - DBMS]
    C --> D[数据存储层 - DB - 表、索引、视图、触发器]
```

- 类比理解：
  - “翻译官” = “数据库访问接口”
  - “中文” = “程序语言”
  - “外国人” = “数据库”

```mermaid
graph TB
    A[中文] --> B[❌ 外国人不理解]
    A --1️⃣--> C --2️⃣ 接口讲你说的中文翻译为英文--> D[✅ 外国人能理解]
    D --3️⃣--> C --4️⃣ 接口将外国人说的英文翻译为中文--> A

    subgraph 添加接口
      C[翻译官]
    end
```

- 数据库访问接口就好比翻译官，当你在跟不同类型的数据库通信时，翻译官会将你的程序语言翻译为这个数据库能够理解的 SQL 语句，然后再将数据库的执行结果返回，返回的时候也会转为程序语言能够理解的数据，比如数组、对象等。

## 3. 📒 数据库访问接口的作用

| 功能         | 说明                             |
| ------------ | -------------------------------- |
| 抽象底层差异 | 让应用不依赖具体数据库引擎       |
| 提供统一 API | 开发者无需为每个数据库写一套代码 |
| 支持事务控制 | 实现 ACID 事务特性               |
| 提高可移植性 | 同一套代码可以适配多个数据库     |
| 支持连接池   | 提高性能和并发能力               |

## 4. 📒 常见的数据库访问接口

| 接口名称 | 全称 | 支持的语言/平台 | 特点 |
| --- | --- | --- | --- |
| **Sequelize ORM** | Sequelize | Node.js | 基于 JavaScript 的 ORM |
| **ODBC** | Open Database Connectivity | Windows 平台通用 | 提供统一接口，支持多种数据库 |
| **JDBC** | Java Database Connectivity | Java | Java 应用的标准数据库访问方式 |
| **ADO.NET** | ActiveX Data Objects .NET | C# / VB.NET | .NET 平台专用 |
| **DB-API** | Python Database API | Python | 如 `sqlite3`, `MySQLdb`, `psycopg2` |
| **PDO** | PHP Data Objects | PHP | 统一访问多种数据库的接口 |
| **MyBatis / Hibernate** | MyBatis / Hibernate | Java | ORM 框架，简化 SQL 映射 |
| **SQLAlchemy ORM** | SQLAlchemy ORM | Python | 高级抽象，支持多种数据库 |
| **ActiveRecord** | ActiveRecord | Ruby on Rails | ORM 框架，约定优于配置 |

### 4.1. Sequelize ORM

- Sequelize 是一个基于 Node.js 的 对象关系映射（ORM）框架。
- 它用于在 JavaScript 应用程序中与数据库进行交互，支持多种数据库，如 MySQL、PostgreSQL、SQLite 和 MariaDB 等。
- 使用 Sequelize 可以通过面向对象的方式操作数据库，而无需频繁编写原始 SQL 语句。

```js
const { Sequelize, DataTypes } = require('sequelize')

// 创建数据库连接
const sequelize = new Sequelize('mysql://root:123456@localhost:3306/mydb', {
  dialect: 'mysql',
})

// 定义模型
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
)

// 查询所有用户
async function getUsers() {
  try {
    const users = await User.findAll()
    console.log(users)
  } catch (error) {
    console.error('查询失败:', error)
  }
}

// 调用函数
getUsers()
```

### 4.2. ODBC（Open Database Connectivity）

- 是微软开发的一个数据库访问标准。
- 使用驱动程序（Driver）来连接不同数据库。
- 几乎所有数据库都提供 ODBC 驱动。

```ini
[MySQL ODBC Driver]
Driver = /usr/lib/libmyodbc.so
```

### 4.3. JDBC（Java Database Connectivity）

- Java 中用于连接数据库的标准 API。
- 使用 JDBC URL 连接数据库。
- 需要加载数据库厂商提供的 JDBC 驱动。

```java
String url = "jdbc:mysql://localhost:3306/mydb";
String user = "root";
String password = "123456";
Connection conn = DriverManager.getConnection(url, user, password);
```

### 4.4. ADO.NET

- Microsoft 提供的数据库访问技术。
- 支持多种数据源（SQL Server、Oracle、MySQL 等）。
- 支持 DataSet、DataAdapter、DataReader 等对象模型。

```csharp
string connectionString = "Server=localhost;Database=mydb;User=root;Password=123456;";
using (SqlConnection conn = new SqlConnection(connectionString)) {
    SqlCommand cmd = new SqlCommand("SELECT * FROM users", conn);
    conn.Open();
    SqlDataReader reader = cmd.ExecuteReader();
    while (reader.Read()) {
        Console.WriteLine(reader["name"]);
    }
}
```

### 4.5. DB-API（Python Database API）

- Python 标准化数据库接口规范（PEP 249）。
- 不同数据库有不同的实现（如 `MySQLdb`, `psycopg2`, `sqlite3`）。

```python
import MySQLdb

conn = MySQLdb.connect(
    host="localhost",
    user="root",
    passwd="123456",
    db="mydb"
)
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
result = cursor.fetchall()
for row in result:
    print(row)
```

### 4.6. PDO（PHP Data Objects）

- PHP 中统一访问数据库的接口。
- 支持多种数据库（MySQL、PostgreSQL、SQLite、Oracle 等）。

```php
$dsn = 'mysql:host=localhost;dbname=mydb';
$user = 'root';
$password = '123456';

try {
    $pdo = new PDO($dsn, $user, $password);
    $stmt = $pdo->query("SELECT * FROM users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['name'] . "<br>";
    }
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
```

## 5. 📒 现代趋势：ORM 框架

- 虽然数据库访问接口很强大，但很多项目会使用 **ORM（Object Relational Mapping）框架** 来进一步简化数据库操作。
- ORM 框架示例：

| 框架名               | 语言    | 数据库支持                   |
| -------------------- | ------- | ---------------------------- |
| **Hibernate**        | Java    | 支持多种数据库               |
| **MyBatis**          | Java    | SQL 映射为主                 |
| **SQLAlchemy**       | Python  | 支持 MySQL、PostgreSQL 等    |
| **Django ORM**       | Python  | 自带 ORM                     |
| **Sequelize**        | Node.js | MySQL、PostgreSQL、SQLite 等 |
| **ActiveRecord**     | Ruby    | 主要用于 Rails               |
| **Entity Framework** | C#      | SQL Server、MySQL 等         |

- ORM 的优势：
  - 使用面向对象的方式操作数据库
  - 自动处理 SQL 构造、连接池、事务等
  - 更加安全（防止 SQL 注入）
  - 可跨数据库迁移（部分）

## 6. 📒 实际应用场景

| 场景             | 推荐接口                      |
| ---------------- | ----------------------------- |
| Java Web 项目    | JDBC 或 Hibernate             |
| Python 数据分析  | DB-API（如 pymysql、sqlite3） |
| PHP 项目         | PDO 或 mysqli                 |
| Windows 桌面软件 | ODBC                          |
| Node.js 后端     | Sequelize / TypeORM           |
| 跨平台桌面工具   | ADO.NET / Qt SQL              |
