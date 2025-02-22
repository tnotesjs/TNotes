# [0011. 条件语句 - 三元运算符](https://github.com/Tdahuyou/html-css-js/tree/main/0011.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E4%B8%89%E5%85%83%E8%BF%90%E7%AE%97%E7%AC%A6)


<!-- region:toc -->
- [1. 📒 三元运算符 `? :` 的基本语法](#1--三元运算符---的基本语法)
- [2. 💻 demos.1 - 判偶数](#2--demos1---判偶数)
<!-- endregion:toc -->
- 知识点：
  - 掌握三元运算符 `?:` 的基本语法

## 1. 📒 三元运算符 `? :` 的基本语法

JavaScript 还有一个三元运算符（即该运算符需要三个运算子）`?:`，也可以用于逻辑判断。

```javascript
(条件) ? 表达式1 : 表达式2
// 如果“条件”为true，则返回“表达式1”的值
// 否则返回“表达式2”的值
```

三元运算符可以被视为 `if...else` 结构的简写形式，通常用在那些比较简单的判断逻辑中。

## 2. 💻 demos.1 - 判偶数

```javascript
var n = 1

// 写法 1
var isEven = n % 2 === 0 ? true : false

// 写法 2
// var isEven
// if (n % 2 === 0) {
//   isEven = true
// } else {
//   isEven = false
// }

console.log(isEven)

// 上述两种写法表示的逻辑是一样的，都用于判断 n 是否是一个偶数。
// 判断逻辑：如果 n 可以被 2 整除，则 isEven 等于 true，否则等于 false。

// 从写法上来看，显然写法 1 更简洁，但是写法 2 也能表达清楚意思。
// 通常对于这些简单的判断逻辑，写法 1 就足够了。

// 最终输出结果：
// false
```

