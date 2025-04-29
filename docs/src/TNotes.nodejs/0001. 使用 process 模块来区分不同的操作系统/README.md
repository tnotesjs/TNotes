# [0001. 使用 process 模块来区分不同的操作系统](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0001.%20%E4%BD%BF%E7%94%A8%20process%20%E6%A8%A1%E5%9D%97%E6%9D%A5%E5%8C%BA%E5%88%86%E4%B8%8D%E5%90%8C%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)

<!-- region:toc -->

- [1. 💻 demos.1 - 通过 process.platform 中记录的当前平台信息来区分不同的操作系统](#1--demos1---通过-processplatform-中记录的当前平台信息来区分不同的操作系统)

<!-- endregion:toc -->

## 1. 💻 demos.1 - 通过 process.platform 中记录的当前平台信息来区分不同的操作系统

```js
function printPlatform() {
  // console.log(process.platform)
  if (process.platform === 'linux') console.log('当前使用的操作系统是 Linux')
  else if (process.platform === 'darwin') console.log('当前使用的操作系统是 MacOS')
  else if (process.platform === 'win32') console.log('当前使用的操作系统是 Windows')
  else console.log('当前使用的操作系统是未知')
}
printPlatform()
```

- 很简单也很常用的操作。
- ![](assets/2024-09-24-15-59-17.png)
