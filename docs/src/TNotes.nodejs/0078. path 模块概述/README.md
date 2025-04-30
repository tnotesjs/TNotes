# [0078. path 模块概述](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0078.%20path%20%E6%A8%A1%E5%9D%97%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - `path.join([...paths])`](#2--demos1---pathjoinpaths)
- [3. 💻 demos.2 - `path.resolve([...paths])`](#3--demos2---pathresolvepaths)
- [4. 💻 demos.3 - `path.basename(path[, ext])`](#4--demos3---pathbasenamepath-ext)
- [5. 💻 demos.4 - `path.dirname(path)`](#5--demos4---pathdirnamepath)
- [6. 💻 demos.5 - `path.extname(path)`](#6--demos5---pathextnamepath)
- [7. 💻 demos.6 - `path.isAbsolute(path)`](#7--demos6---pathisabsolutepath)
- [8. 💻 demos.7 - `path.parse(path)` 和 `path.format(pathObject)`](#8--demos7---pathparsepath-和-pathformatpathobject)
- [9. 💻 demos.8 - `path.normalize(path)`](#9--demos8---pathnormalizepath)
- [10. 💻 demos.9 - `path.posix` 和 `path.win32`](#10--demos9---pathposix-和-pathwin32)
- [11. 💻 demos.10 - `path.relative(from, to)`](#11--demos10---pathrelativefrom-to)

<!-- endregion:toc -->

## 1. 📒 概述

- **`path` 模块**：
  - `path` 模块在 Node.js 中主要是用来处理 **文件路径** 的。
  - `path` 模块提供了一系列方法来操作文件路径字符串，无论是绝对路径还是相对路径，都可以通过 `path` 模块进行解析、规范化和拼接等操作。
- **主要功能**：
  - 解析和规范化路径。
    - 由于路径在不同的操作系统中有不同的格式（例如 Windows 使用反斜杠 `\`，而 Unix/Linux 使用正斜杠 `/`），`path` 模块能够根据运行环境自动适配这些差异，从而确保跨平台兼容性。
  - 提取路径中的不同部分（如目录名、文件名、扩展名等）。
  - 拼接路径片段。
  - 判断路径是否为绝对路径。
- **注意事项**：
  - `path` 模块关注的是路径的处理，它 care 路径是否真实有效，比如你随便传递一个 `foo/bar` 不存在的路径，`path` 模块也能正常工作，并不会报错。
- **跨平台**：
  - 为了更好地支持跨平台开发，`path` 模块提供了两个子模块：`path.posix` 和 `path.win32`
  - **`path.posix`**：强制使用 POSIX 风格的路径（适用于 Unix/Linux 系统）。
    - portable operating system interface，可移植操作系统接口。
  - **`path.win32`**：强制使用 Windows 风格的路径。
- **常用方法**：

| 方法名 | 描述 |
| --- | --- |
| `path.join([...paths])` | 将多个路径片段拼接成一个完整的路径，并规范化路径。 |
| `path.resolve([...paths])` | 将路径片段解析为绝对路径，从右向左解析直到生成绝对路径。 |
| `path.basename(path[, ext])` | 获取路径中的文件名部分，可选去除扩展名。 |
| `path.dirname(path)` | 获取路径中的目录部分。 |
| `path.extname(path)` | 获取路径中的文件扩展名，如果没有扩展名则返回空字符串。 |
| `path.isAbsolute(path)` | 判断给定路径是否为绝对路径格式。 |
| `path.parse(path)` | 将路径解析为对象形式，包含 `root`、`dir`、`base`、`ext` 和 `name`。 |
| `path.format(pathObject)` | 将路径对象重新格式化为字符串路径。 |
| `path.normalize(path)` | 规范化路径，去除多余的 `..`、`.` 和重复的分隔符。 |
| `path.relative(form, to)` | 根据当前工作目录返回 from 到 to 的相对路径。 |

- **常用属性**：

| 属性名 | 描述 |
| --- | --- |
| `path.sep` | 提供平台特定的路径分隔符。在 POSIX 系统中是 `/`，在 Windows 系统中是 `\`。 |
| `path.delimiter` | 提供平台特定的路径分隔符，用于分隔环境变量中的路径。在 POSIX 系统中是 `:`，在 Windows 系统中是 `;`。 |
| `path.posix` | 提供对 POSIX 风格路径方法和属性的访问，确保跨平台一致性。 |
| `path.win32` | 提供对 Windows 风格路径方法和属性的访问，确保跨平台一致性。 |

## 2. 💻 demos.1 - `path.join([...paths])`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(process.platform) // darwin

console.log(path.join('/foo', 'bar', 'baz/file.txt')) // => /foo/bar/baz/file.txt
console.log(path.join('/foo', 'bar', '..')) // => /foo
console.log(path.join('/foo', '../bar')) // => /bar

console.log(path.win32.join('/foo', 'bar', 'baz/file.txt')) // => \foo\bar\baz\file.txt
console.log(path.win32.join('/foo', 'bar', '..')) // => \foo
console.log(path.win32.join('/foo', '../bar')) // => \bar

// path.join()
// 自动处理多余的分隔符（如多余的 / 或 \）。
// 如果传入的路径片段包含 .. 或 .，会正确解析相对路径。
```

:::

- path 模块中的 `join()` 方法连接路径（使用平台特定的路径分隔符，POSIX 系统是 `/`，Windows 系统是 `\`）​。
- 语法格式：`path.join([ ...paths ])`

## 3. 💻 demos.2 - `path.resolve([...paths])`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(path.resolve())
console.log(path.resolve('foo', 'bar', 'baz/file.txt'))
console.log(path.resolve(__dirname))

// 输出：
// /Users/huyouda/zm/notes/TNotes.nodejs/notes/0078. path 模块概述
// /Users/huyouda/zm/notes/TNotes.nodejs/notes/0078. path 模块概述/foo/bar/baz/file.txt
// /Users/huyouda/zm/notes/TNotes.nodejs/notes/0078. path 模块概述/demos/2

// path.resolve() 方法将路径或路径片段的序列解析为绝对路径。
// 从右向左解析路径，直到生成一个绝对路径为止。
// 如果所有路径片段都无法形成绝对路径，则默认使用当前工作目录。（也就是运行 node 命令的位置）
```

:::

- 如果 `resolve()` 方法中的路径序列经处理后无法构造成绝对路径，则处理后的路径序列会 **自动追加到当前工作目录**。
- 如果参数值为空，则返回当前工作路径。
  - 因此，如果你想要知道用户当前的 node 命令的运行位置，可以通过 `path.resolve()` 来获取。

## 4. 💻 demos.3 - `path.basename(path[, ext])`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(path.basename('/foo/bar/baz/file.txt')) // => file.txt
console.log(path.basename('/foo/bar/baz/file.txt', '.txt')) // => file

// path.basename('/foo/bar/baz/file.txt')
// 表示的获取路径中的文件名部分。

// path.basename('/foo/bar/baz/file.txt', '.txt')
// 表示的获取路径中的文件名部分，并去除扩展名部分 .txt。
```

:::

## 5. 💻 demos.4 - `path.dirname(path)`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(path.dirname('/foo/bar/baz/file.txt'))
// => /foo/bar/baz
```

:::

## 6. 💻 demos.5 - `path.extname(path)`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(path.extname('/foo/bar/baz/file.txt'))
// => .txt

console.log(path.extname('/foo/bar/baz/file'))
// => ''

// 如果路径中没有扩展名，则返回空字符串 ''。
```

```js [2.cjs]
const path = require('path')

const filePath = '/foo/bar/baz/file.txt'

console.log(
  `获取路径 ${filePath} 中的文件名（不带后缀）：${path.basename(
    filePath,
    path.extname(filePath) // 将结尾的扩展名去除
  )}`
)

// 输出：
// 获取路径 /foo/bar/baz/file.txt 中的文件名（不带后缀）：file
```

:::

## 7. 💻 demos.6 - `path.isAbsolute(path)`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(path.isAbsolute('/foo/bar')) // => true
console.log(path.posix.isAbsolute('/foo/bar')) // => true
console.log(path.win32.isAbsolute('/foo/bar')) // => true

console.log('----------------------------------------')

console.log(path.isAbsolute('foo/bar')) // => false
console.log(path.posix.isAbsolute('foo/bar')) // => false
console.log(path.win32.isAbsolute('foo/bar')) // => false

console.log('----------------------------------------')

console.log(path.isAbsolute('D:\\Demo\\js.js')) // => false
console.log(path.posix.isAbsolute('D:\\Demo\\js.js')) // => false
console.log(path.win32.isAbsolute('D:\\Demo\\js.js')) // => true

console.log('----------------------------------------')

console.log(path.isAbsolute('..\\Demo\\js.js')) // => false
console.log(path.posix.isAbsolute('..\\Demo\\js.js')) // => false
console.log(path.win32.isAbsolute('..\\Demo\\js.js')) // => false

console.log('----------------------------------------')

// path.isAbsolute()
// 判断给定路径是否为绝对路径格式。
```

:::

- **重点**：`path.isAbsolute(filePath)` 同一个路径字符串 `filePath`，你在不同的系统环境下运行，可能会得到不同的结果。
- `path.isAbsolute` 的行为依赖于运行环境，而 `path.posix.isAbsolute` 和 `path.win32.isAbsolute` 提供了明确的跨平台路径规则支持。
- 不同操作系统的路径格式差异（如 `/` 和 `\`，以及盘符的存在）会影响绝对路径的判断结果。
- 该示例展示了 `path.isAbsolute` 方法在不同路径格式和操作系统下的行为。
- 使用了三种方式调用方法：
  - `path.isAbsolute`：根据运行环境自动判断路径格式（POSIX 或 Windows）。
  - `path.posix.isAbsolute`：强制使用 POSIX 风格路径规则。
  - `path.win32.isAbsolute`：强制使用 Windows 风格路径规则。
- 示例分为四个部分，分别测试了不同路径格式的绝对路径判断结果：
  - **第一部分**：测试以 `/` 开头的路径，在所有规则下均返回 `true`，因为 `/` 是 POSIX 和 Windows 的绝对路径标识。
  - **第二部分**：测试相对路径 `foo/bar`，在所有规则下均返回 `false`，因为它不是绝对路径。
  - **第三部分**：测试 Windows 风格的绝对路径 `D:\\Demo\\js.js`：
    - 在 `path.isAbsolute` 和 `path.posix.isAbsolute` 下返回 `false`，因为它们不识别 Windows 风格的盘符。
    - 在 `path.win32.isAbsolute` 下返回 `true`，因为它正确解析了 Windows 绝对路径。
  - **第四部分**：测试相对路径 `..\\Demo\\js.js`，在所有规则下均返回 `false`，因为它始终是相对路径。

## 8. 💻 demos.7 - `path.parse(path)` 和 `path.format(pathObject)`

::: code-group

```js [1.cjs]
const path = require('path')

// 解析路径
const parsed = path.parse('/foo/bar/baz/file.txt')
console.log(parsed)
/* => {
  root: '/',
  dir: '/foo/bar/baz',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/

// 格式化路径
const formatted = path.format({
  dir: '/foo/bar/baz',
  base: 'file.txt',
})
console.log(formatted) // => /foo/bar/baz/file.txt

console.log(path.format(parsed)) // => /foo/bar/baz/file.txt

// path.parse(path) 将路径解析为对象形式。
// path.format(pathObject) 将路径对象重新格式化为字符串。

// path.parse(path)
// 返回一个 path.ParsedPath 对象

// path.format(pathObject)
// 传入的是一个 FormatInputPathObject 对象
```

```js [2.cjs]
const path = require('path')

console.log(
  path.win32.resolve(
    path.format({
      root: 'C:\\',
      dir: 'D:\\demo\\images',
      base: 'a.png',
      name: 'b',
      ext: '.jpg',
    })
  )
) // => D:\demo\images\a.png

console.log(
  path.win32.resolve(
    path.format({
      dir: 'D:\\demo\\images',
      base: 'a.png',
    })
  )
) // => D:\demo\images\a.png

console.log(
  path.format({
    root: 'C:\\',
    name: 'a',
    ext: '.png',
  })
) // => C:\a.png

// 优先级：
// dir 属性高于 root 属性，所以同时出现 dir 属性和 root 属性时，忽略 root 属性。
// base 属性高于 name 属性和 ext 属性，所以当 base 属性出现时，忽略 name 属性和 ext 属性。
```

```ts [ParsedPath]
/**
 * A parsed path object generated by path.parse() or consumed by path.format().
 */
interface ParsedPath {
  /**
   * The root of the path such as '/' or 'c:\'
   */
  root: string
  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir: string
  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base: string
  /**
   * The file extension (if any) such as '.html'
   */
  ext: string
  /**
   * The file name without extension (if any) such as 'index'
   */
  name: string
}

// root：路径所属的根盘符。
// dir：路径所属的文件夹。
// base：路径对应的文件名。
// ext：路径对应文件的扩展名。
// name：文件对应的文件名称（不包含扩展名）​。
```

```ts [FormatInputPathObject]
interface FormatInputPathObject {
  /**
   * The root of the path such as '/' or 'c:\'
   */
  root?: string | undefined
  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir?: string | undefined
  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base?: string | undefined
  /**
   * The file extension (if any) such as '.html'
   */
  ext?: string | undefined
  /**
   * The file name without extension (if any) such as 'index'
   */
  name?: string | undefined
}
```

:::

## 9. 💻 demos.8 - `path.normalize(path)`

::: code-group

```js [1.cjs]
const path = require('path')

const p1 = '/foo/bar//baz/../../file.txt'
const p2 = 'D:/demo/11/js.js'
const p3 = 'D:/\\demo\\/11/\\js.js'
const p4 = 'D:\\demo\\11\\js.js'
const p5 = '..\\demo\\a.mp4'
const p6 = '.\\demo\\a.mp4'
const p7 = '../demo/a.mp4'
const p8 = './demo/a.mp4'

console.log(p1, '👉', path.normalize(p1))
console.log(p2, '👉', path.normalize(p2))
console.log(p3, '👉', path.normalize(p3))
console.log(p4, '👉', path.normalize(p4))
console.log(p5, '👉', path.normalize(p5))
console.log(p6, '👉', path.normalize(p6))
console.log(p7, '👉', path.normalize(p7))
console.log(p8, '👉', path.normalize(p8))

console.log('---------------------------------------------')

console.log(p1, '👉', path.win32.normalize(p1))
console.log(p2, '👉', path.win32.normalize(p2))
console.log(p3, '👉', path.win32.normalize(p3))
console.log(p4, '👉', path.win32.normalize(p4))
console.log(p5, '👉', path.win32.normalize(p5))
console.log(p6, '👉', path.win32.normalize(p6))
console.log(p7, '👉', path.win32.normalize(p7))
console.log(p8, '👉', path.win32.normalize(p8))

// 输出：
// /foo/bar//baz/../../file.txt 👉 /foo/file.txt
// D:/demo/11/js.js 👉 D:/demo/11/js.js
// D:/\demo\/11/\js.js 👉 D:/\demo\/11/\js.js
// D:\demo\11\js.js 👉 D:\demo\11\js.js
// ..\demo\a.mp4 👉 ..\demo\a.mp4
// .\demo\a.mp4 👉 .\demo\a.mp4
// ../demo/a.mp4 👉 ../demo/a.mp4
// ./demo/a.mp4 👉 demo/a.mp4
// ---------------------------------------------
// /foo/bar//baz/../../file.txt 👉 \foo\file.txt
// D:/demo/11/js.js 👉 D:\demo\11\js.js
// D:/\demo\/11/\js.js 👉 D:\demo\11\js.js
// D:\demo\11\js.js 👉 D:\demo\11\js.js
// ..\demo\a.mp4 👉 ..\demo\a.mp4
// .\demo\a.mp4 👉 demo\a.mp4
// ../demo/a.mp4 👉 ..\demo\a.mp4
// ./demo/a.mp4 👉 demo\a.mp4

// 规范化路径，去除多余的 .. 或 . 和重复的分隔符。
```

:::

- path 模块中的 normalize() 方法可用于解析和规范化路径，当路径中包含 `.` ​`..`​ `\` `/` 之类的相对说明符时，该方法会尝试分析实际的路径。
- 路径规范化的最终效果跟你当前的系统环境有关。

## 10. 💻 demos.9 - `path.posix` 和 `path.win32`

::: code-group

```js [1.cjs]
const path = require('path')

console.log(path.posix.join('foo', 'bar')) // => foo/bar
console.log(path.win32.join('foo', 'bar')) // => foo\bar
```

:::

## 11. 💻 demos.10 - `path.relative(from, to)`

::: code-group

```js [/1.cjs]
const path = require('path')

const pathList = [
  'D:\\mydiro\\index.html',
  '..\\images\\a.png',
  'D:\\mydiro\\images\\b.jpg',
  'D:\\mydiro\\js\\bootstrap.min.js',
  '..\\js\\main.js',
  'D:\\mydiro\\css\\bootstrap.min.css',
  '..\\css\\main.css',
]
// 需求：以 pathList[0] 作为基准，将路径列表中的所有绝对路径转为相对路径。

let log = ''
const baseDir = pathList[0]

pathList.forEach((filePath, i) => {
  if (path.win32.isAbsolute(filePath)) {
    const relativePath = path.win32.relative(baseDir, filePath)
    pathList[i] = relativePath
    log += `【${filePath}】为绝对路径\n相对【${baseDir}】的路径为：【${relativePath}】\n\n`
  }
})

console.log(log)

// 输出：
// 【D:\mydiro\index.html】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【】

// 【D:\mydiro\images\b.jpg】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【..\images\b.jpg】

// 【D:\mydiro\js\bootstrap.min.js】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【..\js\bootstrap.min.js】

// 【D:\mydiro\css\bootstrap.min.css】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【..\css\bootstrap.min.css】
```

:::
