# [0007. WeRead 微信读书辅助工具](https://github.com/Tdahuyou/pc/tree/main/0007.%20WeRead%20%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7)

<!-- region:toc -->


- [bilibili.pc.0007.1](https://www.bilibili.com/video/BV1Ds4y1W7mq)、[bilibili.pc.0007.2](https://www.bilibili.com/video/BV1sZ421p7fW)
- [1. ⏰ 发布一个 chrome 插件版，并优化代码结构，重新录制介绍视频，将早期的视频给下架掉。](#1--发布一个-chrome-插件版并优化代码结构重新录制介绍视频将早期的视频给下架掉)
- [2. 📺 bilibili](#2--bilibili)
- [3. 🔗 Pack - tw93 大佬的 github 开源项目](#3--pack---tw93-大佬的-github-开源项目)
- [4. 🔗 桌面版 we-read 实现源码见笔记 —— electron.0044](#4--桌面版-we-read-实现源码见笔记--electron0044)
- [5. 📒 脚本功能说明](#5--脚本功能说明)
- [6. 📒 测试设备（键盘）说明](#6--测试设备键盘说明)
- [7. 💻 微信读书脚本](#7--微信读书脚本)
- [8. 💻 使用 scripty 脚本注入插件来自动运行脚本](#8--使用-scripty-脚本注入插件来自动运行脚本)
- [9. 💻 微信读书桌面版的实现](#9--微信读书桌面版的实现)
  - [9.1. 解决 macos 安装报错问题](#91-解决-macos-安装报错问题)
  - [9.2. 记录开发微信读书桌面版时的桌面环境](#92-记录开发微信读书桌面版时的桌面环境)
- [10. 🤔 问：为什么要写微信读书桌面版？](#10--问为什么要写微信读书桌面版)
- [11. 🤔 问：微信读书脚本如何使用？](#11--问微信读书脚本如何使用)
- [12. 🤔 问：为什么想到要写这个脚本？](#12--问为什么想到要写这个脚本)
<!-- endregion:toc -->
- 本节内容概述：
  - WeRead 辅助脚本
  - scripty 脚本注入工具
  - 微信读书桌面版

## 1. ⏰ 发布一个 chrome 插件版，并优化代码结构，重新录制介绍视频，将早期的视频给下架掉。

## 2. 📺 bilibili

- https://www.bilibili.com/video/BV1Ds4y1W7mq
  - 微信读书 | 优化记录操作 の 工具分享「网页版」
  - 介绍了微信读书脚本的功能，以及如何使用脚本。
- https://www.bilibili.com/video/BV1sZ421p7fW
  - 微信读书桌面版（网页套壳）
  - 内容概述：
    - 演示如何安装 macos 安装包
    - 演示脚本的功能
    - 其他一些不重要的信息 …… 个人写代码时的外界环境记录

## 3. 🔗 Pack - tw93 大佬的 github 开源项目

- https://github.com/tw93/Pake
  - 这是早期 `23-02-05` 视频中提到的微信读书桌面版下载地址，这个桌面应用程序是基于 pack 来实现的，其中一个很明显的特点是轻量（包体积很小）。

## 4. 🔗 桌面版 we-read 实现源码见笔记 —— electron.0044

- https://github.com/Tdahuyou/electron/tree/main
  - 微信读书桌面版的源码已上传到 github 上，这是对应 electron 笔记仓库的链接。

## 5. 📒 脚本功能说明

| **快捷键**                       | **功能说明**         | **备注**                   |
| -------------------------------- | -------------------- | -------------------------- |
| `1`                              | 复制                 | 在打开编写想法的弹窗时无效 |
| `2`                              | 马克笔               | 在打开编写想法的弹窗时无效 |
| `3`                              | 波浪线               | 在打开编写想法的弹窗时无效 |
| `4`                              | 直线                 | 在打开编写想法的弹窗时无效 |
| `5`                              | 写想法               | 在打开编写想法的弹窗时无效 |
| `6`                              | 查询                 | 在打开编写想法的弹窗时无效 |
| `esc`                            | 关闭编辑想法的弹窗   |                            |
| `backspace`                      | 删除下划线、删除想法 | 在打开编写想法的弹窗时无效 |
| `ctrl + enter`、`cmd + enter` | 发表想法             |                            |

## 6. 📒 测试设备（键盘）说明

- 目前使用的是 MX Keys Mini 键盘，这是一款非全尺寸键盘，键盘外观如下：
- ![](assets/2024-12-13-15-59-20.png)
- 视频中介绍的所有操作，都是基于当前这个键盘来操作的，有些朋友使用的也许是全尺寸键盘，全尺寸键盘的按键会相对多一些，按侧边的这些数字键也是等效的。
- 下面这是全尺寸键盘，实际上在按下数字键的时候，按上边儿的数字和下边儿的数字效果都是一样的。
- ![](assets/2024-12-13-16-00-08.png)

## 7. 💻 微信读书脚本

```javascript
console.log('weread script called');


document.onmouseup = () => {
  const toolbarContainer = document.querySelector('.reader_toolbar_container');

  if (!toolbarContainer) return; // 未出现工具栏

  let copyBtn = document.querySelector('.toolbarItem.wr_copy'), // 复制按钮
    underlineBgBtn = document.querySelector('.toolbarItem.underlineBg'), // 马克笔按钮
    underlineHandWriteBtn = document.querySelector('.toolbarItem.underlineHandWrite'), // 波浪线按钮
    underlineStraightBtn = document.querySelector('.toolbarItem.underlineStraight'), // 直线按钮
    removeUnderlineBtn = document.querySelector('.toolbarItem.removeUnderline'), // 删除划线按钮
    reviewBtn = document.querySelector('.toolbarItem.review'), // 写想法按钮
    queryBtn = document.querySelector('.toolbarItem.query'), // 查询按钮
    submitIdeaBtn = document.querySelector('.writeReview_submit_button.wr_btn.wr_btn_Big'), // 发表想法按钮
    removeIdeaBtn = document.querySelector('.readerReviewDetail_item .actions .actionItem'), // 删除想法按钮
    closeIdeaBtn = document.querySelector('.readerWriteReviewPanel .closeButton'); // 关闭想法窗口按钮

  document.onkeydown = (e) => {
    const isCmdBtnPressed = e.metaKey, // 是否按下了 cmd 键
      isCtrlBtnPressed = e.ctrlKey; // 是否按下了 ctrl 键

    const keyCode = e.keyCode;

    console.log('keyCode: ', keyCode);

    if (keyCode === 49) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 1 复制');
      copyBtn && copyBtn.click();
    } else if (keyCode === 50) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 2 马克笔');
      underlineBgBtn && underlineBgBtn.click();
    } else if (keyCode === 51) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 3 波浪线');
      underlineHandWriteBtn && underlineHandWriteBtn.click();
    } else if (keyCode === 52) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 4 直线');
      underlineStraightBtn && underlineStraightBtn.click();
    } else if (keyCode === 53) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 5 写想法');
      reviewBtn && reviewBtn.click();
      e.preventDefault();
    } else if (keyCode === 54) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 6 查询');
      queryBtn && queryBtn.click();
    } else if (keyCode === 8) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 backspace 删除记录（包括想法的删除和下划线的删除）');
      // 删除按钮在鼠标抬起的那一刻，可能还没生成
      removeUnderlineBtn = document.querySelector('.toolbarItem.removeUnderline');
      removeUnderlineBtn && removeUnderlineBtn.click();

      removeIdeaBtn = document.querySelector('.readerReviewDetail_item .actions .actionItem');
      removeIdeaBtn && removeIdeaBtn.click();
    } else if ((isCmdBtnPressed && keyCode === 13 || isCtrlBtnPressed && keyCode === 13)) {
      console.log('按下 cmd + enter | ctrl + enter 提交想法');
      submitIdeaBtn = document.querySelector('.writeReview_submit_button.wr_btn.wr_btn_Big');
      submitIdeaBtn && submitIdeaBtn.click();
    } else if (keyCode === 27) {
      if (!isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 esc 关闭想法记录窗口');
      closeIdeaBtn = document.querySelector('.readerWriteReviewPanel .closeButton'); // 关闭想法窗口按钮
      closeIdeaBtn.click();
    }
  };

  /* help info
  按下 cmd：e.metaKey === true 或 e.keyCode === 91
  按下 ctrl：e.ctrlKey === true 或 e.keyCode === 17
  按下 backspace：e.keyCode === 8
  按下 enter：e.keyCode === 13
  按下 esc：e.keyCode === 27
  按下 1：e.keyCode === 49
  按下 2：e.keyCode === 50
  按下 3：e.keyCode === 51
  按下 4：e.keyCode === 52
  按下 5：e.keyCode === 53
  按下 6：e.keyCode === 54
  */
}

/**
 * 记录想法的弹窗是否可见
 * @returns Boolean
 */
function isVisible_ReaderWriteReviewPanel() {
  const dom = document.querySelector('.readerWriteReviewPanel');
  if (!dom) return false;
  return dom.style.display === 'none' ? false : true;
}
```

## 8. 💻 使用 scripty 脚本注入插件来自动运行脚本

scripty 具体如何使用，可以参考 pc.0004 笔记的介绍。

## 9. 💻 微信读书桌面版的实现

**【启动流程】**

1. `git clone https://github.com/Tdahuyou/electron.git` 克隆代码，编号切到 0044 目录
2. `npm i` 安装依赖
3. `npm run dev` 启动开发环境
4. `npm run build` 出包

**【核心源码】**

- index.js

```javascript
const { app, BrowserWindow } = require('electron')
const { join } = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  win.loadURL('https://weread.qq.com/')
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})
```

- preload.js
  - 就是上面提到的微信读书脚本。

```javascript
console.log('weread script called');

document.onmouseup = () => {
  const toolbarContainer = document.querySelector('.reader_toolbar_container');

  if (!toolbarContainer) return; // 未出现工具栏

  let copyBtn = document.querySelector('.toolbarItem.wr_copy'), // 复制按钮
    underlineBgBtn = document.querySelector('.toolbarItem.underlineBg'), // 马克笔按钮
    underlineHandWriteBtn = document.querySelector('.toolbarItem.underlineHandWrite'), // 波浪线按钮
    underlineStraightBtn = document.querySelector('.toolbarItem.underlineStraight'), // 直线按钮
    removeUnderlineBtn = document.querySelector('.toolbarItem.removeUnderline'), // 删除划线按钮
    reviewBtn = document.querySelector('.toolbarItem.review'), // 写想法按钮
    queryBtn = document.querySelector('.toolbarItem.query'), // 查询按钮
    submitIdeaBtn = document.querySelector('.writeReview_submit_button.wr_btn.wr_btn_Big'), // 发表想法按钮
    removeIdeaBtn = document.querySelector('.readerReviewDetail_item .actions .actionItem'), // 删除想法按钮
    closeIdeaBtn = document.querySelector('.readerWriteReviewPanel .closeButton'); // 关闭想法窗口按钮

  document.onkeydown = (e) => {
    const isCmdBtnPressed = e.metaKey, // 是否按下了 cmd 键
      isCtrlBtnPressed = e.ctrlKey; // 是否按下了 ctrl 键

    const keyCode = e.keyCode;

    console.log('keyCode: ', keyCode);

    if (keyCode === 49) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 1 复制');
      copyBtn && copyBtn.click();
    } else if (keyCode === 50) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 2 马克笔');
      underlineBgBtn && underlineBgBtn.click();
    } else if (keyCode === 51) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 3 波浪线');
      underlineHandWriteBtn && underlineHandWriteBtn.click();
    } else if (keyCode === 52) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 4 直线');
      underlineStraightBtn && underlineStraightBtn.click();
    } else if (keyCode === 53) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 5 写想法');
      reviewBtn && reviewBtn.click();
      e.preventDefault();
    } else if (keyCode === 54) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 6 查询');
      queryBtn && queryBtn.click();
    } else if (keyCode === 8) {
      if (isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 backspace 删除记录（包括想法的删除和下划线的删除）');
      // 删除按钮在鼠标抬起的那一刻，可能还没生成
      removeUnderlineBtn = document.querySelector('.toolbarItem.removeUnderline');
      removeUnderlineBtn && removeUnderlineBtn.click();

      removeIdeaBtn = document.querySelector('.readerReviewDetail_item .actions .actionItem');
      removeIdeaBtn && removeIdeaBtn.click();
    } else if ((isCmdBtnPressed && keyCode === 13 || isCtrlBtnPressed && keyCode === 13)) {
      console.log('按下 cmd + enter | ctrl + enter 提交想法');
      submitIdeaBtn = document.querySelector('.writeReview_submit_button.wr_btn.wr_btn_Big');
      submitIdeaBtn && submitIdeaBtn.click();
    } else if (keyCode === 27) {
      if (!isVisible_ReaderWriteReviewPanel()) return;
      console.log('按下 esc 关闭想法记录窗口');
      closeIdeaBtn = document.querySelector('.readerWriteReviewPanel .closeButton'); // 关闭想法窗口按钮
      closeIdeaBtn.click();
    }
  };

  /* help info
  按下 cmd：e.metaKey === true 或 e.keyCode === 91
  按下 ctrl：e.ctrlKey === true 或 e.keyCode === 17
  按下 backspace：e.keyCode === 8
  按下 enter：e.keyCode === 13
  按下 esc：e.keyCode === 27
  按下 1：e.keyCode === 49
  按下 2：e.keyCode === 50
  按下 3：e.keyCode === 51
  按下 4：e.keyCode === 52
  按下 5：e.keyCode === 53
  按下 6：e.keyCode === 54
  */
}

/**
 * 记录想法的弹窗是否可见
 * @returns Boolean
 */
function isVisible_ReaderWriteReviewPanel() {
  const dom = document.querySelector('.readerWriteReviewPanel');
  if (!dom) return false;
  return dom.style.display === 'none' ? false : true;
}
```

### 9.1. 解决 macos 安装报错问题

- macos 报错 - “weread-helper” 已损坏
  - ![](assets/2024-12-13-16-21-33.png)
- 将 weread-helper 丢到应用程序 Applications 目录中
- 执行命令解决报错问题
  - `sudo xattr -rd com.apple.quarantine /Applications/weread-helper.app`
  - 通过执行这条命令，即可解决安装时的错误问题。

### 9.2. 记录开发微信读书桌面版时的桌面环境

- ![](assets/2024-12-13-16-07-26.png)
- 右边是我家的 we，已经 1 岁了，巨社恐～
- 桌面番茄钟从 30 开始倒计时，写完出包时还剩 10min，比想象得快了好多……

## 10. 🤔 问：为什么要写微信读书桌面版？

- 以下是一些网友的在视频中的一些评论。
  - ![](assets/2024-12-13-16-12-58.png)
  - ![](assets/2024-12-13-16-13-41.png)
  - ![](assets/2024-12-13-16-14-34.png)
  - ![](assets/2024-12-13-16-14-45.png)

## 11. 🤔 问：微信读书脚本如何使用？

- 这里记录的是一些历史问题，在 24.06.02 做了一个桌面版的工具，可以直接下载桌面版来使用，脚本已经注入到程序中了，只需要安装即可使用。
- 问题背景：
  - ![](assets/2024-12-13-16-17-50.png)
  - ![](assets/2024-12-13-16-17-58.png)
  - ![](assets/2024-12-13-16-18-05.png)
- ![](assets/2024-12-13-16-18-23.png)
  - 大概率是因为快捷方式冲突导致的，这种情况可以尝试换一个环境再试试看。

## 12. 🤔 问：为什么想到要写这个脚本？

在使用网页版的微信读书时，很多时候想要发表想法时，会碍于操作成本太高而放弃记录 📝 的行为。心想，如果有对应的快捷键就好了，这样记录的话就会方便很多，便给官方提了建议。隔天觉得官方可能不会采纳亦或者压根就看不到这条建议，而自己又急着用，想着自己好像也能实现，于是就 ……

![](assets/2024-12-13-15-45-18.png)

![](assets/2024-12-13-15-45-35.png)

问题描述：

在 [微信读书的网页端](https://weread.qq.com/) 读书时，遇到了一个问题 —— 记录成本太高，影响阅读节奏。（尤其是在竖屏的情况下浏览）
