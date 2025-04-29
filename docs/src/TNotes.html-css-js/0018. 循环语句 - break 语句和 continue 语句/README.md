# [0018. 循环语句 - break 语句和 continue 语句](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5)


<!-- region:toc -->

- [1. 📒 break 语句和 continue 语句](#1--break-语句和-continue-语句)
- [2. 💻 demos.1 - 在 while 中使用 break](#2--demos1---在-while-中使用-break)
- [3. 💻 demos.2 - 在 for 中使用 break](#3--demos2---在-for-中使用-break)
- [4. 💻 demos.3 - 在循环中使用 continue](#4--demos3---在循环中使用-continue)
- [5. 💻 demos.4 - 多重循环 - break、continue 语句针对当前所在的循环体而言](#5--demos4---多重循环---breakcontinue-语句针对当前所在的循环体而言)

<!-- endregion:toc -->
- 知识点：
  - break 语句
  - continue 语句

## 1. 📒 break 语句和 continue 语句

- `break`、`continue` 语句是比较常见的，在实际开发中也算是经常会用到的，需要掌握它们的用法。
- `break` 语句和 `continue` 语句都具有跳转作用，可以让代码不按既有的顺序执行。它们通常出现在 `for`、`while` 这样的循环体中。
  - `break`语句用于跳出代码块或循环。
  - `continue`语句用于立即终止本轮循环，返回循环结构的头部，开始下一轮循环。
- **注意**
  - 当出现多重循环嵌套的时候，需要清楚知道 `break` 语句和 `continue` 语句跳出的是当前层的循环。
  - 带参数的 `break` 语句和 `continue` 语句需要结合具体情况来判断跳到什么位置，这和标签定位符有关。（标签会在其它笔记中介绍）

## 2. 💻 demos.1 - 在 while 中使用 break

```javascript
var i = 0

while (i < 100) {
  if (i === 10) break
  console.log('i 当前为：' + i)
  i++
}
// 上面代码只会执行 10 次循环，一旦 i 等于 10，就会跳出循环。

// 最终输出结果：
// i 当前为：0
// i 当前为：1
// i 当前为：2
// i 当前为：3
// i 当前为：4
// i 当前为：5
// i 当前为：6
// i 当前为：7
// i 当前为：8
// i 当前为：9
```

## 3. 💻 demos.2 - 在 for 中使用 break

```javascript
for (var i = 0; i < 5; i++) {
  if (i === 3) break
  console.log(i)
}

// 上面代码执行到 i 等于 3，就会跳出循环。

// 最终输出结果：
// 0
// 1
// 2
```

## 4. 💻 demos.3 - 在循环中使用 continue

```javascript
var i = 0

while (i < 10) {
  i++
  if (i % 2 === 0) continue // 若执行 continue 将会跳过后续的代码，直接开启下一轮循环。
  console.log('i 当前为：' + i)
}

// 上面代码只有在 i 为奇数时，才会输出 i 的值。
// 如果 i 为偶数，则直接进入下一轮循环。
```

## 5. 💻 demos.4 - 多重循环 - break、continue 语句针对当前所在的循环体而言

```javascript
for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break
    console.log('i=' + i + ', j=' + j)
  }
}
// 如果存在多重循环，不带参数的 break 语句和 continue 语句都只针对最内层循环。

// 当 i 等于 0、1、2 的时候，本该都会输出 j 为 0、1、2 的组合
// 从最终的结果来看，当出现组合 1 0 之后，就直接开始 2 0、2 1、2 2 了。
// 这是因为 break 跳出了内层的循环。

// 最终输出结果：
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// i=2, j=0
// i=2, j=1
// i=2, j=2
```
