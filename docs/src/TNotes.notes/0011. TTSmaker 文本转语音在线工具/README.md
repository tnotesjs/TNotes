# [0011. TTSmaker 文本转语音在线工具](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0011.%20TTSmaker%20%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7)

<!-- region:toc -->

- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)
  - [bilibili.TNotes.notes.0011.1](https://www.bilibili.com/video/BV1iX4y1a7Fz)
  - [bilibili.TNotes.notes.0011.2](https://www.bilibili.com/video/BV18H4y1H7GN)
  - [bilibili.TNotes.notes.0011.3](https://www.bilibili.com/video/BV141421U7tA)
- [1. 📝 概述](#1--概述)
- [2. 📺 视频](#2--视频)
- [3. 📒 TTSmaker 简介](#3--ttsmaker-简介)
- [4. 📒 tts-vue 简介](#4--tts-vue-简介)
- [5. 📒 KanTTS 克隆声音](#5--kantts-克隆声音)
- [6. 📒 vocalremover 音频在线合成工具](#6--vocalremover-音频在线合成工具)
- [7. 🤔 Q&A](#7--qa)
  - [7.1. 🤔 问：在语雀中插入音频资源，可以在线播放吗？](#71--问在语雀中插入音频资源可以在线播放吗)
  - [7.2. 🤔 问：TTSmaker 能不能读小说？](#72--问ttsmaker-能不能读小说)
  - [7.3. 🤔 问：py 的 egg 语音模块？（知识盲区）](#73--问py-的-egg-语音模块知识盲区)
  - [7.4. 🤔 问：录制使用 AI 快速创作视频的教程，初衷是什么？](#74--问录制使用-ai-快速创作视频的教程初衷是什么)

<!-- endregion:toc -->

## 1. 📝 概述

- 本篇笔记内容：
  - 文本转语音工具 - TTSmaker（主要使用这玩意儿）
  - 教程- 使用 TTS 工具快速创作视频
  - 文本转语音工具 - tts-vue（几乎没再使用）
  - vocalremover 语音处理工具（有音频需要合成处理的时候会考虑用它）
  - 声音克隆 - KanTTS（没用过）

::: tip

注：本节笔记中涉及到不少音频资源，统一存储在了知识库 `TNotes.yuque` 中，如果要听这些音频，可以到语雀上瞅一瞅。

:::

## 2. 📺 视频

<BilibiliOutsidePlayer id="BV1iX4y1a7Fz" />

- 这是初期录制的一个 TTS Tools 的工具视频，其中 3ts script 是一款自己写的 chrome 浏览器插件。

---

<BilibiliOutsidePlayer id="BV18H4y1H7GN" />

这是介绍如何使用免费的 AI 工具快速创作一条视频。

---

<BilibiliOutsidePlayer id="BV141421U7tA" />

这是利用 AI 工具产出的视频。

## 3. 📒 TTSmaker 简介

- ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-00-40.png)
- **TTSmaker**
  - TTSmaker 是一款免费的文字转语音的工具，并且有不少可选的优质音频，并且可以下载转换后的音频文件。
  - 在视频发布的时间点，这工具还是免费的，不过不清楚接下来是否会收费，总之现在还能白嫖就对了。
- **在线访问链接**
  - https://ttsmaker.com/zh-cn （需要翻墙）
  - https://ttsmaker.cn/ （无需翻墙）

## 4. 📒 tts-vue 简介

- tts-vue 是一个开源项目，并且作者承诺永不收费，👇🏻 下面这是 tts-vue 的界面：
- ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-03-16.png)
- Q：从哪知道 tts-vue 的？
  - A：网友评论。
  - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-04-05.png)
- **相关链接**：
  - tts-vue 官网：https://loker-page.lgwawork.com/home.html
  - tts-vue 下载链接：https://gitee.com/LGW_space/tts-vue/releases/ gitee
  - tts-vue 作者 github 首页：https://github.com/LokerL
- **基本原理**：
  - 今儿 `23.06.28` 上 github 上拉了下源码，看了下其中的 API 模块（感觉封装的有些奇怪），联系到作者，了解到这玩意儿实际上对接的是 [微软语音服务体验版](https://speech.microsoft.com/audiocontentcreation)，实际上是在此基础上套了一层。
  - ![图 4](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-09-51.png)
  - 和作者沟通过，猜测是由于微软官方对体验的接口添加一些限制，导致时不时会出现转换失败的报错，当用户量上去后，访问频率变高，此时往往会出现 `429` 错误。而这个错误，现阶段暂未想到解决方案。
  - ![图 5](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-10-24.png)

## 5. 📒 KanTTS 克隆声音

<BilibiliOutsidePlayer id="BV1Ch4y1Z7K6" />

- 在视频发布后，当天晚上查到了这么一个工具：KanTTS。
- 这个视频时长很短，也就 3min 左右，自行查阅视频了解该工具的功能即可。
- 条件允许的小伙伴可自行训练自个儿喜欢的声音。

> 目前还没去玩过克隆声音，距离视频发布也过去小几年了，现在很可能还有其他更优解，有这方面需求的时候再去找找相关的工具。

## 6. 📒 vocalremover 音频在线合成工具

- vocalremover
  - https://vocalremover.org/zh/joiner
  - 功能蛮多的，比如可以将多个音频文件合并为一个。
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-05-59.png)

## 7. 🤔 Q&A

### 7.1. 🤔 问：在语雀中插入音频资源，可以在线播放吗？

- 答：
  - 若文档公开的话，不允许 ❌
  - 若文档未公开，允许 ✅
- 咨询语雀官方人员得到的回复
  - 官方表示，因版权问题，公开的音频资源无法在文档中在线播放。
  - ![图 6](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-13-18.png)
  - 如果文章公开，那么音频资源将无法直接在语雀文档中播放，类似下图这种效果：
    - ![图 7](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-14-19.png)
  - 如果不将文档公开，音频资源支持在线播放，类似下图这样的效果：
    - ![图 8](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-14-33.png)

### 7.2. 🤔 问：TTSmaker 能不能读小说？

- ![图 9](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-15-07.png)
- 很不错的 idea，我刚接触 TTS 类工具的时候没有这方面的想法。实际测试下来，结果还不错！
  - 转换耗时：还行
  - 音频效果：还行

### 7.3. 🤔 问：py 的 egg 语音模块？（知识盲区）

- ![图 10](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-16-28.png)
- 技术栈还没扩展到 python，等开始肝 python 之后，去了解一下这位网友提到的 egg 语音模块。到时候看看是否有办法将其集成到桌面应用（Electron）中，如果这玩意儿做不了的话，whisper 可能可以做。

### 7.4. 🤔 问：录制使用 AI 快速创作视频的教程，初衷是什么？

- 视频的创作背景 - B 站搜 `“代价是拒绝所有社交”`
  - ![图 12](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-19-00.png)
- 个人的心路历程
  - 一，感觉这个东西很简单
  - 二，感觉有一波人要利用卖这个信息差来捞钱了
  - 三，我好像是 UP 主，为什么不录制个视频教大家咋做呢
  - 四，录视频去
- 聊天记录截图
  - ![图 11](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-04-20-18-26.png)
  - 按照播放量排序，点进第一个视频，在置顶的评论中会有一个链接，点进去之后会有一个微信二维码，扫码即可添加到对应人员的微信。
  - -\_-|| 我当时是得多闲啊……（现在时间：`2025 年 5 月 4 日 20:19:38`）
