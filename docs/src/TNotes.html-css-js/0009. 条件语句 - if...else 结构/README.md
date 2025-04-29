# [0009. 条件语句 - if...else 结构](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84)

<!-- region:toc -->

- [1. 📒 if...else 基本结构](#1--ifelse-基本结构)
- [2. 💻 demos.2 - 认识基本的 if...else 结构](#2--demos2---认识基本的-ifelse-结构)
- [3. 💻 demos.3 - 多个 if...else 的情况](#3--demos3---多个-ifelse-的情况)
- [4. 💻 demos.1 - else 和最近的 if 配对](#4--demos1---else-和最近的-if-配对)

<!-- endregion:toc -->
- 知识点：
  - 掌握 if...else 基本结构
  - 直到 if else 的配对规则

## 1. 📒 if...else 基本结构

- `if` 代码块后面，还可以跟一个 `else` 代码块，表示不满足条件时，所要执行的代码。
- 对同一个变量进行多次判断时，多个 `if...else` 语句可以连写在一起。
- `else` 代码块总是与离自己最近的那个 `if` 语句配对。

```javascript
if (x === 3) {
  // 满足条件时，执行的语句
} else {
  // 不满足条件时，执行的语句
}
// 上面代码判断变量m是否等于3，如果等于就执行if代码块，否则执行else代码块。

if (x === 0) {
  // ...
} else if (x === 1) {
  // ...
} else if (x === 2) {
  // ...
} else {
  // ...
}
```

## 2. 💻 demos.2 - 认识基本的 if...else 结构

```javascript
var x1 = 1, x2 = 2

if (x1 === 1) {
  console.log('x1 is 1')
} else {
  console.log('x1 is not 1')
}

if (x2 === 1) {
  console.log('x2 is 1')
} else {
  console.log('x2 is not 1')
}

// 最终输出结果：
// x1 is 1
// x2 is not 1
```

## 3. 💻 demos.3 - 多个 if...else 的情况

```javascript
var x = 0

if (x > 0) {
  console.log('x 是正数')
} else if (x < 0) {
  console.log('x 是负数')
} else {
  console.log('x 是 0')
}

// 最终输出结果：
// x 是 0
```

## 4. 💻 demos.1 - else 和最近的 if 配对

```javascript
var x1 = 1
var x2 = 2

// 写法 1【不推荐】
if (x1 !== 1)
if (x2 === 2) console.log('hello')
else console.log('world')

// 写法 2【推荐】
// if (x1 !== 1) {
//   if (x2 === 2) {
//     console.log('hello')
//   } else {
//     console.log('world')
//   }
// }

// 最终将不会有任何输出
// 写法 1 和写法 2 是等效的
// else 和最近的 if 配对
// 建议在写 if...else 结构时，使用 {} 包裹代码块，以提高代码可读性。
```

```javascript
var x1 = 1
var x2 = 2

if (x1 !== 1) {}

if (x2 === 2) {
  console.log('hello')
} else {
  console.log('world')
}

// 最终将输出：
// hello
```
