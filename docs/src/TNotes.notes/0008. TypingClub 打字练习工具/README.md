# [0008. TypingClub 打字练习工具](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0008.%20TypingClub%20%E6%89%93%E5%AD%97%E7%BB%83%E4%B9%A0%E5%B7%A5%E5%85%B7)

<!-- region:toc -->

- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)
  - [bilibili.TNotes.notes.0008.1](https://www.bilibili.com/video/BV1Cv4y1474Y)
- [1. 📝 概述](#1--概述)
- [2. 📒 TypingClub 简介](#2--typingclub-简介)
- [3. 📒 打字指法教程](#3--打字指法教程)
- [4. 📒 TypeRacer ｜ 一个和 TypingClub 类似的站点（无需 🪜）](#4--typeracer--一个和-typingclub-类似的站点无需-)
- [5. 💻 使用脚本获取 TypingClub 的 lesson 文本](#5--使用脚本获取-typingclub-的-lesson-文本)
- [6. 🤔 Q&A](#6--qa)
  - [6.1. 🤔 问：wpm、kpm 单位是？](#61--问wpmkpm-单位是)
  - [6.2. 🤔 问：Typeracer 是什么？](#62--问typeracer-是什么)
- [7. 🔗 References](#7--references)

<!-- endregion:toc -->

## 1. 📝 概述

<BilibiliOutsidePlayer id="BV1Cv4y1474Y" />

- 介绍了 TypingClub 这款练习打字的工具
  - 访问 TypingClub 需要梯子
  - 翻墙可以解决 「TypingClub 无法进入 or 进入缓慢的问题」
  - 为了过审，这个在视频里不能说……
- 介绍了“打字指法”
- 介绍了两个跟打字相关的单位：wpm、kpm
- 介绍了一个类似 TypingClub 的工具 - Typeracer

## 2. 📒 TypingClub 简介

- TypingClub 在线访问 👉🏻 [Free Touch Typing Software](https://www.typingclub.com/)
- 这个站点中主要包含以下内容：
  - 打字视频教程
  - 打字闯关游戏
  - 打字闯关练习

## 3. 📒 打字指法教程

- ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-03-19-25-37.png)
- **左手**
  - 小拇指：`~`、`tab`、`caps lock`、`shift`、`control`、`1`、`Q`、`A`、`Z`、`option`
  - 无名指：`2`、`W`、`S`、`X`
  - 中指：`3`、`E`、`D`、`C`
  - 食指：`4`、`R`、`F`、`V`、`5`、`T`、`G`、`B`
  - 大拇指：`space`
- **右手**
  - 大拇指：`space`
  - 食指：`6`、`Y`、`H`、`N`、`7`、`U`、`J`、`M`
  - 中指：`8`、`I`、`K`、`<`
  - 无名指：`9`、`O`、`L`、`>`
  - 小拇指：`0`、`P`、`;`、`?`、`-`、`[`、`'`、`shfit`、`+`、`]`、`enter`、`backspace`、`\`

::: details 其他指法

- Qwerty Learner - 推荐打字指法图示
- ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-03-19-27-48.png)
- 在 qwerty learner 在线练习打字的站点中有推荐的打字指法图示，也可以参考这张图。这张图和上面自己绘制的图相比，核心差异主要体现在最上面的数字键上，几个数字键的差异罢了，怎么习惯怎么来就行。

:::

## 4. 📒 TypeRacer ｜ 一个和 TypingClub 类似的站点（无需 🪜）

- 链接 👉🏻 [https://play.typeracer.com/](https://play.typeracer.com/)
- 这是一个同事推荐的用于练习打字的站点，无需梯子就可以访问。

::: details 题外话 - 前同事排名全国第二

- 同事打进了全国第二…… 速度好像是 160wpm 还是 180wpm 左右（wpm 表示每分钟的单词数量）
- 同事大二开始练，距离当下 `23.05` 差不多 5 年……
- 当时看同事打的时候看呆了，忘记录视频了，真的很快……
- 个人封顶 80-100wpm……
- 排行榜：https://www.zaixiandazi.com/rank/english
  - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-03-19-33-03.png)

:::

## 5. 💻 使用脚本获取 TypingClub 的 lesson 文本

::: code-group

```js [脚本源码]
let lessonStr = ''
document.querySelectorAll('.token_unit._clr').forEach((w) => {
  lessonStr += w.innerText
})
console.log(lessonStr)
```

:::

- 这样可以先把内容提取出来，先读一读，再练手。
- **脚本使用流程简介**：
  - 复制脚本
  - 进入想要练习的 lesson 并打开控制台
    - ![图 4](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-03-19-40-09.png)
  - 粘贴脚本到控制台，按下回车
    - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-03-19-39-05.png)
  - 复制输出的文本内容
    - `5 cute dolphins, 6 big whales, and 55 balloons are floating in the air. 56 reversed is 65 but 56 is smaller than 65. Five pounds of sand in 6 little jars. 5 is my favorite number and 6 is yours.`
  - 随便找个翻译的工具，将内容翻译为中文
    - `5只可爱的海豚、6只大鲸鱼和55个气球漂浮在空中。 56 倒过来是 65，但是 56 比 65 小。5 磅沙子装在 6 个小罐子里。 5 是我最喜欢的数字，6 是你的。`
- 补充：
  - 刚测试了一下，脚本还是可以正常使用的。
    - 现在时间：`2025 年 5 月 3 日 19:48:22`
  - ![图 5](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-03-19-47-33.png)
- 借助 AI：
  - 翻译工作可以交给 AI 去完成。
  - 如果你对爬虫有所了解，可以自行写一个脚本去爬取 TypingClub 上的 lesson 文本内容。
  - 如果 lesson 的内容可以通过一张图直接截下来的话，交给 AI 去识别图像中的内容，依次来提取 lesson 文本也是 ok 的。

## 6. 🤔 Q&A

### 6.1. 🤔 问：wpm、kpm 单位是？

- 答：
  - 简单说，wpm 是每分钟敲了多少个词，kpm 是每分钟敲了多少下键盘。
- 在打字和键盘技能测量中，WPM（每分钟字数）和 KPM（每分钟击键数）是两种常用的衡量标准。根据不同的需求和场景，这两个单位可以帮助用户更好地理解和提升自己的键盘使用技能。
- **WPM（Words Per Minute）**
  - WPM 是衡量一个人打字速度的标准单位，指每分钟可以打多少个完整的单词。这是最常用的打字速度测量方式，特别是在打字游戏和专业场景中。计算 WPM 的标准方法是将打字的字符总数除以 5（因为在英文中一个标准单词的平均长度约为五个字符），然后再除以所用的分钟数。这种方法尝试考虑到不同单词长度的平均值。
  - 更普遍用于打字速度的一般评估，如行政助理或作家的职业测试。在教育和娱乐性打字游戏中也很常见，如 Typeracer。
- **KPM（Keystrokes Per Minute）**
  - KPM 衡量的是每分钟内击键的次数，包括所有的字符、空格、标点符号等。KPM 更能准确反映一个人使用键盘的频率，因为它计算了所有的击键，而不仅仅是单词。这种计量方式在需要精确记录每次击键的场景中特别有用，如某些特定的数据输入工作或高级编程任务。
  - 在那些需要准确记录每次击键的专业场景中更为常用，例如编程或数据输入的工作，因为每一个符号、空格和控制命令都可能重要。

### 6.2. 🤔 问：Typeracer 是什么？

- **Typeracer**：
  - Typeracer 是一个流行的在线打字游戏平台，允许用户通过竞速的形式来练习和提升自己的打字速度。该平台创建于 2008 年，以其竞技性和互动性吸引了全球众多用户。
  - Typeracer 是一个极好的平台，适合各年龄段的用户，无论是想要轻松学习打字的初学者，还是想要在全球竞争中测试自己技能的高级用户。
- **主要特点**：
  - **实时竞速**：用户可以与来自世界各地的其他玩家实时竞争。每场比赛中，玩家需要尽快准确地输入给定的文本段落。
  - **多种文本选项**：Typeracer 提供多种语言和文本选项，包括名著中的引用，使练习过程既有教育意义又具挑战性。
  - **技能提升**：该平台提供了跟踪打字速度（每分钟字数，即 WPM）和准确率的功能，帮助用户监控自己的进步。
  - **排行榜系统**：玩家可以在全球和朋友之间的排行榜上看到自己的位置，增加了游戏的竞争性和动力。
  - **注册和匿名参与**：用户可以选择注册账户以保存进度和统计数据，或者匿名参与简单的练习。
- **使用场景**：
  - **教育机构**：学校和教育机构可以使用 Typeracer 作为教学工具，帮助学生提高打字速度和计算机熟练度。
  - **个人发展**：对于希望提高职业技能的成年人，Typeracer 提供了一个有趣的方式来练习键盘打字。
  - **竞技活动**：Typeracer 经常举办比赛和挑战，吸引竞技性玩家参与。

## 7. 🔗 References

::: details

- https://www.typingclub.com/
  - 这是 typingclub 的官网。

:::
