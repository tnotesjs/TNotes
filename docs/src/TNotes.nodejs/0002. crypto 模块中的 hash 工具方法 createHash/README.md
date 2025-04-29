# [0002. crypto 模块中的 hash 工具方法 createHash](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0002.%20crypto%20%E6%A8%A1%E5%9D%97%E4%B8%AD%E7%9A%84%20hash%20%E5%B7%A5%E5%85%B7%E6%96%B9%E6%B3%95%20createHash)

<!-- region:toc -->

- [1. ⏰ 待整理](#1--待整理)

<!-- endregion:toc -->

## 1. ⏰ 待整理

- 生成唯一标识符：
- 在需要生成唯一标识符的场景下，使用字符串的十六进制表示形式可以确保唯一性。
- 例如，可以用它来生成基于字符串的哈希值或标识符。
- 数据加密与安全：
- 将字符串转换为十六进制是某些加密算法中的一步。
- 通过将数据转换为十六进制，可以便于进一步的加密或编码操作。
- 数据序列化与传输：
- 在某些情况下，将数据以十六进制形式表示并进行传输，可以避免因为字符编码问题导致的数据损坏。
- 例如，网络传输、数据库存储等。
- 调试与日志记录：
- 在调试过程中，查看数据的十六进制表示形式有助于分析和理解数据的底层结构，特别是在处理二进制数据或- 非可见字符时。
- 字符串混淆：
- 可以用来混淆字符串，使其在人类可读的形式上更加难以理解。
- 例如，用于生成配置文件或代码中的某些敏感信息。
- 生成配置文件变量名：
- 在 Vben 中，strToHex 函数被用来生成配置文件的变量名。
- Vben：https://github.com/vbenjs/vue-vben-admin
- 将应用程序标题转换为十六进制字符串，以确保变量名的唯一性和不可预测性：

```js
const getVariableName = (title) => {
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};
```
