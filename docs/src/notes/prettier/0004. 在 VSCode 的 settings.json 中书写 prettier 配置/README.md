# [0004. 在 VSCode 的 settings.json 中书写 prettier 配置](https://github.com/Tdahuyou/prettier/tree/main/0004.%20%E5%9C%A8%20VSCode%20%E7%9A%84%20settings.json%20%E4%B8%AD%E4%B9%A6%E5%86%99%20prettier%20%E9%85%8D%E7%BD%AE)

<!-- region:toc -->
- [1. 💻 demos.1 - 将 prettier 配置信息写到项目根目录中的 .vscode/settings.json 文件中](#1--demos1---将-prettier-配置信息写到项目根目录中的-vscodesettingsjson-文件中)
<!-- endregion:toc -->

## 1. 💻 demos.1 - 将 prettier 配置信息写到项目根目录中的 .vscode/settings.json 文件中

- `.vscode/settings.json` 文件内容如下：

```json
{
  "prettier.singleQuote": true,
  "prettier.semi": false
}
```

- 上述配置表示默认使用单引号，并且在语句的结尾默认不加分号。
- 下面是用于测试的文件内容：

```js
console.log("test .vscode/settings.json");
```

- 格式化之后的内容如下：

```js
console.log('test .vscode/settings.json')
```