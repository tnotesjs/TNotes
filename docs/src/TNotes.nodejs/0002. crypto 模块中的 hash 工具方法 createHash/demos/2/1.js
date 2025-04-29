function strToHex(str) {
  const result = [];
  for (let i = 0; i < str.length; ++i) {
    const hex = str.charCodeAt(i).toString(16);
    debugger
    result.push(('000' + hex).slice(-4));
  }
  return result.join('').toUpperCase();
}

// 这个 strToHex 函数的作用是将一个字符串转换为其对应的十六进制表示形式。
// 每个字符的 Unicode 码点被转换为四位的十六进制数，并以大写字母表示。

// 调用示例
console.log(strToHex('a')) // 0061
// a 的 ASCII 是 97，97 的十六进制是 61（6 * 16 + 1 === 97）
console.log(strToHex('Hello World')); // 00480065006C006C006F00200057006F0072006C0064