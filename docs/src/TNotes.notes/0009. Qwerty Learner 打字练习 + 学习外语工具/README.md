# [0009. Qwerty Learner 打字练习 + 学习外语工具](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0009.%20Qwerty%20Learner%20%E6%89%93%E5%AD%97%E7%BB%83%E4%B9%A0%20%2B%20%E5%AD%A6%E4%B9%A0%E5%A4%96%E8%AF%AD%E5%B7%A5%E5%85%B7)

<!-- region:toc -->

- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)
  - [bilibili.TNotes.notes.0009.1](https://www.bilibili.com/video/BV1sj411A7r2)
  - [bilibili.TNotes.notes.0009.2](https://www.bilibili.com/video/BV1w24y1p79A)
- [1. 📝 概述](#1--概述)
- [2. 🔗 Qwerty Learner 在线访问链接](#2--qwerty-learner-在线访问链接)
- [3. 📺 TNotes.bilibili](#3--tnotesbilibili)
- [4. 💻 提取单词数据的脚本（旧版）](#4--提取单词数据的脚本旧版)
- [5. 🤔 Q&A](#5--qa)
  - [5.1. 🤔 问：如何导入新的词典？](#51--问如何导入新的词典)
  - [5.2. 🤔 问：如何下载 Qwerty Learner 桌面版？](#52--问如何下载-qwerty-learner-桌面版)
  - [5.3. 🤔 问：如何给 Qwerty Learner 项目提建议 or 问题？](#53--问如何给-qwerty-learner-项目提建议-or-问题)
- [6. 🔗 References](#6--references)

<!-- endregion:toc -->

## 1. 📝 概述

- Qwerty Learner 简介
- 单词数据源提取方式说明

## 2. 🔗 Qwerty Learner 在线访问链接

- https://qwerty.kaiyi.cool/
- https://qwerty-learner.vercel.app/
- https://realkai42.github.io/qwerty-learner/

## 3. 📺 TNotes.bilibili

- 如果把想要分享的内容全部都介绍完，估计时间会很长，所以计划拆分为俩视频来介绍，每个视频把想要说明的核心要点给讲清楚就好。
- 录制的两个分享视频时长加起来有 `40min` 了，其中第二个视频的较大篇幅是在介绍如何解析并利用词典数据源。

<BilibiliOutsidePlayer id="BV1sj411A7r2" />

- **视频内容概述**
  - 对于 Qwerty Learner 工具的相关功能，可以通过这个视频快速了解。
  - 视频开始部分，先回顾了 `TNotes.notes.0008` 中提到的打字指法教程。
    - 若不熟悉打字指法，建议回看一下上期视频的后半部分 —— 打字指法教程。
  - 最后，介绍 qwerty learner 这款工具，并简单说明了一下第二个视频的内容。

<BilibiliOutsidePlayer id="BV1w24y1p79A" />

- **视频内容概述**
  - 上期视频简介
  - 介绍数据的获取方式
  - 展示解析后的数据的结构
  - 介绍 qwerty learner 词典数据源
  - 介绍 qwerty learner 桌面版的获取方式
  - 脚本使用 & 功能介绍
  - 如何将数据导出为 PDF、word

## 4. 💻 提取单词数据的脚本（旧版）

- 这部分内容涉及到一些编程相关的知识，暂时还没能力跟大家介绍清楚原理。所以就简单说明一下步骤，和实现逻辑。
  - 步骤：
    1. 安装 node 环境
    2. 随便找个地方，新建两个文件夹 `sources`、`results`
    3. 下载词典源数据到 sources 目录中，并解压
    4. 执行脚本
  - 需要具备的基本编程知识主要有以下两点：
    - 文件的 I O 操作
    - 字符串拼接
- 备注：
  - 具体步骤呢，如果你感兴趣的话，可以回看第二期视频的后半部分。
  - 这里大家听一乐就好，毕竟所有的词典数据源都已经趴下来了。
  - 如果你想要自定义单词数据格式，可以考虑基于以下脚本做点儿简单的修改来实现。
  - `TNotes.en-notes`、`TNotes.en-words`
    - 在我的英语学习相关的知识库中也用到了以下提取单词的脚本，其中 `TNotes.en-words` 中的单词初始数据就是从词典中扒下来的。

::: code-group

```javascript [提取单词数据的脚本]
const fs = require('fs')
const path = require('path')
// const {
//   EOL
// } = require('os')

/**
 * 源目录名
 */
const SOURCE_FOLDER_NAME = 'sources'
/**
 * 目标目录名
 */
const RESULT_FOLDER_NAME = 'results'
/**
 * 一个单词下边的子标题
 */
const SUB_TITLE = {
  sentence: '例句',
  phrase: '短语',
  trans: '词义',
  relWord: '关联词汇',
  ukphone: 'UK',
  usphone: 'US',
  syno: '同义词',
}

let sourcesFolderPath = path.join(__dirname, SOURCE_FOLDER_NAME) // sources 目录的绝对路径
let resultsFolderPath = path.join(__dirname, RESULT_FOLDER_NAME) // results 目录的绝对路径

const JSON_FileList = fs
  .readdirSync(sourcesFolderPath)
  .filter((p) => p.includes('.json'))
  .map((p) => path.join(sourcesFolderPath, p)) // sources 目录下所有 json 文件的绝对路径

for (let i = 0; i < JSON_FileList.length; i++) {
  writeFile(JSON_FileList[i])
}

// 写入文件
function writeFile(fileName) {
  // 处理文件内容
  let fileContent = fs.readFileSync(fileName, 'utf-8')
  fileContent = '[' + fileContent + ']'

  fileContent = fileContent.replaceAll(/}\r\n/g, '},').replaceAll(/},]/g, '}]')
  // console.log(fileContent);

  let data = JSON.parse(fileContent)

  // 解析的 json 词典名称
  const basename = path.basename(fileName, '.json')

  // 清空 results 目录下指定词典目录
  const resultFolderPath = path.join(resultsFolderPath, basename)
  emptyDir(resultFolderPath)
  rmEmptyDir(resultFolderPath)
  fs.mkdirSync(resultFolderPath)

  // 单词列表（只含单词）
  const headWords = data.map((w) => w.headWord)
  // console.log(headWords)
  const checkString =
    `# ${basename}\n` +
    headWords
      .map((h, i) => {
        if (i % 20 === 0)
          return `\n#### Chapter ${i / 20 + 1}\n\n` + `- [ ] ${h}\n`
        else return `- [ ] ${h}\n`
      })
      .join('')
  fs.writeFileSync(path.join(resultFolderPath, `./${basename}.md`), checkString)

  let chapterString
  let chapterNum = 0
  data.forEach((it, i) => {
    if (i === data.length - 1)
      fs.writeFileSync(
        path.join(resultFolderPath, `./Chapter ${chapterNum}.md`),
        chapterString
      )
    // 拼接章节 四级标题
    if (i % 20 === 0) {
      if (chapterNum !== 0)
        fs.writeFileSync(
          path.join(resultFolderPath, `./Chapter ${chapterNum}.md`),
          chapterString
        )
      chapterNum++
      chapterString = ''
      chapterString += `# Chapter ${chapterNum}`
      chapterString += '\n\n'

      // 拼接该 chapter 中的所有单词为 checkbox
      chapterString += headWords
        .slice((chapterNum - 1) * 20, chapterNum * 20)
        .map((h) => `- [ ] ${h}\n`)
        .join('')
      chapterString += '\n'
    }

    // 拼接单词 五级标题
    chapterString += `# ${(i % 20) + 1}. ${it.headWord}`
    chapterString += '\n\n'
    const word = it.content.word.content

    // 拼接发音
    chapterString += `${SUB_TITLE.usphone}: [${word.usphone}]` + '\n'
    chapterString += `${SUB_TITLE.ukphone}: [${word.ukphone}]` + '\n\n'

    // 拼接词义
    if (word.trans && word.trans.length > 0) {
      const trans = word.trans
      chapterString += `## ${SUB_TITLE.trans}` + '\n\n'
      for (let i = 0; i < trans.length; i++) {
        const t = trans[i]
        if (t.pos && t.tranCn)
          chapterString += `${t.pos}. ${t.tranCn.replace(/\s/g, '')}` + '\n'
        if (t.tranOther) chapterString += `\`${t.tranOther}\``
        chapterString += '\n\n'
      }
    }

    // 拼接同义词
    if (word.syno && word.syno.synos && word.syno.synos.length > 0) {
      const synos = word.syno.synos
      chapterString += `## ${SUB_TITLE.syno}` + '\n\n'
      for (let i = 0; i < synos.length; i++) {
        const s = synos[i]
        const w = s.hwds.map((h) => `\`${h.w}\``).join(' ')
        chapterString += `${s.pos}. ${s.tran}` + '\n' + w + '\n\n'
      }
      chapterString += '\n'
    }

    // 拼接短语
    if (word.phrase && word.phrase.phrases) {
      const phrase = word.phrase
      const phrases = phrase.phrases
      chapterString += `## ${phrase.desc}` + '\n\n'
      phrases.forEach((p) => {
        chapterString += `- \`${p.pContent}\` ${p.pCn}` + '\n'
      })
      chapterString += '\n'
    }

    // 拼接例句
    if (word.sentence && word.sentence.sentences) {
      const sentence = word.sentence
      const sentences = sentence.sentences
      chapterString += `## ${sentence.desc}` + '\n\n'
      sentences.forEach((s) => {
        chapterString += `\`${s.sContent}\`` + '\n' + s.sCn + '\n\n'
      })
      chapterString += '\n'
    }
  })
}

/**
 * 删除所有的文件(将所有文件夹置空)
 * @param {*} filePath
 */
function emptyDir(filePath) {
  try {
    const files = fs.readdirSync(filePath) // 读取该文件夹
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`
      const states = fs.statSync(nextFilePath)
      if (states.isDirectory()) {
        emptyDir(nextFilePath)
      } else {
        fs.unlinkSync(nextFilePath)
        // console.log(`删除文件 ${nextFilePath} 成功`)
      }
    })
  } catch (error) {
    // console.log(error)
    return
  }
}

/**
 * 删除所有的空文件夹
 * @param {*} filePath
 */
function rmEmptyDir(filePath) {
  try {
    const files = fs.readdirSync(filePath)
    if (files.length === 0) {
      fs.rmdirSync(filePath)
      // console.log(`删除空文件夹 ${filePath} 成功`)
    } else {
      let tempFiles = 0
      files.forEach((file) => {
        tempFiles++
        const nextFilePath = `${filePath}/${file}`
        rmEmptyDir(nextFilePath)
      })
      //删除母文件夹下的所有字空文件夹后，将母文件夹也删除
      if (tempFiles === files.length) {
        fs.rmdirSync(filePath)
        // console.log(`删除空文件夹 ${filePath} 成功`)
      }
    }
  } catch (error) {
    // console.log(error)
    return
  }
}
```

:::

## 5. 🤔 Q&A

### 5.1. 🤔 问：如何导入新的词典？

- https://github.com/RealKai42/qwerty-learner/blob/master/docs/toBuildDict.md
  - 这篇官方文档介绍了应该怎么做。
- 我暂时没有此需求，尚未实际操作过。

### 5.2. 🤔 问：如何下载 Qwerty Learner 桌面版？

- https://github.com/tw93/Pake
  - 你可以在这里获取 Qwerty Learner 的桌面版安装包。
- 如果你也认为这是一款非常不错的工具，并且经常使用的话，那么你可以通过安装它的桌面版，以降低访问成本。
- 成功安装完之后，它就像你电脑上的浏览器一样，需要的时候，直接点击桌面图标即可快速打开。
- 如果你使用的浏览器支持将页面本地化，可以优先考虑这种方式，具体做法见下图。
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-07-53-31.png)
  - 快捷方式创建成功之后，可以本地看到新建的 Chrome 应用，它就好比是一个桌面应用，你可以将其固定到底部的扩展坞中（Mac）或者添加到桌面上（Windows）。
  - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-07-53-53.png)
- 处理 macOS 上的验证问题：
  - 如果在 macos 上打开安装好的应用时出现类似下面这样的报错，可以在【应用程序】目录中找到【Qwerty】然后右键打开它。
  - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-07-56-05.png)
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-07-56-14.png)
  - 为了下次能够更加方便地打开 Qwerty，你可以将其固定在程序扩展坞中。
  - ![图 4](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-07-56-25.png)

### 5.3. 🤔 问：如何给 Qwerty Learner 项目提建议 or 问题？

- 直接给项目提 [Issues](https://github.com/Kaiyiwing/qwerty-learner/issues)（建议 or 问题）即可。

## 6. 🔗 References

::: details

- https://github.com/Kaiyiwing
  - Qwerty Learner 作者。
- https://github.com/Kaiyiwing/qwerty-learner
  - Qwerty Learner 项目 GitHub 链接。
- https://github.com/kajweb/dict
  - 词典数据来源
- https://github.com/RealKai42/qwerty-learner/blob/master/docs/toBuildDict.md
  - 这篇官方文档介绍了如何导入新的词典
- https://github.com/tw93/Pake
  - 可以在这里获取 Qwerty Learner 的桌面版安装包。
- https://github.com/Kaiyiwing/qwerty-learner/issues
  - 给 Qwerty Learner 项目提建议 or 问题的入口。

:::
