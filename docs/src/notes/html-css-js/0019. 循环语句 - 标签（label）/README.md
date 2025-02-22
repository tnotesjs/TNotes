# [0019. 循环语句 - 标签（label）](https://github.com/Tdahuyou/html-css-js/tree/main/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89)

<!-- region:toc -->
- [1. 📒 标签](#1--标签)
- [2. 💻 demos.1 - break、continue 加标签](#2--demos1---breakcontinue-加标签)
- [3. 💻 demos.2 - 跳出区块](#3--demos2---跳出区块)
- [4. 💻 demos.3 - 不能跨区块跳](#4--demos3---不能跨区块跳)
- [5. 🤔 问：如何看待“标签”？](#5--问如何看待标签)
<!-- endregion:toc -->
- “标签” 在开发时几乎不会用到它，这个知识点不算重要，快速过一遍笔记，简单了解一下它的作用即可。

## 1. 📒 标签


- **标签语法**

```javascript
label:
  语句……
```

- JavaScript 语言允许，语句的前面有标签（label），相当于 **定位符**，用于跳转到程序的任意位置。
- 标签可以是任意的标识符，但不能是保留字。
- 标签通常与 `break` 语句和 `continue` 语句配合使用，跳出特定的循环。
- **注意**
  - 标签的跳转 **不能跨区块**。
  - 标签需要被放置在一个封闭的语句块中，例如 `while`，`do while`，`for` 或者 `switch` 语句，或者一个更大的封闭的块（使用大括号 `{}` 定义的块）中。
  - 你不能将一个标签放置在一个独立的语句块中，然后试图在这个标签块之外的代码中使用 `break` 或 `continue` 语句跳转到它。当在这些块内部使用 `break` 或 `continue` 语句并指定一个标签时，控制会被转移到标签所在的块之后的代码。

## 2. 💻 demos.1 - break、continue 加标签

```javascript
console.log('start')
top: for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break top
    console.log('i=' + i + ', j=' + j)
  }
}
console.log('end')

// 上面代码为一个双重循环区块
// break 命令后面加上了 top 标签（注意，top 不用加引号）
// 满足条件时，直接跳到 top 位置，即跳出双层循环。

// 最终输出结果：
// start
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// end
```

```javascript
console.log('start')
top: for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    if (i === 1 && j === 1) continue top
    console.log('i=' + i + ', j=' + j)
  }
}
console.log('end')

// continue 语句也可以与标签配合使用。

// 最终输出结果：
// start
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// i=2, j=0
// i=2, j=1
// i=2, j=2
// end
```

## 3. 💻 demos.2 - 跳出区块

```javascript
foo: {
  console.log(1)
  break foo
  console.log('本行不会输出')
}
console.log(2)

// 标签也可以用于跳出代码块。
// 上面代码执行到break foo，就会跳出区块。

// 最终输出结果：
// 1
// 2
```

## 4. 💻 demos.3 - 不能跨区块跳

```javascript
// 区块 1
block1: {
  console.log(1)
}

// 区块 2
block2: {
  console.log(2)
  break block1 // 可以 break block2
  // ❌ 报错：
  // A 'break' statement can only jump to a label of an enclosing statement.
  // 译："break" 语句只能跳转到封闭语句的标签。
}
```

```javascript
// 区块 1
block1: {
  console.log(1)
}

// 区块 2
block2: {
  console.log(2)
  // 区块 3
  block3: {
    console.log(3)
    {
      // break block3 // ✅
      // break block2 // ✅
      // 随便套多少层都行，但是只能在当前所在的区块中跳。
    }
  }
  // 区块 4
  block4: {
    console.log(4)
    // break block2 // ✅
    // break block3 // ❌ 这里和 3 是平级的关系，不能跳。
    // 报错：
    // A 'break' statement can only jump to a label of an enclosing statement.
  }
}
```

## 5. 🤔 问：如何看待“标签”？

- A：通常在项目中，都不会使用标签。
- JS 允许在语句前面使用标签，这可以与 `break` 和 `continue` 结合使用，以便在复杂的循环结构中更灵活地控制流程。但由于标签和跳转语句大概率会 **降低代码的可读性**，建议在使用时保持谨慎，并优先考虑其他更直观的控制流程方式。