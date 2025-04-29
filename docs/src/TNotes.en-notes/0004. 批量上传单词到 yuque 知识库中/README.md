# [0004. 批量上传单词到 yuque 知识库中](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 📒 notes](#2--notes)

<!-- endregion:toc -->
## 1. 📝 简介

- 该笔记中记录的脚本，解决的问题 —— 将单词数据批量上传到 yuque 知识库上。
- 截止目前（2024 年 10 月 26 日）需要 yuque 超级会员，获取到 token 才能使用。

## 2. 📒 notes

- 这里边的内容也是早期基于 en-notes.0002 来修改的，作用是将单词数据推送到 yuque 知识库中。yuque 官方有暴露一些文档的 API 访问权限，需要绑定自己的 token 即可访问相关接口。
- 最终效果
  - https://www.yuque.com/tdahuyou/en/cancel
    - 【注】这个知识库会清空掉，这里仅仅是放一个链接辅助说明。
      - 目前（2024 年 10 月 26 日）将词汇数据的格式做了一些调整，并搬运到了 github 上。
        - 比如 https://github.com/Tdahuyou/en-words/blob/main/cancel.md
        - 详情见 en-notes.0001 笔记描述。
    - 有一个知识库的基地址，比如 https://www.yuque.com/tdahuyou/en/
    - 解析出来的单词数据存储在一个个 .md 文件中，比如将 cancel.md 中的数据推送到语雀上的这个知识库里边后，会在路径后拼接上该单词的名称，比如 https://www.yuque.com/tdahuyou/en/cancel 这样就能快速查询到相关词汇了，并且如果有需要的话在 yuque 上也能对非常方便地对这些单词进行二次编辑。
  - ![](assets/2024-10-26-19-07-52.png)
- 阅读脚本的时候可以参考这 en-notes.0002 里边的脚本来一起看看。
- 【注】目前（2024 年 10 月 26 日）脚本还未测试过是否可用，或许已经没法用了。
