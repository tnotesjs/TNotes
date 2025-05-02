# [0002. 核心概念](https://github.com/Tdahuyou/TNotes.typescript/tree/main/notes/0002.%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 demos.1 - 类型 vs. 值](#2--demos1---类型-vs-值)
- [3. 💻 demos.2 - 类型声明](#3--demos2---类型声明)
- [4. 💻 demos.3 - 类型推断](#4--demos3---类型推断)

<!-- endregion:toc -->

## 1. 📝 概述

- 类型和值
- 类型声明
- 类型推断

## 2. 💻 demos.1 - 类型 vs. 值

::: code-group

```ts [1.ts - 错误的参数类型]
function addOne(n: number) {
  return n + 1
}
addOne('hello') // ❌
// Argument of type 'string' is not assignable to parameter of type 'number'.(2345)

// 函数 addOne() 有一个参数 n，类型为数值 number，表示这个位置只能使用数值，传入其他类型的值就会报错。
// 函数 addOne() 传入了一个字符串 hello，TypeScript 发现类型不对，就报错了，指出这个位置只能传入数值，不能传入字符串。

// JavaScript 语言就没有这个功能，不会检查类型对不对。开发阶段很可能发现不了这个问题，代码也许就会原样发布，导致用户在使用时遇到错误。
// TypeScript 是在开发阶段报错，这样有利于提早发现错误，避免使用时报错。另一方面，函数定义里面加入类型，具有提示作用，可以告诉开发者这个函数怎么用。
```

:::

## 3. 💻 demos.2 - 类型声明

::: code-group

```ts [1.ts - 类型声明语法]
let foo: string

// 变量 foo 的后面使用冒号，声明了它的类型为 string。
// 类型声明的写法，一律为在标识符后面添加“冒号 + 类型”。
// 函数参数和返回值，也是这样来声明类型。
```

```ts [2.ts - 值与声明类型要一致]
let foo: string = 123 // ❌
// Type 'number' is not assignable to type 'string'.(2322)

// 变量 foo 的类型是字符串，但是赋值为数值 123，TypeScript 就报错了。

// 注意：
// 变量的值应该与声明的类型一致，如果不一致，TypeScript 就会报错。
```

```ts [3.ts - 变量在初始化之前不能使用]
let x: number
console.log(x) // ❌
// Variable 'x' is used before being assigned.(2454)

// 变量 x 没有赋值就被读取，导致报错。

// TypeScript 规定，变量只有赋值后才能使用，否则就会报错。
// JavaScript 允许这种行为，不会报错，没有赋值的变量会返回 undefined。
```

```ts [4.ts - 声明函数参数、返回值类型]
function toString(num: number): string {
  return String(num)
}
// 函数 toString() 的参数 num 的类型是 number。
// 参数列表的圆括号后面，声明了返回值的类型是 string。
```

:::

## 4. 💻 demos.3 - 类型推断

::: code-group

```ts [1.ts - 类型推断]
let foo = 123
// 等效：let foo: number = 123;

// 变量 foo 并没有类型声明，TypeScript 就会推断它的类型。
// 由于它被赋值为一个数值，因此 TypeScript 推断它的类型为 number。
```

```ts [2.ts - 推断函数返回值类型]
function toString(num: number) {
  return String(num)
}
// 等效：
// function toString(num: number): string {
//   return String(num);
// }

// 函数 toString() 没有声明返回值的类型，但是 TypeScript 知道 String(...) 返回的是字符串，所以它推断出 toString 的返回值类型是字符串类型。
// 正是因为 TypeScript 的类型推断，所以函数返回值的类型通常是省略不写的。
```

```ts [3.ts - 值与推断的类型不一致]
let foo = 123
foo = 'hello' // ❌
// Type 'string' is not assignable to type 'number'.(2322)

// 如果变量 foo 更改为其他类型的值，跟推断的类型不一致，TypeScript 就会报错。
// 变量 foo 的类型推断为 number，后面赋值为字符串，TypeScript 就报错了。
```

:::
