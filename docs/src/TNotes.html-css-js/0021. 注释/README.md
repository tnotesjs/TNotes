# [0021. 注释](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0021.%20%E6%B3%A8%E9%87%8A)

<!-- region:toc -->

- [1. 🔗 JSDoc 官网](#1--jsdoc-官网)
- [2. 📒 注释是什么](#2--注释是什么)
- [3. 📒 注释的分类](#3--注释的分类)
- [4. 📒 文档注释](#4--文档注释)
- [5. 📒 区域注释](#5--区域注释)
- [6. 💻 demos.1 - 单行注释和多行注释](#6--demos1---单行注释和多行注释)
- [7. 💻 demos.2 - 特殊的单行注释](#7--demos2---特殊的单行注释)
- [8. 💻 demos.3 - 文档注释](#8--demos3---文档注释)
- [9. 💻 demos.4 - 区域注释](#9--demos4---区域注释)

<!-- endregion:toc -->
- 知识点：
  - 单行注释
  - 多行注释
  - 文档注释
  - 区域注释

## 1. 🔗 JSDoc 官网

https://jsdoc.app/

## 2. 📒 注释是什么

源码中 **被 JS 引擎忽略的部分** 就叫做注释，它的作用是对代码进行解释。

## 3. 📒 注释的分类

- 单行注释：`**// ...**`、`<!-- ...`、`--> ...`
- 多行注释：`**/* ... */**`
- 文档注释：以 `/**` 开头，然后每行都以 `*` 开始，最后以 `*/` 结束
- 区域注释：`// #region 区域描述` `// #endregion 区域描述`

## 4. 📒 文档注释

- 在多数编程语言中，文档注释有特定的格式，使得工具能够轻松识别和解析它们。
- 在某个函数声明的前一行，输入 `/**` 后按下回车就会自动生成文档注释。然后依次按下 `tab` 键，输入一个个位置的注释信息。
- 文档注释示例：

```javascript
/**
 * 计算两个数字的和。
 *
 * @param {number} a - 第一个数。
 * @param {number} b - 第二个数。
 * @returns {number} 两个数的和。
 */
function add(a, b) {
  return a + b;
}
```

- 文档注释是一种特殊类型的注释，它的目的不仅仅是为了在代码中添加简单的注解或描述。它通常用于描述代码的结构、功能、参数和返回值等，以方便其他开发者理解和使用该代码。此外，很多工具（比如 [JSDoc](https://jsdoc.app/)）可以解析这些注释来自动生成 API 文档（生成步骤在本节 demos 中有记录）。
- **文档注释的作用**
  1. 提高代码的可读性和可维护性。
  2. 使其他开发者更容易理解和使用你的代码。
  3. 允许自动生成详细和格式化的 API 文档。
- 在上面的示例中：
  - `@param` 标签描述了函数的参数，包括其类型和名称。
  - `@returns`（或 `@return`）标签描述了函数的返回值。
- JSDoc 提供了许多其他标签，如 `@class`, `@constructor`, `@deprecated`, `@throws` 等，用于描述各种代码特性和行为。
- 有关文档注释的语法还有很多，这里不做过多介绍，后续会考虑单独写文档加以说明。

## 5. 📒 区域注释

- 区域注释（Region Comments）是一种使代码更加可读和组织化的方式，特别是在大型代码文件中。
  - 这里说的“大型”不太好量化，看个人感觉来定。
  - 我通常会在某个模块中的代码量需要频繁上下滚动的时候使用文档注释。或者对于某个固定的区域，也会使用文档注释来统一标识，比如每篇笔记的头部大纲区域。
- 这些注释在许多代码编辑器和集成开发环境（IDEs）中都得到支持（例如 Visual Studio Code、Visual Studio 等）。通过区域注释，你可以折叠和展开特定代码块，从而更容易地导航和管理代码。
- **使用区域注释一共有两步：**
  1. **定义区域开始**：使用 `// #region 区域描述` 来标记区域的开始。 
  2. **定义区域结束**：使用 `// #endregion 区域描述` 来标记区域的结束。 
- **注意：**
  - `// #region` 和 `// #endregion` 要成对出现。
  - 开始位置和结束位置的区域描述最好能够保持一致，以便识别。
- 在编写代码时，你可以将那些你暂时不关心的 region 给折叠起来，专心处理那些你当前关心的 region。

## 6. 💻 demos.1 - 单行注释和多行注释

```javascript
// 源码中被 JS 引擎忽略的部分就叫做注释，它的作用是对代码进行解释。
// JS 提供两种注释的写法：一种是单行注释，用//起头；另一种是多行注释，放在/*和*/之间。

// 这是单行注释

/*
 这是
 多行
 注释
*/
```

## 7. 💻 demos.2 - 特殊的单行注释

```javascript
// 由于历史上 JS 可以兼容 HTML 代码的注释，所以<!--和-->也被视为合法的单行注释。

x = 1; <!-- x = 2;
--> x = 3;

console.log(x) // 1

// 上面代码中，只有 x = 1 会执行，其他的部分都被注释掉了。
// 注意：--> 只有在行首，才会被当成单行注释，否则会当作正常的运算。
```

- ![](assets/2024-12-31-17-11-49.png)
- 虽然在 VSCode 中，这些写法会报红，但是程序是可以正常运行的。
- ![](assets/2024-12-31-17-11-57.png)
- 你可以将这段程序搬运到浏览器调试工具中跑一下看看效果，会发现能够正常输出 1。

```javascript
function countdown(n) {
  while (n --> 0) console.log(n);
}
countdown(3)
// 2
// 1
// 0

// 上面代码中，n --> 0实际上会当作n-- > 0，因此输出2、1、0。
```

## 8. 💻 demos.3 - 文档注释

```javascript
/**
 * 计算两个数字的和。
 *
 * @param {number} a - 第一个数。
 * @param {number} b - 第二个数。
 * @returns {number} 两个数的和。
 */
function add(a, b) {
    return a + b;
}
```

- 上述这是文档注释，比如你想要生成一个接口文档，就可以使用 JSDoc 来实现。
- **基本流程：**
  1. 安装 JSDoc：`npm i -g jsdoc`
  2. 使用 jsdoc 命令来生成文档：`jsdoc 1.js`，这个命令会生成一个 `out` 目录，里面包含生成的 HTML 文档。
- **生成产物：**
  - ![](assets/2024-12-31-17-13-27.png)
  - 如果不想安装 jsdoc 的话，也可以直接使用 `npx jsdoc 1.js` 来临时体验一下。
    - out/1.js.html
      - ![](https://cdn.nlark.com/yuque/0/2024/png/2331396/1717771199487-ce3a4790-6983-4404-87d0-2bb3cd870e7a.png)
    - out/global.html
      - ![](https://cdn.nlark.com/yuque/0/2024/png/2331396/1717771130480-886d3970-38bc-4bd5-9ef8-c0aba918aa12.png)
- **可配置**
  - 你可以使用配置文件来自定义生成的文档。创建一个 jsdoc.json 文件，并添加你需要的配置。
  - 详细的配置说明：https://jsdoc.app/about-configuring-jsdoc

```javascript
{
  "source": {
    "include": ["src"],
    "exclude": ["node_modules"]
  },
  "opts": {
    "destination": "./docs",
    "recurse": true,
    "template": "templates/default"
  }
}
```

## 9. 💻 demos.4 - 区域注释

```javascript
// #region 数学函数

/**
 * 计算两个数字的和。
 *
 * @param {number} a - 第一个数。
 * @param {number} b - 第二个数。
 * @returns {number} 两个数的和。
 */
function add(a, b) {
    return a + b;
}

/**
 * 计算两个数字的差。
 *
 * @param {number} a - 被减数。
 * @param {number} b - 减数。
 * @returns {number} 两个数的差。
 */
function subtract(a, b) {
    return a - b;
}

// #endregion 数学函数

// #region 字符串函数

/**
 * 将字符串转换为大写。
 *
 * @param {string} str - 输入字符串。
 * @returns {string} 转换为大写的字符串。
 */
function toUpperCase(str) {
    return str.toUpperCase();
}

/**
 * 将字符串转换为小写。
 *
 * @param {string} str - 输入字符串。
 * @returns {string} 转换为小写的字符串。
 */
function toLowerCase(str) {
    return str.toLowerCase();
}

// #endregion 字符串函数
```

- 在这个示例中，我们使用 `// #region` 和 `// #endregion` 来将相关的函数分组。你可以根据需要添加描述，以便更好地理解这些区域的内容。
- 你可以选择性地将区域给折叠起来，在 VSCode 中，区域开始位置的数字右侧会有一个符号：
  - ![](assets/2024-12-31-17-19-24.png)
  - 点击后即可折叠
  - ![](assets/2024-12-31-17-19-32.png)
- 并且，在右侧的缩略图中，你会发现区域的名字会放大显示，以便于你尽快找到对应的代码区域所在的位置。
  - ![](assets/2024-12-31-17-19-56.png)
- 下面是全部折叠起来之后的效果。
  - ![](https://cdn.nlark.com/yuque/0/2024/png/2331396/1717771637730-7f73183d-cae9-4ff1-8dfe-b4545ae58bc3.png)
- 不同的编辑器对这玩意儿的支持会有所不同，上述介绍的仅仅是 VSCode 环境下的效果。
  - webstorm 对着玩意儿的支持好像会更好一些。
