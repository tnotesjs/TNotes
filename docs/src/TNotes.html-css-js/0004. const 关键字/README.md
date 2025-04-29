# [0004. const 关键字](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 📒 const 关键字](#1--const-关键字)
- [2. 📒 理解 const 的 “常量约束” 的本质](#2--理解-const-的-常量约束-的本质)
- [3. 📒 栈内存、堆内存](#3--栈内存堆内存)
- [4. 💻 demos.1 - 常量不允许重新赋值](#4--demos1---常量不允许重新赋值)
- [5. 💻 demos.2 - 声明的同时完成初始化赋值](#5--demos2---声明的同时完成初始化赋值)
- [6. 💻 demos.3 - 引用类型，确保地址不变](#6--demos3---引用类型确保地址不变)
- [7. 💻 demos.4 - 对象冻结](#7--demos4---对象冻结)
- [8. 💼 面试题.1 - 请谈谈 var、let、const](#8--面试题1---请谈谈-varletconst)

<!-- endregion:toc -->
- 知识点：
  - const 关键字
  - const 的 “常量约束” 的本质
  - 栈内存、堆内存
  - const 和 let 之间的区别
  - 对象冻结 `Object.freeze`
  - 对象深度冻结（递归）
- const 和 let 非常类似，区别在于 let 定义的是变量，const 定义的是常量。定义变量时首选 const 关键字，其次 let 关键字，放弃 var 关键字。

## 1. 📒 const 关键字

- const 声明一个只读的常量。一旦声明，常量的值就不能改变。
- const 声明的变量，必须在声明的同时完成初始化赋值。
- const 声明的变量具有块级作用域。
- const 声明的变量具有暂时性死区。
- const 不能重复声明同名变量。

## 2. 📒 理解 const 的 “常量约束” 的本质

- const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
- 对于 **原始类型** 的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于 **常量**。
- 对于 **引用类型** 的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，**const 只能保证这个指针是固定的**（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。

## 3. 📒 栈内存、堆内存

- 数据分为 **基本数据类型** (String, Number, Boolean, Null, Undefined，Symbol) 和 **引用数据类型**。
- **基本** 数据类型的特点：直接存储在 **栈** (stack) 中的数据。
- **引用** 数据类型的特点：存储的是该对象在 **栈** 中引用，真实的数据存放在 **堆** 内存里。
- 引用数据类型在 **栈中存储了指针**，该指针指向 **堆中该实体** 的起始地址。
- ![](assets/2024-12-27-14-38-48.png)

## 4. 💻 demos.1 - 常量不允许重新赋值

```javascript
const PI = 3.1415
console.log(PI) // 3.1415

PI = 3 // ❌ TypeError: Assignment to constant variable.

// 上面代码表明改变常量的值会报错。
```

## 5. 💻 demos.2 - 声明的同时完成初始化赋值

```javascript
const foo // ❌ SyntaxError: Missing initializer in const declaration

/*
const 声明的变量不得改变值
这意味着，const 一旦声明变量，就必须立即初始化，不能留到以后赋值。

对于 const 来说，只声明不赋值，就会报错。
*/
```

## 6. 💻 demos.3 - 引用类型，确保地址不变

```javascript
const foo = {}

console.log(foo) // {}

foo.prop = 123 // 为 foo 添加一个属性，可以成功，因为地址没变。

console.log(foo) // { prop: 123 }

foo = {} // ❌ TypeError: "foo" is read-only

/*
const foo = {}

foo = {}
将 foo 指向另一个对象，就会报错

上面代码中，常量 foo 储存的是一个地址，这个地址指向一个对象。
不可变的只是这个地址，即不能把 foo 指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。
*/
```

```javascript
const arr = []
arr.push('Hello') // ✅ 因为地址没变
arr.length = 0 // ✅ 因为地址没变
arr = ['Dave'] // ❌ 因为地址变了

/*
上面代码中，常量 arr 是一个数组类型。
arr 数组本身是可写的，但是如果将另一个新数组赋值给 arr 就会报错，因为新数组的地址和原数组的地址不同。

补充：数组类型本该是定长的，但是在 js 中，我们可以自由改变数组长度（JS 解释器会帮我们自动完成扩容等行为）。
*/
```

## 7. 💻 demos.4 - 对象冻结

```javascript
// 'use strict'
const foo = Object.freeze({})

console.log(foo) // {}

foo.prop = 123 // 严格模式会报错
// ❌ TypeError: Cannot add property prop, object is not extensible

console.log(foo) // {}

/*
const foo = Object.freeze({})
如果真的想将对象冻结，应该使用 Object.freeze 方法。

foo.prop = 123
常规模式时，这一行不起作用；严格模式时，该行会报错。

'use strict'
在文件头部加上这个语句，就可以进入严格模式。

上面代码中，常量 foo 指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错。
*/
```

```javascript
var constantize = (obj) => {
  Object.freeze(obj)
  Object.keys(obj).forEach((key, i) => {
    if (typeof obj[key] === 'object') {
      constantize(obj[key]) // 递归
    }
  })
}

/*
除了将对象本身冻结，对象的属性也应该冻结。
通过上述做法，可以将一个对象彻底冻结。
*/
```

## 8. 💼 面试题.1 - 请谈谈 var、let、const

- **相同点**
  - `var`、`let`、`const` 三者都可以声明变量。
- **差异**
  - `var` 基本算是淘汰了，现在主要使用 `let`、`const` 来声明变量。
  - `var`、`let` 允许我们先声明，后赋值。但是，`const` 必须在声明变量的同时完成初始化。

|       | 作用     | 作用域     | 暂时性死区 | 重复声明变量 | 全局属性 |
| ----- | -------- | ---------- | ---------- | ------------ | -------- |
| const | 声明常量 | 块级作用域 | ✅         | ❌           | ❌       |
| let   | 声明变量 | 块级作用域 | ✅         | ❌           | ❌       |
| var   | 声明变量 | 函数作用域 | ❌         | ✅           | ✅       |

- **函数作用域、重复声明、全局属性**
  - 当 var 在函数内部声明时，它的作用域仅限于该函数内。这意味着只能在声明它的函数内部访问该变量。
  - 如果 var 在任何函数外部声明（相当于在全局函数中声明），则它具有全局作用域，可以在代码的任何地方访问该变量，甚至在浏览器环境中会成为 window 对象的属性。

```javascript
function example() {
    console.log(x); // undefined
    var x = 10;
    if (true) {
        var x = 20; // 重新声明同一变量
        console.log(x); // 20
    }
    console.log(x); // 20
}

example()
```

- **暂时性死区：Temporal dead zone（TDZ）**

```javascript
console.log(person) // 会报错

let person = {
  name: 'Lucy',
}
// 从一个代码块的开始直到代码执行到声明变量的行之前，
// let 或 const 声明的变量都处于“暂时性死区中。

// 简单理解：let 或 const 只能先声明再访问。

// 使用 const 声明变量，如果在声明前使用，表现与 let 一致。
```

```javascript
console.log(person) // 不会报错

var person = {
  name: 'Lucy',
}
// var 声明的全局变量会进行变量提升
```

- **全局属性：是否会被添加到 `window` 或 `globalThis` 等对象中**

```javascript
var name = 'Lucy'
console.log(window.name) // Lucy
console.log(globalThis.name) // Lucy

const age = 12
console.log(window.age) // undefined
console.log(globalThis.age) // undefined

let gender = 'female'
console.log(window.gender) // undefined
console.log(globalThis.gender) // undefined

// var 声明的变量会被添加到全局对象中，
// 可以使用 window 和 globalThis 访问。

// let 和 const 声明的全局变量则不会添加到全局对象中。
```
