# [0005. 区块和块级作用域](https://github.com/Tdahuyou/html-css-js/tree/main/0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F)

<!-- region:toc -->
- [1. 📒 区块和块级作用域](#1--区块和块级作用域)
- [2. 💻 demos.1 - 块级作用域](#2--demos1---块级作用域)
- [3. 💻 demos.2 - if 结构](#3--demos2---if-结构)
- [4. 💻 demos.3 - 使用区块来隔离上下文](#4--demos3---使用区块来隔离上下文)
<!-- endregion:toc -->
- 知识点：
  - 区块是什么
  - 区块的创建
  - 区块的作用
  - 块级作用域
  - 学会使用区块来隔离上下文
- 区块“block”可以简单地理解为一对大括号 `{}`。var 没有块级作用域，let、const 有块级作用域。

## 1. 📒 区块和块级作用域

- 区块
  - JavaScript 使用大括号，将多个相关的语句组合在一起，称为“区块”（block）。
  - 区块 block 就是一对大括号：`{}`，你可以在这里边写多条语句。
  - 想要创建一个区块非常简单，只需要写一对大括号 `{}` 就创建了一个区块。
- 块级作用域
  - 对于 `var` 命令来说，JavaScript 的区块不构成单独的作用域（scope）。
  - 对于 `let` 和 `const` 命令来说，JavaScript 的区块构成单独的作用域（scope）。

## 2. 💻 demos.1 - 块级作用域

```javascript
// 对于var命令来说，JavaScript 的区块不构成单独的作用域（scope）。
{
  var a = 1
  console.log(a) // 1
}

console.log(a) // 1

// 上面代码在区块内部，使用 var 命令声明并赋值了变量 a
// 然后在区块外部，变量 a 依然有效
// 区块对于 var 命令不构成单独的作用域
// 与不使用区块的情况没有任何区别

// 对于 let 和 const 命令来说
// JavaScript 的区块构成单独的作用域（scope）
{
  let a2 = 2
  const a3 = 3

  console.log(a2) // 2
  console.log(a3) // 3
}

// 在这里无法访问到 a2、a3
// 对于未定义的变量，如果直接访问的话会报错。
// 不过可以使用 typeof 来检测其类型
console.log(typeof a2) // undefined
console.log(typeof a3) // undefined
```

## 3. 💻 demos.2 - if 结构

```javascript
// 在 JavaScript 语言中，单独使用区块并不常见
// 区块往往用来构成其他更复杂的语法结构
// 比如 for、if、while、function 等

if (true) {
  var varVariable = "Hello";
  let letVariable = "World";
}
console.log(varVariable)
// 输出 "Hello"

console.log(letVariable)
// ❌ 报错 ReferenceError: letVariable is not defined

// 虽然 block 对于 var 而言，写了跟没写一样
// 但是如果我们在 block 内使用 const、let 来声明变量
// 那么这些变量是具备块级作用域的
// 即这些使用 const、let 声明的变量只能在 block 内部被访问
```

## 4. 💻 demos.3 - 使用区块来隔离上下文

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用区块来隔离上下文</title>
</head>
<body>
    <script>
        {
            // 这是 A 的代码
            let x = 1;
            console.log('x =>', x)
        }

        {
            // 这是 B 的代码
            let x = 2;
            console.log('x =>', x)
        }
    </script>
</body>
</html>

<!-- 
可以使用区块来隔离上下文
写起来非常简单，只需要把需要隔离的部分加上大括号即可。

比如，我们想把 A 和 B 的代码隔离开来，就可以使用区块来隔离上下文。

A 可能是其他人写的代码。
B 可能是你自己写的代码。

你在写 B 的时候，不希望被 A 影响，并且对 A 也没有任何依赖。
-->
```