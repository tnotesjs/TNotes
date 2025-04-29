# [0079. 表之间的关系](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0079.%20%E8%A1%A8%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 📒 一对一关系 (One-to-One)](#2--一对一关系-one-to-one)
- [3. 📒 一对多关系 (One-to-Many)](#3--一对多关系-one-to-many)
- [4. 📒 多对多关系 (Many-to-Many)](#4--多对多关系-many-to-many)

<!-- endregion:toc -->

## 1. 📒 概述

- **一对一关系 (One-to-One)**
  - 两个表之间存在一对一的关系，表示一个表中的每一行最多与另一个表中的一行相关联。
- **一对多**
  - 一个表中的一行可以与另一个表中的多行相关联，而另一个表中的一行只能与第一个表中的一行相关联。
- **多对多**
  - 两个表中的每一行都可以与另一个表中的多行相关联。

| 关系类型 | 设计方法 | 示例场景 |
| --- | --- | --- |
| 一对一 | 在“少”方表中添加外键字段，并设置为唯一 (`UNIQUE`) | 用户与用户详细信息 |
| 一对多 | 在“多”方表中添加外键字段，指向“一”方表 | 用户与订单 |
| 多对多 | 创建一个中间表，包含两个外键字段，并设置联合主键 | 学生与课程 |

## 2. 📒 一对一关系 (One-to-One)

- **应用场景**：
  - 用户和用户详情：一个用户有一份详细的个人信息，一份详细的个人信息只能属于一个用户。
  - 学生和学生 ID：一个学生有一份唯一的学生 ID，一个学生 ID 只属于一个学生。
- **设计方法**：
  - 一对一关系通常通过在一个表中添加外键来实现。
  - 外键可以放在任意一方，但一般建议放在使用频率较低的表中。
- **demo**：

```sql
-- users 表存储用户基本信息。
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- user_profiles 表存储用户的详细信息。
CREATE TABLE user_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE, -- 外键，确保一对一关系 [!code highlight]
    full_name VARCHAR(100),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) -- [!code highlight]
        ON DELETE CASCADE -- [!code highlight]
);
```

- `user_id` 在 `user_profiles` 表中是唯一的（`UNIQUE`），确保了每个用户只能有一个对应的详细信息。
- 使用 `ON DELETE CASCADE` 可以确保当用户被删除时，其对应的详细信息也会自动删除。

## 3. 📒 一对多关系 (One-to-Many)

- **应用场景**：
  - 用户和订单：一个用户可以有多个订单，一个订单只属于一个用户。
  - 部门和员工：一个部门可以有多个员工，一个员工只能属于一个部门。
- **设计方法**：
  - 一对多关系通过在外键所在的“多”方表中添加外键来实现。
- **demo**：

```sql
-- departments 表存储部门信息。
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL
);

-- employees 表存储员工信息。
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_name VARCHAR(100) NOT NULL,
    department_id INT, -- 外键，指向部门表  [!code highlight]
    FOREIGN KEY (department_id) REFERENCES departments(department_id) -- [!code highlight]
        ON DELETE SET NULL -- [!code highlight]
);
```

- `department_id` 是 `employees` 表中的外键，指向 `departments` 表的主键。
- 使用 `ON DELETE SET NULL` 可以确保当部门被删除时，员工的 `department_id` 被设置为 `NULL`，而不是级联删除。

## 4. 📒 多对多关系 (Many-to-Many)

- **应用场景**：
  - 学生和课程：一个学生可以选修多门课程，一门课程也可以被多个学生选修。
  - 文章和标签：一篇文章可以有多个标签，一个标签也可以应用于多篇文章。
- **设计方法**：
  - 多对多关系需要引入一个中间表（也称为关联表或连接表），用于存储两个表之间的关联关系。
- **demo**：

```sql
-- students 表存储学生信息。
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL
);

-- courses 表存储课程信息。
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL
);

-- 我们创建一个中间表 student_courses 来表示学生和课程之间的多对多关系。
CREATE TABLE student_courses ( -- [!code highlight]
    student_id INT, -- 外键，指向学生表 [!code highlight]
    course_id INT, -- 外键，指向课程表 [!code highlight]
    PRIMARY KEY (student_id, course_id), -- 联合主键，确保唯一性 [!code highlight]
    FOREIGN KEY (student_id) REFERENCES students(student_id) -- [!code highlight]
        ON DELETE CASCADE, -- [!code highlight]
    FOREIGN KEY (course_id) REFERENCES courses(course_id) -- [!code highlight]
        ON DELETE CASCADE -- [!code highlight]
); -- [!code highlight]
```

- 中间表 `student_courses` 的主键由 `student_id` 和 `course_id` 组成，确保每对学生和课程的组合是唯一的。
- 使用 `ON DELETE CASCADE` 可以确保当学生或课程被删除时，相关的记录也会自动删除。
