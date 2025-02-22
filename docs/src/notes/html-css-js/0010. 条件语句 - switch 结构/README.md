# [0010. 条件语句 - switch 结构](https://github.com/Tdahuyou/html-css-js/tree/main/0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84)

<!-- region:toc -->
- [1. 📒 switch 基本结构](#1--switch-基本结构)
- [2. 💻 demos.1 - switch 中的 break 语句](#2--demos1---switch-中的-break-语句)
- [3. 💻 demos.2 - 使用表达式](#3--demos2---使用表达式)
- [4. 💻 demos.3 - 匹配规则是严格相等](#4--demos3---匹配规则是严格相等)
<!-- endregion:toc -->
- 知识点：
  - switch 结构
  - break 语句
  - 匹配校验 - 严格相等 `===`
- JavaScript 提供 `if` 结构和 `switch` 结构，完成条件判断，即只有满足预设的条件，才会执行相应的语句。但是，相对于 `if` 语句而言，`switch` 语句是很罕见的（甚至有的公司禁止使用，可能是考虑到条件语句咋用 `if` 就完全足够了，没必要再来一个 `switch`）。

## 1. 📒 switch 基本结构

- 多个 `if...else` 连在一起使用的时候，可以转为使用 `switch` 结构。
- 通常在书写 `case` 代码块时，都在每个 `case` 代码块末尾加上 `break` 语句。
- `switch` 语句部分和 `case` 语句部分，都可以使用表达式。
- `switch` 语句后面的表达式，与 `case` 语句后面的表示式比较运行结果时，采用的是严格相等运算符（`===`），而不是相等运算符（`==`），这意味着比较时不会发生类型转换。

```javascript
switch (fruit) {
  case "banana":
    // ...
    break;
  case "apple":
    // ...
    break;
  default:
    // ...
}

// 根据变量fruit的值，选择执行相应的case。
// 如果所有case都不符合，则执行最后的default部分。

// 注意：
// 每个case代码块内部的break语句不能少，否则会接下去执行下一个case代码块，而不是跳出switch结构。
```

## 2. 💻 demos.1 - switch 中的 break 语句

```javascript
var x = 1

switch (x) {
  case 1:
    console.log('x 等于1')
  case 2:
    console.log('x 等于2')
  default:
    console.log('x 等于其他值')
}

// 在该 demo 中，case 代码块之中没有 break 语句，
// 这将会导致程序不会跳出 switch 结构，而会一直执行下去。

// 最终输出结果：
// x 等于1
// x 等于2
// x 等于其他值
```

在没有 break 语句的情况下得到的结果，很可能并不是你想要的。正确写法应该是在每个 case 代码块末尾加上 break 语句。

```javascript
var x = 1

switch (x) {
  case 1:
    console.log('x 等于1')
    break // 加上 break 语句
  case 2:
    console.log('x 等于2')
    break // 加上 break 语句
  default:
    console.log('x 等于其他值')
}

// 正确写法应该是在每个 case 代码块末尾加上 break 语句。

// 最终输出结果：
// x 等于1
```

## 3. 💻 demos.2 - 使用表达式

```javascript
switch (1 + 3) {
  case 2 + 2:
    console.log('运行了 case 2 + 2')
    break
  default:
    console.log('运行了 default')
}

// switch 语句部分和 case 语句部分，都可以使用表达式。

// 最终输出结果：
// 运行了 case 2 + 2
```

## 4. 💻 demos.3 - 匹配规则是严格相等

```javascript
var x = 1

switch (x) {
  case true: // x === true 不成立
    console.log('x 发生类型转换')
    break
  default:
    console.log('x 没有发生类型转换')
}

// 这部分是隐式类型转换的相关知识。
console.log(1 == true) // => true
console.log(1 === true) // => false

// 由于变量 x 没有发生类型转换，所以不会执行 case true 的情况。
// 这表明，switch 语句内部采用的是“严格相等运算符”。

// 最终结果：
// x 没有发生类型转换
// true
// false
```
