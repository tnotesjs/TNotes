# [0045. console](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0045.%20console)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - console 对象](#2--demos1---console-对象)
  - [2.1. `console.log()`、`console.info()`、`console.error()`、`console.warn()`](#21-consolelogconsoleinfoconsoleerrorconsolewarn)
  - [2.2. `console.assert()`](#22-consoleassert)
  - [2.3. `console.count()`、`console.countReset()`](#23-consolecountconsolecountreset)
  - [2.4. `console.time()`、`console.timeEnd()`](#24-consoletimeconsoletimeend)
  - [2.5. `console.table()`](#25-consoletable)
  - [2.6. `console.group()`、`console.groupEnd()`、`console.groupCollapsed()`](#26-consolegroupconsolegroupendconsolegroupcollapsed)
  - [2.7. `console.dir()`](#27-consoledir)
  - [2.8. 占位符 `%d`、`%s`、`%j`](#28-占位符-dsj)

<!-- endregion:toc -->

## 1. 📒 概述

- console：用于提供控制台标准输出。
- Node.js 中的 console 和传统 Web 中的 console 对象类似，可以参考 mdn docs console 文档了解详细用法：https://developer.mozilla.org/zh-CN/docs/Web/API/console。

## 2. 💻 demos.1 - console 对象

### 2.1. `console.log()`、`console.info()`、`console.error()`、`console.warn()`

::: code-group

```js [1.js]
console.log('普通信息')
console.info('提示信息')
console.error('错误信息')
console.warn('警告信息')

// 输出：
// 普通信息
// 错误信息
// 警告信息
// 提示信息
```

:::

- 不同的消息类型，在 cmd 中打印出来看不出差异，但在浏览器端会展示不同的颜色提示。
- ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-13-37-13.png)
- ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-13-35-16.png)

### 2.2. `console.assert()`

::: code-group

```js [2.js]
const flag1 = true
const flag2 = false

console.assert(flag1, '111')
console.assert(flag2, '222')

// 输出：
// Assertion failed: 222
```

```js [3.js]
// 来自 mdn 的示例
const errorMsg = 'the # is not even'
for (let number = 2; number <= 5; number += 1) {
  console.log('the # is ' + number)
  console.assert(number % 2 === 0, { number: number, errorMsg: errorMsg })
  // 或者使用 ES2015 对象简写：
  // console.assert(number % 2 === 0, {number, errorMsg});
}
// 输出：
// the # is 2
// the # is 3
// Assertion failed: {number: 3, errorMsg: "the # is not even"}
// the # is 4
// the # is 5
// Assertion failed: {number: 5, errorMsg: "the # is not even"}
```

```js [4.js]
// 【验证预期条件】
// 确保代码的某个部分在特定条件下正常运行。
// 如果条件不成立，这可能表明存在逻辑错误或不期望的状态。
function divide(a, b) {
  console.assert(b !== 0, '除数不能为0')
  return a / b
}

// 【调试和错误定位】
// 在开发过程中，你可能会使用 console.assert 来验证函数的输入参数是否符合预期，或者某个复杂操作的中间状态是否正确。
function processItems(items) {
  console.assert(Array.isArray(items), 'items 应该是一个数组')
  // 处理数组项的代码...
}

// 【单元测试中的简单断言】
// 虽然许多单元测试框架提供了自己的断言库，但在某些简单测试或快速原型开发中，你可能会使用 console.assert 作为轻量级的测试机制。
function add(a, b) {
  return a + b
}

console.assert(add(1, 2) === 3, '1 加 2 应该等于 3')

const user = {
  name: 'xxx',
  isAdmin: false,
}
// 确保代码不达到某些执行路径：在某些情况下，你可能希望代码不要执行某个分支。使用 console.assert 可以帮助你确认这一点。
if (user.isAdmin) {
  // 管理员特定的代码...
} else {
  // 非管理员代码...
  console.assert(false, '非管理员用户不应该执行这段代码')
}

// 输出：
// Assertion failed: 非管理员用户不应该执行这段代码
```

:::

- 如果第一个参数的值如果是 `false`，则将后续参数视作错误消息写入控制台。
- 如果断言（assertion）是 `true`，没有任何反应。
- 日常开发中使用频率很低，通常会优先想要 `console.log`，并自行控制打印逻辑。

### 2.3. `console.count()`、`console.countReset()`

::: code-group

```js [5.js]
function test() {
  console.count('test called')
}

test()
test()
test()
test()
test()

// 输出：
// test called: 1
// test called: 2
// test called: 3
// test called: 4
// test called: 5
```

```js [10.js]
console.count('bob')
console.count('bob')
console.count('alice')
console.count('alice')

console.log('重置 bob 的计数器')
console.countReset('bob')

console.count('bob')
console.count('bob')
console.count('alice')
console.count('alice')

console.log('重置 bob、alice 的计数器')
console.countReset('bob')
console.countReset('alice')

console.count('bob')
console.count('bob')
console.count('alice')
console.count('alice')

// 输出：
// bob: 1
// bob: 2
// alice: 1
// alice: 2
// 重置 bob 的计数器
// bob: 1
// bob: 2
// alice: 3
// alice: 4
// 重置 bob、alice 的计数器
// bob: 1
// bob: 2
// alice: 1
// alice: 2
```

:::

- `console.count()` 方法会记录调用 `count()` 的次数。
- `console.countReset()` 方法会重置计数器。

### 2.4. `console.time()`、`console.timeEnd()`

::: code-group

```js [6.js]
console.time('myTimer') // 启动名为 'myTimer' 的计时器
for (let i = 0; i < 1000000; i++) {}
console.timeEnd('myTimer') // 停止计时器并打印出耗时

// 输出：
// myTimer: 1.226ms
```

:::

- `console.time()` 和 `console.timeEnd()` 是 JavaScript 中用于计算代码块执行时间的两个控制台方法。
  - `console.time(label)`：启动一个计时器，`label` 是计时器的唯一标识符，用于后续引用。
  - `console.timeEnd(label)`：停止计时器并输出从 `console.time(label)` 开始到当前的时间间隔，单位为毫秒。
- **注意事项**：
  - 每个计时器的 `label` 必须唯一。如果在第一个计时器未结束时重复使用相同的 `label`，可能会导致警告或错误。
  - 确保每个 `console.time()` 都有对应的 `console.timeEnd()`，否则计时器无法正确结束。
  - 避免在生产环境中过度使用这些方法，因为它们可能会影响性能并生成大量控制台输出。性能分析完成后，建议移除相关调用。

### 2.5. `console.table()`

::: code-group

```js [7.js]
const people = [
  { name: 'John', age: 24, occupation: 'Engineer' },
  { name: 'Jane', age: 22, occupation: 'Designer' },
  { name: 'Doe', age: 28, occupation: 'Teacher' },
]

console.table(people)
console.table(people, ['name', 'age'])
console.table(people[0])

// 输出：
// ┌─────────┬────────┬─────┬────────────┐
// │ (index) │  name  │ age │ occupation │
// ├─────────┼────────┼─────┼────────────┤
// │    0    │ 'John' │ 24  │ 'Engineer' │
// │    1    │ 'Jane' │ 22  │ 'Designer' │
// │    2    │ 'Doe'  │ 28  │ 'Teacher'  │
// └─────────┴────────┴─────┴────────────┘
// ┌─────────┬────────┬─────┐
// │ (index) │  name  │ age │
// ├─────────┼────────┼─────┤
// │    0    │ 'John' │ 24  │
// │    1    │ 'Jane' │ 22  │
// │    2    │ 'Doe'  │ 28  │
// └─────────┴────────┴─────┘
// ┌────────────┬────────────┐
// │  (index)   │   Values   │
// ├────────────┼────────────┤
// │    name    │   'John'   │
// │    age     │     24     │
// │ occupation │ 'Engineer' │
// └────────────┴────────────┘
```

:::

- `console.table()` 方法用于在控制台中以表格形式打印对象或数组。
- 最终效果预览：
  - Node.js 环境：
    - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-14-00-36.png)
  - 浏览器环境：
    - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-14-00-47.png)

### 2.6. `console.group()`、`console.groupEnd()`、`console.groupCollapsed()`

::: code-group

```js [8.js]
console.group('User Details')
console.log('Name: John Doe')
console.log('Age: 30')
console.group('Address')
console.log('Street: 123 Example St')
console.log('City: Sampleville')
console.log('Country: Testland')
console.groupEnd()
console.groupEnd()

// 输出：
// User Details
//   Name: John Doe
//   Age: 30
//   Address
//     Street: 123 Example St
//     City: Sampleville
//     Country: Testland
```

```js [9.js]
console.groupCollapsed('User Details')
console.log('Name: John Doe')
console.log('Age: 30')
console.groupCollapsed('Address')
console.log('Street: 123 Example St')
console.log('City: Sampleville')
console.log('Country: Testland')
console.groupEnd()
console.groupEnd()

// 输出：
// User Details
//   Name: John Doe
//   Age: 30
//   Address
//     Street: 123 Example St
//     City: Sampleville
//     Country: Testland
```

:::

- `console.group()` 和 `console.groupEnd()` 是 JavaScript 中用于在控制台中创建分组的方法，帮助组织和结构化日志信息，使输出更加清晰。
  - `console.group(label)`：开始一个新的日志分组，`label` 是可选的分组名称。所有在 `console.group()` 和 `console.groupEnd()` 之间的日志会被缩进，表明它们属于同一个分组。
  - `console.groupEnd()`：结束当前分组，返回到上一级分组或默认状态。
- `console.groupCollapsed()`
  - 与 `console.group()` 类似，但分组默认是折叠的，用户可以点击展开查看内容。
  - 不过在 Node.js 环境下效果和 `console.group()` 是一样的，没有折叠的交互。
- **注意事项**：
  - 确保每个 `console.group()` 都有对应的 `console.groupEnd()`，以避免分组混乱。
  - 这些方法主要用于调试和开发阶段，不应该出现在生产环境的正式代码中。发布前建议移除或注释掉相关调用。
- **最终效果预览**：
  - Node.js 环境：
    - ![图 4](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-14-05-29.png)
  - 浏览器环境：
    - ![图 5](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-14-06-10.png)
    - ![图 6](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-14-11-26.png)

### 2.7. `console.dir()`

::: code-group

```js [11.js]
const obj = {
  name: 'Alice',
  age: 25,
  details: {
    city: 'New York',
    hobbies: ['reading', 'traveling'],
    address: {
      street: '123 Main St',
      zip: '10001',
    },
  },
}

console.log('Using console.log:')
console.log(obj)

console.log('Using console.dir with depth: 1')
console.dir(obj, { depth: 1 })

console.log('Using console.dir with depth: null (full expansion)')
console.dir(obj, { depth: null })

// 输出：
// Using console.log:
// {
//   name: 'Alice',
//   age: 25,
//   details: {
//     city: 'New York',
//     hobbies: [ 'reading', 'traveling' ],
//     address: { street: '123 Main St', zip: '10001' }
//   }
// }
// Using console.dir with depth: 1
// {
//   name: 'Alice',
//   age: 25,
//   details: { city: 'New York', hobbies: [Array], address: [Object] }
// }
// Using console.dir with depth: null (full expansion)
// {
//   name: 'Alice',
//   age: 25,
//   details: {
//     city: 'New York',
//     hobbies: [ 'reading', 'traveling' ],
//     address: { street: '123 Main St', zip: '10001' }
//   }
// }
```

:::

- **`console.dir`**：用于打印复杂对象，并支持自定义选项。

| 特性         | `console.log`          | `console.dir`                     |
| ------------ | ---------------------- | --------------------------------- |
| **用途**     | 通用日志输出           | 专门用于输出对象的详细信息        |
| **输出格式** | 可能简化对象输出       | 以 JSON 格式逐层展开对象          |
| **支持配置** | 不支持额外选项         | 支持 `options` 参数（如 `depth`） |
| **适用场景** | 简单日志记录或快速调试 | 打印复杂对象结构时更合适          |

### 2.8. 占位符 `%d`、`%s`、`%j`

::: code-group

```js [12.js]
console.log('变量的值是：%d', 57)
console.log('%d+%d=%d', 273, 52, 273 + 52)
console.log('%d+%d=%d', 273, 52, 273 + 52, 52273)
console.log('%d+%d=%d & %d', 273, 52, 273 + 52)
console.log('字符串 %s', 'hello world', '和顺序无关')
console.log('JSON %j', { name: 'Node.js' })

// 输出：
// 变量的值是：57
// 273+52=325
// 273+52=325 52273
// 273+52=325 & %d
// 字符串 hello world 和顺序无关
// JSON {"name":"Node.js"}
```

:::

| 占位符 | 说明           |
| ------ | -------------- |
| `%d`   | 输出数字变量   |
| `%s`   | 输出字符串变量 |
| `%j`   | 输出 JSON 变量 |
| ……     | ……             |

- 占位符还有很多，比如 `%o`、`%O`、`%c` 等等，不过日常开发基本用不到占位符。
