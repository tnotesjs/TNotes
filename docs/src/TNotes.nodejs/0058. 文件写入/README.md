# [0058. 文件写入](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0058.%20%E6%96%87%E4%BB%B6%E5%86%99%E5%85%A5)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 异步写入 - `fs.writeFile`](#2--demos1---异步写入---fswritefile)
- [3. 💻 demos.2 - 同步写入 - `fs.writeFileSync`](#3--demos2---同步写入---fswritefilesync)
- [4. 💻 demos.3 - 追加写入 - `fs.appendFile`、`fs.appendFileSync`](#4--demos3---追加写入---fsappendfilefsappendfilesync)
- [5. 💻 demos.4 - 流式写入 - `fs.createWriteStream`](#5--demos4---流式写入---fscreatewritestream)
- [6. 💻 demos.5 - 使用自定义 `Transform` 流](#6--demos5---使用自定义-transform-流)

<!-- endregion:toc -->

## 1. 📒 概述

- **文件写入**
  - `fs` 模块提供了同步和异步两种方式来进行文件写入操作。
  - 异步写入不会阻塞主线程，适合处理较大的文件或需要高性能的场景。
  - 同步写入会阻塞主线程，适用于处理较小的文件或需要低延迟的场景。
    - 比如工程初始化过程中读取配置数据阶段。
- **应用场景**
  - Node.js 的 `fs` 模块提供了灵活且强大的文件写入功能，适用于各种场景：
  - 小型文件的快速写入可以使用 `writeFile` 或 `writeFileSync`。
    - 覆盖
  - 需要 **追加内容** 时可以使用 `appendFile` 或 `appendFileSync`。
    - 追加
  - 对于大文件或逐步写入需求，推荐使用流式写入 (`createWriteStream`)。
    - 覆盖
- **常见的写入标志 `options.flag`**
  - `'w'`：覆盖写入。
    - `writeFile`、`writeFileSync` 的默认值。
  - `'a'`：追加写入。
    - `appendFile`、`appendFileSync` 的默认值。
  - `'r+'`：读写模式（文件必须存在）。
- **注意事项**
  - 文件权限
    - 确保运行 Node.js 脚本的用户对目标文件具有写入权限。
    - 如果文件不存在，`writeFile` 和 `appendFile` 会自动创建文件，但前提是目录必须存在。
  - 编码问题
    - 默认编码为 `'utf8'`，但如果写入的是二进制数据，请使用 `Buffer` 或指定其他编码。
  - 异常处理
    - 异步方法通过回调函数返回错误信息，用 `callback` 处理。
    - 同步方法会抛出异常，用 `try-catch` 处理。
    - 建议始终处理可能的错误。
  - 流式写入的同步、异步问题
    - `writeStream.write(chunk)` 是异步的，但其行为可能因缓冲区状态而表现出同步特性。
    - 如果缓冲区未满，`write()` 返回 `true`，表现得像同步操作。
    - 如果缓冲区已满，`write()` 返回 `false`，需要等待 `'drain'` 事件触发后才能继续写入。
    - 在实际开发中，遇到写入大量数据的场景时，建议始终检查 `write()` 的返回值，并正确处理 `'drain'` 事件。

## 2. 💻 demos.1 - 异步写入 - `fs.writeFile`

::: code-group

```javascript [1.cjs]
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const fileContent = 'Hello, Node.js!'

fs.writeFile(filePath, fileContent, { encoding: 'utf8' }, (err) => {
  if (err) {
    console.error('写入文件时出错:', err)
  } else {
    console.log('文件写入成功')
  }
})

/* 
fs.writeFile(file, data, options, callback)

参数说明：
  file：文件路径（字符串）或文件描述符（数字）。
  data：要写入的数据，可以是字符串或 Buffer。
  options：可选配置对象，常见的选项包括：
    encoding：指定编码，默认为 'utf8'。
    mode：文件权限，默认为 0o666，表示 rw- 可读可写。
    flag：写入模式，默认为 'w'（覆盖写入）。如果需要追加内容，可以设置为 'a'。
  callback：回调函数，在写入完成后调用，接收 (err) 参数。
*/
```

```txt [1.txt]
Hello, Node.js!
```

:::

## 3. 💻 demos.2 - 同步写入 - `fs.writeFileSync`

::: code-group

```javascript [1.cjs]
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const fileContent = 'Hello, Node.js!'

try {
  console.log('1. 开始写入文件')
  fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' })
  console.log('2. 文件写入成功')
} catch (err) {
  console.error('写入文件时出错:', err)
}

// 输出：
// 1. 开始写入文件
// 2. 文件写入成功

// 1 会在 2 之前输出。
// 当 2 输出的时候，文件已经完成写入了。

// fs.writeFileSync(file, data, options)
// 这是 fs.writeFile 的同步版本，会阻塞主线程直到写入完成。
```

```txt [1.txt]
Hello, Node.js!
```

:::

## 4. 💻 demos.3 - 追加写入 - `fs.appendFile`、`fs.appendFileSync`

::: code-group

```javascript [1.cjs]
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const fileContent = 'Hello, Node.js!'

try {
  fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' })
  console.log('文件写入成功')
} catch (err) {
  console.error('写入文件时出错:', err)
}

// 追加内容 - 异步版本
fs.appendFile(filePath, '\n这是追加的内容 - 1', { encoding: 'utf8' }, (err) => {
  if (err) {
    console.error('追加内容时出错 - 1:', err)
  } else {
    console.log('内容追加成功 - 1')
  }
})

// 追加内容 - 同步版本
try {
  fs.appendFileSync(filePath, '\n这是同步追加的内容 - 2', { encoding: 'utf8' })
  console.log('内容追加成功 - 2')
} catch (err) {
  console.error('追加内容时出错 - 2:', err)
}

// 输出：
// 文件写入成功
// 内容追加成功 - 2
// 内容追加成功 - 1

// 注意：
// 同步代码会先被执行，所以先输出 2 后输出 1。
// 补充：这部分内容关联的知识点 - Node.js 事件循环。

/* 
如果需要向文件末尾追加内容，可以使用以下方法：

  fs.appendFile(file, data, options, callback)
  该方法会在文件末尾追加数据，如果文件不存在，则会创建新文件。

  fs.appendFileSync(file, data, options)
  同步版本的追加写入。
*/
```

```txt [1.txt]
Hello, Node.js!
这是同步追加的内容 - 2
这是追加的内容 - 1
```

:::

## 5. 💻 demos.4 - 流式写入 - `fs.createWriteStream`

::: code-group

```javascript [1.cjs]
const fs = require('fs')

const writeStream = fs.createWriteStream('stream-example.txt', {
  encoding: 'utf8',
})

const res1 = writeStream.write('第一部分数据\n')

console.log(
  res1
    ? '1 - 同步写入'
    : '1 - 一部写入 - 缓冲区已满，暂停写入，等待 drain 事件触发再继续'
)

const res2 = writeStream.write('第二部分数据\n')
console.log(
  res2
    ? '2 - 同步写入'
    : '2 - 一部写入 - 缓冲区已满，暂停写入，等待 drain 事件触发再继续'
)

// 结束写入
writeStream.end('最后一部分内容')

// 监听完成事件
writeStream.on('finish', () => {
  console.log('流式写入完成')
})

// 监听错误事件
writeStream.on('error', (err) => {
  console.error('写入流时出错:', err)
})

/* 
对于大文件或需要逐步写入数据的场景，可以使用流式写入以提高性能。

fs.createWriteStream(path, options)
这玩意儿会创建一个可写流，允许逐步（分块 chunk）写入数据。
*/
```

```javascript [1.txt]
第一部分数据
第二部分数据
最后一部分内容
```

:::

## 6. 💻 demos.5 - 使用自定义 `Transform` 流

::: code-group

```javascript [1.cjs]
const fs = require('fs')
const { Transform } = require('stream')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

// 创建写入流
const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' })

// 创建一个 Transform 流，用于监控每个 chunk
const monitorStream = new Transform({
  transform(chunk, encoding, callback) {
    console.log(`正在写入: ${chunk.toString().trim()}`) // 监控 chunk
    this.push(chunk) // 将 chunk 传递下去
    callback()
  },
})

// 将 Transform 流管道连接到写入流
monitorStream.pipe(writeStream)

// 写入数据
monitorStream.write('Chunk 1\n')
monitorStream.write('Chunk 2\n')
monitorStream.write('Chunk 3\n')

// 结束写入
monitorStream.end(() => {
  console.log('写入完成')
})

// 输出：
// 正在写入: Chunk 1
// 正在写入: Chunk 2
// 正在写入: Chunk 3
// 写入完成
```

```txt [1.txt]
Chunk 1
Chunk 2
Chunk 3
```

:::
