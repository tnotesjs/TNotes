# [0105. background](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0105.%20background)

<!-- region:toc -->

- [1. ⏰ background-* 忘记哪个就找些 demo 来看看，并汇总到 demos.* 中。](#1--background--忘记哪个就找些-demo-来看看并汇总到-demos-中)
- [2. 💻 demos.1 - 使用 background-image 设置背景](#2--demos1---使用-background-image-设置背景)

<!-- endregion:toc -->
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

## 1. ⏰ background-* 忘记哪个就找些 demo 来看看，并汇总到 demos.* 中。

## 2. 💻 demos.1 - 使用 background-image 设置背景

```html
<!-- 
background-color: transparent;
本 demo 中的 background-color: transparent; 写或者不写效果都是一样的。
背景色默认值就是 transparent，表示没有背景颜色，即透明背景，这时候会显示背景图片。

背景图可以放一张图片，也可以放多张图片。
background-image: url("mdn_logo_only_color.png");
background-image: url("star-transparent.gif"), url("cat-front.png");
-->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>demos.1</title>
    <style>
      p {
        font-weight: bold;
        font-size: 1.5em;
        color: white;
        text-shadow: 0.07em 0.07em 0.05em black;
        background-image: none;
        background-color: transparent;
      }

      div {
        background-image: url("mdn_logo_only_color.png");
      }

      .cats-and-stars {
        background-image: url("star-transparent.gif"), url("cat-front.png");
        background-color: transparent;
      }
    </style>
  </head>
  <body>
    <div>
      <p class="cats-and-stars">
        This paragraph is full of cats<br />and stars.
      </p>
      <p>This paragraph is not.</p>
      <p class="cats-and-stars">
        Here are more cats for you.<br />Look at them!
      </p>
      <p>And no more.</p>
    </div>
  </body>
</html>
```

- ![](assets/2024-12-03-15-23-27.png)
