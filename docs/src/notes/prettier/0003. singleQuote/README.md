# [0003. singleQuote](https://github.com/Tdahuyou/prettier/tree/main/0003.%20singleQuote)

<!-- region:toc -->
- [1. 💻 demos.1 - singleQuote - 使用单引号](#1--demos1---singlequote---使用单引号)
<!-- endregion:toc -->
- singleQuote 默认值是 false，表示格式化后默认使用的是双引号，如果你想要使用单引号，可以将 singleQuote 设置为 true。

## 1. 💻 demos.1 - singleQuote - 使用单引号

- prettier 配置文件 .prettierrc 文件内容如下：

```json
{
  "singleQuote": true
}
```

- 测试文件内容如下：

```js
console.log("semi singleQuote");
```

- 格式化之后的效果如下：

```js
console.log('semi singleQuote');
```