# [0077. encodeURIcomponent](https://github.com/Tdahuyou/html-css-js/tree/main/0077.%20encodeURIcomponent)


## 🤖 AI - 一个带有空格等非法字符的字符串如何编码为合法的 url

将带有空格等非法字符的字符串编码为合法的URL，可以使用JavaScript中的`encodeURIComponent`函数。这个函数会将字符串中的特殊字符转换为它们的UTF-8编码形式，并以百分号（%）和两位十六进制数表示。

### 示例

假设你有一个字符串 `my string with spaces and special characters!@#$%^&*()_+`

```javascript
const originalString = "my string with spaces and special characters!@#$%^&*()_+";
const encodedString = encodeURIComponent(originalString);

console.log(encodedString);
```

### 输出

```
my%20string%20with%20spaces%20and%20special%20characters%21%40%23%24%25%5E%26%2A%28%29_%2B
```

### 说明

- `encodeURIComponent` 会将以下字符进行编码：
  - 所有非字母数字字符（除了 `- _ . ! ~ * ' ( )`）
  - 空格会被编码为 `%20`
  - 特殊字符如 `! @ # $ % ^ & * ( ) _ +` 也会被编码

### 使用场景

当你需要将字符串作为URL的一部分传递时，例如在查询参数中，或者在路径中包含特殊字符时，使用 `encodeURIComponent` 是非常重要的。这样可以确保URL是合法且能够被正确解析的。

### 反向解码

如果你需要从URL中提取并解码这些字符串，可以使用 `decodeURIComponent` 函数：

```javascript
const decodedString = decodeURIComponent(encodedString);

console.log(decodedString);
```

### 输出

```
my string with spaces and special characters!@#$%^&*()_+
```

### 完整示例

```javascript
const originalString = "my string with spaces and special characters!@#$%^&*()_+";
const encodedString = encodeURIComponent(originalString);
console.log("Encoded:", encodedString);

const decodedString = decodeURIComponent(encodedString);
console.log("Decoded:", decodedString);
```

### 输出

```
Encoded: my%20string%20with%20spaces%20and%20special%20characters%21%40%23%24%25%5E%26%2A%28%29_%2B
Decoded: my string with spaces and special characters!@#$%^&*()_+
```

通过这种方式，你可以确保你的字符串在URL中是合法的，并且可以在需要时正确地解码回原始字符串。