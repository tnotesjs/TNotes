# [0039. 语雀网页脚本](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0039.%20%E8%AF%AD%E9%9B%80%E7%BD%91%E9%A1%B5%E8%84%9A%E6%9C%AC)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 简化语雀 Web 端编辑窗口的脚本](#2--简化语雀-web-端编辑窗口的脚本)
- [3. 💻 小记全屏切换](#3--小记全屏切换)
- [4. 💻 code block 批操作（❌ Deprecated）](#4--code-block-批操作-deprecated)

<!-- endregion:toc -->

## 1. 📝 概述

- 记录了一些自己写的在语雀网页端的脚本。

## 2. 💻 简化语雀 Web 端编辑窗口的脚本

- 当时写这个功能，主要是为了在录制视频的时候，去掉文档头部的这些操作按钮栏。
- `2025 年 5 月 6 日 02:28:43` 在这个时间点自测了一下，发下还能正常使用。
  - PS：昨儿 `20:30` 就睡了，然后 `1:30` 醒来……
- 在语雀网页端预览文档时，你可以通过快捷键 `E` 进入编辑模式，但是编辑时的头部信息如果并不需要，那么可以通过上述脚本隐藏头部信息。
  - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-06-02-32-34.png)
- 若文章编辑完毕，可以按下 `Cmd + Enter` 来发布文章，亦或者按下 `Cmd + R` 重新加载文章。

::: code-group

```js [脚本源码]
;(() => {
  // doc top
  document.querySelector('#header').style.display = 'none'
  document.querySelector('#ne-toolbar-container').style.display = 'none'
  document.querySelector('[data-testid="content"]').style.paddingTop = 0

  // doc bottom
  document.querySelector('#commonEditPage').style.height = '100vh'

  // toc top
  document.querySelector(
    '.lark.lark-layout-read-write .ne-toc-sidebar'
  ).style.top = '0'
})()
```

:::

## 3. 💻 小记全屏切换

- 小记页面：https://www.yuque.com/dashboard/notes
- 最终效果：
  - 将侧边栏隐藏，提供更大的写作空间。
  - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-06-02-38-06.png)

::: code-group

```js [切换全屏模式]
;(() => {
  // 编辑区域
  const editor = document.querySelector('.ne-editor')
  // 侧边栏
  const side = document.querySelector('#dragBarContainer')

  if (window._isNotesEditorFullScreen) {
    editor.style = {}

    side.style.display = ''

    window._isNotesEditorFullScreen = false
  } else {
    editor.style.width = '100vw'
    editor.style.height = '100vh'
    editor.style.position = 'fixed'
    editor.style.top = 0
    editor.style.left = 0

    side.style.display = 'none'

    window._isNotesEditorFullScreen = true
  }
})()
```

```js [在页面上添加一个切换全屏的按钮]
;(() => {
  const button = document.createElement('button')
  button.innerHTML = '切换全屏'
  button.addEventListener('click', () => {
    // 编辑区域
    const editor = document.querySelector('.ne-editor')
    // 侧边栏
    const side = document.querySelector('#dragBarContainer')

    if (window._isNotesEditorFullScreen) {
      editor.style = {}

      side.style.display = ''

      window._isNotesEditorFullScreen = false
    } else {
      editor.style.width = '100vw'
      editor.style.height = '100vh'
      editor.style.position = 'fixed'
      editor.style.top = 0
      editor.style.left = 0

      side.style.display = 'none'

      window._isNotesEditorFullScreen = true
    }
  })

  // style
  button.style.width = '3rem'
  button.style.height = '3rem'
  button.style.borderRadius = '50%'
  button.style.border = 'none'
  button.style.background = 'lightblue'
  button.style.color = 'white'
  button.style.cursor = 'pointer'
  button.style.position = 'fixed'
  button.style.top = '4rem'
  button.style.right = '2rem'
  button.style.zIndex = 9999
  button.style.opacity = 0.8

  document.body.appendChild(button)
})()
```

:::

## 4. 💻 code block 批操作（❌ Deprecated）

- ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-06-02-24-46.png)
- 早期版本的语雀代码块是没有这两个选项的，一边给语雀提反馈，一边自己撸了点儿脚本…… 可能是反馈被采纳了，现在这个脚本暂时也没必要了。
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-06-02-50-55.png)

::: code-group

```js [关闭所有 code block 的行号和自动换行]
;(() => {
  // 获取所有 codeblocks
  const codeblocks = document.querySelectorAll('.ne-codeblock')

  const opts = { bubbles: true, cancelable: true, view: window }
  const mousedownEvent = new MouseEvent('mousedown', opts)
  // const mouseupEvent = new MouseEvent("mouseup", opts)
  // const clickEvent = new MouseEvent("click", opts)
  // const mouseOverEvent = new MouseEvent("mouseover", opts)
  // const mouseEnterEvent = new MouseEvent("mouseenter", opts)

  // codeblocks[0].addEventListener("mousedown", function () {
  //   console.log("Mouse Enter Event Triggered!")
  // })

  codeblocks.forEach((codeblock, i) => {
    setTimeout(() => {
      // 聚焦 codeblock
      codeblock.dispatchEvent(mousedownEvent)
      setTimeout(() => {
        // 展开「更多」菜单
        document.querySelector('.ne-codeblock-more-button').click()
        // 关闭「行号」、「自动换行」
        setTimeout(() => {
          document
            .querySelectorAll('.ant-menu-item button[aria-checked="true"]')
            .forEach((btn) => btn.click())
        }, 300)
      }, 500)
    }, 1000 + i * 1000)
  })
})()
```

```js [批量更新 code block 的主题]
// 在编辑状态下，执行以下 JavaScript 脚本，会自动挨个点击当前文档中的每个 code block 实现主题切换。
;(() => {
  // 获取所有 codeblocks
  const codeblocks = document.querySelectorAll('.ne-codeblock')

  const opts = { bubbles: true, cancelable: true, view: window }
  const mousedownEvent = new MouseEvent('mousedown', opts)
  // const mouseupEvent = new MouseEvent("mouseup", opts)
  // const clickEvent = new MouseEvent("click", opts)
  // const mouseOverEvent = new MouseEvent("mouseover", opts)
  // const mouseEnterEvent = new MouseEvent("mouseenter", opts)

  // codeblocks[0].addEventListener("mousedown", function () {
  //   console.log("Mouse Enter Event Triggered!")
  // })

  codeblocks.forEach((codeblock, i) => {
    setTimeout(() => {
      // console.log(codeblock)
      // 聚焦 codeblock
      codeblock.dispatchEvent(mousedownEvent)
      setTimeout(() => {
        const selectors = document.querySelectorAll('.ant-select-selector')
        const theme_selectors = []
        for (let i = 0; i < selectors.length; i++) {
          const s = selectors[i]
          if (
            s.parentElement.getAttribute('data-testid') ===
            'ne-codeblock-theme-selector'
          ) {
            theme_selectors.push(s)
          }
        }

        // console.log('theme_selectors', theme_selectors)

        const theme_selector = theme_selectors[0]
        console.log('theme_selector', theme_selector)

        // 展开主题选择下拉列表
        theme_selector.dispatchEvent(mousedownEvent)
        // 选择 One Dark Pro 主题
        setTimeout(() => {
          document.querySelector('div[name="One Dark Pro"]').click()
        }, 300)
      }, 500)
    }, 1000 + i * 1000)
  })
})()
```

:::
