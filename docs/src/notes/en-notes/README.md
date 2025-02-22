# en-notes


## 1. 单词本

::: tip 目前的策略
- 每个单词本存储 100 个词。
- 使用自定义的 EnWordList.vue 组件，完成单词本中词汇列表的渲染。
- 按照字母升序排序
- 自动生成编号
- 实现 checkbox 功能，以便临时自测。
  - 实现 checkbox 缓存：将 checkout 状态存储在 local storage 中，以 pathname 和 word 拼接作为 key
- 全选功能。
- 全部重置功能。
:::

- [x] [0007. 单词本-1](https://tdahuyou.github.io/notes/notes/en-notes/0007.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-1/README.html) <!-- [locale](./0007.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-1/README.html) -->  
  - [1. ⚙️ EnWordList](https://tdahuyou.github.io/notes/notes/en-notes/0007.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-1/README.html#1-️-enwordlist)
  

- [x] [0008. 单词本-2](https://tdahuyou.github.io/notes/notes/en-notes/0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2/README.html) <!-- [locale](./0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2/README.html) -->  
  - [1. ⚙️ EnWordList](https://tdahuyou.github.io/notes/notes/en-notes/0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2/README.html#1-️-enwordlist)
  

## 2. 我的词库

- [x] [0001. en-words 仓库简介](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html) <!-- [locale](./0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html) -->  
  - [1. 🔗 github 开源仓库 - 英语字典 - kajweb/dict](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html#1--github-开源仓库---英语字典---kajwebdict)
  - [2. 🔗 en-words - 个人的英语词汇仓库](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html#2--en-words---个人的英语词汇仓库)
  - [3. 📒 en-words 简介](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html#3--en-words-简介)
  - [4. 🤔 为什么要新建一个 en-words 仓库？直接将生成的单词放在当前的 en-notes 仓库中不行吗？](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html#4--为什么要新建一个-en-words-仓库直接将生成的单词放在当前的-en-notes-仓库中不行吗)
  - [5. 🤔 如何往 en-words 中新增词汇？](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html#5--如何往-en-words-中新增词汇)
  - [6. 💻 demos.1 - 提取所有词汇的脚本](https://tdahuyou.github.io/notes/notes/en-notes/0001.%20en-words%20%E4%BB%93%E5%BA%93%E7%AE%80%E4%BB%8B/README.html#6--demos1---提取所有词汇的脚本)
  

## 3. 记单词的流程

- [x] [0005. en-words 结合幕布一起使用](https://tdahuyou.github.io/notes/notes/en-notes/0005.%20en-words%20%E7%BB%93%E5%90%88%E5%B9%95%E5%B8%83%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8/README.html) <!-- [locale](./0005.%20en-words%20%E7%BB%93%E5%90%88%E5%B9%95%E5%B8%83%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8/README.html) -->  
  - [1. 📒 基本使用流程](https://tdahuyou.github.io/notes/notes/en-notes/0005.%20en-words%20%E7%BB%93%E5%90%88%E5%B9%95%E5%B8%83%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8/README.html#1--基本使用流程)
  

## 4. qwerty-learner 英文单词

::: danger ⏰ 待整理
这部分的内容比较杂乱，还没整理，主要是早期做 qwerty-learner 分享视频的时候写的一些脚本啥的。

计划后续去看看 qwerty-learner 的源码，按照自己的需求做一些修改，以便更好地适配 TNotes，到时候再录制分享视频。

TODO：
- 除了练习单词，还需要能够练习句子
- 可以更轻松地导入单词、句子
- 英语、日语支持友好一些
:::

- [ ] [0003. qwerty-learner 英文单词数据源](https://tdahuyou.github.io/notes/notes/en-notes/0003.%20qwerty-learner%20%E8%8B%B1%E6%96%87%E5%8D%95%E8%AF%8D%E6%95%B0%E6%8D%AE%E6%BA%90/README.html) <!-- [locale](./0003.%20qwerty-learner%20%E8%8B%B1%E6%96%87%E5%8D%95%E8%AF%8D%E6%95%B0%E6%8D%AE%E6%BA%90/README.html) -->  
  - [1. 📝 Summary](https://tdahuyou.github.io/notes/notes/en-notes/0003.%20qwerty-learner%20%E8%8B%B1%E6%96%87%E5%8D%95%E8%AF%8D%E6%95%B0%E6%8D%AE%E6%BA%90/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/en-notes/0003.%20qwerty-learner%20%E8%8B%B1%E6%96%87%E5%8D%95%E8%AF%8D%E6%95%B0%E6%8D%AE%E6%BA%90/README.html#2--links)

- [ ] [0002. qwerty-learner 英语词典数据解析脚本](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html) <!-- [locale](./0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html) -->  
  - [1. 📝 Summary](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html#2--links)
  - [3. 📒 notes - qwerty-learner 脚本](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html#3--notes---qwerty-learner-脚本)
    - [3.1. qwerty learner 词典目录](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html#31-qwerty-learner-词典目录)
    - [3.2. 脚本使用说明](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html#32-脚本使用说明)
    - [3.3. 词典目录](https://tdahuyou.github.io/notes/notes/en-notes/0002.%20qwerty-learner%20%E8%8B%B1%E8%AF%AD%E8%AF%8D%E5%85%B8%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC/README.html#33-词典目录)

- [ ] [0004. 批量上传单词到 yuque 知识库中](https://tdahuyou.github.io/notes/notes/en-notes/0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD/README.html) <!-- [locale](./0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD/README.html) -->  
  - [1. 📝 Summary](https://tdahuyou.github.io/notes/notes/en-notes/0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD/README.html#1--summary)
  - [2. 📒 notes](https://tdahuyou.github.io/notes/notes/en-notes/0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD/README.html#2--notes)

- [ ] [0006. 《老人与海》笔记](https://tdahuyou.github.io/notes/notes/en-notes/0006.%20%E3%80%8A%E8%80%81%E4%BA%BA%E4%B8%8E%E6%B5%B7%E3%80%8B%E7%AC%94%E8%AE%B0/README.html) <!-- [locale](./0006.%20%E3%80%8A%E8%80%81%E4%BA%BA%E4%B8%8E%E6%B5%B7%E3%80%8B%E7%AC%94%E8%AE%B0/README.html) -->  
  - [1. 📝 Summary](https://tdahuyou.github.io/notes/notes/en-notes/0006.%20%E3%80%8A%E8%80%81%E4%BA%BA%E4%B8%8E%E6%B5%B7%E3%80%8B%E7%AC%94%E8%AE%B0/README.html#1--summary)
  - [2. 🔗 links](https://tdahuyou.github.io/notes/notes/en-notes/0006.%20%E3%80%8A%E8%80%81%E4%BA%BA%E4%B8%8E%E6%B5%B7%E3%80%8B%E7%AC%94%E8%AE%B0/README.html#2--links)
  - [3. 📒 notes - 《老人与海》原文 txt 版](https://tdahuyou.github.io/notes/notes/en-notes/0006.%20%E3%80%8A%E8%80%81%E4%BA%BA%E4%B8%8E%E6%B5%B7%E3%80%8B%E7%AC%94%E8%AE%B0/README.html#3--notes---老人与海原文-txt-版)
  - [4. 📒 notes - TTS 在线转换](https://tdahuyou.github.io/notes/notes/en-notes/0006.%20%E3%80%8A%E8%80%81%E4%BA%BA%E4%B8%8E%E6%B5%B7%E3%80%8B%E7%AC%94%E8%AE%B0/README.html#4--notes---tts-在线转换)
