# [0051. util](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0051.%20util)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - `util.format(format, [...])` - 格式化输出字符串](#2--demos1---utilformatformat----格式化输出字符串)
- [3. 💻 demos.2 - `util.inspect(object[, showHidden[, depth[, colors]]])` - 将对象转换为字符串](#3--demos2---utilinspectobject-showhidden-depth-colors---将对象转换为字符串)
- [4. 💻 demos.3 - `util.inherits(constructor, superConstructor)` - 实现对象间的原型继承](#4--demos3---utilinheritsconstructor-superconstructor---实现对象间的原型继承)
- [5. 💻 demos.4 - `util.callbackify(async_function)` - 转换异步函数的风格](#5--demos4---utilcallbackifyasync_function---转换异步函数的风格)
- [6. 💻 demos.5 - `util.promisify(original)` - 转换异步函数的风格](#6--demos5---utilpromisifyoriginal---转换异步函数的风格)
- [7. 💻 demos.6 - `util.types` - 判断是否为指定类型的内置对象](#7--demos6---utiltypes---判断是否为指定类型的内置对象)
- [8. 🔗 参考资料](#8--参考资料)

<!-- endregion:toc -->

## 1. 📒 概述

- `util` 是 Node.js 的内置工具模块，提供了一系列常用方法，主要用于格式化字符串、对象转换、原型继承、异步函数转换等，弥补核心 JavaScript 功能的不足。
- **常见用法**：
  1. 使用 `util.format()` 对字符串进行格式化。
  2. 使用 `util.inspect()` 将对象转换为字符串。
  3. 使用 `util.inherits()` 实现对象间的原型继承。
  4. 使用 `util.callbackify()` 转换异步函数的风格。
  5. 使用 `util.promisify()` 转换异步函数的风格。
  6. 使用 `util.types` 方法对指定类型进行检查。

| 方法 | 描述 |
| --- | --- |
| `util.types.isArrayBuffer(value)` | 判断是否为 `ArrayBuffer` 或 `SharedArrayBuffer` |
| `util.types.isAsyncFunction(value)` | 判断是否为异步函数 |
| `util.types.isBooleanObject(value)` | 判断是否为布尔类型 |
| `util.types.isBoxedPrimitive(value)` | 判断是否为原始对象（如 `new Boolean()`、`new String()` 等） |
| `util.types.isDate(value)` | 判断是否为 `Date` 对象 |
| `util.types.isNumberObject(value)` | 判断是否为 `Number` 对象 |
| `util.types.isRegExp(value)` | 判断是否为正则表达式 |
| `util.types.isStringObject(value)` | 判断是否为 `String` 对象 |

## 2. 💻 demos.1 - `util.format(format, [...])` - 格式化输出字符串

::: code-group

```javascript [1.cjs]
const util = require('util')

console.log(util.format('%d+%d=%d', 50, 70, 50 + 70))
// => 50+70=120

console.log(util.format('整数：%i', 26.01))
// => 整数：26

console.log(util.format('小数：%f', '26.01'))
// => 小数：26.01

console.log(util.format('百分数：%d%%', 26))
// => 百分数：26%

const author = {
  name: 'Tdahuyou',
  age: 25,
}
console.log(util.format('对象格式化为JSON：%j', author))
// => 对象格式化为JSON：{"name":"Tdahuyou","age":25}
```

:::

- 将字符串中的占位符替换为对应的参数值。
- **支持的占位符**：
  - `%s`：指定字符串。
  - `%d`：指定数值。
  - `%i`：转换为整数。
  - `%f`：转换为小数。
  - `%j`：转换为 JSON 字符串。
  - `%o`：转换为具有通用 JavaScript 对象格式的字符串表示形式（类似于 `util.inspect()`）。
  - `%%`：输出 `%`。

## 3. 💻 demos.2 - `util.inspect(object[, showHidden[, depth[, colors]]])` - 将对象转换为字符串

::: code-group

```javascript [1.cjs]
const util = require('util')

function Person() {
  this.name = 'Tdahuyou'
  this.age = 25
  this.showName = function () {
    return this.name
  }
}
const author = new Person()

console.log(util.inspect(author))
// Person { name: 'Tdahuyou', age: 25, showName: [Function (anonymous)] }

console.log(util.inspect(author, true))
// Person {
//   name: 'Tdahuyou',
//   age: 25,
//   showName: <ref *1> [Function (anonymous)] {
//     [length]: 0,
//     [name]: '',
//     [arguments]: null,
//     [caller]: null,
//     [prototype]: { [constructor]: [Circular *1] }
//   }
// }
```

```javascript [2.cjs]
const util = require('util')

// 定义一个复杂对象
function Person(name, age) {
  this.name = name
  this.age = age
  this.showName = function () {
    return this.name
  }
}
const author = new Person('Tdahuyou', 25)

console.log('普通输出:')
console.log(util.inspect(author))

console.log('\n启用颜色的输出:')
console.log(util.inspect(author, { colors: true }))

// 更复杂的对象（嵌套结构）
const complexObject = {
  person: author,
  details: {
    hobbies: ['coding', 'running'],
    address: {
      city: 'ShangHai',
      country: 'China',
    },
  },
}

// 普通输出（未启用颜色）
console.log('\n复杂对象的普通输出:')
console.log(util.inspect(complexObject))

// 启用颜色的输出
console.log('\n复杂对象的启用颜色输出:')
console.log(util.inspect(complexObject, { colors: true, depth: null }))
```

:::

- 将任意对象转换为字符串，通常用于调试和错误输出。
- **参数说明**：
  - `object`：必需参数，指定要转换的对象。
  - `showHidden`：布尔值，显示隐藏属性。
  - `depth`：最大递归层数，用于复杂对象的格式化。
  - `colors`：布尔值，启用 ANSI 颜色编码。
- `2.cjs` 运行结果：
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-13-21-29-48.png)

## 4. 💻 demos.3 - `util.inherits(constructor, superConstructor)` - 实现对象间的原型继承

::: code-group

```javascript [1.cjs]
const util = require('util')

function par() {
  this.name = '老张'
  this.age = 60
  this.say = function () {
    console.log(this.name + '今年' + this.age + '岁')
  }
}

function ch() {
  this.name = '小张'
}

util.inherits(ch, par) // ch 继承父类 par

const objBase = new par()
const objSub = new ch()

objBase.say()
// => 老张今年60岁

objSub.say()
// => 小张今年undefined岁

// 注意：子类 ch 继承了父类 par 的原型方法，但未继承构造函数内部的属性。
```

:::

- **参数说明**：
  - `constructor`：从原型继承的对象。
  - `superConstructor`：要继承的原型对象。

## 5. 💻 demos.4 - `util.callbackify(async_function)` - 转换异步函数的风格

::: code-group

```javascript [1.cjs]
const util = require('util')

async function fn() {
  return '这是一个函数'
}

const callbackFunction = util.callbackify(fn)

callbackFunction(function (err, ret) {
  if (err) throw err
  console.log(ret) // => 这是一个函数
})
```

:::

- 将 `async` 异步函数或返回值为 `Promise` 的函数转换为遵循 **错误优先回调风格** 的函数。
- **参数说明**：
  - `async_function`：原始的异步函数。

## 6. 💻 demos.5 - `util.promisify(original)` - 转换异步函数的风格

::: code-group

```javascript [1.cjs]
const util = require('util')
const fs = require('fs')
const path = require('path')

// 原始的错误优先回调风格函数
function readFileCallback(path, callback) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return callback(err)
    }
    callback(null, data)
  })
}

// 使用 util.promisify 转换为返回 Promise 的函数
const readFilePromise = util.promisify(readFileCallback)

// 调用返回 Promise 的函数
readFilePromise(path.join(__dirname, '1.txt'))
  .then((data) => {
    console.log('文件内容:', data)
  })
  .catch((err) => {
    console.error('读取文件失败:', err)
  })

// 输出：
// 文件内容: test
```

```txt [1.txt]
test
```

:::

- 传入一个遵循常见的 **错误优先回调风格** 的函数，然后返回一个返回值为 Promise 的函数。

## 7. 💻 demos.6 - `util.types` - 判断是否为指定类型的内置对象

::: code-group

```javascript [1.cjs]
const util = require('util')

console.log(
  `util.types.isBoxedPrimitive(new String('string')) =>`,
  util.types.isBoxedPrimitive(new String('string'))
)

console.log(
  `util.types.isBoxedPrimitive('string') =>`,
  util.types.isBoxedPrimitive('string')
)

console.log(
  `util.types.isAsyncFunction(async function () {}) =>`,
  util.types.isAsyncFunction(async function () {})
)

console.log(
  `util.types.isBooleanObject(new Boolean(false)) =>`,
  util.types.isBooleanObject(new Boolean(false))
)

console.log(`util.types.isDate(new Date()) =>`, util.types.isDate(new Date()))

console.log(
  `util.types.isNumberObject(new Number(8)) =>`,
  util.types.isNumberObject(new Number(8))
)

console.log(`util.types.isRegExp(/^w+$/) =>`, util.types.isRegExp(/^w+$/))

console.log(
  `util.types.isStringObject(new String('string')) =>`,
  util.types.isStringObject(new String('string'))
)

// 输出：
// util.types.isBoxedPrimitive(new String('string')) => true
// util.types.isBoxedPrimitive('string') => false
// util.types.isAsyncFunction(async function () {}) => true
// util.types.isBooleanObject(new Boolean(false)) => true
// util.types.isDate(new Date()) => true
// util.types.isNumberObject(new Number(8)) => true
// util.types.isRegExp(/^w+$/) => true
// util.types.isStringObject(new String('string')) => true
```

:::

- 通过 `util.types` 提供的方法，检查值是否为特定类型的内置对象。

## 8. 🔗 参考资料

::: details

- https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124
  - bash-colors.md
  - ANSI 颜色编码。

:::
