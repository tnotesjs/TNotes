# [0021. minimist 基本使用](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0021.%20minimist%20%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)

<!-- region:toc -->

- [1. 🔗 minimist](#1--minimist)
- [2. 🤖 `node 1.js args` 如何在 1.js 中获取到 args？](#2--node-1js-args-如何在-1js-中获取到-args)

<!-- endregion:toc -->

## 1. 🔗 minimist

- https://www.npmjs.com/package/minimist
  - npm minimist
- https://github.com/minimistjs/minimist
  - github minimist

## 2. 🤖 `node 1.js args` 如何在 1.js 中获取到 args？

在 Node.js 中，你可以通过 `process.argv` 数组来获取传递给脚本的命令行参数。`process.argv` 是一个数组，包含了当Node.js启动时的命令行参数。数组的第一个元素是运行Node.js的可执行文件的路径，第二个元素通常是正在执行的JavaScript文件的路径。从第三个元素开始，才是你实际传入的参数。

例如，如果你有一个名为 `1.js` 的脚本，并且你在命令行中这样运行它：

```bash
node 1.js arg1 arg2 arg3
```

那么在 `1.js` 文件中，你可以这样访问这些参数：

```javascript
// 1.js

// process.argv[0] - Node.js 可执行文件的路径
// process.argv[1] - 正在执行的脚本文件的路径 (1.js)
// process.argv[2] - 'arg1'
// process.argv[3] - 'arg2'
// process.argv[4] - 'arg3'

console.log('第一个参数:', process.argv[2]);
console.log('第二个参数:', process.argv[3]);
console.log('第三个参数:', process.argv[4]);

// 或者遍历所有额外的参数
for (let i = 2; i < process.argv.length; i++) {
  console.log(`参数 ${i - 1}:`, process.argv[i]);
}
```

如果你想以更结构化的方式处理命令行参数，可以使用一些第三方库，比如 `yargs` 或 `minimist`。它们提供了更强大的功能来解析和验证命令行选项。这里是一个使用 `minimist` 的简单例子：

首先安装 `minimist`：

```bash
npm install minimist
```

然后在你的 `1.js` 脚本中使用它：

```javascript
// 1.js
const argv = require('minimist')(process.argv.slice(2));

console.log('第一个参数:', argv._[0]); // 如果没有指定选项名，则默认放在 _ 数组中
console.log('第二个参数:', argv._[1]);
console.log('第三个参数:', argv._[2]);

// 假设你指定了选项，例如 --name 和 --age
console.log('名字:', argv.name);
console.log('年龄:', argv.age);
```

当你运行如下命令时：

```bash
node 1.js arg1 arg2 arg3 --name "John Doe" --age 30
```

上述代码将能够正确解析出各个参数。
