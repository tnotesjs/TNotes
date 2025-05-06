# [0019. Egg.js 中的 controller、service、model 模块命名解析策略](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0019.%20Egg.js%20%E4%B8%AD%E7%9A%84%20controller%E3%80%81service%E3%80%81model%20%E6%A8%A1%E5%9D%97%E5%91%BD%E5%90%8D%E8%A7%A3%E6%9E%90%E7%AD%96%E7%95%A5)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

- Controller 和 Service 会自动转为小驼峰的形式。
- Model 会自动转为大驼峰的形式。
- 👇 下面以 `user_info.js` 为例来举例说明：

| 模块类型 | 存放路径 | 引用方式示例 | 自动解析机制 |
| --- | --- | --- | --- |
| Controller | `app/controller/user_info.js` | 比如在 router 中访问：`controller.userInfo.index` | `user_info` 会被自动转为小驼峰形式 `userInfo` |
| Service | `app/service/user_info.js` | 比如在某个 Controller 中访问：`ctx.service.userInfo` | `user_info` 会被自动转为小驼峰形式 `userInfo` |
| Model | `app/model/user_info.js` | 比如在某个 Service 中访问：`ctx.model.UserInfo` | `user_info` 会被自动转为大驼峰形式 `UserInfo` |
