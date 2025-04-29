# [0050. Node.js 生命周期](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0050.%20Node.js%20%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 📒 `timers、poll、check` 队列中分别存放哪些回调任务](#2--timerspollcheck-队列中分别存放哪些回调任务)
- [3. 📒 宏队列、微队列](#3--宏队列微队列)
- [4. 📒 `poll` 队列的特殊性](#4--poll-队列的特殊性)
- [5. 💻 demos.1 - 阻塞操作对计时器的影响](#5--demos1---阻塞操作对计时器的影响)
- [6. 💻 demos.2 - `setImmediate` 和 `setTimeout` 的性能对比](#6--demos2---setimmediate-和-settimeout-的性能对比)
- [7. 💻 demos.3 - `setTimeout(fn1, 0)` 和 `setImmediate(fm2)` 中的 `fn1`、`fn2` 哪个先执行？](#7--demos3---settimeoutfn1-0-和-setimmediatefm2-中的-fn1fn2-哪个先执行)
- [8. 💼 demos.4 - 练手面试题 - 1](#8--demos4---练手面试题---1)
- [9. 💼 demos.5 - 练手面试题 - 2](#9--demos5---练手面试题---2)
- [10. 🔗 参考资料](#10--参考资料)

<!-- endregion:toc -->

## 1. 📒 概述

- **Node.js 生命周期简图**：
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-15-47-48.png)
  - 简单画了一张图，本节将参考这张简图来介绍 Node.js 的生命周期（也称为 Node.js 事件循环）。
- **事件队列**：
  - timers、poll、check、nextTick、Promise，都简单想象成是一个 **事件队列**，这里边存放着一系列待处理的任务。
    - `timers: [任务t1, 任务t2, ...]`
    - `poll: [任务p1, 任务p2, ...]`
    - `check: [任务c1, 任务c2, ...]`
    - `nextTick: [任务n1, 任务n2, ...]`
    - `Promise: [任务pr1, 任务pr2, ...]`
    - 注意：这么描述其实是不太准确的，为了方便笔记记录，暂且先这么叫。
  - Node.js 程序每次走到一个队列，会做这么一件事儿 —— Node.js：诶，看看这个队列里边有没有事件等我执行，有的话就依次拿出来执行，直到把你执行空，我再看下一个队列。
- **相关术语**：
  - 一次循环
  - 一次轮询
  - 一次 tick
  - 它们表示的都是一个意思，也就是 event loop 走了一圈儿。
- **理清学习重点**：
  - 在于搞懂这几个队列 `timers、poll、check、nextTick、Promise` 中的回调执行机制。
  - 哪个队列中的回调会被优先调用？
  - 哪些回调任务进入哪些队列？
  - 哪些是宏队列，哪些是微队列？
  - 如果你有一个回调任务希望被 Node.js 尽快执行，应该如何处理？
- **目标**：
  - 理解 demos。

## 2. 📒 `timers、poll、check` 队列中分别存放哪些回调任务

- `timers`：和计时器相关的都会被丢到该队列中，比如 `setTimeout`、`setInterval`。
- `poll`：除了进入 `timers`、`check` 之外的几乎所有回调，都会被丢到 `poll` 队列中。比如读文件的回调、监听网络请求的回调。
- `check`：`setImmediate` 的回调会被丢到该队列中。

## 3. 📒 宏队列、微队列

- 宏队列：
  - timers
  - poll
  - check
- 微队列：
  - nextTick
  - Promise
- **Node.js 会先清空微队列中的回调才会去看宏队列**。
- 如果两个微队列中都有回调任务待处理，那么会 **优先取 nextTick 中的回调来执行**。

## 4. 📒 `poll` 队列的特殊性

- 由于几乎所有回调都在 poll 中，所以 Node.js 的事件循环机制，对于 poll 队列的处理也是比较特殊的。
- 如果 poll 中有回调，那么和 timers、check 一样，挨个取出回调来执行。
- 在 poll 中没有回调的情况下，Node.js 会先去看看其它阶段是否有回调
  - 如果其它阶段也没有回调，那么程序就好像是卡在了 poll 阶段，一直等待。
    - 因为如果出现了回调，那么最大可能是出现在 poll 阶段，一旦出现，就能尽快取出来执行。
  - 如果其它阶段出现了回调，那么程序才会离开 poll 阶段，继续轮询。

## 5. 💻 demos.1 - 阻塞操作对计时器的影响

::: code-group

```js [1.cjs]
const fs = require('fs')

const start = Date.now()

function f1() {
  console.log('f1', Date.now() - start)
}

function f2() {
  console.log('f2', Date.now() - readFileStart)
  // 死循环 300ms
  const start = Date.now()
  while (Date.now() - start < 300) {}
}

setTimeout(f1, 200)

const readFileStart = Date.now()
fs.readFile('./1.txt', 'utf-8', f2)

// 1.txt 文件内容：
// hello world

// 输出：
// f2 2
// f1 306

// 注意：
// 这里的 2 和 306 也可能是其他值，比如 306 也可能是 304、305、307、308，但是不会差太多。（除非你的计算机在这时候恰巧卡了一下）

// 🤔 程序是如何执行的？
// 1. setTimeout(f1, 200) 程序执行到这一行的时候，启动了一个 200ms 的计时器，f1 任务会在 200ms 后被推送到 timers 队列中等待执行。
// 2. fs.readFile('./1.txt', 'utf-8', f2) 程序执行到这一行的时候，会去读取 1.txt 文件内容，在读取到文件内容之后，会将 f2 推送到 poll 队列中等待执行。
//    fs.readFile 完成文件读取后，f2 被放入 poll 事件队列后会立即执行。
//    这个读取文件内容的速度是很快的，内容也就一行“hello world”，耗时极短，从打印结果来看，也就 2ms，它是明显小于 200ms 的就对了。
//    这就意味着 f2 会先被丢到 poll 队列中。
//    此时其它队列都是空，event loop 正停在 poll 队列中等着，这个 f2 任务一旦被推送进去，就会立刻被执行。
// 3. f2 中的死循环阻塞了 Node.js 的执行线程约 300ms，导致后续任务无法执行。即便 200ms 的时间早就到了，f1 已经被推送到 timers 队列中了。
//    setTimeout 的回调 f1 在 200ms 时已到达定时器时间，但必须等待 Node.js 的执行线程把 f2 执行完毕后才可能轮到它。
//    因此，f2 先输出，f1 在 f2 执行完毕后输出，且 f1 后跟的时间为实际执行时的延迟（约 306ms）。
```

```txt [1.txt]
hello world
```

:::

::: tip 一些扩展知识

- **🤔 Node.js 中只有一个线程嘛？**
  - 准确地说，这句话是有问题的，**Node.js 中是存在多个线程的**。
  - 但是 **Node.js 中执行 js 的线程只有一个**，而大家平时说的 Node.js 是单线程的，其实也就是在说“Node.js 中执行 js 的线程只有一个”，并不是说 Node.js 中只有一个线程。
- **🤔 如果 Node.js 的执行线程被阻塞，是否会影响计时器的计时呢？计时会停止吗？需要等到 Node.js 空闲出来再继续开始计时吗？**
  - 计时器的计时由系统独立管理，不受 JavaScript 主线程阻塞的影响。
    - 从最终输出的是 `300` 多就能知道答案 - **计时不会受影响**。
    - 如果 `setTimeout` 的计时依赖于 Node.js 的执行线程，那么最终输出的时间应该是 `500` 多。
  - 在 Node.js 中，计时器（如 `setTimeout`）的计时依赖于系统的时间管理机制，而不是 JS 主线程的执行状态。因此，即使主线程被阻塞（例如通过死循环），计时器的计时并不会停止。
- **计时器的工作原理**：
  - 计时器（如 `setTimeout` 和 `setInterval`）的计时是由底层的系统计时器（如操作系统的定时器）负责的。
  - 当你调用 `setTimeout(fn, delay)` 时，Node.js 会将该计时器任务注册到系统中，并记录当前时间作为起始时间。
  - 系统会独立地跟踪计时器的到期时间，而不需要依赖 JavaScript 主线程的执行。
- **事件循环与阻塞的关系**：
  - JavaScript 的执行是单线程的，这意味着如果主线程被阻塞（例如通过死循环或长时间运行的同步代码），**事件循环会被暂停**，无法处理其他任务（如 I/O 回调、计时器回调等）。
  - 然而，这并不影响系统对计时器到期时间的计算。计时器到期后，其回调会被放入事件队列中，等待主线程空闲时执行。
- **阻塞的影响**：
  - 阻塞会导致计时器回调的执行延迟，但不会影响计时器本身的计时。
  - 换句话说，计时器的到期时间是准确的，但由于主线程被阻塞，回调函数可能无法立即执行。

:::

## 6. 💻 demos.2 - `setImmediate` 和 `setTimeout` 的性能对比

::: code-group

```js {12} [setTimeout]
let i = 0

console.time('setTimeout')

function test() {
  i++
  if (i < 1000) setTimeout(test, 0)
  else console.timeEnd('setTimeout')
}

test()
// setTimeout: 15.168s
```

```js {12} [setImmediate]
let i = 0

console.time('setImmediate')

function test() {
  i++
  if (i < 1000) setImmediate(test)
  else console.timeEnd('setImmediate')
}

test()
// setImmediate: 5.162ms
```

:::

- **🤔 为啥两者的差异这么大？**
  - **`setTimeout`**：
    - 回调被放入 `timers` 阶段，受事件循环周期和计时器管理的开销影响，导致总耗时较长。
    - `timers` 阶段基于最小堆（min-heap）管理计时器任务。每次进入 `timers` 阶段时，Node.js 会检查当前时间是否已超过计时器的到期时间，并高效地取出到期的任务进行执行。
    - 时间主要消耗在以下两方面：
      - **1️⃣ 计时器管理的开销**：每次调用 `setTimeout` 时，都需要将计时器插入最小堆，涉及 $O(log n)$ 的复杂度。
      - **2️⃣ 事件循环周期的切换**：即使延迟为 `0ms`（实际效果是会大于 `0ms` 的），`setTimeout` 回调仍然需要等待当前事件循环周期完成（要转完一圈儿），才能再进入 `timers` 阶段执行。
  - **`setImmediate`**：
    - `check` 阶段是一个 FIFO 队列（数组），任务按照先进先出的顺序依次执行。
    - 由于任务调度简单且无需额外的时间计算或排序逻辑，`check` 阶段的执行效率通常高于 `timers` 阶段。
    - 此外，`setImmediate` 的回调会在当前事件循环周期的 poll 阶段完成后立即执行，而不需要像 `setTimeout` 那样等待整个事件循环周期结束，因此具有更高的即时性。
- **Node.js 的实现细节**
  - **`setTimeout` 的最小延迟**：
    - 即使设置为 `0ms`，`setTimeout` 的实际延迟通常会受到系统计时器精度的影响（例如在某些平台上最小延迟为 1ms 或更高）。
    - 这种最小延迟的累积效应会导致 `setTimeout` 的总耗时显著增加。
  - **`setImmediate` 的即时性**：
    - `setImmediate` 没有最小延迟限制，它的回调会在当前事件循环周期的 check 阶段立即执行。
    - 因此，`setImmediate` 的总耗时更短。
- **递归调用的性能差异**
  - **`setTimeout` 的递归调用**：
    - 每次调用 `setTimeout(test, 0)` 都会重新启动一个计时器，并将回调放入 timers 队列。
    - 计时器的管理本身会有一定的性能开销（如调度、插入队列等）。
    - 由于事件循环的周期性特性，这种递归调用会导致大量的时间浪费在事件循环的切换上。
  - **`setImmediate` 的递归调用**：
    - 每次调用 `setImmediate(test)` 直接将回调放入 check 阶列，无需额外的计时器管理。
    - 在高频调用场景下，`setImmediate` 的性能优势更加明显。
- **事件循环阶段的差异**
  - **`setTimeout` 的机制**：
    - `setTimeout` 的回调会被放入 **timers 阶段** 的队列中。
    - 即使设置延迟为 `0ms`，`setTimeout` 回调仍然需要等待当前事件循环周期中的其他任务（如 poll 阶段的任务）完成后，才能执行。
    - 每次进入 timers 阶段都需要完成一个完整的事件循环周期，这会引入额外的开销。
  - **`setImmediate` 的机制**：
    - `setImmediate` 的回调会被放入 **check 阶段** 的队列中。
    - `setImmediate` 的回调会在当前事件循环周期的 poll 阶段完成后立即执行，而不需要像 `setTimeout` 那样等待整个事件循环周期结束。
    - 因此，`setImmediate` 的执行效率更高，尤其是在高频调用场景下。

## 7. 💻 demos.3 - `setTimeout(fn1, 0)` 和 `setImmediate(fm2)` 中的 `fn1`、`fn2` 哪个先执行？

- 在 Node.js 中，`setTimeout(fn1, 0)` 和 `setImmediate(fn2)` 的执行顺序是一个经典的事件循环问题。
- 两者的行为取决于代码运行的上下文和事件循环的具体阶段。
- 下面是两种经典的场景：

::: code-group

```js [场景1 - 直接运行在主模块中]
setTimeout(() => {
  console.log('setTimeout')
}, 0)

setImmediate(() => {
  console.log('setImmediate')
})
```

:::

- **不确定的输出结果**：

```bash
# 可能 setTimeout 先执行：
# setTimeout
# setImmediate

# 可能 setImmediate 先执行：
# setImmediate
# setTimeout
```

- **实际运行结果**：
  - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-06-17-28-17.png)
- **原因分析**：
  - 在主模块中，`setTimeout` 和 `setImmediate` 的回调注册顺序可能会受到系统调度的影响。
  - 如果 `setTimeout` 的计时器到期时间恰好在 `poll` 阶段之前完成，则 `setTimeout` 的回调会先执行；
  - 如果 `setTimeout` 的计时器到期时间恰好在 `poll` 阶段之后完成，则 `setImmediate` 的回调会先执行。
  - 计时器的时间为 `0ms` 不太靠谱，实际的值会比它略大，比如 `1ms`，这就意味着当计时器时间到的时候，`event loop` 有可能已经停在 `poll` 阶段了。

::: code-group

```js [场景2 - 嵌套在 I/O 回调中]
const fs = require('fs')

fs.readFile('1.txt', () => {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)

  setImmediate(() => {
    console.log('setImmediate')
  })
})
```

:::

- **确定的输出结果**：

```bash
# setImmediate
# setTimeout
```

- **原因分析**：
  - I/O 回调任务被执行，意味着此时 event loop 正在 pool 阶段。
  - 在 I/O 回调中，`setImmediate` 的回调会被放入 `check` 阶段的队列，而 `setTimeout` 的回调会被放入 `timers` 阶段的队列。
  - 根据事件循环的顺序，`poll` 阶段完成后会先进入 `check` 阶段，转完一圈儿，然后再进入 `timers` 阶段。
  - 因此，`setImmediate` 的回调一定会先于 `setTimeout` 的回调执行。

## 8. 💼 demos.4 - 练手面试题 - 1

```js
setImmediate(() => {
  console.log(1)
})

process.nextTick(() => {
  console.log(2)
  process.nextTick(() => {
    console.log(3)
  })
})

console.log(4)

Promise.resolve().then(() => {
  console.log(5)
  process.nextTick(() => {
    console.log(6)
  })
})
```

::: details 查看答案

```bash
4
2
3
5
6
1
```

- **打印结果分析：**
  - 在 Node.js 的事件循环中，也存在宏队列和微队列的概念。
  - 宏队列：`tiemr`、`poll`、`check`
  - 微队列：`nextTick`、`Promise`
  - **每次在从宏队列中取回调来执行之前，会先清空微队列。并且优先清空 nextTick 队列，后清空 Promise 队列**。
- `4`：同步代码
- `2`、`3`：它们都位于 `nextTick` 队列，同步代码执行完之后，就开始处理队列里边的东西了，先清 `nextTick` 队列，所以随后会先输出它们。
- `5`：`nextTick` 清空之后，就是清 `Promise` 队列了，此时会输出 `5`。
- `6`：在上一步清空 `Promise` 队列的同时，又往 `nextTick` 队列添加了一个回调，所以会继续清空 `nextTick` 队列。
- `1`：经过上述步骤，已经把微队列都清空了，接下来就是宏队列里边的内容啦。此时宏队列中只有 `check` 队列里边有内容，此时将该回调取出来执行，打印 `1`。

:::

## 9. 💼 demos.5 - 练手面试题 - 2

```js
async function async1() {
  console.log('1')
  await async2()
  console.log('2')
}

async function async2() {
  console.log('3')
}

console.log('4')

setTimeout(function () {
  console.log('5')
}, 0)

setTimeout(function () {
  console.log('6')
}, 3)

setImmediate(() => console.log('7'))

process.nextTick(() => console.log('8'))

async1()

new Promise(function (resolve) {
  console.log('9')
  resolve()
  console.log('10')
}).then(function () {
  console.log('11')
})

console.log('12')
```

::: details 查看答案

```bash
4
1
3
9
10
12
8
2
11
5
6
7 # 无法确定，只能确定一定在 11 之后输出。
```

- **打印结果分析：**
- `4`、`1`、`3`、`9`、`10`、`12`：这部分是同步代码。
- `8`：清空 nextTick 队列。
- `2`、`11`：清空 Promise 队列。
- `5`、`6`、`7`：这部分的是宏队列中的回调的打印结果，只能明确 `5` 肯定在 `6` 之前打印，但是 `7` 的位置，没法确定。

:::

## 10. 🔗 参考资料

- https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-07-15-29-52.png)
  - Node.js 官方文档。
- https://yjhjstz.gitbooks.io/deep-into-node/content/chapter5/chapter5-1.html
  - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-07-15-28-44.png)
  - 一个开源的 nodejs 教程 - gitbooks。
- https://acemood.github.io/2016/02/01/event-loop-in-javascript/
  - 讲解 js 中 event loop 的一篇文章。
- https://docs.libuv.org/en/v1.x/design.html
  - libuv docs。
