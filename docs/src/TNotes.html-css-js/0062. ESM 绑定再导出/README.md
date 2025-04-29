# [0062. ESM 绑定再导出](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0062.%20ESM%20%E7%BB%91%E5%AE%9A%E5%86%8D%E5%AF%BC%E5%87%BA)

某个目录下提供一个导出该目录下所有需要导出的文件的入口文件。
![](assets/2024-09-29-15-11-04.png)
`demo/utils/index.js` 用于导入所有 `demo/utils/*.js` 模块导出的内容，然后再将这些导入的内容统一导出，外部如果需要使用 `demo/utils` 中的模块，只需要导入 `demo/utils/index.js` 即可。
