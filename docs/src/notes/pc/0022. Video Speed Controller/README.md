# [0022. Video Speed Controller](https://github.com/Tdahuyou/pc/tree/main/0022.%20Video%20Speed%20Controller)

<!-- region:toc -->
- [1. 📒 Video Speed Controller 是什么](#1--video-speed-controller-是什么)
- [2. 📒 Video Speed Controller 主要功能](#2--video-speed-controller-主要功能)
- [3. 📒 Chrome 用户如何安装 Video Speed Controller](#3--chrome-用户如何安装-video-speed-controller)
- [4. 📒 常用快捷键](#4--常用快捷键)
- [5. 📒 测试对 B 站视频的支持](#5--测试对-b-站视频的支持)
<!-- endregion:toc -->

## 1. 📒 Video Speed Controller 是什么

- **Video Speed Controller** 是一款 **Chrome 和 Edge 浏览器扩展**，用于控制 HTML5 视频的播放速度。它适用于 B 站、YouTube、Netflix、Twitter 等大多数网页播放器，让用户可以自由加速、减速、快进或后退视频。

## 2. 📒 Video Speed Controller 主要功能

- **调整播放速度**：
  - 支持 **加速（默认 D 键）** 和 **减速（默认 S 键）**，最小可调到 0.1 倍速，最大可超过 16 倍速（具体上限取决于浏览器支持）。
  - 可以 **自定义每次调整的速度步长**（默认 0.1x）。
- **倒退/快进**：
  - 通过快捷键 **Z（倒退）/ X（快进）**，可以快速跳过或回看某个片段。
- **自动保存倍速**：
  - 观看不同视频时，扩展会记住你上次的速度设置，避免每次手动调整。
- **隐藏控制面板**：
  - 默认情况下，播放器上会显示一个 **透明的倍速控制器**，可以手动隐藏或更改外观。
- **兼容大部分 HTML5 视频**：
  - 适用于 **Bilibili、YouTube、Netflix、Twitch、Twitter、Facebook、百度网盘等网站**。
  - **注意**：部分网站（如爱奇艺、腾讯视频等）可能因为 DRM 保护而无法生效。

## 3. 📒 Chrome 用户如何安装 Video Speed Controller

- **访问 Chrome 商店**：[Video Speed Controller](https://chrome.google.com/webstore/detail/video-speed-controller/nffaoalbilbmmfgbnbgppjihopabppdk)
- ![](assets/2025-02-03-19-45-27.png)
- **Firefox 用户**：可以尝试类似扩展，比如 **"Video Speed Up"**。

## 4. 📒 常用快捷键

| 功能            | 快捷键  | 说明 |
|---------------|--------|-----|
| **加速**      | `D`    | 每次 +0.1 倍速 |
| **减速**      | `S`    | 每次 -0.1 倍速 |
| **恢复正常速度** | `R`    | 直接恢复 1.0x |
| **快进 10 秒** | `X`    | 跳过 10 秒 |
| **倒退 10 秒** | `Z`    | 回退 10 秒 |
| **隐藏面板**   | `V`    | 隐藏 / 显示 UI |

## 5. 📒 测试对 B 站视频的支持

- **B 站站内播放**
  - B 站自带倍速调节功能，可直接使用。不过调节的粒度比较大，目前（2025 年 2 月 3 日 19:33:14）支持的倍速有：0.5x、0.75x、1.0x、1.25x、1.5x、1.75x、2.0x。
    - ![](assets/2025-02-03-19-33-02.png)
  - 如果使用 **Video Speed Controller**，可以更细粒度（0.1）的控制视频的播放倍速。
- **站外播放（嵌入播放器）**
  - B 站播放器 **默认不支持倍速**，但 **Video Speed Controller 依旧可以正常使用**。（只要 B 站的嵌入视频是 HTML5 格式）
  - 对于 TNotes 中嵌入的 B 站视频，实测过是可以正常使用的。
  - 对于 **Bilibili 站外播放无法倍速** 的问题，Video Speed Controller 是一个有效的解决方案。只需安装扩展并使用快捷键，就可以自由调节视频速度，无需 B 站官方支持！