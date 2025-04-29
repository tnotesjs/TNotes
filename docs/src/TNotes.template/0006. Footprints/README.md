# [0006. Footprints](https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0006.%20Footprints)

<!-- region:toc -->

- [1. 💻 足迹功能](#1--足迹功能)

<!-- endregion:toc -->

## 1. 💻 足迹功能

- 参照微信朋友圈的布局，自定义的一个用于记录个人动态的组件。
- 参数传递还有待优化。
- 格式：

```md
🗓 3-15

<Footprints :times="[2025, 3, 15, 0, 43]">
  <template #text-area>
    <p>正在整理 TNotes.template 的功能文档</p>
    <p>现在外边正下着小于雨 🌧️</p>
    <p>不早了</p>
    <p>写完这篇笔记就去睡觉了～</p>
    <p>头发要紧</p>
  </template>
  <template #image-list="{ openModal }">
    <img src="./assets/1.png" @click="openModal(0)"/>
    <img src="./assets/2.png" @click="openModal(1)"/>
    <img src="./assets/3.png" @click="openModal(2)"/>
    <img src="./assets/4.jpg" @click="openModal(3)"/>
    <img src="./assets/logo.png" @click="openModal(4)"/>
  </template>
</Footprints>
```

- 最终渲染效果：

🗓 3-15

<Footprints :times="[2025, 3, 15, 0, 43]">
  <template #text-area>
    <p>正在整理 TNotes.template 的功能文档</p>
    <p>现在外边正下着小于雨 🌧️</p>
    <p>不早了</p>
    <p>写完这篇笔记就去睡觉了～</p>
    <p>头发要紧</p>
  </template>
  <template #image-list="{ openModal }">
    <img src="./assets/1.png" @click="openModal(0)"/>
    <img src="./assets/2.png" @click="openModal(1)"/>
    <img src="./assets/3.png" @click="openModal(2)"/>
    <img src="./assets/4.jpg" @click="openModal(3)"/>
    <img src="./assets/logo.png" @click="openModal(4)"/>
  </template>
</Footprints>
