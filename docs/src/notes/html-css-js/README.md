# html-css-js

前端三件套笔记。


## 1. var、let、const

- [x] [0001. var 关键字和变量](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html) <!-- [locale](./0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html) -->  
  - [1. 💡 思维导图](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#1--思维导图)
  - [2. 📒 理解变量、内存、值](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#2--理解变量内存值)
  - [3. 💻 demos.11 - `var` 关键字的作用域特性](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#3--demos11---var-关键字的作用域特性)
  - [4. 📒 不再推荐使用 `var` 来声明变量](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#4--不再推荐使用-var-来声明变量)
  - [5. 💻 demos.1 - 理解变量和值](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#5--demos1---理解变量和值)
  - [6. 💻 demos.2 - 区分大小写](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#6--demos2---区分大小写)
  - [7. 💻 demos.3 - 变量的声明、赋值](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#7--demos3---变量的声明赋值)
  - [8. 💻 demos.4 - 仅声明未赋值为 undefined](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#8--demos4---仅声明未赋值为-undefined)
  - [9. 💻 demos.5 - 全局变量](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#9--demos5---全局变量)
  - [10. 💻 demos.6 - 使用未声明的变量会报错](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#10--demos6---使用未声明的变量会报错)
  - [11. 💻 demos.7 - 可一次声明多个变量](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#11--demos7---可一次声明多个变量)
  - [12. 💻 demos.8 - 理解“动态”类型](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#12--demos8---理解动态类型)
  - [13. 💻 demos.9 - 变量重复声明无效](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#13--demos9---变量重复声明无效)
  - [14. 💻 demos.10 - 变量重复声明并重新赋值](https://tdahuyou.github.io/notes/notes/html-css-js/0001.%20var%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E5%8F%98%E9%87%8F/README.html#14--demos10---变量重复声明并重新赋值)
  - 知识点：
    - 理解变量、内存、值是什么
    - 了解 var 关键字的基本使用
    - 直到 var 关键字已被淘汰，不再推荐使用
  

- [x] [0002. 变量声明提升和暂时性死区](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html) <!-- [locale](./0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html) -->  
  
  - [1. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#1--links)
  - [2. 📒 变量声明提升和暂时性死区](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#2--变量声明提升和暂时性死区)
  - [3. 💻 demos.1 - var 声明](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#3--demos1---var-声明)
  - [4. 💻 demos.2 - let 和 const 声明](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#4--demos2---let-和-const-声明)
  - [5. 💻 demos.3 - 函数声明](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#5--demos3---函数声明)
  - [6. 💻 demos.4 - 函数表达式](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#6--demos4---函数表达式)
  - [7. 💼 面试题.1 - 下面的代码输出什么？](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#7--面试题1---下面的代码输出什么)
  - [8. 💼 面试题.2 - 下面的代码输出的结果是什么？](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#8--面试题2---下面的代码输出的结果是什么)
  - [9. 💼 面试题.3 - 请谈谈什么是变量声明提升？](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#9--面试题3---请谈谈什么是变量声明提升)
  - [10. 🤔 思考 - let、const 真的有被提升吗？](https://tdahuyou.github.io/notes/notes/html-css-js/0002.%20%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E6%8F%90%E5%8D%87%E5%92%8C%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA/README.html#10--思考---letconst-真的有被提升吗)
  - 知识点：
    - 变量声明提升
    - var、let、const 声明
    - 函数声明
    - 函数表达式
    - 暂时性死区（TDZ）
  - 变量声明提升可以算是面试题常客，需要知道变量声明提升是什么。
  - 介绍了什么是变量声明提升、什么是暂时性死区，并通过一些示例，来了解在 JS 中不同类型的变量的声明和提升机制。
  

- [x] [0003. let 关键字](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html) <!-- [locale](./0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html) -->  
  - [1. 📒 let 关键字](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#1--let-关键字)
  - [2. 💻 demos.1 - 块级作用域](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#2--demos1---块级作用域)
  - [3. 💻 demos.2 - 对比 for 循环的循环变量使用 var 和 let 来定义](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#3--demos2---对比-for-循环的循环变量使用-var-和-let-来定义)
  - [4. 💻 demos.3 - let 暂时性死区](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#4--demos3---let-暂时性死区)
  - [5. 💻 demos.4 - 函数参数默认值中的死区](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#5--demos4---函数参数默认值中的死区)
  - [6. 💻 demos.5 - 其他奇怪的报错](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#6--demos5---其他奇怪的报错)
  - [7. 💻 demos.6 - 同一作用域内不允许重复声明](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#7--demos6---同一作用域内不允许重复声明)
  - [8. 💻 demos.7 - for 循环的特别之处](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#8--demos7---for-循环的特别之处)
  - [9. 💻 demos.8 - let 出现之前的一些历史问题](https://tdahuyou.github.io/notes/notes/html-css-js/0003.%20let%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#9--demos8---let-出现之前的一些历史问题)
  - 知识点：
    - let 关键字
    - 块级作用域
    - 暂时性死区（TDZ）
    - 经典的“闭包陷阱”问题
  - let 关键字的规则不多，也比较好理解。在 let、const 关键字出现之前，定义变量只能使用 var 关键字，var 这玩意儿存在不少问题，有很多经典的历史问题在 let、const 出现之后都引刃而解了。
  

- [x] [0004. const 关键字](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html) <!-- [locale](./0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html) -->  
  - [1. 📒 const 关键字](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#1--const-关键字)
  - [2. 📒 理解 const 的 “常量约束” 的本质](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#2--理解-const-的-常量约束-的本质)
  - [3. 📒 栈内存、堆内存](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#3--栈内存堆内存)
  - [4. 💻 demos.1 - 常量不允许重新赋值](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#4--demos1---常量不允许重新赋值)
  - [5. 💻 demos.2 - 声明的同时完成初始化赋值](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#5--demos2---声明的同时完成初始化赋值)
  - [6. 💻 demos.3 - 引用类型，确保地址不变](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#6--demos3---引用类型确保地址不变)
  - [7. 💻 demos.4 - 对象冻结](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#7--demos4---对象冻结)
  - [8. 💼 面试题.1 - 请谈谈 var、let、const](https://tdahuyou.github.io/notes/notes/html-css-js/0004.%20const%20%E5%85%B3%E9%94%AE%E5%AD%97/README.html#8--面试题1---请谈谈-varletconst)
  - 知识点：
    - const 关键字
    - const 的 “常量约束” 的本质
    - 栈内存、堆内存
    - const 和 let 之间的区别
    - 对象冻结 `Object.freeze`
    - 对象深度冻结（递归）
  - const 和 let 非常类似，区别在于 let 定义的是变量，const 定义的是常量。定义变量时首选 const 关键字，其次 let 关键字，放弃 var 关键字。
  

## 2. 作用域

- [x] [0005. 区块和块级作用域](https://tdahuyou.github.io/notes/notes/html-css-js/0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F/README.html) <!-- [locale](./0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F/README.html) -->  
  - [1. 📒 区块和块级作用域](https://tdahuyou.github.io/notes/notes/html-css-js/0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F/README.html#1--区块和块级作用域)
  - [2. 💻 demos.1 - 块级作用域](https://tdahuyou.github.io/notes/notes/html-css-js/0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F/README.html#2--demos1---块级作用域)
  - [3. 💻 demos.2 - if 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F/README.html#3--demos2---if-结构)
  - [4. 💻 demos.3 - 使用区块来隔离上下文](https://tdahuyou.github.io/notes/notes/html-css-js/0005.%20%E5%8C%BA%E5%9D%97%E5%92%8C%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F/README.html#4--demos3---使用区块来隔离上下文)
  - 知识点：
    - 区块是什么
    - 区块的创建
    - 区块的作用
    - 块级作用域
    - 学会使用区块来隔离上下文
  - 区块“block”可以简单地理解为一对大括号 `{}`。var 没有块级作用域，let、const 有块级作用域。
  

## 3. js 执行环境

- [x] [0006. 常见的两个 JS 运行环境：浏览器、NodeJS](https://tdahuyou.github.io/notes/notes/html-css-js/0006.%20%E5%B8%B8%E8%A7%81%E7%9A%84%E4%B8%A4%E4%B8%AA%20JS%20%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83%EF%BC%9A%E6%B5%8F%E8%A7%88%E5%99%A8%E3%80%81NodeJS/README.html) <!-- [locale](./0006.%20%E5%B8%B8%E8%A7%81%E7%9A%84%E4%B8%A4%E4%B8%AA%20JS%20%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83%EF%BC%9A%E6%B5%8F%E8%A7%88%E5%99%A8%E3%80%81NodeJS/README.html) -->  
  - [1. 💻 demos.1 - 用浏览器来执行 JS 程序的基本流程](https://tdahuyou.github.io/notes/notes/html-css-js/0006.%20%E5%B8%B8%E8%A7%81%E7%9A%84%E4%B8%A4%E4%B8%AA%20JS%20%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83%EF%BC%9A%E6%B5%8F%E8%A7%88%E5%99%A8%E3%80%81NodeJS/README.html#1--demos1---用浏览器来执行-js-程序的基本流程)
  - 知识点：
    - 学会使用浏览器环境运行 JS
    - 学会使用 NodeJS 环境运行 JS
  - 在开始学习 JS 的内容之前，首先需要知道如何运行 JS 代码。这篇笔记介绍如何使用浏览器跑 JS 程序。
  - 在 nodejs 的学习笔记中，会介绍如何使用 nodejs 来执行 JS 程序（其实非常简单，安装好 nodejs，然后使用 node 命令 👉 `node xxx.js` 就可以执行 `xxx.js` 了。）
  

## 4. 语句和表达式

- [x] [0007. 语句和表达式](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html) <!-- [locale](./0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html) -->  
  - [1. 📒 表达式（Expression）和语句（Statement）](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html#1--表达式expression和语句statement)
  - [2. 💻 demos.1 - 理解语句](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html#2--demos1---理解语句)
  - [3. 💻 demos.2 - 理解表达式](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html#3--demos2---理解表达式)
  - [4. ✍️ 练习题](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html#4-️-练习题)
  - [5. 🤔 问：写在前面的语句一定先于后面的语句执行吗？](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html#5--问写在前面的语句一定先于后面的语句执行吗)
  - [6. 🤔 问：如何区分表达式和语句？](https://tdahuyou.github.io/notes/notes/html-css-js/0007.%20%E8%AF%AD%E5%8F%A5%E5%92%8C%E8%A1%A8%E8%BE%BE%E5%BC%8F/README.html#6--问如何区分表达式和语句)
  - 知识点：
    - 语句
    - 表达式
    - 问：如何区分表达式和语句？
  - 这篇笔记介绍了什么是语句，什么是表达式。其实语句和表达式是非常类似的，从概念上不容易区分。并且从定义来看，它们之间的关系还不是互斥的，而是相交的关系。也就是说有以下可能：
    - `xxx` 是语句，不是表达式
    - `xxx` 是表达式，不是语句
    - `xxx` 可能同时是语句和表达式
  - **很多时候我们并没有必要严格区分开我们所写某一代码片段到底是“表达式”还是“语句”，更重要的是能够理解这玩意儿能否“产生”一个值。**
  

## 5. 符号

- [x] [0078. JS 中的符号](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html) <!-- [locale](./0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html) -->  
  - [1. 📒 关键字和保留字](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#1--关键字和保留字)
  - [2. 📒 标识符](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#2--标识符)
  - [3. 📒 操作符](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#3--操作符)
  - [4. 📒 分隔符](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#4--分隔符)
  - [5. 📒 转义符](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#5--转义符)
  - [6. 📒 字面量](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#6--字面量)
  - [7. 📒 注释](https://tdahuyou.github.io/notes/notes/html-css-js/0078.%20JS%20%E4%B8%AD%E7%9A%84%E7%AC%A6%E5%8F%B7/README.html#7--注释)
  - 知识点：
    - 了解 JS 中都有哪些符号
  - JS 中的符号有很多种类型，这篇笔记对 JS 中的符号做了汇总和归类。
  - 快速过一遍即可，了解在 JS 中都有哪些类型的符号。其中有一些符号我们已经学过，其他符号在接下来的学习过程中都会介绍到，到时候再掌握即可。
  

- [x] [0013. 转义符](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html) <!-- [locale](./0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html) -->  
  - [1. 📒 转义符的含义和作用](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html#1--转义符的含义和作用)
  - [2. 🔗 wiki 对转义符的介绍](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html#2--wiki-对转义符的介绍)
  - [3. 🤔 问：`escape character` 是什么意思？](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html#3--问escape-character-是什么意思)
  - [4. 💻 练习题.1 - 按照指定格式打印系统时间](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html#4--练习题1---按照指定格式打印系统时间)
  - [5. 🤔 问：在 js 的字符串中，\ 反斜杠表示转义，如何不转义，输入反斜杠呢？](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html#5--问在-js-的字符串中-反斜杠表示转义如何不转义输入反斜杠呢)
  - [6. 🤔 问：转义符 `\r\n` 诞生的背景](https://tdahuyou.github.io/notes/notes/html-css-js/0013.%20%E8%BD%AC%E4%B9%89%E7%AC%A6/README.html#6--问转义符-rn-诞生的背景)
  - 知识点：
    - 转义符是什么
    - 转义符有什么用
  - 当你在程序中需要输出一些特殊字符的时候，能够想要“转义符”这个知识点即可。
  

- [x] [0014. 标识符](https://tdahuyou.github.io/notes/notes/html-css-js/0014.%20%E6%A0%87%E8%AF%86%E7%AC%A6/README.html) <!-- [locale](./0014.%20%E6%A0%87%E8%AF%86%E7%AC%A6/README.html) -->  
  
  - [1. 📒 标识符](https://tdahuyou.github.io/notes/notes/html-css-js/0014.%20%E6%A0%87%E8%AF%86%E7%AC%A6/README.html#1--标识符)
  - [2. 💼 面试题.1 - 以下哪些标识符是合法的？](https://tdahuyou.github.io/notes/notes/html-css-js/0014.%20%E6%A0%87%E8%AF%86%E7%AC%A6/README.html#2--面试题1---以下哪些标识符是合法的)
  - 知识点：
    - 标识符是什么
    - 标识符的命名规范
  - 标识符其实就是一个名字。程序中需要你指定名字的地方有很多，比如：变量名、函数名、参数名。需要掌握标识符的命名规则，可以拿笔记中的面试题练练手。
  

## 6. 流程控制语句

- [x] [0008. 条件语句 - if 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0008.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if%20%E7%BB%93%E6%9E%84/README.html) <!-- [locale](./0008.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if%20%E7%BB%93%E6%9E%84/README.html) -->  
  
  - [1. 📒 条件语句 - if 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0008.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if%20%E7%BB%93%E6%9E%84/README.html#1--条件语句---if-结构)
  - [2. 💻 demos.1 - if 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0008.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if%20%E7%BB%93%E6%9E%84/README.html#2--demos1---if-结构)
  - [3. 💻 demos.2 - if 加大括号](https://tdahuyou.github.io/notes/notes/html-css-js/0008.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if%20%E7%BB%93%E6%9E%84/README.html#3--demos2---if-加大括号)
  - [4. 💻 demos.3 - 区分赋值和比较](https://tdahuyou.github.io/notes/notes/html-css-js/0008.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if%20%E7%BB%93%E6%9E%84/README.html#4--demos3---区分赋值和比较)
  - 知识点：掌握 if 语句的使用。
  - 笔记中除了介绍 if 语句的基本用法之外，还涉及到了一些和布尔运算、类型转换相关的知识点，这些也非常重要，详情会在其他笔记中介绍。
  

- [x] [0009. 条件语句 - if...else 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84/README.html) <!-- [locale](./0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84/README.html) -->  
  - [1. 📒 if...else 基本结构](https://tdahuyou.github.io/notes/notes/html-css-js/0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84/README.html#1--ifelse-基本结构)
  - [2. 💻 demos.2 - 认识基本的 if...else 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84/README.html#2--demos2---认识基本的-ifelse-结构)
  - [3. 💻 demos.3 - 多个 if...else 的情况](https://tdahuyou.github.io/notes/notes/html-css-js/0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84/README.html#3--demos3---多个-ifelse-的情况)
  - [4. 💻 demos.1 - else 和最近的 if 配对](https://tdahuyou.github.io/notes/notes/html-css-js/0009.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20if...else%20%E7%BB%93%E6%9E%84/README.html#4--demos1---else-和最近的-if-配对)
  - 知识点：
    - 掌握 if...else 基本结构
    - 直到 if else 的配对规则
  

- [x] [0010. 条件语句 - switch 结构](https://tdahuyou.github.io/notes/notes/html-css-js/0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84/README.html) <!-- [locale](./0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84/README.html) -->  
  - [1. 📒 switch 基本结构](https://tdahuyou.github.io/notes/notes/html-css-js/0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84/README.html#1--switch-基本结构)
  - [2. 💻 demos.1 - switch 中的 break 语句](https://tdahuyou.github.io/notes/notes/html-css-js/0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84/README.html#2--demos1---switch-中的-break-语句)
  - [3. 💻 demos.2 - 使用表达式](https://tdahuyou.github.io/notes/notes/html-css-js/0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84/README.html#3--demos2---使用表达式)
  - [4. 💻 demos.3 - 匹配规则是严格相等](https://tdahuyou.github.io/notes/notes/html-css-js/0010.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20switch%20%E7%BB%93%E6%9E%84/README.html#4--demos3---匹配规则是严格相等)
  - 知识点：
    - switch 结构
    - break 语句
    - 匹配校验 - 严格相等 `===`
  - JavaScript 提供 `if` 结构和 `switch` 结构，完成条件判断，即只有满足预设的条件，才会执行相应的语句。但是，相对于 `if` 语句而言，`switch` 语句是很罕见的（甚至有的公司禁止使用，可能是考虑到条件语句咋用 `if` 就完全足够了，没必要再来一个 `switch`）。
  

- [x] [0011. 条件语句 - 三元运算符](https://tdahuyou.github.io/notes/notes/html-css-js/0011.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E4%B8%89%E5%85%83%E8%BF%90%E7%AE%97%E7%AC%A6/README.html) <!-- [locale](./0011.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E4%B8%89%E5%85%83%E8%BF%90%E7%AE%97%E7%AC%A6/README.html) -->  
  
  - [1. 📒 三元运算符 `? :` 的基本语法](https://tdahuyou.github.io/notes/notes/html-css-js/0011.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E4%B8%89%E5%85%83%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#1--三元运算符---的基本语法)
  - [2. 💻 demos.1 - 判偶数](https://tdahuyou.github.io/notes/notes/html-css-js/0011.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E4%B8%89%E5%85%83%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#2--demos1---判偶数)
  - 知识点：
    - 掌握三元运算符 `?:` 的基本语法
  

- [x] [0012. 条件语句 - 练习](https://tdahuyou.github.io/notes/notes/html-css-js/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html) <!-- [locale](./0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html) -->  
  - [1. 💻 练习.1 - 判断数字是否是三位数，是否能被 13 整除](https://tdahuyou.github.io/notes/notes/html-css-js/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#1--练习1---判断数字是否是三位数是否能被-13-整除)
  - [2. 💻 练习.2 - 判断学生成绩的等级](https://tdahuyou.github.io/notes/notes/html-css-js/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#2--练习2---判断学生成绩的等级)
  - [3. 💻 练习.3 - 判断健康状况](https://tdahuyou.github.io/notes/notes/html-css-js/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#3--练习3---判断健康状况)
  - [4. 💻 练习.4 - 计算理财收益](https://tdahuyou.github.io/notes/notes/html-css-js/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#4--练习4---计算理财收益)
  - [5. 💻 练习.5 - 猜拳游戏](https://tdahuyou.github.io/notes/notes/html-css-js/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#5--练习5---猜拳游戏)
  - 完成笔记中记录的相关练习
  

- [x] [0015. 循环语句 - for 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html) <!-- [locale](./0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html) -->  
  
  - [1. 📒 for 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html#1--for-循环)
  - [2. 💻 demos.1 - for 循环的基本使用](https://tdahuyou.github.io/notes/notes/html-css-js/0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html#2--demos1---for-循环的基本使用)
  - [3. 💻 demos.2 - 使用 while 循环来替代 for 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html#3--demos2---使用-while-循环来替代-for-循环)
  - [4. 💻 demos.3 - 死循环](https://tdahuyou.github.io/notes/notes/html-css-js/0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html#4--demos3---死循环)
  - [5. 🤔 问：应该使用 `for` 循环还是 `while` 循环？](https://tdahuyou.github.io/notes/notes/html-css-js/0015.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20for%20%E5%BE%AA%E7%8E%AF/README.html#5--问应该使用-for-循环还是-while-循环)
  - 知识点：
    - for 循环的基本结构
    - 死循环
    - 对比 for 循环和 while 循环
  

- [x] [0016. 循环语句 - while 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0016.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20while%20%E5%BE%AA%E7%8E%AF/README.html) <!-- [locale](./0016.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20while%20%E5%BE%AA%E7%8E%AF/README.html) -->  
  
  - [1. 📒 while 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0016.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20while%20%E5%BE%AA%E7%8E%AF/README.html#1--while-循环)
  - [2. 💻 demos.1 - while 循环的基本使用](https://tdahuyou.github.io/notes/notes/html-css-js/0016.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20while%20%E5%BE%AA%E7%8E%AF/README.html#2--demos1---while-循环的基本使用)
  - [3. 💻 demos.2 -  使用 break 跳出循环体](https://tdahuyou.github.io/notes/notes/html-css-js/0016.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20while%20%E5%BE%AA%E7%8E%AF/README.html#3--demos2----使用-break-跳出循环体)
  - [4. 💻 demos.3 - 死循环](https://tdahuyou.github.io/notes/notes/html-css-js/0016.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20while%20%E5%BE%AA%E7%8E%AF/README.html#4--demos3---死循环)
  - 知识点：
    - while 循环的基本结构
  

- [x] [0017. 循环语句 - do...while 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0017.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20do...while%20%E5%BE%AA%E7%8E%AF/README.html) <!-- [locale](./0017.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20do...while%20%E5%BE%AA%E7%8E%AF/README.html) -->  
  
  - [1. 📒 do...while 循环](https://tdahuyou.github.io/notes/notes/html-css-js/0017.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20do...while%20%E5%BE%AA%E7%8E%AF/README.html#1--dowhile-循环)
  - [2. 💻 demos.1 - 理解 do...while 循环的执行流程](https://tdahuyou.github.io/notes/notes/html-css-js/0017.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20do...while%20%E5%BE%AA%E7%8E%AF/README.html#2--demos1---理解-dowhile-循环的执行流程)
  - [3. 💻 demos.2 - 对比 do...while 和 while 之间的差异](https://tdahuyou.github.io/notes/notes/html-css-js/0017.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20do...while%20%E5%BE%AA%E7%8E%AF/README.html#3--demos2---对比-dowhile-和-while-之间的差异)
  - 知识点：
    - 掌握 do...while 循环的基本语法
  - do...while 循环不常用，快速过有个印象即可。
  

- [x] [0018. 循环语句 - break 语句和 continue 语句](https://tdahuyou.github.io/notes/notes/html-css-js/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html) <!-- [locale](./0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html) -->  
  
  - [1. 📒 break 语句和 continue 语句](https://tdahuyou.github.io/notes/notes/html-css-js/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html#1--break-语句和-continue-语句)
  - [2. 💻 demos.1 - 在 while 中使用 break](https://tdahuyou.github.io/notes/notes/html-css-js/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html#2--demos1---在-while-中使用-break)
  - [3. 💻 demos.2 - 在 for 中使用 break](https://tdahuyou.github.io/notes/notes/html-css-js/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html#3--demos2---在-for-中使用-break)
  - [4. 💻 demos.3 - 在循环中使用 continue](https://tdahuyou.github.io/notes/notes/html-css-js/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html#4--demos3---在循环中使用-continue)
  - [5. 💻 demos.4 - 多重循环 - break、continue 语句针对当前所在的循环体而言](https://tdahuyou.github.io/notes/notes/html-css-js/0018.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20break%20%E8%AF%AD%E5%8F%A5%E5%92%8C%20continue%20%E8%AF%AD%E5%8F%A5/README.html#5--demos4---多重循环---breakcontinue-语句针对当前所在的循环体而言)
  - 知识点：
    - break 语句
    - continue 语句
  

- [x] [0019. 循环语句 - 标签（label）](https://tdahuyou.github.io/notes/notes/html-css-js/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html) <!-- [locale](./0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html) -->  
  - [1. 📒 标签](https://tdahuyou.github.io/notes/notes/html-css-js/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html#1--标签)
  - [2. 💻 demos.1 - break、continue 加标签](https://tdahuyou.github.io/notes/notes/html-css-js/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html#2--demos1---breakcontinue-加标签)
  - [3. 💻 demos.2 - 跳出区块](https://tdahuyou.github.io/notes/notes/html-css-js/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html#3--demos2---跳出区块)
  - [4. 💻 demos.3 - 不能跨区块跳](https://tdahuyou.github.io/notes/notes/html-css-js/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html#4--demos3---不能跨区块跳)
  - [5. 🤔 问：如何看待“标签”？](https://tdahuyou.github.io/notes/notes/html-css-js/0019.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E6%A0%87%E7%AD%BE%EF%BC%88label%EF%BC%89/README.html#5--问如何看待标签)
  - “标签” 在开发时几乎不会用到它，这个知识点不算重要，快速过一遍笔记，简单了解一下它的作用即可。
  

- [x] [0020. 循环语句 - 练习](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html) <!-- [locale](./0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html) -->  
  
  - [1. 💻 练习.1 - 在控制台中输出 100 个 `*`](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#1--练习1---在控制台中输出-100-个-)
  - [2. 💻 练习.2 - 输出 1-100 的所有数字](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#2--练习2---输出-1-100-的所有数字)
  - [3. 💻 练习.3 - 输出 1-100 的所有奇数](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#3--练习3---输出-1-100-的所有奇数)
  - [4. 💻 练习.4 - 求 1-100 之间所有数字之和](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#4--练习4---求-1-100-之间所有数字之和)
  - [5. 💻 练习.5 - 求 1-100 之间所有奇数之和](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#5--练习5---求-1-100-之间所有奇数之和)
  - [6. 💻 练习.6 - 求 1-10 之间所有数字的积](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#6--练习6---求-1-10-之间所有数字的积)
  - [7. 💻 练习.7 - 输出一个 3 行 5 列的 `*` 号矩阵](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#7--练习7---输出一个-3-行-5-列的--号矩阵)
  - [8. 💻 练习.8 - 用 `*` 号输出一个 5 行的直角三角形](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#8--练习8---用--号输出一个-5-行的直角三角形)
  - [9. 💻 练习.9 - 用 `*` 号输出一个 5 行的等腰三角形](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#9--练习9---用--号输出一个-5-行的等腰三角形)
  - [10. 💻 练习.10 - 判断数字 233 是不是素数](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#10--练习10---判断数字-233-是不是素数)
  - [11. 💻 练习.11 - 判断 1-100 哪些数是素数](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#11--练习11---判断-1-100-哪些数是素数)
  - [12. 💻 练习.12 - 求 1-100 之间的所有素数之和](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#12--练习12---求-1-100-之间的所有素数之和)
  - [13. 💻 练习.13 - 输出 99 乘法表](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#13--练习13---输出-99-乘法表)
  - [14. 💻 练习.14 - 猜拳游戏](https://tdahuyou.github.io/notes/notes/html-css-js/0020.%20%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0/README.html#14--练习14---猜拳游戏)
  - 完成笔记中记录的相关练习题。
  

- [x] [0021. 注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html) <!-- [locale](./0021.%20%E6%B3%A8%E9%87%8A/README.html) -->  
  - [1. 🔗 JSDoc 官网](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#1--jsdoc-官网)
  - [2. 📒 注释是什么](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#2--注释是什么)
  - [3. 📒 注释的分类](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#3--注释的分类)
  - [4. 📒 文档注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#4--文档注释)
  - [5. 📒 区域注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#5--区域注释)
  - [6. 💻 demos.1 - 单行注释和多行注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#6--demos1---单行注释和多行注释)
  - [7. 💻 demos.2 - 特殊的单行注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#7--demos2---特殊的单行注释)
  - [8. 💻 demos.3 - 文档注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#8--demos3---文档注释)
  - [9. 💻 demos.4 - 区域注释](https://tdahuyou.github.io/notes/notes/html-css-js/0021.%20%E6%B3%A8%E9%87%8A/README.html#9--demos4---区域注释)
  - 知识点：
    - 单行注释
    - 多行注释
    - 文档注释
    - 区域注释
  

- [x] [0022. 字面量](https://tdahuyou.github.io/notes/notes/html-css-js/0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F/README.html) <!-- [locale](./0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F/README.html) -->  
  
  - [1. 🔗 MDN 对 字面量（Literal）的描述](https://tdahuyou.github.io/notes/notes/html-css-js/0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F/README.html#1--mdn-对-字面量literal的描述)
  - [2. 📒 字面量](https://tdahuyou.github.io/notes/notes/html-css-js/0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F/README.html#2--字面量)
  - [3. 💻 demos.1 - 不同类型的字面量](https://tdahuyou.github.io/notes/notes/html-css-js/0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F/README.html#3--demos1---不同类型的字面量)
  - 知识点：
    - 理解字面量是什么
  - 字面量就是直接写在代码中的值。
  

## 7. 数据类型

- [ ] [0023. boolean 类型](https://tdahuyou.github.io/notes/notes/html-css-js/0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html) <!-- [locale](./0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0023.%20boolean%20%E7%B1%BB%E5%9E%8B/README.html#5--ai)
  

- [ ] [0024. 与数值相关的全局方法](https://tdahuyou.github.io/notes/notes/html-css-js/0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html) <!-- [locale](./0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0024.%20%E4%B8%8E%E6%95%B0%E5%80%BC%E7%9B%B8%E5%85%B3%E7%9A%84%E5%85%A8%E5%B1%80%E6%96%B9%E6%B3%95/README.html#5--ai)
  

- [ ] [0025. 数值类型【扩展】](https://tdahuyou.github.io/notes/notes/html-css-js/0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) <!-- [locale](./0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0025.%20%E6%95%B0%E5%80%BC%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#5--ai)
  

- [ ] [0026. 字符串定义](https://tdahuyou.github.io/notes/notes/html-css-js/0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html) <!-- [locale](./0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0026.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%9A%E4%B9%89/README.html#5--ai)
  

- [ ] [0027. 模板字符串](https://tdahuyou.github.io/notes/notes/html-css-js/0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html) <!-- [locale](./0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0027.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2/README.html#5--ai)
  

- [ ] [0028. 字符串与数组](https://tdahuyou.github.io/notes/notes/html-css-js/0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html) <!-- [locale](./0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0028.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%95%B0%E7%BB%84/README.html#5--ai)
  

- [ ] [0029. 字符串类型【扩展】](https://tdahuyou.github.io/notes/notes/html-css-js/0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) <!-- [locale](./0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0029.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#5--ai)
  

- [ ] [0030. null 和 undefined 类型](https://tdahuyou.github.io/notes/notes/html-css-js/0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html) <!-- [locale](./0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0030.%20null%20%E5%92%8C%20undefined%20%E7%B1%BB%E5%9E%8B/README.html#5--ai)
  

- [ ] [0031. 数组的本质](https://tdahuyou.github.io/notes/notes/html-css-js/0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html) <!-- [locale](./0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0031.%20%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%AC%E8%B4%A8/README.html#5--ai)
  

- [ ] [0032. 数组的索引和 length 属性](https://tdahuyou.github.io/notes/notes/html-css-js/0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0032.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B4%A2%E5%BC%95%E5%92%8C%20length%20%E5%B1%9E%E6%80%A7/README.html#5--ai)
  

- [ ] [0033. 数组空位](https://tdahuyou.github.io/notes/notes/html-css-js/0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html) <!-- [locale](./0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0033.%20%E6%95%B0%E7%BB%84%E7%A9%BA%E4%BD%8D/README.html#5--ai)
  

- [ ] [0034. 伪数组](https://tdahuyou.github.io/notes/notes/html-css-js/0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html) <!-- [locale](./0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0034.%20%E4%BC%AA%E6%95%B0%E7%BB%84/README.html#5--ai)
  

- [ ] [0035. 使用 in 运算符判断属性是否存在于数组中](https://tdahuyou.github.io/notes/notes/html-css-js/0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html) <!-- [locale](./0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0035.%20%E4%BD%BF%E7%94%A8%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E4%B8%AD/README.html#5--ai)
  

- [ ] [0036. 使用 for...in 循环遍历数组](https://tdahuyou.github.io/notes/notes/html-css-js/0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html) <!-- [locale](./0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0036.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84/README.html#5--ai)
  

- [x] [0037. 防抖、节流](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html) <!-- [locale](./0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html) -->  
  
  - [1. 🔗 leetcode 相关例题](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html#1--leetcode-相关例题)
  - [2. 📒 防抖](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html#2--防抖)
  - [3. 📒 节流](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html#3--节流)
  - [4. 📒 防抖 vs. 节流](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html#4--防抖-vs-节流)
  - [5. 💻 demos.1 - 防抖](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html#5--demos1---防抖)
  - [6. 💻 demos.2 - 节流](https://tdahuyou.github.io/notes/notes/html-css-js/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/README.html#6--demos2---节流)
  - 知识点：
    - 理解防抖
    - 理解节流
    - 完成 leetcode 算法题
  - 防抖（debouncing）和节流（throttling）都是用来控制函数调用频率的技术解决方案。
    - ![](https://raw.githubusercontent.com/Tdahuyou/html-css-js/main/0037.%20%E9%98%B2%E6%8A%96%E3%80%81%E8%8A%82%E6%B5%81/assets%2F2024-12-31-17-34-54.png)
  

- [ ] [0038. 数组类型【扩展】](https://tdahuyou.github.io/notes/notes/html-css-js/0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) <!-- [locale](./0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0038.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#5--ai)
  

- [ ] [0039. 数组【练习-1】](https://tdahuyou.github.io/notes/notes/html-css-js/0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html) <!-- [locale](./0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0039.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-1%E3%80%91/README.html#5--ai)
  

- [ ] [0040. 数组【练习-2】](https://tdahuyou.github.io/notes/notes/html-css-js/0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html) <!-- [locale](./0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0040.%20%E6%95%B0%E7%BB%84%E3%80%90%E7%BB%83%E4%B9%A0-2%E3%80%91/README.html#5--ai)
  

- [ ] [0041. 对象属性读、写、删](https://tdahuyou.github.io/notes/notes/html-css-js/0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html) <!-- [locale](./0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0041.%20%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AF%BB%E3%80%81%E5%86%99%E3%80%81%E5%88%A0/README.html#5--ai)
  

- [ ] [0042. 对象的字符串键名的多种写法](https://tdahuyou.github.io/notes/notes/html-css-js/0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html) <!-- [locale](./0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0042.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%AE%E5%90%8D%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%86%99%E6%B3%95/README.html#5--ai)
  

- [ ] [0043. 判断某个属性是否存在于对象中](https://tdahuyou.github.io/notes/notes/html-css-js/0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html) <!-- [locale](./0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0043.%20%E5%88%A4%E6%96%AD%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E4%B8%AD/README.html#5--ai)
  

- [ ] [0044. 使用 for...in 循环遍历对象属性](https://tdahuyou.github.io/notes/notes/html-css-js/0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0044.%20%E4%BD%BF%E7%94%A8%20for...in%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7/README.html#5--ai)
  

- [ ] [0045. 对象的引用](https://tdahuyou.github.io/notes/notes/html-css-js/0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html) <!-- [locale](./0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0045.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%BC%95%E7%94%A8/README.html#5--ai)
  

- [ ] [0046. 对象类型【练习】](https://tdahuyou.github.io/notes/notes/html-css-js/0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html) <!-- [locale](./0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0046.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91/README.html#5--ai)
  

- [ ] [0047. 引用类型【面试题】](https://tdahuyou.github.io/notes/notes/html-css-js/0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html) <!-- [locale](./0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0047.%20%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#5--ai)
  

- [ ] [0048. 使用 instanceof 判断值的数据类型](https://tdahuyou.github.io/notes/notes/html-css-js/0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html) <!-- [locale](./0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0048.%20%E4%BD%BF%E7%94%A8%20instanceof%20%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#5--ai)
  

- [ ] [0049. 使用 typeof 运算符判断值的数据类型](https://tdahuyou.github.io/notes/notes/html-css-js/0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html) <!-- [locale](./0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0049.%20%E4%BD%BF%E7%94%A8%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6%E5%88%A4%E6%96%AD%E5%80%BC%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/README.html#5--ai)
  

- [ ] [0050. 原型链](https://tdahuyou.github.io/notes/notes/html-css-js/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html) <!-- [locale](./0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE/README.html#5--ai)
  

- [ ] [0051. 加法运算符](https://tdahuyou.github.io/notes/notes/html-css-js/0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html) <!-- [locale](./0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0051.%20%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.html#5--ai)
  

- [ ] [0052. 对象类型的加法运算【扩展】](https://tdahuyou.github.io/notes/notes/html-css-js/0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) <!-- [locale](./0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0052.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8A%A0%E6%B3%95%E8%BF%90%E7%AE%97%E3%80%90%E6%89%A9%E5%B1%95%E3%80%91/README.html#5--ai)
  

- [ ] [0053. 作用域【面试题】](https://tdahuyou.github.io/notes/notes/html-css-js/0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html) <!-- [locale](./0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0053.%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E3%80%90%E9%9D%A2%E8%AF%95%E9%A2%98%E3%80%91/README.html#5--ai)
  

- [ ] [0054. 使用 customElements 创建一个 myButton 自定义元素](https://tdahuyou.github.io/notes/notes/html-css-js/0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html) <!-- [locale](./0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0054.%20%E4%BD%BF%E7%94%A8%20customElements%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20myButton%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0/README.html#5--ai)
  

- [ ] [0055. 使用 MessageChannel 实现不同模块之间的相互通信](https://tdahuyou.github.io/notes/notes/html-css-js/0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html) <!-- [locale](./0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0055.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%8D%E5%90%8C%E6%A8%A1%E5%9D%97%E4%B9%8B%E9%97%B4%E7%9A%84%E7%9B%B8%E4%BA%92%E9%80%9A%E4%BF%A1/README.html#5--ai)
  

- [ ] [0056. 在 Worker 中使用 MessageChannel](https://tdahuyou.github.io/notes/notes/html-css-js/0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html) <!-- [locale](./0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0056.%20%E5%9C%A8%20Worker%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20MessageChannel/README.html#5--ai)
  

- [ ] [0057. 使用 MessageChannel 实现父子窗口之间的互相通信](https://tdahuyou.github.io/notes/notes/html-css-js/0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html) <!-- [locale](./0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0057.%20%E4%BD%BF%E7%94%A8%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E7%88%B6%E5%AD%90%E7%AA%97%E5%8F%A3%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.html#5--ai)
  

- [ ] [0058. new 命令](https://tdahuyou.github.io/notes/notes/html-css-js/0058.%20new%20%E5%91%BD%E4%BB%A4/README.html) <!-- [locale](./0058.%20new%20%E5%91%BD%E4%BB%A4/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0058.%20new%20%E5%91%BD%E4%BB%A4/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0058.%20new%20%E5%91%BD%E4%BB%A4/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0058.%20new%20%E5%91%BD%E4%BB%A4/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0058.%20new%20%E5%91%BD%E4%BB%A4/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0058.%20new%20%E5%91%BD%E4%BB%A4/README.html#5--ai)
  

- [ ] [0059. 使用 Object.create() 创建实例对象](https://tdahuyou.github.io/notes/notes/html-css-js/0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html) <!-- [locale](./0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0059.%20%E4%BD%BF%E7%94%A8%20Object.create()%20%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1/README.html#5--ai)
  

- [ ] [0060. 构造函数](https://tdahuyou.github.io/notes/notes/html-css-js/0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html) <!-- [locale](./0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0060.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/README.html#5--ai)
  

## 8. 模块化

- [ ] [0061.doing. 前端模块化](https://tdahuyou.github.io/notes/notes/html-css-js/0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html) <!-- [locale](./0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0061.doing.%20%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96/README.html#5--ai)
  

- [ ] [0062.doing. 前端设计模式](https://tdahuyou.github.io/notes/notes/html-css-js/0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html) <!-- [locale](./0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0062.doing.%20%E5%89%8D%E7%AB%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.html#5--ai)
  

- [ ] [0063. ESM 模块的基本导出、导入](https://tdahuyou.github.io/notes/notes/html-css-js/0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html) <!-- [locale](./0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0063.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AF%BC%E5%87%BA%E3%80%81%E5%AF%BC%E5%85%A5/README.html#5--ai)
  

- [ ] [0064. ESM 模块的默认导入、导出](https://tdahuyou.github.io/notes/notes/html-css-js/0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html) <!-- [locale](./0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0064.%20ESM%20%E6%A8%A1%E5%9D%97%E7%9A%84%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%85%A5%E3%80%81%E5%AF%BC%E5%87%BA/README.html#5--ai)
  

- [ ] [0065. ESM 依赖预加载和依赖延迟加载](https://tdahuyou.github.io/notes/notes/html-css-js/0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html) <!-- [locale](./0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0065.%20ESM%20%E4%BE%9D%E8%B5%96%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%92%8C%E4%BE%9D%E8%B5%96%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/README.html#5--ai)
  

- [ ] [0066. ESM - 练习 - 推箱子小游戏](https://tdahuyou.github.io/notes/notes/html-css-js/0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html) <!-- [locale](./0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0066.%20ESM%20-%20%E7%BB%83%E4%B9%A0%20-%20%E6%8E%A8%E7%AE%B1%E5%AD%90%E5%B0%8F%E6%B8%B8%E6%88%8F/README.html#5--ai)
  

- [ ] [0067. CMD](https://tdahuyou.github.io/notes/notes/html-css-js/0067.%20CMD/README.html) <!-- [locale](./0067.%20CMD/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0067.%20CMD/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0067.%20CMD/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0067.%20CMD/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0067.%20CMD/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0067.%20CMD/README.html#5--ai)
  

- [ ] [0068. AMD](https://tdahuyou.github.io/notes/notes/html-css-js/0068.%20AMD/README.html) <!-- [locale](./0068.%20AMD/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0068.%20AMD/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0068.%20AMD/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0068.%20AMD/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0068.%20AMD/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0068.%20AMD/README.html#5--ai)
  

- [ ] [0069. JS 导入断言](https://tdahuyou.github.io/notes/notes/html-css-js/0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html) <!-- [locale](./0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0069.%20JS%20%E5%AF%BC%E5%85%A5%E6%96%AD%E8%A8%80/README.html#5--ai)
  

- [ ] [0070. CommonJS 规范](https://tdahuyou.github.io/notes/notes/html-css-js/0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html) <!-- [locale](./0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0070.%20CommonJS%20%E8%A7%84%E8%8C%83/README.html#5--ai)
  

- [ ] [0071. 认识 nodejs 是如何实现 CommonJS 规范的](https://tdahuyou.github.io/notes/notes/html-css-js/0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html) <!-- [locale](./0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0071.%20%E8%AE%A4%E8%AF%86%20nodejs%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%20CommonJS%20%E8%A7%84%E8%8C%83%E7%9A%84/README.html#5--ai)
  

- [ ] [0072. CommonJS 模块缓存](https://tdahuyou.github.io/notes/notes/html-css-js/0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html) <!-- [locale](./0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html) -->  
  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/html-css-js/0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html#2--links)
  - [3. 📒 notes](https://tdahuyou.github.io/notes/notes/html-css-js/0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html#3--notes)
  - [4. 💻 demo](https://tdahuyou.github.io/notes/notes/html-css-js/0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html#4--demo)
  - [5. 🤖 AI](https://tdahuyou.github.io/notes/notes/html-css-js/0072.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%BC%93%E5%AD%98/README.html#5--ai)
  

- [ ] [0073. CommonJS 练习 - 制作一个斗地主洗牌发牌的程序](https://tdahuyou.github.io/notes/notes/html-css-js/0073.%20CommonJS%20%E7%BB%83%E4%B9%A0%20-%20%E5%88%B6%E4%BD%9C%E4%B8%80%E4%B8%AA%E6%96%97%E5%9C%B0%E4%B8%BB%E6%B4%97%E7%89%8C%E5%8F%91%E7%89%8C%E7%9A%84%E7%A8%8B%E5%BA%8F/README.html) <!-- [locale](./0073.%20CommonJS%20%E7%BB%83%E4%B9%A0%20-%20%E5%88%B6%E4%BD%9C%E4%B8%80%E4%B8%AA%E6%96%97%E5%9C%B0%E4%B8%BB%E6%B4%97%E7%89%8C%E5%8F%91%E7%89%8C%E7%9A%84%E7%A8%8B%E5%BA%8F/README.html) -->  
  

- [ ] [0074. 订阅发布模式](https://tdahuyou.github.io/notes/notes/html-css-js/0074.%20%E8%AE%A2%E9%98%85%E5%8F%91%E5%B8%83%E6%A8%A1%E5%BC%8F/README.html) <!-- [locale](./0074.%20%E8%AE%A2%E9%98%85%E5%8F%91%E5%B8%83%E6%A8%A1%E5%BC%8F/README.html) -->  
  

- [ ] [0075. 观察者模式](https://tdahuyou.github.io/notes/notes/html-css-js/0075.%20%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F/README.html) <!-- [locale](./0075.%20%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F/README.html) -->  
  

- [ ] [0076. 使用 Array.form 来创建一个二维数组](https://tdahuyou.github.io/notes/notes/html-css-js/0076.%20%E4%BD%BF%E7%94%A8%20Array.form%20%E6%9D%A5%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E4%BA%8C%E7%BB%B4%E6%95%B0%E7%BB%84/README.html) <!-- [locale](./0076.%20%E4%BD%BF%E7%94%A8%20Array.form%20%E6%9D%A5%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E4%BA%8C%E7%BB%B4%E6%95%B0%E7%BB%84/README.html) -->  
  

- [ ] [0077. encodeURIcomponent](https://tdahuyou.github.io/notes/notes/html-css-js/0077.%20encodeURIcomponent/README.html) <!-- [locale](./0077.%20encodeURIcomponent/README.html) -->  
  

## 9. ⚙️ window 对象

- [x] [0079. window.onbeforeunload](https://tdahuyou.github.io/notes/notes/html-css-js/0079.%20window.onbeforeunload/README.html) <!-- [locale](./0079.%20window.onbeforeunload/README.html) -->  
  - [1. 🔗 mdn - window.onbeforeunload](https://tdahuyou.github.io/notes/notes/html-css-js/0079.%20window.onbeforeunload/README.html#1--mdn---windowonbeforeunload)
  - [2. 💻 demos.1 - window.onbeforeunload 基本使用](https://tdahuyou.github.io/notes/notes/html-css-js/0079.%20window.onbeforeunload/README.html#2--demos1---windowonbeforeunload-基本使用)
  - `window.onbeforeunload` 是一个事件处理器，它用于在窗口、页面或标签即将卸载时触发。
  - **当用户尝试关闭浏览器窗口、刷新页面、导航到另一个页面或者通过其他方式离开当前页面时**，这个事件会被触发。
  - 使用 `onbeforeunload` 事件可以显示一个确认对话框给用户，询问他们是否真的要离开页面。
  - **这在用户正在编辑表单或其他数据而尚未保存的情况下特别有用**，因为它提供了一种防止意外丢失工作的方式。
  - 滥用 `onbeforeunload` 可能会导致糟糕的用户体验，应谨慎使用，仅在必要时提醒用户。
  

- [x] [0080. window.confirm](https://tdahuyou.github.io/notes/notes/html-css-js/0080.%20window.confirm/README.html) <!-- [locale](./0080.%20window.confirm/README.html) -->  
  - [1. 🔗 mdn - window.confirm](https://tdahuyou.github.io/notes/notes/html-css-js/0080.%20window.confirm/README.html#1--mdn---windowconfirm)
  - [2. 💻 demos.1 - window.confirm()](https://tdahuyou.github.io/notes/notes/html-css-js/0080.%20window.confirm/README.html#2--demos1---windowconfirm)
  - 在 Web 开发中，如果开发者想要在特定条件下触发类似的对话框，可以使用 `window.confirm()` 方法。
  - 这个方法会显示一个带有“确定”和“取消”按钮的基本对话框，并返回一个布尔值，表示用户的选择是“确定”（true）还是“取消”（false）。
  

- [x] [0081. 使用 postMessage 实现跨标签页通信](https://tdahuyou.github.io/notes/notes/html-css-js/0081.%20%E4%BD%BF%E7%94%A8%20postMessage%20%E5%AE%9E%E7%8E%B0%E8%B7%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E9%80%9A%E4%BF%A1/README.html) <!-- [locale](./0081.%20%E4%BD%BF%E7%94%A8%20postMessage%20%E5%AE%9E%E7%8E%B0%E8%B7%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E9%80%9A%E4%BF%A1/README.html) -->  
  - [1. 💻 demos.1 - 使用 postMessage 实现跨标签页通信](https://tdahuyou.github.io/notes/notes/html-css-js/0081.%20%E4%BD%BF%E7%94%A8%20postMessage%20%E5%AE%9E%E7%8E%B0%E8%B7%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E9%80%9A%E4%BF%A1/README.html#1--demos1---使用-postmessage-实现跨标签页通信)
  - `postMessage` API 可用于实现不同窗口、标签页或 iframe 之间的安全通信。它允许你向另一个浏览上下文（如新打开的窗口、iframe 等）发送消息，并可以接收来自这些上下文的消息。
  

- [ ] [0108. DOMParser](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html) <!-- [locale](./0108.%20DOMParser/README.html) -->  
  - [1. 📒 DOMParser 概述](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#1--domparser-概述)
  - [2. 📒 解析 XML 字符串](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#2--解析-xml-字符串)
  - [3. 📒 代码解析](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#3--代码解析)
  - [4. 📒 解析 HTML](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#4--解析-html)
  - [5. 📒 处理 XML 解析错误](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#5--处理-xml-解析错误)
  - [6. 📒 `DOMParser` 在 Blockly 代码中的应用](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#6--domparser-在-blockly-代码中的应用)
  - [7. 📒 `DOMParser` vs. `document.createElement`](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#7--domparser-vs-documentcreateelement)
  - [8. 📒 `DOMParser` vs. `XSLTProcessor`](https://tdahuyou.github.io/notes/notes/html-css-js/0108.%20DOMParser/README.html#8--domparser-vs-xsltprocessor)
  

- [ ] [0109. XSLTProcessor](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html) <!-- [locale](./0109.%20XSLTProcessor/README.html) -->  
  - [1. 什么是 XSLTProcessor？](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#1-什么是-xsltprocessor)
  - [2. `XSLTProcessor` 的工作流程](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#2-xsltprocessor-的工作流程)
  - [3. `XSLTProcessor` 代码示例](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#3-xsltprocessor-代码示例)
    - [3.1. 示例：将 XML 转换为 HTML](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#31-示例将-xml-转换为-html)
    - [3.2. JavaScript 代码](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#32-javascript-代码)
    - [3.3. 转换后 HTML 结果](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#33-转换后-html-结果)
  - [4. `XSLTProcessor` 主要方法](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#4-xsltprocessor-主要方法)
    - [4.1. 示例：使用 transformToFragment](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#41-示例使用-transformtofragment)
  - [5. `XSLTProcessor` 在 Blockly 代码中的作用](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#5-xsltprocessor-在-blockly-代码中的作用)
    - [5.1. `XSLTProcessor` 的优缺点](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#51-xsltprocessor-的优缺点)
  - [6. ✅ 优点](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#6--优点)
  - [7. ❌ 缺点](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#7--缺点)
    - [7.1. 现代替代方案](https://tdahuyou.github.io/notes/notes/html-css-js/0109.%20XSLTProcessor/README.html#71-现代替代方案)
  

## 10. css 属性

- [ ] [0105. background](https://tdahuyou.github.io/notes/notes/html-css-js/0105.%20background/README.html) <!-- [locale](./0105.%20background/README.html) -->  
  - [1. ⏰ background-* 忘记哪个就找些 demo 来看看，并汇总到 demos.* 中。](https://tdahuyou.github.io/notes/notes/html-css-js/0105.%20background/README.html#1--background--忘记哪个就找些-demo-来看看并汇总到-demos-中)
  - [2. 💻 demos.1 - 使用 background-image 设置背景](https://tdahuyou.github.io/notes/notes/html-css-js/0105.%20background/README.html#2--demos1---使用-background-image-设置背景)
  - MDN background
    - https://developer.mozilla.org/zh-CN/docs/Web/CSS/background
      - 在侧边目录中查看 `background-*`
      - background
      - background-attachment
      - background-blend-mode
      - background-clip
      - background-color
      - background-image
      - background-origin
      - background-position
      - background-position-x
      - background-position-y
      - background-repeat
      - background-size
  

- [ ] [0106. clip-path](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html) <!-- [locale](./0106.%20clip-path/README.html) -->  
  - [1. 📒 clip-path 概述](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#1--clip-path-概述)
  - [2. 💻 demos.1 - 圆形裁剪](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#2--demos1---圆形裁剪)
  - [3. 💻 demos.3 - 椭圆形裁剪](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#3--demos3---椭圆形裁剪)
  - [4. 💻 demos.4 - 矩形裁剪](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#4--demos4---矩形裁剪)
  - [5. 💻 demos.2 - 多边形裁剪](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#5--demos2---多边形裁剪)
  - [6. 💻 demos.5 - 使用 svg 的裁剪路径来裁剪](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#6--demos5---使用-svg-的裁剪路径来裁剪)
  - [7. 💻 demos.6 - 使用 svg 的裁剪路径来裁剪 - vite、github](https://tdahuyou.github.io/notes/notes/html-css-js/0106.%20clip-path/README.html#7--demos6---使用-svg-的裁剪路径来裁剪---vitegithub)
  - clip-path 的写法非常灵活，笔记中的 demo 仅记录了其中一部分写法，更多写法可以参考 MDN。
  - 虽然路径的绘制方式有很多，但其实如果我们掌握好了 svg 的话，使用 svg 来绘制路径，想要啥效果就画啥效果，也就是说啥路径都可以自行指定。
  - https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
    - mdn - css clip-path 属性
  - https://caniuse.com/?search=clip-path
    - can i use clip-path
  

## 11. html 元素

- [ ] [0107. style 元素的 sheet 属性](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html) -->  
  - [1. 📒 `sheet` 属性概述](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#1--sheet-属性概述)
  - [2. 📒 获取 `<style>` 元素的 `sheet`](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#2--获取-style-元素的-sheet)
  - [3. 📒 动态添加 CSS 规则](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#3--动态添加-css-规则)
  - [4. 📒 移除 CSS 规则](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#4--移除-css-规则)
  - [5. 📒 `sheet` 对象的常见属性和方法](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#5--sheet-对象的常见属性和方法)
  - [6. 📒 获取所有 CSS 规则](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#6--获取所有-css-规则)
  - [7. 📒 禁用样式表](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#7--禁用样式表)
  - [8. 📒 `sheet` 适用于哪些情况？](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#8--sheet-适用于哪些情况)
  - [9. 📒 `sheet` 属性适用于 `<style>` 还是 `<link>`？](https://tdahuyou.github.io/notes/notes/html-css-js/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7/README.html#9--sheet-属性适用于-style-还是-link)
  

- [ ] [0110. script 元素的 crossorigin 属性](https://tdahuyou.github.io/notes/notes/html-css-js/0110.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20crossorigin%20%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0110.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20crossorigin%20%E5%B1%9E%E6%80%A7/README.html) -->  
  - [1. 📒 crossorigin 属性](https://tdahuyou.github.io/notes/notes/html-css-js/0110.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20crossorigin%20%E5%B1%9E%E6%80%A7/README.html#1--crossorigin-属性)
  

- [ ] [0111. script 元素的 type 属性](https://tdahuyou.github.io/notes/notes/html-css-js/0111.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20type%20%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0111.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20type%20%E5%B1%9E%E6%80%A7/README.html) -->  
  - [1. 📒 type 属性](https://tdahuyou.github.io/notes/notes/html-css-js/0111.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20type%20%E5%B1%9E%E6%80%A7/README.html#1--type-属性)
  

## 12. ⏰ html-css

- [ ] [0082. img 元素宽度撑满，防止溢出容器](https://tdahuyou.github.io/notes/notes/html-css-js/0082.%20img%20%E5%85%83%E7%B4%A0%E5%AE%BD%E5%BA%A6%E6%92%91%E6%BB%A1%EF%BC%8C%E9%98%B2%E6%AD%A2%E6%BA%A2%E5%87%BA%E5%AE%B9%E5%99%A8/README.html) <!-- [locale](./0082.%20img%20%E5%85%83%E7%B4%A0%E5%AE%BD%E5%BA%A6%E6%92%91%E6%BB%A1%EF%BC%8C%E9%98%B2%E6%AD%A2%E6%BA%A2%E5%87%BA%E5%AE%B9%E5%99%A8/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0082.%20img%20%E5%85%83%E7%B4%A0%E5%AE%BD%E5%BA%A6%E6%92%91%E6%BB%A1%EF%BC%8C%E9%98%B2%E6%AD%A2%E6%BA%A2%E5%87%BA%E5%AE%B9%E5%99%A8/README.html#1--从语雀搬运笔记)
  

- [ ] [0083. 容器高度自适应图片高度](https://tdahuyou.github.io/notes/notes/html-css-js/0083.%20%E5%AE%B9%E5%99%A8%E9%AB%98%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E9%AB%98%E5%BA%A6/README.html) <!-- [locale](./0083.%20%E5%AE%B9%E5%99%A8%E9%AB%98%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E9%AB%98%E5%BA%A6/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0083.%20%E5%AE%B9%E5%99%A8%E9%AB%98%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E9%AB%98%E5%BA%A6/README.html#1--从语雀搬运笔记)
  

- [ ] [0084. 普通元素的参考系是父元素的 content-box](https://tdahuyou.github.io/notes/notes/html-css-js/0084.%20%E6%99%AE%E9%80%9A%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%82%E8%80%83%E7%B3%BB%E6%98%AF%E7%88%B6%E5%85%83%E7%B4%A0%E7%9A%84%20content-box/README.html) <!-- [locale](./0084.%20%E6%99%AE%E9%80%9A%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%82%E8%80%83%E7%B3%BB%E6%98%AF%E7%88%B6%E5%85%83%E7%B4%A0%E7%9A%84%20content-box/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0084.%20%E6%99%AE%E9%80%9A%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%82%E8%80%83%E7%B3%BB%E6%98%AF%E7%88%B6%E5%85%83%E7%B4%A0%E7%9A%84%20content-box/README.html#1--从语雀搬运笔记)
  

- [ ] [0085. absolute 定位元素的参考系是父元素中的定位元素的 padding-box](https://tdahuyou.github.io/notes/notes/html-css-js/0085.%20absolute%20%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%82%E8%80%83%E7%B3%BB%E6%98%AF%E7%88%B6%E5%85%83%E7%B4%A0%E4%B8%AD%E7%9A%84%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0%E7%9A%84%20padding-box/README.html) <!-- [locale](./0085.%20absolute%20%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%82%E8%80%83%E7%B3%BB%E6%98%AF%E7%88%B6%E5%85%83%E7%B4%A0%E4%B8%AD%E7%9A%84%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0%E7%9A%84%20padding-box/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0085.%20absolute%20%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%82%E8%80%83%E7%B3%BB%E6%98%AF%E7%88%B6%E5%85%83%E7%B4%A0%E4%B8%AD%E7%9A%84%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0%E7%9A%84%20padding-box/README.html#1--从语雀搬运笔记)
  

- [ ] [0086. 表单单选框](https://tdahuyou.github.io/notes/notes/html-css-js/0086.%20%E8%A1%A8%E5%8D%95%E5%8D%95%E9%80%89%E6%A1%86/README.html) <!-- [locale](./0086.%20%E8%A1%A8%E5%8D%95%E5%8D%95%E9%80%89%E6%A1%86/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0086.%20%E8%A1%A8%E5%8D%95%E5%8D%95%E9%80%89%E6%A1%86/README.html#1--从语雀搬运笔记)
  

- [ ] [0087. 表单提交、重置按钮](https://tdahuyou.github.io/notes/notes/html-css-js/0087.%20%E8%A1%A8%E5%8D%95%E6%8F%90%E4%BA%A4%E3%80%81%E9%87%8D%E7%BD%AE%E6%8C%89%E9%92%AE/README.html) <!-- [locale](./0087.%20%E8%A1%A8%E5%8D%95%E6%8F%90%E4%BA%A4%E3%80%81%E9%87%8D%E7%BD%AE%E6%8C%89%E9%92%AE/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0087.%20%E8%A1%A8%E5%8D%95%E6%8F%90%E4%BA%A4%E3%80%81%E9%87%8D%E7%BD%AE%E6%8C%89%E9%92%AE/README.html#1--从语雀搬运笔记)
  

- [ ] [0088. 表单元素 select 多选](https://tdahuyou.github.io/notes/notes/html-css-js/0088.%20%E8%A1%A8%E5%8D%95%E5%85%83%E7%B4%A0%20select%20%E5%A4%9A%E9%80%89/README.html) <!-- [locale](./0088.%20%E8%A1%A8%E5%8D%95%E5%85%83%E7%B4%A0%20select%20%E5%A4%9A%E9%80%89/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0088.%20%E8%A1%A8%E5%8D%95%E5%85%83%E7%B4%A0%20select%20%E5%A4%9A%E9%80%89/README.html#1--从语雀搬运笔记)
  

- [ ] [0089. 密码输入框](https://tdahuyou.github.io/notes/notes/html-css-js/0089.%20%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5%E6%A1%86/README.html) <!-- [locale](./0089.%20%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5%E6%A1%86/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0089.%20%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5%E6%A1%86/README.html#1--从语雀搬运笔记)
  

- [ ] [0090. 认识 table 元素结构](https://tdahuyou.github.io/notes/notes/html-css-js/0090.%20%E8%AE%A4%E8%AF%86%20table%20%E5%85%83%E7%B4%A0%E7%BB%93%E6%9E%84/README.html) <!-- [locale](./0090.%20%E8%AE%A4%E8%AF%86%20table%20%E5%85%83%E7%B4%A0%E7%BB%93%E6%9E%84/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0090.%20%E8%AE%A4%E8%AF%86%20table%20%E5%85%83%E7%B4%A0%E7%BB%93%E6%9E%84/README.html#1--从语雀搬运笔记)
  

- [ ] [0091. 定位练习 - 侧边广告](https://tdahuyou.github.io/notes/notes/html-css-js/0091.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A/README.html) <!-- [locale](./0091.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A/README.html) -->  
  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0091.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A/README.html#1--从语雀搬运笔记)
  

- [ ] [0092. 定位练习 - 视口居中](https://tdahuyou.github.io/notes/notes/html-css-js/0092.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E8%A7%86%E5%8F%A3%E5%B1%85%E4%B8%AD/README.html) <!-- [locale](./0092.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E8%A7%86%E5%8F%A3%E5%B1%85%E4%B8%AD/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0092.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E8%A7%86%E5%8F%A3%E5%B1%85%E4%B8%AD/README.html#1--从语雀搬运笔记)
  
  

- [ ] [0093. 定位练习 - 视频卡片](https://tdahuyou.github.io/notes/notes/html-css-js/0093.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87/README.html) <!-- [locale](./0093.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0093.%20%E5%AE%9A%E4%BD%8D%E7%BB%83%E4%B9%A0%20-%20%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87/README.html#1--从语雀搬运笔记)
  

- [ ] [0094. 盒模型 content-box vs. border-box](https://tdahuyou.github.io/notes/notes/html-css-js/0094.%20%E7%9B%92%E6%A8%A1%E5%9E%8B%20content-box%20vs.%20border-box/README.html) <!-- [locale](./0094.%20%E7%9B%92%E6%A8%A1%E5%9E%8B%20content-box%20vs.%20border-box/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0094.%20%E7%9B%92%E6%A8%A1%E5%9E%8B%20content-box%20vs.%20border-box/README.html#1--从语雀搬运笔记)
  

- [ ] [0095. 精灵图](https://tdahuyou.github.io/notes/notes/html-css-js/0095.%20%E7%B2%BE%E7%81%B5%E5%9B%BE/README.html) <!-- [locale](./0095.%20%E7%B2%BE%E7%81%B5%E5%9B%BE/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0095.%20%E7%B2%BE%E7%81%B5%E5%9B%BE/README.html#1--从语雀搬运笔记)
  

- [ ] [0096. 属性值的计算过程](https://tdahuyou.github.io/notes/notes/html-css-js/0096.%20%E5%B1%9E%E6%80%A7%E5%80%BC%E7%9A%84%E8%AE%A1%E7%AE%97%E8%BF%87%E7%A8%8B/README.html) <!-- [locale](./0096.%20%E5%B1%9E%E6%80%A7%E5%80%BC%E7%9A%84%E8%AE%A1%E7%AE%97%E8%BF%87%E7%A8%8B/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0096.%20%E5%B1%9E%E6%80%A7%E5%80%BC%E7%9A%84%E8%AE%A1%E7%AE%97%E8%BF%87%E7%A8%8B/README.html#1--从语雀搬运笔记)
  

- [ ] [0097. 字体图标](https://tdahuyou.github.io/notes/notes/html-css-js/0097.%20%E5%AD%97%E4%BD%93%E5%9B%BE%E6%A0%87/README.html) <!-- [locale](./0097.%20%E5%AD%97%E4%BD%93%E5%9B%BE%E6%A0%87/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0097.%20%E5%AD%97%E4%BD%93%E5%9B%BE%E6%A0%87/README.html#1--从语雀搬运笔记)
  

- [ ] [0098. a 元素的爱恨法则](https://tdahuyou.github.io/notes/notes/html-css-js/0098.%20a%20%E5%85%83%E7%B4%A0%E7%9A%84%E7%88%B1%E6%81%A8%E6%B3%95%E5%88%99/README.html) <!-- [locale](./0098.%20a%20%E5%85%83%E7%B4%A0%E7%9A%84%E7%88%B1%E6%81%A8%E6%B3%95%E5%88%99/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0098.%20a%20%E5%85%83%E7%B4%A0%E7%9A%84%E7%88%B1%E6%81%A8%E6%B3%95%E5%88%99/README.html#1--从语雀搬运笔记)
  

- [ ] [0099. 伪类选择器 first-child、nth-cihld](https://tdahuyou.github.io/notes/notes/html-css-js/0099.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child%E3%80%81nth-cihld/README.html) <!-- [locale](./0099.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child%E3%80%81nth-cihld/README.html) -->  
  - [1. 📝 summary](https://tdahuyou.github.io/notes/notes/html-css-js/0099.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child%E3%80%81nth-cihld/README.html#1--summary)
  

- [ ] [0100. 伪类选择器 nth-cihld](https://tdahuyou.github.io/notes/notes/html-css-js/0100.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20nth-cihld/README.html) <!-- [locale](./0100.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20nth-cihld/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0100.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20nth-cihld/README.html#1--从语雀搬运笔记)
  

- [ ] [0101. 伪类选择器 first-child](https://tdahuyou.github.io/notes/notes/html-css-js/0101.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child/README.html) <!-- [locale](./0101.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0101.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child/README.html#1--从语雀搬运笔记)
  

- [ ] [0102. 伪类选择器 first-of-type](https://tdahuyou.github.io/notes/notes/html-css-js/0102.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-of-type/README.html) <!-- [locale](./0102.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-of-type/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0102.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-of-type/README.html#1--从语雀搬运笔记)
  

- [ ] [0103. 颜色的 alpha 通道](https://tdahuyou.github.io/notes/notes/html-css-js/0103.%20%E9%A2%9C%E8%89%B2%E7%9A%84%20alpha%20%E9%80%9A%E9%81%93/README.html) <!-- [locale](./0103.%20%E9%A2%9C%E8%89%B2%E7%9A%84%20alpha%20%E9%80%9A%E9%81%93/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0103.%20%E9%A2%9C%E8%89%B2%E7%9A%84%20alpha%20%E9%80%9A%E9%81%93/README.html#1--从语雀搬运笔记)
  

- [ ] [0104. 一些常见的通用 css](https://tdahuyou.github.io/notes/notes/html-css-js/0104.%20%E4%B8%80%E4%BA%9B%E5%B8%B8%E8%A7%81%E7%9A%84%E9%80%9A%E7%94%A8%20css/README.html) <!-- [locale](./0104.%20%E4%B8%80%E4%BA%9B%E5%B8%B8%E8%A7%81%E7%9A%84%E9%80%9A%E7%94%A8%20css/README.html) -->  
  - [1. ⏰ 从语雀搬运笔记](https://tdahuyou.github.io/notes/notes/html-css-js/0104.%20%E4%B8%80%E4%BA%9B%E5%B8%B8%E8%A7%81%E7%9A%84%E9%80%9A%E7%94%A8%20css/README.html#1--从语雀搬运笔记)
  
