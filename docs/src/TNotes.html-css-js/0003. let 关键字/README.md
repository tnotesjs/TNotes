# [0003. let 关键字](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 📒 let 关键字](#1--let-关键字)
- [2. 💻 demos.1 - 块级作用域](#2--demos1---块级作用域)
- [3. 💻 demos.2 - 对比 for 循环的循环变量使用 var 和 let 来定义](#3--demos2---对比-for-循环的循环变量使用-var-和-let-来定义)
- [4. 💻 demos.3 - let 暂时性死区](#4--demos3---let-暂时性死区)
- [5. 💻 demos.4 - 函数参数默认值中的死区](#5--demos4---函数参数默认值中的死区)
- [6. 💻 demos.5 - 其他奇怪的报错](#6--demos5---其他奇怪的报错)
- [7. 💻 demos.6 - 同一作用域内不允许重复声明](#7--demos6---同一作用域内不允许重复声明)
- [8. 💻 demos.7 - for 循环的特别之处](#8--demos7---for-循环的特别之处)
- [9. 💻 demos.8 - let 出现之前的一些历史问题](#9--demos8---let-出现之前的一些历史问题)

<!-- endregion:toc -->
- 知识点：
  - let 关键字
  - 块级作用域
  - 暂时性死区（TDZ）
  - 经典的“闭包陷阱”问题
- let 关键字的规则不多，也比较好理解。在 let、const 关键字出现之前，定义变量只能使用 var 关键字，var 这玩意儿存在不少问题，有很多经典的历史问题在 let、const 出现之后都引刃而解了。

## 1. 📒 let 关键字

- **let 具有块级作用域。**
- **let 声明的变量有暂时性死区，虽然变量声明提升了，但无法在声明语句之前访问变量。**
- **不允许使用 let 重复声明同名变量。**


## 2. 💻 demos.1 - 块级作用域

```javascript
{
  let a = 10
  var b = 1
}

// console.log(a) // ❌ ReferenceError: a is not defined.
console.log(b) // 1

// let 具有块级作用域

// ES6 新增了 let 命令，用来声明变量。
// let 的用法类似于 var，但是所声明的变量，只在 let 命令所在的代码块内有效。

// 上面代码在代码块之中，分别用 let 和 var 声明了两个变量。
// 然后在代码块之外调用这两个变量，结果 let 声明的变量报错，var 声明的变量返回了正确的值。
// 这表明，let 声明的变量只在它所在的代码块有效。
```

## 3. 💻 demos.2 - 对比 for 循环的循环变量使用 var 和 let 来定义

```javascript
for (let i = 0; i < 10; i++) {
  // ...
  // 在这里可以正常访问 i
}

// 出了块级作用域之后，将无法访问到 i。
// console.log(i)
// ❌ ReferenceError: i is not defined

// for 循环的计数器，就很合适使用 let 命令。
// 上面代码中，计数器 i 只在 for 循环体内有效，在循环体外引用就会报错。
// 这种行为，也是更加符合我们认知的。
```

```javascript
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 10
console.log(i) // 10

// 如果使用 var，最后输出的是 10。

// 原因分析：

// 来看下下面这段等效代码，你立刻就明白了。
/*
var i // 这个 i 相当于是在全局声明的一个变量。
var a = []
for (i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 10
console.log(i) // 10
*/

// 变量 i 是 var 命令声明的，在全局范围内都有效，所以全局只有一个变量 i。
// 每一次循环，变量 i 的值都会发生改变，而循环内被赋给数组 a 的函数内部的 console.log(i)，里面的 i 指向的就是全局的 i。
// 也就是说，所有数组 a 的成员里面的 i，指向的都是同一个 i，导致运行时输出的是最后一轮的 i 的值，也就是  10。
```

```javascript
var a = []
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 6

// 如果使用 let，声明的变量仅在块级作用域内有效，最后输出的是 6。

// 上面代码中，变量 i 是 let 声明的，当前的 i 只在本轮循环有效，所以每一次循环的 i 其实都是一个新的变量，所以最后输出的是 6。
// 这里其实用到了 闭包。
```

## 4. 💻 demos.3 - let 暂时性死区

```javascript
// 写法 1：var 的情况
console.log(foo) // undefined
var foo = 2

// 由于 var 声明的变量提升，所以 foo 变量声明提升到顶部，所以 foo 变量在声明之前就存在，值为 undefined。
/*
上述写法 1，等效于下面这种写法：
var foo
console.log(foo)
foo = 2
*/

// 写法 2：let 的情况
console.log(bar) // ❌ 报错 ReferenceError
let bar = 2

// let 声明的变量有暂时性死区，虽然变量声明提升了，但无法在声明语句之前访问变量。
```

```javascript
var tmp = 123

if (true) {
  tmp = 'abc' // ❌ ReferenceError
  let tmp
}

// 只要块级作用域内存在 let 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。
// 虽然存在全局变量 tmp，但是块级作用域内 let 又声明了一个局部变量 tmp，
// 这意味着在 if 语句块内，起作用的是块级作用域内的 let 声明的 tmp，和全局的没有关系，你可以认为全局的 var tmp = 123 这一条语句不存在。
// 因此，在 let 声明变量前，对 tmp 赋值会报错。
```

```javascript
if (true) {
  // TDZ 开始
  tmp = 'abc' // ❌ ReferenceError
  console.log(tmp) // ❌ ReferenceError
  typeof tmp // ❌ ReferenceError

  let tmp // TDZ 结束
  console.log(tmp) // undefined

  tmp = 123
  console.log(tmp) // 123
}

// 上面代码中，在 let 命令声明变量 tmp 之前，都属于变量 tmp 的“死区”。

// ES6 明确规定，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
// 在代码块内，使用 let 命令声明变量之前，该变量都是不可用的。
// 这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

// typeof undeclared_variable // "undefined"
// 虽然使用 typeof 可以去检测一个还没有声明的变量。（得到结果是 undefined）
// 但是在 “暂时性死区” 中，typeof 是会报错的。
```

## 5. 💻 demos.4 - 函数参数默认值中的死区

```javascript
function bar(x = y, y = 2) {
  console.log([x, y])
}

bar() // 报错

function foo(x = 2, y = x) {
  console.log([x, y])
}
foo() // [2, 2]

// 有些“死区”比较隐蔽，不太容易发现。
// 上面代码中，调用 bar 函数之所以报错，是因为参数 x 默认值等于另一个参数 y，而此时 y 还没有声明，属于“死区”。
// 如果 y 的默认值是 x，就不会报错，因为此时 x 已经声明了。
```

## 6. 💻 demos.5 - 其他奇怪的报错

```javascript
var x1 = x1 // ok
let x2 = x2 // ❌ ReferenceError: x2 is not defined

// 上面代码报错，也是因为暂时性死区。
// 使用 let 声明变量时，只要变量在还没有声明完成前使用，就会报错。
// 上面这行就属于这个情况，在变量 x2 的声明语句还没有执行完成前，就去取 x 的值，导致报错“x 未定义”。
```

## 7. 💻 demos.6 - 同一作用域内不允许重复声明

```javascript
// 写法 1 ❌ 执行前就会报错
// function func() {
//   let a = 10
//   var a = 1
// }

// 写法 2 ❌ 执行前就会报错
// function func() {
//   let a = 10
//   let a = 1
// }

// 写法 3
// function func(arg) {
//   let arg;
// }
// func() // ❌ 执行时报错

// 写法 4 ok
function func(arg) {
  // 这里相当于新开了一个块作用域
  {
    let arg;
  }
}
func() // ok

// let 不允许在相同作用域内，重复声明同一个变量。
// 这也意味着不能在函数内部重新声明参数。
```

## 8. 💻 demos.7 - for 循环的特别之处

```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc'
  console.log(i)
}
// abc
// abc
// abc

// for 循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
// 上面代码正确运行，输出了 3 次 abc。
// 这表明函数内部的变量 i 与循环变量 i 不在同一个作用域，有各自单独的作用域。
// 同一个作用域不可使用 let 重复声明同一个变量，否则会报错。
```

## 9. 💻 demos.8 - let 出现之前的一些历史问题

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Var Example</title>
  </head>
  <body>
    <ul id="var-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
      <li>Item 5</li>
    </ul>
    <script>
      var listItems = document.querySelectorAll('#var-list li')
      for (var i = 0; i < listItems.length; i++) {
        // 错误写法
        // listItems[i].addEventListener('click', function () {
        //   alert('Item ' + (i + 1) + ' clicked')
        // })

        // 正确写法1
        // ;(function (currentIndex) {
        //   listItems[currentIndex].addEventListener('click', function () {
        //     alert('Item ' + (currentIndex + 1) + ' clicked')
        //   })
        // })(i)

        // 正确写法还有很多种，这里介绍的是其中一种使用 IIFE 的方法
      }
    </script>
  </body>
</html>
<!--
需求：点击第几个 li 就弹出几。

这是一个经典的“闭包陷阱”问题。

如果使用的是这种错误的写法，无论点击哪个 li，最终都会提示是第 6 个被点击了。
循环中的事件处理函数引用了变量 i，当点击事件触发时，所有函数访问的 i 都是循环结束后的最终值 6，导致所有事件都显示相同的索引值。
正确的做法是确保每次循环迭代时创建一个新的作用域来保存当前的 i 值。可以通过立即执行函数表达式（IIFE）来实现这一点。
虽然问题能够解决，不过写起来会感觉很别扭。
-->
```

- ![](assets/2024-12-27-14-15-51.png)
- ![](assets/2024-12-27-14-15-58.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Let Example</title>
  </head>
  <body>
    <ul id="let-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
      <li>Item 5</li>
    </ul>
    <script>
      var listItems = document.querySelectorAll('#let-list li')
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', function () {
          alert('Item ' + (i + 1) + ' clicked')
        })
      }
    </script>
  </body>
</html>
<!--
只需要把 var 改为 let 即可。
接下来在写 for 循环的时候，都使用 let 关键字来定义循环变量名。
在开发项目时，要求你必须使用 var 关键字的场景是很难遇到的。
-->
```
