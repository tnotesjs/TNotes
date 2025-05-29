import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, renderToString } from "vue/server-renderer";
import { shallowRef, inject, computed, ref, watch, onUnmounted, reactive, markRaw, readonly, nextTick, defineComponent, h, toRaw, onMounted, mergeProps, useSSRContext, unref, watchEffect, watchPostEffect, onUpdated, resolveComponent, createVNode, resolveDynamicComponent, withCtx, renderSlot, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, defineAsyncComponent, provide, toHandlers, withKeys, onBeforeUnmount, useSlots, withDirectives, vShow, createSSRApp } from "vue";
import mermaid from "mermaid";
import { usePreferredDark, useDark, useMediaQuery, useWindowSize, onKeyStroke, useWindowScroll, useScrollLock } from "@vueuse/core";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { marked } from "marked";
const init = async (externalDiagrams) => {
  try {
    if (mermaid.registerExternalDiagrams)
      await mermaid.registerExternalDiagrams(externalDiagrams);
  } catch (e) {
    console.error(e);
  }
};
const render$1 = async (id, code, config) => {
  mermaid.initialize(config);
  const { svg } = await mermaid.render(id, code);
  return svg;
};
function deserializeFunctions(r) {
  return Array.isArray(r) ? r.map(deserializeFunctions) : typeof r == "object" && r !== null ? Object.keys(r).reduce((t, n) => (t[n] = deserializeFunctions(r[n]), t), {}) : typeof r == "string" && r.startsWith("_vp-fn_") ? new Function(`return ${r.slice(7)}`)() : r;
}
const siteData = deserializeFunctions(JSON.parse('{"lang":"zh-Hans","dir":"ltr","title":"TNotes","description":"TNotes","base":"/notes/","head":[],"router":{"prefetchLinks":false},"appearance":"dark","themeConfig":{"outline":{"label":"目录"},"search":{"provider":"local","options":{"miniSearch":{"options":{"tokenize":"_vp-fn_(text, language) => {\\n              if (language === \\"zh\\") {\\n                return text.match(/[\\\\u4e00-\\\\u9fa5]+|\\\\S+/g) || [];\\n              }\\n              return text.split(/\\\\s+/);\\n            }","processTerm":"_vp-fn_(term) => term.toLowerCase()"},"searchOptions":{"fuzzy":0.2,"prefix":true,"boost":{"title":10,"headings":5,"text":3,"code":1}}}}},"nav":[{"text":"👀 README","link":"/README"},{"text":"🚀 TNotes","items":[{"text":"🔨 TNotes 基本架构","link":"/tnotes/architecture"},{"text":"⚙️ TNotes 核心脚本功能简介","link":"/tnotes/scripts-introduction"},{"text":"💻 处理笨重的 git log 问题","link":"/tnotes/handle-git-log"},{"text":"💭 TNotes 评论模块（Discussions）的技术实现","link":"/tnotes/message-board"},{"text":"🔍 TNotes 中的 emoji 规范","link":"/tnotes/emoji"},{"text":"🤔 Q&A","link":"/tnotes/Q&A"},{"text":"🌍 其他开源作品","items":[{"text":"👀 README","link":"/open/README"},{"text":"🧑🏻‍💻 m2mm","link":"/open/m2mm"}]},{"text":"💭 Discussions","link":"/message-board"}]},{"text":"🧑🏻‍💻 About Me","items":[{"text":"👀 README","link":"/about-me/README"},{"text":"👣 我 の 动态","link":"https://tdahuyou.github.io/TNotes.footprints/"},{"text":"🐱 我家 の 神兽","link":"/about-me/we"},{"text":"✍️ 关于创作","link":"/about-me/creation"}]},{"text":"💰 Donate","link":"/donate"}],"sidebar":[{"text":"👀 README","link":"/README"},{"text":"template","link":"https://tdahuyou.github.io/TNotes.template/","collapsed":true,"items":[{"text":"1. 🚀 Quick Start","collapsed":true,"items":[{"text":"⏰ TNotes.template 简介","link":"/TNotes.template/0001. TNotes.template 简介/README"}]},{"text":"2. 📒 扩展 vitepress","collapsed":true,"items":[{"text":"✅ 公式","link":"/TNotes.template/0002. 公式/README"},{"text":"✅ mermaid 图表","link":"/TNotes.template/0003. mermaid 图表/README"},{"text":"✅ swiper","link":"/TNotes.template/0004. swiper/README"},{"text":"✅ BilibiliOutsidePlayer","link":"/TNotes.template/0005. BilibiliOutsidePlayer/README"},{"text":"✅ Footprints","link":"/TNotes.template/0006. Footprints/README"},{"text":"⏰ 新笔记","link":"/TNotes.template/0007. 新笔记/README"}]}]},{"text":"c-cpp","link":"https://tdahuyou.github.io/TNotes.c-cpp/","collapsed":true,"items":[{"text":"1. 学习环境搭建","collapsed":true,"items":[{"text":"✅ 在 win11 上搭建 C 的基本学习环境","link":"/TNotes.c-cpp/0001. 在 win11 上搭建 C 的基本学习环境/README"}]}]},{"text":"canvas","link":"https://tdahuyou.github.io/TNotes.canvas/","collapsed":true,"items":[{"text":"1. 自学 Canvas 时的一些参考资料","collapsed":true,"items":[{"text":"⏰ canvas 在线学习 - 菜鸟教程","link":"/TNotes.canvas/0056. canvas 在线学习 - 菜鸟教程/README"},{"text":"⏰ canvas 在线学习 - 掘金","link":"/TNotes.canvas/0052. canvas 在线学习 - 掘金/README"},{"text":"⏰ canvas 在线学习 - html5canvas tutorials","link":"/TNotes.canvas/0053. canvas 在线学习 - html5canvas tutorials/README"},{"text":"⏰ canvas 在线学习 - MDN Canvas tutorial","link":"/TNotes.canvas/0054. canvas 在线学习 - MDN Canvas tutorial/README"},{"text":"⏰ canvas 在线学习 - HTML Canvas Deep Dive","link":"/TNotes.canvas/0055. canvas 在线学习 - HTML Canvas Deep Dive/README"}]},{"text":"2. 基本概念","collapsed":true,"items":[{"text":"⏰ 认识 canvas 标签","link":"/TNotes.canvas/0001. 认识 canvas 标签/README"},{"text":"⏰ 判断浏览器是否支持 canvas","link":"/TNotes.canvas/0002. 判断浏览器是否支持 canvas/README"},{"text":"⏰ 区分 canvas 的 width、height 属性和 style 中设置的 width、height 值","link":"/TNotes.canvas/0003. 区分 canvas 的 width、height 属性和 style 中设置的 width、height 值/README"},{"text":"⏰ canvas 的默认尺寸 300 x 150","link":"/TNotes.canvas/0005. canvas 的默认尺寸 300 x 150/README"},{"text":"⏰ 使用 JSDoc 来标注 canvas 变量类型","link":"/TNotes.canvas/0006. 使用 JSDoc 来标注 canvas 变量类型/README"}]},{"text":"3. 绘图操作","collapsed":true,"items":[{"text":"⏰ 使用 ctx.clearRect 清除画布","link":"/TNotes.canvas/0004. 使用 ctx.clearRect 清除画布/README"},{"text":"⏰ 使用 ctx.fillRect 绘制矩形","link":"/TNotes.canvas/0018. 使用 ctx.fillRect 绘制矩形/README"},{"text":"⏰ 使用 ctx.strokeRect 绘制矩形","link":"/TNotes.canvas/0019. 使用 ctx.strokeRect 绘制矩形/README"},{"text":"⏰ 使用 ctx.roundRect 绘制圆角矩形","link":"/TNotes.canvas/0020. 使用 ctx.roundRect 绘制圆角矩形/README"},{"text":"⏰ 使用 ctx.rect 绘制矩形","link":"/TNotes.canvas/0021. 使用 ctx.rect 绘制矩形/README"},{"text":"⏰ 使用 ctx.arc 绘制圆弧","link":"/TNotes.canvas/0024. 使用 ctx.arc 绘制圆弧/README"},{"text":"⏰ 使用 ctx.ellipse 绘制椭圆","link":"/TNotes.canvas/0026. 使用 ctx.ellipse 绘制椭圆/README"},{"text":"⏰ 使用 ctx.arcTo 绘制圆弧","link":"/TNotes.canvas/0027. 使用 ctx.arcTo 绘制圆弧/README"},{"text":"⏰ 使用 ctx.drawImage 引入图像","link":"/TNotes.canvas/0035. 使用 ctx.drawImage 引入图像/README"},{"text":"⏰ 使用 ctx.createConicGradient 实现锥形渐变效果","link":"/TNotes.canvas/0040. 使用 ctx.createConicGradient 实现锥形渐变效果/README"},{"text":"⏰ 使用 ctx.createLinearGradient 实现线性渐变效果","link":"/TNotes.canvas/0041. 使用 ctx.createLinearGradient 实现线性渐变效果/README"},{"text":"⏰ 使用 ctx.createRadialGradient 实现径向渐变效果","link":"/TNotes.canvas/0042. 使用 ctx.createRadialGradient 实现径向渐变效果/README"},{"text":"⏰ 给图像添加阴影","link":"/TNotes.canvas/0043. 给图像添加阴影/README"},{"text":"⏰ 使用 ctx.filter 实现滤镜效果","link":"/TNotes.canvas/0044. 使用 ctx.filter 实现滤镜效果/README"}]},{"text":"4. 路径和形状","collapsed":true,"items":[{"text":"⏰ 使用 ctx.closePath 闭合路径","link":"/TNotes.canvas/0022. 使用 ctx.closePath 闭合路径/README"},{"text":"⏰ 使用 ctx.beginPath 方法对路径进行分组","link":"/TNotes.canvas/0023. 使用 ctx.beginPath 方法对路径进行分组/README"},{"text":"⏰ 使用 ctx.quadraticCurveTo、ctx.bezierCurveTo 绘制贝塞尔曲线","link":"/TNotes.canvas/0025. 使用 ctx.quadraticCurveTo、ctx.bezierCurveTo 绘制贝塞尔曲线/README"}]},{"text":"5. 文本处理","collapsed":true,"items":[{"text":"⏰ 使用 ctx.fillText、ctx.strokeText 绘制文本","link":"/TNotes.canvas/0014. 使用 ctx.fillText、ctx.strokeText 绘制文本/README"},{"text":"⏰ 使用 ctx.font 设置字体样式","link":"/TNotes.canvas/0015. 使用 ctx.font 设置字体样式/README"},{"text":"⏰ 使用 ctx.textBaseline、ctx.textAlign 设置文本对齐方式","link":"/TNotes.canvas/0016. 使用 ctx.textBaseline、ctx.textAlign 设置文本对齐方式/README"}]},{"text":"6. 动画效果","collapsed":true,"items":[{"text":"⏰ 使用 ctx.save 和 ctx.restore 保存和恢复画布状态","link":"/TNotes.canvas/0007. 使用 ctx.save 和 ctx.restore 保存和恢复画布状态/README"},{"text":"⏰ 使用 ctx.lineCap 设置线条端点样式","link":"/TNotes.canvas/0008. 使用 ctx.lineCap 设置线条端点样式/README"},{"text":"⏰ 使用 ctx.lineDashOffset 设置虚线的偏移量","link":"/TNotes.canvas/0009. 使用 ctx.lineDashOffset 设置虚线的偏移量/README"},{"text":"⏰ 使用 ctx.setLineDash 设置虚线","link":"/TNotes.canvas/0010. 使用 ctx.setLineDash 设置虚线/README"},{"text":"⏰ 使用 ctx.miterLimit 约束两线相交处的最大倾斜长度","link":"/TNotes.canvas/0011. 使用 ctx.miterLimit 约束两线相交处的最大倾斜长度/README"},{"text":"⏰ 使用 ctx.lineTo 来绘制线条","link":"/TNotes.canvas/0012. 使用 ctx.lineTo 来绘制线条/README"},{"text":"⏰ 使用 ctx.lineJoin 设置线条连接处的样式","link":"/TNotes.canvas/0013. 使用 ctx.lineJoin 设置线条连接处的样式/README"},{"text":"⏰ 绘制网格","link":"/TNotes.canvas/0017. 绘制网格/README"},{"text":"⏰ 矩形边框旋转动画","link":"/TNotes.canvas/0028. 矩形边框旋转动画/README"},{"text":"⏰ 线条穿梭动画","link":"/TNotes.canvas/0029. 线条穿梭动画/README"},{"text":"⏰ 模拟进度条动画效果","link":"/TNotes.canvas/0030. 模拟进度条动画效果/README"},{"text":"⏰ 使用 ctx.rotate 实现图像旋转","link":"/TNotes.canvas/0045. 使用 ctx.rotate 实现图像旋转/README"},{"text":"⏰ 使用 ctx.scale 缩放绘制的图像","link":"/TNotes.canvas/0046. 使用 ctx.scale 缩放绘制的图像/README"},{"text":"⏰ 使用 ctx.transform 来转换图形","link":"/TNotes.canvas/0047. 使用 ctx.transform 来转换图形/README"},{"text":"⏰ 使用 ctx.translate 移动画布","link":"/TNotes.canvas/0048. 使用 ctx.translate 移动画布/README"},{"text":"⏰ 模拟烟花效果","link":"/TNotes.canvas/0049. 模拟烟花效果/README"},{"text":"⏰ 实现动态时钟效果","link":"/TNotes.canvas/0050. 实现动态时钟效果/README"},{"text":"⏰ 贪吃蛇小游戏","link":"/TNotes.canvas/0051. 贪吃蛇小游戏/README"}]},{"text":"7. 图像处理","collapsed":true,"items":[{"text":"⏰ 使用 ctx.clip 实现图像裁剪","link":"/TNotes.canvas/0031. 使用 ctx.clip 实现图像裁剪/README"},{"text":"⏰ 使用 ctx.createPattern 创建填充图案","link":"/TNotes.canvas/0032. 使用 ctx.createPattern 创建填充图案/README"},{"text":"⏰ 使用 ctx.drawImage 绘制视频图像","link":"/TNotes.canvas/0033. 使用 ctx.drawImage 绘制视频图像/README"},{"text":"⏰ 使用 ctx.drawImage 实现人物奔跑动画效果","link":"/TNotes.canvas/0034. 使用 ctx.drawImage 实现人物奔跑动画效果/README"},{"text":"⏰ 使用 ctx.getImageData、ctx.putImageData 实现图像的像素处理","link":"/TNotes.canvas/0036. 使用 ctx.getImageData、ctx.putImageData 实现图像的像素处理/README"},{"text":"⏰ 使用 ctx.globalCompositeOperation 处理图像合成","link":"/TNotes.canvas/0037. 使用 ctx.globalCompositeOperation 处理图像合成/README"},{"text":"⏰ 使用 ctx.globalCompositeOperation 实现刮刮乐效果","link":"/TNotes.canvas/0038. 使用 ctx.globalCompositeOperation 实现刮刮乐效果/README"},{"text":"⏰ 下载、使用 canvas 图像","link":"/TNotes.canvas/0039. 下载、使用 canvas 图像/README"}]}]},{"text":"change-log","link":"https://tdahuyou.github.io/TNotes.change-log/","collapsed":true,"items":[{"text":"1. 🗓 2025","collapsed":true,"items":[{"text":"⏰ 25.05","link":"/TNotes.change-log/0001. 25.05/README"},{"text":"✅ 25.04","link":"/TNotes.change-log/0002. 25.04/README"}]}]},{"text":"cooking","link":"https://tdahuyou.github.io/TNotes.cooking/","collapsed":true,"items":[{"text":"1. 😋 做饭","collapsed":true,"items":[{"text":"✅ 鸡翅","link":"/TNotes.cooking/0001. 鸡翅/README"},{"text":"✅ 绿豆汤","link":"/TNotes.cooking/0002. 绿豆汤/README"},{"text":"✅ 蛋羹","link":"/TNotes.cooking/0003. 蛋羹/README"},{"text":"✅ 蛋挞","link":"/TNotes.cooking/0004. 蛋挞/README"},{"text":"✅ 排骨汤","link":"/TNotes.cooking/0005. 排骨汤/README"}]}]},{"text":"egg","link":"https://tdahuyou.github.io/TNotes.egg/","collapsed":true,"items":[{"text":"1. 🚀 Quick Start","collapsed":true,"items":[{"text":"✅ egg 简介","link":"/TNotes.egg/0001. egg 简介/README"},{"text":"✅ Hello World 示例","link":"/TNotes.egg/0002. Hello World 示例/README"},{"text":"✅ egg-init vs. egg-bin","link":"/TNotes.egg/0003. egg-init vs. egg-bin/README"},{"text":"✅ egg-init 简介","link":"/TNotes.egg/0004. egg-init 简介/README"},{"text":"✅ egg-bin 简介","link":"/TNotes.egg/0005. egg-bin 简介/README"},{"text":"✅ 不借助脚手架实现 Hello World 示例","link":"/TNotes.egg/0006. 不借助脚手架实现 Hello World 示例/README"}]},{"text":"2. 核心功能","collapsed":true,"items":[{"text":"✅ 了解 Egg.js 核心功能模块都涵盖哪些内容","link":"/TNotes.egg/0016. 了解 Egg.js 核心功能模块都涵盖哪些内容/README"},{"text":"✅ app.locals 和 ctx.locals","link":"/TNotes.egg/0015. app.locals 和 ctx.locals/README"}]},{"text":"3. 基础功能","collapsed":true,"items":[{"text":"✅ 了解 Egg.js 基础功能模块都涵盖哪些内容","link":"/TNotes.egg/0007. 了解 Egg.js 基础功能模块都涵盖哪些内容/README"},{"text":"✅ 目录结构","link":"/TNotes.egg/0008. 目录结构/README"},{"text":"✅ 在 Controller 中获取上下文对象的两种方式","link":"/TNotes.egg/0009. 在 Controller 中获取上下文对象的两种方式/README"},{"text":"✅ egg-static","link":"/TNotes.egg/0010. egg-static/README"},{"text":"✅ egg 插件列表","link":"/TNotes.egg/0011. egg 插件列表/README"},{"text":"✅ 插件的启用","link":"/TNotes.egg/0012. 插件的启用/README"},{"text":"✅ 插件的配置","link":"/TNotes.egg/0013. 插件的配置/README"},{"text":"✅ 中间件","link":"/TNotes.egg/0014. 中间件/README"}]},{"text":"4. 分层设计","collapsed":true,"items":[{"text":"✅ 字段校验的分层设计","link":"/TNotes.egg/0017. 字段校验的分层设计/README"}]},{"text":"5. model 的引用","collapsed":true,"items":[{"text":"✅ ctx.model 和 app.model","link":"/TNotes.egg/0018. ctx.model 和 app.model/README"}]},{"text":"6. service 的引用","collapsed":true,"items":[{"text":"⏰ ctx.service 和 app.service","link":"/TNotes.egg/0020. ctx.service 和 app.service/README"}]},{"text":"7. Egg.js 中模块的命名解析细节","collapsed":true,"items":[{"text":"✅ Egg.js 中的 controller、service、model 模块命名解析策略","link":"/TNotes.egg/0019. Egg.js 中的 controller、service、model 模块命名解析策略/README"}]}]},{"text":"electron","link":"https://tdahuyou.github.io/TNotes.electron/","collapsed":true,"items":[{"text":"1. TNotes.electron 笔记简介","collapsed":true,"items":[{"text":"✅ TNotes.electron 笔记简介","link":"/TNotes.electron/0059. TNotes.electron 笔记简介/README"}]},{"text":"2. Electron 学习资源","collapsed":true,"items":[{"text":"✅ electron 源码仓库","link":"/TNotes.electron/0057. electron 源码仓库/README"},{"text":"✅ electron 官方文档","link":"/TNotes.electron/0058. electron 官方文档/README"},{"text":"✅ 《Electron 实战：入门、进阶与性能优化》","link":"/TNotes.electron/0050. 《Electron 实战：入门、进阶与性能优化》/README"},{"text":"✅ 掘金小册 - 《Electron 应用开发实践指南》","link":"/TNotes.electron/0051. 掘金小册 - 《Electron 应用开发实践指南》/README"},{"text":"✅ 掘金小册 - 《Electron + Vue 3 桌面应用开发》","link":"/TNotes.electron/0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》/README"},{"text":"✅ 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》","link":"/TNotes.electron/0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》/README"},{"text":"✅ WebStudyBooks 免费的前端掘金小册","link":"/TNotes.electron/0055. WebStudyBooks 免费的前端掘金小册/README"}]},{"text":"3. Electron 应用","collapsed":true,"items":[{"text":"✅ Electron Showcase","link":"/TNotes.electron/0052. Electron Showcase/README"}]},{"text":"4. Electron 核心概念","collapsed":true,"items":[{"text":"✅ Electron 核心概念","link":"/TNotes.electron/0045. Electron 核心概念/README"}]},{"text":"5. Electron 应用的最小组成","collapsed":true,"items":[{"text":"✅ Electron 应用的最小组成","link":"/TNotes.electron/0001. Electron 应用的最小组成/README"}]},{"text":"6. contextBridge 上下文桥接","collapsed":true,"items":[{"text":"✅ 使用 contextBridge 暴露 API 给渲染进程","link":"/TNotes.electron/0002. 使用 contextBridge 暴露 API 给渲染进程/README"}]},{"text":"7. IPC 基础","collapsed":true,"items":[{"text":"✅ 认识 IPC 相关模块","link":"/TNotes.electron/0046. 认识 IPC 相关模块/README"},{"text":"✅ 使用 ipcRenderer.send、ipcMain.on 实现从渲染进程到主进程的单向 IPC 通信","link":"/TNotes.electron/0037. 使用 ipcRenderer.send、ipcMain.on 实现从渲染进程到主进程的单向 IPC 通信/README"},{"text":"✅ 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信","link":"/TNotes.electron/0035. 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信/README"},{"text":"✅ 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息","link":"/TNotes.electron/0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息/README"},{"text":"✅ 使用 send、on 实现主进程和渲染进程之间的双向 IPC 通信","link":"/TNotes.electron/0038. 使用 send、on 实现主进程和渲染进程之间的双向 IPC 通信/README"},{"text":"✅ 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信","link":"/TNotes.electron/0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信/README"},{"text":"✅ 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信","link":"/TNotes.electron/0036. 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信/README"}]},{"text":"8. IPC 进阶","collapsed":true,"items":[{"text":"⏰ 分析渲染进程之间的通信","link":"/TNotes.electron/0047. 分析渲染进程之间的通信/README"},{"text":"⏰ 通过主进程转发消息的方式实现两个渲染进程之间互相通信","link":"/TNotes.electron/0042. 通过主进程转发消息的方式实现两个渲染进程之间互相通信/README"},{"text":"⏰ 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信","link":"/TNotes.electron/0041. 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信/README"},{"text":"⏰ 使用 MessagePort 实现两个渲染进程之间的互相通信","link":"/TNotes.electron/0040. 使用 MessagePort 实现两个渲染进程之间的互相通信/README"},{"text":"⏰ 仿观察者模式实现两个渲染进程之间的互相通信","link":"/TNotes.electron/0034. 仿观察者模式实现两个渲染进程之间的互相通信/README"},{"text":"⏰ 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信","link":"/TNotes.electron/0004. 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信/README"},{"text":"⏰ 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能","link":"/TNotes.electron/0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能/README"}]},{"text":"9. 窗口","collapsed":true,"items":[{"text":"9.1. 不同系统的窗口行为兼容适配","collapsed":true,"items":[{"text":"⏰ 适配 Windows 和 macOS 上的窗口交互行为","link":"/TNotes.electron/0016. 适配 Windows 和 macOS 上的窗口交互行为/README"}]},{"text":"9.2. 窗口首次加载的白屏问题","collapsed":true,"items":[{"text":"⏰ 等 ready-to-show 事件触发后再显示窗口以解决窗口白屏问题","link":"/TNotes.electron/0015. 等 ready-to-show 事件触发后再显示窗口以解决窗口白屏问题/README"}]},{"text":"9.3. 无边框窗口","collapsed":true,"items":[{"text":"⏰ 认识无边框窗口","link":"/TNotes.electron/0048. 认识无边框窗口/README"},{"text":"⏰ 创建一个无边框窗口","link":"/TNotes.electron/0018. 创建一个无边框窗口/README"},{"text":"⏰ 让无边框的窗口可以被拖拽","link":"/TNotes.electron/0019. 让无边框的窗口可以被拖拽/README"},{"text":"⏰ macos 隐藏窗口标题栏但是不隐藏交通灯","link":"/TNotes.electron/0020. macos 隐藏窗口标题栏但是不隐藏交通灯/README"}]},{"text":"9.4. 窗口层级","collapsed":true,"items":[{"text":"⏰ 窗口置顶","link":"/TNotes.electron/0017. 窗口置顶/README"}]}]},{"text":"10. 菜单","collapsed":true,"items":[{"text":"10.1. 不同系统的菜单适配","collapsed":true,"items":[{"text":"⏰ macos 应用菜单第一项的问题","link":"/TNotes.electron/0010. macos 应用菜单第一项的问题/README"}]},{"text":"10.2. 页面右键菜单","collapsed":true,"items":[{"text":"⏰ 使用 Menu 模块实现页面中的右键菜单","link":"/TNotes.electron/0012. 使用 Menu 模块实现页面中的右键菜单/README"}]},{"text":"10.3. Dock 菜单","collapsed":true,"items":[{"text":"⏰ 设置 macos 的 Dock 菜单","link":"/TNotes.electron/0009. 设置 macos 的 Dock 菜单/README"}]},{"text":"10.4. 自定义菜单","collapsed":true,"items":[{"text":"⏰ 自定义系统菜单覆盖默认菜单问题","link":"/TNotes.electron/0011. 自定义系统菜单覆盖默认菜单问题/README"}]},{"text":"10.5. Tray 菜单","collapsed":true,"items":[{"text":"⏰ 创建 macos 应用托盘（Tray）","link":"/TNotes.electron/0025. 创建 macos 应用托盘（Tray）/README"}]}]},{"text":"11. app","collapsed":true,"items":[{"text":"11.1. 路径","collapsed":true,"items":[{"text":"⏰ 通过 app 模块获取应用相关路径","link":"/TNotes.electron/0024. 通过 app 模块获取应用相关路径/README"}]}]},{"text":"12. 快捷键","collapsed":true,"items":[{"text":"12.1. 页面级别","collapsed":true,"items":[{"text":"⏰ 页面级别的快捷键","link":"/TNotes.electron/0023. 页面级别的快捷键/README"}]},{"text":"12.2. 全局级别","collapsed":true,"items":[{"text":"⏰ 全局级别的快捷键","link":"/TNotes.electron/0022. 全局级别的快捷键/README"}]}]},{"text":"13. 剪切板","collapsed":true,"items":[{"text":"⏰ 使用 clipboard 模块向系统剪切板中读写文本","link":"/TNotes.electron/0021. 使用 clipboard 模块向系统剪切板中读写文本/README"}]},{"text":"14. 系统通知","collapsed":true,"items":[{"text":"⏰ 使用 Notification 模块弹出系统消息","link":"/TNotes.electron/0026. 使用 Notification 模块弹出系统消息/README"}]},{"text":"15. 桌面视频流","collapsed":true,"items":[{"text":"⏰ 实现屏幕监听功能","link":"/TNotes.electron/0029. 实现屏幕监听功能/README"},{"text":"⏰ 模拟截图功能","link":"/TNotes.electron/0028. 模拟截图功能/README"},{"text":"⏰ desktopCapturer 简介","link":"/TNotes.electron/0049. desktopCapturer 简介/README"}]},{"text":"16. 插件化","collapsed":true,"items":[{"text":"⏰ 使用 BrowserView 加载外部资源","link":"/TNotes.electron/0014. 使用 BrowserView 加载外部资源/README"},{"text":"⏰ 基于 BrowserView 实现插件化能力","link":"/TNotes.electron/0013. 基于 BrowserView 实现插件化能力/README"},{"text":"16.1. 集成浏览器插件","collapsed":true,"items":[{"text":"⏰ 使用 vue-remote-devtools","link":"/TNotes.electron/0006. 使用 vue-remote-devtools/README"},{"text":"⏰ 使用手动安装的方式集成 vue-devtools","link":"/TNotes.electron/0007. 使用手动安装的方式集成 vue-devtools/README"},{"text":"⏰ 使用 electron-devtools-installer 安装 vue-devtools","link":"/TNotes.electron/0005. 使用 electron-devtools-installer 安装 vue-devtools/README"},{"text":"⏰ 使用自动安装的方式集成 vue-devtools","link":"/TNotes.electron/0008. 使用自动安装的方式集成 vue-devtools/README"}]}]},{"text":"17. 其它功能","collapsed":true,"items":[{"text":"17.1. webContents startDrag 原生文件拖放","collapsed":true,"items":[{"text":"⏰ 原生文件拖 & 放","link":"/TNotes.electron/0027. 原生文件拖 & 放/README"}]}]},{"text":"18. 第三方库","collapsed":true,"items":[{"text":"18.1. electron-reload","collapsed":true,"items":[{"text":"⏰ 使用 electron-reload 实现热更","link":"/TNotes.electron/0031. 使用 electron-reload 实现热更/README"}]},{"text":"18.2. electron-builder","collapsed":true,"items":[{"text":"⏰ 使用 electron-icon-builder、electron-builder 解决应用打包后的图标问题","link":"/TNotes.electron/0030. 使用 electron-icon-builder、electron-builder 解决应用打包后的图标问题/README"}]}]},{"text":"19. 小练习","collapsed":true,"items":[{"text":"19.1. 桌面时钟","collapsed":true,"items":[{"text":"⏰ 实现一个桌面时钟","link":"/TNotes.electron/0032. 实现一个桌面时钟/README"},{"text":"⏰ 实现一个桌面时钟-2","link":"/TNotes.electron/0056. 实现一个桌面时钟-2/README"}]},{"text":"19.2. 微信读书助手","collapsed":true,"items":[{"text":"⏰ weread-helper","link":"/TNotes.electron/0044. weread-helper/README"}]},{"text":"19.3. 自动定时截图工具","collapsed":true,"items":[{"text":"⏰ ScreenCaptureApp","link":"/TNotes.electron/0033. ScreenCaptureApp/README"}]}]}]},{"text":"en-notes","link":"https://tdahuyou.github.io/TNotes.en-notes/","collapsed":true,"items":[{"text":"1. 单词本","collapsed":true,"items":[{"text":"⏰ 单词本概述","link":"/TNotes.en-notes/0009. 单词本概述/README"},{"text":"✅ 单词本-1","link":"/TNotes.en-notes/0007. 单词本-1/README"},{"text":"✅ 单词本-2","link":"/TNotes.en-notes/0008. 单词本-2/README"}]},{"text":"2. 我的词库","collapsed":true,"items":[{"text":"✅ en-words 仓库简介","link":"/TNotes.en-notes/0001. en-words 仓库简介/README"}]},{"text":"3. 记单词的流程","collapsed":true,"items":[{"text":"✅ en-words 结合幕布将单词转为思维导图的形式来呈现","link":"/TNotes.en-notes/0005. en-words 结合幕布将单词转为思维导图的形式来呈现/README"}]},{"text":"4. qwerty-learner 英文单词","collapsed":true,"items":[{"text":"✅ qwerty-learner 英文单词数据源","link":"/TNotes.en-notes/0003. qwerty-learner 英文单词数据源/README"},{"text":"⏰ qwerty-learner 英语词典数据解析脚本","link":"/TNotes.en-notes/0002. qwerty-learner 英语词典数据解析脚本/README"},{"text":"⏰ 批量上传单词到 yuque 知识库中","link":"/TNotes.en-notes/0004. 批量上传单词到 yuque 知识库中/README"},{"text":"⏰ 《老人与海》笔记","link":"/TNotes.en-notes/0006. 《老人与海》笔记/README"}]}]},{"text":"en-words","link":"https://github.com/Tdahuyou/TNotes.en-words"},{"text":"footprints","link":"https://tdahuyou.github.io/TNotes.footprints/","collapsed":true,"items":[{"text":"1. 🗓 2025 年","collapsed":true,"items":[{"text":"⏰ 2025 年","link":"/TNotes.footprints/0001. 2025 年/README"}]},{"text":"2. 🗓 2024 年","collapsed":true,"items":[{"text":"✅ 2024 年","link":"/TNotes.footprints/0002. 2024 年/README"}]},{"text":"3. 🗓 2023 年","collapsed":true,"items":[{"text":"✅ 2023 年","link":"/TNotes.footprints/0003. 2023 年/README"}]},{"text":"4. 🗓 2022 年","collapsed":true,"items":[{"text":"✅ 2022 年","link":"/TNotes.footprints/0004. 2022 年/README"}]},{"text":"5. 🗓 2021 年","collapsed":true,"items":[{"text":"✅ 2021 年","link":"/TNotes.footprints/0005. 2021 年/README"}]},{"text":"6. 🗓 2020 年","collapsed":true,"items":[{"text":"✅ 2020 年","link":"/TNotes.footprints/0006. 2020 年/README"}]},{"text":"7. 🗓 2019 年","collapsed":true,"items":[{"text":"✅ 2019 年","link":"/TNotes.footprints/0007. 2019 年/README"}]}]},{"text":"git","link":"https://tdahuyou.github.io/TNotes.git-notes/","collapsed":true,"items":[{"text":"1. 分支","collapsed":true,"items":[{"text":"⏰ 分支重命名","link":"/TNotes.git-notes/0006. 分支重命名/README"}]},{"text":"2. 远程仓库","collapsed":true,"items":[{"text":"⏰ 修改指定远程仓库的 url","link":"/TNotes.git-notes/0001. 修改指定远程仓库的 url/README"}]},{"text":"3. git 配置","collapsed":true,"items":[{"text":"⏰ git proxy 配置","link":"/TNotes.git-notes/0005. git proxy 配置/README"},{"text":"⏰ 一个项目多个 .gitignore 文件","link":"/TNotes.git-notes/0007. 一个项目多个 .gitignore 文件/README"}]},{"text":"4. 错误处理","collapsed":true,"items":[{"text":"⏰ 尝试变更到远程仓库时遇到 Permission denied (publickey) 错误","link":"/TNotes.git-notes/0002. 尝试变更到远程仓库时遇到 Permission denied (publickey) 错误/README"},{"text":"⏰ 处理每次使用 SSH 密钥进行身份验证时都需要输入密码短语（passphrase）的问题","link":"/TNotes.git-notes/0004. 处理每次使用 SSH 密钥进行身份验证时都需要输入密码短语（passphrase）的问题/README"},{"text":"⏰ git clone 报 RPC failed 错误","link":"/TNotes.git-notes/0003. git clone 报 RPC failed 错误/README"}]},{"text":"5. 学习 git 命令","collapsed":true,"items":[{"text":"⏰ git stash","link":"/TNotes.git-notes/0008. git stash/README"},{"text":"⏰ git status","link":"/TNotes.git-notes/0009. git status/README"}]}]},{"text":"html-css-js","link":"https://tdahuyou.github.io/TNotes.html-css-js/","collapsed":true,"items":[{"text":"1. roadmap","collapsed":true,"items":[{"text":"✅ roadmap","link":"/TNotes.html-css-js/0112. roadmap/README"}]},{"text":"2. var、let、const","collapsed":true,"items":[{"text":"✅ var 关键字和变量","link":"/TNotes.html-css-js/0001. var 关键字和变量/README"},{"text":"✅ 变量声明提升和暂时性死区","link":"/TNotes.html-css-js/0002. 变量声明提升和暂时性死区/README"},{"text":"✅ let 关键字","link":"/TNotes.html-css-js/0003. let 关键字/README"},{"text":"✅ const 关键字","link":"/TNotes.html-css-js/0004. const 关键字/README"}]},{"text":"3. 作用域","collapsed":true,"items":[{"text":"✅ 区块和块级作用域","link":"/TNotes.html-css-js/0005. 区块和块级作用域/README"}]},{"text":"4. js 执行环境","collapsed":true,"items":[{"text":"✅ 常见的两个 JS 运行环境：浏览器、NodeJS","link":"/TNotes.html-css-js/0006. 常见的两个 JS 运行环境：浏览器、NodeJS/README"}]},{"text":"5. 语句和表达式","collapsed":true,"items":[{"text":"✅ 语句和表达式","link":"/TNotes.html-css-js/0007. 语句和表达式/README"}]},{"text":"6. 符号","collapsed":true,"items":[{"text":"✅ JS 中的符号","link":"/TNotes.html-css-js/0078. JS 中的符号/README"},{"text":"✅ 转义符","link":"/TNotes.html-css-js/0013. 转义符/README"},{"text":"✅ 标识符","link":"/TNotes.html-css-js/0014. 标识符/README"}]},{"text":"7. 流程控制语句","collapsed":true,"items":[{"text":"✅ 条件语句 - if 结构","link":"/TNotes.html-css-js/0008. 条件语句 - if 结构/README"},{"text":"✅ 条件语句 - if...else 结构","link":"/TNotes.html-css-js/0009. 条件语句 - if...else 结构/README"},{"text":"✅ 条件语句 - switch 结构","link":"/TNotes.html-css-js/0010. 条件语句 - switch 结构/README"},{"text":"✅ 条件语句 - 三元运算符","link":"/TNotes.html-css-js/0011. 条件语句 - 三元运算符/README"},{"text":"✅ 条件语句 - 练习","link":"/TNotes.html-css-js/0012. 条件语句 - 练习/README"},{"text":"✅ 循环语句 - for 循环","link":"/TNotes.html-css-js/0015. 循环语句 - for 循环/README"},{"text":"✅ 循环语句 - while 循环","link":"/TNotes.html-css-js/0016. 循环语句 - while 循环/README"},{"text":"✅ 循环语句 - do...while 循环","link":"/TNotes.html-css-js/0017. 循环语句 - do...while 循环/README"},{"text":"✅ 循环语句 - break 语句和 continue 语句","link":"/TNotes.html-css-js/0018. 循环语句 - break 语句和 continue 语句/README"},{"text":"✅ 循环语句 - 标签（label）","link":"/TNotes.html-css-js/0019. 循环语句 - 标签（label）/README"},{"text":"✅ 循环语句 - 练习","link":"/TNotes.html-css-js/0020. 循环语句 - 练习/README"},{"text":"✅ 注释","link":"/TNotes.html-css-js/0021. 注释/README"},{"text":"✅ 字面量","link":"/TNotes.html-css-js/0022. 字面量/README"}]},{"text":"8. 数据类型","collapsed":true,"items":[{"text":"⏰ boolean 类型","link":"/TNotes.html-css-js/0023. boolean 类型/README"},{"text":"⏰ 与数值相关的全局方法","link":"/TNotes.html-css-js/0024. 与数值相关的全局方法/README"},{"text":"⏰ 数值类型【扩展】","link":"/TNotes.html-css-js/0025. 数值类型【扩展】/README"},{"text":"⏰ 字符串定义","link":"/TNotes.html-css-js/0026. 字符串定义/README"},{"text":"⏰ 模板字符串","link":"/TNotes.html-css-js/0027. 模板字符串/README"},{"text":"⏰ 字符串与数组","link":"/TNotes.html-css-js/0028. 字符串与数组/README"},{"text":"⏰ 字符串类型【扩展】","link":"/TNotes.html-css-js/0029. 字符串类型【扩展】/README"},{"text":"⏰ null 和 undefined 类型","link":"/TNotes.html-css-js/0030. null 和 undefined 类型/README"},{"text":"⏰ 数组的本质","link":"/TNotes.html-css-js/0031. 数组的本质/README"},{"text":"⏰ 数组的索引和 length 属性","link":"/TNotes.html-css-js/0032. 数组的索引和 length 属性/README"},{"text":"⏰ 数组空位","link":"/TNotes.html-css-js/0033. 数组空位/README"},{"text":"⏰ 伪数组","link":"/TNotes.html-css-js/0034. 伪数组/README"},{"text":"⏰ 使用 in 运算符判断属性是否存在于数组中","link":"/TNotes.html-css-js/0035. 使用 in 运算符判断属性是否存在于数组中/README"},{"text":"⏰ 使用 for...in 循环遍历数组","link":"/TNotes.html-css-js/0036. 使用 for...in 循环遍历数组/README"},{"text":"✅ 防抖、节流","link":"/TNotes.html-css-js/0037. 防抖、节流/README"},{"text":"⏰ 数组类型【扩展】","link":"/TNotes.html-css-js/0038. 数组类型【扩展】/README"},{"text":"⏰ 数组【练习-1】","link":"/TNotes.html-css-js/0039. 数组【练习-1】/README"},{"text":"⏰ 数组【练习-2】","link":"/TNotes.html-css-js/0040. 数组【练习-2】/README"},{"text":"⏰ 对象属性读、写、删","link":"/TNotes.html-css-js/0041. 对象属性读、写、删/README"},{"text":"⏰ 对象的字符串键名的多种写法","link":"/TNotes.html-css-js/0042. 对象的字符串键名的多种写法/README"},{"text":"⏰ 判断某个属性是否存在于对象中","link":"/TNotes.html-css-js/0043. 判断某个属性是否存在于对象中/README"},{"text":"⏰ 使用 for...in 循环遍历对象属性","link":"/TNotes.html-css-js/0044. 使用 for...in 循环遍历对象属性/README"},{"text":"⏰ 对象的引用","link":"/TNotes.html-css-js/0045. 对象的引用/README"},{"text":"⏰ 对象类型【练习】","link":"/TNotes.html-css-js/0046. 对象类型【练习】/README"},{"text":"⏰ 引用类型【面试题】","link":"/TNotes.html-css-js/0047. 引用类型【面试题】/README"},{"text":"⏰ 使用 instanceof 判断值的数据类型","link":"/TNotes.html-css-js/0048. 使用 instanceof 判断值的数据类型/README"},{"text":"⏰ 使用 typeof 运算符判断值的数据类型","link":"/TNotes.html-css-js/0049. 使用 typeof 运算符判断值的数据类型/README"},{"text":"⏰ 原型链","link":"/TNotes.html-css-js/0050. 原型链/README"},{"text":"⏰ 加法运算符","link":"/TNotes.html-css-js/0051. 加法运算符/README"},{"text":"⏰ 对象类型的加法运算【扩展】","link":"/TNotes.html-css-js/0052. 对象类型的加法运算【扩展】/README"},{"text":"⏰ 作用域【面试题】","link":"/TNotes.html-css-js/0053. 作用域【面试题】/README"},{"text":"⏰ 使用 customElements 创建一个 myButton 自定义元素","link":"/TNotes.html-css-js/0054. 使用 customElements 创建一个 myButton 自定义元素/README"},{"text":"⏰ 使用 MessageChannel 实现不同模块之间的相互通信","link":"/TNotes.html-css-js/0055. 使用 MessageChannel 实现不同模块之间的相互通信/README"},{"text":"⏰ 在 Worker 中使用 MessageChannel","link":"/TNotes.html-css-js/0056. 在 Worker 中使用 MessageChannel/README"},{"text":"⏰ 使用 MessageChannel 实现父子窗口之间的互相通信","link":"/TNotes.html-css-js/0057. 使用 MessageChannel 实现父子窗口之间的互相通信/README"},{"text":"⏰ new 命令","link":"/TNotes.html-css-js/0058. new 命令/README"},{"text":"⏰ 使用 Object.create() 创建实例对象","link":"/TNotes.html-css-js/0059. 使用 Object.create() 创建实例对象/README"},{"text":"⏰ 构造函数","link":"/TNotes.html-css-js/0060. 构造函数/README"}]},{"text":"9. 模块化","collapsed":true,"items":[{"text":"⏰ 在浏览器中引入 ESM 模块","link":"/TNotes.html-css-js/0061. 在浏览器中引入 ESM 模块/README"},{"text":"⏰ ESM 绑定再导出","link":"/TNotes.html-css-js/0062. ESM 绑定再导出/README"},{"text":"⏰ ESM 模块的基本导出、导入","link":"/TNotes.html-css-js/0063. ESM 模块的基本导出、导入/README"},{"text":"⏰ ESM 模块的默认导入、导出","link":"/TNotes.html-css-js/0064. ESM 模块的默认导入、导出/README"},{"text":"⏰ ESM 依赖预加载和依赖延迟加载","link":"/TNotes.html-css-js/0065. ESM 依赖预加载和依赖延迟加载/README"},{"text":"⏰ ESM - 练习 - 推箱子小游戏","link":"/TNotes.html-css-js/0066. ESM - 练习 - 推箱子小游戏/README"},{"text":"⏰ CMD","link":"/TNotes.html-css-js/0067. CMD/README"},{"text":"⏰ AMD","link":"/TNotes.html-css-js/0068. AMD/README"},{"text":"⏰ JS 导入断言","link":"/TNotes.html-css-js/0069. JS 导入断言/README"},{"text":"⏰ CommonJS 规范","link":"/TNotes.html-css-js/0070. CommonJS 规范/README"},{"text":"⏰ 认识 nodejs 是如何实现 CommonJS 规范的","link":"/TNotes.html-css-js/0071. 认识 nodejs 是如何实现 CommonJS 规范的/README"},{"text":"⏰ CommonJS 模块缓存","link":"/TNotes.html-css-js/0072. CommonJS 模块缓存/README"},{"text":"⏰ CommonJS 练习 - 制作一个斗地主洗牌发牌的程序","link":"/TNotes.html-css-js/0073. CommonJS 练习 - 制作一个斗地主洗牌发牌的程序/README"},{"text":"⏰ 订阅发布模式","link":"/TNotes.html-css-js/0074. 订阅发布模式/README"},{"text":"⏰ 观察者模式","link":"/TNotes.html-css-js/0075. 观察者模式/README"},{"text":"⏰ 使用 Array.form 来创建一个二维数组","link":"/TNotes.html-css-js/0076. 使用 Array.form 来创建一个二维数组/README"},{"text":"⏰ encodeURIcomponent","link":"/TNotes.html-css-js/0077. encodeURIcomponent/README"}]},{"text":"10. ⚙️ window 对象","collapsed":true,"items":[{"text":"✅ window.onbeforeunload","link":"/TNotes.html-css-js/0079. window.onbeforeunload/README"},{"text":"✅ window.confirm","link":"/TNotes.html-css-js/0080. window.confirm/README"},{"text":"✅ 使用 postMessage 实现跨标签页通信","link":"/TNotes.html-css-js/0081. 使用 postMessage 实现跨标签页通信/README"},{"text":"⏰ DOMParser","link":"/TNotes.html-css-js/0108. DOMParser/README"},{"text":"⏰ XSLTProcessor","link":"/TNotes.html-css-js/0109. XSLTProcessor/README"}]},{"text":"11. css 属性","collapsed":true,"items":[{"text":"⏰ background","link":"/TNotes.html-css-js/0105. background/README"},{"text":"⏰ clip-path","link":"/TNotes.html-css-js/0106. clip-path/README"}]},{"text":"12. html 元素","collapsed":true,"items":[{"text":"⏰ style 元素的 sheet 属性","link":"/TNotes.html-css-js/0107. style 元素的 sheet 属性/README"},{"text":"⏰ script 元素的 crossorigin 属性","link":"/TNotes.html-css-js/0110. script 元素的 crossorigin 属性/README"},{"text":"⏰ script 元素的 type 属性","link":"/TNotes.html-css-js/0111. script 元素的 type 属性/README"}]},{"text":"13. prettier","collapsed":true,"items":[{"text":"✅ 学习 prettier 基本配置字段的书写","link":"/TNotes.html-css-js/0113. 学习 prettier 基本配置字段的书写/README"}]},{"text":"14. eslint","collapsed":true,"items":[{"text":"✅ eslint 是什么？","link":"/TNotes.html-css-js/0116. eslint 是什么？/README"},{"text":"⏰ eslint 的配置文件的命名","link":"/TNotes.html-css-js/0117. eslint 的配置文件的命名/README"},{"text":"⏰ VSCode 中的 eslint 插件","link":"/TNotes.html-css-js/0118. VSCode 中的 eslint 插件/README"},{"text":"⏰ 使用 no-unused-vars 配置规则：未使用的变量报错","link":"/TNotes.html-css-js/0119. 使用 no-unused-vars 配置规则：未使用的变量报错/README"},{"text":"⏰ eslint 配置格式","link":"/TNotes.html-css-js/0120. eslint 配置格式/README"},{"text":"⏰ 忽略文件 .eslintignore","link":"/TNotes.html-css-js/0121. 忽略文件 .eslintignore/README"}]},{"text":"15. color picker","collapsed":true,"items":[{"text":"⏰ 自定义 color picker 组件","link":"/TNotes.html-css-js/0122. 自定义 color picker 组件/README"}]},{"text":"16. ⏰ html-css","collapsed":true,"items":[{"text":"⏰ img 元素宽度撑满，防止溢出容器","link":"/TNotes.html-css-js/0082. img 元素宽度撑满，防止溢出容器/README"},{"text":"⏰ 容器高度自适应图片高度","link":"/TNotes.html-css-js/0083. 容器高度自适应图片高度/README"},{"text":"⏰ 普通元素的参考系是父元素的 content-box","link":"/TNotes.html-css-js/0084. 普通元素的参考系是父元素的 content-box/README"},{"text":"⏰ absolute 定位元素的参考系是父元素中的定位元素的 padding-box","link":"/TNotes.html-css-js/0085. absolute 定位元素的参考系是父元素中的定位元素的 padding-box/README"},{"text":"⏰ 表单单选框","link":"/TNotes.html-css-js/0086. 表单单选框/README"},{"text":"⏰ 表单提交、重置按钮","link":"/TNotes.html-css-js/0087. 表单提交、重置按钮/README"},{"text":"⏰ 表单元素 select 多选","link":"/TNotes.html-css-js/0088. 表单元素 select 多选/README"},{"text":"⏰ 密码输入框","link":"/TNotes.html-css-js/0089. 密码输入框/README"},{"text":"⏰ 认识 table 元素结构","link":"/TNotes.html-css-js/0090. 认识 table 元素结构/README"},{"text":"⏰ 定位练习 - 侧边广告","link":"/TNotes.html-css-js/0091. 定位练习 - 侧边广告/README"},{"text":"⏰ 定位练习 - 视口居中","link":"/TNotes.html-css-js/0092. 定位练习 - 视口居中/README"},{"text":"⏰ 定位练习 - 视频卡片","link":"/TNotes.html-css-js/0093. 定位练习 - 视频卡片/README"},{"text":"⏰ 盒模型 content-box vs. border-box","link":"/TNotes.html-css-js/0094. 盒模型 content-box vs. border-box/README"},{"text":"⏰ 精灵图","link":"/TNotes.html-css-js/0095. 精灵图/README"},{"text":"⏰ 属性值的计算过程","link":"/TNotes.html-css-js/0096. 属性值的计算过程/README"},{"text":"⏰ 字体图标","link":"/TNotes.html-css-js/0097. 字体图标/README"},{"text":"⏰ a 元素的爱恨法则","link":"/TNotes.html-css-js/0098. a 元素的爱恨法则/README"},{"text":"⏰ 伪类选择器 first-child、nth-cihld","link":"/TNotes.html-css-js/0099. 伪类选择器 first-child、nth-cihld/README"},{"text":"⏰ 伪类选择器 nth-cihld","link":"/TNotes.html-css-js/0100. 伪类选择器 nth-cihld/README"},{"text":"⏰ 伪类选择器 first-child","link":"/TNotes.html-css-js/0101. 伪类选择器 first-child/README"},{"text":"⏰ 伪类选择器 first-of-type","link":"/TNotes.html-css-js/0102. 伪类选择器 first-of-type/README"},{"text":"⏰ 颜色的 alpha 通道","link":"/TNotes.html-css-js/0103. 颜色的 alpha 通道/README"},{"text":"⏰ 一些常见的通用 css","link":"/TNotes.html-css-js/0104. 一些常见的通用 css/README"}]}]},{"text":"leetcode","link":"https://tdahuyou.github.io/TNotes.leetcode/","collapsed":true,"items":[{"text":"1. 🎯 题目列表","collapsed":true,"items":[{"text":"✅ 0001. 两数之和【简单】","link":"/TNotes.leetcode/0001. 两数之和【简单】/README"},{"text":"⏰ 0002. 两数相加【中等】","link":"/TNotes.leetcode/0002. 两数相加【中等】/README"},{"text":"⏰ 0003. 无重复字符的最长子串【中等】","link":"/TNotes.leetcode/0003. 无重复字符的最长子串【中等】/README"},{"text":"⏰ 0004. 寻找两个正序数组的中位数【困难】","link":"/TNotes.leetcode/0004. 寻找两个正序数组的中位数【困难】/README"},{"text":"⏰ 0005. 最长回文子串【中等】","link":"/TNotes.leetcode/0005. 最长回文子串【中等】/README"},{"text":"⏰ 0006. Z 字形变换【中等】","link":"/TNotes.leetcode/0006. Z 字形变换【中等】/README"},{"text":"⏰ 0007. 整数反转【中等】","link":"/TNotes.leetcode/0007. 整数反转【中等】/README"},{"text":"⏰ 0008. 字符串转换整数 (atoi)【中等】","link":"/TNotes.leetcode/0008. 字符串转换整数 (atoi)【中等】/README"},{"text":"⏰ 0009. 回文数【简单】","link":"/TNotes.leetcode/0009. 回文数【简单】/README"},{"text":"⏰ 0010. 正则表达式匹配【困难】","link":"/TNotes.leetcode/0010. 正则表达式匹配【困难】/README"},{"text":"⏰ 0011. 盛最多水的容器【中等】","link":"/TNotes.leetcode/0011. 盛最多水的容器【中等】/README"},{"text":"⏰ 0012. 整数转罗马数字【中等】","link":"/TNotes.leetcode/0012. 整数转罗马数字【中等】/README"},{"text":"⏰ 0013. 罗马数字转整数【简单】","link":"/TNotes.leetcode/0013. 罗马数字转整数【简单】/README"},{"text":"⏰ 0014. 最长公共前缀【简单】","link":"/TNotes.leetcode/0014. 最长公共前缀【简单】/README"},{"text":"✅ 0015. 三数之和【中等】","link":"/TNotes.leetcode/0015. 三数之和【中等】/README"},{"text":"⏰ 0016. 最接近的三数之和【中等】","link":"/TNotes.leetcode/0016. 最接近的三数之和【中等】/README"},{"text":"⏰ 0017. 电话号码的字母组合【中等】","link":"/TNotes.leetcode/0017. 电话号码的字母组合【中等】/README"},{"text":"⏰ 0018. 四数之和【中等】","link":"/TNotes.leetcode/0018. 四数之和【中等】/README"},{"text":"⏰ 0019. 删除链表的倒数第 N 个结点【中等】","link":"/TNotes.leetcode/0019. 删除链表的倒数第 N 个结点【中等】/README"},{"text":"⏰ 0020. 有效的括号【简单】","link":"/TNotes.leetcode/0020. 有效的括号【简单】/README"},{"text":"⏰ 0021. 合并两个有序链表【简单】","link":"/TNotes.leetcode/0021. 合并两个有序链表【简单】/README"},{"text":"⏰ 0022. 括号生成【中等】","link":"/TNotes.leetcode/0022. 括号生成【中等】/README"},{"text":"⏰ 0023. 合并 K 个升序链表【困难】","link":"/TNotes.leetcode/0023. 合并 K 个升序链表【困难】/README"},{"text":"⏰ 0024. 两两交换链表中的节点【中等】","link":"/TNotes.leetcode/0024. 两两交换链表中的节点【中等】/README"},{"text":"⏰ 0025. K 个一组翻转链表【困难】","link":"/TNotes.leetcode/0025. K 个一组翻转链表【困难】/README"},{"text":"✅ 0026. 删除有序数组中的重复项【简单】","link":"/TNotes.leetcode/0026. 删除有序数组中的重复项【简单】/README"},{"text":"⏰ 0027. 移除元素【简单】","link":"/TNotes.leetcode/0027. 移除元素【简单】/README"},{"text":"⏰ 0028. 找出字符串中第一个匹配项的下标【简单】","link":"/TNotes.leetcode/0028. 找出字符串中第一个匹配项的下标【简单】/README"},{"text":"⏰ 0029. 两数相除【中等】","link":"/TNotes.leetcode/0029. 两数相除【中等】/README"},{"text":"⏰ 0030. 串联所有单词的子串【困难】","link":"/TNotes.leetcode/0030. 串联所有单词的子串【困难】/README"},{"text":"⏰ 0031. 下一个排列【中等】","link":"/TNotes.leetcode/0031. 下一个排列【中等】/README"},{"text":"⏰ 0032. 最长有效括号【困难】","link":"/TNotes.leetcode/0032. 最长有效括号【困难】/README"},{"text":"⏰ 0033. 搜索旋转排序数组【中等】","link":"/TNotes.leetcode/0033. 搜索旋转排序数组【中等】/README"},{"text":"⏰ 0034. 在排序数组中查找元素的第一个和最后一个位置【中等】","link":"/TNotes.leetcode/0034. 在排序数组中查找元素的第一个和最后一个位置【中等】/README"},{"text":"⏰ 0035. 搜索插入位置【简单】","link":"/TNotes.leetcode/0035. 搜索插入位置【简单】/README"},{"text":"⏰ 0036. 有效的数独【中等】","link":"/TNotes.leetcode/0036. 有效的数独【中等】/README"},{"text":"⏰ 0037. 解数独【困难】","link":"/TNotes.leetcode/0037. 解数独【困难】/README"},{"text":"⏰ 0038. 外观数列【中等】","link":"/TNotes.leetcode/0038. 外观数列【中等】/README"},{"text":"⏰ 0039. 组合总和【中等】","link":"/TNotes.leetcode/0039. 组合总和【中等】/README"},{"text":"⏰ 0040. 组合总和 II【中等】","link":"/TNotes.leetcode/0040. 组合总和 II【中等】/README"},{"text":"⏰ 0041. 缺失的第一个正数【困难】","link":"/TNotes.leetcode/0041. 缺失的第一个正数【困难】/README"},{"text":"⏰ 0042. 接雨水【困难】","link":"/TNotes.leetcode/0042. 接雨水【困难】/README"},{"text":"⏰ 0043. 字符串相乘【中等】","link":"/TNotes.leetcode/0043. 字符串相乘【中等】/README"},{"text":"⏰ 0044. 通配符匹配【困难】","link":"/TNotes.leetcode/0044. 通配符匹配【困难】/README"},{"text":"⏰ 0045. 跳跃游戏 II【中等】","link":"/TNotes.leetcode/0045. 跳跃游戏 II【中等】/README"},{"text":"⏰ 0046. 全排列【中等】","link":"/TNotes.leetcode/0046. 全排列【中等】/README"},{"text":"⏰ 0047. 全排列 II【中等】","link":"/TNotes.leetcode/0047. 全排列 II【中等】/README"},{"text":"⏰ 0048. 旋转图像【中等】","link":"/TNotes.leetcode/0048. 旋转图像【中等】/README"},{"text":"⏰ 0049. 字母异位词分组【中等】","link":"/TNotes.leetcode/0049. 字母异位词分组【中等】/README"},{"text":"⏰ 0050. Pow(x, n)【中等】","link":"/TNotes.leetcode/0050. Pow(x, n)【中等】/README"},{"text":"⏰ 0051. N 皇后【困难】","link":"/TNotes.leetcode/0051. N 皇后【困难】/README"},{"text":"⏰ 0052. N 皇后 II【困难】","link":"/TNotes.leetcode/0052. N 皇后 II【困难】/README"},{"text":"⏰ 0053. 最大子数组和【中等】","link":"/TNotes.leetcode/0053. 最大子数组和【中等】/README"},{"text":"⏰ 0054. 螺旋矩阵【中等】","link":"/TNotes.leetcode/0054. 螺旋矩阵【中等】/README"},{"text":"⏰ 0055. 跳跃游戏【中等】","link":"/TNotes.leetcode/0055. 跳跃游戏【中等】/README"},{"text":"⏰ 0056. 合并区间【中等】","link":"/TNotes.leetcode/0056. 合并区间【中等】/README"},{"text":"⏰ 0057. 插入区间【中等】","link":"/TNotes.leetcode/0057. 插入区间【中等】/README"},{"text":"⏰ 0058. 最后一个单词的长度【简单】","link":"/TNotes.leetcode/0058. 最后一个单词的长度【简单】/README"},{"text":"⏰ 0059. 螺旋矩阵 II【中等】","link":"/TNotes.leetcode/0059. 螺旋矩阵 II【中等】/README"},{"text":"⏰ 0060. 排列序列【困难】","link":"/TNotes.leetcode/0060. 排列序列【困难】/README"},{"text":"⏰ 0061. 旋转链表【中等】","link":"/TNotes.leetcode/0061. 旋转链表【中等】/README"},{"text":"⏰ 0062. 不同路径【中等】","link":"/TNotes.leetcode/0062. 不同路径【中等】/README"},{"text":"⏰ 0063. 不同路径 II【中等】","link":"/TNotes.leetcode/0063. 不同路径 II【中等】/README"},{"text":"⏰ 0064. 最小路径和【中等】","link":"/TNotes.leetcode/0064. 最小路径和【中等】/README"},{"text":"⏰ 0065. 有效数字【困难】","link":"/TNotes.leetcode/0065. 有效数字【困难】/README"},{"text":"⏰ 0066. 加一【简单】","link":"/TNotes.leetcode/0066. 加一【简单】/README"},{"text":"⏰ 0067. 二进制求和【简单】","link":"/TNotes.leetcode/0067. 二进制求和【简单】/README"},{"text":"⏰ 0068. 文本左右对齐【困难】","link":"/TNotes.leetcode/0068. 文本左右对齐【困难】/README"},{"text":"⏰ 0069. x 的平方根【简单】","link":"/TNotes.leetcode/0069. x 的平方根【简单】/README"},{"text":"⏰ 0070. 爬楼梯【简单】","link":"/TNotes.leetcode/0070. 爬楼梯【简单】/README"},{"text":"⏰ 0071. 简化路径【中等】","link":"/TNotes.leetcode/0071. 简化路径【中等】/README"},{"text":"⏰ 0072. 编辑距离【中等】","link":"/TNotes.leetcode/0072. 编辑距离【中等】/README"},{"text":"⏰ 0073. 矩阵置零【中等】","link":"/TNotes.leetcode/0073. 矩阵置零【中等】/README"},{"text":"⏰ 0074. 搜索二维矩阵【中等】","link":"/TNotes.leetcode/0074. 搜索二维矩阵【中等】/README"},{"text":"⏰ 0075. 颜色分类【中等】","link":"/TNotes.leetcode/0075. 颜色分类【中等】/README"},{"text":"⏰ 0076. 最小覆盖子串【困难】","link":"/TNotes.leetcode/0076. 最小覆盖子串【困难】/README"},{"text":"⏰ 0077. 组合【中等】","link":"/TNotes.leetcode/0077. 组合【中等】/README"},{"text":"⏰ 0078. 子集【中等】","link":"/TNotes.leetcode/0078. 子集【中等】/README"},{"text":"⏰ 0079. 单词搜索【中等】","link":"/TNotes.leetcode/0079. 单词搜索【中等】/README"},{"text":"⏰ 0080. 删除有序数组中的重复项 II【中等】","link":"/TNotes.leetcode/0080. 删除有序数组中的重复项 II【中等】/README"},{"text":"⏰ 0081. 搜索旋转排序数组 II【中等】","link":"/TNotes.leetcode/0081. 搜索旋转排序数组 II【中等】/README"},{"text":"⏰ 0082. 删除排序链表中的重复元素 II【中等】","link":"/TNotes.leetcode/0082. 删除排序链表中的重复元素 II【中等】/README"},{"text":"⏰ 0083. 删除排序链表中的重复元素【简单】","link":"/TNotes.leetcode/0083. 删除排序链表中的重复元素【简单】/README"},{"text":"⏰ 0084. 柱状图中最大的矩形【困难】","link":"/TNotes.leetcode/0084. 柱状图中最大的矩形【困难】/README"},{"text":"⏰ 0085. 最大矩形【困难】","link":"/TNotes.leetcode/0085. 最大矩形【困难】/README"},{"text":"⏰ 0086. 分隔链表【中等】","link":"/TNotes.leetcode/0086. 分隔链表【中等】/README"},{"text":"⏰ 0087. 扰乱字符串【困难】","link":"/TNotes.leetcode/0087. 扰乱字符串【困难】/README"},{"text":"⏰ 0088. 合并两个有序数组【简单】","link":"/TNotes.leetcode/0088. 合并两个有序数组【简单】/README"},{"text":"⏰ 0089. 格雷编码【中等】","link":"/TNotes.leetcode/0089. 格雷编码【中等】/README"},{"text":"⏰ 0090. 子集 II【中等】","link":"/TNotes.leetcode/0090. 子集 II【中等】/README"},{"text":"⏰ 0091. 解码方法【中等】","link":"/TNotes.leetcode/0091. 解码方法【中等】/README"},{"text":"⏰ 0092. 反转链表 II【中等】","link":"/TNotes.leetcode/0092. 反转链表 II【中等】/README"},{"text":"⏰ 0093. 复原 IP 地址【中等】","link":"/TNotes.leetcode/0093. 复原 IP 地址【中等】/README"},{"text":"⏰ 0094. 二叉树的中序遍历【简单】","link":"/TNotes.leetcode/0094. 二叉树的中序遍历【简单】/README"},{"text":"⏰ 0095. 不同的二叉搜索树 II【中等】","link":"/TNotes.leetcode/0095. 不同的二叉搜索树 II【中等】/README"},{"text":"⏰ 0096. 不同的二叉搜索树【中等】","link":"/TNotes.leetcode/0096. 不同的二叉搜索树【中等】/README"},{"text":"⏰ 0097. 交错字符串【中等】","link":"/TNotes.leetcode/0097. 交错字符串【中等】/README"},{"text":"⏰ 0098. 验证二叉搜索树【中等】","link":"/TNotes.leetcode/0098. 验证二叉搜索树【中等】/README"},{"text":"⏰ 0099. 恢复二叉搜索树【中等】","link":"/TNotes.leetcode/0099. 恢复二叉搜索树【中等】/README"},{"text":"⏰ 0100. 相同的树【简单】","link":"/TNotes.leetcode/0100. 相同的树【简单】/README"},{"text":"⏰ 0101. 对称二叉树【简单】","link":"/TNotes.leetcode/0101. 对称二叉树【简单】/README"},{"text":"⏰ 0102. 二叉树的层序遍历【中等】","link":"/TNotes.leetcode/0102. 二叉树的层序遍历【中等】/README"},{"text":"⏰ 0103. 二叉树的锯齿形层序遍历【中等】","link":"/TNotes.leetcode/0103. 二叉树的锯齿形层序遍历【中等】/README"},{"text":"⏰ 0104. 二叉树的最大深度【简单】","link":"/TNotes.leetcode/0104. 二叉树的最大深度【简单】/README"},{"text":"⏰ 0105. 从前序与中序遍历序列构造二叉树【中等】","link":"/TNotes.leetcode/0105. 从前序与中序遍历序列构造二叉树【中等】/README"},{"text":"⏰ 0106. 从中序与后序遍历序列构造二叉树【中等】","link":"/TNotes.leetcode/0106. 从中序与后序遍历序列构造二叉树【中等】/README"},{"text":"⏰ 0107. 二叉树的层序遍历 II【中等】","link":"/TNotes.leetcode/0107. 二叉树的层序遍历 II【中等】/README"},{"text":"⏰ 0108. 将有序数组转换为二叉搜索树【简单】","link":"/TNotes.leetcode/0108. 将有序数组转换为二叉搜索树【简单】/README"},{"text":"⏰ 0109. 有序链表转换二叉搜索树【中等】","link":"/TNotes.leetcode/0109. 有序链表转换二叉搜索树【中等】/README"},{"text":"⏰ 0110. 平衡二叉树【简单】","link":"/TNotes.leetcode/0110. 平衡二叉树【简单】/README"},{"text":"⏰ 0111. 二叉树的最小深度【简单】","link":"/TNotes.leetcode/0111. 二叉树的最小深度【简单】/README"},{"text":"⏰ 0112. 路径总和【简单】","link":"/TNotes.leetcode/0112. 路径总和【简单】/README"},{"text":"⏰ 0113. 路径总和 II【中等】","link":"/TNotes.leetcode/0113. 路径总和 II【中等】/README"},{"text":"⏰ 0114. 二叉树展开为链表【中等】","link":"/TNotes.leetcode/0114. 二叉树展开为链表【中等】/README"},{"text":"⏰ 0115. 不同的子序列【困难】","link":"/TNotes.leetcode/0115. 不同的子序列【困难】/README"},{"text":"⏰ 0116. 填充每个节点的下一个右侧节点指针【中等】","link":"/TNotes.leetcode/0116. 填充每个节点的下一个右侧节点指针【中等】/README"},{"text":"⏰ 0117. 填充每个节点的下一个右侧节点指针 II【中等】","link":"/TNotes.leetcode/0117. 填充每个节点的下一个右侧节点指针 II【中等】/README"},{"text":"⏰ 0118. 杨辉三角【简单】","link":"/TNotes.leetcode/0118. 杨辉三角【简单】/README"},{"text":"⏰ 0119. 杨辉三角 II【简单】","link":"/TNotes.leetcode/0119. 杨辉三角 II【简单】/README"},{"text":"⏰ 0120. 三角形最小路径和【中等】","link":"/TNotes.leetcode/0120. 三角形最小路径和【中等】/README"},{"text":"⏰ 0121. 买卖股票的最佳时机【简单】","link":"/TNotes.leetcode/0121. 买卖股票的最佳时机【简单】/README"},{"text":"⏰ 0122. 买卖股票的最佳时机 II【中等】","link":"/TNotes.leetcode/0122. 买卖股票的最佳时机 II【中等】/README"},{"text":"⏰ 0123. 买卖股票的最佳时机 III【困难】","link":"/TNotes.leetcode/0123. 买卖股票的最佳时机 III【困难】/README"},{"text":"⏰ 0124. 二叉树中的最大路径和【困难】","link":"/TNotes.leetcode/0124. 二叉树中的最大路径和【困难】/README"},{"text":"⏰ 0125. 验证回文串【简单】","link":"/TNotes.leetcode/0125. 验证回文串【简单】/README"},{"text":"⏰ 0126. 单词接龙 II【困难】","link":"/TNotes.leetcode/0126. 单词接龙 II【困难】/README"},{"text":"⏰ 0127. 单词接龙【困难】","link":"/TNotes.leetcode/0127. 单词接龙【困难】/README"},{"text":"⏰ 0128. 最长连续序列【中等】","link":"/TNotes.leetcode/0128. 最长连续序列【中等】/README"},{"text":"⏰ 0129. 求根节点到叶节点数字之和【中等】","link":"/TNotes.leetcode/0129. 求根节点到叶节点数字之和【中等】/README"},{"text":"⏰ 0130. 被围绕的区域【中等】","link":"/TNotes.leetcode/0130. 被围绕的区域【中等】/README"},{"text":"⏰ 0131. 分割回文串【中等】","link":"/TNotes.leetcode/0131. 分割回文串【中等】/README"},{"text":"⏰ 0132. 分割回文串 II【困难】","link":"/TNotes.leetcode/0132. 分割回文串 II【困难】/README"},{"text":"⏰ 0133. 克隆图【中等】","link":"/TNotes.leetcode/0133. 克隆图【中等】/README"},{"text":"⏰ 0134. 加油站【中等】","link":"/TNotes.leetcode/0134. 加油站【中等】/README"},{"text":"⏰ 0135. 分发糖果【困难】","link":"/TNotes.leetcode/0135. 分发糖果【困难】/README"},{"text":"⏰ 0136. 只出现一次的数字【简单】","link":"/TNotes.leetcode/0136. 只出现一次的数字【简单】/README"},{"text":"⏰ 0137. 只出现一次的数字 II【中等】","link":"/TNotes.leetcode/0137. 只出现一次的数字 II【中等】/README"},{"text":"⏰ 0138. 随机链表的复制【中等】","link":"/TNotes.leetcode/0138. 随机链表的复制【中等】/README"},{"text":"⏰ 0139. 单词拆分【中等】","link":"/TNotes.leetcode/0139. 单词拆分【中等】/README"},{"text":"⏰ 0140. 单词拆分 II【困难】","link":"/TNotes.leetcode/0140. 单词拆分 II【困难】/README"},{"text":"⏰ 0141. 环形链表【简单】","link":"/TNotes.leetcode/0141. 环形链表【简单】/README"},{"text":"⏰ 0142. 环形链表 II【中等】","link":"/TNotes.leetcode/0142. 环形链表 II【中等】/README"},{"text":"⏰ 0143. 重排链表【中等】","link":"/TNotes.leetcode/0143. 重排链表【中等】/README"},{"text":"⏰ 0144. 二叉树的前序遍历【简单】","link":"/TNotes.leetcode/0144. 二叉树的前序遍历【简单】/README"},{"text":"⏰ 0145. 二叉树的后序遍历【简单】","link":"/TNotes.leetcode/0145. 二叉树的后序遍历【简单】/README"},{"text":"⏰ 0146. LRU 缓存【中等】","link":"/TNotes.leetcode/0146. LRU 缓存【中等】/README"},{"text":"⏰ 0147. 对链表进行插入排序【中等】","link":"/TNotes.leetcode/0147. 对链表进行插入排序【中等】/README"},{"text":"⏰ 0148. 排序链表【中等】","link":"/TNotes.leetcode/0148. 排序链表【中等】/README"},{"text":"⏰ 0149. 直线上最多的点数【困难】","link":"/TNotes.leetcode/0149. 直线上最多的点数【困难】/README"},{"text":"⏰ 0150. 逆波兰表达式求值【中等】","link":"/TNotes.leetcode/0150. 逆波兰表达式求值【中等】/README"},{"text":"⏰ 0151. 反转字符串中的单词【中等】","link":"/TNotes.leetcode/0151. 反转字符串中的单词【中等】/README"},{"text":"⏰ 0152. 乘积最大子数组【中等】","link":"/TNotes.leetcode/0152. 乘积最大子数组【中等】/README"},{"text":"⏰ 0153. 寻找旋转排序数组中的最小值【中等】","link":"/TNotes.leetcode/0153. 寻找旋转排序数组中的最小值【中等】/README"},{"text":"⏰ 0154. 寻找旋转排序数组中的最小值 II【困难】","link":"/TNotes.leetcode/0154. 寻找旋转排序数组中的最小值 II【困难】/README"},{"text":"⏰ 0155. 最小栈【中等】","link":"/TNotes.leetcode/0155. 最小栈【中等】/README"},{"text":"⏰ 0156. 上下翻转二叉树【中等】","link":"/TNotes.leetcode/0156. 上下翻转二叉树【中等】/README"},{"text":"⏰ 0157. 用 Read4 读取 N 个字符【简单】","link":"/TNotes.leetcode/0157. 用 Read4 读取 N 个字符【简单】/README"},{"text":"⏰ 0158. 用 Read4 读取 N 个字符 II - 多次调用【困难】","link":"/TNotes.leetcode/0158. 用 Read4 读取 N 个字符 II - 多次调用【困难】/README"},{"text":"⏰ 0159. 至多包含两个不同字符的最长子串【中等】","link":"/TNotes.leetcode/0159. 至多包含两个不同字符的最长子串【中等】/README"},{"text":"⏰ 0160. 相交链表【简单】","link":"/TNotes.leetcode/0160. 相交链表【简单】/README"},{"text":"⏰ 0161. 相隔为 1 的编辑距离【中等】","link":"/TNotes.leetcode/0161. 相隔为 1 的编辑距离【中等】/README"},{"text":"⏰ 0162. 寻找峰值【中等】","link":"/TNotes.leetcode/0162. 寻找峰值【中等】/README"},{"text":"⏰ 0163. 缺失的区间【简单】","link":"/TNotes.leetcode/0163. 缺失的区间【简单】/README"},{"text":"⏰ 0164. 最大间距【中等】","link":"/TNotes.leetcode/0164. 最大间距【中等】/README"},{"text":"⏰ 0165. 比较版本号【中等】","link":"/TNotes.leetcode/0165. 比较版本号【中等】/README"},{"text":"⏰ 0166. 分数到小数【中等】","link":"/TNotes.leetcode/0166. 分数到小数【中等】/README"},{"text":"⏰ 0167. 两数之和 II - 输入有序数组【中等】","link":"/TNotes.leetcode/0167. 两数之和 II - 输入有序数组【中等】/README"},{"text":"⏰ 0168. Excel 表列名称【简单】","link":"/TNotes.leetcode/0168. Excel 表列名称【简单】/README"},{"text":"⏰ 0169. 多数元素【简单】","link":"/TNotes.leetcode/0169. 多数元素【简单】/README"},{"text":"⏰ 0170. 两数之和 III - 数据结构设计【简单】","link":"/TNotes.leetcode/0170. 两数之和 III - 数据结构设计【简单】/README"},{"text":"⏰ 0171. Excel 表列序号【简单】","link":"/TNotes.leetcode/0171. Excel 表列序号【简单】/README"},{"text":"⏰ 0172. 阶乘后的零【中等】","link":"/TNotes.leetcode/0172. 阶乘后的零【中等】/README"},{"text":"⏰ 0173. 二叉搜索树迭代器【中等】","link":"/TNotes.leetcode/0173. 二叉搜索树迭代器【中等】/README"},{"text":"⏰ 0174. 地下城游戏【困难】","link":"/TNotes.leetcode/0174. 地下城游戏【困难】/README"},{"text":"⏰ 0175. 组合两个表【简单】","link":"/TNotes.leetcode/0175. 组合两个表【简单】/README"},{"text":"⏰ 0176. 第二高的薪水【中等】","link":"/TNotes.leetcode/0176. 第二高的薪水【中等】/README"},{"text":"⏰ 0177. 第N高的薪水【中等】","link":"/TNotes.leetcode/0177. 第N高的薪水【中等】/README"},{"text":"⏰ 0178. 分数排名【中等】","link":"/TNotes.leetcode/0178. 分数排名【中等】/README"},{"text":"⏰ 0179. 最大数【中等】","link":"/TNotes.leetcode/0179. 最大数【中等】/README"},{"text":"⏰ 0180. 连续出现的数字【中等】","link":"/TNotes.leetcode/0180. 连续出现的数字【中等】/README"},{"text":"⏰ 0181. 超过经理收入的员工【简单】","link":"/TNotes.leetcode/0181. 超过经理收入的员工【简单】/README"},{"text":"⏰ 0182. 查找重复的电子邮箱【简单】","link":"/TNotes.leetcode/0182. 查找重复的电子邮箱【简单】/README"},{"text":"⏰ 0183. 从不订购的客户【简单】","link":"/TNotes.leetcode/0183. 从不订购的客户【简单】/README"},{"text":"⏰ 0184. 部门工资最高的员工【中等】","link":"/TNotes.leetcode/0184. 部门工资最高的员工【中等】/README"},{"text":"⏰ 0185. 部门工资前三高的所有员工【困难】","link":"/TNotes.leetcode/0185. 部门工资前三高的所有员工【困难】/README"},{"text":"⏰ 0186. 反转字符串中的单词 II【中等】","link":"/TNotes.leetcode/0186. 反转字符串中的单词 II【中等】/README"},{"text":"⏰ 0187. 重复的DNA序列【中等】","link":"/TNotes.leetcode/0187. 重复的DNA序列【中等】/README"},{"text":"⏰ 0188. 买卖股票的最佳时机 IV【困难】","link":"/TNotes.leetcode/0188. 买卖股票的最佳时机 IV【困难】/README"},{"text":"⏰ 0189. 轮转数组【中等】","link":"/TNotes.leetcode/0189. 轮转数组【中等】/README"},{"text":"⏰ 0190. 颠倒二进制位【简单】","link":"/TNotes.leetcode/0190. 颠倒二进制位【简单】/README"},{"text":"⏰ 0191. 位1的个数【简单】","link":"/TNotes.leetcode/0191. 位1的个数【简单】/README"},{"text":"⏰ 0192. 统计词频【中等】","link":"/TNotes.leetcode/0192. 统计词频【中等】/README"},{"text":"⏰ 0193. 有效电话号码【简单】","link":"/TNotes.leetcode/0193. 有效电话号码【简单】/README"},{"text":"⏰ 0194. 转置文件【中等】","link":"/TNotes.leetcode/0194. 转置文件【中等】/README"},{"text":"⏰ 0195. 第十行【简单】","link":"/TNotes.leetcode/0195. 第十行【简单】/README"},{"text":"⏰ 0196. 删除重复的电子邮箱【简单】","link":"/TNotes.leetcode/0196. 删除重复的电子邮箱【简单】/README"},{"text":"⏰ 0197. 上升的温度【简单】","link":"/TNotes.leetcode/0197. 上升的温度【简单】/README"},{"text":"⏰ 0198. 打家劫舍【中等】","link":"/TNotes.leetcode/0198. 打家劫舍【中等】/README"},{"text":"⏰ 0199. 二叉树的右视图【中等】","link":"/TNotes.leetcode/0199. 二叉树的右视图【中等】/README"},{"text":"⏰ 0200. 岛屿数量【中等】","link":"/TNotes.leetcode/0200. 岛屿数量【中等】/README"},{"text":"⏰ 0201. 数字范围按位与【中等】","link":"/TNotes.leetcode/0201. 数字范围按位与【中等】/README"},{"text":"⏰ 0202. 快乐数【简单】","link":"/TNotes.leetcode/0202. 快乐数【简单】/README"},{"text":"⏰ 0203. 移除链表元素【简单】","link":"/TNotes.leetcode/0203. 移除链表元素【简单】/README"},{"text":"⏰ 0204. 计数质数【中等】","link":"/TNotes.leetcode/0204. 计数质数【中等】/README"},{"text":"⏰ 0205. 同构字符串【简单】","link":"/TNotes.leetcode/0205. 同构字符串【简单】/README"},{"text":"⏰ 0206. 反转链表【简单】","link":"/TNotes.leetcode/0206. 反转链表【简单】/README"},{"text":"⏰ 0207. 课程表【中等】","link":"/TNotes.leetcode/0207. 课程表【中等】/README"},{"text":"⏰ 0208. 实现 Trie (前缀树)【中等】","link":"/TNotes.leetcode/0208. 实现 Trie (前缀树)【中等】/README"},{"text":"⏰ 0209. 长度最小的子数组【中等】","link":"/TNotes.leetcode/0209. 长度最小的子数组【中等】/README"},{"text":"⏰ 0210. 课程表 II【中等】","link":"/TNotes.leetcode/0210. 课程表 II【中等】/README"},{"text":"⏰ 0211. 添加与搜索单词 - 数据结构设计【中等】","link":"/TNotes.leetcode/0211. 添加与搜索单词 - 数据结构设计【中等】/README"},{"text":"⏰ 0212. 单词搜索 II【困难】","link":"/TNotes.leetcode/0212. 单词搜索 II【困难】/README"},{"text":"⏰ 0213. 打家劫舍 II【中等】","link":"/TNotes.leetcode/0213. 打家劫舍 II【中等】/README"},{"text":"⏰ 0214. 最短回文串【困难】","link":"/TNotes.leetcode/0214. 最短回文串【困难】/README"},{"text":"⏰ 0215. 数组中的第K个最大元素【中等】","link":"/TNotes.leetcode/0215. 数组中的第K个最大元素【中等】/README"},{"text":"⏰ 0216. 组合总和 III【中等】","link":"/TNotes.leetcode/0216. 组合总和 III【中等】/README"},{"text":"⏰ 0217. 存在重复元素【简单】","link":"/TNotes.leetcode/0217. 存在重复元素【简单】/README"},{"text":"⏰ 0218. 天际线问题【困难】","link":"/TNotes.leetcode/0218. 天际线问题【困难】/README"},{"text":"⏰ 0219. 存在重复元素 II【简单】","link":"/TNotes.leetcode/0219. 存在重复元素 II【简单】/README"},{"text":"⏰ 0220. 存在重复元素 III【困难】","link":"/TNotes.leetcode/0220. 存在重复元素 III【困难】/README"},{"text":"⏰ 0221. 最大正方形【中等】","link":"/TNotes.leetcode/0221. 最大正方形【中等】/README"},{"text":"⏰ 0222. 完全二叉树的节点个数【简单】","link":"/TNotes.leetcode/0222. 完全二叉树的节点个数【简单】/README"},{"text":"⏰ 0223. 矩形面积【中等】","link":"/TNotes.leetcode/0223. 矩形面积【中等】/README"},{"text":"⏰ 0224. 基本计算器【困难】","link":"/TNotes.leetcode/0224. 基本计算器【困难】/README"},{"text":"⏰ 0225. 用队列实现栈【简单】","link":"/TNotes.leetcode/0225. 用队列实现栈【简单】/README"},{"text":"⏰ 0226. 翻转二叉树【简单】","link":"/TNotes.leetcode/0226. 翻转二叉树【简单】/README"},{"text":"⏰ 0227. 基本计算器 II【中等】","link":"/TNotes.leetcode/0227. 基本计算器 II【中等】/README"},{"text":"⏰ 0228. 汇总区间【简单】","link":"/TNotes.leetcode/0228. 汇总区间【简单】/README"},{"text":"⏰ 0229. 多数元素 II【中等】","link":"/TNotes.leetcode/0229. 多数元素 II【中等】/README"},{"text":"⏰ 0230. 二叉搜索树中第 K 小的元素【中等】","link":"/TNotes.leetcode/0230. 二叉搜索树中第 K 小的元素【中等】/README"},{"text":"⏰ 0231. 2 的幂【简单】","link":"/TNotes.leetcode/0231. 2 的幂【简单】/README"},{"text":"⏰ 0232. 用栈实现队列【简单】","link":"/TNotes.leetcode/0232. 用栈实现队列【简单】/README"},{"text":"⏰ 0233. 数字 1 的个数【困难】","link":"/TNotes.leetcode/0233. 数字 1 的个数【困难】/README"},{"text":"⏰ 0234. 回文链表【简单】","link":"/TNotes.leetcode/0234. 回文链表【简单】/README"},{"text":"⏰ 0235. 二叉搜索树的最近公共祖先【中等】","link":"/TNotes.leetcode/0235. 二叉搜索树的最近公共祖先【中等】/README"},{"text":"⏰ 0236. 二叉树的最近公共祖先【中等】","link":"/TNotes.leetcode/0236. 二叉树的最近公共祖先【中等】/README"},{"text":"⏰ 0237. 删除链表中的节点【中等】","link":"/TNotes.leetcode/0237. 删除链表中的节点【中等】/README"},{"text":"⏰ 0238. 除自身以外数组的乘积【中等】","link":"/TNotes.leetcode/0238. 除自身以外数组的乘积【中等】/README"},{"text":"⏰ 0239. 滑动窗口最大值【困难】","link":"/TNotes.leetcode/0239. 滑动窗口最大值【困难】/README"},{"text":"⏰ 0240. 搜索二维矩阵 II【中等】","link":"/TNotes.leetcode/0240. 搜索二维矩阵 II【中等】/README"},{"text":"⏰ 0241. 为运算表达式设计优先级【中等】","link":"/TNotes.leetcode/0241. 为运算表达式设计优先级【中等】/README"},{"text":"⏰ 0242. 有效的字母异位词【简单】","link":"/TNotes.leetcode/0242. 有效的字母异位词【简单】/README"},{"text":"⏰ 0243. 最短单词距离【简单】","link":"/TNotes.leetcode/0243. 最短单词距离【简单】/README"},{"text":"⏰ 0244. 最短单词距离 II【中等】","link":"/TNotes.leetcode/0244. 最短单词距离 II【中等】/README"},{"text":"⏰ 0245. 最短单词距离 III【中等】","link":"/TNotes.leetcode/0245. 最短单词距离 III【中等】/README"},{"text":"⏰ 0246. 中心对称数【简单】","link":"/TNotes.leetcode/0246. 中心对称数【简单】/README"},{"text":"⏰ 0247. 中心对称数 II【中等】","link":"/TNotes.leetcode/0247. 中心对称数 II【中等】/README"},{"text":"⏰ 0248. 中心对称数 III【困难】","link":"/TNotes.leetcode/0248. 中心对称数 III【困难】/README"},{"text":"⏰ 0249. 移位字符串分组【中等】","link":"/TNotes.leetcode/0249. 移位字符串分组【中等】/README"},{"text":"⏰ 0250. 统计同值子树【中等】","link":"/TNotes.leetcode/0250. 统计同值子树【中等】/README"},{"text":"⏰ 0251. 展开二维向量【中等】","link":"/TNotes.leetcode/0251. 展开二维向量【中等】/README"},{"text":"⏰ 0252. 会议室【简单】","link":"/TNotes.leetcode/0252. 会议室【简单】/README"},{"text":"⏰ 0253. 会议室 II【中等】","link":"/TNotes.leetcode/0253. 会议室 II【中等】/README"},{"text":"⏰ 0254. 因子的组合【中等】","link":"/TNotes.leetcode/0254. 因子的组合【中等】/README"},{"text":"⏰ 0255. 验证二叉搜索树的前序遍历序列【中等】","link":"/TNotes.leetcode/0255. 验证二叉搜索树的前序遍历序列【中等】/README"},{"text":"⏰ 0256. 粉刷房子【中等】","link":"/TNotes.leetcode/0256. 粉刷房子【中等】/README"},{"text":"⏰ 0257. 二叉树的所有路径【简单】","link":"/TNotes.leetcode/0257. 二叉树的所有路径【简单】/README"},{"text":"⏰ 0258. 各位相加【简单】","link":"/TNotes.leetcode/0258. 各位相加【简单】/README"},{"text":"⏰ 0259. 较小的三数之和【中等】","link":"/TNotes.leetcode/0259. 较小的三数之和【中等】/README"},{"text":"⏰ 0260. 只出现一次的数字 III【中等】","link":"/TNotes.leetcode/0260. 只出现一次的数字 III【中等】/README"},{"text":"⏰ 0261. 以图判树【中等】","link":"/TNotes.leetcode/0261. 以图判树【中等】/README"},{"text":"⏰ 0262. 行程和用户【困难】","link":"/TNotes.leetcode/0262. 行程和用户【困难】/README"},{"text":"⏰ 0263. 丑数【简单】","link":"/TNotes.leetcode/0263. 丑数【简单】/README"},{"text":"⏰ 0264. 丑数 II【中等】","link":"/TNotes.leetcode/0264. 丑数 II【中等】/README"},{"text":"⏰ 0265. 粉刷房子 II【困难】","link":"/TNotes.leetcode/0265. 粉刷房子 II【困难】/README"},{"text":"⏰ 0266. 回文排列【简单】","link":"/TNotes.leetcode/0266. 回文排列【简单】/README"},{"text":"⏰ 0267. 回文排列 II【中等】","link":"/TNotes.leetcode/0267. 回文排列 II【中等】/README"},{"text":"⏰ 0268. 丢失的数字【简单】","link":"/TNotes.leetcode/0268. 丢失的数字【简单】/README"},{"text":"⏰ 0269. 火星词典【困难】","link":"/TNotes.leetcode/0269. 火星词典【困难】/README"},{"text":"⏰ 0270. 最接近的二叉搜索树值【简单】","link":"/TNotes.leetcode/0270. 最接近的二叉搜索树值【简单】/README"},{"text":"⏰ 0271. 字符串的编码与解码【中等】","link":"/TNotes.leetcode/0271. 字符串的编码与解码【中等】/README"},{"text":"⏰ 0272. 最接近的二叉搜索树值 II【困难】","link":"/TNotes.leetcode/0272. 最接近的二叉搜索树值 II【困难】/README"},{"text":"⏰ 0273. 整数转换英文表示【困难】","link":"/TNotes.leetcode/0273. 整数转换英文表示【困难】/README"},{"text":"⏰ 0274. H 指数【中等】","link":"/TNotes.leetcode/0274. H 指数【中等】/README"},{"text":"⏰ 0275. H 指数 II【中等】","link":"/TNotes.leetcode/0275. H 指数 II【中等】/README"},{"text":"⏰ 0276. 栅栏涂色【中等】","link":"/TNotes.leetcode/0276. 栅栏涂色【中等】/README"},{"text":"⏰ 0277. 搜寻名人【中等】","link":"/TNotes.leetcode/0277. 搜寻名人【中等】/README"},{"text":"⏰ 0278. 第一个错误的版本【简单】","link":"/TNotes.leetcode/0278. 第一个错误的版本【简单】/README"},{"text":"⏰ 0279. 完全平方数【中等】","link":"/TNotes.leetcode/0279. 完全平方数【中等】/README"},{"text":"⏰ 0280. 摆动排序【中等】","link":"/TNotes.leetcode/0280. 摆动排序【中等】/README"},{"text":"⏰ 0281. 锯齿迭代器【中等】","link":"/TNotes.leetcode/0281. 锯齿迭代器【中等】/README"},{"text":"⏰ 0282. 给表达式添加运算符【困难】","link":"/TNotes.leetcode/0282. 给表达式添加运算符【困难】/README"},{"text":"⏰ 0283. 移动零【简单】","link":"/TNotes.leetcode/0283. 移动零【简单】/README"},{"text":"⏰ 0284. 窥视迭代器【中等】","link":"/TNotes.leetcode/0284. 窥视迭代器【中等】/README"},{"text":"⏰ 0285. 二叉搜索树中的中序后继【中等】","link":"/TNotes.leetcode/0285. 二叉搜索树中的中序后继【中等】/README"},{"text":"⏰ 0286. 墙与门【中等】","link":"/TNotes.leetcode/0286. 墙与门【中等】/README"},{"text":"⏰ 0287. 寻找重复数【中等】","link":"/TNotes.leetcode/0287. 寻找重复数【中等】/README"},{"text":"⏰ 0288. 单词的唯一缩写【中等】","link":"/TNotes.leetcode/0288. 单词的唯一缩写【中等】/README"},{"text":"⏰ 0289. 生命游戏【中等】","link":"/TNotes.leetcode/0289. 生命游戏【中等】/README"},{"text":"⏰ 0290. 单词规律【简单】","link":"/TNotes.leetcode/0290. 单词规律【简单】/README"},{"text":"⏰ 0291. 单词规律 II【中等】","link":"/TNotes.leetcode/0291. 单词规律 II【中等】/README"},{"text":"⏰ 0292. Nim 游戏【简单】","link":"/TNotes.leetcode/0292. Nim 游戏【简单】/README"},{"text":"⏰ 0293. 翻转游戏【简单】","link":"/TNotes.leetcode/0293. 翻转游戏【简单】/README"},{"text":"⏰ 0294. 翻转游戏 II【中等】","link":"/TNotes.leetcode/0294. 翻转游戏 II【中等】/README"},{"text":"⏰ 0295. 数据流的中位数【困难】","link":"/TNotes.leetcode/0295. 数据流的中位数【困难】/README"},{"text":"⏰ 0296. 最佳的碰头地点【困难】","link":"/TNotes.leetcode/0296. 最佳的碰头地点【困难】/README"},{"text":"⏰ 0297. 二叉树的序列化与反序列化【困难】","link":"/TNotes.leetcode/0297. 二叉树的序列化与反序列化【困难】/README"},{"text":"⏰ 0298. 二叉树最长连续序列【中等】","link":"/TNotes.leetcode/0298. 二叉树最长连续序列【中等】/README"},{"text":"⏰ 0299. 猜数字游戏【中等】","link":"/TNotes.leetcode/0299. 猜数字游戏【中等】/README"},{"text":"⏰ 0300. 最长递增子序列【中等】","link":"/TNotes.leetcode/0300. 最长递增子序列【中等】/README"},{"text":"⏰ 0301. 删除无效的括号【困难】","link":"/TNotes.leetcode/0301. 删除无效的括号【困难】/README"},{"text":"⏰ 0302. 包含全部黑色像素的最小矩形【困难】","link":"/TNotes.leetcode/0302. 包含全部黑色像素的最小矩形【困难】/README"},{"text":"⏰ 0303. 区域和检索 - 数组不可变【简单】","link":"/TNotes.leetcode/0303. 区域和检索 - 数组不可变【简单】/README"},{"text":"⏰ 0304. 二维区域和检索 - 矩阵不可变【中等】","link":"/TNotes.leetcode/0304. 二维区域和检索 - 矩阵不可变【中等】/README"},{"text":"⏰ 0305. 岛屿数量 II【困难】","link":"/TNotes.leetcode/0305. 岛屿数量 II【困难】/README"},{"text":"⏰ 0306. 累加数【中等】","link":"/TNotes.leetcode/0306. 累加数【中等】/README"},{"text":"⏰ 0307. 区域和检索 - 数组可修改【中等】","link":"/TNotes.leetcode/0307. 区域和检索 - 数组可修改【中等】/README"},{"text":"⏰ 0308. 二维区域和检索 - 矩阵可修改【中等】","link":"/TNotes.leetcode/0308. 二维区域和检索 - 矩阵可修改【中等】/README"},{"text":"⏰ 0309. 买卖股票的最佳时机含冷冻期【中等】","link":"/TNotes.leetcode/0309. 买卖股票的最佳时机含冷冻期【中等】/README"},{"text":"⏰ 0310. 最小高度树【中等】","link":"/TNotes.leetcode/0310. 最小高度树【中等】/README"},{"text":"⏰ 0311. 稀疏矩阵的乘法【中等】","link":"/TNotes.leetcode/0311. 稀疏矩阵的乘法【中等】/README"},{"text":"⏰ 0312. 戳气球【困难】","link":"/TNotes.leetcode/0312. 戳气球【困难】/README"},{"text":"⏰ 0313. 超级丑数【中等】","link":"/TNotes.leetcode/0313. 超级丑数【中等】/README"},{"text":"⏰ 0314. 二叉树的垂直遍历【中等】","link":"/TNotes.leetcode/0314. 二叉树的垂直遍历【中等】/README"},{"text":"⏰ 0315. 计算右侧小于当前元素的个数【困难】","link":"/TNotes.leetcode/0315. 计算右侧小于当前元素的个数【困难】/README"},{"text":"⏰ 0316. 去除重复字母【中等】","link":"/TNotes.leetcode/0316. 去除重复字母【中等】/README"},{"text":"⏰ 0317. 离建筑物最近的距离【困难】","link":"/TNotes.leetcode/0317. 离建筑物最近的距离【困难】/README"},{"text":"⏰ 0318. 最大单词长度乘积【中等】","link":"/TNotes.leetcode/0318. 最大单词长度乘积【中等】/README"},{"text":"⏰ 0319. 灯泡开关【中等】","link":"/TNotes.leetcode/0319. 灯泡开关【中等】/README"},{"text":"⏰ 0320. 列举单词的全部缩写【中等】","link":"/TNotes.leetcode/0320. 列举单词的全部缩写【中等】/README"},{"text":"⏰ 0321. 拼接最大数【困难】","link":"/TNotes.leetcode/0321. 拼接最大数【困难】/README"},{"text":"⏰ 0322. 零钱兑换【中等】","link":"/TNotes.leetcode/0322. 零钱兑换【中等】/README"},{"text":"⏰ 0323. 无向图中连通分量的数目【中等】","link":"/TNotes.leetcode/0323. 无向图中连通分量的数目【中等】/README"},{"text":"⏰ 0324. 摆动排序 II【中等】","link":"/TNotes.leetcode/0324. 摆动排序 II【中等】/README"},{"text":"⏰ 0325. 和等于 k 的最长子数组长度【中等】","link":"/TNotes.leetcode/0325. 和等于 k 的最长子数组长度【中等】/README"},{"text":"⏰ 0326. 3 的幂【简单】","link":"/TNotes.leetcode/0326. 3 的幂【简单】/README"},{"text":"⏰ 0327. 区间和的个数【困难】","link":"/TNotes.leetcode/0327. 区间和的个数【困难】/README"},{"text":"⏰ 0328. 奇偶链表【中等】","link":"/TNotes.leetcode/0328. 奇偶链表【中等】/README"},{"text":"⏰ 0329. 矩阵中的最长递增路径【困难】","link":"/TNotes.leetcode/0329. 矩阵中的最长递增路径【困难】/README"},{"text":"⏰ 0330. 按要求补齐数组【困难】","link":"/TNotes.leetcode/0330. 按要求补齐数组【困难】/README"},{"text":"⏰ 0331. 验证二叉树的前序序列化【中等】","link":"/TNotes.leetcode/0331. 验证二叉树的前序序列化【中等】/README"},{"text":"⏰ 0332. 重新安排行程【困难】","link":"/TNotes.leetcode/0332. 重新安排行程【困难】/README"},{"text":"⏰ 0333. 最大二叉搜索子树【中等】","link":"/TNotes.leetcode/0333. 最大二叉搜索子树【中等】/README"},{"text":"⏰ 0334. 递增的三元子序列【中等】","link":"/TNotes.leetcode/0334. 递增的三元子序列【中等】/README"},{"text":"⏰ 0335. 路径交叉【困难】","link":"/TNotes.leetcode/0335. 路径交叉【困难】/README"},{"text":"⏰ 0336. 回文对【困难】","link":"/TNotes.leetcode/0336. 回文对【困难】/README"},{"text":"⏰ 0337. 打家劫舍 III【中等】","link":"/TNotes.leetcode/0337. 打家劫舍 III【中等】/README"},{"text":"⏰ 0338. 比特位计数【简单】","link":"/TNotes.leetcode/0338. 比特位计数【简单】/README"},{"text":"⏰ 0339. 嵌套列表加权和【中等】","link":"/TNotes.leetcode/0339. 嵌套列表加权和【中等】/README"},{"text":"⏰ 0340. 至多包含 K 个不同字符的最长子串【中等】","link":"/TNotes.leetcode/0340. 至多包含 K 个不同字符的最长子串【中等】/README"},{"text":"⏰ 0341. 扁平化嵌套列表迭代器【中等】","link":"/TNotes.leetcode/0341. 扁平化嵌套列表迭代器【中等】/README"},{"text":"⏰ 0342. 4的幂【简单】","link":"/TNotes.leetcode/0342. 4的幂【简单】/README"},{"text":"⏰ 0343. 整数拆分【中等】","link":"/TNotes.leetcode/0343. 整数拆分【中等】/README"},{"text":"⏰ 0344. 反转字符串【简单】","link":"/TNotes.leetcode/0344. 反转字符串【简单】/README"},{"text":"⏰ 0345. 反转字符串中的元音字母【简单】","link":"/TNotes.leetcode/0345. 反转字符串中的元音字母【简单】/README"},{"text":"⏰ 0346. 数据流中的移动平均值【简单】","link":"/TNotes.leetcode/0346. 数据流中的移动平均值【简单】/README"},{"text":"⏰ 0347. 前 K 个高频元素【中等】","link":"/TNotes.leetcode/0347. 前 K 个高频元素【中等】/README"},{"text":"⏰ 0348. 设计井字棋【中等】","link":"/TNotes.leetcode/0348. 设计井字棋【中等】/README"},{"text":"⏰ 0349. 两个数组的交集【简单】","link":"/TNotes.leetcode/0349. 两个数组的交集【简单】/README"},{"text":"⏰ 0350. 两个数组的交集 II【简单】","link":"/TNotes.leetcode/0350. 两个数组的交集 II【简单】/README"},{"text":"⏰ 0351. 安卓系统手势解锁【中等】","link":"/TNotes.leetcode/0351. 安卓系统手势解锁【中等】/README"},{"text":"⏰ 0352. 将数据流变为多个不相交区间【困难】","link":"/TNotes.leetcode/0352. 将数据流变为多个不相交区间【困难】/README"},{"text":"⏰ 0353. 贪吃蛇【中等】","link":"/TNotes.leetcode/0353. 贪吃蛇【中等】/README"},{"text":"⏰ 0354. 俄罗斯套娃信封问题【困难】","link":"/TNotes.leetcode/0354. 俄罗斯套娃信封问题【困难】/README"},{"text":"⏰ 0355. 设计推特【中等】","link":"/TNotes.leetcode/0355. 设计推特【中等】/README"},{"text":"⏰ 0356. 直线镜像【中等】","link":"/TNotes.leetcode/0356. 直线镜像【中等】/README"},{"text":"⏰ 0357. 统计各位数字都不同的数字个数【中等】","link":"/TNotes.leetcode/0357. 统计各位数字都不同的数字个数【中等】/README"},{"text":"⏰ 0358. K 距离间隔重排字符串【困难】","link":"/TNotes.leetcode/0358. K 距离间隔重排字符串【困难】/README"},{"text":"⏰ 0359. 日志速率限制器【简单】","link":"/TNotes.leetcode/0359. 日志速率限制器【简单】/README"},{"text":"⏰ 0360. 有序转化数组【中等】","link":"/TNotes.leetcode/0360. 有序转化数组【中等】/README"},{"text":"⏰ 0361. 轰炸敌人【中等】","link":"/TNotes.leetcode/0361. 轰炸敌人【中等】/README"},{"text":"⏰ 0362. 敲击计数器【中等】","link":"/TNotes.leetcode/0362. 敲击计数器【中等】/README"},{"text":"⏰ 0363. 矩形区域不超过 K 的最大数值和【困难】","link":"/TNotes.leetcode/0363. 矩形区域不超过 K 的最大数值和【困难】/README"},{"text":"⏰ 0364. 嵌套列表加权和 II【中等】","link":"/TNotes.leetcode/0364. 嵌套列表加权和 II【中等】/README"},{"text":"⏰ 0365. 水壶问题【中等】","link":"/TNotes.leetcode/0365. 水壶问题【中等】/README"},{"text":"⏰ 0366. 寻找二叉树的叶子节点【中等】","link":"/TNotes.leetcode/0366. 寻找二叉树的叶子节点【中等】/README"},{"text":"⏰ 0367. 有效的完全平方数【简单】","link":"/TNotes.leetcode/0367. 有效的完全平方数【简单】/README"},{"text":"⏰ 0368. 最大整除子集【中等】","link":"/TNotes.leetcode/0368. 最大整除子集【中等】/README"},{"text":"⏰ 0369. 给单链表加一【中等】","link":"/TNotes.leetcode/0369. 给单链表加一【中等】/README"},{"text":"⏰ 0370. 区间加法【中等】","link":"/TNotes.leetcode/0370. 区间加法【中等】/README"},{"text":"⏰ 0371. 两整数之和【中等】","link":"/TNotes.leetcode/0371. 两整数之和【中等】/README"},{"text":"⏰ 0372. 超级次方【中等】","link":"/TNotes.leetcode/0372. 超级次方【中等】/README"},{"text":"⏰ 0373. 查找和最小的 K 对数字【中等】","link":"/TNotes.leetcode/0373. 查找和最小的 K 对数字【中等】/README"},{"text":"⏰ 0374. 猜数字大小【简单】","link":"/TNotes.leetcode/0374. 猜数字大小【简单】/README"},{"text":"⏰ 0375. 猜数字大小 II【中等】","link":"/TNotes.leetcode/0375. 猜数字大小 II【中等】/README"},{"text":"⏰ 0376. 摆动序列【中等】","link":"/TNotes.leetcode/0376. 摆动序列【中等】/README"},{"text":"⏰ 0377. 组合总和 Ⅳ【中等】","link":"/TNotes.leetcode/0377. 组合总和 Ⅳ【中等】/README"},{"text":"⏰ 0378. 有序矩阵中第 K 小的元素【中等】","link":"/TNotes.leetcode/0378. 有序矩阵中第 K 小的元素【中等】/README"},{"text":"⏰ 0379. 电话目录管理系统【中等】","link":"/TNotes.leetcode/0379. 电话目录管理系统【中等】/README"},{"text":"⏰ 0380. O(1) 时间插入、删除和获取随机元素【中等】","link":"/TNotes.leetcode/0380. O(1) 时间插入、删除和获取随机元素【中等】/README"},{"text":"⏰ 0381. O(1) 时间插入、删除和获取随机元素 - 允许重复【困难】","link":"/TNotes.leetcode/0381. O(1) 时间插入、删除和获取随机元素 - 允许重复【困难】/README"},{"text":"⏰ 0382. 链表随机节点【中等】","link":"/TNotes.leetcode/0382. 链表随机节点【中等】/README"},{"text":"⏰ 0383. 赎金信【简单】","link":"/TNotes.leetcode/0383. 赎金信【简单】/README"},{"text":"⏰ 0384. 打乱数组【中等】","link":"/TNotes.leetcode/0384. 打乱数组【中等】/README"},{"text":"⏰ 0385. 迷你语法分析器【中等】","link":"/TNotes.leetcode/0385. 迷你语法分析器【中等】/README"},{"text":"⏰ 0386. 字典序排数【中等】","link":"/TNotes.leetcode/0386. 字典序排数【中等】/README"},{"text":"⏰ 0387. 字符串中的第一个唯一字符【简单】","link":"/TNotes.leetcode/0387. 字符串中的第一个唯一字符【简单】/README"},{"text":"⏰ 0388. 文件的最长绝对路径【中等】","link":"/TNotes.leetcode/0388. 文件的最长绝对路径【中等】/README"},{"text":"⏰ 0389. 找不同【简单】","link":"/TNotes.leetcode/0389. 找不同【简单】/README"},{"text":"⏰ 0390. 消除游戏【中等】","link":"/TNotes.leetcode/0390. 消除游戏【中等】/README"},{"text":"⏰ 0391. 完美矩形【困难】","link":"/TNotes.leetcode/0391. 完美矩形【困难】/README"},{"text":"⏰ 0392. 判断子序列【简单】","link":"/TNotes.leetcode/0392. 判断子序列【简单】/README"},{"text":"⏰ 0393. UTF-8 编码验证【中等】","link":"/TNotes.leetcode/0393. UTF-8 编码验证【中等】/README"},{"text":"⏰ 0394. 字符串解码【中等】","link":"/TNotes.leetcode/0394. 字符串解码【中等】/README"},{"text":"⏰ 0395. 至少有 K 个重复字符的最长子串【中等】","link":"/TNotes.leetcode/0395. 至少有 K 个重复字符的最长子串【中等】/README"},{"text":"⏰ 0396. 旋转函数【中等】","link":"/TNotes.leetcode/0396. 旋转函数【中等】/README"},{"text":"⏰ 0397. 整数替换【中等】","link":"/TNotes.leetcode/0397. 整数替换【中等】/README"},{"text":"⏰ 0398. 随机数索引【中等】","link":"/TNotes.leetcode/0398. 随机数索引【中等】/README"},{"text":"⏰ 0399. 除法求值【中等】","link":"/TNotes.leetcode/0399. 除法求值【中等】/README"},{"text":"⏰ 0400. 第 N 位数字【中等】","link":"/TNotes.leetcode/0400. 第 N 位数字【中等】/README"},{"text":"⏰ 0401. 二进制手表【简单】","link":"/TNotes.leetcode/0401. 二进制手表【简单】/README"},{"text":"⏰ 0402. 移掉 K 位数字【中等】","link":"/TNotes.leetcode/0402. 移掉 K 位数字【中等】/README"},{"text":"⏰ 0403. 青蛙过河【困难】","link":"/TNotes.leetcode/0403. 青蛙过河【困难】/README"},{"text":"⏰ 0404. 左叶子之和【简单】","link":"/TNotes.leetcode/0404. 左叶子之和【简单】/README"},{"text":"⏰ 0405. 数字转换为十六进制数【简单】","link":"/TNotes.leetcode/0405. 数字转换为十六进制数【简单】/README"},{"text":"⏰ 0406. 根据身高重建队列【中等】","link":"/TNotes.leetcode/0406. 根据身高重建队列【中等】/README"},{"text":"⏰ 0407. 接雨水 II【困难】","link":"/TNotes.leetcode/0407. 接雨水 II【困难】/README"},{"text":"⏰ 0408. 有效单词缩写【简单】","link":"/TNotes.leetcode/0408. 有效单词缩写【简单】/README"},{"text":"⏰ 0409. 最长回文串【简单】","link":"/TNotes.leetcode/0409. 最长回文串【简单】/README"},{"text":"⏰ 0410. 分割数组的最大值【困难】","link":"/TNotes.leetcode/0410. 分割数组的最大值【困难】/README"},{"text":"⏰ 0411. 最短独占单词缩写【困难】","link":"/TNotes.leetcode/0411. 最短独占单词缩写【困难】/README"},{"text":"⏰ 0412. Fizz Buzz【简单】","link":"/TNotes.leetcode/0412. Fizz Buzz【简单】/README"},{"text":"⏰ 0413. 等差数列划分【中等】","link":"/TNotes.leetcode/0413. 等差数列划分【中等】/README"},{"text":"⏰ 0414. 第三大的数【简单】","link":"/TNotes.leetcode/0414. 第三大的数【简单】/README"},{"text":"⏰ 0415. 字符串相加【简单】","link":"/TNotes.leetcode/0415. 字符串相加【简单】/README"},{"text":"⏰ 0416. 分割等和子集【中等】","link":"/TNotes.leetcode/0416. 分割等和子集【中等】/README"},{"text":"⏰ 0417. 太平洋大西洋水流问题【中等】","link":"/TNotes.leetcode/0417. 太平洋大西洋水流问题【中等】/README"},{"text":"⏰ 0418. 屏幕可显示句子的数量【中等】","link":"/TNotes.leetcode/0418. 屏幕可显示句子的数量【中等】/README"},{"text":"⏰ 0419. 棋盘上的战舰【中等】","link":"/TNotes.leetcode/0419. 棋盘上的战舰【中等】/README"},{"text":"⏰ 0420. 强密码检验器【困难】","link":"/TNotes.leetcode/0420. 强密码检验器【困难】/README"},{"text":"⏰ 0421. 数组中两个数的最大异或值【中等】","link":"/TNotes.leetcode/0421. 数组中两个数的最大异或值【中等】/README"},{"text":"⏰ 0422. 有效的单词方块【简单】","link":"/TNotes.leetcode/0422. 有效的单词方块【简单】/README"},{"text":"⏰ 0423. 从英文中重建数字【中等】","link":"/TNotes.leetcode/0423. 从英文中重建数字【中等】/README"},{"text":"⏰ 0424. 替换后的最长重复字符【中等】","link":"/TNotes.leetcode/0424. 替换后的最长重复字符【中等】/README"},{"text":"⏰ 0425. 单词方块【困难】","link":"/TNotes.leetcode/0425. 单词方块【困难】/README"},{"text":"⏰ 0426. 将二叉搜索树转化为排序的双向链表【中等】","link":"/TNotes.leetcode/0426. 将二叉搜索树转化为排序的双向链表【中等】/README"},{"text":"⏰ 0427. 建立四叉树【中等】","link":"/TNotes.leetcode/0427. 建立四叉树【中等】/README"},{"text":"⏰ 0428. 序列化和反序列化 N 叉树【困难】","link":"/TNotes.leetcode/0428. 序列化和反序列化 N 叉树【困难】/README"},{"text":"⏰ 0429. N 叉树的层序遍历【中等】","link":"/TNotes.leetcode/0429. N 叉树的层序遍历【中等】/README"},{"text":"⏰ 0430. 扁平化多级双向链表【中等】","link":"/TNotes.leetcode/0430. 扁平化多级双向链表【中等】/README"},{"text":"⏰ 0431. 将 N 叉树编码为二叉树【困难】","link":"/TNotes.leetcode/0431. 将 N 叉树编码为二叉树【困难】/README"},{"text":"⏰ 0432. 全 O(1) 的数据结构【困难】","link":"/TNotes.leetcode/0432. 全 O(1) 的数据结构【困难】/README"},{"text":"⏰ 0433. 最小基因变化【中等】","link":"/TNotes.leetcode/0433. 最小基因变化【中等】/README"},{"text":"⏰ 0434. 字符串中的单词数【简单】","link":"/TNotes.leetcode/0434. 字符串中的单词数【简单】/README"},{"text":"⏰ 0435. 无重叠区间【中等】","link":"/TNotes.leetcode/0435. 无重叠区间【中等】/README"},{"text":"⏰ 0436. 寻找右区间【中等】","link":"/TNotes.leetcode/0436. 寻找右区间【中等】/README"},{"text":"⏰ 0437. 路径总和 III【中等】","link":"/TNotes.leetcode/0437. 路径总和 III【中等】/README"},{"text":"⏰ 0438. 找到字符串中所有字母异位词【中等】","link":"/TNotes.leetcode/0438. 找到字符串中所有字母异位词【中等】/README"},{"text":"⏰ 0439. 三元表达式解析器【中等】","link":"/TNotes.leetcode/0439. 三元表达式解析器【中等】/README"},{"text":"⏰ 0440. 字典序的第K小数字【困难】","link":"/TNotes.leetcode/0440. 字典序的第K小数字【困难】/README"},{"text":"⏰ 0441. 排列硬币【简单】","link":"/TNotes.leetcode/0441. 排列硬币【简单】/README"},{"text":"⏰ 0442. 数组中重复的数据【中等】","link":"/TNotes.leetcode/0442. 数组中重复的数据【中等】/README"},{"text":"⏰ 0443. 压缩字符串【中等】","link":"/TNotes.leetcode/0443. 压缩字符串【中等】/README"},{"text":"⏰ 0444. 序列重建【中等】","link":"/TNotes.leetcode/0444. 序列重建【中等】/README"},{"text":"⏰ 0445. 两数相加 II【中等】","link":"/TNotes.leetcode/0445. 两数相加 II【中等】/README"},{"text":"⏰ 0446. 等差数列划分 II - 子序列【困难】","link":"/TNotes.leetcode/0446. 等差数列划分 II - 子序列【困难】/README"},{"text":"⏰ 0447. 回旋镖的数量【中等】","link":"/TNotes.leetcode/0447. 回旋镖的数量【中等】/README"},{"text":"⏰ 0448. 找到所有数组中消失的数字【简单】","link":"/TNotes.leetcode/0448. 找到所有数组中消失的数字【简单】/README"},{"text":"⏰ 0449. 序列化和反序列化二叉搜索树【中等】","link":"/TNotes.leetcode/0449. 序列化和反序列化二叉搜索树【中等】/README"},{"text":"⏰ 0450. 删除二叉搜索树中的节点【中等】","link":"/TNotes.leetcode/0450. 删除二叉搜索树中的节点【中等】/README"},{"text":"⏰ 0451. 根据字符出现频率排序【中等】","link":"/TNotes.leetcode/0451. 根据字符出现频率排序【中等】/README"},{"text":"⏰ 0452. 用最少数量的箭引爆气球【中等】","link":"/TNotes.leetcode/0452. 用最少数量的箭引爆气球【中等】/README"},{"text":"⏰ 0453. 最小操作次数使数组元素相等【中等】","link":"/TNotes.leetcode/0453. 最小操作次数使数组元素相等【中等】/README"},{"text":"⏰ 0454. 四数相加 II【中等】","link":"/TNotes.leetcode/0454. 四数相加 II【中等】/README"},{"text":"⏰ 0455. 分发饼干【简单】","link":"/TNotes.leetcode/0455. 分发饼干【简单】/README"},{"text":"⏰ 0456. 132 模式【中等】","link":"/TNotes.leetcode/0456. 132 模式【中等】/README"},{"text":"⏰ 0457. 环形数组是否存在循环【中等】","link":"/TNotes.leetcode/0457. 环形数组是否存在循环【中等】/README"},{"text":"⏰ 0458. 可怜的小猪【困难】","link":"/TNotes.leetcode/0458. 可怜的小猪【困难】/README"},{"text":"⏰ 0459. 重复的子字符串【简单】","link":"/TNotes.leetcode/0459. 重复的子字符串【简单】/README"},{"text":"⏰ 0460. LFU 缓存【困难】","link":"/TNotes.leetcode/0460. LFU 缓存【困难】/README"},{"text":"⏰ 0461. 汉明距离【简单】","link":"/TNotes.leetcode/0461. 汉明距离【简单】/README"},{"text":"⏰ 0462. 最小操作次数使数组元素相等 II【中等】","link":"/TNotes.leetcode/0462. 最小操作次数使数组元素相等 II【中等】/README"},{"text":"⏰ 0463. 岛屿的周长【简单】","link":"/TNotes.leetcode/0463. 岛屿的周长【简单】/README"},{"text":"⏰ 0464. 我能赢吗【中等】","link":"/TNotes.leetcode/0464. 我能赢吗【中等】/README"},{"text":"⏰ 0465. 最优账单平衡【困难】","link":"/TNotes.leetcode/0465. 最优账单平衡【困难】/README"},{"text":"⏰ 0466. 统计重复个数【困难】","link":"/TNotes.leetcode/0466. 统计重复个数【困难】/README"},{"text":"⏰ 0467. 环绕字符串中唯一的子字符串【中等】","link":"/TNotes.leetcode/0467. 环绕字符串中唯一的子字符串【中等】/README"},{"text":"⏰ 0468. 验证IP地址【中等】","link":"/TNotes.leetcode/0468. 验证IP地址【中等】/README"},{"text":"⏰ 0469. 凸多边形【中等】","link":"/TNotes.leetcode/0469. 凸多边形【中等】/README"},{"text":"⏰ 0470. 用 Rand7() 实现 Rand10()【中等】","link":"/TNotes.leetcode/0470. 用 Rand7() 实现 Rand10()【中等】/README"},{"text":"⏰ 0471. 编码最短长度的字符串【困难】","link":"/TNotes.leetcode/0471. 编码最短长度的字符串【困难】/README"},{"text":"⏰ 0472. 连接词【困难】","link":"/TNotes.leetcode/0472. 连接词【困难】/README"},{"text":"⏰ 0473. 火柴拼正方形【中等】","link":"/TNotes.leetcode/0473. 火柴拼正方形【中等】/README"},{"text":"⏰ 0474. 一和零【中等】","link":"/TNotes.leetcode/0474. 一和零【中等】/README"},{"text":"⏰ 0475. 供暖器【中等】","link":"/TNotes.leetcode/0475. 供暖器【中等】/README"},{"text":"⏰ 0476. 数字的补数【简单】","link":"/TNotes.leetcode/0476. 数字的补数【简单】/README"},{"text":"⏰ 0477. 汉明距离总和【中等】","link":"/TNotes.leetcode/0477. 汉明距离总和【中等】/README"},{"text":"⏰ 0478. 在圆内随机生成点【中等】","link":"/TNotes.leetcode/0478. 在圆内随机生成点【中等】/README"},{"text":"⏰ 0479. 最大回文数乘积【困难】","link":"/TNotes.leetcode/0479. 最大回文数乘积【困难】/README"},{"text":"⏰ 0480. 滑动窗口中位数【困难】","link":"/TNotes.leetcode/0480. 滑动窗口中位数【困难】/README"},{"text":"⏰ 0481. 神奇字符串【中等】","link":"/TNotes.leetcode/0481. 神奇字符串【中等】/README"},{"text":"⏰ 0482. 密钥格式化【简单】","link":"/TNotes.leetcode/0482. 密钥格式化【简单】/README"},{"text":"⏰ 0483. 最小好进制【困难】","link":"/TNotes.leetcode/0483. 最小好进制【困难】/README"},{"text":"⏰ 0484. 寻找排列【中等】","link":"/TNotes.leetcode/0484. 寻找排列【中等】/README"},{"text":"⏰ 0485. 最大连续 1 的个数【简单】","link":"/TNotes.leetcode/0485. 最大连续 1 的个数【简单】/README"},{"text":"⏰ 0486. 预测赢家【中等】","link":"/TNotes.leetcode/0486. 预测赢家【中等】/README"},{"text":"⏰ 0487. 最大连续1的个数 II【中等】","link":"/TNotes.leetcode/0487. 最大连续1的个数 II【中等】/README"},{"text":"⏰ 0488. 祖玛游戏【困难】","link":"/TNotes.leetcode/0488. 祖玛游戏【困难】/README"},{"text":"⏰ 0489. 扫地机器人【困难】","link":"/TNotes.leetcode/0489. 扫地机器人【困难】/README"},{"text":"⏰ 0490. 迷宫【中等】","link":"/TNotes.leetcode/0490. 迷宫【中等】/README"},{"text":"⏰ 0491. 非递减子序列【中等】","link":"/TNotes.leetcode/0491. 非递减子序列【中等】/README"},{"text":"⏰ 0492. 构造矩形【简单】","link":"/TNotes.leetcode/0492. 构造矩形【简单】/README"},{"text":"⏰ 0493. 翻转对【困难】","link":"/TNotes.leetcode/0493. 翻转对【困难】/README"},{"text":"⏰ 0494. 目标和【中等】","link":"/TNotes.leetcode/0494. 目标和【中等】/README"},{"text":"⏰ 0495. 提莫攻击【简单】","link":"/TNotes.leetcode/0495. 提莫攻击【简单】/README"},{"text":"⏰ 0496. 下一个更大元素 I【简单】","link":"/TNotes.leetcode/0496. 下一个更大元素 I【简单】/README"},{"text":"⏰ 0497. 非重叠矩形中的随机点【中等】","link":"/TNotes.leetcode/0497. 非重叠矩形中的随机点【中等】/README"},{"text":"⏰ 0498. 对角线遍历【中等】","link":"/TNotes.leetcode/0498. 对角线遍历【中等】/README"},{"text":"⏰ 0499. 迷宫 III【困难】","link":"/TNotes.leetcode/0499. 迷宫 III【困难】/README"},{"text":"⏰ 0500. 键盘行【简单】","link":"/TNotes.leetcode/0500. 键盘行【简单】/README"},{"text":"⏰ 0501. 二叉搜索树中的众数【简单】","link":"/TNotes.leetcode/0501. 二叉搜索树中的众数【简单】/README"},{"text":"⏰ 0502. IPO【困难】","link":"/TNotes.leetcode/0502. IPO【困难】/README"},{"text":"⏰ 0503. 下一个更大元素 II【中等】","link":"/TNotes.leetcode/0503. 下一个更大元素 II【中等】/README"},{"text":"⏰ 0504. 七进制数【简单】","link":"/TNotes.leetcode/0504. 七进制数【简单】/README"},{"text":"⏰ 0505. 迷宫 II【中等】","link":"/TNotes.leetcode/0505. 迷宫 II【中等】/README"},{"text":"⏰ 0506. 相对名次【简单】","link":"/TNotes.leetcode/0506. 相对名次【简单】/README"},{"text":"⏰ 0507. 完美数【简单】","link":"/TNotes.leetcode/0507. 完美数【简单】/README"},{"text":"⏰ 0508. 出现次数最多的子树元素和【中等】","link":"/TNotes.leetcode/0508. 出现次数最多的子树元素和【中等】/README"},{"text":"⏰ 0509. 斐波那契数【简单】","link":"/TNotes.leetcode/0509. 斐波那契数【简单】/README"},{"text":"⏰ 0510. 二叉搜索树中的中序后继 II【中等】","link":"/TNotes.leetcode/0510. 二叉搜索树中的中序后继 II【中等】/README"},{"text":"⏰ 0511. 游戏玩法分析 I【简单】","link":"/TNotes.leetcode/0511. 游戏玩法分析 I【简单】/README"},{"text":"⏰ 0512. 游戏玩法分析 II【简单】","link":"/TNotes.leetcode/0512. 游戏玩法分析 II【简单】/README"},{"text":"⏰ 0513. 找树左下角的值【中等】","link":"/TNotes.leetcode/0513. 找树左下角的值【中等】/README"},{"text":"⏰ 0514. 自由之路【困难】","link":"/TNotes.leetcode/0514. 自由之路【困难】/README"},{"text":"⏰ 0515. 在每个树行中找最大值【中等】","link":"/TNotes.leetcode/0515. 在每个树行中找最大值【中等】/README"},{"text":"⏰ 0516. 最长回文子序列【中等】","link":"/TNotes.leetcode/0516. 最长回文子序列【中等】/README"},{"text":"⏰ 0517. 超级洗衣机【困难】","link":"/TNotes.leetcode/0517. 超级洗衣机【困难】/README"},{"text":"⏰ 0518. 零钱兑换 II【中等】","link":"/TNotes.leetcode/0518. 零钱兑换 II【中等】/README"},{"text":"⏰ 0519. 随机翻转矩阵【中等】","link":"/TNotes.leetcode/0519. 随机翻转矩阵【中等】/README"},{"text":"⏰ 0520. 检测大写字母【简单】","link":"/TNotes.leetcode/0520. 检测大写字母【简单】/README"},{"text":"⏰ 0521. 最长特殊序列 Ⅰ【简单】","link":"/TNotes.leetcode/0521. 最长特殊序列 Ⅰ【简单】/README"},{"text":"⏰ 0522. 最长特殊序列 II【中等】","link":"/TNotes.leetcode/0522. 最长特殊序列 II【中等】/README"},{"text":"⏰ 0523. 连续的子数组和【中等】","link":"/TNotes.leetcode/0523. 连续的子数组和【中等】/README"},{"text":"⏰ 0524. 通过删除字母匹配到字典里最长单词【中等】","link":"/TNotes.leetcode/0524. 通过删除字母匹配到字典里最长单词【中等】/README"},{"text":"⏰ 0525. 连续数组【中等】","link":"/TNotes.leetcode/0525. 连续数组【中等】/README"},{"text":"⏰ 0526. 优美的排列【中等】","link":"/TNotes.leetcode/0526. 优美的排列【中等】/README"},{"text":"⏰ 0527. 单词缩写【困难】","link":"/TNotes.leetcode/0527. 单词缩写【困难】/README"},{"text":"⏰ 0528. 按权重随机选择【中等】","link":"/TNotes.leetcode/0528. 按权重随机选择【中等】/README"},{"text":"⏰ 0529. 扫雷游戏【中等】","link":"/TNotes.leetcode/0529. 扫雷游戏【中等】/README"},{"text":"⏰ 0530. 二叉搜索树的最小绝对差【简单】","link":"/TNotes.leetcode/0530. 二叉搜索树的最小绝对差【简单】/README"},{"text":"⏰ 0531. 孤独像素 I【中等】","link":"/TNotes.leetcode/0531. 孤独像素 I【中等】/README"},{"text":"⏰ 0532. 数组中的 k-diff 数对【中等】","link":"/TNotes.leetcode/0532. 数组中的 k-diff 数对【中等】/README"},{"text":"⏰ 0533. 孤独像素 II【中等】","link":"/TNotes.leetcode/0533. 孤独像素 II【中等】/README"},{"text":"⏰ 0534. 游戏玩法分析 III【中等】","link":"/TNotes.leetcode/0534. 游戏玩法分析 III【中等】/README"},{"text":"⏰ 0535. TinyURL 的加密与解密【中等】","link":"/TNotes.leetcode/0535. TinyURL 的加密与解密【中等】/README"},{"text":"⏰ 0536. 从字符串生成二叉树【中等】","link":"/TNotes.leetcode/0536. 从字符串生成二叉树【中等】/README"},{"text":"⏰ 0537. 复数乘法【中等】","link":"/TNotes.leetcode/0537. 复数乘法【中等】/README"},{"text":"⏰ 0538. 把二叉搜索树转换为累加树【中等】","link":"/TNotes.leetcode/0538. 把二叉搜索树转换为累加树【中等】/README"},{"text":"⏰ 0539. 最小时间差【中等】","link":"/TNotes.leetcode/0539. 最小时间差【中等】/README"},{"text":"⏰ 0540. 有序数组中的单一元素【中等】","link":"/TNotes.leetcode/0540. 有序数组中的单一元素【中等】/README"},{"text":"⏰ 0541. 反转字符串 II【简单】","link":"/TNotes.leetcode/0541. 反转字符串 II【简单】/README"},{"text":"⏰ 0542. 01 矩阵【中等】","link":"/TNotes.leetcode/0542. 01 矩阵【中等】/README"},{"text":"⏰ 0543. 二叉树的直径【简单】","link":"/TNotes.leetcode/0543. 二叉树的直径【简单】/README"},{"text":"⏰ 0544. 输出比赛匹配对【中等】","link":"/TNotes.leetcode/0544. 输出比赛匹配对【中等】/README"},{"text":"⏰ 0545. 二叉树的边界【中等】","link":"/TNotes.leetcode/0545. 二叉树的边界【中等】/README"},{"text":"⏰ 0546. 移除盒子【困难】","link":"/TNotes.leetcode/0546. 移除盒子【困难】/README"},{"text":"⏰ 0547. 省份数量【中等】","link":"/TNotes.leetcode/0547. 省份数量【中等】/README"},{"text":"⏰ 0548. 将数组分割成和相等的子数组【困难】","link":"/TNotes.leetcode/0548. 将数组分割成和相等的子数组【困难】/README"},{"text":"⏰ 0549. 二叉树最长连续序列 II【中等】","link":"/TNotes.leetcode/0549. 二叉树最长连续序列 II【中等】/README"},{"text":"⏰ 0550. 游戏玩法分析 IV【中等】","link":"/TNotes.leetcode/0550. 游戏玩法分析 IV【中等】/README"},{"text":"⏰ 0551. 学生出勤记录 I【简单】","link":"/TNotes.leetcode/0551. 学生出勤记录 I【简单】/README"},{"text":"⏰ 0552. 学生出勤记录 II【困难】","link":"/TNotes.leetcode/0552. 学生出勤记录 II【困难】/README"},{"text":"⏰ 0553. 最优除法【中等】","link":"/TNotes.leetcode/0553. 最优除法【中等】/README"},{"text":"⏰ 0554. 砖墙【中等】","link":"/TNotes.leetcode/0554. 砖墙【中等】/README"},{"text":"⏰ 0555. 分割连接字符串【中等】","link":"/TNotes.leetcode/0555. 分割连接字符串【中等】/README"},{"text":"⏰ 0556. 下一个更大元素 III【中等】","link":"/TNotes.leetcode/0556. 下一个更大元素 III【中等】/README"},{"text":"⏰ 0557. 反转字符串中的单词 III【简单】","link":"/TNotes.leetcode/0557. 反转字符串中的单词 III【简单】/README"},{"text":"⏰ 0558. 四叉树交集【中等】","link":"/TNotes.leetcode/0558. 四叉树交集【中等】/README"},{"text":"⏰ 0559. N 叉树的最大深度【简单】","link":"/TNotes.leetcode/0559. N 叉树的最大深度【简单】/README"},{"text":"⏰ 0560. 和为 K 的子数组【中等】","link":"/TNotes.leetcode/0560. 和为 K 的子数组【中等】/README"},{"text":"⏰ 0561. 数组拆分【简单】","link":"/TNotes.leetcode/0561. 数组拆分【简单】/README"},{"text":"⏰ 0562. 矩阵中最长的连续1线段【中等】","link":"/TNotes.leetcode/0562. 矩阵中最长的连续1线段【中等】/README"},{"text":"⏰ 0563. 二叉树的坡度【简单】","link":"/TNotes.leetcode/0563. 二叉树的坡度【简单】/README"},{"text":"⏰ 0564. 寻找最近的回文数【困难】","link":"/TNotes.leetcode/0564. 寻找最近的回文数【困难】/README"},{"text":"⏰ 0565. 数组嵌套【中等】","link":"/TNotes.leetcode/0565. 数组嵌套【中等】/README"},{"text":"⏰ 0566. 重塑矩阵【简单】","link":"/TNotes.leetcode/0566. 重塑矩阵【简单】/README"},{"text":"⏰ 0567. 字符串的排列【中等】","link":"/TNotes.leetcode/0567. 字符串的排列【中等】/README"},{"text":"⏰ 0568. 最大休假天数【困难】","link":"/TNotes.leetcode/0568. 最大休假天数【困难】/README"},{"text":"⏰ 0569. 员工薪水中位数【困难】","link":"/TNotes.leetcode/0569. 员工薪水中位数【困难】/README"},{"text":"⏰ 0570. 至少有5名直接下属的经理【中等】","link":"/TNotes.leetcode/0570. 至少有5名直接下属的经理【中等】/README"},{"text":"⏰ 0571. 给定数字的频率查询中位数【困难】","link":"/TNotes.leetcode/0571. 给定数字的频率查询中位数【困难】/README"},{"text":"⏰ 0572. 另一棵树的子树【简单】","link":"/TNotes.leetcode/0572. 另一棵树的子树【简单】/README"},{"text":"⏰ 0573. 松鼠模拟【中等】","link":"/TNotes.leetcode/0573. 松鼠模拟【中等】/README"},{"text":"⏰ 0574. 当选者【中等】","link":"/TNotes.leetcode/0574. 当选者【中等】/README"},{"text":"⏰ 0575. 分糖果【简单】","link":"/TNotes.leetcode/0575. 分糖果【简单】/README"},{"text":"⏰ 0576. 出界的路径数【中等】","link":"/TNotes.leetcode/0576. 出界的路径数【中等】/README"},{"text":"⏰ 0577. 员工奖金【简单】","link":"/TNotes.leetcode/0577. 员工奖金【简单】/README"},{"text":"⏰ 0578. 查询回答率最高的问题【中等】","link":"/TNotes.leetcode/0578. 查询回答率最高的问题【中等】/README"},{"text":"⏰ 0579. 查询员工的累计薪水【困难】","link":"/TNotes.leetcode/0579. 查询员工的累计薪水【困难】/README"},{"text":"⏰ 0580. 统计各专业学生人数【中等】","link":"/TNotes.leetcode/0580. 统计各专业学生人数【中等】/README"},{"text":"⏰ 0581. 最短无序连续子数组【中等】","link":"/TNotes.leetcode/0581. 最短无序连续子数组【中等】/README"},{"text":"⏰ 0582. 杀掉进程【中等】","link":"/TNotes.leetcode/0582. 杀掉进程【中等】/README"},{"text":"⏰ 0583. 两个字符串的删除操作【中等】","link":"/TNotes.leetcode/0583. 两个字符串的删除操作【中等】/README"},{"text":"⏰ 0584. 寻找用户推荐人【简单】","link":"/TNotes.leetcode/0584. 寻找用户推荐人【简单】/README"},{"text":"⏰ 0585. 2016年的投资【中等】","link":"/TNotes.leetcode/0585. 2016年的投资【中等】/README"},{"text":"⏰ 0586. 订单最多的客户【简单】","link":"/TNotes.leetcode/0586. 订单最多的客户【简单】/README"},{"text":"⏰ 0587. 安装栅栏【困难】","link":"/TNotes.leetcode/0587. 安装栅栏【困难】/README"},{"text":"⏰ 0588. 设计内存文件系统【困难】","link":"/TNotes.leetcode/0588. 设计内存文件系统【困难】/README"},{"text":"⏰ 0589. N 叉树的前序遍历【简单】","link":"/TNotes.leetcode/0589. N 叉树的前序遍历【简单】/README"},{"text":"⏰ 0590. N 叉树的后序遍历【简单】","link":"/TNotes.leetcode/0590. N 叉树的后序遍历【简单】/README"},{"text":"⏰ 0591. 标签验证器【困难】","link":"/TNotes.leetcode/0591. 标签验证器【困难】/README"},{"text":"⏰ 0592. 分数加减运算【中等】","link":"/TNotes.leetcode/0592. 分数加减运算【中等】/README"},{"text":"⏰ 0593. 有效的正方形【中等】","link":"/TNotes.leetcode/0593. 有效的正方形【中等】/README"},{"text":"⏰ 0594. 最长和谐子序列【简单】","link":"/TNotes.leetcode/0594. 最长和谐子序列【简单】/README"},{"text":"⏰ 0595. 大的国家【简单】","link":"/TNotes.leetcode/0595. 大的国家【简单】/README"},{"text":"⏰ 0596. 超过 5 名学生的课【简单】","link":"/TNotes.leetcode/0596. 超过 5 名学生的课【简单】/README"},{"text":"⏰ 0597. 好友申请 I：总体通过率【简单】","link":"/TNotes.leetcode/0597. 好友申请 I：总体通过率【简单】/README"},{"text":"⏰ 0598. 区间加法 II【简单】","link":"/TNotes.leetcode/0598. 区间加法 II【简单】/README"},{"text":"⏰ 0599. 两个列表的最小索引总和【简单】","link":"/TNotes.leetcode/0599. 两个列表的最小索引总和【简单】/README"},{"text":"⏰ 0600. 不含连续1的非负整数【困难】","link":"/TNotes.leetcode/0600. 不含连续1的非负整数【困难】/README"},{"text":"⏰ 0601. 体育馆的人流量【困难】","link":"/TNotes.leetcode/0601. 体育馆的人流量【困难】/README"},{"text":"⏰ 0602. 好友申请 II ：谁有最多的好友【中等】","link":"/TNotes.leetcode/0602. 好友申请 II ：谁有最多的好友【中等】/README"},{"text":"⏰ 0603. 连续空余座位【简单】","link":"/TNotes.leetcode/0603. 连续空余座位【简单】/README"},{"text":"⏰ 0604. 迭代压缩字符串【简单】","link":"/TNotes.leetcode/0604. 迭代压缩字符串【简单】/README"},{"text":"⏰ 0605. 种花问题【简单】","link":"/TNotes.leetcode/0605. 种花问题【简单】/README"},{"text":"⏰ 0606. 根据二叉树创建字符串【中等】","link":"/TNotes.leetcode/0606. 根据二叉树创建字符串【中等】/README"},{"text":"⏰ 0607. 销售员【简单】","link":"/TNotes.leetcode/0607. 销售员【简单】/README"},{"text":"⏰ 0608. 树节点【中等】","link":"/TNotes.leetcode/0608. 树节点【中等】/README"},{"text":"⏰ 0609. 在系统中查找重复文件【中等】","link":"/TNotes.leetcode/0609. 在系统中查找重复文件【中等】/README"},{"text":"⏰ 0610. 判断三角形【简单】","link":"/TNotes.leetcode/0610. 判断三角形【简单】/README"},{"text":"⏰ 0611. 有效三角形的个数【中等】","link":"/TNotes.leetcode/0611. 有效三角形的个数【中等】/README"},{"text":"⏰ 0612. 平面上的最近距离【中等】","link":"/TNotes.leetcode/0612. 平面上的最近距离【中等】/README"},{"text":"⏰ 0613. 直线上的最近距离【简单】","link":"/TNotes.leetcode/0613. 直线上的最近距离【简单】/README"},{"text":"⏰ 0614. 二级关注者【中等】","link":"/TNotes.leetcode/0614. 二级关注者【中等】/README"},{"text":"⏰ 0615. 平均工资：部门与公司比较【困难】","link":"/TNotes.leetcode/0615. 平均工资：部门与公司比较【困难】/README"},{"text":"⏰ 0616. 给字符串添加加粗标签【中等】","link":"/TNotes.leetcode/0616. 给字符串添加加粗标签【中等】/README"},{"text":"⏰ 0617. 合并二叉树【简单】","link":"/TNotes.leetcode/0617. 合并二叉树【简单】/README"},{"text":"⏰ 0618. 学生地理信息报告【困难】","link":"/TNotes.leetcode/0618. 学生地理信息报告【困难】/README"},{"text":"⏰ 0619. 只出现一次的最大数字【简单】","link":"/TNotes.leetcode/0619. 只出现一次的最大数字【简单】/README"},{"text":"⏰ 0620. 有趣的电影【简单】","link":"/TNotes.leetcode/0620. 有趣的电影【简单】/README"},{"text":"⏰ 0621. 任务调度器【中等】","link":"/TNotes.leetcode/0621. 任务调度器【中等】/README"},{"text":"⏰ 0622. 设计循环队列【中等】","link":"/TNotes.leetcode/0622. 设计循环队列【中等】/README"},{"text":"⏰ 0623. 在二叉树中增加一行【中等】","link":"/TNotes.leetcode/0623. 在二叉树中增加一行【中等】/README"},{"text":"⏰ 0624. 数组列表中的最大距离【中等】","link":"/TNotes.leetcode/0624. 数组列表中的最大距离【中等】/README"},{"text":"⏰ 0625. 最小因式分解【中等】","link":"/TNotes.leetcode/0625. 最小因式分解【中等】/README"},{"text":"⏰ 0626. 换座位【中等】","link":"/TNotes.leetcode/0626. 换座位【中等】/README"},{"text":"⏰ 0627. 变更性别【简单】","link":"/TNotes.leetcode/0627. 变更性别【简单】/README"},{"text":"⏰ 0628. 三个数的最大乘积【简单】","link":"/TNotes.leetcode/0628. 三个数的最大乘积【简单】/README"},{"text":"⏰ 0629. K 个逆序对数组【困难】","link":"/TNotes.leetcode/0629. K 个逆序对数组【困难】/README"},{"text":"⏰ 0630. 课程表 III【困难】","link":"/TNotes.leetcode/0630. 课程表 III【困难】/README"},{"text":"⏰ 0631. 设计 Excel 求和公式【困难】","link":"/TNotes.leetcode/0631. 设计 Excel 求和公式【困难】/README"},{"text":"⏰ 0632. 最小区间【困难】","link":"/TNotes.leetcode/0632. 最小区间【困难】/README"},{"text":"⏰ 0633. 平方数之和【中等】","link":"/TNotes.leetcode/0633. 平方数之和【中等】/README"},{"text":"⏰ 0634. 寻找数组的错位排列【中等】","link":"/TNotes.leetcode/0634. 寻找数组的错位排列【中等】/README"},{"text":"⏰ 0635. 设计日志存储系统【中等】","link":"/TNotes.leetcode/0635. 设计日志存储系统【中等】/README"},{"text":"⏰ 0636. 函数的独占时间【中等】","link":"/TNotes.leetcode/0636. 函数的独占时间【中等】/README"},{"text":"⏰ 0637. 二叉树的层平均值【简单】","link":"/TNotes.leetcode/0637. 二叉树的层平均值【简单】/README"},{"text":"⏰ 0638. 大礼包【中等】","link":"/TNotes.leetcode/0638. 大礼包【中等】/README"},{"text":"⏰ 0639. 解码方法 II【困难】","link":"/TNotes.leetcode/0639. 解码方法 II【困难】/README"},{"text":"⏰ 0640. 求解方程【中等】","link":"/TNotes.leetcode/0640. 求解方程【中等】/README"},{"text":"⏰ 0641. 设计循环双端队列【中等】","link":"/TNotes.leetcode/0641. 设计循环双端队列【中等】/README"},{"text":"⏰ 0642. 设计搜索自动补全系统【困难】","link":"/TNotes.leetcode/0642. 设计搜索自动补全系统【困难】/README"},{"text":"⏰ 0643. 子数组最大平均数 I【简单】","link":"/TNotes.leetcode/0643. 子数组最大平均数 I【简单】/README"},{"text":"⏰ 0644. 子数组最大平均数 II【困难】","link":"/TNotes.leetcode/0644. 子数组最大平均数 II【困难】/README"},{"text":"⏰ 0645. 错误的集合【简单】","link":"/TNotes.leetcode/0645. 错误的集合【简单】/README"},{"text":"⏰ 0646. 最长数对链【中等】","link":"/TNotes.leetcode/0646. 最长数对链【中等】/README"},{"text":"⏰ 0647. 回文子串【中等】","link":"/TNotes.leetcode/0647. 回文子串【中等】/README"},{"text":"⏰ 0648. 单词替换【中等】","link":"/TNotes.leetcode/0648. 单词替换【中等】/README"},{"text":"⏰ 0649. Dota2 参议院【中等】","link":"/TNotes.leetcode/0649. Dota2 参议院【中等】/README"},{"text":"⏰ 0650. 两个键的键盘【中等】","link":"/TNotes.leetcode/0650. 两个键的键盘【中等】/README"},{"text":"⏰ 0651. 四个键的键盘【中等】","link":"/TNotes.leetcode/0651. 四个键的键盘【中等】/README"},{"text":"⏰ 0652. 寻找重复的子树【中等】","link":"/TNotes.leetcode/0652. 寻找重复的子树【中等】/README"},{"text":"⏰ 0653. 两数之和 IV - 输入二叉搜索树【简单】","link":"/TNotes.leetcode/0653. 两数之和 IV - 输入二叉搜索树【简单】/README"},{"text":"⏰ 0654. 最大二叉树【中等】","link":"/TNotes.leetcode/0654. 最大二叉树【中等】/README"},{"text":"⏰ 0655. 输出二叉树【中等】","link":"/TNotes.leetcode/0655. 输出二叉树【中等】/README"},{"text":"⏰ 0656. 成本最小路径【困难】","link":"/TNotes.leetcode/0656. 成本最小路径【困难】/README"},{"text":"⏰ 0657. 机器人能否返回原点【简单】","link":"/TNotes.leetcode/0657. 机器人能否返回原点【简单】/README"},{"text":"⏰ 0658. 找到 K 个最接近的元素【中等】","link":"/TNotes.leetcode/0658. 找到 K 个最接近的元素【中等】/README"},{"text":"⏰ 0659. 分割数组为连续子序列【中等】","link":"/TNotes.leetcode/0659. 分割数组为连续子序列【中等】/README"},{"text":"⏰ 0660. 移除 9【困难】","link":"/TNotes.leetcode/0660. 移除 9【困难】/README"},{"text":"⏰ 0661. 图片平滑器【简单】","link":"/TNotes.leetcode/0661. 图片平滑器【简单】/README"},{"text":"⏰ 0662. 二叉树最大宽度【中等】","link":"/TNotes.leetcode/0662. 二叉树最大宽度【中等】/README"},{"text":"⏰ 0663. 均匀树划分【中等】","link":"/TNotes.leetcode/0663. 均匀树划分【中等】/README"},{"text":"⏰ 0664. 奇怪的打印机【困难】","link":"/TNotes.leetcode/0664. 奇怪的打印机【困难】/README"},{"text":"⏰ 0665. 非递减数列【中等】","link":"/TNotes.leetcode/0665. 非递减数列【中等】/README"},{"text":"⏰ 0666. 路径总和 IV【中等】","link":"/TNotes.leetcode/0666. 路径总和 IV【中等】/README"},{"text":"⏰ 0667. 优美的排列 II【中等】","link":"/TNotes.leetcode/0667. 优美的排列 II【中等】/README"},{"text":"⏰ 0668. 乘法表中第k小的数【困难】","link":"/TNotes.leetcode/0668. 乘法表中第k小的数【困难】/README"},{"text":"⏰ 0669. 修剪二叉搜索树【中等】","link":"/TNotes.leetcode/0669. 修剪二叉搜索树【中等】/README"},{"text":"⏰ 0670. 最大交换【中等】","link":"/TNotes.leetcode/0670. 最大交换【中等】/README"},{"text":"⏰ 0671. 二叉树中第二小的节点【简单】","link":"/TNotes.leetcode/0671. 二叉树中第二小的节点【简单】/README"},{"text":"⏰ 0672. 灯泡开关 Ⅱ【中等】","link":"/TNotes.leetcode/0672. 灯泡开关 Ⅱ【中等】/README"},{"text":"⏰ 0673. 最长递增子序列的个数【中等】","link":"/TNotes.leetcode/0673. 最长递增子序列的个数【中等】/README"},{"text":"⏰ 0674. 最长连续递增序列【简单】","link":"/TNotes.leetcode/0674. 最长连续递增序列【简单】/README"},{"text":"⏰ 0675. 为高尔夫比赛砍树【困难】","link":"/TNotes.leetcode/0675. 为高尔夫比赛砍树【困难】/README"},{"text":"⏰ 0676. 实现一个魔法字典【中等】","link":"/TNotes.leetcode/0676. 实现一个魔法字典【中等】/README"},{"text":"⏰ 0677. 键值映射【中等】","link":"/TNotes.leetcode/0677. 键值映射【中等】/README"},{"text":"⏰ 0678. 有效的括号字符串【中等】","link":"/TNotes.leetcode/0678. 有效的括号字符串【中等】/README"},{"text":"⏰ 0679. 24 点游戏【困难】","link":"/TNotes.leetcode/0679. 24 点游戏【困难】/README"},{"text":"⏰ 0680. 验证回文串 II【简单】","link":"/TNotes.leetcode/0680. 验证回文串 II【简单】/README"},{"text":"⏰ 0681. 最近时刻【中等】","link":"/TNotes.leetcode/0681. 最近时刻【中等】/README"},{"text":"⏰ 0682. 棒球比赛【简单】","link":"/TNotes.leetcode/0682. 棒球比赛【简单】/README"},{"text":"⏰ 0683. K 个关闭的灯泡【困难】","link":"/TNotes.leetcode/0683. K 个关闭的灯泡【困难】/README"},{"text":"⏰ 0684. 冗余连接【中等】","link":"/TNotes.leetcode/0684. 冗余连接【中等】/README"},{"text":"⏰ 0685. 冗余连接 II【困难】","link":"/TNotes.leetcode/0685. 冗余连接 II【困难】/README"},{"text":"⏰ 0686. 重复叠加字符串匹配【中等】","link":"/TNotes.leetcode/0686. 重复叠加字符串匹配【中等】/README"},{"text":"⏰ 0687. 最长同值路径【中等】","link":"/TNotes.leetcode/0687. 最长同值路径【中等】/README"},{"text":"⏰ 0688. 骑士在棋盘上的概率【中等】","link":"/TNotes.leetcode/0688. 骑士在棋盘上的概率【中等】/README"},{"text":"⏰ 0689. 三个无重叠子数组的最大和【困难】","link":"/TNotes.leetcode/0689. 三个无重叠子数组的最大和【困难】/README"},{"text":"⏰ 0690. 员工的重要性【中等】","link":"/TNotes.leetcode/0690. 员工的重要性【中等】/README"},{"text":"⏰ 0691. 贴纸拼词【困难】","link":"/TNotes.leetcode/0691. 贴纸拼词【困难】/README"},{"text":"⏰ 0692. 前K个高频单词【中等】","link":"/TNotes.leetcode/0692. 前K个高频单词【中等】/README"},{"text":"⏰ 0693. 交替位二进制数【简单】","link":"/TNotes.leetcode/0693. 交替位二进制数【简单】/README"},{"text":"⏰ 0694. 不同岛屿的数量【中等】","link":"/TNotes.leetcode/0694. 不同岛屿的数量【中等】/README"},{"text":"⏰ 0695. 岛屿的最大面积【中等】","link":"/TNotes.leetcode/0695. 岛屿的最大面积【中等】/README"},{"text":"⏰ 0696. 计数二进制子串【简单】","link":"/TNotes.leetcode/0696. 计数二进制子串【简单】/README"},{"text":"⏰ 0697. 数组的度【简单】","link":"/TNotes.leetcode/0697. 数组的度【简单】/README"},{"text":"⏰ 0698. 划分为k个相等的子集【中等】","link":"/TNotes.leetcode/0698. 划分为k个相等的子集【中等】/README"},{"text":"⏰ 0699. 掉落的方块【困难】","link":"/TNotes.leetcode/0699. 掉落的方块【困难】/README"},{"text":"⏰ 0700. 二叉搜索树中的搜索【简单】","link":"/TNotes.leetcode/0700. 二叉搜索树中的搜索【简单】/README"},{"text":"⏰ 0701. 二叉搜索树中的插入操作【中等】","link":"/TNotes.leetcode/0701. 二叉搜索树中的插入操作【中等】/README"},{"text":"⏰ 0702. 搜索长度未知的有序数组【中等】","link":"/TNotes.leetcode/0702. 搜索长度未知的有序数组【中等】/README"},{"text":"⏰ 0703. 数据流中的第 K 大元素【简单】","link":"/TNotes.leetcode/0703. 数据流中的第 K 大元素【简单】/README"},{"text":"⏰ 0704. 二分查找【简单】","link":"/TNotes.leetcode/0704. 二分查找【简单】/README"},{"text":"⏰ 0705. 设计哈希集合【简单】","link":"/TNotes.leetcode/0705. 设计哈希集合【简单】/README"},{"text":"⏰ 0706. 设计哈希映射【简单】","link":"/TNotes.leetcode/0706. 设计哈希映射【简单】/README"},{"text":"⏰ 0707. 设计链表【中等】","link":"/TNotes.leetcode/0707. 设计链表【中等】/README"},{"text":"⏰ 0708. 循环有序列表的插入【中等】","link":"/TNotes.leetcode/0708. 循环有序列表的插入【中等】/README"},{"text":"⏰ 0709. 转换成小写字母【简单】","link":"/TNotes.leetcode/0709. 转换成小写字母【简单】/README"},{"text":"⏰ 0710. 黑名单中的随机数【困难】","link":"/TNotes.leetcode/0710. 黑名单中的随机数【困难】/README"},{"text":"⏰ 0711. 不同岛屿的数量 II【困难】","link":"/TNotes.leetcode/0711. 不同岛屿的数量 II【困难】/README"},{"text":"⏰ 0712. 两个字符串的最小ASCII删除和【中等】","link":"/TNotes.leetcode/0712. 两个字符串的最小ASCII删除和【中等】/README"},{"text":"⏰ 0713. 乘积小于 K 的子数组【中等】","link":"/TNotes.leetcode/0713. 乘积小于 K 的子数组【中等】/README"},{"text":"⏰ 0714. 买卖股票的最佳时机含手续费【中等】","link":"/TNotes.leetcode/0714. 买卖股票的最佳时机含手续费【中等】/README"},{"text":"⏰ 0715. Range 模块【困难】","link":"/TNotes.leetcode/0715. Range 模块【困难】/README"},{"text":"⏰ 0716. 最大栈【困难】","link":"/TNotes.leetcode/0716. 最大栈【困难】/README"},{"text":"⏰ 0717. 1 比特与 2 比特字符【简单】","link":"/TNotes.leetcode/0717. 1 比特与 2 比特字符【简单】/README"},{"text":"⏰ 0718. 最长重复子数组【中等】","link":"/TNotes.leetcode/0718. 最长重复子数组【中等】/README"},{"text":"⏰ 0719. 找出第 K 小的数对距离【困难】","link":"/TNotes.leetcode/0719. 找出第 K 小的数对距离【困难】/README"},{"text":"⏰ 0720. 词典中最长的单词【中等】","link":"/TNotes.leetcode/0720. 词典中最长的单词【中等】/README"},{"text":"⏰ 0721. 账户合并【中等】","link":"/TNotes.leetcode/0721. 账户合并【中等】/README"},{"text":"⏰ 0722. 删除注释【中等】","link":"/TNotes.leetcode/0722. 删除注释【中等】/README"},{"text":"⏰ 0723. 粉碎糖果【中等】","link":"/TNotes.leetcode/0723. 粉碎糖果【中等】/README"},{"text":"⏰ 0724. 寻找数组的中心下标【简单】","link":"/TNotes.leetcode/0724. 寻找数组的中心下标【简单】/README"},{"text":"⏰ 0725. 分隔链表【中等】","link":"/TNotes.leetcode/0725. 分隔链表【中等】/README"},{"text":"⏰ 0726. 原子的数量【困难】","link":"/TNotes.leetcode/0726. 原子的数量【困难】/README"},{"text":"⏰ 0727. 最小窗口子序列【困难】","link":"/TNotes.leetcode/0727. 最小窗口子序列【困难】/README"},{"text":"⏰ 0728. 自除数【简单】","link":"/TNotes.leetcode/0728. 自除数【简单】/README"},{"text":"⏰ 0729. 我的日程安排表 I【中等】","link":"/TNotes.leetcode/0729. 我的日程安排表 I【中等】/README"},{"text":"⏰ 0730. 统计不同回文子序列【困难】","link":"/TNotes.leetcode/0730. 统计不同回文子序列【困难】/README"},{"text":"⏰ 0731. 我的日程安排表 II【中等】","link":"/TNotes.leetcode/0731. 我的日程安排表 II【中等】/README"},{"text":"⏰ 0732. 我的日程安排表 III【困难】","link":"/TNotes.leetcode/0732. 我的日程安排表 III【困难】/README"},{"text":"⏰ 0733. 图像渲染【简单】","link":"/TNotes.leetcode/0733. 图像渲染【简单】/README"},{"text":"⏰ 0734. 句子相似性【简单】","link":"/TNotes.leetcode/0734. 句子相似性【简单】/README"},{"text":"⏰ 0735. 小行星碰撞【中等】","link":"/TNotes.leetcode/0735. 小行星碰撞【中等】/README"},{"text":"⏰ 0736. Lisp 语法解析【困难】","link":"/TNotes.leetcode/0736. Lisp 语法解析【困难】/README"},{"text":"⏰ 0737. 句子相似性 II【中等】","link":"/TNotes.leetcode/0737. 句子相似性 II【中等】/README"},{"text":"⏰ 0738. 单调递增的数字【中等】","link":"/TNotes.leetcode/0738. 单调递增的数字【中等】/README"},{"text":"⏰ 0739. 每日温度【中等】","link":"/TNotes.leetcode/0739. 每日温度【中等】/README"},{"text":"⏰ 0740. 删除并获得点数【中等】","link":"/TNotes.leetcode/0740. 删除并获得点数【中等】/README"},{"text":"⏰ 0741. 摘樱桃【困难】","link":"/TNotes.leetcode/0741. 摘樱桃【困难】/README"},{"text":"⏰ 0742. 二叉树最近的叶节点【中等】","link":"/TNotes.leetcode/0742. 二叉树最近的叶节点【中等】/README"},{"text":"⏰ 0743. 网络延迟时间【中等】","link":"/TNotes.leetcode/0743. 网络延迟时间【中等】/README"},{"text":"⏰ 0744. 寻找比目标字母大的最小字母【简单】","link":"/TNotes.leetcode/0744. 寻找比目标字母大的最小字母【简单】/README"},{"text":"⏰ 0745. 前缀和后缀搜索【困难】","link":"/TNotes.leetcode/0745. 前缀和后缀搜索【困难】/README"},{"text":"⏰ 0746. 使用最小花费爬楼梯【简单】","link":"/TNotes.leetcode/0746. 使用最小花费爬楼梯【简单】/README"},{"text":"⏰ 0747. 至少是其他数字两倍的最大数【简单】","link":"/TNotes.leetcode/0747. 至少是其他数字两倍的最大数【简单】/README"},{"text":"⏰ 0748. 最短补全词【简单】","link":"/TNotes.leetcode/0748. 最短补全词【简单】/README"},{"text":"⏰ 0749. 隔离病毒【困难】","link":"/TNotes.leetcode/0749. 隔离病毒【困难】/README"},{"text":"⏰ 0750. 角矩形的数量【中等】","link":"/TNotes.leetcode/0750. 角矩形的数量【中等】/README"},{"text":"⏰ 0751. IP 到 CIDR【中等】","link":"/TNotes.leetcode/0751. IP 到 CIDR【中等】/README"},{"text":"⏰ 0752. 打开转盘锁【中等】","link":"/TNotes.leetcode/0752. 打开转盘锁【中等】/README"},{"text":"⏰ 0753. 破解保险箱【困难】","link":"/TNotes.leetcode/0753. 破解保险箱【困难】/README"},{"text":"⏰ 0754. 到达终点数字【中等】","link":"/TNotes.leetcode/0754. 到达终点数字【中等】/README"},{"text":"⏰ 0755. 倒水【中等】","link":"/TNotes.leetcode/0755. 倒水【中等】/README"},{"text":"⏰ 0756. 金字塔转换矩阵【中等】","link":"/TNotes.leetcode/0756. 金字塔转换矩阵【中等】/README"},{"text":"⏰ 0757. 设置交集大小至少为2【困难】","link":"/TNotes.leetcode/0757. 设置交集大小至少为2【困难】/README"},{"text":"⏰ 0758. 字符串中的加粗单词【中等】","link":"/TNotes.leetcode/0758. 字符串中的加粗单词【中等】/README"},{"text":"⏰ 0759. 员工空闲时间【困难】","link":"/TNotes.leetcode/0759. 员工空闲时间【困难】/README"},{"text":"⏰ 0760. 找出变位映射【简单】","link":"/TNotes.leetcode/0760. 找出变位映射【简单】/README"},{"text":"⏰ 0761. 特殊的二进制序列【困难】","link":"/TNotes.leetcode/0761. 特殊的二进制序列【困难】/README"},{"text":"⏰ 0762. 二进制表示中质数个计算置位【简单】","link":"/TNotes.leetcode/0762. 二进制表示中质数个计算置位【简单】/README"},{"text":"⏰ 0763. 划分字母区间【中等】","link":"/TNotes.leetcode/0763. 划分字母区间【中等】/README"},{"text":"⏰ 0764. 最大加号标志【中等】","link":"/TNotes.leetcode/0764. 最大加号标志【中等】/README"},{"text":"⏰ 0765. 情侣牵手【困难】","link":"/TNotes.leetcode/0765. 情侣牵手【困难】/README"},{"text":"⏰ 0766. 托普利茨矩阵【简单】","link":"/TNotes.leetcode/0766. 托普利茨矩阵【简单】/README"},{"text":"⏰ 0767. 重构字符串【中等】","link":"/TNotes.leetcode/0767. 重构字符串【中等】/README"},{"text":"⏰ 0768. 最多能完成排序的块 II【困难】","link":"/TNotes.leetcode/0768. 最多能完成排序的块 II【困难】/README"},{"text":"⏰ 0769. 最多能完成排序的块【中等】","link":"/TNotes.leetcode/0769. 最多能完成排序的块【中等】/README"},{"text":"⏰ 0770. 基本计算器 IV【困难】","link":"/TNotes.leetcode/0770. 基本计算器 IV【困难】/README"},{"text":"⏰ 0771. 宝石与石头【简单】","link":"/TNotes.leetcode/0771. 宝石与石头【简单】/README"},{"text":"⏰ 0772. 基本计算器 III【困难】","link":"/TNotes.leetcode/0772. 基本计算器 III【困难】/README"},{"text":"⏰ 0773. 滑动谜题【困难】","link":"/TNotes.leetcode/0773. 滑动谜题【困难】/README"},{"text":"⏰ 0774. 最小化去加油站的最大距离【困难】","link":"/TNotes.leetcode/0774. 最小化去加油站的最大距离【困难】/README"},{"text":"⏰ 0775. 全局倒置与局部倒置【中等】","link":"/TNotes.leetcode/0775. 全局倒置与局部倒置【中等】/README"},{"text":"⏰ 0776. 拆分二叉搜索树【中等】","link":"/TNotes.leetcode/0776. 拆分二叉搜索树【中等】/README"},{"text":"⏰ 0777. 在 LR 字符串中交换相邻字符【中等】","link":"/TNotes.leetcode/0777. 在 LR 字符串中交换相邻字符【中等】/README"},{"text":"⏰ 0778. 水位上升的泳池中游泳【困难】","link":"/TNotes.leetcode/0778. 水位上升的泳池中游泳【困难】/README"},{"text":"⏰ 0779. 第K个语法符号【中等】","link":"/TNotes.leetcode/0779. 第K个语法符号【中等】/README"},{"text":"⏰ 0780. 到达终点【困难】","link":"/TNotes.leetcode/0780. 到达终点【困难】/README"},{"text":"⏰ 0781. 森林中的兔子【中等】","link":"/TNotes.leetcode/0781. 森林中的兔子【中等】/README"},{"text":"⏰ 0782. 变为棋盘【困难】","link":"/TNotes.leetcode/0782. 变为棋盘【困难】/README"},{"text":"⏰ 0783. 二叉搜索树节点最小距离【简单】","link":"/TNotes.leetcode/0783. 二叉搜索树节点最小距离【简单】/README"},{"text":"⏰ 0784. 字母大小写全排列【中等】","link":"/TNotes.leetcode/0784. 字母大小写全排列【中等】/README"},{"text":"⏰ 0785. 判断二分图【中等】","link":"/TNotes.leetcode/0785. 判断二分图【中等】/README"},{"text":"⏰ 0786. 第 K 个最小的质数分数【中等】","link":"/TNotes.leetcode/0786. 第 K 个最小的质数分数【中等】/README"},{"text":"⏰ 0787. K 站中转内最便宜的航班【中等】","link":"/TNotes.leetcode/0787. K 站中转内最便宜的航班【中等】/README"},{"text":"⏰ 0788. 旋转数字【中等】","link":"/TNotes.leetcode/0788. 旋转数字【中等】/README"},{"text":"⏰ 0789. 逃脱阻碍者【中等】","link":"/TNotes.leetcode/0789. 逃脱阻碍者【中等】/README"},{"text":"⏰ 0790. 多米诺和托米诺平铺【中等】","link":"/TNotes.leetcode/0790. 多米诺和托米诺平铺【中等】/README"},{"text":"⏰ 0791. 自定义字符串排序【中等】","link":"/TNotes.leetcode/0791. 自定义字符串排序【中等】/README"},{"text":"⏰ 0792. 匹配子序列的单词数【中等】","link":"/TNotes.leetcode/0792. 匹配子序列的单词数【中等】/README"},{"text":"⏰ 0793. 阶乘函数后 K 个零【困难】","link":"/TNotes.leetcode/0793. 阶乘函数后 K 个零【困难】/README"},{"text":"⏰ 0794. 有效的井字游戏【中等】","link":"/TNotes.leetcode/0794. 有效的井字游戏【中等】/README"},{"text":"⏰ 0795. 区间子数组个数【中等】","link":"/TNotes.leetcode/0795. 区间子数组个数【中等】/README"},{"text":"⏰ 0796. 旋转字符串【简单】","link":"/TNotes.leetcode/0796. 旋转字符串【简单】/README"},{"text":"⏰ 0797. 所有可能的路径【中等】","link":"/TNotes.leetcode/0797. 所有可能的路径【中等】/README"},{"text":"⏰ 0798. 得分最高的最小轮调【困难】","link":"/TNotes.leetcode/0798. 得分最高的最小轮调【困难】/README"},{"text":"⏰ 0799. 香槟塔【中等】","link":"/TNotes.leetcode/0799. 香槟塔【中等】/README"},{"text":"⏰ 0800. 相似 RGB 颜色【简单】","link":"/TNotes.leetcode/0800. 相似 RGB 颜色【简单】/README"},{"text":"⏰ 0801. 使序列递增的最小交换次数【困难】","link":"/TNotes.leetcode/0801. 使序列递增的最小交换次数【困难】/README"},{"text":"⏰ 0802. 找到最终的安全状态【中等】","link":"/TNotes.leetcode/0802. 找到最终的安全状态【中等】/README"},{"text":"⏰ 0803. 打砖块【困难】","link":"/TNotes.leetcode/0803. 打砖块【困难】/README"},{"text":"⏰ 0804. 唯一摩尔斯密码词【简单】","link":"/TNotes.leetcode/0804. 唯一摩尔斯密码词【简单】/README"},{"text":"⏰ 0805. 数组的均值分割【困难】","link":"/TNotes.leetcode/0805. 数组的均值分割【困难】/README"},{"text":"⏰ 0806. 写字符串需要的行数【简单】","link":"/TNotes.leetcode/0806. 写字符串需要的行数【简单】/README"},{"text":"⏰ 0807. 保持城市天际线【中等】","link":"/TNotes.leetcode/0807. 保持城市天际线【中等】/README"},{"text":"⏰ 0808. 分汤【中等】","link":"/TNotes.leetcode/0808. 分汤【中等】/README"},{"text":"⏰ 0809. 情感丰富的文字【中等】","link":"/TNotes.leetcode/0809. 情感丰富的文字【中等】/README"},{"text":"⏰ 0810. 黑板异或游戏【困难】","link":"/TNotes.leetcode/0810. 黑板异或游戏【困难】/README"},{"text":"⏰ 0811. 子域名访问计数【中等】","link":"/TNotes.leetcode/0811. 子域名访问计数【中等】/README"},{"text":"⏰ 0812. 最大三角形面积【简单】","link":"/TNotes.leetcode/0812. 最大三角形面积【简单】/README"},{"text":"⏰ 0813. 最大平均值和的分组【中等】","link":"/TNotes.leetcode/0813. 最大平均值和的分组【中等】/README"},{"text":"⏰ 0814. 二叉树剪枝【中等】","link":"/TNotes.leetcode/0814. 二叉树剪枝【中等】/README"},{"text":"⏰ 0815. 公交路线【困难】","link":"/TNotes.leetcode/0815. 公交路线【困难】/README"},{"text":"⏰ 0816. 模糊坐标【中等】","link":"/TNotes.leetcode/0816. 模糊坐标【中等】/README"},{"text":"⏰ 0817. 链表组件【中等】","link":"/TNotes.leetcode/0817. 链表组件【中等】/README"},{"text":"⏰ 0818. 赛车【困难】","link":"/TNotes.leetcode/0818. 赛车【困难】/README"},{"text":"⏰ 0819. 最常见的单词【简单】","link":"/TNotes.leetcode/0819. 最常见的单词【简单】/README"},{"text":"⏰ 0820. 单词的压缩编码【中等】","link":"/TNotes.leetcode/0820. 单词的压缩编码【中等】/README"},{"text":"⏰ 0821. 字符的最短距离【简单】","link":"/TNotes.leetcode/0821. 字符的最短距离【简单】/README"},{"text":"⏰ 0822. 翻转卡片游戏【中等】","link":"/TNotes.leetcode/0822. 翻转卡片游戏【中等】/README"},{"text":"⏰ 0823. 带因子的二叉树【中等】","link":"/TNotes.leetcode/0823. 带因子的二叉树【中等】/README"},{"text":"⏰ 0824. 山羊拉丁文【简单】","link":"/TNotes.leetcode/0824. 山羊拉丁文【简单】/README"},{"text":"⏰ 0825. 适龄的朋友【中等】","link":"/TNotes.leetcode/0825. 适龄的朋友【中等】/README"},{"text":"⏰ 0826. 安排工作以达到最大收益【中等】","link":"/TNotes.leetcode/0826. 安排工作以达到最大收益【中等】/README"},{"text":"⏰ 0827. 最大人工岛【困难】","link":"/TNotes.leetcode/0827. 最大人工岛【困难】/README"},{"text":"⏰ 0828. 统计子串中的唯一字符【困难】","link":"/TNotes.leetcode/0828. 统计子串中的唯一字符【困难】/README"},{"text":"⏰ 0829. 连续整数求和【困难】","link":"/TNotes.leetcode/0829. 连续整数求和【困难】/README"},{"text":"⏰ 0830. 较大分组的位置【简单】","link":"/TNotes.leetcode/0830. 较大分组的位置【简单】/README"},{"text":"⏰ 0831. 隐藏个人信息【中等】","link":"/TNotes.leetcode/0831. 隐藏个人信息【中等】/README"},{"text":"⏰ 0832. 翻转图像【简单】","link":"/TNotes.leetcode/0832. 翻转图像【简单】/README"},{"text":"⏰ 0833. 字符串中的查找与替换【中等】","link":"/TNotes.leetcode/0833. 字符串中的查找与替换【中等】/README"},{"text":"⏰ 0834. 树中距离之和【困难】","link":"/TNotes.leetcode/0834. 树中距离之和【困难】/README"},{"text":"⏰ 0835. 图像重叠【中等】","link":"/TNotes.leetcode/0835. 图像重叠【中等】/README"},{"text":"⏰ 0836. 矩形重叠【简单】","link":"/TNotes.leetcode/0836. 矩形重叠【简单】/README"},{"text":"⏰ 0837. 新 21 点【中等】","link":"/TNotes.leetcode/0837. 新 21 点【中等】/README"},{"text":"⏰ 0838. 推多米诺【中等】","link":"/TNotes.leetcode/0838. 推多米诺【中等】/README"},{"text":"⏰ 0839. 相似字符串组【困难】","link":"/TNotes.leetcode/0839. 相似字符串组【困难】/README"},{"text":"⏰ 0840. 矩阵中的幻方【中等】","link":"/TNotes.leetcode/0840. 矩阵中的幻方【中等】/README"},{"text":"⏰ 0841. 钥匙和房间【中等】","link":"/TNotes.leetcode/0841. 钥匙和房间【中等】/README"},{"text":"⏰ 0842. 将数组拆分成斐波那契序列【中等】","link":"/TNotes.leetcode/0842. 将数组拆分成斐波那契序列【中等】/README"},{"text":"⏰ 0843. 猜猜这个单词【困难】","link":"/TNotes.leetcode/0843. 猜猜这个单词【困难】/README"},{"text":"⏰ 0844. 比较含退格的字符串【简单】","link":"/TNotes.leetcode/0844. 比较含退格的字符串【简单】/README"},{"text":"⏰ 0845. 数组中的最长山脉【中等】","link":"/TNotes.leetcode/0845. 数组中的最长山脉【中等】/README"},{"text":"⏰ 0846. 一手顺子【中等】","link":"/TNotes.leetcode/0846. 一手顺子【中等】/README"},{"text":"⏰ 0847. 访问所有节点的最短路径【困难】","link":"/TNotes.leetcode/0847. 访问所有节点的最短路径【困难】/README"},{"text":"⏰ 0848. 字母移位【中等】","link":"/TNotes.leetcode/0848. 字母移位【中等】/README"},{"text":"⏰ 0849. 到最近的人的最大距离【中等】","link":"/TNotes.leetcode/0849. 到最近的人的最大距离【中等】/README"},{"text":"⏰ 0850. 矩形面积 II【困难】","link":"/TNotes.leetcode/0850. 矩形面积 II【困难】/README"},{"text":"⏰ 0851. 喧闹和富有【中等】","link":"/TNotes.leetcode/0851. 喧闹和富有【中等】/README"},{"text":"⏰ 0852. 山脉数组的峰顶索引【中等】","link":"/TNotes.leetcode/0852. 山脉数组的峰顶索引【中等】/README"},{"text":"⏰ 0853. 车队【中等】","link":"/TNotes.leetcode/0853. 车队【中等】/README"},{"text":"⏰ 0854. 相似度为 K 的字符串【困难】","link":"/TNotes.leetcode/0854. 相似度为 K 的字符串【困难】/README"},{"text":"⏰ 0855. 考场就座【中等】","link":"/TNotes.leetcode/0855. 考场就座【中等】/README"},{"text":"⏰ 0856. 括号的分数【中等】","link":"/TNotes.leetcode/0856. 括号的分数【中等】/README"},{"text":"⏰ 0857. 雇佣 K 名工人的最低成本【困难】","link":"/TNotes.leetcode/0857. 雇佣 K 名工人的最低成本【困难】/README"},{"text":"⏰ 0858. 镜面反射【中等】","link":"/TNotes.leetcode/0858. 镜面反射【中等】/README"},{"text":"⏰ 0859. 亲密字符串【简单】","link":"/TNotes.leetcode/0859. 亲密字符串【简单】/README"},{"text":"⏰ 0860. 柠檬水找零【简单】","link":"/TNotes.leetcode/0860. 柠檬水找零【简单】/README"},{"text":"⏰ 0861. 翻转矩阵后的得分【中等】","link":"/TNotes.leetcode/0861. 翻转矩阵后的得分【中等】/README"},{"text":"⏰ 0862. 和至少为 K 的最短子数组【困难】","link":"/TNotes.leetcode/0862. 和至少为 K 的最短子数组【困难】/README"},{"text":"⏰ 0863. 二叉树中所有距离为 K 的结点【中等】","link":"/TNotes.leetcode/0863. 二叉树中所有距离为 K 的结点【中等】/README"},{"text":"⏰ 0864. 获取所有钥匙的最短路径【困难】","link":"/TNotes.leetcode/0864. 获取所有钥匙的最短路径【困难】/README"},{"text":"⏰ 0865. 具有所有最深节点的最小子树【中等】","link":"/TNotes.leetcode/0865. 具有所有最深节点的最小子树【中等】/README"},{"text":"⏰ 0866. 回文质数【中等】","link":"/TNotes.leetcode/0866. 回文质数【中等】/README"},{"text":"⏰ 0867. 转置矩阵【简单】","link":"/TNotes.leetcode/0867. 转置矩阵【简单】/README"},{"text":"⏰ 0868. 二进制间距【简单】","link":"/TNotes.leetcode/0868. 二进制间距【简单】/README"},{"text":"⏰ 0869. 重新排序得到 2 的幂【中等】","link":"/TNotes.leetcode/0869. 重新排序得到 2 的幂【中等】/README"},{"text":"⏰ 0870. 优势洗牌【中等】","link":"/TNotes.leetcode/0870. 优势洗牌【中等】/README"},{"text":"⏰ 0871. 最低加油次数【困难】","link":"/TNotes.leetcode/0871. 最低加油次数【困难】/README"},{"text":"⏰ 0872. 叶子相似的树【简单】","link":"/TNotes.leetcode/0872. 叶子相似的树【简单】/README"},{"text":"⏰ 0873. 最长的斐波那契子序列的长度【中等】","link":"/TNotes.leetcode/0873. 最长的斐波那契子序列的长度【中等】/README"},{"text":"⏰ 0874. 模拟行走机器人【中等】","link":"/TNotes.leetcode/0874. 模拟行走机器人【中等】/README"},{"text":"⏰ 0875. 爱吃香蕉的珂珂【中等】","link":"/TNotes.leetcode/0875. 爱吃香蕉的珂珂【中等】/README"},{"text":"⏰ 0876. 链表的中间结点【简单】","link":"/TNotes.leetcode/0876. 链表的中间结点【简单】/README"},{"text":"⏰ 0877. 石子游戏【中等】","link":"/TNotes.leetcode/0877. 石子游戏【中等】/README"},{"text":"⏰ 0878. 第 N 个神奇数字【困难】","link":"/TNotes.leetcode/0878. 第 N 个神奇数字【困难】/README"},{"text":"⏰ 0879. 盈利计划【困难】","link":"/TNotes.leetcode/0879. 盈利计划【困难】/README"},{"text":"⏰ 0880. 索引处的解码字符串【中等】","link":"/TNotes.leetcode/0880. 索引处的解码字符串【中等】/README"},{"text":"⏰ 0881. 救生艇【中等】","link":"/TNotes.leetcode/0881. 救生艇【中等】/README"},{"text":"⏰ 0882. 细分图中的可到达节点【困难】","link":"/TNotes.leetcode/0882. 细分图中的可到达节点【困难】/README"},{"text":"⏰ 0883. 三维形体投影面积【简单】","link":"/TNotes.leetcode/0883. 三维形体投影面积【简单】/README"},{"text":"⏰ 0884. 两句话中的不常见单词【简单】","link":"/TNotes.leetcode/0884. 两句话中的不常见单词【简单】/README"},{"text":"⏰ 0885. 螺旋矩阵 III【中等】","link":"/TNotes.leetcode/0885. 螺旋矩阵 III【中等】/README"},{"text":"⏰ 0886. 可能的二分法【中等】","link":"/TNotes.leetcode/0886. 可能的二分法【中等】/README"},{"text":"⏰ 0887. 鸡蛋掉落【困难】","link":"/TNotes.leetcode/0887. 鸡蛋掉落【困难】/README"},{"text":"⏰ 0888. 公平的糖果交换【简单】","link":"/TNotes.leetcode/0888. 公平的糖果交换【简单】/README"},{"text":"⏰ 0889. 根据前序和后序遍历构造二叉树【中等】","link":"/TNotes.leetcode/0889. 根据前序和后序遍历构造二叉树【中等】/README"},{"text":"⏰ 0890. 查找和替换模式【中等】","link":"/TNotes.leetcode/0890. 查找和替换模式【中等】/README"},{"text":"⏰ 0891. 子序列宽度之和【困难】","link":"/TNotes.leetcode/0891. 子序列宽度之和【困难】/README"},{"text":"⏰ 0892. 三维形体的表面积【简单】","link":"/TNotes.leetcode/0892. 三维形体的表面积【简单】/README"},{"text":"⏰ 0893. 特殊等价字符串组【中等】","link":"/TNotes.leetcode/0893. 特殊等价字符串组【中等】/README"},{"text":"⏰ 0894. 所有可能的真二叉树【中等】","link":"/TNotes.leetcode/0894. 所有可能的真二叉树【中等】/README"},{"text":"⏰ 0895. 最大频率栈【困难】","link":"/TNotes.leetcode/0895. 最大频率栈【困难】/README"},{"text":"⏰ 0896. 单调数列【简单】","link":"/TNotes.leetcode/0896. 单调数列【简单】/README"},{"text":"⏰ 0897. 递增顺序搜索树【简单】","link":"/TNotes.leetcode/0897. 递增顺序搜索树【简单】/README"},{"text":"⏰ 0898. 子数组按位或操作【中等】","link":"/TNotes.leetcode/0898. 子数组按位或操作【中等】/README"},{"text":"⏰ 0899. 有序队列【困难】","link":"/TNotes.leetcode/0899. 有序队列【困难】/README"},{"text":"⏰ 0900. RLE 迭代器【中等】","link":"/TNotes.leetcode/0900. RLE 迭代器【中等】/README"},{"text":"⏰ 0901. 股票价格跨度【中等】","link":"/TNotes.leetcode/0901. 股票价格跨度【中等】/README"},{"text":"⏰ 0902. 最大为 N 的数字组合【困难】","link":"/TNotes.leetcode/0902. 最大为 N 的数字组合【困难】/README"},{"text":"⏰ 0903. DI 序列的有效排列【困难】","link":"/TNotes.leetcode/0903. DI 序列的有效排列【困难】/README"},{"text":"⏰ 0904. 水果成篮【中等】","link":"/TNotes.leetcode/0904. 水果成篮【中等】/README"},{"text":"⏰ 0905. 按奇偶排序数组【简单】","link":"/TNotes.leetcode/0905. 按奇偶排序数组【简单】/README"},{"text":"⏰ 0906. 超级回文数【困难】","link":"/TNotes.leetcode/0906. 超级回文数【困难】/README"},{"text":"⏰ 0907. 子数组的最小值之和【中等】","link":"/TNotes.leetcode/0907. 子数组的最小值之和【中等】/README"},{"text":"⏰ 0908. 最小差值 I【简单】","link":"/TNotes.leetcode/0908. 最小差值 I【简单】/README"},{"text":"⏰ 0909. 蛇梯棋【中等】","link":"/TNotes.leetcode/0909. 蛇梯棋【中等】/README"},{"text":"⏰ 0910. 最小差值 II【中等】","link":"/TNotes.leetcode/0910. 最小差值 II【中等】/README"},{"text":"⏰ 0911. 在线选举【中等】","link":"/TNotes.leetcode/0911. 在线选举【中等】/README"},{"text":"⏰ 0912. 排序数组【中等】","link":"/TNotes.leetcode/0912. 排序数组【中等】/README"},{"text":"⏰ 0913. 猫和老鼠【困难】","link":"/TNotes.leetcode/0913. 猫和老鼠【困难】/README"},{"text":"⏰ 0914. 卡牌分组【简单】","link":"/TNotes.leetcode/0914. 卡牌分组【简单】/README"},{"text":"⏰ 0915. 分割数组【中等】","link":"/TNotes.leetcode/0915. 分割数组【中等】/README"},{"text":"⏰ 0916. 单词子集【中等】","link":"/TNotes.leetcode/0916. 单词子集【中等】/README"},{"text":"⏰ 0917. 仅仅反转字母【简单】","link":"/TNotes.leetcode/0917. 仅仅反转字母【简单】/README"},{"text":"⏰ 0918. 环形子数组的最大和【中等】","link":"/TNotes.leetcode/0918. 环形子数组的最大和【中等】/README"},{"text":"⏰ 0919. 完全二叉树插入器【中等】","link":"/TNotes.leetcode/0919. 完全二叉树插入器【中等】/README"},{"text":"⏰ 0920. 播放列表的数量【困难】","link":"/TNotes.leetcode/0920. 播放列表的数量【困难】/README"},{"text":"⏰ 0921. 使括号有效的最少添加【中等】","link":"/TNotes.leetcode/0921. 使括号有效的最少添加【中等】/README"},{"text":"⏰ 0922. 按奇偶排序数组 II【简单】","link":"/TNotes.leetcode/0922. 按奇偶排序数组 II【简单】/README"},{"text":"⏰ 0923. 三数之和的多种可能【中等】","link":"/TNotes.leetcode/0923. 三数之和的多种可能【中等】/README"},{"text":"⏰ 0924. 尽量减少恶意软件的传播【困难】","link":"/TNotes.leetcode/0924. 尽量减少恶意软件的传播【困难】/README"},{"text":"⏰ 0925. 长按键入【简单】","link":"/TNotes.leetcode/0925. 长按键入【简单】/README"},{"text":"⏰ 0926. 将字符串翻转到单调递增【中等】","link":"/TNotes.leetcode/0926. 将字符串翻转到单调递增【中等】/README"},{"text":"⏰ 0927. 三等分【困难】","link":"/TNotes.leetcode/0927. 三等分【困难】/README"},{"text":"⏰ 0928. 尽量减少恶意软件的传播 II【困难】","link":"/TNotes.leetcode/0928. 尽量减少恶意软件的传播 II【困难】/README"},{"text":"⏰ 0929. 独特的电子邮件地址【简单】","link":"/TNotes.leetcode/0929. 独特的电子邮件地址【简单】/README"},{"text":"⏰ 0930. 和相同的二元子数组【中等】","link":"/TNotes.leetcode/0930. 和相同的二元子数组【中等】/README"},{"text":"⏰ 0931. 下降路径最小和【中等】","link":"/TNotes.leetcode/0931. 下降路径最小和【中等】/README"},{"text":"⏰ 0932. 漂亮数组【中等】","link":"/TNotes.leetcode/0932. 漂亮数组【中等】/README"},{"text":"⏰ 0933. 最近的请求次数【简单】","link":"/TNotes.leetcode/0933. 最近的请求次数【简单】/README"},{"text":"⏰ 0934. 最短的桥【中等】","link":"/TNotes.leetcode/0934. 最短的桥【中等】/README"},{"text":"⏰ 0935. 骑士拨号器【中等】","link":"/TNotes.leetcode/0935. 骑士拨号器【中等】/README"},{"text":"⏰ 0936. 戳印序列【困难】","link":"/TNotes.leetcode/0936. 戳印序列【困难】/README"},{"text":"⏰ 0937. 重新排列日志文件【中等】","link":"/TNotes.leetcode/0937. 重新排列日志文件【中等】/README"},{"text":"⏰ 0938. 二叉搜索树的范围和【简单】","link":"/TNotes.leetcode/0938. 二叉搜索树的范围和【简单】/README"},{"text":"⏰ 0939. 最小面积矩形【中等】","link":"/TNotes.leetcode/0939. 最小面积矩形【中等】/README"},{"text":"⏰ 0940. 不同的子序列 II【困难】","link":"/TNotes.leetcode/0940. 不同的子序列 II【困难】/README"},{"text":"⏰ 0941. 有效的山脉数组【简单】","link":"/TNotes.leetcode/0941. 有效的山脉数组【简单】/README"},{"text":"⏰ 0942. 增减字符串匹配【简单】","link":"/TNotes.leetcode/0942. 增减字符串匹配【简单】/README"},{"text":"⏰ 0943. 最短超级串【困难】","link":"/TNotes.leetcode/0943. 最短超级串【困难】/README"},{"text":"⏰ 0944. 删列造序【简单】","link":"/TNotes.leetcode/0944. 删列造序【简单】/README"},{"text":"⏰ 0945. 使数组唯一的最小增量【中等】","link":"/TNotes.leetcode/0945. 使数组唯一的最小增量【中等】/README"},{"text":"⏰ 0946. 验证栈序列【中等】","link":"/TNotes.leetcode/0946. 验证栈序列【中等】/README"},{"text":"⏰ 0947. 移除最多的同行或同列石头【中等】","link":"/TNotes.leetcode/0947. 移除最多的同行或同列石头【中等】/README"},{"text":"⏰ 0948. 令牌放置【中等】","link":"/TNotes.leetcode/0948. 令牌放置【中等】/README"},{"text":"⏰ 0949. 给定数字能组成的最大时间【中等】","link":"/TNotes.leetcode/0949. 给定数字能组成的最大时间【中等】/README"},{"text":"⏰ 0950. 按递增顺序显示卡牌【中等】","link":"/TNotes.leetcode/0950. 按递增顺序显示卡牌【中等】/README"},{"text":"⏰ 0951. 翻转等价二叉树【中等】","link":"/TNotes.leetcode/0951. 翻转等价二叉树【中等】/README"},{"text":"⏰ 0952. 按公因数计算最大组件大小【困难】","link":"/TNotes.leetcode/0952. 按公因数计算最大组件大小【困难】/README"},{"text":"⏰ 0953. 验证外星语词典【简单】","link":"/TNotes.leetcode/0953. 验证外星语词典【简单】/README"},{"text":"⏰ 0954. 二倍数对数组【中等】","link":"/TNotes.leetcode/0954. 二倍数对数组【中等】/README"},{"text":"⏰ 0955. 删列造序 II【中等】","link":"/TNotes.leetcode/0955. 删列造序 II【中等】/README"},{"text":"⏰ 0956. 最高的广告牌【困难】","link":"/TNotes.leetcode/0956. 最高的广告牌【困难】/README"},{"text":"⏰ 0957. N 天后的牢房【中等】","link":"/TNotes.leetcode/0957. N 天后的牢房【中等】/README"},{"text":"⏰ 0958. 二叉树的完全性检验【中等】","link":"/TNotes.leetcode/0958. 二叉树的完全性检验【中等】/README"},{"text":"⏰ 0959. 由斜杠划分区域【中等】","link":"/TNotes.leetcode/0959. 由斜杠划分区域【中等】/README"},{"text":"⏰ 0960. 删列造序 III【困难】","link":"/TNotes.leetcode/0960. 删列造序 III【困难】/README"},{"text":"⏰ 0961. 在长度 2N 的数组中找出重复 N 次的元素【简单】","link":"/TNotes.leetcode/0961. 在长度 2N 的数组中找出重复 N 次的元素【简单】/README"},{"text":"⏰ 0962. 最大宽度坡【中等】","link":"/TNotes.leetcode/0962. 最大宽度坡【中等】/README"},{"text":"⏰ 0963. 最小面积矩形 II【中等】","link":"/TNotes.leetcode/0963. 最小面积矩形 II【中等】/README"},{"text":"⏰ 0964. 表示数字的最少运算符【困难】","link":"/TNotes.leetcode/0964. 表示数字的最少运算符【困难】/README"},{"text":"⏰ 0965. 单值二叉树【简单】","link":"/TNotes.leetcode/0965. 单值二叉树【简单】/README"},{"text":"⏰ 0966. 元音拼写检查器【中等】","link":"/TNotes.leetcode/0966. 元音拼写检查器【中等】/README"},{"text":"⏰ 0967. 连续差相同的数字【中等】","link":"/TNotes.leetcode/0967. 连续差相同的数字【中等】/README"},{"text":"⏰ 0968. 监控二叉树【困难】","link":"/TNotes.leetcode/0968. 监控二叉树【困难】/README"},{"text":"⏰ 0969. 煎饼排序【中等】","link":"/TNotes.leetcode/0969. 煎饼排序【中等】/README"},{"text":"⏰ 0970. 强整数【中等】","link":"/TNotes.leetcode/0970. 强整数【中等】/README"},{"text":"⏰ 0971. 翻转二叉树以匹配先序遍历【中等】","link":"/TNotes.leetcode/0971. 翻转二叉树以匹配先序遍历【中等】/README"},{"text":"⏰ 0972. 相等的有理数【困难】","link":"/TNotes.leetcode/0972. 相等的有理数【困难】/README"},{"text":"⏰ 0973. 最接近原点的 K 个点【中等】","link":"/TNotes.leetcode/0973. 最接近原点的 K 个点【中等】/README"},{"text":"⏰ 0974. 和可被 K 整除的子数组【中等】","link":"/TNotes.leetcode/0974. 和可被 K 整除的子数组【中等】/README"},{"text":"⏰ 0975. 奇偶跳【困难】","link":"/TNotes.leetcode/0975. 奇偶跳【困难】/README"},{"text":"⏰ 0976. 三角形的最大周长【简单】","link":"/TNotes.leetcode/0976. 三角形的最大周长【简单】/README"},{"text":"⏰ 0977. 有序数组的平方【简单】","link":"/TNotes.leetcode/0977. 有序数组的平方【简单】/README"},{"text":"⏰ 0978. 最长湍流子数组【中等】","link":"/TNotes.leetcode/0978. 最长湍流子数组【中等】/README"},{"text":"⏰ 0979. 在二叉树中分配硬币【中等】","link":"/TNotes.leetcode/0979. 在二叉树中分配硬币【中等】/README"},{"text":"⏰ 0980. 不同路径 III【困难】","link":"/TNotes.leetcode/0980. 不同路径 III【困难】/README"},{"text":"⏰ 0981. 基于时间的键值存储【中等】","link":"/TNotes.leetcode/0981. 基于时间的键值存储【中等】/README"},{"text":"⏰ 0982. 按位与为零的三元组【困难】","link":"/TNotes.leetcode/0982. 按位与为零的三元组【困难】/README"},{"text":"⏰ 0983. 最低票价【中等】","link":"/TNotes.leetcode/0983. 最低票价【中等】/README"},{"text":"⏰ 0984. 不含 AAA 或 BBB 的字符串【中等】","link":"/TNotes.leetcode/0984. 不含 AAA 或 BBB 的字符串【中等】/README"},{"text":"⏰ 0985. 查询后的偶数和【中等】","link":"/TNotes.leetcode/0985. 查询后的偶数和【中等】/README"},{"text":"⏰ 0986. 区间列表的交集【中等】","link":"/TNotes.leetcode/0986. 区间列表的交集【中等】/README"},{"text":"⏰ 0987. 二叉树的垂序遍历【困难】","link":"/TNotes.leetcode/0987. 二叉树的垂序遍历【困难】/README"},{"text":"⏰ 0988. 从叶结点开始的最小字符串【中等】","link":"/TNotes.leetcode/0988. 从叶结点开始的最小字符串【中等】/README"},{"text":"⏰ 0989. 数组形式的整数加法【简单】","link":"/TNotes.leetcode/0989. 数组形式的整数加法【简单】/README"},{"text":"⏰ 0990. 等式方程的可满足性【中等】","link":"/TNotes.leetcode/0990. 等式方程的可满足性【中等】/README"},{"text":"⏰ 0991. 坏了的计算器【中等】","link":"/TNotes.leetcode/0991. 坏了的计算器【中等】/README"},{"text":"⏰ 0992. K 个不同整数的子数组【困难】","link":"/TNotes.leetcode/0992. K 个不同整数的子数组【困难】/README"},{"text":"⏰ 0993. 二叉树的堂兄弟节点【简单】","link":"/TNotes.leetcode/0993. 二叉树的堂兄弟节点【简单】/README"},{"text":"⏰ 0994. 腐烂的橘子【中等】","link":"/TNotes.leetcode/0994. 腐烂的橘子【中等】/README"},{"text":"⏰ 0995. K 连续位的最小翻转次数【困难】","link":"/TNotes.leetcode/0995. K 连续位的最小翻转次数【困难】/README"},{"text":"⏰ 0996. 平方数组的数目【困难】","link":"/TNotes.leetcode/0996. 平方数组的数目【困难】/README"},{"text":"⏰ 0997. 找到小镇的法官【简单】","link":"/TNotes.leetcode/0997. 找到小镇的法官【简单】/README"},{"text":"⏰ 0998. 最大二叉树 II【中等】","link":"/TNotes.leetcode/0998. 最大二叉树 II【中等】/README"},{"text":"⏰ 0999. 可以被一步捕获的棋子数【简单】","link":"/TNotes.leetcode/0999. 可以被一步捕获的棋子数【简单】/README"},{"text":"⏰ 1000. 合并石头的最低成本【困难】","link":"/TNotes.leetcode/1000. 合并石头的最低成本【困难】/README"},{"text":"⏰ 1001. 网格照明【困难】","link":"/TNotes.leetcode/1001. 网格照明【困难】/README"},{"text":"⏰ 1002. 查找共用字符【简单】","link":"/TNotes.leetcode/1002. 查找共用字符【简单】/README"},{"text":"⏰ 1003. 检查替换后的词是否有效【中等】","link":"/TNotes.leetcode/1003. 检查替换后的词是否有效【中等】/README"},{"text":"⏰ 1004. 最大连续1的个数 III【中等】","link":"/TNotes.leetcode/1004. 最大连续1的个数 III【中等】/README"},{"text":"⏰ 1005. K 次取反后最大化的数组和【简单】","link":"/TNotes.leetcode/1005. K 次取反后最大化的数组和【简单】/README"},{"text":"⏰ 1006. 笨阶乘【中等】","link":"/TNotes.leetcode/1006. 笨阶乘【中等】/README"},{"text":"⏰ 1007. 行相等的最少多米诺旋转【中等】","link":"/TNotes.leetcode/1007. 行相等的最少多米诺旋转【中等】/README"},{"text":"⏰ 1008. 前序遍历构造二叉搜索树【中等】","link":"/TNotes.leetcode/1008. 前序遍历构造二叉搜索树【中等】/README"},{"text":"⏰ 1009. 十进制整数的反码【简单】","link":"/TNotes.leetcode/1009. 十进制整数的反码【简单】/README"},{"text":"⏰ 1010. 总持续时间可被 60 整除的歌曲【中等】","link":"/TNotes.leetcode/1010. 总持续时间可被 60 整除的歌曲【中等】/README"},{"text":"⏰ 1011. 在 D 天内送达包裹的能力【中等】","link":"/TNotes.leetcode/1011. 在 D 天内送达包裹的能力【中等】/README"},{"text":"⏰ 1012. 至少有 1 位重复的数字【困难】","link":"/TNotes.leetcode/1012. 至少有 1 位重复的数字【困难】/README"},{"text":"⏰ 1013. 将数组分成和相等的三个部分【简单】","link":"/TNotes.leetcode/1013. 将数组分成和相等的三个部分【简单】/README"},{"text":"⏰ 1014. 最佳观光组合【中等】","link":"/TNotes.leetcode/1014. 最佳观光组合【中等】/README"},{"text":"⏰ 1015. 可被 K 整除的最小整数【中等】","link":"/TNotes.leetcode/1015. 可被 K 整除的最小整数【中等】/README"},{"text":"⏰ 1016. 子串能表示从 1 到 N 数字的二进制串【中等】","link":"/TNotes.leetcode/1016. 子串能表示从 1 到 N 数字的二进制串【中等】/README"},{"text":"⏰ 1017. 负二进制转换【中等】","link":"/TNotes.leetcode/1017. 负二进制转换【中等】/README"},{"text":"⏰ 1018. 可被 5 整除的二进制前缀【简单】","link":"/TNotes.leetcode/1018. 可被 5 整除的二进制前缀【简单】/README"},{"text":"⏰ 1019. 链表中的下一个更大节点【中等】","link":"/TNotes.leetcode/1019. 链表中的下一个更大节点【中等】/README"},{"text":"⏰ 1020. 飞地的数量【中等】","link":"/TNotes.leetcode/1020. 飞地的数量【中等】/README"},{"text":"⏰ 1021. 删除最外层的括号【简单】","link":"/TNotes.leetcode/1021. 删除最外层的括号【简单】/README"},{"text":"⏰ 1022. 从根到叶的二进制数之和【简单】","link":"/TNotes.leetcode/1022. 从根到叶的二进制数之和【简单】/README"},{"text":"⏰ 1023. 驼峰式匹配【中等】","link":"/TNotes.leetcode/1023. 驼峰式匹配【中等】/README"},{"text":"⏰ 1024. 视频拼接【中等】","link":"/TNotes.leetcode/1024. 视频拼接【中等】/README"},{"text":"⏰ 1025. 除数博弈【简单】","link":"/TNotes.leetcode/1025. 除数博弈【简单】/README"},{"text":"⏰ 1026. 节点与其祖先之间的最大差值【中等】","link":"/TNotes.leetcode/1026. 节点与其祖先之间的最大差值【中等】/README"},{"text":"⏰ 1027. 最长等差数列【中等】","link":"/TNotes.leetcode/1027. 最长等差数列【中等】/README"},{"text":"⏰ 1028. 从先序遍历还原二叉树【困难】","link":"/TNotes.leetcode/1028. 从先序遍历还原二叉树【困难】/README"},{"text":"⏰ 1029. 两地调度【中等】","link":"/TNotes.leetcode/1029. 两地调度【中等】/README"},{"text":"⏰ 1030. 距离顺序排列矩阵单元格【简单】","link":"/TNotes.leetcode/1030. 距离顺序排列矩阵单元格【简单】/README"},{"text":"⏰ 1031. 两个非重叠子数组的最大和【中等】","link":"/TNotes.leetcode/1031. 两个非重叠子数组的最大和【中等】/README"},{"text":"⏰ 1032. 字符流【困难】","link":"/TNotes.leetcode/1032. 字符流【困难】/README"},{"text":"⏰ 1033. 移动石子直到连续【中等】","link":"/TNotes.leetcode/1033. 移动石子直到连续【中等】/README"},{"text":"⏰ 1034. 边界着色【中等】","link":"/TNotes.leetcode/1034. 边界着色【中等】/README"},{"text":"⏰ 1035. 不相交的线【中等】","link":"/TNotes.leetcode/1035. 不相交的线【中等】/README"},{"text":"⏰ 1036. 逃离大迷宫【困难】","link":"/TNotes.leetcode/1036. 逃离大迷宫【困难】/README"},{"text":"⏰ 1037. 有效的回旋镖【简单】","link":"/TNotes.leetcode/1037. 有效的回旋镖【简单】/README"},{"text":"⏰ 1038. 从二叉搜索树到更大和树【中等】","link":"/TNotes.leetcode/1038. 从二叉搜索树到更大和树【中等】/README"},{"text":"⏰ 1039. 多边形三角剖分的最低得分【中等】","link":"/TNotes.leetcode/1039. 多边形三角剖分的最低得分【中等】/README"},{"text":"⏰ 1040. 移动石子直到连续 II【中等】","link":"/TNotes.leetcode/1040. 移动石子直到连续 II【中等】/README"},{"text":"⏰ 1041. 困于环中的机器人【中等】","link":"/TNotes.leetcode/1041. 困于环中的机器人【中等】/README"},{"text":"⏰ 1042. 不邻接植花【中等】","link":"/TNotes.leetcode/1042. 不邻接植花【中等】/README"},{"text":"⏰ 1043. 分隔数组以得到最大和【中等】","link":"/TNotes.leetcode/1043. 分隔数组以得到最大和【中等】/README"},{"text":"⏰ 1044. 最长重复子串【困难】","link":"/TNotes.leetcode/1044. 最长重复子串【困难】/README"},{"text":"⏰ 1045. 买下所有产品的客户【中等】","link":"/TNotes.leetcode/1045. 买下所有产品的客户【中等】/README"},{"text":"⏰ 1046. 最后一块石头的重量【简单】","link":"/TNotes.leetcode/1046. 最后一块石头的重量【简单】/README"},{"text":"⏰ 1047. 删除字符串中的所有相邻重复项【简单】","link":"/TNotes.leetcode/1047. 删除字符串中的所有相邻重复项【简单】/README"},{"text":"⏰ 1048. 最长字符串链【中等】","link":"/TNotes.leetcode/1048. 最长字符串链【中等】/README"},{"text":"⏰ 1049. 最后一块石头的重量 II【中等】","link":"/TNotes.leetcode/1049. 最后一块石头的重量 II【中等】/README"},{"text":"⏰ 1050. 合作过至少三次的演员和导演【简单】","link":"/TNotes.leetcode/1050. 合作过至少三次的演员和导演【简单】/README"},{"text":"⏰ 1051. 高度检查器【简单】","link":"/TNotes.leetcode/1051. 高度检查器【简单】/README"},{"text":"⏰ 1052. 爱生气的书店老板【中等】","link":"/TNotes.leetcode/1052. 爱生气的书店老板【中等】/README"},{"text":"⏰ 1053. 交换一次的先前排列【中等】","link":"/TNotes.leetcode/1053. 交换一次的先前排列【中等】/README"},{"text":"⏰ 1054. 距离相等的条形码【中等】","link":"/TNotes.leetcode/1054. 距离相等的条形码【中等】/README"},{"text":"⏰ 1055. 形成字符串的最短路径【中等】","link":"/TNotes.leetcode/1055. 形成字符串的最短路径【中等】/README"},{"text":"⏰ 1056. 易混淆数【简单】","link":"/TNotes.leetcode/1056. 易混淆数【简单】/README"},{"text":"⏰ 1057. 校园自行车分配【中等】","link":"/TNotes.leetcode/1057. 校园自行车分配【中等】/README"},{"text":"⏰ 1058. 最小化舍入误差以满足目标【中等】","link":"/TNotes.leetcode/1058. 最小化舍入误差以满足目标【中等】/README"},{"text":"⏰ 1059. 从始点到终点的所有路径【中等】","link":"/TNotes.leetcode/1059. 从始点到终点的所有路径【中等】/README"},{"text":"⏰ 1060. 有序数组中的缺失元素【中等】","link":"/TNotes.leetcode/1060. 有序数组中的缺失元素【中等】/README"},{"text":"⏰ 1061. 按字典序排列最小的等效字符串【中等】","link":"/TNotes.leetcode/1061. 按字典序排列最小的等效字符串【中等】/README"},{"text":"⏰ 1062. 最长重复子串【中等】","link":"/TNotes.leetcode/1062. 最长重复子串【中等】/README"},{"text":"⏰ 1063. 有效子数组的数目【困难】","link":"/TNotes.leetcode/1063. 有效子数组的数目【困难】/README"},{"text":"⏰ 1064. 不动点【简单】","link":"/TNotes.leetcode/1064. 不动点【简单】/README"},{"text":"⏰ 1065. 字符串的索引对【简单】","link":"/TNotes.leetcode/1065. 字符串的索引对【简单】/README"},{"text":"⏰ 1066. 校园自行车分配 II【中等】","link":"/TNotes.leetcode/1066. 校园自行车分配 II【中等】/README"},{"text":"⏰ 1067. 范围内的数字计数【困难】","link":"/TNotes.leetcode/1067. 范围内的数字计数【困难】/README"},{"text":"⏰ 1068. 产品销售分析 I【简单】","link":"/TNotes.leetcode/1068. 产品销售分析 I【简单】/README"},{"text":"⏰ 1069. 产品销售分析 II【简单】","link":"/TNotes.leetcode/1069. 产品销售分析 II【简单】/README"},{"text":"⏰ 1070. 产品销售分析 III【中等】","link":"/TNotes.leetcode/1070. 产品销售分析 III【中等】/README"},{"text":"⏰ 1071. 字符串的最大公因子【简单】","link":"/TNotes.leetcode/1071. 字符串的最大公因子【简单】/README"},{"text":"⏰ 1072. 按列翻转得到最大值等行数【中等】","link":"/TNotes.leetcode/1072. 按列翻转得到最大值等行数【中等】/README"},{"text":"⏰ 1073. 负二进制数相加【中等】","link":"/TNotes.leetcode/1073. 负二进制数相加【中等】/README"},{"text":"⏰ 1074. 元素和为目标值的子矩阵数量【困难】","link":"/TNotes.leetcode/1074. 元素和为目标值的子矩阵数量【困难】/README"},{"text":"⏰ 1075. 项目员工 I【简单】","link":"/TNotes.leetcode/1075. 项目员工 I【简单】/README"},{"text":"⏰ 1076. 项目员工II【简单】","link":"/TNotes.leetcode/1076. 项目员工II【简单】/README"},{"text":"⏰ 1077. 项目员工 III【中等】","link":"/TNotes.leetcode/1077. 项目员工 III【中等】/README"},{"text":"⏰ 1078. Bigram 分词【简单】","link":"/TNotes.leetcode/1078. Bigram 分词【简单】/README"},{"text":"⏰ 1079. 活字印刷【中等】","link":"/TNotes.leetcode/1079. 活字印刷【中等】/README"},{"text":"⏰ 1080. 根到叶路径上的不足节点【中等】","link":"/TNotes.leetcode/1080. 根到叶路径上的不足节点【中等】/README"},{"text":"⏰ 1081. 不同字符的最小子序列【中等】","link":"/TNotes.leetcode/1081. 不同字符的最小子序列【中等】/README"},{"text":"⏰ 1082. 销售分析 I【简单】","link":"/TNotes.leetcode/1082. 销售分析 I【简单】/README"},{"text":"⏰ 1083. 销售分析 II【简单】","link":"/TNotes.leetcode/1083. 销售分析 II【简单】/README"},{"text":"⏰ 1084. 销售分析 III【简单】","link":"/TNotes.leetcode/1084. 销售分析 III【简单】/README"},{"text":"⏰ 1085. 最小元素各数位之和【简单】","link":"/TNotes.leetcode/1085. 最小元素各数位之和【简单】/README"},{"text":"⏰ 1086. 前五科的均分【简单】","link":"/TNotes.leetcode/1086. 前五科的均分【简单】/README"},{"text":"⏰ 1087. 花括号展开【中等】","link":"/TNotes.leetcode/1087. 花括号展开【中等】/README"},{"text":"⏰ 1088. 易混淆数 II【困难】","link":"/TNotes.leetcode/1088. 易混淆数 II【困难】/README"},{"text":"⏰ 1089. 复写零【简单】","link":"/TNotes.leetcode/1089. 复写零【简单】/README"},{"text":"⏰ 1090. 受标签影响的最大值【中等】","link":"/TNotes.leetcode/1090. 受标签影响的最大值【中等】/README"},{"text":"⏰ 1091. 二进制矩阵中的最短路径【中等】","link":"/TNotes.leetcode/1091. 二进制矩阵中的最短路径【中等】/README"},{"text":"⏰ 1092. 最短公共超序列【困难】","link":"/TNotes.leetcode/1092. 最短公共超序列【困难】/README"},{"text":"⏰ 1093. 大样本统计【中等】","link":"/TNotes.leetcode/1093. 大样本统计【中等】/README"},{"text":"⏰ 1094. 拼车【中等】","link":"/TNotes.leetcode/1094. 拼车【中等】/README"},{"text":"⏰ 1095. 山脉数组中查找目标值【困难】","link":"/TNotes.leetcode/1095. 山脉数组中查找目标值【困难】/README"},{"text":"⏰ 1096. 花括号展开 II【困难】","link":"/TNotes.leetcode/1096. 花括号展开 II【困难】/README"},{"text":"⏰ 1097. 游戏玩法分析 V【困难】","link":"/TNotes.leetcode/1097. 游戏玩法分析 V【困难】/README"},{"text":"⏰ 1098. 小众书籍【中等】","link":"/TNotes.leetcode/1098. 小众书籍【中等】/README"},{"text":"⏰ 1099. 小于 K 的两数之和【简单】","link":"/TNotes.leetcode/1099. 小于 K 的两数之和【简单】/README"},{"text":"⏰ 1100. 长度为 K 的无重复字符子串【中等】","link":"/TNotes.leetcode/1100. 长度为 K 的无重复字符子串【中等】/README"},{"text":"⏰ 1101. 彼此熟识的最早时间【中等】","link":"/TNotes.leetcode/1101. 彼此熟识的最早时间【中等】/README"},{"text":"⏰ 1102. 得分最高的路径【中等】","link":"/TNotes.leetcode/1102. 得分最高的路径【中等】/README"},{"text":"⏰ 1103. 分糖果 II【简单】","link":"/TNotes.leetcode/1103. 分糖果 II【简单】/README"},{"text":"⏰ 1104. 二叉树寻路【中等】","link":"/TNotes.leetcode/1104. 二叉树寻路【中等】/README"},{"text":"⏰ 1105. 填充书架【中等】","link":"/TNotes.leetcode/1105. 填充书架【中等】/README"},{"text":"⏰ 1106. 解析布尔表达式【困难】","link":"/TNotes.leetcode/1106. 解析布尔表达式【困难】/README"},{"text":"⏰ 1107. 每日新用户统计【中等】","link":"/TNotes.leetcode/1107. 每日新用户统计【中等】/README"},{"text":"⏰ 1108. IP 地址无效化【简单】","link":"/TNotes.leetcode/1108. IP 地址无效化【简单】/README"},{"text":"⏰ 1109. 航班预订统计【中等】","link":"/TNotes.leetcode/1109. 航班预订统计【中等】/README"},{"text":"⏰ 1110. 删点成林【中等】","link":"/TNotes.leetcode/1110. 删点成林【中等】/README"},{"text":"⏰ 1111. 有效括号的嵌套深度【中等】","link":"/TNotes.leetcode/1111. 有效括号的嵌套深度【中等】/README"},{"text":"⏰ 1112. 每位学生的最高成绩【中等】","link":"/TNotes.leetcode/1112. 每位学生的最高成绩【中等】/README"},{"text":"⏰ 1113. 报告的记录【简单】","link":"/TNotes.leetcode/1113. 报告的记录【简单】/README"},{"text":"⏰ 1114. 按序打印【简单】","link":"/TNotes.leetcode/1114. 按序打印【简单】/README"},{"text":"⏰ 1115. 交替打印 FooBar【中等】","link":"/TNotes.leetcode/1115. 交替打印 FooBar【中等】/README"},{"text":"⏰ 1116. 打印零与奇偶数【中等】","link":"/TNotes.leetcode/1116. 打印零与奇偶数【中等】/README"},{"text":"⏰ 1117. H2O 生成【中等】","link":"/TNotes.leetcode/1117. H2O 生成【中等】/README"},{"text":"⏰ 1118. 一月有多少天【简单】","link":"/TNotes.leetcode/1118. 一月有多少天【简单】/README"},{"text":"⏰ 1119. 删去字符串中的元音【简单】","link":"/TNotes.leetcode/1119. 删去字符串中的元音【简单】/README"},{"text":"⏰ 1120. 子树的最大平均值【中等】","link":"/TNotes.leetcode/1120. 子树的最大平均值【中等】/README"},{"text":"⏰ 1121. 将数组分成几个递增序列【困难】","link":"/TNotes.leetcode/1121. 将数组分成几个递增序列【困难】/README"},{"text":"⏰ 1122. 数组的相对排序【简单】","link":"/TNotes.leetcode/1122. 数组的相对排序【简单】/README"},{"text":"⏰ 1123. 最深叶节点的最近公共祖先【中等】","link":"/TNotes.leetcode/1123. 最深叶节点的最近公共祖先【中等】/README"},{"text":"⏰ 1124. 表现良好的最长时间段【中等】","link":"/TNotes.leetcode/1124. 表现良好的最长时间段【中等】/README"},{"text":"⏰ 1125. 最小的必要团队【困难】","link":"/TNotes.leetcode/1125. 最小的必要团队【困难】/README"},{"text":"⏰ 1126. 查询活跃业务【中等】","link":"/TNotes.leetcode/1126. 查询活跃业务【中等】/README"},{"text":"⏰ 1127. 用户购买平台【困难】","link":"/TNotes.leetcode/1127. 用户购买平台【困难】/README"},{"text":"⏰ 1128. 等价多米诺骨牌对的数量【简单】","link":"/TNotes.leetcode/1128. 等价多米诺骨牌对的数量【简单】/README"},{"text":"⏰ 1129. 颜色交替的最短路径【中等】","link":"/TNotes.leetcode/1129. 颜色交替的最短路径【中等】/README"},{"text":"⏰ 1130. 叶值的最小代价生成树【中等】","link":"/TNotes.leetcode/1130. 叶值的最小代价生成树【中等】/README"},{"text":"⏰ 1131. 绝对值表达式的最大值【中等】","link":"/TNotes.leetcode/1131. 绝对值表达式的最大值【中等】/README"},{"text":"⏰ 1132. 报告的记录 II【中等】","link":"/TNotes.leetcode/1132. 报告的记录 II【中等】/README"},{"text":"⏰ 1133. 最大唯一数【简单】","link":"/TNotes.leetcode/1133. 最大唯一数【简单】/README"},{"text":"⏰ 1134. 阿姆斯特朗数【简单】","link":"/TNotes.leetcode/1134. 阿姆斯特朗数【简单】/README"},{"text":"⏰ 1135. 最低成本连通所有城市【中等】","link":"/TNotes.leetcode/1135. 最低成本连通所有城市【中等】/README"},{"text":"⏰ 1136. 并行课程【中等】","link":"/TNotes.leetcode/1136. 并行课程【中等】/README"},{"text":"⏰ 1137. 第 N 个泰波那契数【简单】","link":"/TNotes.leetcode/1137. 第 N 个泰波那契数【简单】/README"},{"text":"⏰ 1138. 字母板上的路径【中等】","link":"/TNotes.leetcode/1138. 字母板上的路径【中等】/README"},{"text":"⏰ 1139. 最大的以 1 为边界的正方形【中等】","link":"/TNotes.leetcode/1139. 最大的以 1 为边界的正方形【中等】/README"},{"text":"⏰ 1140. 石子游戏 II【中等】","link":"/TNotes.leetcode/1140. 石子游戏 II【中等】/README"},{"text":"⏰ 1141. 查询近30天活跃用户数【简单】","link":"/TNotes.leetcode/1141. 查询近30天活跃用户数【简单】/README"},{"text":"⏰ 1142. 过去30天的用户活动 II【简单】","link":"/TNotes.leetcode/1142. 过去30天的用户活动 II【简单】/README"},{"text":"⏰ 1143. 最长公共子序列【中等】","link":"/TNotes.leetcode/1143. 最长公共子序列【中等】/README"},{"text":"⏰ 1144. 递减元素使数组呈锯齿状【中等】","link":"/TNotes.leetcode/1144. 递减元素使数组呈锯齿状【中等】/README"},{"text":"⏰ 1145. 二叉树着色游戏【中等】","link":"/TNotes.leetcode/1145. 二叉树着色游戏【中等】/README"},{"text":"⏰ 1146. 快照数组【中等】","link":"/TNotes.leetcode/1146. 快照数组【中等】/README"},{"text":"⏰ 1147. 段式回文【困难】","link":"/TNotes.leetcode/1147. 段式回文【困难】/README"},{"text":"⏰ 1148. 文章浏览 I【简单】","link":"/TNotes.leetcode/1148. 文章浏览 I【简单】/README"},{"text":"⏰ 1149. 文章浏览 II【中等】","link":"/TNotes.leetcode/1149. 文章浏览 II【中等】/README"},{"text":"⏰ 1150. 检查一个数是否在数组中占绝大多数【简单】","link":"/TNotes.leetcode/1150. 检查一个数是否在数组中占绝大多数【简单】/README"},{"text":"⏰ 1151. 最少交换次数来组合所有的 1【中等】","link":"/TNotes.leetcode/1151. 最少交换次数来组合所有的 1【中等】/README"},{"text":"⏰ 1152. 用户网站访问行为分析【中等】","link":"/TNotes.leetcode/1152. 用户网站访问行为分析【中等】/README"},{"text":"⏰ 1153. 字符串转化【困难】","link":"/TNotes.leetcode/1153. 字符串转化【困难】/README"},{"text":"⏰ 1154. 一年中的第几天【简单】","link":"/TNotes.leetcode/1154. 一年中的第几天【简单】/README"},{"text":"⏰ 1155. 掷骰子等于目标和的方法数【中等】","link":"/TNotes.leetcode/1155. 掷骰子等于目标和的方法数【中等】/README"},{"text":"⏰ 1156. 单字符重复子串的最大长度【中等】","link":"/TNotes.leetcode/1156. 单字符重复子串的最大长度【中等】/README"},{"text":"⏰ 1157. 子数组中占绝大多数的元素【困难】","link":"/TNotes.leetcode/1157. 子数组中占绝大多数的元素【困难】/README"},{"text":"⏰ 1158. 市场分析 I【中等】","link":"/TNotes.leetcode/1158. 市场分析 I【中等】/README"},{"text":"⏰ 1159. 市场分析 II【困难】","link":"/TNotes.leetcode/1159. 市场分析 II【困难】/README"},{"text":"⏰ 1160. 拼写单词【简单】","link":"/TNotes.leetcode/1160. 拼写单词【简单】/README"},{"text":"⏰ 1161. 最大层内元素和【中等】","link":"/TNotes.leetcode/1161. 最大层内元素和【中等】/README"},{"text":"⏰ 1162. 地图分析【中等】","link":"/TNotes.leetcode/1162. 地图分析【中等】/README"},{"text":"⏰ 1163. 按字典序排在最后的子串【困难】","link":"/TNotes.leetcode/1163. 按字典序排在最后的子串【困难】/README"},{"text":"⏰ 1164. 指定日期的产品价格【中等】","link":"/TNotes.leetcode/1164. 指定日期的产品价格【中等】/README"},{"text":"⏰ 1165. 单行键盘【简单】","link":"/TNotes.leetcode/1165. 单行键盘【简单】/README"},{"text":"⏰ 1166. 设计文件系统【中等】","link":"/TNotes.leetcode/1166. 设计文件系统【中等】/README"},{"text":"⏰ 1167. 连接木棍的最低费用【中等】","link":"/TNotes.leetcode/1167. 连接木棍的最低费用【中等】/README"},{"text":"⏰ 1168. 水资源分配优化【困难】","link":"/TNotes.leetcode/1168. 水资源分配优化【困难】/README"},{"text":"⏰ 1169. 查询无效交易【中等】","link":"/TNotes.leetcode/1169. 查询无效交易【中等】/README"},{"text":"⏰ 1170. 比较字符串最小字母出现频次【中等】","link":"/TNotes.leetcode/1170. 比较字符串最小字母出现频次【中等】/README"},{"text":"⏰ 1171. 从链表中删去总和值为零的连续节点【中等】","link":"/TNotes.leetcode/1171. 从链表中删去总和值为零的连续节点【中等】/README"},{"text":"⏰ 1172. 餐盘栈【困难】","link":"/TNotes.leetcode/1172. 餐盘栈【困难】/README"},{"text":"⏰ 1173. 即时食物配送 I【简单】","link":"/TNotes.leetcode/1173. 即时食物配送 I【简单】/README"},{"text":"⏰ 1174. 即时食物配送 II【中等】","link":"/TNotes.leetcode/1174. 即时食物配送 II【中等】/README"},{"text":"⏰ 1175. 质数排列【简单】","link":"/TNotes.leetcode/1175. 质数排列【简单】/README"},{"text":"⏰ 1176. 健身计划评估【简单】","link":"/TNotes.leetcode/1176. 健身计划评估【简单】/README"},{"text":"⏰ 1177. 构建回文串检测【中等】","link":"/TNotes.leetcode/1177. 构建回文串检测【中等】/README"},{"text":"⏰ 1178. 猜字谜【困难】","link":"/TNotes.leetcode/1178. 猜字谜【困难】/README"},{"text":"⏰ 1179. 重新格式化部门表【简单】","link":"/TNotes.leetcode/1179. 重新格式化部门表【简单】/README"},{"text":"⏰ 1180. 统计只含单一字母的子串【简单】","link":"/TNotes.leetcode/1180. 统计只含单一字母的子串【简单】/README"},{"text":"⏰ 1181. 前后拼接【中等】","link":"/TNotes.leetcode/1181. 前后拼接【中等】/README"},{"text":"⏰ 1182. 与目标颜色间的最短距离【中等】","link":"/TNotes.leetcode/1182. 与目标颜色间的最短距离【中等】/README"},{"text":"⏰ 1183. 矩阵中 1 的最大数量【困难】","link":"/TNotes.leetcode/1183. 矩阵中 1 的最大数量【困难】/README"},{"text":"⏰ 1184. 公交站间的距离【简单】","link":"/TNotes.leetcode/1184. 公交站间的距离【简单】/README"},{"text":"⏰ 1185. 一周中的第几天【简单】","link":"/TNotes.leetcode/1185. 一周中的第几天【简单】/README"},{"text":"⏰ 1186. 删除一次得到子数组最大和【中等】","link":"/TNotes.leetcode/1186. 删除一次得到子数组最大和【中等】/README"},{"text":"⏰ 1187. 使数组严格递增【困难】","link":"/TNotes.leetcode/1187. 使数组严格递增【困难】/README"},{"text":"⏰ 1188. 设计有限阻塞队列【中等】","link":"/TNotes.leetcode/1188. 设计有限阻塞队列【中等】/README"},{"text":"⏰ 1189. “气球” 的最大数量【简单】","link":"/TNotes.leetcode/1189. “气球” 的最大数量【简单】/README"},{"text":"⏰ 1190. 反转每对括号间的子串【中等】","link":"/TNotes.leetcode/1190. 反转每对括号间的子串【中等】/README"},{"text":"⏰ 1191. K 次串联后最大子数组之和【中等】","link":"/TNotes.leetcode/1191. K 次串联后最大子数组之和【中等】/README"},{"text":"⏰ 1192. 查找集群内的关键连接【困难】","link":"/TNotes.leetcode/1192. 查找集群内的关键连接【困难】/README"},{"text":"⏰ 1193. 每月交易 I【中等】","link":"/TNotes.leetcode/1193. 每月交易 I【中等】/README"},{"text":"⏰ 1194. 锦标赛优胜者【困难】","link":"/TNotes.leetcode/1194. 锦标赛优胜者【困难】/README"},{"text":"⏰ 1195. 交替打印字符串【中等】","link":"/TNotes.leetcode/1195. 交替打印字符串【中等】/README"},{"text":"⏰ 1196. 最多可以买到的苹果数量【简单】","link":"/TNotes.leetcode/1196. 最多可以买到的苹果数量【简单】/README"},{"text":"⏰ 1197. 进击的骑士【中等】","link":"/TNotes.leetcode/1197. 进击的骑士【中等】/README"},{"text":"⏰ 1198. 找出所有行中最小公共元素【中等】","link":"/TNotes.leetcode/1198. 找出所有行中最小公共元素【中等】/README"},{"text":"⏰ 1199. 建造街区的最短时间【困难】","link":"/TNotes.leetcode/1199. 建造街区的最短时间【困难】/README"},{"text":"⏰ 1200. 最小绝对差【简单】","link":"/TNotes.leetcode/1200. 最小绝对差【简单】/README"},{"text":"⏰ 1201. 丑数 III【中等】","link":"/TNotes.leetcode/1201. 丑数 III【中等】/README"},{"text":"⏰ 1202. 交换字符串中的元素【中等】","link":"/TNotes.leetcode/1202. 交换字符串中的元素【中等】/README"},{"text":"⏰ 1203. 项目管理【困难】","link":"/TNotes.leetcode/1203. 项目管理【困难】/README"},{"text":"⏰ 1204. 最后一个能进入巴士的人【中等】","link":"/TNotes.leetcode/1204. 最后一个能进入巴士的人【中等】/README"},{"text":"⏰ 1205. 每月交易 II【中等】","link":"/TNotes.leetcode/1205. 每月交易 II【中等】/README"},{"text":"⏰ 1206. 设计跳表【困难】","link":"/TNotes.leetcode/1206. 设计跳表【困难】/README"},{"text":"⏰ 1207. 独一无二的出现次数【简单】","link":"/TNotes.leetcode/1207. 独一无二的出现次数【简单】/README"},{"text":"⏰ 1208. 尽可能使字符串相等【中等】","link":"/TNotes.leetcode/1208. 尽可能使字符串相等【中等】/README"},{"text":"⏰ 1209. 删除字符串中的所有相邻重复项 II【中等】","link":"/TNotes.leetcode/1209. 删除字符串中的所有相邻重复项 II【中等】/README"},{"text":"⏰ 1210. 穿过迷宫的最少移动次数【困难】","link":"/TNotes.leetcode/1210. 穿过迷宫的最少移动次数【困难】/README"},{"text":"⏰ 1211. 查询结果的质量和占比【简单】","link":"/TNotes.leetcode/1211. 查询结果的质量和占比【简单】/README"},{"text":"⏰ 1212. 查询球队积分【中等】","link":"/TNotes.leetcode/1212. 查询球队积分【中等】/README"},{"text":"⏰ 1213. 三个有序数组的交集【简单】","link":"/TNotes.leetcode/1213. 三个有序数组的交集【简单】/README"},{"text":"⏰ 1214. 查找两棵二叉搜索树之和【中等】","link":"/TNotes.leetcode/1214. 查找两棵二叉搜索树之和【中等】/README"},{"text":"⏰ 1215. 步进数【中等】","link":"/TNotes.leetcode/1215. 步进数【中等】/README"},{"text":"⏰ 1216. 验证回文串 III【困难】","link":"/TNotes.leetcode/1216. 验证回文串 III【困难】/README"},{"text":"⏰ 1217. 玩筹码【简单】","link":"/TNotes.leetcode/1217. 玩筹码【简单】/README"},{"text":"⏰ 1218. 最长定差子序列【中等】","link":"/TNotes.leetcode/1218. 最长定差子序列【中等】/README"},{"text":"⏰ 1219. 黄金矿工【中等】","link":"/TNotes.leetcode/1219. 黄金矿工【中等】/README"},{"text":"⏰ 1220. 统计元音字母序列的数目【困难】","link":"/TNotes.leetcode/1220. 统计元音字母序列的数目【困难】/README"},{"text":"⏰ 1221. 分割平衡字符串【简单】","link":"/TNotes.leetcode/1221. 分割平衡字符串【简单】/README"},{"text":"⏰ 1222. 可以攻击国王的皇后【中等】","link":"/TNotes.leetcode/1222. 可以攻击国王的皇后【中等】/README"},{"text":"⏰ 1223. 掷骰子模拟【困难】","link":"/TNotes.leetcode/1223. 掷骰子模拟【困难】/README"},{"text":"⏰ 1224. 最大相等频率【困难】","link":"/TNotes.leetcode/1224. 最大相等频率【困难】/README"},{"text":"⏰ 1225. 报告系统状态的连续日期【困难】","link":"/TNotes.leetcode/1225. 报告系统状态的连续日期【困难】/README"},{"text":"⏰ 1226. 哲学家进餐【中等】","link":"/TNotes.leetcode/1226. 哲学家进餐【中等】/README"},{"text":"⏰ 1227. 飞机座位分配概率【中等】","link":"/TNotes.leetcode/1227. 飞机座位分配概率【中等】/README"},{"text":"⏰ 1228. 等差数列中缺失的数字【简单】","link":"/TNotes.leetcode/1228. 等差数列中缺失的数字【简单】/README"},{"text":"⏰ 1229. 安排会议日程【中等】","link":"/TNotes.leetcode/1229. 安排会议日程【中等】/README"},{"text":"⏰ 1230. 抛掷硬币【中等】","link":"/TNotes.leetcode/1230. 抛掷硬币【中等】/README"},{"text":"⏰ 1231. 分享巧克力【困难】","link":"/TNotes.leetcode/1231. 分享巧克力【困难】/README"},{"text":"⏰ 1232. 缀点成线【简单】","link":"/TNotes.leetcode/1232. 缀点成线【简单】/README"},{"text":"⏰ 1233. 删除子文件夹【中等】","link":"/TNotes.leetcode/1233. 删除子文件夹【中等】/README"},{"text":"⏰ 1234. 替换子串得到平衡字符串【中等】","link":"/TNotes.leetcode/1234. 替换子串得到平衡字符串【中等】/README"},{"text":"⏰ 1235. 规划兼职工作【困难】","link":"/TNotes.leetcode/1235. 规划兼职工作【困难】/README"},{"text":"⏰ 1236. 网络爬虫【中等】","link":"/TNotes.leetcode/1236. 网络爬虫【中等】/README"},{"text":"⏰ 1237. 找出给定方程的正整数解【中等】","link":"/TNotes.leetcode/1237. 找出给定方程的正整数解【中等】/README"},{"text":"⏰ 1238. 循环码排列【中等】","link":"/TNotes.leetcode/1238. 循环码排列【中等】/README"},{"text":"⏰ 1239. 串联字符串的最大长度【中等】","link":"/TNotes.leetcode/1239. 串联字符串的最大长度【中等】/README"},{"text":"⏰ 1240. 铺瓷砖【困难】","link":"/TNotes.leetcode/1240. 铺瓷砖【困难】/README"},{"text":"⏰ 1241. 每个帖子的评论数【简单】","link":"/TNotes.leetcode/1241. 每个帖子的评论数【简单】/README"},{"text":"⏰ 1242. 多线程网页爬虫【中等】","link":"/TNotes.leetcode/1242. 多线程网页爬虫【中等】/README"},{"text":"⏰ 1243. 数组变换【简单】","link":"/TNotes.leetcode/1243. 数组变换【简单】/README"},{"text":"⏰ 1244. 力扣排行榜【中等】","link":"/TNotes.leetcode/1244. 力扣排行榜【中等】/README"},{"text":"⏰ 1245. 树的直径【中等】","link":"/TNotes.leetcode/1245. 树的直径【中等】/README"},{"text":"⏰ 1246. 删除回文子数组【困难】","link":"/TNotes.leetcode/1246. 删除回文子数组【困难】/README"},{"text":"⏰ 1247. 交换字符使得字符串相同【中等】","link":"/TNotes.leetcode/1247. 交换字符使得字符串相同【中等】/README"},{"text":"⏰ 1248. 统计「优美子数组」【中等】","link":"/TNotes.leetcode/1248. 统计「优美子数组」【中等】/README"},{"text":"⏰ 1249. 移除无效的括号【中等】","link":"/TNotes.leetcode/1249. 移除无效的括号【中等】/README"},{"text":"⏰ 1250. 检查「好数组」【困难】","link":"/TNotes.leetcode/1250. 检查「好数组」【困难】/README"},{"text":"⏰ 1251. 平均售价【简单】","link":"/TNotes.leetcode/1251. 平均售价【简单】/README"},{"text":"⏰ 1252. 奇数值单元格的数目【简单】","link":"/TNotes.leetcode/1252. 奇数值单元格的数目【简单】/README"},{"text":"⏰ 1253. 重构 2 行二进制矩阵【中等】","link":"/TNotes.leetcode/1253. 重构 2 行二进制矩阵【中等】/README"},{"text":"⏰ 1254. 统计封闭岛屿的数目【中等】","link":"/TNotes.leetcode/1254. 统计封闭岛屿的数目【中等】/README"},{"text":"⏰ 1255. 得分最高的单词集合【困难】","link":"/TNotes.leetcode/1255. 得分最高的单词集合【困难】/README"},{"text":"⏰ 1256. 加密数字【中等】","link":"/TNotes.leetcode/1256. 加密数字【中等】/README"},{"text":"⏰ 1257. 最小公共区域【中等】","link":"/TNotes.leetcode/1257. 最小公共区域【中等】/README"},{"text":"⏰ 1258. 近义词句子【中等】","link":"/TNotes.leetcode/1258. 近义词句子【中等】/README"},{"text":"⏰ 1259. 不相交的握手【困难】","link":"/TNotes.leetcode/1259. 不相交的握手【困难】/README"},{"text":"⏰ 1260. 二维网格迁移【简单】","link":"/TNotes.leetcode/1260. 二维网格迁移【简单】/README"},{"text":"⏰ 1261. 在受污染的二叉树中查找元素【中等】","link":"/TNotes.leetcode/1261. 在受污染的二叉树中查找元素【中等】/README"},{"text":"⏰ 1262. 可被三整除的最大和【中等】","link":"/TNotes.leetcode/1262. 可被三整除的最大和【中等】/README"},{"text":"⏰ 1263. 推箱子【困难】","link":"/TNotes.leetcode/1263. 推箱子【困难】/README"},{"text":"⏰ 1264. 页面推荐【中等】","link":"/TNotes.leetcode/1264. 页面推荐【中等】/README"},{"text":"⏰ 1265. 逆序打印不可变链表【中等】","link":"/TNotes.leetcode/1265. 逆序打印不可变链表【中等】/README"},{"text":"⏰ 1266. 访问所有点的最小时间【简单】","link":"/TNotes.leetcode/1266. 访问所有点的最小时间【简单】/README"},{"text":"⏰ 1267. 统计参与通信的服务器【中等】","link":"/TNotes.leetcode/1267. 统计参与通信的服务器【中等】/README"},{"text":"⏰ 1268. 搜索推荐系统【中等】","link":"/TNotes.leetcode/1268. 搜索推荐系统【中等】/README"},{"text":"⏰ 1269. 停在原地的方案数【困难】","link":"/TNotes.leetcode/1269. 停在原地的方案数【困难】/README"},{"text":"⏰ 1270. 向公司 CEO 汇报工作的所有人【中等】","link":"/TNotes.leetcode/1270. 向公司 CEO 汇报工作的所有人【中等】/README"},{"text":"⏰ 1271. 十六进制魔术数字【简单】","link":"/TNotes.leetcode/1271. 十六进制魔术数字【简单】/README"},{"text":"⏰ 1272. 删除区间【中等】","link":"/TNotes.leetcode/1272. 删除区间【中等】/README"},{"text":"⏰ 1273. 删除树节点【中等】","link":"/TNotes.leetcode/1273. 删除树节点【中等】/README"},{"text":"⏰ 1274. 矩形内船只的数目【困难】","link":"/TNotes.leetcode/1274. 矩形内船只的数目【困难】/README"},{"text":"⏰ 1275. 找出井字棋的获胜者【简单】","link":"/TNotes.leetcode/1275. 找出井字棋的获胜者【简单】/README"},{"text":"⏰ 1276. 不浪费原料的汉堡制作方案【中等】","link":"/TNotes.leetcode/1276. 不浪费原料的汉堡制作方案【中等】/README"},{"text":"⏰ 1277. 统计全为 1 的正方形子矩阵【中等】","link":"/TNotes.leetcode/1277. 统计全为 1 的正方形子矩阵【中等】/README"},{"text":"⏰ 1278. 分割回文串 III【困难】","link":"/TNotes.leetcode/1278. 分割回文串 III【困难】/README"},{"text":"⏰ 1279. 红绿灯路口【简单】","link":"/TNotes.leetcode/1279. 红绿灯路口【简单】/README"},{"text":"⏰ 1280. 学生们参加各科测试的次数【简单】","link":"/TNotes.leetcode/1280. 学生们参加各科测试的次数【简单】/README"},{"text":"⏰ 1281. 整数的各位积和之差【简单】","link":"/TNotes.leetcode/1281. 整数的各位积和之差【简单】/README"},{"text":"⏰ 1282. 用户分组【中等】","link":"/TNotes.leetcode/1282. 用户分组【中等】/README"},{"text":"⏰ 1283. 使结果不超过阈值的最小除数【中等】","link":"/TNotes.leetcode/1283. 使结果不超过阈值的最小除数【中等】/README"},{"text":"⏰ 1284. 转化为全零矩阵的最少反转次数【困难】","link":"/TNotes.leetcode/1284. 转化为全零矩阵的最少反转次数【困难】/README"},{"text":"⏰ 1285. 找到连续区间的开始和结束数字【中等】","link":"/TNotes.leetcode/1285. 找到连续区间的开始和结束数字【中等】/README"},{"text":"⏰ 1286. 字母组合迭代器【中等】","link":"/TNotes.leetcode/1286. 字母组合迭代器【中等】/README"},{"text":"⏰ 1287. 有序数组中出现次数超过百分之25的元素【简单】","link":"/TNotes.leetcode/1287. 有序数组中出现次数超过百分之25的元素【简单】/README"},{"text":"⏰ 1288. 删除被覆盖区间【中等】","link":"/TNotes.leetcode/1288. 删除被覆盖区间【中等】/README"},{"text":"⏰ 1289. 下降路径最小和 II【困难】","link":"/TNotes.leetcode/1289. 下降路径最小和 II【困难】/README"},{"text":"⏰ 1290. 二进制链表转整数【简单】","link":"/TNotes.leetcode/1290. 二进制链表转整数【简单】/README"},{"text":"⏰ 1291. 顺次数【中等】","link":"/TNotes.leetcode/1291. 顺次数【中等】/README"},{"text":"⏰ 1292. 元素和小于等于阈值的正方形的最大边长【中等】","link":"/TNotes.leetcode/1292. 元素和小于等于阈值的正方形的最大边长【中等】/README"},{"text":"⏰ 1293. 网格中的最短路径【困难】","link":"/TNotes.leetcode/1293. 网格中的最短路径【困难】/README"},{"text":"⏰ 1294. 不同国家的天气类型【简单】","link":"/TNotes.leetcode/1294. 不同国家的天气类型【简单】/README"},{"text":"⏰ 1295. 统计位数为偶数的数字【简单】","link":"/TNotes.leetcode/1295. 统计位数为偶数的数字【简单】/README"},{"text":"⏰ 1296. 划分数组为连续数字的集合【中等】","link":"/TNotes.leetcode/1296. 划分数组为连续数字的集合【中等】/README"},{"text":"⏰ 1297. 子串的最大出现次数【中等】","link":"/TNotes.leetcode/1297. 子串的最大出现次数【中等】/README"},{"text":"⏰ 1298. 你能从盒子里获得的最大糖果数【困难】","link":"/TNotes.leetcode/1298. 你能从盒子里获得的最大糖果数【困难】/README"},{"text":"⏰ 1299. 将每个元素替换为右侧最大元素【简单】","link":"/TNotes.leetcode/1299. 将每个元素替换为右侧最大元素【简单】/README"},{"text":"⏰ 1300. 转变数组后最接近目标值的数组和【中等】","link":"/TNotes.leetcode/1300. 转变数组后最接近目标值的数组和【中等】/README"},{"text":"⏰ 1301. 最大得分的路径数目【困难】","link":"/TNotes.leetcode/1301. 最大得分的路径数目【困难】/README"},{"text":"⏰ 1302. 层数最深叶子节点的和【中等】","link":"/TNotes.leetcode/1302. 层数最深叶子节点的和【中等】/README"},{"text":"⏰ 1303. 求团队人数【简单】","link":"/TNotes.leetcode/1303. 求团队人数【简单】/README"},{"text":"⏰ 1304. 和为零的 N 个不同整数【简单】","link":"/TNotes.leetcode/1304. 和为零的 N 个不同整数【简单】/README"},{"text":"⏰ 1305. 两棵二叉搜索树中的所有元素【中等】","link":"/TNotes.leetcode/1305. 两棵二叉搜索树中的所有元素【中等】/README"},{"text":"⏰ 1306. 跳跃游戏 III【中等】","link":"/TNotes.leetcode/1306. 跳跃游戏 III【中等】/README"},{"text":"⏰ 1307. 口算难题【困难】","link":"/TNotes.leetcode/1307. 口算难题【困难】/README"},{"text":"⏰ 1308. 不同性别每日分数总计【中等】","link":"/TNotes.leetcode/1308. 不同性别每日分数总计【中等】/README"},{"text":"⏰ 1309. 解码字母到整数映射【简单】","link":"/TNotes.leetcode/1309. 解码字母到整数映射【简单】/README"},{"text":"⏰ 1310. 子数组异或查询【中等】","link":"/TNotes.leetcode/1310. 子数组异或查询【中等】/README"},{"text":"⏰ 1311. 获取你好友已观看的视频【中等】","link":"/TNotes.leetcode/1311. 获取你好友已观看的视频【中等】/README"},{"text":"⏰ 1312. 让字符串成为回文串的最少插入次数【困难】","link":"/TNotes.leetcode/1312. 让字符串成为回文串的最少插入次数【困难】/README"},{"text":"⏰ 1313. 解压缩编码列表【简单】","link":"/TNotes.leetcode/1313. 解压缩编码列表【简单】/README"},{"text":"⏰ 1314. 矩阵区域和【中等】","link":"/TNotes.leetcode/1314. 矩阵区域和【中等】/README"},{"text":"⏰ 1315. 祖父节点值为偶数的节点和【中等】","link":"/TNotes.leetcode/1315. 祖父节点值为偶数的节点和【中等】/README"},{"text":"⏰ 1316. 不同的循环子字符串【困难】","link":"/TNotes.leetcode/1316. 不同的循环子字符串【困难】/README"},{"text":"⏰ 1317. 将整数转换为两个无零整数的和【简单】","link":"/TNotes.leetcode/1317. 将整数转换为两个无零整数的和【简单】/README"},{"text":"⏰ 1318. 或运算的最小翻转次数【中等】","link":"/TNotes.leetcode/1318. 或运算的最小翻转次数【中等】/README"},{"text":"⏰ 1319. 连通网络的操作次数【中等】","link":"/TNotes.leetcode/1319. 连通网络的操作次数【中等】/README"},{"text":"⏰ 1320. 二指输入的的最小距离【困难】","link":"/TNotes.leetcode/1320. 二指输入的的最小距离【困难】/README"},{"text":"⏰ 1321. 餐馆营业额变化增长【中等】","link":"/TNotes.leetcode/1321. 餐馆营业额变化增长【中等】/README"},{"text":"⏰ 1322. 广告效果【简单】","link":"/TNotes.leetcode/1322. 广告效果【简单】/README"},{"text":"⏰ 1323. 6 和 9 组成的最大数字【简单】","link":"/TNotes.leetcode/1323. 6 和 9 组成的最大数字【简单】/README"},{"text":"⏰ 1324. 竖直打印单词【中等】","link":"/TNotes.leetcode/1324. 竖直打印单词【中等】/README"},{"text":"⏰ 1325. 删除给定值的叶子节点【中等】","link":"/TNotes.leetcode/1325. 删除给定值的叶子节点【中等】/README"},{"text":"⏰ 1326. 灌溉花园的最少水龙头数目【困难】","link":"/TNotes.leetcode/1326. 灌溉花园的最少水龙头数目【困难】/README"},{"text":"⏰ 1327. 列出指定时间段内所有的下单产品【简单】","link":"/TNotes.leetcode/1327. 列出指定时间段内所有的下单产品【简单】/README"},{"text":"⏰ 1328. 破坏回文串【中等】","link":"/TNotes.leetcode/1328. 破坏回文串【中等】/README"},{"text":"⏰ 1329. 将矩阵按对角线排序【中等】","link":"/TNotes.leetcode/1329. 将矩阵按对角线排序【中等】/README"},{"text":"⏰ 1330. 翻转子数组得到最大的数组值【困难】","link":"/TNotes.leetcode/1330. 翻转子数组得到最大的数组值【困难】/README"},{"text":"⏰ 1331. 数组序号转换【简单】","link":"/TNotes.leetcode/1331. 数组序号转换【简单】/README"},{"text":"⏰ 1332. 删除回文子序列【简单】","link":"/TNotes.leetcode/1332. 删除回文子序列【简单】/README"},{"text":"⏰ 1333. 餐厅过滤器【中等】","link":"/TNotes.leetcode/1333. 餐厅过滤器【中等】/README"},{"text":"⏰ 1334. 阈值距离内邻居最少的城市【中等】","link":"/TNotes.leetcode/1334. 阈值距离内邻居最少的城市【中等】/README"},{"text":"⏰ 1335. 工作计划的最低难度【困难】","link":"/TNotes.leetcode/1335. 工作计划的最低难度【困难】/README"},{"text":"⏰ 1336. 每次访问的交易次数【困难】","link":"/TNotes.leetcode/1336. 每次访问的交易次数【困难】/README"},{"text":"⏰ 1337. 矩阵中战斗力最弱的 K 行【简单】","link":"/TNotes.leetcode/1337. 矩阵中战斗力最弱的 K 行【简单】/README"},{"text":"⏰ 1338. 数组大小减半【中等】","link":"/TNotes.leetcode/1338. 数组大小减半【中等】/README"},{"text":"⏰ 1339. 分裂二叉树的最大乘积【中等】","link":"/TNotes.leetcode/1339. 分裂二叉树的最大乘积【中等】/README"},{"text":"⏰ 1340. 跳跃游戏 V【困难】","link":"/TNotes.leetcode/1340. 跳跃游戏 V【困难】/README"},{"text":"⏰ 1341. 电影评分【中等】","link":"/TNotes.leetcode/1341. 电影评分【中等】/README"},{"text":"⏰ 1342. 将数字变成 0 的操作次数【简单】","link":"/TNotes.leetcode/1342. 将数字变成 0 的操作次数【简单】/README"},{"text":"⏰ 1343. 大小为 K 且平均值大于等于阈值的子数组数目【中等】","link":"/TNotes.leetcode/1343. 大小为 K 且平均值大于等于阈值的子数组数目【中等】/README"},{"text":"⏰ 1344. 时钟指针的夹角【中等】","link":"/TNotes.leetcode/1344. 时钟指针的夹角【中等】/README"},{"text":"⏰ 1345. 跳跃游戏 IV【困难】","link":"/TNotes.leetcode/1345. 跳跃游戏 IV【困难】/README"},{"text":"⏰ 1346. 检查整数及其两倍数是否存在【简单】","link":"/TNotes.leetcode/1346. 检查整数及其两倍数是否存在【简单】/README"},{"text":"⏰ 1347. 制造字母异位词的最小步骤数【中等】","link":"/TNotes.leetcode/1347. 制造字母异位词的最小步骤数【中等】/README"},{"text":"⏰ 1348. 推文计数【中等】","link":"/TNotes.leetcode/1348. 推文计数【中等】/README"},{"text":"⏰ 1349. 参加考试的最大学生数【困难】","link":"/TNotes.leetcode/1349. 参加考试的最大学生数【困难】/README"},{"text":"⏰ 1350. 院系无效的学生【简单】","link":"/TNotes.leetcode/1350. 院系无效的学生【简单】/README"},{"text":"⏰ 1351. 统计有序矩阵中的负数【简单】","link":"/TNotes.leetcode/1351. 统计有序矩阵中的负数【简单】/README"},{"text":"⏰ 1352. 最后 K 个数的乘积【中等】","link":"/TNotes.leetcode/1352. 最后 K 个数的乘积【中等】/README"},{"text":"⏰ 1353. 最多可以参加的会议数目【中等】","link":"/TNotes.leetcode/1353. 最多可以参加的会议数目【中等】/README"},{"text":"⏰ 1354. 多次求和构造目标数组【困难】","link":"/TNotes.leetcode/1354. 多次求和构造目标数组【困难】/README"},{"text":"⏰ 1355. 活动参与者【中等】","link":"/TNotes.leetcode/1355. 活动参与者【中等】/README"},{"text":"⏰ 1356. 根据数字二进制下 1 的数目排序【简单】","link":"/TNotes.leetcode/1356. 根据数字二进制下 1 的数目排序【简单】/README"},{"text":"⏰ 1357. 每隔 n 个顾客打折【中等】","link":"/TNotes.leetcode/1357. 每隔 n 个顾客打折【中等】/README"},{"text":"⏰ 1358. 包含所有三种字符的子字符串数目【中等】","link":"/TNotes.leetcode/1358. 包含所有三种字符的子字符串数目【中等】/README"},{"text":"⏰ 1359. 有效的快递序列数目【困难】","link":"/TNotes.leetcode/1359. 有效的快递序列数目【困难】/README"},{"text":"⏰ 1360. 日期之间隔几天【简单】","link":"/TNotes.leetcode/1360. 日期之间隔几天【简单】/README"},{"text":"⏰ 1361. 验证二叉树【中等】","link":"/TNotes.leetcode/1361. 验证二叉树【中等】/README"},{"text":"⏰ 1362. 最接近的因数【中等】","link":"/TNotes.leetcode/1362. 最接近的因数【中等】/README"},{"text":"⏰ 1363. 形成三的最大倍数【困难】","link":"/TNotes.leetcode/1363. 形成三的最大倍数【困难】/README"},{"text":"⏰ 1364. 顾客的可信联系人数量【中等】","link":"/TNotes.leetcode/1364. 顾客的可信联系人数量【中等】/README"},{"text":"⏰ 1365. 有多少小于当前数字的数字【简单】","link":"/TNotes.leetcode/1365. 有多少小于当前数字的数字【简单】/README"},{"text":"⏰ 1366. 通过投票对团队排名【中等】","link":"/TNotes.leetcode/1366. 通过投票对团队排名【中等】/README"},{"text":"⏰ 1367. 二叉树中的链表【中等】","link":"/TNotes.leetcode/1367. 二叉树中的链表【中等】/README"},{"text":"⏰ 1368. 使网格图至少有一条有效路径的最小代价【困难】","link":"/TNotes.leetcode/1368. 使网格图至少有一条有效路径的最小代价【困难】/README"},{"text":"⏰ 1369. 获取最近第二次的活动【困难】","link":"/TNotes.leetcode/1369. 获取最近第二次的活动【困难】/README"},{"text":"⏰ 1370. 上升下降字符串【简单】","link":"/TNotes.leetcode/1370. 上升下降字符串【简单】/README"},{"text":"⏰ 1371. 每个元音包含偶数次的最长子字符串【中等】","link":"/TNotes.leetcode/1371. 每个元音包含偶数次的最长子字符串【中等】/README"},{"text":"⏰ 1372. 二叉树中的最长交错路径【中等】","link":"/TNotes.leetcode/1372. 二叉树中的最长交错路径【中等】/README"},{"text":"⏰ 1373. 二叉搜索子树的最大键值和【困难】","link":"/TNotes.leetcode/1373. 二叉搜索子树的最大键值和【困难】/README"},{"text":"⏰ 1374. 生成每种字符都是奇数个的字符串【简单】","link":"/TNotes.leetcode/1374. 生成每种字符都是奇数个的字符串【简单】/README"},{"text":"⏰ 1375. 二进制字符串前缀一致的次数【中等】","link":"/TNotes.leetcode/1375. 二进制字符串前缀一致的次数【中等】/README"},{"text":"⏰ 1376. 通知所有员工所需的时间【中等】","link":"/TNotes.leetcode/1376. 通知所有员工所需的时间【中等】/README"},{"text":"⏰ 1377. T 秒后青蛙的位置【困难】","link":"/TNotes.leetcode/1377. T 秒后青蛙的位置【困难】/README"},{"text":"⏰ 1378. 使用唯一标识码替换员工ID【简单】","link":"/TNotes.leetcode/1378. 使用唯一标识码替换员工ID【简单】/README"},{"text":"⏰ 1379. 找出克隆二叉树中的相同节点【简单】","link":"/TNotes.leetcode/1379. 找出克隆二叉树中的相同节点【简单】/README"},{"text":"⏰ 1380. 矩阵中的幸运数【简单】","link":"/TNotes.leetcode/1380. 矩阵中的幸运数【简单】/README"},{"text":"⏰ 1381. 设计一个支持增量操作的栈【中等】","link":"/TNotes.leetcode/1381. 设计一个支持增量操作的栈【中等】/README"},{"text":"⏰ 1382. 将二叉搜索树变平衡【中等】","link":"/TNotes.leetcode/1382. 将二叉搜索树变平衡【中等】/README"},{"text":"⏰ 1383. 最大的团队表现值【困难】","link":"/TNotes.leetcode/1383. 最大的团队表现值【困难】/README"},{"text":"⏰ 1384. 按年度列出销售总额【困难】","link":"/TNotes.leetcode/1384. 按年度列出销售总额【困难】/README"},{"text":"⏰ 1385. 两个数组间的距离值【简单】","link":"/TNotes.leetcode/1385. 两个数组间的距离值【简单】/README"},{"text":"⏰ 1386. 安排电影院座位【中等】","link":"/TNotes.leetcode/1386. 安排电影院座位【中等】/README"},{"text":"⏰ 1387. 将整数按权重排序【中等】","link":"/TNotes.leetcode/1387. 将整数按权重排序【中等】/README"},{"text":"⏰ 1388. 3n 块披萨【困难】","link":"/TNotes.leetcode/1388. 3n 块披萨【困难】/README"},{"text":"⏰ 1389. 按既定顺序创建目标数组【简单】","link":"/TNotes.leetcode/1389. 按既定顺序创建目标数组【简单】/README"},{"text":"⏰ 1390. 四因数【中等】","link":"/TNotes.leetcode/1390. 四因数【中等】/README"},{"text":"⏰ 1391. 检查网格中是否存在有效路径【中等】","link":"/TNotes.leetcode/1391. 检查网格中是否存在有效路径【中等】/README"},{"text":"⏰ 1392. 最长快乐前缀【困难】","link":"/TNotes.leetcode/1392. 最长快乐前缀【困难】/README"},{"text":"⏰ 1393. 股票的资本损益【中等】","link":"/TNotes.leetcode/1393. 股票的资本损益【中等】/README"},{"text":"⏰ 1394. 找出数组中的幸运数【简单】","link":"/TNotes.leetcode/1394. 找出数组中的幸运数【简单】/README"},{"text":"⏰ 1395. 统计作战单位数【中等】","link":"/TNotes.leetcode/1395. 统计作战单位数【中等】/README"},{"text":"⏰ 1396. 设计地铁系统【中等】","link":"/TNotes.leetcode/1396. 设计地铁系统【中等】/README"},{"text":"⏰ 1397. 找到所有好字符串【困难】","link":"/TNotes.leetcode/1397. 找到所有好字符串【困难】/README"},{"text":"⏰ 1398. 购买了产品 A 和产品 B 却没有购买产品 C 的顾客【中等】","link":"/TNotes.leetcode/1398. 购买了产品 A 和产品 B 却没有购买产品 C 的顾客【中等】/README"},{"text":"⏰ 1399. 统计最大组的数目【简单】","link":"/TNotes.leetcode/1399. 统计最大组的数目【简单】/README"},{"text":"⏰ 1400. 构造 K 个回文字符串【中等】","link":"/TNotes.leetcode/1400. 构造 K 个回文字符串【中等】/README"},{"text":"⏰ 1401. 圆和矩形是否有重叠【中等】","link":"/TNotes.leetcode/1401. 圆和矩形是否有重叠【中等】/README"},{"text":"⏰ 1402. 做菜顺序【困难】","link":"/TNotes.leetcode/1402. 做菜顺序【困难】/README"},{"text":"⏰ 1403. 非递增顺序的最小子序列【简单】","link":"/TNotes.leetcode/1403. 非递增顺序的最小子序列【简单】/README"},{"text":"⏰ 1404. 将二进制表示减到 1 的步骤数【中等】","link":"/TNotes.leetcode/1404. 将二进制表示减到 1 的步骤数【中等】/README"},{"text":"⏰ 1405. 最长快乐字符串【中等】","link":"/TNotes.leetcode/1405. 最长快乐字符串【中等】/README"},{"text":"⏰ 1406. 石子游戏 III【困难】","link":"/TNotes.leetcode/1406. 石子游戏 III【困难】/README"},{"text":"⏰ 1407. 排名靠前的旅行者【简单】","link":"/TNotes.leetcode/1407. 排名靠前的旅行者【简单】/README"},{"text":"⏰ 1408. 数组中的字符串匹配【简单】","link":"/TNotes.leetcode/1408. 数组中的字符串匹配【简单】/README"},{"text":"⏰ 1409. 查询带键的排列【中等】","link":"/TNotes.leetcode/1409. 查询带键的排列【中等】/README"},{"text":"⏰ 1410. HTML 实体解析器【中等】","link":"/TNotes.leetcode/1410. HTML 实体解析器【中等】/README"},{"text":"⏰ 1411. 给 N x 3 网格图涂色的方案数【困难】","link":"/TNotes.leetcode/1411. 给 N x 3 网格图涂色的方案数【困难】/README"},{"text":"⏰ 1412. 查找成绩处于中游的学生【困难】","link":"/TNotes.leetcode/1412. 查找成绩处于中游的学生【困难】/README"},{"text":"⏰ 1413. 逐步求和得到正数的最小值【简单】","link":"/TNotes.leetcode/1413. 逐步求和得到正数的最小值【简单】/README"},{"text":"⏰ 1414. 和为 K 的最少斐波那契数字数目【中等】","link":"/TNotes.leetcode/1414. 和为 K 的最少斐波那契数字数目【中等】/README"},{"text":"⏰ 1415. 长度为 n 的开心字符串中字典序第 k 小的字符串【中等】","link":"/TNotes.leetcode/1415. 长度为 n 的开心字符串中字典序第 k 小的字符串【中等】/README"},{"text":"⏰ 1416. 恢复数组【困难】","link":"/TNotes.leetcode/1416. 恢复数组【困难】/README"},{"text":"⏰ 1417. 重新格式化字符串【简单】","link":"/TNotes.leetcode/1417. 重新格式化字符串【简单】/README"},{"text":"⏰ 1418. 点菜展示表【中等】","link":"/TNotes.leetcode/1418. 点菜展示表【中等】/README"},{"text":"⏰ 1419. 数青蛙【中等】","link":"/TNotes.leetcode/1419. 数青蛙【中等】/README"},{"text":"⏰ 1420. 生成数组【困难】","link":"/TNotes.leetcode/1420. 生成数组【困难】/README"},{"text":"⏰ 1421. 净现值查询【简单】","link":"/TNotes.leetcode/1421. 净现值查询【简单】/README"},{"text":"⏰ 1422. 分割字符串的最大得分【简单】","link":"/TNotes.leetcode/1422. 分割字符串的最大得分【简单】/README"},{"text":"⏰ 1423. 可获得的最大点数【中等】","link":"/TNotes.leetcode/1423. 可获得的最大点数【中等】/README"},{"text":"⏰ 1424. 对角线遍历 II【中等】","link":"/TNotes.leetcode/1424. 对角线遍历 II【中等】/README"},{"text":"⏰ 1425. 带限制的子序列和【困难】","link":"/TNotes.leetcode/1425. 带限制的子序列和【困难】/README"},{"text":"⏰ 1426. 数元素【简单】","link":"/TNotes.leetcode/1426. 数元素【简单】/README"},{"text":"⏰ 1427. 字符串的左右移【简单】","link":"/TNotes.leetcode/1427. 字符串的左右移【简单】/README"},{"text":"⏰ 1428. 至少有一个 1 的最左端列【中等】","link":"/TNotes.leetcode/1428. 至少有一个 1 的最左端列【中等】/README"},{"text":"⏰ 1429. 第一个唯一数字【中等】","link":"/TNotes.leetcode/1429. 第一个唯一数字【中等】/README"},{"text":"⏰ 1430. 判断给定的序列是否是二叉树从根到叶的路径【中等】","link":"/TNotes.leetcode/1430. 判断给定的序列是否是二叉树从根到叶的路径【中等】/README"},{"text":"⏰ 1431. 拥有最多糖果的孩子【简单】","link":"/TNotes.leetcode/1431. 拥有最多糖果的孩子【简单】/README"},{"text":"⏰ 1432. 改变一个整数能得到的最大差值【中等】","link":"/TNotes.leetcode/1432. 改变一个整数能得到的最大差值【中等】/README"},{"text":"⏰ 1433. 检查一个字符串是否可以打破另一个字符串【中等】","link":"/TNotes.leetcode/1433. 检查一个字符串是否可以打破另一个字符串【中等】/README"},{"text":"⏰ 1434. 每个人戴不同帽子的方案数【困难】","link":"/TNotes.leetcode/1434. 每个人戴不同帽子的方案数【困难】/README"},{"text":"⏰ 1435. 制作会话柱状图【简单】","link":"/TNotes.leetcode/1435. 制作会话柱状图【简单】/README"},{"text":"⏰ 1436. 旅行终点站【简单】","link":"/TNotes.leetcode/1436. 旅行终点站【简单】/README"},{"text":"⏰ 1437. 是否所有 1 都至少相隔 k 个元素【简单】","link":"/TNotes.leetcode/1437. 是否所有 1 都至少相隔 k 个元素【简单】/README"},{"text":"⏰ 1438. 绝对差不超过限制的最长连续子数组【中等】","link":"/TNotes.leetcode/1438. 绝对差不超过限制的最长连续子数组【中等】/README"},{"text":"⏰ 1439. 有序矩阵中的第 k 个最小数组和【困难】","link":"/TNotes.leetcode/1439. 有序矩阵中的第 k 个最小数组和【困难】/README"},{"text":"⏰ 1440. 计算布尔表达式的值【中等】","link":"/TNotes.leetcode/1440. 计算布尔表达式的值【中等】/README"},{"text":"⏰ 1441. 用栈操作构建数组【中等】","link":"/TNotes.leetcode/1441. 用栈操作构建数组【中等】/README"},{"text":"⏰ 1442. 形成两个异或相等数组的三元组数目【中等】","link":"/TNotes.leetcode/1442. 形成两个异或相等数组的三元组数目【中等】/README"},{"text":"⏰ 1443. 收集树上所有苹果的最少时间【中等】","link":"/TNotes.leetcode/1443. 收集树上所有苹果的最少时间【中等】/README"},{"text":"⏰ 1444. 切披萨的方案数【困难】","link":"/TNotes.leetcode/1444. 切披萨的方案数【困难】/README"},{"text":"⏰ 1445. 苹果和桔子【中等】","link":"/TNotes.leetcode/1445. 苹果和桔子【中等】/README"},{"text":"⏰ 1446. 连续字符【简单】","link":"/TNotes.leetcode/1446. 连续字符【简单】/README"},{"text":"⏰ 1447. 最简分数【中等】","link":"/TNotes.leetcode/1447. 最简分数【中等】/README"},{"text":"⏰ 1448. 统计二叉树中好节点的数目【中等】","link":"/TNotes.leetcode/1448. 统计二叉树中好节点的数目【中等】/README"},{"text":"⏰ 1449. 数位成本和为目标值的最大数字【困难】","link":"/TNotes.leetcode/1449. 数位成本和为目标值的最大数字【困难】/README"},{"text":"⏰ 1450. 在既定时间做作业的学生人数【简单】","link":"/TNotes.leetcode/1450. 在既定时间做作业的学生人数【简单】/README"},{"text":"⏰ 1451. 重新排列句子中的单词【中等】","link":"/TNotes.leetcode/1451. 重新排列句子中的单词【中等】/README"},{"text":"⏰ 1452. 收藏清单【中等】","link":"/TNotes.leetcode/1452. 收藏清单【中等】/README"},{"text":"⏰ 1453. 圆形靶内的最大飞镖数量【困难】","link":"/TNotes.leetcode/1453. 圆形靶内的最大飞镖数量【困难】/README"},{"text":"⏰ 1454. 活跃用户【中等】","link":"/TNotes.leetcode/1454. 活跃用户【中等】/README"},{"text":"⏰ 1455. 检查单词是否为句中其他单词的前缀【简单】","link":"/TNotes.leetcode/1455. 检查单词是否为句中其他单词的前缀【简单】/README"},{"text":"⏰ 1456. 定长子串中元音的最大数目【中等】","link":"/TNotes.leetcode/1456. 定长子串中元音的最大数目【中等】/README"},{"text":"⏰ 1457. 二叉树中的伪回文路径【中等】","link":"/TNotes.leetcode/1457. 二叉树中的伪回文路径【中等】/README"},{"text":"⏰ 1458. 两个子序列的最大点积【困难】","link":"/TNotes.leetcode/1458. 两个子序列的最大点积【困难】/README"},{"text":"⏰ 1459. 矩形面积【中等】","link":"/TNotes.leetcode/1459. 矩形面积【中等】/README"},{"text":"⏰ 1460. 通过翻转子数组使两个数组相等【简单】","link":"/TNotes.leetcode/1460. 通过翻转子数组使两个数组相等【简单】/README"},{"text":"⏰ 1461. 检查一个字符串是否包含所有长度为 K 的二进制子串【中等】","link":"/TNotes.leetcode/1461. 检查一个字符串是否包含所有长度为 K 的二进制子串【中等】/README"},{"text":"⏰ 1462. 课程表 IV【中等】","link":"/TNotes.leetcode/1462. 课程表 IV【中等】/README"},{"text":"⏰ 1463. 摘樱桃 II【困难】","link":"/TNotes.leetcode/1463. 摘樱桃 II【困难】/README"},{"text":"⏰ 1464. 数组中两元素的最大乘积【简单】","link":"/TNotes.leetcode/1464. 数组中两元素的最大乘积【简单】/README"},{"text":"⏰ 1465. 切割后面积最大的蛋糕【中等】","link":"/TNotes.leetcode/1465. 切割后面积最大的蛋糕【中等】/README"},{"text":"⏰ 1466. 重新规划路线【中等】","link":"/TNotes.leetcode/1466. 重新规划路线【中等】/README"},{"text":"⏰ 1467. 两个盒子中球的颜色数相同的概率【困难】","link":"/TNotes.leetcode/1467. 两个盒子中球的颜色数相同的概率【困难】/README"},{"text":"⏰ 1468. 计算税后工资【中等】","link":"/TNotes.leetcode/1468. 计算税后工资【中等】/README"},{"text":"⏰ 1469. 寻找所有的独生节点【简单】","link":"/TNotes.leetcode/1469. 寻找所有的独生节点【简单】/README"},{"text":"⏰ 1470. 重新排列数组【简单】","link":"/TNotes.leetcode/1470. 重新排列数组【简单】/README"},{"text":"⏰ 1471. 数组中的 k 个最强值【中等】","link":"/TNotes.leetcode/1471. 数组中的 k 个最强值【中等】/README"},{"text":"⏰ 1472. 设计浏览器历史记录【中等】","link":"/TNotes.leetcode/1472. 设计浏览器历史记录【中等】/README"},{"text":"⏰ 1473. 粉刷房子 III【困难】","link":"/TNotes.leetcode/1473. 粉刷房子 III【困难】/README"},{"text":"⏰ 1474. 删除链表 M 个节点之后的 N 个节点【简单】","link":"/TNotes.leetcode/1474. 删除链表 M 个节点之后的 N 个节点【简单】/README"},{"text":"⏰ 1475. 商品折扣后的最终价格【简单】","link":"/TNotes.leetcode/1475. 商品折扣后的最终价格【简单】/README"},{"text":"⏰ 1476. 子矩形查询【中等】","link":"/TNotes.leetcode/1476. 子矩形查询【中等】/README"},{"text":"⏰ 1477. 找两个和为目标值且不重叠的子数组【中等】","link":"/TNotes.leetcode/1477. 找两个和为目标值且不重叠的子数组【中等】/README"},{"text":"⏰ 1478. 安排邮筒【困难】","link":"/TNotes.leetcode/1478. 安排邮筒【困难】/README"},{"text":"⏰ 1479. 周内每天的销售情况【困难】","link":"/TNotes.leetcode/1479. 周内每天的销售情况【困难】/README"},{"text":"⏰ 1480. 一维数组的动态和【简单】","link":"/TNotes.leetcode/1480. 一维数组的动态和【简单】/README"},{"text":"⏰ 1481. 不同整数的最少数目【中等】","link":"/TNotes.leetcode/1481. 不同整数的最少数目【中等】/README"},{"text":"⏰ 1482. 制作 m 束花所需的最少天数【中等】","link":"/TNotes.leetcode/1482. 制作 m 束花所需的最少天数【中等】/README"},{"text":"⏰ 1483. 树节点的第 K 个祖先【困难】","link":"/TNotes.leetcode/1483. 树节点的第 K 个祖先【困难】/README"},{"text":"⏰ 1484. 按日期分组销售产品【简单】","link":"/TNotes.leetcode/1484. 按日期分组销售产品【简单】/README"},{"text":"⏰ 1485. 克隆含随机指针的二叉树【中等】","link":"/TNotes.leetcode/1485. 克隆含随机指针的二叉树【中等】/README"},{"text":"⏰ 1486. 数组异或操作【简单】","link":"/TNotes.leetcode/1486. 数组异或操作【简单】/README"},{"text":"⏰ 1487. 保证文件名唯一【中等】","link":"/TNotes.leetcode/1487. 保证文件名唯一【中等】/README"},{"text":"⏰ 1488. 避免洪水泛滥【中等】","link":"/TNotes.leetcode/1488. 避免洪水泛滥【中等】/README"},{"text":"⏰ 1489. 找到最小生成树里的关键边和伪关键边【困难】","link":"/TNotes.leetcode/1489. 找到最小生成树里的关键边和伪关键边【困难】/README"},{"text":"⏰ 1490. 克隆 N 叉树【中等】","link":"/TNotes.leetcode/1490. 克隆 N 叉树【中等】/README"},{"text":"⏰ 1491. 去掉最低工资和最高工资后的工资平均值【简单】","link":"/TNotes.leetcode/1491. 去掉最低工资和最高工资后的工资平均值【简单】/README"},{"text":"⏰ 1492. n 的第 k 个因子【中等】","link":"/TNotes.leetcode/1492. n 的第 k 个因子【中等】/README"},{"text":"⏰ 1493. 删掉一个元素以后全为 1 的最长子数组【中等】","link":"/TNotes.leetcode/1493. 删掉一个元素以后全为 1 的最长子数组【中等】/README"},{"text":"⏰ 1494. 并行课程 II【困难】","link":"/TNotes.leetcode/1494. 并行课程 II【困难】/README"},{"text":"⏰ 1495. 上月播放的儿童适宜电影【简单】","link":"/TNotes.leetcode/1495. 上月播放的儿童适宜电影【简单】/README"},{"text":"⏰ 1496. 判断路径是否相交【简单】","link":"/TNotes.leetcode/1496. 判断路径是否相交【简单】/README"},{"text":"⏰ 1497. 检查数组对是否可以被 k 整除【中等】","link":"/TNotes.leetcode/1497. 检查数组对是否可以被 k 整除【中等】/README"},{"text":"⏰ 1498. 满足条件的子序列数目【中等】","link":"/TNotes.leetcode/1498. 满足条件的子序列数目【中等】/README"},{"text":"⏰ 1499. 满足不等式的最大值【困难】","link":"/TNotes.leetcode/1499. 满足不等式的最大值【困难】/README"},{"text":"⏰ 1500. 设计文件分享系统【中等】","link":"/TNotes.leetcode/1500. 设计文件分享系统【中等】/README"},{"text":"⏰ 1501. 可以放心投资的国家【中等】","link":"/TNotes.leetcode/1501. 可以放心投资的国家【中等】/README"},{"text":"⏰ 1502. 判断能否形成等差数列【简单】","link":"/TNotes.leetcode/1502. 判断能否形成等差数列【简单】/README"},{"text":"⏰ 1503. 所有蚂蚁掉下来前的最后一刻【中等】","link":"/TNotes.leetcode/1503. 所有蚂蚁掉下来前的最后一刻【中等】/README"},{"text":"⏰ 1504. 统计全 1 子矩形【中等】","link":"/TNotes.leetcode/1504. 统计全 1 子矩形【中等】/README"},{"text":"⏰ 1505. 最多 K 次交换相邻数位后得到的最小整数【困难】","link":"/TNotes.leetcode/1505. 最多 K 次交换相邻数位后得到的最小整数【困难】/README"},{"text":"⏰ 1506. 找到 N 叉树的根节点【中等】","link":"/TNotes.leetcode/1506. 找到 N 叉树的根节点【中等】/README"},{"text":"⏰ 1507. 转变日期格式【简单】","link":"/TNotes.leetcode/1507. 转变日期格式【简单】/README"},{"text":"⏰ 1508. 子数组和排序后的区间和【中等】","link":"/TNotes.leetcode/1508. 子数组和排序后的区间和【中等】/README"},{"text":"⏰ 1509. 三次操作后最大值与最小值的最小差【中等】","link":"/TNotes.leetcode/1509. 三次操作后最大值与最小值的最小差【中等】/README"},{"text":"⏰ 1510. 石子游戏 IV【困难】","link":"/TNotes.leetcode/1510. 石子游戏 IV【困难】/README"},{"text":"⏰ 1511. 消费者下单频率【简单】","link":"/TNotes.leetcode/1511. 消费者下单频率【简单】/README"},{"text":"⏰ 1512. 好数对的数目【简单】","link":"/TNotes.leetcode/1512. 好数对的数目【简单】/README"},{"text":"⏰ 1513. 仅含 1 的子串数【中等】","link":"/TNotes.leetcode/1513. 仅含 1 的子串数【中等】/README"},{"text":"⏰ 1514. 概率最大的路径【中等】","link":"/TNotes.leetcode/1514. 概率最大的路径【中等】/README"},{"text":"⏰ 1515. 服务中心的最佳位置【困难】","link":"/TNotes.leetcode/1515. 服务中心的最佳位置【困难】/README"},{"text":"⏰ 1516. 移动 N 叉树的子树【困难】","link":"/TNotes.leetcode/1516. 移动 N 叉树的子树【困难】/README"},{"text":"⏰ 1517. 查找拥有有效邮箱的用户【简单】","link":"/TNotes.leetcode/1517. 查找拥有有效邮箱的用户【简单】/README"},{"text":"⏰ 1518. 换水问题【简单】","link":"/TNotes.leetcode/1518. 换水问题【简单】/README"},{"text":"⏰ 1519. 子树中标签相同的节点数【中等】","link":"/TNotes.leetcode/1519. 子树中标签相同的节点数【中等】/README"},{"text":"⏰ 1520. 最多的不重叠子字符串【困难】","link":"/TNotes.leetcode/1520. 最多的不重叠子字符串【困难】/README"},{"text":"⏰ 1521. 找到最接近目标值的函数值【困难】","link":"/TNotes.leetcode/1521. 找到最接近目标值的函数值【困难】/README"},{"text":"⏰ 1522. N 叉树的直径【中等】","link":"/TNotes.leetcode/1522. N 叉树的直径【中等】/README"},{"text":"⏰ 1523. 在区间范围内统计奇数数目【简单】","link":"/TNotes.leetcode/1523. 在区间范围内统计奇数数目【简单】/README"},{"text":"⏰ 1524. 和为奇数的子数组数目【中等】","link":"/TNotes.leetcode/1524. 和为奇数的子数组数目【中等】/README"},{"text":"⏰ 1525. 字符串的好分割数目【中等】","link":"/TNotes.leetcode/1525. 字符串的好分割数目【中等】/README"},{"text":"⏰ 1526. 形成目标数组的子数组最少增加次数【困难】","link":"/TNotes.leetcode/1526. 形成目标数组的子数组最少增加次数【困难】/README"},{"text":"⏰ 1527. 患某种疾病的患者【简单】","link":"/TNotes.leetcode/1527. 患某种疾病的患者【简单】/README"},{"text":"⏰ 1528. 重新排列字符串【简单】","link":"/TNotes.leetcode/1528. 重新排列字符串【简单】/README"},{"text":"⏰ 1529. 最少的后缀翻转次数【中等】","link":"/TNotes.leetcode/1529. 最少的后缀翻转次数【中等】/README"},{"text":"⏰ 1530. 好叶子节点对的数量【中等】","link":"/TNotes.leetcode/1530. 好叶子节点对的数量【中等】/README"},{"text":"⏰ 1531. 压缩字符串 II【困难】","link":"/TNotes.leetcode/1531. 压缩字符串 II【困难】/README"},{"text":"⏰ 1532. 最近的三笔订单【中等】","link":"/TNotes.leetcode/1532. 最近的三笔订单【中等】/README"},{"text":"⏰ 1533. 找到最大整数的索引【中等】","link":"/TNotes.leetcode/1533. 找到最大整数的索引【中等】/README"},{"text":"⏰ 1534. 统计好三元组【简单】","link":"/TNotes.leetcode/1534. 统计好三元组【简单】/README"},{"text":"⏰ 1535. 找出数组游戏的赢家【中等】","link":"/TNotes.leetcode/1535. 找出数组游戏的赢家【中等】/README"},{"text":"⏰ 1536. 排布二进制网格的最少交换次数【中等】","link":"/TNotes.leetcode/1536. 排布二进制网格的最少交换次数【中等】/README"},{"text":"⏰ 1537. 最大得分【困难】","link":"/TNotes.leetcode/1537. 最大得分【困难】/README"},{"text":"⏰ 1538. 找出隐藏数组中出现次数最多的元素【中等】","link":"/TNotes.leetcode/1538. 找出隐藏数组中出现次数最多的元素【中等】/README"},{"text":"⏰ 1539. 第 k 个缺失的正整数【简单】","link":"/TNotes.leetcode/1539. 第 k 个缺失的正整数【简单】/README"},{"text":"⏰ 1540. K 次操作转变字符串【中等】","link":"/TNotes.leetcode/1540. K 次操作转变字符串【中等】/README"},{"text":"⏰ 1541. 平衡括号字符串的最少插入次数【中等】","link":"/TNotes.leetcode/1541. 平衡括号字符串的最少插入次数【中等】/README"},{"text":"⏰ 1542. 找出最长的超赞子字符串【困难】","link":"/TNotes.leetcode/1542. 找出最长的超赞子字符串【困难】/README"},{"text":"⏰ 1543. 产品名称格式修复【简单】","link":"/TNotes.leetcode/1543. 产品名称格式修复【简单】/README"},{"text":"⏰ 1544. 整理字符串【简单】","link":"/TNotes.leetcode/1544. 整理字符串【简单】/README"},{"text":"⏰ 1545. 找出第 N 个二进制字符串中的第 K 位【中等】","link":"/TNotes.leetcode/1545. 找出第 N 个二进制字符串中的第 K 位【中等】/README"},{"text":"⏰ 1546. 和为目标值且不重叠的非空子数组的最大数目【中等】","link":"/TNotes.leetcode/1546. 和为目标值且不重叠的非空子数组的最大数目【中等】/README"},{"text":"⏰ 1547. 切棍子的最小成本【困难】","link":"/TNotes.leetcode/1547. 切棍子的最小成本【困难】/README"},{"text":"⏰ 1548. 图中最相似的路径【困难】","link":"/TNotes.leetcode/1548. 图中最相似的路径【困难】/README"},{"text":"⏰ 1549. 每件商品的最新订单【中等】","link":"/TNotes.leetcode/1549. 每件商品的最新订单【中等】/README"},{"text":"⏰ 1550. 存在连续三个奇数的数组【简单】","link":"/TNotes.leetcode/1550. 存在连续三个奇数的数组【简单】/README"},{"text":"⏰ 1551. 使数组中所有元素相等的最小操作数【中等】","link":"/TNotes.leetcode/1551. 使数组中所有元素相等的最小操作数【中等】/README"},{"text":"⏰ 1552. 两球之间的磁力【中等】","link":"/TNotes.leetcode/1552. 两球之间的磁力【中等】/README"},{"text":"⏰ 1553. 吃掉 N 个橘子的最少天数【困难】","link":"/TNotes.leetcode/1553. 吃掉 N 个橘子的最少天数【困难】/README"},{"text":"⏰ 1554. 只有一个不同字符的字符串【中等】","link":"/TNotes.leetcode/1554. 只有一个不同字符的字符串【中等】/README"},{"text":"⏰ 1555. 银行账户概要【中等】","link":"/TNotes.leetcode/1555. 银行账户概要【中等】/README"},{"text":"⏰ 1556. 千位分隔数【简单】","link":"/TNotes.leetcode/1556. 千位分隔数【简单】/README"},{"text":"⏰ 1557. 可以到达所有点的最少点数目【中等】","link":"/TNotes.leetcode/1557. 可以到达所有点的最少点数目【中等】/README"},{"text":"⏰ 1558. 得到目标数组的最少函数调用次数【中等】","link":"/TNotes.leetcode/1558. 得到目标数组的最少函数调用次数【中等】/README"},{"text":"⏰ 1559. 二维网格图中探测环【中等】","link":"/TNotes.leetcode/1559. 二维网格图中探测环【中等】/README"},{"text":"⏰ 1560. 圆形赛道上经过次数最多的扇区【简单】","link":"/TNotes.leetcode/1560. 圆形赛道上经过次数最多的扇区【简单】/README"},{"text":"⏰ 1561. 你可以获得的最大硬币数目【中等】","link":"/TNotes.leetcode/1561. 你可以获得的最大硬币数目【中等】/README"},{"text":"⏰ 1562. 查找大小为 M 的最新分组【中等】","link":"/TNotes.leetcode/1562. 查找大小为 M 的最新分组【中等】/README"},{"text":"⏰ 1563. 石子游戏 V【困难】","link":"/TNotes.leetcode/1563. 石子游戏 V【困难】/README"},{"text":"⏰ 1564. 把箱子放进仓库里 I【中等】","link":"/TNotes.leetcode/1564. 把箱子放进仓库里 I【中等】/README"},{"text":"⏰ 1565. 按月统计订单数与顾客数【简单】","link":"/TNotes.leetcode/1565. 按月统计订单数与顾客数【简单】/README"},{"text":"⏰ 1566. 重复至少 K 次且长度为 M 的模式【简单】","link":"/TNotes.leetcode/1566. 重复至少 K 次且长度为 M 的模式【简单】/README"},{"text":"⏰ 1567. 乘积为正数的最长子数组长度【中等】","link":"/TNotes.leetcode/1567. 乘积为正数的最长子数组长度【中等】/README"},{"text":"⏰ 1568. 使陆地分离的最少天数【困难】","link":"/TNotes.leetcode/1568. 使陆地分离的最少天数【困难】/README"},{"text":"⏰ 1569. 将子数组重新排序得到同一个二叉搜索树的方案数【困难】","link":"/TNotes.leetcode/1569. 将子数组重新排序得到同一个二叉搜索树的方案数【困难】/README"},{"text":"⏰ 1570. 两个稀疏向量的点积【中等】","link":"/TNotes.leetcode/1570. 两个稀疏向量的点积【中等】/README"},{"text":"⏰ 1571. 仓库经理【简单】","link":"/TNotes.leetcode/1571. 仓库经理【简单】/README"},{"text":"⏰ 1572. 矩阵对角线元素的和【简单】","link":"/TNotes.leetcode/1572. 矩阵对角线元素的和【简单】/README"},{"text":"⏰ 1573. 分割字符串的方案数【中等】","link":"/TNotes.leetcode/1573. 分割字符串的方案数【中等】/README"},{"text":"⏰ 1574. 删除最短的子数组使剩余数组有序【中等】","link":"/TNotes.leetcode/1574. 删除最短的子数组使剩余数组有序【中等】/README"},{"text":"⏰ 1575. 统计所有可行路径【困难】","link":"/TNotes.leetcode/1575. 统计所有可行路径【困难】/README"},{"text":"⏰ 1576. 替换所有的问号【简单】","link":"/TNotes.leetcode/1576. 替换所有的问号【简单】/README"},{"text":"⏰ 1577. 数的平方等于两数乘积的方法数【中等】","link":"/TNotes.leetcode/1577. 数的平方等于两数乘积的方法数【中等】/README"},{"text":"⏰ 1578. 使绳子变成彩色的最短时间【中等】","link":"/TNotes.leetcode/1578. 使绳子变成彩色的最短时间【中等】/README"},{"text":"⏰ 1579. 保证图可完全遍历【困难】","link":"/TNotes.leetcode/1579. 保证图可完全遍历【困难】/README"},{"text":"⏰ 1580. 把箱子放进仓库里 II【中等】","link":"/TNotes.leetcode/1580. 把箱子放进仓库里 II【中等】/README"},{"text":"⏰ 1581. 进店却未进行过交易的顾客【简单】","link":"/TNotes.leetcode/1581. 进店却未进行过交易的顾客【简单】/README"},{"text":"⏰ 1582. 二进制矩阵中的特殊位置【简单】","link":"/TNotes.leetcode/1582. 二进制矩阵中的特殊位置【简单】/README"},{"text":"⏰ 1583. 统计不开心的朋友【中等】","link":"/TNotes.leetcode/1583. 统计不开心的朋友【中等】/README"},{"text":"⏰ 1584. 连接所有点的最小费用【中等】","link":"/TNotes.leetcode/1584. 连接所有点的最小费用【中等】/README"},{"text":"⏰ 1585. 检查字符串是否可以通过排序子字符串得到另一个字符串【困难】","link":"/TNotes.leetcode/1585. 检查字符串是否可以通过排序子字符串得到另一个字符串【困难】/README"},{"text":"⏰ 1586. 二叉搜索树迭代器 II【中等】","link":"/TNotes.leetcode/1586. 二叉搜索树迭代器 II【中等】/README"},{"text":"⏰ 1587. 银行账户概要 II【简单】","link":"/TNotes.leetcode/1587. 银行账户概要 II【简单】/README"},{"text":"⏰ 1588. 所有奇数长度子数组的和【简单】","link":"/TNotes.leetcode/1588. 所有奇数长度子数组的和【简单】/README"},{"text":"⏰ 1589. 所有排列中的最大和【中等】","link":"/TNotes.leetcode/1589. 所有排列中的最大和【中等】/README"},{"text":"⏰ 1590. 使数组和能被 P 整除【中等】","link":"/TNotes.leetcode/1590. 使数组和能被 P 整除【中等】/README"},{"text":"⏰ 1591. 奇怪的打印机 II【困难】","link":"/TNotes.leetcode/1591. 奇怪的打印机 II【困难】/README"},{"text":"⏰ 1592. 重新排列单词间的空格【简单】","link":"/TNotes.leetcode/1592. 重新排列单词间的空格【简单】/README"},{"text":"⏰ 1593. 拆分字符串使唯一子字符串的数目最大【中等】","link":"/TNotes.leetcode/1593. 拆分字符串使唯一子字符串的数目最大【中等】/README"},{"text":"⏰ 1594. 矩阵的最大非负积【中等】","link":"/TNotes.leetcode/1594. 矩阵的最大非负积【中等】/README"},{"text":"⏰ 1595. 连通两组点的最小成本【困难】","link":"/TNotes.leetcode/1595. 连通两组点的最小成本【困难】/README"},{"text":"⏰ 1596. 每位顾客最经常订购的商品【中等】","link":"/TNotes.leetcode/1596. 每位顾客最经常订购的商品【中等】/README"},{"text":"⏰ 1597. 根据中缀表达式构造二叉表达式树【困难】","link":"/TNotes.leetcode/1597. 根据中缀表达式构造二叉表达式树【困难】/README"},{"text":"⏰ 1598. 文件夹操作日志搜集器【简单】","link":"/TNotes.leetcode/1598. 文件夹操作日志搜集器【简单】/README"},{"text":"⏰ 1599. 经营摩天轮的最大利润【中等】","link":"/TNotes.leetcode/1599. 经营摩天轮的最大利润【中等】/README"},{"text":"⏰ 1600. 王位继承顺序【中等】","link":"/TNotes.leetcode/1600. 王位继承顺序【中等】/README"},{"text":"⏰ 1601. 最多可达成的换楼请求数目【困难】","link":"/TNotes.leetcode/1601. 最多可达成的换楼请求数目【困难】/README"},{"text":"⏰ 1602. 找到二叉树中最近的右侧节点【中等】","link":"/TNotes.leetcode/1602. 找到二叉树中最近的右侧节点【中等】/README"},{"text":"⏰ 1603. 设计停车系统【简单】","link":"/TNotes.leetcode/1603. 设计停车系统【简单】/README"},{"text":"⏰ 1604. 警告一小时内使用相同员工卡大于等于三次的人【中等】","link":"/TNotes.leetcode/1604. 警告一小时内使用相同员工卡大于等于三次的人【中等】/README"},{"text":"⏰ 1605. 给定行和列的和求可行矩阵【中等】","link":"/TNotes.leetcode/1605. 给定行和列的和求可行矩阵【中等】/README"},{"text":"⏰ 1606. 找到处理最多请求的服务器【困难】","link":"/TNotes.leetcode/1606. 找到处理最多请求的服务器【困难】/README"},{"text":"⏰ 1607. 没有卖出的卖家【简单】","link":"/TNotes.leetcode/1607. 没有卖出的卖家【简单】/README"},{"text":"⏰ 1608. 特殊数组的特征值【简单】","link":"/TNotes.leetcode/1608. 特殊数组的特征值【简单】/README"},{"text":"⏰ 1609. 奇偶树【中等】","link":"/TNotes.leetcode/1609. 奇偶树【中等】/README"},{"text":"⏰ 1610. 可见点的最大数目【困难】","link":"/TNotes.leetcode/1610. 可见点的最大数目【困难】/README"},{"text":"⏰ 1611. 使整数变为 0 的最少操作次数【困难】","link":"/TNotes.leetcode/1611. 使整数变为 0 的最少操作次数【困难】/README"},{"text":"⏰ 1612. 检查两棵二叉表达式树是否等价【中等】","link":"/TNotes.leetcode/1612. 检查两棵二叉表达式树是否等价【中等】/README"},{"text":"⏰ 1613. 找到遗失的ID【中等】","link":"/TNotes.leetcode/1613. 找到遗失的ID【中等】/README"},{"text":"⏰ 1614. 括号的最大嵌套深度【简单】","link":"/TNotes.leetcode/1614. 括号的最大嵌套深度【简单】/README"},{"text":"⏰ 1615. 最大网络秩【中等】","link":"/TNotes.leetcode/1615. 最大网络秩【中等】/README"},{"text":"⏰ 1616. 分割两个字符串得到回文串【中等】","link":"/TNotes.leetcode/1616. 分割两个字符串得到回文串【中等】/README"},{"text":"⏰ 1617. 统计子树中城市之间最大距离【困难】","link":"/TNotes.leetcode/1617. 统计子树中城市之间最大距离【困难】/README"},{"text":"⏰ 1618. 找出适应屏幕的最大字号【中等】","link":"/TNotes.leetcode/1618. 找出适应屏幕的最大字号【中等】/README"},{"text":"⏰ 1619. 删除某些元素后的数组均值【简单】","link":"/TNotes.leetcode/1619. 删除某些元素后的数组均值【简单】/README"},{"text":"⏰ 1620. 网络信号最好的坐标【中等】","link":"/TNotes.leetcode/1620. 网络信号最好的坐标【中等】/README"},{"text":"⏰ 1621. 大小为 K 的不重叠线段的数目【中等】","link":"/TNotes.leetcode/1621. 大小为 K 的不重叠线段的数目【中等】/README"},{"text":"⏰ 1622. 奇妙序列【困难】","link":"/TNotes.leetcode/1622. 奇妙序列【困难】/README"},{"text":"⏰ 1623. 三人国家代表队【简单】","link":"/TNotes.leetcode/1623. 三人国家代表队【简单】/README"},{"text":"⏰ 1624. 两个相同字符之间的最长子字符串【简单】","link":"/TNotes.leetcode/1624. 两个相同字符之间的最长子字符串【简单】/README"},{"text":"⏰ 1625. 执行操作后字典序最小的字符串【中等】","link":"/TNotes.leetcode/1625. 执行操作后字典序最小的字符串【中等】/README"},{"text":"⏰ 1626. 无矛盾的最佳球队【中等】","link":"/TNotes.leetcode/1626. 无矛盾的最佳球队【中等】/README"},{"text":"⏰ 1627. 带阈值的图连通性【困难】","link":"/TNotes.leetcode/1627. 带阈值的图连通性【困难】/README"},{"text":"⏰ 1628. 设计带解析函数的表达式树【中等】","link":"/TNotes.leetcode/1628. 设计带解析函数的表达式树【中等】/README"},{"text":"⏰ 1629. 按键持续时间最长的键【简单】","link":"/TNotes.leetcode/1629. 按键持续时间最长的键【简单】/README"},{"text":"⏰ 1630. 等差子数组【中等】","link":"/TNotes.leetcode/1630. 等差子数组【中等】/README"},{"text":"⏰ 1631. 最小体力消耗路径【中等】","link":"/TNotes.leetcode/1631. 最小体力消耗路径【中等】/README"},{"text":"⏰ 1632. 矩阵转换后的秩【困难】","link":"/TNotes.leetcode/1632. 矩阵转换后的秩【困难】/README"},{"text":"⏰ 1633. 各赛事的用户注册率【简单】","link":"/TNotes.leetcode/1633. 各赛事的用户注册率【简单】/README"},{"text":"⏰ 1634. 求两个多项式链表的和【中等】","link":"/TNotes.leetcode/1634. 求两个多项式链表的和【中等】/README"},{"text":"⏰ 1635. Hopper 公司查询 I【困难】","link":"/TNotes.leetcode/1635. Hopper 公司查询 I【困难】/README"},{"text":"⏰ 1636. 按照频率将数组升序排序【简单】","link":"/TNotes.leetcode/1636. 按照频率将数组升序排序【简单】/README"},{"text":"⏰ 1637. 两点之间不包含任何点的最宽垂直区域【简单】","link":"/TNotes.leetcode/1637. 两点之间不包含任何点的最宽垂直区域【简单】/README"},{"text":"⏰ 1638. 统计只差一个字符的子串数目【中等】","link":"/TNotes.leetcode/1638. 统计只差一个字符的子串数目【中等】/README"},{"text":"⏰ 1639. 通过给定词典构造目标字符串的方案数【困难】","link":"/TNotes.leetcode/1639. 通过给定词典构造目标字符串的方案数【困难】/README"},{"text":"⏰ 1640. 能否连接形成数组【简单】","link":"/TNotes.leetcode/1640. 能否连接形成数组【简单】/README"},{"text":"⏰ 1641. 统计字典序元音字符串的数目【中等】","link":"/TNotes.leetcode/1641. 统计字典序元音字符串的数目【中等】/README"},{"text":"⏰ 1642. 可以到达的最远建筑【中等】","link":"/TNotes.leetcode/1642. 可以到达的最远建筑【中等】/README"},{"text":"⏰ 1643. 第 K 条最小指令【困难】","link":"/TNotes.leetcode/1643. 第 K 条最小指令【困难】/README"},{"text":"⏰ 1644. 二叉树的最近公共祖先 II【中等】","link":"/TNotes.leetcode/1644. 二叉树的最近公共祖先 II【中等】/README"},{"text":"⏰ 1645. Hopper 公司查询 II【困难】","link":"/TNotes.leetcode/1645. Hopper 公司查询 II【困难】/README"},{"text":"⏰ 1646. 获取生成数组中的最大值【简单】","link":"/TNotes.leetcode/1646. 获取生成数组中的最大值【简单】/README"},{"text":"⏰ 1647. 字符频次唯一的最小删除次数【中等】","link":"/TNotes.leetcode/1647. 字符频次唯一的最小删除次数【中等】/README"},{"text":"⏰ 1648. 销售价值减少的颜色球【中等】","link":"/TNotes.leetcode/1648. 销售价值减少的颜色球【中等】/README"},{"text":"⏰ 1649. 通过指令创建有序数组【困难】","link":"/TNotes.leetcode/1649. 通过指令创建有序数组【困难】/README"},{"text":"⏰ 1650. 二叉树的最近公共祖先 III【中等】","link":"/TNotes.leetcode/1650. 二叉树的最近公共祖先 III【中等】/README"},{"text":"⏰ 1651. Hopper 公司查询 III【困难】","link":"/TNotes.leetcode/1651. Hopper 公司查询 III【困难】/README"},{"text":"⏰ 1652. 拆炸弹【简单】","link":"/TNotes.leetcode/1652. 拆炸弹【简单】/README"},{"text":"⏰ 1653. 使字符串平衡的最少删除次数【中等】","link":"/TNotes.leetcode/1653. 使字符串平衡的最少删除次数【中等】/README"},{"text":"⏰ 1654. 到家的最少跳跃次数【中等】","link":"/TNotes.leetcode/1654. 到家的最少跳跃次数【中等】/README"},{"text":"⏰ 1655. 分配重复整数【困难】","link":"/TNotes.leetcode/1655. 分配重复整数【困难】/README"},{"text":"⏰ 1656. 设计有序流【简单】","link":"/TNotes.leetcode/1656. 设计有序流【简单】/README"},{"text":"⏰ 1657. 确定两个字符串是否接近【中等】","link":"/TNotes.leetcode/1657. 确定两个字符串是否接近【中等】/README"},{"text":"⏰ 1658. 将 x 减到 0 的最小操作数【中等】","link":"/TNotes.leetcode/1658. 将 x 减到 0 的最小操作数【中等】/README"},{"text":"⏰ 1659. 最大化网格幸福感【困难】","link":"/TNotes.leetcode/1659. 最大化网格幸福感【困难】/README"},{"text":"⏰ 1660. 纠正二叉树【中等】","link":"/TNotes.leetcode/1660. 纠正二叉树【中等】/README"},{"text":"⏰ 1661. 每台机器的进程平均运行时间【简单】","link":"/TNotes.leetcode/1661. 每台机器的进程平均运行时间【简单】/README"},{"text":"⏰ 1662. 检查两个字符串数组是否相等【简单】","link":"/TNotes.leetcode/1662. 检查两个字符串数组是否相等【简单】/README"},{"text":"⏰ 1663. 具有给定数值的最小字符串【中等】","link":"/TNotes.leetcode/1663. 具有给定数值的最小字符串【中等】/README"},{"text":"⏰ 1664. 生成平衡数组的方案数【中等】","link":"/TNotes.leetcode/1664. 生成平衡数组的方案数【中等】/README"},{"text":"⏰ 1665. 完成所有任务的最少初始能量【困难】","link":"/TNotes.leetcode/1665. 完成所有任务的最少初始能量【困难】/README"},{"text":"⏰ 1666. 改变二叉树的根节点【中等】","link":"/TNotes.leetcode/1666. 改变二叉树的根节点【中等】/README"},{"text":"⏰ 1667. 修复表中的名字【简单】","link":"/TNotes.leetcode/1667. 修复表中的名字【简单】/README"},{"text":"⏰ 1668. 最大重复子字符串【简单】","link":"/TNotes.leetcode/1668. 最大重复子字符串【简单】/README"},{"text":"⏰ 1669. 合并两个链表【中等】","link":"/TNotes.leetcode/1669. 合并两个链表【中等】/README"},{"text":"⏰ 1670. 设计前中后队列【中等】","link":"/TNotes.leetcode/1670. 设计前中后队列【中等】/README"},{"text":"⏰ 1671. 得到山形数组的最少删除次数【困难】","link":"/TNotes.leetcode/1671. 得到山形数组的最少删除次数【困难】/README"},{"text":"⏰ 1672. 最富有客户的资产总量【简单】","link":"/TNotes.leetcode/1672. 最富有客户的资产总量【简单】/README"},{"text":"⏰ 1673. 找出最具竞争力的子序列【中等】","link":"/TNotes.leetcode/1673. 找出最具竞争力的子序列【中等】/README"},{"text":"⏰ 1674. 使数组互补的最少操作次数【中等】","link":"/TNotes.leetcode/1674. 使数组互补的最少操作次数【中等】/README"},{"text":"⏰ 1675. 数组的最小偏移量【困难】","link":"/TNotes.leetcode/1675. 数组的最小偏移量【困难】/README"},{"text":"⏰ 1676. 二叉树的最近公共祖先 IV【中等】","link":"/TNotes.leetcode/1676. 二叉树的最近公共祖先 IV【中等】/README"},{"text":"⏰ 1677. 发票中的产品金额【简单】","link":"/TNotes.leetcode/1677. 发票中的产品金额【简单】/README"},{"text":"⏰ 1678. 设计 Goal 解析器【简单】","link":"/TNotes.leetcode/1678. 设计 Goal 解析器【简单】/README"},{"text":"⏰ 1679. K 和数对的最大数目【中等】","link":"/TNotes.leetcode/1679. K 和数对的最大数目【中等】/README"},{"text":"⏰ 1680. 连接连续二进制数字【中等】","link":"/TNotes.leetcode/1680. 连接连续二进制数字【中等】/README"},{"text":"⏰ 1681. 最小不兼容性【困难】","link":"/TNotes.leetcode/1681. 最小不兼容性【困难】/README"},{"text":"⏰ 1682. 最长回文子序列 II【中等】","link":"/TNotes.leetcode/1682. 最长回文子序列 II【中等】/README"},{"text":"⏰ 1683. 无效的推文【简单】","link":"/TNotes.leetcode/1683. 无效的推文【简单】/README"},{"text":"⏰ 1684. 统计一致字符串的数目【简单】","link":"/TNotes.leetcode/1684. 统计一致字符串的数目【简单】/README"},{"text":"⏰ 1685. 有序数组中差绝对值之和【中等】","link":"/TNotes.leetcode/1685. 有序数组中差绝对值之和【中等】/README"},{"text":"⏰ 1686. 石子游戏 VI【中等】","link":"/TNotes.leetcode/1686. 石子游戏 VI【中等】/README"},{"text":"⏰ 1687. 从仓库到码头运输箱子【困难】","link":"/TNotes.leetcode/1687. 从仓库到码头运输箱子【困难】/README"},{"text":"⏰ 1688. 比赛中的配对次数【简单】","link":"/TNotes.leetcode/1688. 比赛中的配对次数【简单】/README"},{"text":"⏰ 1689. 十-二进制数的最少数目【中等】","link":"/TNotes.leetcode/1689. 十-二进制数的最少数目【中等】/README"},{"text":"⏰ 1690. 石子游戏 VII【中等】","link":"/TNotes.leetcode/1690. 石子游戏 VII【中等】/README"},{"text":"⏰ 1691. 堆叠长方体的最大高度【困难】","link":"/TNotes.leetcode/1691. 堆叠长方体的最大高度【困难】/README"},{"text":"⏰ 1692. 计算分配糖果的不同方式【困难】","link":"/TNotes.leetcode/1692. 计算分配糖果的不同方式【困难】/README"},{"text":"⏰ 1693. 每天的领导和合伙人【简单】","link":"/TNotes.leetcode/1693. 每天的领导和合伙人【简单】/README"},{"text":"⏰ 1694. 重新格式化电话号码【简单】","link":"/TNotes.leetcode/1694. 重新格式化电话号码【简单】/README"},{"text":"⏰ 1695. 删除子数组的最大得分【中等】","link":"/TNotes.leetcode/1695. 删除子数组的最大得分【中等】/README"},{"text":"⏰ 1696. 跳跃游戏 VI【中等】","link":"/TNotes.leetcode/1696. 跳跃游戏 VI【中等】/README"},{"text":"⏰ 1697. 检查边长度限制的路径是否存在【困难】","link":"/TNotes.leetcode/1697. 检查边长度限制的路径是否存在【困难】/README"},{"text":"⏰ 1698. 字符串的不同子字符串个数【中等】","link":"/TNotes.leetcode/1698. 字符串的不同子字符串个数【中等】/README"},{"text":"⏰ 1699. 两人之间的通话次数【中等】","link":"/TNotes.leetcode/1699. 两人之间的通话次数【中等】/README"},{"text":"⏰ 1700. 无法吃午餐的学生数量【简单】","link":"/TNotes.leetcode/1700. 无法吃午餐的学生数量【简单】/README"},{"text":"⏰ 1701. 平均等待时间【中等】","link":"/TNotes.leetcode/1701. 平均等待时间【中等】/README"},{"text":"⏰ 1702. 修改后的最大二进制字符串【中等】","link":"/TNotes.leetcode/1702. 修改后的最大二进制字符串【中等】/README"},{"text":"⏰ 1703. 得到连续 K 个 1 的最少相邻交换次数【困难】","link":"/TNotes.leetcode/1703. 得到连续 K 个 1 的最少相邻交换次数【困难】/README"},{"text":"⏰ 1704. 判断字符串的两半是否相似【简单】","link":"/TNotes.leetcode/1704. 判断字符串的两半是否相似【简单】/README"},{"text":"⏰ 1705. 吃苹果的最大数目【中等】","link":"/TNotes.leetcode/1705. 吃苹果的最大数目【中等】/README"},{"text":"⏰ 1706. 球会落何处【中等】","link":"/TNotes.leetcode/1706. 球会落何处【中等】/README"},{"text":"⏰ 1707. 与数组中元素的最大异或值【困难】","link":"/TNotes.leetcode/1707. 与数组中元素的最大异或值【困难】/README"},{"text":"⏰ 1708. 长度为 K 的最大子数组【简单】","link":"/TNotes.leetcode/1708. 长度为 K 的最大子数组【简单】/README"},{"text":"⏰ 1709. 访问日期之间最大的空档期【中等】","link":"/TNotes.leetcode/1709. 访问日期之间最大的空档期【中等】/README"},{"text":"⏰ 1710. 卡车上的最大单元数【简单】","link":"/TNotes.leetcode/1710. 卡车上的最大单元数【简单】/README"},{"text":"⏰ 1711. 大餐计数【中等】","link":"/TNotes.leetcode/1711. 大餐计数【中等】/README"},{"text":"⏰ 1712. 将数组分成三个子数组的方案数【中等】","link":"/TNotes.leetcode/1712. 将数组分成三个子数组的方案数【中等】/README"},{"text":"⏰ 1713. 得到子序列的最少操作次数【困难】","link":"/TNotes.leetcode/1713. 得到子序列的最少操作次数【困难】/README"},{"text":"⏰ 1714. 数组中特殊等间距元素的和【困难】","link":"/TNotes.leetcode/1714. 数组中特殊等间距元素的和【困难】/README"},{"text":"⏰ 1715. 苹果和橘子的个数【中等】","link":"/TNotes.leetcode/1715. 苹果和橘子的个数【中等】/README"},{"text":"⏰ 1716. 计算力扣银行的钱【简单】","link":"/TNotes.leetcode/1716. 计算力扣银行的钱【简单】/README"},{"text":"⏰ 1717. 删除子字符串的最大得分【中等】","link":"/TNotes.leetcode/1717. 删除子字符串的最大得分【中等】/README"},{"text":"⏰ 1718. 构建字典序最大的可行序列【中等】","link":"/TNotes.leetcode/1718. 构建字典序最大的可行序列【中等】/README"},{"text":"⏰ 1719. 重构一棵树的方案数【困难】","link":"/TNotes.leetcode/1719. 重构一棵树的方案数【困难】/README"},{"text":"⏰ 1720. 解码异或后的数组【简单】","link":"/TNotes.leetcode/1720. 解码异或后的数组【简单】/README"},{"text":"⏰ 1721. 交换链表中的节点【中等】","link":"/TNotes.leetcode/1721. 交换链表中的节点【中等】/README"},{"text":"⏰ 1722. 执行交换操作后的最小汉明距离【中等】","link":"/TNotes.leetcode/1722. 执行交换操作后的最小汉明距离【中等】/README"},{"text":"⏰ 1723. 完成所有工作的最短时间【困难】","link":"/TNotes.leetcode/1723. 完成所有工作的最短时间【困难】/README"},{"text":"⏰ 1724. 检查边长度限制的路径是否存在 II【困难】","link":"/TNotes.leetcode/1724. 检查边长度限制的路径是否存在 II【困难】/README"},{"text":"⏰ 1725. 可以形成最大正方形的矩形数目【简单】","link":"/TNotes.leetcode/1725. 可以形成最大正方形的矩形数目【简单】/README"},{"text":"⏰ 1726. 同积元组【中等】","link":"/TNotes.leetcode/1726. 同积元组【中等】/README"},{"text":"⏰ 1727. 重新排列后的最大子矩阵【中等】","link":"/TNotes.leetcode/1727. 重新排列后的最大子矩阵【中等】/README"},{"text":"⏰ 1728. 猫和老鼠 II【困难】","link":"/TNotes.leetcode/1728. 猫和老鼠 II【困难】/README"},{"text":"⏰ 1729. 求关注者的数量【简单】","link":"/TNotes.leetcode/1729. 求关注者的数量【简单】/README"},{"text":"⏰ 1730. 获取食物的最短路径【中等】","link":"/TNotes.leetcode/1730. 获取食物的最短路径【中等】/README"},{"text":"⏰ 1731. 每位经理的下属员工数量【简单】","link":"/TNotes.leetcode/1731. 每位经理的下属员工数量【简单】/README"},{"text":"⏰ 1732. 找到最高海拔【简单】","link":"/TNotes.leetcode/1732. 找到最高海拔【简单】/README"},{"text":"⏰ 1733. 需要教语言的最少人数【中等】","link":"/TNotes.leetcode/1733. 需要教语言的最少人数【中等】/README"},{"text":"⏰ 1734. 解码异或后的排列【中等】","link":"/TNotes.leetcode/1734. 解码异或后的排列【中等】/README"},{"text":"⏰ 1735. 生成乘积数组的方案数【困难】","link":"/TNotes.leetcode/1735. 生成乘积数组的方案数【困难】/README"},{"text":"⏰ 1736. 替换隐藏数字得到的最晚时间【简单】","link":"/TNotes.leetcode/1736. 替换隐藏数字得到的最晚时间【简单】/README"},{"text":"⏰ 1737. 满足三条件之一需改变的最少字符数【中等】","link":"/TNotes.leetcode/1737. 满足三条件之一需改变的最少字符数【中等】/README"},{"text":"⏰ 1738. 找出第 K 大的异或坐标值【中等】","link":"/TNotes.leetcode/1738. 找出第 K 大的异或坐标值【中等】/README"},{"text":"⏰ 1739. 放置盒子【困难】","link":"/TNotes.leetcode/1739. 放置盒子【困难】/README"},{"text":"⏰ 1740. 找到二叉树中的距离【中等】","link":"/TNotes.leetcode/1740. 找到二叉树中的距离【中等】/README"},{"text":"⏰ 1741. 查找每个员工花费的总时间【简单】","link":"/TNotes.leetcode/1741. 查找每个员工花费的总时间【简单】/README"},{"text":"⏰ 1742. 盒子中小球的最大数量【简单】","link":"/TNotes.leetcode/1742. 盒子中小球的最大数量【简单】/README"},{"text":"⏰ 1743. 从相邻元素对还原数组【中等】","link":"/TNotes.leetcode/1743. 从相邻元素对还原数组【中等】/README"},{"text":"⏰ 1744. 你能在你最喜欢的那天吃到你最喜欢的糖果吗？【中等】","link":"/TNotes.leetcode/1744. 你能在你最喜欢的那天吃到你最喜欢的糖果吗？【中等】/README"},{"text":"⏰ 1745. 分割回文串 IV【困难】","link":"/TNotes.leetcode/1745. 分割回文串 IV【困难】/README"},{"text":"⏰ 1746. 经过一次操作后的最大子数组和【中等】","link":"/TNotes.leetcode/1746. 经过一次操作后的最大子数组和【中等】/README"},{"text":"⏰ 1747. 应该被禁止的 Leetflex 账户【中等】","link":"/TNotes.leetcode/1747. 应该被禁止的 Leetflex 账户【中等】/README"},{"text":"⏰ 1748. 唯一元素的和【简单】","link":"/TNotes.leetcode/1748. 唯一元素的和【简单】/README"},{"text":"⏰ 1749. 任意子数组和的绝对值的最大值【中等】","link":"/TNotes.leetcode/1749. 任意子数组和的绝对值的最大值【中等】/README"},{"text":"⏰ 1750. 删除字符串两端相同字符后的最短长度【中等】","link":"/TNotes.leetcode/1750. 删除字符串两端相同字符后的最短长度【中等】/README"},{"text":"⏰ 1751. 最多可以参加的会议数目 II【困难】","link":"/TNotes.leetcode/1751. 最多可以参加的会议数目 II【困难】/README"},{"text":"⏰ 1752. 检查数组是否经排序和轮转得到【简单】","link":"/TNotes.leetcode/1752. 检查数组是否经排序和轮转得到【简单】/README"},{"text":"⏰ 1753. 移除石子的最大得分【中等】","link":"/TNotes.leetcode/1753. 移除石子的最大得分【中等】/README"},{"text":"⏰ 1754. 构造字典序最大的合并字符串【中等】","link":"/TNotes.leetcode/1754. 构造字典序最大的合并字符串【中等】/README"},{"text":"⏰ 1755. 最接近目标值的子序列和【困难】","link":"/TNotes.leetcode/1755. 最接近目标值的子序列和【困难】/README"},{"text":"⏰ 1756. 设计最近使用（MRU）队列【中等】","link":"/TNotes.leetcode/1756. 设计最近使用（MRU）队列【中等】/README"},{"text":"⏰ 1757. 可回收且低脂的产品【简单】","link":"/TNotes.leetcode/1757. 可回收且低脂的产品【简单】/README"},{"text":"⏰ 1758. 生成交替二进制字符串的最少操作数【简单】","link":"/TNotes.leetcode/1758. 生成交替二进制字符串的最少操作数【简单】/README"},{"text":"⏰ 1759. 统计同质子字符串的数目【中等】","link":"/TNotes.leetcode/1759. 统计同质子字符串的数目【中等】/README"},{"text":"⏰ 1760. 袋子里最少数目的球【中等】","link":"/TNotes.leetcode/1760. 袋子里最少数目的球【中等】/README"},{"text":"⏰ 1761. 一个图中连通三元组的最小度数【困难】","link":"/TNotes.leetcode/1761. 一个图中连通三元组的最小度数【困难】/README"},{"text":"⏰ 1762. 能看到海景的建筑物【中等】","link":"/TNotes.leetcode/1762. 能看到海景的建筑物【中等】/README"},{"text":"⏰ 1763. 最长的美好子字符串【简单】","link":"/TNotes.leetcode/1763. 最长的美好子字符串【简单】/README"},{"text":"⏰ 1764. 通过连接另一个数组的子数组得到一个数组【中等】","link":"/TNotes.leetcode/1764. 通过连接另一个数组的子数组得到一个数组【中等】/README"},{"text":"⏰ 1765. 地图中的最高点【中等】","link":"/TNotes.leetcode/1765. 地图中的最高点【中等】/README"},{"text":"⏰ 1766. 互质树【困难】","link":"/TNotes.leetcode/1766. 互质树【困难】/README"},{"text":"⏰ 1767. 寻找没有被执行的任务对【困难】","link":"/TNotes.leetcode/1767. 寻找没有被执行的任务对【困难】/README"},{"text":"⏰ 1768. 交替合并字符串【简单】","link":"/TNotes.leetcode/1768. 交替合并字符串【简单】/README"},{"text":"⏰ 1769. 移动所有球到每个盒子所需的最小操作数【中等】","link":"/TNotes.leetcode/1769. 移动所有球到每个盒子所需的最小操作数【中等】/README"},{"text":"⏰ 1770. 执行乘法运算的最大分数【困难】","link":"/TNotes.leetcode/1770. 执行乘法运算的最大分数【困难】/README"},{"text":"⏰ 1771. 由子序列构造的最长回文串的长度【困难】","link":"/TNotes.leetcode/1771. 由子序列构造的最长回文串的长度【困难】/README"},{"text":"⏰ 1772. 按受欢迎程度排列功能【中等】","link":"/TNotes.leetcode/1772. 按受欢迎程度排列功能【中等】/README"},{"text":"⏰ 1773. 统计匹配检索规则的物品数量【简单】","link":"/TNotes.leetcode/1773. 统计匹配检索规则的物品数量【简单】/README"},{"text":"⏰ 1774. 最接近目标价格的甜点成本【中等】","link":"/TNotes.leetcode/1774. 最接近目标价格的甜点成本【中等】/README"},{"text":"⏰ 1775. 通过最少操作次数使数组的和相等【中等】","link":"/TNotes.leetcode/1775. 通过最少操作次数使数组的和相等【中等】/README"},{"text":"⏰ 1776. 车队 II【困难】","link":"/TNotes.leetcode/1776. 车队 II【困难】/README"},{"text":"⏰ 1777. 每家商店的产品价格【简单】","link":"/TNotes.leetcode/1777. 每家商店的产品价格【简单】/README"},{"text":"⏰ 1778. 未知网格中的最短路径【中等】","link":"/TNotes.leetcode/1778. 未知网格中的最短路径【中等】/README"},{"text":"⏰ 1779. 找到最近的有相同 X 或 Y 坐标的点【简单】","link":"/TNotes.leetcode/1779. 找到最近的有相同 X 或 Y 坐标的点【简单】/README"},{"text":"⏰ 1780. 判断一个数字是否可以表示成三的幂的和【中等】","link":"/TNotes.leetcode/1780. 判断一个数字是否可以表示成三的幂的和【中等】/README"},{"text":"⏰ 1781. 所有子字符串美丽值之和【中等】","link":"/TNotes.leetcode/1781. 所有子字符串美丽值之和【中等】/README"},{"text":"⏰ 1782. 统计点对的数目【困难】","link":"/TNotes.leetcode/1782. 统计点对的数目【困难】/README"},{"text":"⏰ 1783. 大满贯数量【中等】","link":"/TNotes.leetcode/1783. 大满贯数量【中等】/README"},{"text":"⏰ 1784. 检查二进制字符串字段【简单】","link":"/TNotes.leetcode/1784. 检查二进制字符串字段【简单】/README"},{"text":"⏰ 1785. 构成特定和需要添加的最少元素【中等】","link":"/TNotes.leetcode/1785. 构成特定和需要添加的最少元素【中等】/README"},{"text":"⏰ 1786. 从第一个节点出发到最后一个节点的受限路径数【中等】","link":"/TNotes.leetcode/1786. 从第一个节点出发到最后一个节点的受限路径数【中等】/README"},{"text":"⏰ 1787. 使所有区间的异或结果为零【困难】","link":"/TNotes.leetcode/1787. 使所有区间的异或结果为零【困难】/README"},{"text":"⏰ 1788. 最大化花园的美观度【困难】","link":"/TNotes.leetcode/1788. 最大化花园的美观度【困难】/README"},{"text":"⏰ 1789. 员工的直属部门【简单】","link":"/TNotes.leetcode/1789. 员工的直属部门【简单】/README"},{"text":"⏰ 1790. 仅执行一次字符串交换能否使两个字符串相等【简单】","link":"/TNotes.leetcode/1790. 仅执行一次字符串交换能否使两个字符串相等【简单】/README"},{"text":"⏰ 1791. 找出星型图的中心节点【简单】","link":"/TNotes.leetcode/1791. 找出星型图的中心节点【简单】/README"},{"text":"⏰ 1792. 最大平均通过率【中等】","link":"/TNotes.leetcode/1792. 最大平均通过率【中等】/README"},{"text":"⏰ 1793. 好子数组的最大分数【困难】","link":"/TNotes.leetcode/1793. 好子数组的最大分数【困难】/README"},{"text":"⏰ 1794. 统计距离最小的子串对个数【中等】","link":"/TNotes.leetcode/1794. 统计距离最小的子串对个数【中等】/README"},{"text":"⏰ 1795. 每个产品在不同商店的价格【简单】","link":"/TNotes.leetcode/1795. 每个产品在不同商店的价格【简单】/README"},{"text":"⏰ 1796. 字符串中第二大的数字【简单】","link":"/TNotes.leetcode/1796. 字符串中第二大的数字【简单】/README"},{"text":"⏰ 1797. 设计一个验证系统【中等】","link":"/TNotes.leetcode/1797. 设计一个验证系统【中等】/README"},{"text":"⏰ 1798. 你能构造出连续值的最大数目【中等】","link":"/TNotes.leetcode/1798. 你能构造出连续值的最大数目【中等】/README"},{"text":"⏰ 1799. N 次操作后的最大分数和【困难】","link":"/TNotes.leetcode/1799. N 次操作后的最大分数和【困难】/README"},{"text":"⏰ 1800. 最大升序子数组和【简单】","link":"/TNotes.leetcode/1800. 最大升序子数组和【简单】/README"},{"text":"⏰ 1801. 积压订单中的订单总数【中等】","link":"/TNotes.leetcode/1801. 积压订单中的订单总数【中等】/README"},{"text":"⏰ 1802. 有界数组中指定下标处的最大值【中等】","link":"/TNotes.leetcode/1802. 有界数组中指定下标处的最大值【中等】/README"},{"text":"⏰ 1803. 统计异或值在范围内的数对有多少【困难】","link":"/TNotes.leetcode/1803. 统计异或值在范围内的数对有多少【困难】/README"},{"text":"⏰ 1804. 实现 Trie （前缀树） II【中等】","link":"/TNotes.leetcode/1804. 实现 Trie （前缀树） II【中等】/README"},{"text":"⏰ 1805. 字符串中不同整数的数目【简单】","link":"/TNotes.leetcode/1805. 字符串中不同整数的数目【简单】/README"},{"text":"⏰ 1806. 还原排列的最少操作步数【中等】","link":"/TNotes.leetcode/1806. 还原排列的最少操作步数【中等】/README"},{"text":"⏰ 1807. 替换字符串中的括号内容【中等】","link":"/TNotes.leetcode/1807. 替换字符串中的括号内容【中等】/README"},{"text":"⏰ 1808. 好因子的最大数目【困难】","link":"/TNotes.leetcode/1808. 好因子的最大数目【困难】/README"},{"text":"⏰ 1809. 没有广告的剧集【简单】","link":"/TNotes.leetcode/1809. 没有广告的剧集【简单】/README"},{"text":"⏰ 1810. 隐藏网格下的最小消耗路径【中等】","link":"/TNotes.leetcode/1810. 隐藏网格下的最小消耗路径【中等】/README"},{"text":"⏰ 1811. 寻找面试候选人【中等】","link":"/TNotes.leetcode/1811. 寻找面试候选人【中等】/README"},{"text":"⏰ 1812. 判断国际象棋棋盘中一个格子的颜色【简单】","link":"/TNotes.leetcode/1812. 判断国际象棋棋盘中一个格子的颜色【简单】/README"},{"text":"⏰ 1813. 句子相似性 III【中等】","link":"/TNotes.leetcode/1813. 句子相似性 III【中等】/README"},{"text":"⏰ 1814. 统计一个数组中好对子的数目【中等】","link":"/TNotes.leetcode/1814. 统计一个数组中好对子的数目【中等】/README"},{"text":"⏰ 1815. 得到新鲜甜甜圈的最多组数【困难】","link":"/TNotes.leetcode/1815. 得到新鲜甜甜圈的最多组数【困难】/README"},{"text":"⏰ 1816. 截断句子【简单】","link":"/TNotes.leetcode/1816. 截断句子【简单】/README"},{"text":"⏰ 1817. 查找用户活跃分钟数【中等】","link":"/TNotes.leetcode/1817. 查找用户活跃分钟数【中等】/README"},{"text":"⏰ 1818. 绝对差值和【中等】","link":"/TNotes.leetcode/1818. 绝对差值和【中等】/README"},{"text":"⏰ 1819. 序列中不同最大公约数的数目【困难】","link":"/TNotes.leetcode/1819. 序列中不同最大公约数的数目【困难】/README"},{"text":"⏰ 1820. 最多邀请的个数【中等】","link":"/TNotes.leetcode/1820. 最多邀请的个数【中等】/README"},{"text":"⏰ 1821. 寻找今年具有正收入的客户【简单】","link":"/TNotes.leetcode/1821. 寻找今年具有正收入的客户【简单】/README"},{"text":"⏰ 1822. 数组元素积的符号【简单】","link":"/TNotes.leetcode/1822. 数组元素积的符号【简单】/README"},{"text":"⏰ 1823. 找出游戏的获胜者【中等】","link":"/TNotes.leetcode/1823. 找出游戏的获胜者【中等】/README"},{"text":"⏰ 1824. 最少侧跳次数【中等】","link":"/TNotes.leetcode/1824. 最少侧跳次数【中等】/README"},{"text":"⏰ 1825. 求出 MK 平均值【困难】","link":"/TNotes.leetcode/1825. 求出 MK 平均值【困难】/README"},{"text":"⏰ 1826. 有缺陷的传感器【简单】","link":"/TNotes.leetcode/1826. 有缺陷的传感器【简单】/README"},{"text":"⏰ 1827. 最少操作使数组递增【简单】","link":"/TNotes.leetcode/1827. 最少操作使数组递增【简单】/README"},{"text":"⏰ 1828. 统计一个圆中点的数目【中等】","link":"/TNotes.leetcode/1828. 统计一个圆中点的数目【中等】/README"},{"text":"⏰ 1829. 每个查询的最大异或值【中等】","link":"/TNotes.leetcode/1829. 每个查询的最大异或值【中等】/README"},{"text":"⏰ 1830. 使字符串有序的最少操作次数【困难】","link":"/TNotes.leetcode/1830. 使字符串有序的最少操作次数【困难】/README"},{"text":"⏰ 1831. 每天的最大交易【中等】","link":"/TNotes.leetcode/1831. 每天的最大交易【中等】/README"},{"text":"⏰ 1832. 判断句子是否为全字母句【简单】","link":"/TNotes.leetcode/1832. 判断句子是否为全字母句【简单】/README"},{"text":"⏰ 1833. 雪糕的最大数量【中等】","link":"/TNotes.leetcode/1833. 雪糕的最大数量【中等】/README"},{"text":"⏰ 1834. 单线程 CPU【中等】","link":"/TNotes.leetcode/1834. 单线程 CPU【中等】/README"},{"text":"⏰ 1835. 所有数对按位与结果的异或和【困难】","link":"/TNotes.leetcode/1835. 所有数对按位与结果的异或和【困难】/README"},{"text":"⏰ 1836. 从未排序的链表中移除重复元素【中等】","link":"/TNotes.leetcode/1836. 从未排序的链表中移除重复元素【中等】/README"},{"text":"⏰ 1837. K 进制表示下的各位数字总和【简单】","link":"/TNotes.leetcode/1837. K 进制表示下的各位数字总和【简单】/README"},{"text":"⏰ 1838. 最高频元素的频数【中等】","link":"/TNotes.leetcode/1838. 最高频元素的频数【中等】/README"},{"text":"⏰ 1839. 所有元音按顺序排布的最长子字符串【中等】","link":"/TNotes.leetcode/1839. 所有元音按顺序排布的最长子字符串【中等】/README"},{"text":"⏰ 1840. 最高建筑高度【困难】","link":"/TNotes.leetcode/1840. 最高建筑高度【困难】/README"},{"text":"⏰ 1841. 联赛信息统计【中等】","link":"/TNotes.leetcode/1841. 联赛信息统计【中等】/README"},{"text":"⏰ 1842. 下个由相同数字构成的回文串【困难】","link":"/TNotes.leetcode/1842. 下个由相同数字构成的回文串【困难】/README"},{"text":"⏰ 1843. 可疑银行账户【中等】","link":"/TNotes.leetcode/1843. 可疑银行账户【中等】/README"},{"text":"⏰ 1844. 将所有数字用字符替换【简单】","link":"/TNotes.leetcode/1844. 将所有数字用字符替换【简单】/README"},{"text":"⏰ 1845. 座位预约管理系统【中等】","link":"/TNotes.leetcode/1845. 座位预约管理系统【中等】/README"},{"text":"⏰ 1846. 减小和重新排列数组后的最大元素【中等】","link":"/TNotes.leetcode/1846. 减小和重新排列数组后的最大元素【中等】/README"},{"text":"⏰ 1847. 最近的房间【困难】","link":"/TNotes.leetcode/1847. 最近的房间【困难】/README"},{"text":"⏰ 1848. 到目标元素的最小距离【简单】","link":"/TNotes.leetcode/1848. 到目标元素的最小距离【简单】/README"},{"text":"⏰ 1849. 将字符串拆分为递减的连续值【中等】","link":"/TNotes.leetcode/1849. 将字符串拆分为递减的连续值【中等】/README"},{"text":"⏰ 1850. 邻位交换的最小次数【中等】","link":"/TNotes.leetcode/1850. 邻位交换的最小次数【中等】/README"},{"text":"⏰ 1851. 包含每个查询的最小区间【困难】","link":"/TNotes.leetcode/1851. 包含每个查询的最小区间【困难】/README"},{"text":"⏰ 1852. 每个子数组的数字种类数【中等】","link":"/TNotes.leetcode/1852. 每个子数组的数字种类数【中等】/README"},{"text":"⏰ 1853. 转换日期格式【简单】","link":"/TNotes.leetcode/1853. 转换日期格式【简单】/README"},{"text":"⏰ 1854. 人口最多的年份【简单】","link":"/TNotes.leetcode/1854. 人口最多的年份【简单】/README"},{"text":"⏰ 1855. 下标对中的最大距离【中等】","link":"/TNotes.leetcode/1855. 下标对中的最大距离【中等】/README"},{"text":"⏰ 1856. 子数组最小乘积的最大值【中等】","link":"/TNotes.leetcode/1856. 子数组最小乘积的最大值【中等】/README"},{"text":"⏰ 1857. 有向图中最大颜色值【困难】","link":"/TNotes.leetcode/1857. 有向图中最大颜色值【困难】/README"},{"text":"⏰ 1858. 包含所有前缀的最长单词【中等】","link":"/TNotes.leetcode/1858. 包含所有前缀的最长单词【中等】/README"},{"text":"⏰ 1859. 将句子排序【简单】","link":"/TNotes.leetcode/1859. 将句子排序【简单】/README"},{"text":"⏰ 1860. 增长的内存泄露【中等】","link":"/TNotes.leetcode/1860. 增长的内存泄露【中等】/README"},{"text":"⏰ 1861. 旋转盒子【中等】","link":"/TNotes.leetcode/1861. 旋转盒子【中等】/README"},{"text":"⏰ 1862. 向下取整数对和【困难】","link":"/TNotes.leetcode/1862. 向下取整数对和【困难】/README"},{"text":"⏰ 1863. 找出所有子集的异或总和再求和【简单】","link":"/TNotes.leetcode/1863. 找出所有子集的异或总和再求和【简单】/README"},{"text":"⏰ 1864. 构成交替字符串需要的最小交换次数【中等】","link":"/TNotes.leetcode/1864. 构成交替字符串需要的最小交换次数【中等】/README"},{"text":"⏰ 1865. 找出和为指定值的下标对【中等】","link":"/TNotes.leetcode/1865. 找出和为指定值的下标对【中等】/README"},{"text":"⏰ 1866. 恰有 K 根木棍可以看到的排列数目【困难】","link":"/TNotes.leetcode/1866. 恰有 K 根木棍可以看到的排列数目【困难】/README"},{"text":"⏰ 1867. 最大数量高于平均水平的订单【中等】","link":"/TNotes.leetcode/1867. 最大数量高于平均水平的订单【中等】/README"},{"text":"⏰ 1868. 两个行程编码数组的积【中等】","link":"/TNotes.leetcode/1868. 两个行程编码数组的积【中等】/README"},{"text":"⏰ 1869. 哪种连续子字符串更长【简单】","link":"/TNotes.leetcode/1869. 哪种连续子字符串更长【简单】/README"},{"text":"⏰ 1870. 准时到达的列车最小时速【中等】","link":"/TNotes.leetcode/1870. 准时到达的列车最小时速【中等】/README"},{"text":"⏰ 1871. 跳跃游戏 VII【中等】","link":"/TNotes.leetcode/1871. 跳跃游戏 VII【中等】/README"},{"text":"⏰ 1872. 石子游戏 VIII【困难】","link":"/TNotes.leetcode/1872. 石子游戏 VIII【困难】/README"},{"text":"⏰ 1873. 计算特殊奖金【简单】","link":"/TNotes.leetcode/1873. 计算特殊奖金【简单】/README"},{"text":"⏰ 1874. 两个数组的最小乘积和【中等】","link":"/TNotes.leetcode/1874. 两个数组的最小乘积和【中等】/README"},{"text":"⏰ 1875. 将工资相同的雇员分组【中等】","link":"/TNotes.leetcode/1875. 将工资相同的雇员分组【中等】/README"},{"text":"⏰ 1876. 长度为三且各字符不同的子字符串【简单】","link":"/TNotes.leetcode/1876. 长度为三且各字符不同的子字符串【简单】/README"},{"text":"⏰ 1877. 数组中最大数对和的最小值【中等】","link":"/TNotes.leetcode/1877. 数组中最大数对和的最小值【中等】/README"},{"text":"⏰ 1878. 矩阵中最大的三个菱形和【中等】","link":"/TNotes.leetcode/1878. 矩阵中最大的三个菱形和【中等】/README"},{"text":"⏰ 1879. 两个数组最小的异或值之和【困难】","link":"/TNotes.leetcode/1879. 两个数组最小的异或值之和【困难】/README"},{"text":"⏰ 1880. 检查某单词是否等于两单词之和【简单】","link":"/TNotes.leetcode/1880. 检查某单词是否等于两单词之和【简单】/README"},{"text":"⏰ 1881. 插入后的最大值【中等】","link":"/TNotes.leetcode/1881. 插入后的最大值【中等】/README"},{"text":"⏰ 1882. 使用服务器处理任务【中等】","link":"/TNotes.leetcode/1882. 使用服务器处理任务【中等】/README"},{"text":"⏰ 1883. 准时抵达会议现场的最小跳过休息次数【困难】","link":"/TNotes.leetcode/1883. 准时抵达会议现场的最小跳过休息次数【困难】/README"},{"text":"⏰ 1884. 鸡蛋掉落-两枚鸡蛋【中等】","link":"/TNotes.leetcode/1884. 鸡蛋掉落-两枚鸡蛋【中等】/README"},{"text":"⏰ 1885. 统计数对【中等】","link":"/TNotes.leetcode/1885. 统计数对【中等】/README"},{"text":"⏰ 1886. 判断矩阵经轮转后是否一致【简单】","link":"/TNotes.leetcode/1886. 判断矩阵经轮转后是否一致【简单】/README"},{"text":"⏰ 1887. 使数组元素相等的减少操作次数【中等】","link":"/TNotes.leetcode/1887. 使数组元素相等的减少操作次数【中等】/README"},{"text":"⏰ 1888. 使二进制字符串字符交替的最少反转次数【中等】","link":"/TNotes.leetcode/1888. 使二进制字符串字符交替的最少反转次数【中等】/README"},{"text":"⏰ 1889. 装包裹的最小浪费空间【困难】","link":"/TNotes.leetcode/1889. 装包裹的最小浪费空间【困难】/README"},{"text":"⏰ 1890. 2020年最后一次登录【简单】","link":"/TNotes.leetcode/1890. 2020年最后一次登录【简单】/README"},{"text":"⏰ 1891. 割绳子【中等】","link":"/TNotes.leetcode/1891. 割绳子【中等】/README"},{"text":"⏰ 1892. 页面推荐Ⅱ【困难】","link":"/TNotes.leetcode/1892. 页面推荐Ⅱ【困难】/README"},{"text":"⏰ 1893. 检查是否区域内所有整数都被覆盖【简单】","link":"/TNotes.leetcode/1893. 检查是否区域内所有整数都被覆盖【简单】/README"},{"text":"⏰ 1894. 找到需要补充粉笔的学生编号【中等】","link":"/TNotes.leetcode/1894. 找到需要补充粉笔的学生编号【中等】/README"},{"text":"⏰ 1895. 最大的幻方【中等】","link":"/TNotes.leetcode/1895. 最大的幻方【中等】/README"},{"text":"⏰ 1896. 反转表达式值的最少操作次数【困难】","link":"/TNotes.leetcode/1896. 反转表达式值的最少操作次数【困难】/README"},{"text":"⏰ 1897. 重新分配字符使所有字符串都相等【简单】","link":"/TNotes.leetcode/1897. 重新分配字符使所有字符串都相等【简单】/README"},{"text":"⏰ 1898. 可移除字符的最大数目【中等】","link":"/TNotes.leetcode/1898. 可移除字符的最大数目【中等】/README"},{"text":"⏰ 1899. 合并若干三元组以形成目标三元组【中等】","link":"/TNotes.leetcode/1899. 合并若干三元组以形成目标三元组【中等】/README"},{"text":"⏰ 1900. 最佳运动员的比拼回合【困难】","link":"/TNotes.leetcode/1900. 最佳运动员的比拼回合【困难】/README"},{"text":"⏰ 1901. 寻找峰值 II【中等】","link":"/TNotes.leetcode/1901. 寻找峰值 II【中等】/README"},{"text":"⏰ 1902. 给定二叉搜索树的插入顺序求深度【中等】","link":"/TNotes.leetcode/1902. 给定二叉搜索树的插入顺序求深度【中等】/README"},{"text":"⏰ 1903. 字符串中的最大奇数【简单】","link":"/TNotes.leetcode/1903. 字符串中的最大奇数【简单】/README"},{"text":"⏰ 1904. 你完成的完整对局数【中等】","link":"/TNotes.leetcode/1904. 你完成的完整对局数【中等】/README"},{"text":"⏰ 1905. 统计子岛屿【中等】","link":"/TNotes.leetcode/1905. 统计子岛屿【中等】/README"},{"text":"⏰ 1906. 查询差绝对值的最小值【中等】","link":"/TNotes.leetcode/1906. 查询差绝对值的最小值【中等】/README"},{"text":"⏰ 1907. 按分类统计薪水【中等】","link":"/TNotes.leetcode/1907. 按分类统计薪水【中等】/README"},{"text":"⏰ 1908. Nim 游戏 II【中等】","link":"/TNotes.leetcode/1908. Nim 游戏 II【中等】/README"},{"text":"⏰ 1909. 删除一个元素使数组严格递增【简单】","link":"/TNotes.leetcode/1909. 删除一个元素使数组严格递增【简单】/README"},{"text":"⏰ 1910. 删除一个字符串中所有出现的给定子字符串【中等】","link":"/TNotes.leetcode/1910. 删除一个字符串中所有出现的给定子字符串【中等】/README"},{"text":"⏰ 1911. 最大交替子序列和【中等】","link":"/TNotes.leetcode/1911. 最大交替子序列和【中等】/README"},{"text":"⏰ 1912. 设计电影租借系统【困难】","link":"/TNotes.leetcode/1912. 设计电影租借系统【困难】/README"},{"text":"⏰ 1913. 两个数对之间的最大乘积差【简单】","link":"/TNotes.leetcode/1913. 两个数对之间的最大乘积差【简单】/README"},{"text":"⏰ 1914. 循环轮转矩阵【中等】","link":"/TNotes.leetcode/1914. 循环轮转矩阵【中等】/README"},{"text":"⏰ 1915. 最美子字符串的数目【中等】","link":"/TNotes.leetcode/1915. 最美子字符串的数目【中等】/README"},{"text":"⏰ 1916. 统计为蚁群构筑房间的不同顺序【困难】","link":"/TNotes.leetcode/1916. 统计为蚁群构筑房间的不同顺序【困难】/README"},{"text":"⏰ 1917. Leetcodify 好友推荐【困难】","link":"/TNotes.leetcode/1917. Leetcodify 好友推荐【困难】/README"},{"text":"⏰ 1918. 第 K 小的子数组和【中等】","link":"/TNotes.leetcode/1918. 第 K 小的子数组和【中等】/README"},{"text":"⏰ 1919. 兴趣相同的朋友【困难】","link":"/TNotes.leetcode/1919. 兴趣相同的朋友【困难】/README"},{"text":"⏰ 1920. 基于排列构建数组【简单】","link":"/TNotes.leetcode/1920. 基于排列构建数组【简单】/README"},{"text":"⏰ 1921. 消灭怪物的最大数量【中等】","link":"/TNotes.leetcode/1921. 消灭怪物的最大数量【中等】/README"},{"text":"⏰ 1922. 统计好数字的数目【中等】","link":"/TNotes.leetcode/1922. 统计好数字的数目【中等】/README"},{"text":"⏰ 1923. 最长公共子路径【困难】","link":"/TNotes.leetcode/1923. 最长公共子路径【困难】/README"},{"text":"⏰ 1924. 安装栅栏 II【困难】","link":"/TNotes.leetcode/1924. 安装栅栏 II【困难】/README"},{"text":"⏰ 1925. 统计平方和三元组的数目【简单】","link":"/TNotes.leetcode/1925. 统计平方和三元组的数目【简单】/README"},{"text":"⏰ 1926. 迷宫中离入口最近的出口【中等】","link":"/TNotes.leetcode/1926. 迷宫中离入口最近的出口【中等】/README"},{"text":"⏰ 1927. 求和游戏【中等】","link":"/TNotes.leetcode/1927. 求和游戏【中等】/README"},{"text":"⏰ 1928. 规定时间内到达终点的最小花费【困难】","link":"/TNotes.leetcode/1928. 规定时间内到达终点的最小花费【困难】/README"},{"text":"⏰ 1929. 数组串联【简单】","link":"/TNotes.leetcode/1929. 数组串联【简单】/README"},{"text":"⏰ 1930. 长度为 3 的不同回文子序列【中等】","link":"/TNotes.leetcode/1930. 长度为 3 的不同回文子序列【中等】/README"},{"text":"⏰ 1931. 用三种不同颜色为网格涂色【困难】","link":"/TNotes.leetcode/1931. 用三种不同颜色为网格涂色【困难】/README"},{"text":"⏰ 1932. 合并多棵二叉搜索树【困难】","link":"/TNotes.leetcode/1932. 合并多棵二叉搜索树【困难】/README"},{"text":"⏰ 1933. 判断字符串是否可分解为值均等的子串【简单】","link":"/TNotes.leetcode/1933. 判断字符串是否可分解为值均等的子串【简单】/README"},{"text":"⏰ 1934. 确认率【中等】","link":"/TNotes.leetcode/1934. 确认率【中等】/README"},{"text":"⏰ 1935. 可以输入的最大单词数【简单】","link":"/TNotes.leetcode/1935. 可以输入的最大单词数【简单】/README"},{"text":"⏰ 1936. 新增的最少台阶数【中等】","link":"/TNotes.leetcode/1936. 新增的最少台阶数【中等】/README"},{"text":"⏰ 1937. 扣分后的最大得分【中等】","link":"/TNotes.leetcode/1937. 扣分后的最大得分【中等】/README"},{"text":"⏰ 1938. 查询最大基因差【困难】","link":"/TNotes.leetcode/1938. 查询最大基因差【困难】/README"},{"text":"⏰ 1939. 主动请求确认消息的用户【简单】","link":"/TNotes.leetcode/1939. 主动请求确认消息的用户【简单】/README"},{"text":"⏰ 1940. 排序数组之间的最长公共子序列【中等】","link":"/TNotes.leetcode/1940. 排序数组之间的最长公共子序列【中等】/README"},{"text":"⏰ 1941. 检查是否所有字符出现次数相同【简单】","link":"/TNotes.leetcode/1941. 检查是否所有字符出现次数相同【简单】/README"},{"text":"⏰ 1942. 最小未被占据椅子的编号【中等】","link":"/TNotes.leetcode/1942. 最小未被占据椅子的编号【中等】/README"},{"text":"⏰ 1943. 描述绘画结果【中等】","link":"/TNotes.leetcode/1943. 描述绘画结果【中等】/README"},{"text":"⏰ 1944. 队列中可以看到的人数【困难】","link":"/TNotes.leetcode/1944. 队列中可以看到的人数【困难】/README"},{"text":"⏰ 1945. 字符串转化后的各位数字之和【简单】","link":"/TNotes.leetcode/1945. 字符串转化后的各位数字之和【简单】/README"},{"text":"⏰ 1946. 子字符串突变后可能得到的最大整数【中等】","link":"/TNotes.leetcode/1946. 子字符串突变后可能得到的最大整数【中等】/README"},{"text":"⏰ 1947. 最大兼容性评分和【中等】","link":"/TNotes.leetcode/1947. 最大兼容性评分和【中等】/README"},{"text":"⏰ 1948. 删除系统中的重复文件夹【困难】","link":"/TNotes.leetcode/1948. 删除系统中的重复文件夹【困难】/README"},{"text":"⏰ 1949. 坚定的友谊【中等】","link":"/TNotes.leetcode/1949. 坚定的友谊【中等】/README"},{"text":"⏰ 1950. 所有子数组最小值中的最大值【中等】","link":"/TNotes.leetcode/1950. 所有子数组最小值中的最大值【中等】/README"},{"text":"⏰ 1951. 查询具有最多共同关注者的所有两两结对组【中等】","link":"/TNotes.leetcode/1951. 查询具有最多共同关注者的所有两两结对组【中等】/README"},{"text":"⏰ 1952. 三除数【简单】","link":"/TNotes.leetcode/1952. 三除数【简单】/README"},{"text":"⏰ 1953. 你可以工作的最大周数【中等】","link":"/TNotes.leetcode/1953. 你可以工作的最大周数【中等】/README"},{"text":"⏰ 1954. 收集足够苹果的最小花园周长【中等】","link":"/TNotes.leetcode/1954. 收集足够苹果的最小花园周长【中等】/README"},{"text":"⏰ 1955. 统计特殊子序列的数目【困难】","link":"/TNotes.leetcode/1955. 统计特殊子序列的数目【困难】/README"},{"text":"⏰ 1956. 感染 K 种病毒所需的最短时间【困难】","link":"/TNotes.leetcode/1956. 感染 K 种病毒所需的最短时间【困难】/README"},{"text":"⏰ 1957. 删除字符使字符串变好【简单】","link":"/TNotes.leetcode/1957. 删除字符使字符串变好【简单】/README"},{"text":"⏰ 1958. 检查操作是否合法【中等】","link":"/TNotes.leetcode/1958. 检查操作是否合法【中等】/README"},{"text":"⏰ 1959. K 次调整数组大小浪费的最小总空间【中等】","link":"/TNotes.leetcode/1959. K 次调整数组大小浪费的最小总空间【中等】/README"},{"text":"⏰ 1960. 两个回文子字符串长度的最大乘积【困难】","link":"/TNotes.leetcode/1960. 两个回文子字符串长度的最大乘积【困难】/README"},{"text":"⏰ 1961. 检查字符串是否为数组前缀【简单】","link":"/TNotes.leetcode/1961. 检查字符串是否为数组前缀【简单】/README"},{"text":"⏰ 1962. 移除石子使总数最小【中等】","link":"/TNotes.leetcode/1962. 移除石子使总数最小【中等】/README"},{"text":"⏰ 1963. 使字符串平衡的最小交换次数【中等】","link":"/TNotes.leetcode/1963. 使字符串平衡的最小交换次数【中等】/README"},{"text":"⏰ 1964. 找出到每个位置为止最长的有效障碍赛跑路线【困难】","link":"/TNotes.leetcode/1964. 找出到每个位置为止最长的有效障碍赛跑路线【困难】/README"},{"text":"⏰ 1965. 丢失信息的雇员【简单】","link":"/TNotes.leetcode/1965. 丢失信息的雇员【简单】/README"},{"text":"⏰ 1966. 未排序数组中的可被二分搜索的数【中等】","link":"/TNotes.leetcode/1966. 未排序数组中的可被二分搜索的数【中等】/README"},{"text":"⏰ 1967. 作为子字符串出现在单词中的字符串数目【简单】","link":"/TNotes.leetcode/1967. 作为子字符串出现在单词中的字符串数目【简单】/README"},{"text":"⏰ 1968. 构造元素不等于两相邻元素平均值的数组【中等】","link":"/TNotes.leetcode/1968. 构造元素不等于两相邻元素平均值的数组【中等】/README"},{"text":"⏰ 1969. 数组元素的最小非零乘积【中等】","link":"/TNotes.leetcode/1969. 数组元素的最小非零乘积【中等】/README"},{"text":"⏰ 1970. 你能穿过矩阵的最后一天【困难】","link":"/TNotes.leetcode/1970. 你能穿过矩阵的最后一天【困难】/README"},{"text":"⏰ 1971. 寻找图中是否存在路径【简单】","link":"/TNotes.leetcode/1971. 寻找图中是否存在路径【简单】/README"},{"text":"⏰ 1972. 同一天的第一个电话和最后一个电话【困难】","link":"/TNotes.leetcode/1972. 同一天的第一个电话和最后一个电话【困难】/README"},{"text":"⏰ 1973. 值等于子节点值之和的节点数量【中等】","link":"/TNotes.leetcode/1973. 值等于子节点值之和的节点数量【中等】/README"},{"text":"⏰ 1974. 使用特殊打字机键入单词的最少时间【简单】","link":"/TNotes.leetcode/1974. 使用特殊打字机键入单词的最少时间【简单】/README"},{"text":"⏰ 1975. 最大方阵和【中等】","link":"/TNotes.leetcode/1975. 最大方阵和【中等】/README"},{"text":"⏰ 1976. 到达目的地的方案数【中等】","link":"/TNotes.leetcode/1976. 到达目的地的方案数【中等】/README"},{"text":"⏰ 1977. 划分数字的方案数【困难】","link":"/TNotes.leetcode/1977. 划分数字的方案数【困难】/README"},{"text":"⏰ 1978. 上级经理已离职的公司员工【简单】","link":"/TNotes.leetcode/1978. 上级经理已离职的公司员工【简单】/README"},{"text":"⏰ 1979. 找出数组的最大公约数【简单】","link":"/TNotes.leetcode/1979. 找出数组的最大公约数【简单】/README"},{"text":"⏰ 1980. 找出不同的二进制字符串【中等】","link":"/TNotes.leetcode/1980. 找出不同的二进制字符串【中等】/README"},{"text":"⏰ 1981. 最小化目标值与所选元素的差【中等】","link":"/TNotes.leetcode/1981. 最小化目标值与所选元素的差【中等】/README"},{"text":"⏰ 1982. 从子集的和还原数组【困难】","link":"/TNotes.leetcode/1982. 从子集的和还原数组【困难】/README"},{"text":"⏰ 1983. 范围和相等的最宽索引对【中等】","link":"/TNotes.leetcode/1983. 范围和相等的最宽索引对【中等】/README"},{"text":"⏰ 1984. 学生分数的最小差值【简单】","link":"/TNotes.leetcode/1984. 学生分数的最小差值【简单】/README"},{"text":"⏰ 1985. 找出数组中的第 K 大整数【中等】","link":"/TNotes.leetcode/1985. 找出数组中的第 K 大整数【中等】/README"},{"text":"⏰ 1986. 完成任务的最少工作时间段【中等】","link":"/TNotes.leetcode/1986. 完成任务的最少工作时间段【中等】/README"},{"text":"⏰ 1987. 不同的好子序列数目【困难】","link":"/TNotes.leetcode/1987. 不同的好子序列数目【困难】/README"},{"text":"⏰ 1988. 找出每所学校的最低分数要求【中等】","link":"/TNotes.leetcode/1988. 找出每所学校的最低分数要求【中等】/README"},{"text":"⏰ 1989. 捉迷藏中可捕获的最大人数【中等】","link":"/TNotes.leetcode/1989. 捉迷藏中可捕获的最大人数【中等】/README"},{"text":"⏰ 1990. 统计实验的数量【中等】","link":"/TNotes.leetcode/1990. 统计实验的数量【中等】/README"},{"text":"⏰ 1991. 找到数组的中间位置【简单】","link":"/TNotes.leetcode/1991. 找到数组的中间位置【简单】/README"},{"text":"⏰ 1992. 找到所有的农场组【中等】","link":"/TNotes.leetcode/1992. 找到所有的农场组【中等】/README"},{"text":"⏰ 1993. 树上的操作【中等】","link":"/TNotes.leetcode/1993. 树上的操作【中等】/README"},{"text":"⏰ 1994. 好子集的数目【困难】","link":"/TNotes.leetcode/1994. 好子集的数目【困难】/README"},{"text":"⏰ 1995. 统计特殊四元组【简单】","link":"/TNotes.leetcode/1995. 统计特殊四元组【简单】/README"},{"text":"⏰ 1996. 游戏中弱角色的数量【中等】","link":"/TNotes.leetcode/1996. 游戏中弱角色的数量【中等】/README"},{"text":"⏰ 1997. 访问完所有房间的第一天【中等】","link":"/TNotes.leetcode/1997. 访问完所有房间的第一天【中等】/README"},{"text":"⏰ 1998. 数组的最大公因数排序【困难】","link":"/TNotes.leetcode/1998. 数组的最大公因数排序【困难】/README"},{"text":"⏰ 1999. 最小的仅由两个数组成的倍数【中等】","link":"/TNotes.leetcode/1999. 最小的仅由两个数组成的倍数【中等】/README"},{"text":"⏰ 2000. 反转单词前缀【简单】","link":"/TNotes.leetcode/2000. 反转单词前缀【简单】/README"},{"text":"⏰ 2001. 可互换矩形的组数【中等】","link":"/TNotes.leetcode/2001. 可互换矩形的组数【中等】/README"},{"text":"⏰ 2002. 两个回文子序列长度的最大乘积【中等】","link":"/TNotes.leetcode/2002. 两个回文子序列长度的最大乘积【中等】/README"},{"text":"⏰ 2003. 每棵子树内缺失的最小基因值【困难】","link":"/TNotes.leetcode/2003. 每棵子树内缺失的最小基因值【困难】/README"},{"text":"⏰ 2004. 职员招聘人数【困难】","link":"/TNotes.leetcode/2004. 职员招聘人数【困难】/README"},{"text":"⏰ 2005. 斐波那契树的移除子树游戏【困难】","link":"/TNotes.leetcode/2005. 斐波那契树的移除子树游戏【困难】/README"},{"text":"⏰ 2006. 差的绝对值为 K 的数对数目【简单】","link":"/TNotes.leetcode/2006. 差的绝对值为 K 的数对数目【简单】/README"},{"text":"⏰ 2007. 从双倍数组中还原原数组【中等】","link":"/TNotes.leetcode/2007. 从双倍数组中还原原数组【中等】/README"},{"text":"⏰ 2008. 出租车的最大盈利【中等】","link":"/TNotes.leetcode/2008. 出租车的最大盈利【中等】/README"},{"text":"⏰ 2009. 使数组连续的最少操作数【困难】","link":"/TNotes.leetcode/2009. 使数组连续的最少操作数【困难】/README"},{"text":"⏰ 2010. 职员招聘人数 II【困难】","link":"/TNotes.leetcode/2010. 职员招聘人数 II【困难】/README"},{"text":"⏰ 2011. 执行操作后的变量值【简单】","link":"/TNotes.leetcode/2011. 执行操作后的变量值【简单】/README"},{"text":"⏰ 2012. 数组美丽值求和【中等】","link":"/TNotes.leetcode/2012. 数组美丽值求和【中等】/README"},{"text":"⏰ 2013. 检测正方形【中等】","link":"/TNotes.leetcode/2013. 检测正方形【中等】/README"},{"text":"⏰ 2014. 重复 K 次的最长子序列【困难】","link":"/TNotes.leetcode/2014. 重复 K 次的最长子序列【困难】/README"},{"text":"⏰ 2015. 每段建筑物的平均高度【中等】","link":"/TNotes.leetcode/2015. 每段建筑物的平均高度【中等】/README"},{"text":"⏰ 2016. 增量元素之间的最大差值【简单】","link":"/TNotes.leetcode/2016. 增量元素之间的最大差值【简单】/README"},{"text":"⏰ 2017. 网格游戏【中等】","link":"/TNotes.leetcode/2017. 网格游戏【中等】/README"},{"text":"⏰ 2018. 判断单词是否能放入填字游戏内【中等】","link":"/TNotes.leetcode/2018. 判断单词是否能放入填字游戏内【中等】/README"},{"text":"⏰ 2019. 解出数学表达式的学生分数【困难】","link":"/TNotes.leetcode/2019. 解出数学表达式的学生分数【困难】/README"},{"text":"⏰ 2020. 无流量的帐户数【中等】","link":"/TNotes.leetcode/2020. 无流量的帐户数【中等】/README"},{"text":"⏰ 2021. 街上最亮的位置【中等】","link":"/TNotes.leetcode/2021. 街上最亮的位置【中等】/README"},{"text":"⏰ 2022. 将一维数组转变成二维数组【简单】","link":"/TNotes.leetcode/2022. 将一维数组转变成二维数组【简单】/README"},{"text":"⏰ 2023. 连接后等于目标字符串的字符串对【中等】","link":"/TNotes.leetcode/2023. 连接后等于目标字符串的字符串对【中等】/README"},{"text":"⏰ 2024. 考试的最大困扰度【中等】","link":"/TNotes.leetcode/2024. 考试的最大困扰度【中等】/README"},{"text":"⏰ 2025. 分割数组的最多方案数【困难】","link":"/TNotes.leetcode/2025. 分割数组的最多方案数【困难】/README"},{"text":"⏰ 2026. 低质量的问题【简单】","link":"/TNotes.leetcode/2026. 低质量的问题【简单】/README"},{"text":"⏰ 2027. 转换字符串的最少操作次数【简单】","link":"/TNotes.leetcode/2027. 转换字符串的最少操作次数【简单】/README"},{"text":"⏰ 2028. 找出缺失的观测数据【中等】","link":"/TNotes.leetcode/2028. 找出缺失的观测数据【中等】/README"},{"text":"⏰ 2029. 石子游戏 IX【中等】","link":"/TNotes.leetcode/2029. 石子游戏 IX【中等】/README"},{"text":"⏰ 2030. 含特定字母的最小子序列【困难】","link":"/TNotes.leetcode/2030. 含特定字母的最小子序列【困难】/README"},{"text":"⏰ 2031. 1 比 0 多的子数组个数【中等】","link":"/TNotes.leetcode/2031. 1 比 0 多的子数组个数【中等】/README"},{"text":"⏰ 2032. 至少在两个数组中出现的值【简单】","link":"/TNotes.leetcode/2032. 至少在两个数组中出现的值【简单】/README"},{"text":"⏰ 2033. 获取单值网格的最小操作数【中等】","link":"/TNotes.leetcode/2033. 获取单值网格的最小操作数【中等】/README"},{"text":"⏰ 2034. 股票价格波动【中等】","link":"/TNotes.leetcode/2034. 股票价格波动【中等】/README"},{"text":"⏰ 2035. 将数组分成两个数组并最小化数组和的差【困难】","link":"/TNotes.leetcode/2035. 将数组分成两个数组并最小化数组和的差【困难】/README"},{"text":"⏰ 2036. 最大交替子数组和【中等】","link":"/TNotes.leetcode/2036. 最大交替子数组和【中等】/README"},{"text":"⏰ 2037. 使每位学生都有座位的最少移动次数【简单】","link":"/TNotes.leetcode/2037. 使每位学生都有座位的最少移动次数【简单】/README"},{"text":"⏰ 2038. 如果相邻两个颜色均相同则删除当前颜色【中等】","link":"/TNotes.leetcode/2038. 如果相邻两个颜色均相同则删除当前颜色【中等】/README"},{"text":"⏰ 2039. 网络空闲的时刻【中等】","link":"/TNotes.leetcode/2039. 网络空闲的时刻【中等】/README"},{"text":"⏰ 2040. 两个有序数组的第 K 小乘积【困难】","link":"/TNotes.leetcode/2040. 两个有序数组的第 K 小乘积【困难】/README"},{"text":"⏰ 2041. 面试中被录取的候选人【中等】","link":"/TNotes.leetcode/2041. 面试中被录取的候选人【中等】/README"},{"text":"⏰ 2042. 检查句子中的数字是否递增【简单】","link":"/TNotes.leetcode/2042. 检查句子中的数字是否递增【简单】/README"},{"text":"⏰ 2043. 简易银行系统【中等】","link":"/TNotes.leetcode/2043. 简易银行系统【中等】/README"},{"text":"⏰ 2044. 统计按位或能得到最大值的子集数目【中等】","link":"/TNotes.leetcode/2044. 统计按位或能得到最大值的子集数目【中等】/README"},{"text":"⏰ 2045. 到达目的地的第二短时间【困难】","link":"/TNotes.leetcode/2045. 到达目的地的第二短时间【困难】/README"},{"text":"⏰ 2046. 给按照绝对值排序的链表排序【中等】","link":"/TNotes.leetcode/2046. 给按照绝对值排序的链表排序【中等】/README"},{"text":"⏰ 2047. 句子中的有效单词数【简单】","link":"/TNotes.leetcode/2047. 句子中的有效单词数【简单】/README"},{"text":"⏰ 2048. 下一个更大的数值平衡数【中等】","link":"/TNotes.leetcode/2048. 下一个更大的数值平衡数【中等】/README"},{"text":"⏰ 2049. 统计最高分的节点数目【中等】","link":"/TNotes.leetcode/2049. 统计最高分的节点数目【中等】/README"},{"text":"⏰ 2050. 并行课程 III【困难】","link":"/TNotes.leetcode/2050. 并行课程 III【困难】/README"},{"text":"⏰ 2051. 商店中每个成员的级别【中等】","link":"/TNotes.leetcode/2051. 商店中每个成员的级别【中等】/README"},{"text":"⏰ 2052. 将句子分隔成行的最低成本【中等】","link":"/TNotes.leetcode/2052. 将句子分隔成行的最低成本【中等】/README"},{"text":"⏰ 2053. 数组中第 K 个独一无二的字符串【简单】","link":"/TNotes.leetcode/2053. 数组中第 K 个独一无二的字符串【简单】/README"},{"text":"⏰ 2054. 两个最好的不重叠活动【中等】","link":"/TNotes.leetcode/2054. 两个最好的不重叠活动【中等】/README"},{"text":"⏰ 2055. 蜡烛之间的盘子【中等】","link":"/TNotes.leetcode/2055. 蜡烛之间的盘子【中等】/README"},{"text":"⏰ 2056. 棋盘上有效移动组合的数目【困难】","link":"/TNotes.leetcode/2056. 棋盘上有效移动组合的数目【困难】/README"},{"text":"⏰ 2057. 值相等的最小索引【简单】","link":"/TNotes.leetcode/2057. 值相等的最小索引【简单】/README"},{"text":"⏰ 2058. 找出临界点之间的最小和最大距离【中等】","link":"/TNotes.leetcode/2058. 找出临界点之间的最小和最大距离【中等】/README"},{"text":"⏰ 2059. 转化数字的最小运算数【中等】","link":"/TNotes.leetcode/2059. 转化数字的最小运算数【中等】/README"},{"text":"⏰ 2060. 同源字符串检测【困难】","link":"/TNotes.leetcode/2060. 同源字符串检测【困难】/README"},{"text":"⏰ 2061. 扫地机器人清扫过的空间个数【中等】","link":"/TNotes.leetcode/2061. 扫地机器人清扫过的空间个数【中等】/README"},{"text":"⏰ 2062. 统计字符串中的元音子字符串【简单】","link":"/TNotes.leetcode/2062. 统计字符串中的元音子字符串【简单】/README"},{"text":"⏰ 2063. 所有子字符串中的元音【中等】","link":"/TNotes.leetcode/2063. 所有子字符串中的元音【中等】/README"},{"text":"⏰ 2064. 分配给商店的最多商品的最小值【中等】","link":"/TNotes.leetcode/2064. 分配给商店的最多商品的最小值【中等】/README"},{"text":"⏰ 2065. 最大化一张图中的路径价值【困难】","link":"/TNotes.leetcode/2065. 最大化一张图中的路径价值【困难】/README"},{"text":"⏰ 2066. 账户余额【中等】","link":"/TNotes.leetcode/2066. 账户余额【中等】/README"},{"text":"⏰ 2067. 等计数子串的数量【中等】","link":"/TNotes.leetcode/2067. 等计数子串的数量【中等】/README"},{"text":"⏰ 2068. 检查两个字符串是否几乎相等【简单】","link":"/TNotes.leetcode/2068. 检查两个字符串是否几乎相等【简单】/README"},{"text":"⏰ 2069. 模拟行走机器人 II【中等】","link":"/TNotes.leetcode/2069. 模拟行走机器人 II【中等】/README"},{"text":"⏰ 2070. 每一个查询的最大美丽值【中等】","link":"/TNotes.leetcode/2070. 每一个查询的最大美丽值【中等】/README"},{"text":"⏰ 2071. 你可以安排的最多任务数目【困难】","link":"/TNotes.leetcode/2071. 你可以安排的最多任务数目【困难】/README"},{"text":"⏰ 2072. 赢得比赛的大学【简单】","link":"/TNotes.leetcode/2072. 赢得比赛的大学【简单】/README"},{"text":"⏰ 2073. 买票需要的时间【简单】","link":"/TNotes.leetcode/2073. 买票需要的时间【简单】/README"},{"text":"⏰ 2074. 反转偶数长度组的节点【中等】","link":"/TNotes.leetcode/2074. 反转偶数长度组的节点【中等】/README"},{"text":"⏰ 2075. 解码斜向换位密码【中等】","link":"/TNotes.leetcode/2075. 解码斜向换位密码【中等】/README"},{"text":"⏰ 2076. 处理含限制条件的好友请求【困难】","link":"/TNotes.leetcode/2076. 处理含限制条件的好友请求【困难】/README"},{"text":"⏰ 2077. 殊途同归【中等】","link":"/TNotes.leetcode/2077. 殊途同归【中等】/README"},{"text":"⏰ 2078. 两栋颜色不同且距离最远的房子【简单】","link":"/TNotes.leetcode/2078. 两栋颜色不同且距离最远的房子【简单】/README"},{"text":"⏰ 2079. 给植物浇水【中等】","link":"/TNotes.leetcode/2079. 给植物浇水【中等】/README"},{"text":"⏰ 2080. 区间内查询数字的频率【中等】","link":"/TNotes.leetcode/2080. 区间内查询数字的频率【中等】/README"},{"text":"⏰ 2081. k 镜像数字的和【困难】","link":"/TNotes.leetcode/2081. k 镜像数字的和【困难】/README"},{"text":"⏰ 2082. 富有客户的数量【简单】","link":"/TNotes.leetcode/2082. 富有客户的数量【简单】/README"},{"text":"⏰ 2083. 求以相同字母开头和结尾的子串总数【中等】","link":"/TNotes.leetcode/2083. 求以相同字母开头和结尾的子串总数【中等】/README"},{"text":"⏰ 2084. 为订单类型为 0 的客户删除类型为 1 的订单【中等】","link":"/TNotes.leetcode/2084. 为订单类型为 0 的客户删除类型为 1 的订单【中等】/README"},{"text":"⏰ 2085. 统计出现过一次的公共字符串【简单】","link":"/TNotes.leetcode/2085. 统计出现过一次的公共字符串【简单】/README"},{"text":"⏰ 2086. 喂食仓鼠的最小食物桶数【中等】","link":"/TNotes.leetcode/2086. 喂食仓鼠的最小食物桶数【中等】/README"},{"text":"⏰ 2087. 网格图中机器人回家的最小代价【中等】","link":"/TNotes.leetcode/2087. 网格图中机器人回家的最小代价【中等】/README"},{"text":"⏰ 2088. 统计农场中肥沃金字塔的数目【困难】","link":"/TNotes.leetcode/2088. 统计农场中肥沃金字塔的数目【困难】/README"},{"text":"⏰ 2089. 找出数组排序后的目标下标【简单】","link":"/TNotes.leetcode/2089. 找出数组排序后的目标下标【简单】/README"},{"text":"⏰ 2090. 半径为 k 的子数组平均值【中等】","link":"/TNotes.leetcode/2090. 半径为 k 的子数组平均值【中等】/README"},{"text":"⏰ 2091. 从数组中移除最大值和最小值【中等】","link":"/TNotes.leetcode/2091. 从数组中移除最大值和最小值【中等】/README"},{"text":"⏰ 2092. 找出知晓秘密的所有专家【困难】","link":"/TNotes.leetcode/2092. 找出知晓秘密的所有专家【困难】/README"},{"text":"⏰ 2093. 前往目标城市的最小费用【中等】","link":"/TNotes.leetcode/2093. 前往目标城市的最小费用【中等】/README"},{"text":"⏰ 2094. 找出 3 位偶数【简单】","link":"/TNotes.leetcode/2094. 找出 3 位偶数【简单】/README"},{"text":"⏰ 2095. 删除链表的中间节点【中等】","link":"/TNotes.leetcode/2095. 删除链表的中间节点【中等】/README"},{"text":"⏰ 2096. 从二叉树一个节点到另一个节点每一步的方向【中等】","link":"/TNotes.leetcode/2096. 从二叉树一个节点到另一个节点每一步的方向【中等】/README"},{"text":"⏰ 2097. 合法重新排列数对【困难】","link":"/TNotes.leetcode/2097. 合法重新排列数对【困难】/README"},{"text":"⏰ 2098. 长度为 K 的最大偶数和子序列【中等】","link":"/TNotes.leetcode/2098. 长度为 K 的最大偶数和子序列【中等】/README"},{"text":"⏰ 2099. 找到和最大的长度为 K 的子序列【简单】","link":"/TNotes.leetcode/2099. 找到和最大的长度为 K 的子序列【简单】/README"},{"text":"⏰ 2100. 适合野炊的日子【中等】","link":"/TNotes.leetcode/2100. 适合野炊的日子【中等】/README"},{"text":"⏰ 2101. 引爆最多的炸弹【中等】","link":"/TNotes.leetcode/2101. 引爆最多的炸弹【中等】/README"},{"text":"⏰ 2102. 序列顺序查询【困难】","link":"/TNotes.leetcode/2102. 序列顺序查询【困难】/README"},{"text":"⏰ 2103. 环和杆【简单】","link":"/TNotes.leetcode/2103. 环和杆【简单】/README"},{"text":"⏰ 2104. 子数组范围和【中等】","link":"/TNotes.leetcode/2104. 子数组范围和【中等】/README"},{"text":"⏰ 2105. 给植物浇水 II【中等】","link":"/TNotes.leetcode/2105. 给植物浇水 II【中等】/README"},{"text":"⏰ 2106. 摘水果【困难】","link":"/TNotes.leetcode/2106. 摘水果【困难】/README"},{"text":"⏰ 2107. 分享 K 个糖果后独特口味的数量【中等】","link":"/TNotes.leetcode/2107. 分享 K 个糖果后独特口味的数量【中等】/README"},{"text":"⏰ 2108. 找出数组中的第一个回文字符串【简单】","link":"/TNotes.leetcode/2108. 找出数组中的第一个回文字符串【简单】/README"},{"text":"⏰ 2109. 向字符串添加空格【中等】","link":"/TNotes.leetcode/2109. 向字符串添加空格【中等】/README"},{"text":"⏰ 2110. 股票平滑下跌阶段的数目【中等】","link":"/TNotes.leetcode/2110. 股票平滑下跌阶段的数目【中等】/README"},{"text":"⏰ 2111. 使数组 K 递增的最少操作次数【困难】","link":"/TNotes.leetcode/2111. 使数组 K 递增的最少操作次数【困难】/README"},{"text":"⏰ 2112. 最繁忙的机场【中等】","link":"/TNotes.leetcode/2112. 最繁忙的机场【中等】/README"},{"text":"⏰ 2113. 查询删除和添加元素后的数组【中等】","link":"/TNotes.leetcode/2113. 查询删除和添加元素后的数组【中等】/README"},{"text":"⏰ 2114. 句子中的最多单词数【简单】","link":"/TNotes.leetcode/2114. 句子中的最多单词数【简单】/README"},{"text":"⏰ 2115. 从给定原材料中找到所有可以做出的菜【中等】","link":"/TNotes.leetcode/2115. 从给定原材料中找到所有可以做出的菜【中等】/README"},{"text":"⏰ 2116. 判断一个括号字符串是否有效【中等】","link":"/TNotes.leetcode/2116. 判断一个括号字符串是否有效【中等】/README"},{"text":"⏰ 2117. 一个区间内所有数乘积的缩写【困难】","link":"/TNotes.leetcode/2117. 一个区间内所有数乘积的缩写【困难】/README"},{"text":"⏰ 2118. 建立方程【困难】","link":"/TNotes.leetcode/2118. 建立方程【困难】/README"},{"text":"⏰ 2119. 反转两次的数字【简单】","link":"/TNotes.leetcode/2119. 反转两次的数字【简单】/README"},{"text":"⏰ 2120. 执行所有后缀指令【中等】","link":"/TNotes.leetcode/2120. 执行所有后缀指令【中等】/README"},{"text":"⏰ 2121. 相同元素的间隔之和【中等】","link":"/TNotes.leetcode/2121. 相同元素的间隔之和【中等】/README"},{"text":"⏰ 2122. 还原原数组【困难】","link":"/TNotes.leetcode/2122. 还原原数组【困难】/README"},{"text":"⏰ 2123. 使矩阵中的 1 互不相邻的最小操作数【困难】","link":"/TNotes.leetcode/2123. 使矩阵中的 1 互不相邻的最小操作数【困难】/README"},{"text":"⏰ 2124. 检查是否所有 A 都在 B 之前【简单】","link":"/TNotes.leetcode/2124. 检查是否所有 A 都在 B 之前【简单】/README"},{"text":"⏰ 2125. 银行中的激光束数量【中等】","link":"/TNotes.leetcode/2125. 银行中的激光束数量【中等】/README"},{"text":"⏰ 2126. 摧毁小行星【中等】","link":"/TNotes.leetcode/2126. 摧毁小行星【中等】/README"},{"text":"⏰ 2127. 参加会议的最多员工数【困难】","link":"/TNotes.leetcode/2127. 参加会议的最多员工数【困难】/README"},{"text":"⏰ 2128. 通过翻转行或列来去除所有的 1【中等】","link":"/TNotes.leetcode/2128. 通过翻转行或列来去除所有的 1【中等】/README"},{"text":"⏰ 2129. 将标题首字母大写【简单】","link":"/TNotes.leetcode/2129. 将标题首字母大写【简单】/README"},{"text":"⏰ 2130. 链表最大孪生和【中等】","link":"/TNotes.leetcode/2130. 链表最大孪生和【中等】/README"},{"text":"⏰ 2131. 连接两字母单词得到的最长回文串【中等】","link":"/TNotes.leetcode/2131. 连接两字母单词得到的最长回文串【中等】/README"},{"text":"⏰ 2132. 用邮票贴满网格图【困难】","link":"/TNotes.leetcode/2132. 用邮票贴满网格图【困难】/README"},{"text":"⏰ 2133. 检查是否每一行每一列都包含全部整数【简单】","link":"/TNotes.leetcode/2133. 检查是否每一行每一列都包含全部整数【简单】/README"},{"text":"⏰ 2134. 最少交换次数来组合所有的 1 II【中等】","link":"/TNotes.leetcode/2134. 最少交换次数来组合所有的 1 II【中等】/README"},{"text":"⏰ 2135. 统计追加字母可以获得的单词数【中等】","link":"/TNotes.leetcode/2135. 统计追加字母可以获得的单词数【中等】/README"},{"text":"⏰ 2136. 全部开花的最早一天【困难】","link":"/TNotes.leetcode/2136. 全部开花的最早一天【困难】/README"},{"text":"⏰ 2137. 通过倒水操作让所有的水桶所含水量相等【中等】","link":"/TNotes.leetcode/2137. 通过倒水操作让所有的水桶所含水量相等【中等】/README"},{"text":"⏰ 2138. 将字符串拆分为若干长度为 k 的组【简单】","link":"/TNotes.leetcode/2138. 将字符串拆分为若干长度为 k 的组【简单】/README"},{"text":"⏰ 2139. 得到目标值的最少行动次数【中等】","link":"/TNotes.leetcode/2139. 得到目标值的最少行动次数【中等】/README"},{"text":"⏰ 2140. 解决智力问题【中等】","link":"/TNotes.leetcode/2140. 解决智力问题【中等】/README"},{"text":"⏰ 2141. 同时运行 N 台电脑的最长时间【困难】","link":"/TNotes.leetcode/2141. 同时运行 N 台电脑的最长时间【困难】/README"},{"text":"⏰ 2142. 每辆车的乘客人数 I【中等】","link":"/TNotes.leetcode/2142. 每辆车的乘客人数 I【中等】/README"},{"text":"⏰ 2143. 在两个数组的区间中选取数字【困难】","link":"/TNotes.leetcode/2143. 在两个数组的区间中选取数字【困难】/README"},{"text":"⏰ 2144. 打折购买糖果的最小开销【简单】","link":"/TNotes.leetcode/2144. 打折购买糖果的最小开销【简单】/README"},{"text":"⏰ 2145. 统计隐藏数组数目【中等】","link":"/TNotes.leetcode/2145. 统计隐藏数组数目【中等】/README"},{"text":"⏰ 2146. 价格范围内最高排名的 K 样物品【中等】","link":"/TNotes.leetcode/2146. 价格范围内最高排名的 K 样物品【中等】/README"},{"text":"⏰ 2147. 分隔长廊的方案数【困难】","link":"/TNotes.leetcode/2147. 分隔长廊的方案数【困难】/README"},{"text":"⏰ 2148. 元素计数【简单】","link":"/TNotes.leetcode/2148. 元素计数【简单】/README"},{"text":"⏰ 2149. 按符号重排数组【中等】","link":"/TNotes.leetcode/2149. 按符号重排数组【中等】/README"},{"text":"⏰ 2150. 找出数组中的所有孤独数字【中等】","link":"/TNotes.leetcode/2150. 找出数组中的所有孤独数字【中等】/README"},{"text":"⏰ 2151. 基于陈述统计最多好人数【困难】","link":"/TNotes.leetcode/2151. 基于陈述统计最多好人数【困难】/README"},{"text":"⏰ 2152. 穿过所有点的所需最少直线数量【中等】","link":"/TNotes.leetcode/2152. 穿过所有点的所需最少直线数量【中等】/README"},{"text":"⏰ 2153. 每辆车的乘客人数 II【困难】","link":"/TNotes.leetcode/2153. 每辆车的乘客人数 II【困难】/README"},{"text":"⏰ 2154. 将找到的值乘以 2【简单】","link":"/TNotes.leetcode/2154. 将找到的值乘以 2【简单】/README"},{"text":"⏰ 2155. 分组得分最高的所有下标【中等】","link":"/TNotes.leetcode/2155. 分组得分最高的所有下标【中等】/README"},{"text":"⏰ 2156. 查找给定哈希值的子串【困难】","link":"/TNotes.leetcode/2156. 查找给定哈希值的子串【困难】/README"},{"text":"⏰ 2157. 字符串分组【困难】","link":"/TNotes.leetcode/2157. 字符串分组【困难】/README"},{"text":"⏰ 2158. 每天绘制新区域的数量【困难】","link":"/TNotes.leetcode/2158. 每天绘制新区域的数量【困难】/README"},{"text":"⏰ 2159. 分别排序两列【中等】","link":"/TNotes.leetcode/2159. 分别排序两列【中等】/README"},{"text":"⏰ 2160. 拆分数位后四位数字的最小和【简单】","link":"/TNotes.leetcode/2160. 拆分数位后四位数字的最小和【简单】/README"},{"text":"⏰ 2161. 根据给定数字划分数组【中等】","link":"/TNotes.leetcode/2161. 根据给定数字划分数组【中等】/README"},{"text":"⏰ 2162. 设置时间的最少代价【中等】","link":"/TNotes.leetcode/2162. 设置时间的最少代价【中等】/README"},{"text":"⏰ 2163. 删除元素后和的最小差值【困难】","link":"/TNotes.leetcode/2163. 删除元素后和的最小差值【困难】/README"},{"text":"⏰ 2164. 对奇偶下标分别排序【简单】","link":"/TNotes.leetcode/2164. 对奇偶下标分别排序【简单】/README"},{"text":"⏰ 2165. 重排数字的最小值【中等】","link":"/TNotes.leetcode/2165. 重排数字的最小值【中等】/README"},{"text":"⏰ 2166. 设计位集【中等】","link":"/TNotes.leetcode/2166. 设计位集【中等】/README"},{"text":"⏰ 2167. 移除所有载有违禁货物车厢所需的最少时间【困难】","link":"/TNotes.leetcode/2167. 移除所有载有违禁货物车厢所需的最少时间【困难】/README"},{"text":"⏰ 2168. 每个数字的频率都相同的独特子字符串的数量【中等】","link":"/TNotes.leetcode/2168. 每个数字的频率都相同的独特子字符串的数量【中等】/README"},{"text":"⏰ 2169. 得到 0 的操作数【简单】","link":"/TNotes.leetcode/2169. 得到 0 的操作数【简单】/README"},{"text":"⏰ 2170. 使数组变成交替数组的最少操作数【中等】","link":"/TNotes.leetcode/2170. 使数组变成交替数组的最少操作数【中等】/README"},{"text":"⏰ 2171. 拿出最少数目的魔法豆【中等】","link":"/TNotes.leetcode/2171. 拿出最少数目的魔法豆【中等】/README"},{"text":"⏰ 2172. 数组的最大与和【困难】","link":"/TNotes.leetcode/2172. 数组的最大与和【困难】/README"},{"text":"⏰ 2173. 最多连胜的次数【困难】","link":"/TNotes.leetcode/2173. 最多连胜的次数【困难】/README"},{"text":"⏰ 2174. 通过翻转行或列来去除所有的 1 II【中等】","link":"/TNotes.leetcode/2174. 通过翻转行或列来去除所有的 1 II【中等】/README"},{"text":"⏰ 2175. 世界排名的变化【中等】","link":"/TNotes.leetcode/2175. 世界排名的变化【中等】/README"},{"text":"⏰ 2176. 统计数组中相等且可以被整除的数对【简单】","link":"/TNotes.leetcode/2176. 统计数组中相等且可以被整除的数对【简单】/README"},{"text":"⏰ 2177. 找到和为给定整数的三个连续整数【中等】","link":"/TNotes.leetcode/2177. 找到和为给定整数的三个连续整数【中等】/README"},{"text":"⏰ 2178. 拆分成最多数目的正偶数之和【中等】","link":"/TNotes.leetcode/2178. 拆分成最多数目的正偶数之和【中等】/README"},{"text":"⏰ 2179. 统计数组中好三元组数目【困难】","link":"/TNotes.leetcode/2179. 统计数组中好三元组数目【困难】/README"},{"text":"⏰ 2180. 统计各位数字之和为偶数的整数个数【简单】","link":"/TNotes.leetcode/2180. 统计各位数字之和为偶数的整数个数【简单】/README"},{"text":"⏰ 2181. 合并零之间的节点【中等】","link":"/TNotes.leetcode/2181. 合并零之间的节点【中等】/README"},{"text":"⏰ 2182. 构造限制重复的字符串【中等】","link":"/TNotes.leetcode/2182. 构造限制重复的字符串【中等】/README"},{"text":"⏰ 2183. 统计可以被 K 整除的下标对数目【困难】","link":"/TNotes.leetcode/2183. 统计可以被 K 整除的下标对数目【困难】/README"},{"text":"⏰ 2184. 建造坚实的砖墙的方法数【中等】","link":"/TNotes.leetcode/2184. 建造坚实的砖墙的方法数【中等】/README"},{"text":"⏰ 2185. 统计包含给定前缀的字符串【简单】","link":"/TNotes.leetcode/2185. 统计包含给定前缀的字符串【简单】/README"},{"text":"⏰ 2186. 制造字母异位词的最小步骤数 II【中等】","link":"/TNotes.leetcode/2186. 制造字母异位词的最小步骤数 II【中等】/README"},{"text":"⏰ 2187. 完成旅途的最少时间【中等】","link":"/TNotes.leetcode/2187. 完成旅途的最少时间【中等】/README"},{"text":"⏰ 2188. 完成比赛的最少时间【困难】","link":"/TNotes.leetcode/2188. 完成比赛的最少时间【困难】/README"},{"text":"⏰ 2189. 建造纸牌屋的方法数【中等】","link":"/TNotes.leetcode/2189. 建造纸牌屋的方法数【中等】/README"},{"text":"⏰ 2190. 数组中紧跟 key 之后出现最频繁的数字【简单】","link":"/TNotes.leetcode/2190. 数组中紧跟 key 之后出现最频繁的数字【简单】/README"},{"text":"⏰ 2191. 将杂乱无章的数字排序【中等】","link":"/TNotes.leetcode/2191. 将杂乱无章的数字排序【中等】/README"},{"text":"⏰ 2192. 有向无环图中一个节点的所有祖先【中等】","link":"/TNotes.leetcode/2192. 有向无环图中一个节点的所有祖先【中等】/README"},{"text":"⏰ 2193. 得到回文串的最少操作次数【困难】","link":"/TNotes.leetcode/2193. 得到回文串的最少操作次数【困难】/README"},{"text":"⏰ 2194. Excel 表中某个范围内的单元格【简单】","link":"/TNotes.leetcode/2194. Excel 表中某个范围内的单元格【简单】/README"},{"text":"⏰ 2195. 向数组中追加 K 个整数【中等】","link":"/TNotes.leetcode/2195. 向数组中追加 K 个整数【中等】/README"},{"text":"⏰ 2196. 根据描述创建二叉树【中等】","link":"/TNotes.leetcode/2196. 根据描述创建二叉树【中等】/README"},{"text":"⏰ 2197. 替换数组中的非互质数【困难】","link":"/TNotes.leetcode/2197. 替换数组中的非互质数【困难】/README"},{"text":"⏰ 2198. 单因数三元组【中等】","link":"/TNotes.leetcode/2198. 单因数三元组【中等】/README"},{"text":"⏰ 2199. 找到每篇文章的主题【困难】","link":"/TNotes.leetcode/2199. 找到每篇文章的主题【困难】/README"},{"text":"⏰ 2200. 找出数组中的所有 K 近邻下标【简单】","link":"/TNotes.leetcode/2200. 找出数组中的所有 K 近邻下标【简单】/README"},{"text":"⏰ 2201. 统计可以提取的工件【中等】","link":"/TNotes.leetcode/2201. 统计可以提取的工件【中等】/README"},{"text":"⏰ 2202. K 次操作后最大化顶端元素【中等】","link":"/TNotes.leetcode/2202. K 次操作后最大化顶端元素【中等】/README"},{"text":"⏰ 2203. 得到要求路径的最小带权子图【困难】","link":"/TNotes.leetcode/2203. 得到要求路径的最小带权子图【困难】/README"},{"text":"⏰ 2204. 无向图中到环的距离【困难】","link":"/TNotes.leetcode/2204. 无向图中到环的距离【困难】/README"},{"text":"⏰ 2205. 有资格享受折扣的用户数量【简单】","link":"/TNotes.leetcode/2205. 有资格享受折扣的用户数量【简单】/README"},{"text":"⏰ 2206. 将数组划分成相等数对【简单】","link":"/TNotes.leetcode/2206. 将数组划分成相等数对【简单】/README"},{"text":"⏰ 2207. 字符串中最多数目的子序列【中等】","link":"/TNotes.leetcode/2207. 字符串中最多数目的子序列【中等】/README"},{"text":"⏰ 2208. 将数组和减半的最少操作次数【中等】","link":"/TNotes.leetcode/2208. 将数组和减半的最少操作次数【中等】/README"},{"text":"⏰ 2209. 用地毯覆盖后的最少白色砖块【困难】","link":"/TNotes.leetcode/2209. 用地毯覆盖后的最少白色砖块【困难】/README"},{"text":"⏰ 2210. 统计数组中峰和谷的数量【简单】","link":"/TNotes.leetcode/2210. 统计数组中峰和谷的数量【简单】/README"},{"text":"⏰ 2211. 统计道路上的碰撞次数【中等】","link":"/TNotes.leetcode/2211. 统计道路上的碰撞次数【中等】/README"},{"text":"⏰ 2212. 射箭比赛中的最大得分【中等】","link":"/TNotes.leetcode/2212. 射箭比赛中的最大得分【中等】/README"},{"text":"⏰ 2213. 由单个字符重复的最长子字符串【困难】","link":"/TNotes.leetcode/2213. 由单个字符重复的最长子字符串【困难】/README"},{"text":"⏰ 2214. 通关游戏所需的最低生命值【中等】","link":"/TNotes.leetcode/2214. 通关游戏所需的最低生命值【中等】/README"},{"text":"⏰ 2215. 找出两数组的不同【简单】","link":"/TNotes.leetcode/2215. 找出两数组的不同【简单】/README"},{"text":"⏰ 2216. 美化数组的最少删除数【中等】","link":"/TNotes.leetcode/2216. 美化数组的最少删除数【中等】/README"},{"text":"⏰ 2217. 找到指定长度的回文数【中等】","link":"/TNotes.leetcode/2217. 找到指定长度的回文数【中等】/README"},{"text":"⏰ 2218. 从栈中取出 K 个硬币的最大面值和【困难】","link":"/TNotes.leetcode/2218. 从栈中取出 K 个硬币的最大面值和【困难】/README"},{"text":"⏰ 2219. 数组的最大总分【中等】","link":"/TNotes.leetcode/2219. 数组的最大总分【中等】/README"},{"text":"⏰ 2220. 转换数字的最少位翻转次数【简单】","link":"/TNotes.leetcode/2220. 转换数字的最少位翻转次数【简单】/README"},{"text":"⏰ 2221. 数组的三角和【中等】","link":"/TNotes.leetcode/2221. 数组的三角和【中等】/README"},{"text":"⏰ 2222. 选择建筑的方案数【中等】","link":"/TNotes.leetcode/2222. 选择建筑的方案数【中等】/README"},{"text":"⏰ 2223. 构造字符串的总得分和【困难】","link":"/TNotes.leetcode/2223. 构造字符串的总得分和【困难】/README"},{"text":"⏰ 2224. 转化时间需要的最少操作数【简单】","link":"/TNotes.leetcode/2224. 转化时间需要的最少操作数【简单】/README"},{"text":"⏰ 2225. 找出输掉零场或一场比赛的玩家【中等】","link":"/TNotes.leetcode/2225. 找出输掉零场或一场比赛的玩家【中等】/README"},{"text":"⏰ 2226. 每个小孩最多能分到多少糖果【中等】","link":"/TNotes.leetcode/2226. 每个小孩最多能分到多少糖果【中等】/README"},{"text":"⏰ 2227. 加密解密字符串【困难】","link":"/TNotes.leetcode/2227. 加密解密字符串【困难】/README"},{"text":"⏰ 2228. 7 天内两次购买的用户【中等】","link":"/TNotes.leetcode/2228. 7 天内两次购买的用户【中等】/README"},{"text":"⏰ 2229. 检查数组是否连贯【简单】","link":"/TNotes.leetcode/2229. 检查数组是否连贯【简单】/README"},{"text":"⏰ 2230. 查找可享受优惠的用户【简单】","link":"/TNotes.leetcode/2230. 查找可享受优惠的用户【简单】/README"},{"text":"⏰ 2231. 按奇偶性交换后的最大数字【简单】","link":"/TNotes.leetcode/2231. 按奇偶性交换后的最大数字【简单】/README"},{"text":"⏰ 2232. 向表达式添加括号后的最小结果【中等】","link":"/TNotes.leetcode/2232. 向表达式添加括号后的最小结果【中等】/README"},{"text":"⏰ 2233. K 次增加后的最大乘积【中等】","link":"/TNotes.leetcode/2233. K 次增加后的最大乘积【中等】/README"},{"text":"⏰ 2234. 花园的最大总美丽值【困难】","link":"/TNotes.leetcode/2234. 花园的最大总美丽值【困难】/README"},{"text":"⏰ 2235. 两整数相加【简单】","link":"/TNotes.leetcode/2235. 两整数相加【简单】/README"},{"text":"⏰ 2236. 判断根结点是否等于子结点之和【简单】","link":"/TNotes.leetcode/2236. 判断根结点是否等于子结点之和【简单】/README"},{"text":"⏰ 2237. 计算街道上满足所需亮度的位置数量【中等】","link":"/TNotes.leetcode/2237. 计算街道上满足所需亮度的位置数量【中等】/README"},{"text":"⏰ 2238. 司机成为乘客的次数【中等】","link":"/TNotes.leetcode/2238. 司机成为乘客的次数【中等】/README"},{"text":"⏰ 2239. 找到最接近 0 的数字【简单】","link":"/TNotes.leetcode/2239. 找到最接近 0 的数字【简单】/README"},{"text":"⏰ 2240. 买钢笔和铅笔的方案数【中等】","link":"/TNotes.leetcode/2240. 买钢笔和铅笔的方案数【中等】/README"},{"text":"⏰ 2241. 设计一个 ATM 机器【中等】","link":"/TNotes.leetcode/2241. 设计一个 ATM 机器【中等】/README"},{"text":"⏰ 2242. 节点序列的最大得分【困难】","link":"/TNotes.leetcode/2242. 节点序列的最大得分【困难】/README"},{"text":"⏰ 2243. 计算字符串的数字和【简单】","link":"/TNotes.leetcode/2243. 计算字符串的数字和【简单】/README"},{"text":"⏰ 2244. 完成所有任务需要的最少轮数【中等】","link":"/TNotes.leetcode/2244. 完成所有任务需要的最少轮数【中等】/README"},{"text":"⏰ 2245. 转角路径的乘积中最多能有几个尾随零【中等】","link":"/TNotes.leetcode/2245. 转角路径的乘积中最多能有几个尾随零【中等】/README"},{"text":"⏰ 2246. 相邻字符不同的最长路径【困难】","link":"/TNotes.leetcode/2246. 相邻字符不同的最长路径【困难】/README"},{"text":"⏰ 2247. K 条高速公路的最大旅行费用【困难】","link":"/TNotes.leetcode/2247. K 条高速公路的最大旅行费用【困难】/README"},{"text":"⏰ 2248. 多个数组求交集【简单】","link":"/TNotes.leetcode/2248. 多个数组求交集【简单】/README"},{"text":"⏰ 2249. 统计圆内格点数目【中等】","link":"/TNotes.leetcode/2249. 统计圆内格点数目【中等】/README"},{"text":"⏰ 2250. 统计包含每个点的矩形数目【中等】","link":"/TNotes.leetcode/2250. 统计包含每个点的矩形数目【中等】/README"},{"text":"⏰ 2251. 花期内花的数目【困难】","link":"/TNotes.leetcode/2251. 花期内花的数目【困难】/README"},{"text":"⏰ 2252. 表的动态旋转【困难】","link":"/TNotes.leetcode/2252. 表的动态旋转【困难】/README"},{"text":"⏰ 2253. 动态取消表的旋转【困难】","link":"/TNotes.leetcode/2253. 动态取消表的旋转【困难】/README"},{"text":"⏰ 2254. 设计视频共享平台【困难】","link":"/TNotes.leetcode/2254. 设计视频共享平台【困难】/README"},{"text":"⏰ 2255. 统计是给定字符串前缀的字符串数目【简单】","link":"/TNotes.leetcode/2255. 统计是给定字符串前缀的字符串数目【简单】/README"},{"text":"⏰ 2256. 最小平均差【中等】","link":"/TNotes.leetcode/2256. 最小平均差【中等】/README"},{"text":"⏰ 2257. 统计网格图中没有被保卫的格子数【中等】","link":"/TNotes.leetcode/2257. 统计网格图中没有被保卫的格子数【中等】/README"},{"text":"⏰ 2258. 逃离火灾【困难】","link":"/TNotes.leetcode/2258. 逃离火灾【困难】/README"},{"text":"⏰ 2259. 移除指定数字得到的最大结果【简单】","link":"/TNotes.leetcode/2259. 移除指定数字得到的最大结果【简单】/README"},{"text":"⏰ 2260. 必须拿起的最小连续卡牌数【中等】","link":"/TNotes.leetcode/2260. 必须拿起的最小连续卡牌数【中等】/README"},{"text":"⏰ 2261. 含最多 K 个可整除元素的子数组【中等】","link":"/TNotes.leetcode/2261. 含最多 K 个可整除元素的子数组【中等】/README"},{"text":"⏰ 2262. 字符串的总引力【困难】","link":"/TNotes.leetcode/2262. 字符串的总引力【困难】/README"},{"text":"⏰ 2263. 数组变为有序的最小操作次数【困难】","link":"/TNotes.leetcode/2263. 数组变为有序的最小操作次数【困难】/README"},{"text":"⏰ 2264. 字符串中最大的 3 位相同数字【简单】","link":"/TNotes.leetcode/2264. 字符串中最大的 3 位相同数字【简单】/README"},{"text":"⏰ 2265. 统计值等于子树平均值的节点数【中等】","link":"/TNotes.leetcode/2265. 统计值等于子树平均值的节点数【中等】/README"},{"text":"⏰ 2266. 统计打字方案数【中等】","link":"/TNotes.leetcode/2266. 统计打字方案数【中等】/README"},{"text":"⏰ 2267. 检查是否有合法括号字符串路径【困难】","link":"/TNotes.leetcode/2267. 检查是否有合法括号字符串路径【困难】/README"},{"text":"⏰ 2268. 最少按键次数【中等】","link":"/TNotes.leetcode/2268. 最少按键次数【中等】/README"},{"text":"⏰ 2269. 找到一个数字的 K 美丽值【简单】","link":"/TNotes.leetcode/2269. 找到一个数字的 K 美丽值【简单】/README"},{"text":"⏰ 2270. 分割数组的方案数【中等】","link":"/TNotes.leetcode/2270. 分割数组的方案数【中等】/README"},{"text":"⏰ 2271. 毯子覆盖的最多白色砖块数【中等】","link":"/TNotes.leetcode/2271. 毯子覆盖的最多白色砖块数【中等】/README"},{"text":"⏰ 2272. 最大波动的子字符串【困难】","link":"/TNotes.leetcode/2272. 最大波动的子字符串【困难】/README"},{"text":"⏰ 2273. 移除字母异位词后的结果数组【简单】","link":"/TNotes.leetcode/2273. 移除字母异位词后的结果数组【简单】/README"},{"text":"⏰ 2274. 不含特殊楼层的最大连续楼层数【中等】","link":"/TNotes.leetcode/2274. 不含特殊楼层的最大连续楼层数【中等】/README"},{"text":"⏰ 2275. 按位与结果大于零的最长组合【中等】","link":"/TNotes.leetcode/2275. 按位与结果大于零的最长组合【中等】/README"},{"text":"⏰ 2276. 统计区间中的整数数目【困难】","link":"/TNotes.leetcode/2276. 统计区间中的整数数目【困难】/README"},{"text":"⏰ 2277. 树中最接近路径的节点【困难】","link":"/TNotes.leetcode/2277. 树中最接近路径的节点【困难】/README"},{"text":"⏰ 2278. 字母在字符串中的百分比【简单】","link":"/TNotes.leetcode/2278. 字母在字符串中的百分比【简单】/README"},{"text":"⏰ 2279. 装满石头的背包的最大数量【中等】","link":"/TNotes.leetcode/2279. 装满石头的背包的最大数量【中等】/README"},{"text":"⏰ 2280. 表示一个折线图的最少线段数【中等】","link":"/TNotes.leetcode/2280. 表示一个折线图的最少线段数【中等】/README"},{"text":"⏰ 2281. 巫师的总力量和【困难】","link":"/TNotes.leetcode/2281. 巫师的总力量和【困难】/README"},{"text":"⏰ 2282. 在一个网格中可以看到的人数【中等】","link":"/TNotes.leetcode/2282. 在一个网格中可以看到的人数【中等】/README"},{"text":"⏰ 2283. 判断一个数的数字计数是否等于数位的值【简单】","link":"/TNotes.leetcode/2283. 判断一个数的数字计数是否等于数位的值【简单】/README"},{"text":"⏰ 2284. 最多单词数的发件人【中等】","link":"/TNotes.leetcode/2284. 最多单词数的发件人【中等】/README"},{"text":"⏰ 2285. 道路的最大总重要性【中等】","link":"/TNotes.leetcode/2285. 道路的最大总重要性【中等】/README"},{"text":"⏰ 2286. 以组为单位订音乐会的门票【困难】","link":"/TNotes.leetcode/2286. 以组为单位订音乐会的门票【困难】/README"},{"text":"⏰ 2287. 重排字符形成目标字符串【简单】","link":"/TNotes.leetcode/2287. 重排字符形成目标字符串【简单】/README"},{"text":"⏰ 2288. 价格减免【中等】","link":"/TNotes.leetcode/2288. 价格减免【中等】/README"},{"text":"⏰ 2289. 使数组按非递减顺序排列【中等】","link":"/TNotes.leetcode/2289. 使数组按非递减顺序排列【中等】/README"},{"text":"⏰ 2290. 到达角落需要移除障碍物的最小数目【困难】","link":"/TNotes.leetcode/2290. 到达角落需要移除障碍物的最小数目【困难】/README"},{"text":"⏰ 2291. 最大股票收益【中等】","link":"/TNotes.leetcode/2291. 最大股票收益【中等】/README"},{"text":"⏰ 2292. 连续两年有 3 个及以上订单的产品【中等】","link":"/TNotes.leetcode/2292. 连续两年有 3 个及以上订单的产品【中等】/README"},{"text":"⏰ 2293. 极大极小游戏【简单】","link":"/TNotes.leetcode/2293. 极大极小游戏【简单】/README"},{"text":"⏰ 2294. 划分数组使最大差为 K【中等】","link":"/TNotes.leetcode/2294. 划分数组使最大差为 K【中等】/README"},{"text":"⏰ 2295. 替换数组中的元素【中等】","link":"/TNotes.leetcode/2295. 替换数组中的元素【中等】/README"},{"text":"⏰ 2296. 设计一个文本编辑器【困难】","link":"/TNotes.leetcode/2296. 设计一个文本编辑器【困难】/README"},{"text":"⏰ 2297. 跳跃游戏 VIII【中等】","link":"/TNotes.leetcode/2297. 跳跃游戏 VIII【中等】/README"},{"text":"⏰ 2298. 周末任务计数【中等】","link":"/TNotes.leetcode/2298. 周末任务计数【中等】/README"},{"text":"⏰ 2299. 强密码检验器 II【简单】","link":"/TNotes.leetcode/2299. 强密码检验器 II【简单】/README"},{"text":"⏰ 2300. 咒语和药水的成功对数【中等】","link":"/TNotes.leetcode/2300. 咒语和药水的成功对数【中等】/README"},{"text":"⏰ 2301. 替换字符后匹配【困难】","link":"/TNotes.leetcode/2301. 替换字符后匹配【困难】/README"},{"text":"⏰ 2302. 统计得分小于 K 的子数组数目【困难】","link":"/TNotes.leetcode/2302. 统计得分小于 K 的子数组数目【困难】/README"},{"text":"⏰ 2303. 计算应缴税款总额【简单】","link":"/TNotes.leetcode/2303. 计算应缴税款总额【简单】/README"},{"text":"⏰ 2304. 网格中的最小路径代价【中等】","link":"/TNotes.leetcode/2304. 网格中的最小路径代价【中等】/README"},{"text":"⏰ 2305. 公平分发饼干【中等】","link":"/TNotes.leetcode/2305. 公平分发饼干【中等】/README"},{"text":"⏰ 2306. 公司命名【困难】","link":"/TNotes.leetcode/2306. 公司命名【困难】/README"},{"text":"⏰ 2307. 检查方程中的矛盾之处【困难】","link":"/TNotes.leetcode/2307. 检查方程中的矛盾之处【困难】/README"},{"text":"⏰ 2308. 按性别排列表格【中等】","link":"/TNotes.leetcode/2308. 按性别排列表格【中等】/README"},{"text":"⏰ 2309. 兼具大小写的最好英文字母【简单】","link":"/TNotes.leetcode/2309. 兼具大小写的最好英文字母【简单】/README"},{"text":"⏰ 2310. 个位数字为 K 的整数之和【中等】","link":"/TNotes.leetcode/2310. 个位数字为 K 的整数之和【中等】/README"},{"text":"⏰ 2311. 小于等于 K 的最长二进制子序列【中等】","link":"/TNotes.leetcode/2311. 小于等于 K 的最长二进制子序列【中等】/README"},{"text":"⏰ 2312. 卖木头块【困难】","link":"/TNotes.leetcode/2312. 卖木头块【困难】/README"},{"text":"⏰ 2313. 二叉树中得到结果所需的最少翻转次数【困难】","link":"/TNotes.leetcode/2313. 二叉树中得到结果所需的最少翻转次数【困难】/README"},{"text":"⏰ 2314. 每个城市最高气温的第一天【中等】","link":"/TNotes.leetcode/2314. 每个城市最高气温的第一天【中等】/README"},{"text":"⏰ 2315. 统计星号【简单】","link":"/TNotes.leetcode/2315. 统计星号【简单】/README"},{"text":"⏰ 2316. 统计无向图中无法互相到达点对数【中等】","link":"/TNotes.leetcode/2316. 统计无向图中无法互相到达点对数【中等】/README"},{"text":"⏰ 2317. 操作后的最大异或和【中等】","link":"/TNotes.leetcode/2317. 操作后的最大异或和【中等】/README"},{"text":"⏰ 2318. 不同骰子序列的数目【困难】","link":"/TNotes.leetcode/2318. 不同骰子序列的数目【困难】/README"},{"text":"⏰ 2319. 判断矩阵是否是一个 X 矩阵【简单】","link":"/TNotes.leetcode/2319. 判断矩阵是否是一个 X 矩阵【简单】/README"},{"text":"⏰ 2320. 统计放置房子的方式数【中等】","link":"/TNotes.leetcode/2320. 统计放置房子的方式数【中等】/README"},{"text":"⏰ 2321. 拼接数组的最大分数【困难】","link":"/TNotes.leetcode/2321. 拼接数组的最大分数【困难】/README"},{"text":"⏰ 2322. 从树中删除边的最小分数【困难】","link":"/TNotes.leetcode/2322. 从树中删除边的最小分数【困难】/README"},{"text":"⏰ 2323. 完成所有工作的最短时间 II【中等】","link":"/TNotes.leetcode/2323. 完成所有工作的最短时间 II【中等】/README"},{"text":"⏰ 2324. 产品销售分析 IV【中等】","link":"/TNotes.leetcode/2324. 产品销售分析 IV【中等】/README"},{"text":"⏰ 2325. 解密消息【简单】","link":"/TNotes.leetcode/2325. 解密消息【简单】/README"},{"text":"⏰ 2326. 螺旋矩阵 IV【中等】","link":"/TNotes.leetcode/2326. 螺旋矩阵 IV【中等】/README"},{"text":"⏰ 2327. 知道秘密的人数【中等】","link":"/TNotes.leetcode/2327. 知道秘密的人数【中等】/README"},{"text":"⏰ 2328. 网格图中递增路径的数目【困难】","link":"/TNotes.leetcode/2328. 网格图中递增路径的数目【困难】/README"},{"text":"⏰ 2329. 产品销售分析Ⅴ【简单】","link":"/TNotes.leetcode/2329. 产品销售分析Ⅴ【简单】/README"},{"text":"⏰ 2330. 验证回文串 IV【中等】","link":"/TNotes.leetcode/2330. 验证回文串 IV【中等】/README"},{"text":"⏰ 2331. 计算布尔二叉树的值【简单】","link":"/TNotes.leetcode/2331. 计算布尔二叉树的值【简单】/README"},{"text":"⏰ 2332. 坐上公交的最晚时间【中等】","link":"/TNotes.leetcode/2332. 坐上公交的最晚时间【中等】/README"},{"text":"⏰ 2333. 最小差值平方和【中等】","link":"/TNotes.leetcode/2333. 最小差值平方和【中等】/README"},{"text":"⏰ 2334. 元素值大于变化阈值的子数组【困难】","link":"/TNotes.leetcode/2334. 元素值大于变化阈值的子数组【困难】/README"},{"text":"⏰ 2335. 装满杯子需要的最短总时长【简单】","link":"/TNotes.leetcode/2335. 装满杯子需要的最短总时长【简单】/README"},{"text":"⏰ 2336. 无限集中的最小数字【中等】","link":"/TNotes.leetcode/2336. 无限集中的最小数字【中等】/README"},{"text":"⏰ 2337. 移动片段得到字符串【中等】","link":"/TNotes.leetcode/2337. 移动片段得到字符串【中等】/README"},{"text":"⏰ 2338. 统计理想数组的数目【困难】","link":"/TNotes.leetcode/2338. 统计理想数组的数目【困难】/README"},{"text":"⏰ 2339. 联赛的所有比赛【简单】","link":"/TNotes.leetcode/2339. 联赛的所有比赛【简单】/README"},{"text":"⏰ 2340. 生成有效数组的最少交换次数【中等】","link":"/TNotes.leetcode/2340. 生成有效数组的最少交换次数【中等】/README"},{"text":"⏰ 2341. 数组能形成多少数对【简单】","link":"/TNotes.leetcode/2341. 数组能形成多少数对【简单】/README"},{"text":"⏰ 2342. 数位和相等数对的最大和【中等】","link":"/TNotes.leetcode/2342. 数位和相等数对的最大和【中等】/README"},{"text":"⏰ 2343. 裁剪数字后查询第 K 小的数字【中等】","link":"/TNotes.leetcode/2343. 裁剪数字后查询第 K 小的数字【中等】/README"},{"text":"⏰ 2344. 使数组可以被整除的最少删除次数【困难】","link":"/TNotes.leetcode/2344. 使数组可以被整除的最少删除次数【困难】/README"},{"text":"⏰ 2345. 寻找可见山的数量【中等】","link":"/TNotes.leetcode/2345. 寻找可见山的数量【中等】/README"},{"text":"⏰ 2346. 以百分比计算排名【中等】","link":"/TNotes.leetcode/2346. 以百分比计算排名【中等】/README"},{"text":"⏰ 2347. 最好的扑克手牌【简单】","link":"/TNotes.leetcode/2347. 最好的扑克手牌【简单】/README"},{"text":"⏰ 2348. 全 0 子数组的数目【中等】","link":"/TNotes.leetcode/2348. 全 0 子数组的数目【中等】/README"},{"text":"⏰ 2349. 设计数字容器系统【中等】","link":"/TNotes.leetcode/2349. 设计数字容器系统【中等】/README"},{"text":"⏰ 2350. 不可能得到的最短骰子序列【困难】","link":"/TNotes.leetcode/2350. 不可能得到的最短骰子序列【困难】/README"},{"text":"⏰ 2351. 第一个出现两次的字母【简单】","link":"/TNotes.leetcode/2351. 第一个出现两次的字母【简单】/README"},{"text":"⏰ 2352. 相等行列对【中等】","link":"/TNotes.leetcode/2352. 相等行列对【中等】/README"},{"text":"⏰ 2353. 设计食物评分系统【中等】","link":"/TNotes.leetcode/2353. 设计食物评分系统【中等】/README"},{"text":"⏰ 2354. 优质数对的数目【困难】","link":"/TNotes.leetcode/2354. 优质数对的数目【困难】/README"},{"text":"⏰ 2355. 你能拿走的最大图书数量【困难】","link":"/TNotes.leetcode/2355. 你能拿走的最大图书数量【困难】/README"},{"text":"⏰ 2356. 每位教师所教授的科目种类的数量【简单】","link":"/TNotes.leetcode/2356. 每位教师所教授的科目种类的数量【简单】/README"},{"text":"⏰ 2357. 使数组中所有元素都等于零【简单】","link":"/TNotes.leetcode/2357. 使数组中所有元素都等于零【简单】/README"},{"text":"⏰ 2358. 分组的最大数量【中等】","link":"/TNotes.leetcode/2358. 分组的最大数量【中等】/README"},{"text":"⏰ 2359. 找到离给定两个节点最近的节点【中等】","link":"/TNotes.leetcode/2359. 找到离给定两个节点最近的节点【中等】/README"},{"text":"⏰ 2360. 图中的最长环【困难】","link":"/TNotes.leetcode/2360. 图中的最长环【困难】/README"},{"text":"⏰ 2361. 乘坐火车路线的最少费用【困难】","link":"/TNotes.leetcode/2361. 乘坐火车路线的最少费用【困难】/README"},{"text":"⏰ 2362. 生成发票【困难】","link":"/TNotes.leetcode/2362. 生成发票【困难】/README"},{"text":"⏰ 2363. 合并相似的物品【简单】","link":"/TNotes.leetcode/2363. 合并相似的物品【简单】/README"},{"text":"⏰ 2364. 统计坏数对的数目【中等】","link":"/TNotes.leetcode/2364. 统计坏数对的数目【中等】/README"},{"text":"⏰ 2365. 任务调度器 II【中等】","link":"/TNotes.leetcode/2365. 任务调度器 II【中等】/README"},{"text":"⏰ 2366. 将数组排序的最少替换次数【困难】","link":"/TNotes.leetcode/2366. 将数组排序的最少替换次数【困难】/README"},{"text":"⏰ 2367. 等差三元组的数目【简单】","link":"/TNotes.leetcode/2367. 等差三元组的数目【简单】/README"},{"text":"⏰ 2368. 受限条件下可到达节点的数目【中等】","link":"/TNotes.leetcode/2368. 受限条件下可到达节点的数目【中等】/README"},{"text":"⏰ 2369. 检查数组是否存在有效划分【中等】","link":"/TNotes.leetcode/2369. 检查数组是否存在有效划分【中等】/README"},{"text":"⏰ 2370. 最长理想子序列【中等】","link":"/TNotes.leetcode/2370. 最长理想子序列【中等】/README"},{"text":"⏰ 2371. 最小化网格中的最大值【困难】","link":"/TNotes.leetcode/2371. 最小化网格中的最大值【困难】/README"},{"text":"⏰ 2372. 计算每个销售人员的影响力【中等】","link":"/TNotes.leetcode/2372. 计算每个销售人员的影响力【中等】/README"},{"text":"⏰ 2373. 矩阵中的局部最大值【简单】","link":"/TNotes.leetcode/2373. 矩阵中的局部最大值【简单】/README"},{"text":"⏰ 2374. 边积分最高的节点【中等】","link":"/TNotes.leetcode/2374. 边积分最高的节点【中等】/README"},{"text":"⏰ 2375. 根据模式串构造最小数字【中等】","link":"/TNotes.leetcode/2375. 根据模式串构造最小数字【中等】/README"},{"text":"⏰ 2376. 统计特殊整数【困难】","link":"/TNotes.leetcode/2376. 统计特殊整数【困难】/README"},{"text":"⏰ 2377. 整理奥运表【简单】","link":"/TNotes.leetcode/2377. 整理奥运表【简单】/README"},{"text":"⏰ 2378. 选择边来最大化树的得分【中等】","link":"/TNotes.leetcode/2378. 选择边来最大化树的得分【中等】/README"},{"text":"⏰ 2379. 得到 K 个黑块的最少涂色次数【简单】","link":"/TNotes.leetcode/2379. 得到 K 个黑块的最少涂色次数【简单】/README"},{"text":"⏰ 2380. 二进制字符串重新安排顺序需要的时间【中等】","link":"/TNotes.leetcode/2380. 二进制字符串重新安排顺序需要的时间【中等】/README"},{"text":"⏰ 2381. 字母移位 II【中等】","link":"/TNotes.leetcode/2381. 字母移位 II【中等】/README"},{"text":"⏰ 2382. 删除操作后的最大子段和【困难】","link":"/TNotes.leetcode/2382. 删除操作后的最大子段和【困难】/README"},{"text":"⏰ 2383. 赢得比赛需要的最少训练时长【简单】","link":"/TNotes.leetcode/2383. 赢得比赛需要的最少训练时长【简单】/README"},{"text":"⏰ 2384. 最大回文数字【中等】","link":"/TNotes.leetcode/2384. 最大回文数字【中等】/README"},{"text":"⏰ 2385. 感染二叉树需要的总时间【中等】","link":"/TNotes.leetcode/2385. 感染二叉树需要的总时间【中等】/README"},{"text":"⏰ 2386. 找出数组的第 K 大和【困难】","link":"/TNotes.leetcode/2386. 找出数组的第 K 大和【困难】/README"},{"text":"⏰ 2387. 行排序矩阵的中位数【中等】","link":"/TNotes.leetcode/2387. 行排序矩阵的中位数【中等】/README"},{"text":"⏰ 2388. 将表中的空值更改为前一个值【中等】","link":"/TNotes.leetcode/2388. 将表中的空值更改为前一个值【中等】/README"},{"text":"⏰ 2389. 和有限的最长子序列【简单】","link":"/TNotes.leetcode/2389. 和有限的最长子序列【简单】/README"},{"text":"⏰ 2390. 从字符串中移除星号【中等】","link":"/TNotes.leetcode/2390. 从字符串中移除星号【中等】/README"},{"text":"⏰ 2391. 收集垃圾的最少总时间【中等】","link":"/TNotes.leetcode/2391. 收集垃圾的最少总时间【中等】/README"},{"text":"⏰ 2392. 给定条件下构造矩阵【困难】","link":"/TNotes.leetcode/2392. 给定条件下构造矩阵【困难】/README"},{"text":"⏰ 2393. 严格递增的子数组个数【中等】","link":"/TNotes.leetcode/2393. 严格递增的子数组个数【中等】/README"},{"text":"⏰ 2394. 开除员工【中等】","link":"/TNotes.leetcode/2394. 开除员工【中等】/README"},{"text":"⏰ 2395. 和相等的子数组【简单】","link":"/TNotes.leetcode/2395. 和相等的子数组【简单】/README"},{"text":"⏰ 2396. 严格回文的数字【中等】","link":"/TNotes.leetcode/2396. 严格回文的数字【中等】/README"},{"text":"⏰ 2397. 被列覆盖的最多行数【中等】","link":"/TNotes.leetcode/2397. 被列覆盖的最多行数【中等】/README"},{"text":"⏰ 2398. 预算内的最多机器人数目【困难】","link":"/TNotes.leetcode/2398. 预算内的最多机器人数目【困难】/README"},{"text":"⏰ 2399. 检查相同字母间的距离【简单】","link":"/TNotes.leetcode/2399. 检查相同字母间的距离【简单】/README"},{"text":"⏰ 2400. 恰好移动 k 步到达某一位置的方法数目【中等】","link":"/TNotes.leetcode/2400. 恰好移动 k 步到达某一位置的方法数目【中等】/README"},{"text":"⏰ 2401. 最长优雅子数组【中等】","link":"/TNotes.leetcode/2401. 最长优雅子数组【中等】/README"},{"text":"⏰ 2402. 会议室 III【困难】","link":"/TNotes.leetcode/2402. 会议室 III【困难】/README"},{"text":"⏰ 2403. 杀死所有怪物的最短时间【困难】","link":"/TNotes.leetcode/2403. 杀死所有怪物的最短时间【困难】/README"},{"text":"⏰ 2404. 出现最频繁的偶数元素【简单】","link":"/TNotes.leetcode/2404. 出现最频繁的偶数元素【简单】/README"},{"text":"⏰ 2405. 子字符串的最优划分【中等】","link":"/TNotes.leetcode/2405. 子字符串的最优划分【中等】/README"},{"text":"⏰ 2406. 将区间分为最少组数【中等】","link":"/TNotes.leetcode/2406. 将区间分为最少组数【中等】/README"},{"text":"⏰ 2407. 最长递增子序列 II【困难】","link":"/TNotes.leetcode/2407. 最长递增子序列 II【困难】/README"},{"text":"⏰ 2408. 设计 SQL【中等】","link":"/TNotes.leetcode/2408. 设计 SQL【中等】/README"},{"text":"⏰ 2409. 统计共同度过的日子数【简单】","link":"/TNotes.leetcode/2409. 统计共同度过的日子数【简单】/README"},{"text":"⏰ 2410. 运动员和训练师的最大匹配数【中等】","link":"/TNotes.leetcode/2410. 运动员和训练师的最大匹配数【中等】/README"},{"text":"⏰ 2411. 按位或最大的最小子数组长度【中等】","link":"/TNotes.leetcode/2411. 按位或最大的最小子数组长度【中等】/README"},{"text":"⏰ 2412. 完成所有交易的初始最少钱数【困难】","link":"/TNotes.leetcode/2412. 完成所有交易的初始最少钱数【困难】/README"},{"text":"⏰ 2413. 最小偶倍数【简单】","link":"/TNotes.leetcode/2413. 最小偶倍数【简单】/README"},{"text":"⏰ 2414. 最长的字母序连续子字符串的长度【中等】","link":"/TNotes.leetcode/2414. 最长的字母序连续子字符串的长度【中等】/README"},{"text":"⏰ 2415. 反转二叉树的奇数层【中等】","link":"/TNotes.leetcode/2415. 反转二叉树的奇数层【中等】/README"},{"text":"⏰ 2416. 字符串的前缀分数和【困难】","link":"/TNotes.leetcode/2416. 字符串的前缀分数和【困难】/README"},{"text":"⏰ 2417. 最近的公平整数【中等】","link":"/TNotes.leetcode/2417. 最近的公平整数【中等】/README"},{"text":"⏰ 2418. 按身高排序【简单】","link":"/TNotes.leetcode/2418. 按身高排序【简单】/README"},{"text":"⏰ 2419. 按位与最大的最长子数组【中等】","link":"/TNotes.leetcode/2419. 按位与最大的最长子数组【中等】/README"},{"text":"⏰ 2420. 找到所有好下标【中等】","link":"/TNotes.leetcode/2420. 找到所有好下标【中等】/README"},{"text":"⏰ 2421. 好路径的数目【困难】","link":"/TNotes.leetcode/2421. 好路径的数目【困难】/README"},{"text":"⏰ 2422. 使用合并操作将数组转换为回文序列【中等】","link":"/TNotes.leetcode/2422. 使用合并操作将数组转换为回文序列【中等】/README"},{"text":"⏰ 2423. 删除字符使频率相同【简单】","link":"/TNotes.leetcode/2423. 删除字符使频率相同【简单】/README"},{"text":"⏰ 2424. 最长上传前缀【中等】","link":"/TNotes.leetcode/2424. 最长上传前缀【中等】/README"},{"text":"⏰ 2425. 所有数对的异或和【中等】","link":"/TNotes.leetcode/2425. 所有数对的异或和【中等】/README"},{"text":"⏰ 2426. 满足不等式的数对数目【困难】","link":"/TNotes.leetcode/2426. 满足不等式的数对数目【困难】/README"},{"text":"⏰ 2427. 公因子的数目【简单】","link":"/TNotes.leetcode/2427. 公因子的数目【简单】/README"},{"text":"⏰ 2428. 沙漏的最大总和【中等】","link":"/TNotes.leetcode/2428. 沙漏的最大总和【中等】/README"},{"text":"⏰ 2429. 最小异或【中等】","link":"/TNotes.leetcode/2429. 最小异或【中等】/README"},{"text":"⏰ 2430. 对字母串可执行的最大删除数【困难】","link":"/TNotes.leetcode/2430. 对字母串可执行的最大删除数【困难】/README"},{"text":"⏰ 2431. 最大限度地提高购买水果的口味【中等】","link":"/TNotes.leetcode/2431. 最大限度地提高购买水果的口味【中等】/README"},{"text":"⏰ 2432. 处理用时最长的那个任务的员工【简单】","link":"/TNotes.leetcode/2432. 处理用时最长的那个任务的员工【简单】/README"},{"text":"⏰ 2433. 找出前缀异或的原始数组【中等】","link":"/TNotes.leetcode/2433. 找出前缀异或的原始数组【中等】/README"},{"text":"⏰ 2434. 使用机器人打印字典序最小的字符串【中等】","link":"/TNotes.leetcode/2434. 使用机器人打印字典序最小的字符串【中等】/README"},{"text":"⏰ 2435. 矩阵中和能被 K 整除的路径【困难】","link":"/TNotes.leetcode/2435. 矩阵中和能被 K 整除的路径【困难】/README"},{"text":"⏰ 2436. 使子数组最大公约数大于一的最小分割数【中等】","link":"/TNotes.leetcode/2436. 使子数组最大公约数大于一的最小分割数【中等】/README"},{"text":"⏰ 2437. 有效时间的数目【简单】","link":"/TNotes.leetcode/2437. 有效时间的数目【简单】/README"},{"text":"⏰ 2438. 二的幂数组中查询范围内的乘积【中等】","link":"/TNotes.leetcode/2438. 二的幂数组中查询范围内的乘积【中等】/README"},{"text":"⏰ 2439. 最小化数组中的最大值【中等】","link":"/TNotes.leetcode/2439. 最小化数组中的最大值【中等】/README"},{"text":"⏰ 2440. 创建价值相同的连通块【困难】","link":"/TNotes.leetcode/2440. 创建价值相同的连通块【困难】/README"},{"text":"⏰ 2441. 与对应负数同时存在的最大正整数【简单】","link":"/TNotes.leetcode/2441. 与对应负数同时存在的最大正整数【简单】/README"},{"text":"⏰ 2442. 反转之后不同整数的数目【中等】","link":"/TNotes.leetcode/2442. 反转之后不同整数的数目【中等】/README"},{"text":"⏰ 2443. 反转之后的数字和【中等】","link":"/TNotes.leetcode/2443. 反转之后的数字和【中等】/README"},{"text":"⏰ 2444. 统计定界子数组的数目【困难】","link":"/TNotes.leetcode/2444. 统计定界子数组的数目【困难】/README"},{"text":"⏰ 2445. 值为 1 的节点数【中等】","link":"/TNotes.leetcode/2445. 值为 1 的节点数【中等】/README"},{"text":"⏰ 2446. 判断两个事件是否存在冲突【简单】","link":"/TNotes.leetcode/2446. 判断两个事件是否存在冲突【简单】/README"},{"text":"⏰ 2447. 最大公因数等于 K 的子数组数目【中等】","link":"/TNotes.leetcode/2447. 最大公因数等于 K 的子数组数目【中等】/README"},{"text":"⏰ 2448. 使数组相等的最小开销【困难】","link":"/TNotes.leetcode/2448. 使数组相等的最小开销【困难】/README"},{"text":"⏰ 2449. 使数组相似的最少操作次数【困难】","link":"/TNotes.leetcode/2449. 使数组相似的最少操作次数【困难】/README"},{"text":"⏰ 2450. 应用操作后不同二进制字符串的数量【中等】","link":"/TNotes.leetcode/2450. 应用操作后不同二进制字符串的数量【中等】/README"},{"text":"⏰ 2451. 差值数组不同的字符串【简单】","link":"/TNotes.leetcode/2451. 差值数组不同的字符串【简单】/README"},{"text":"⏰ 2452. 距离字典两次编辑以内的单词【中等】","link":"/TNotes.leetcode/2452. 距离字典两次编辑以内的单词【中等】/README"},{"text":"⏰ 2453. 摧毁一系列目标【中等】","link":"/TNotes.leetcode/2453. 摧毁一系列目标【中等】/README"},{"text":"⏰ 2454. 下一个更大元素 IV【困难】","link":"/TNotes.leetcode/2454. 下一个更大元素 IV【困难】/README"},{"text":"⏰ 2455. 可被三整除的偶数的平均值【简单】","link":"/TNotes.leetcode/2455. 可被三整除的偶数的平均值【简单】/README"},{"text":"⏰ 2456. 最流行的视频创作者【中等】","link":"/TNotes.leetcode/2456. 最流行的视频创作者【中等】/README"},{"text":"⏰ 2457. 美丽整数的最小增量【中等】","link":"/TNotes.leetcode/2457. 美丽整数的最小增量【中等】/README"},{"text":"⏰ 2458. 移除子树后的二叉树高度【困难】","link":"/TNotes.leetcode/2458. 移除子树后的二叉树高度【困难】/README"},{"text":"⏰ 2459. 通过移动项目到空白区域来排序数组【困难】","link":"/TNotes.leetcode/2459. 通过移动项目到空白区域来排序数组【困难】/README"},{"text":"⏰ 2460. 对数组执行操作【简单】","link":"/TNotes.leetcode/2460. 对数组执行操作【简单】/README"},{"text":"⏰ 2461. 长度为 K 子数组中的最大和【中等】","link":"/TNotes.leetcode/2461. 长度为 K 子数组中的最大和【中等】/README"},{"text":"⏰ 2462. 雇佣 K 位工人的总代价【中等】","link":"/TNotes.leetcode/2462. 雇佣 K 位工人的总代价【中等】/README"},{"text":"⏰ 2463. 最小移动总距离【困难】","link":"/TNotes.leetcode/2463. 最小移动总距离【困难】/README"},{"text":"⏰ 2464. 有效分割中的最少子数组数目【中等】","link":"/TNotes.leetcode/2464. 有效分割中的最少子数组数目【中等】/README"},{"text":"⏰ 2465. 不同的平均值数目【简单】","link":"/TNotes.leetcode/2465. 不同的平均值数目【简单】/README"},{"text":"⏰ 2466. 统计构造好字符串的方案数【中等】","link":"/TNotes.leetcode/2466. 统计构造好字符串的方案数【中等】/README"},{"text":"⏰ 2467. 树上最大得分和路径【中等】","link":"/TNotes.leetcode/2467. 树上最大得分和路径【中等】/README"},{"text":"⏰ 2468. 根据限制分割消息【困难】","link":"/TNotes.leetcode/2468. 根据限制分割消息【困难】/README"},{"text":"⏰ 2469. 温度转换【简单】","link":"/TNotes.leetcode/2469. 温度转换【简单】/README"},{"text":"⏰ 2470. 最小公倍数等于 K 的子数组数目【中等】","link":"/TNotes.leetcode/2470. 最小公倍数等于 K 的子数组数目【中等】/README"},{"text":"⏰ 2471. 逐层排序二叉树所需的最少操作数目【中等】","link":"/TNotes.leetcode/2471. 逐层排序二叉树所需的最少操作数目【中等】/README"},{"text":"⏰ 2472. 不重叠回文子字符串的最大数目【困难】","link":"/TNotes.leetcode/2472. 不重叠回文子字符串的最大数目【困难】/README"},{"text":"⏰ 2473. 购买苹果的最低成本【中等】","link":"/TNotes.leetcode/2473. 购买苹果的最低成本【中等】/README"},{"text":"⏰ 2474. 购买量严格增加的客户【困难】","link":"/TNotes.leetcode/2474. 购买量严格增加的客户【困难】/README"},{"text":"⏰ 2475. 数组中不等三元组的数目【简单】","link":"/TNotes.leetcode/2475. 数组中不等三元组的数目【简单】/README"},{"text":"⏰ 2476. 二叉搜索树最近节点查询【中等】","link":"/TNotes.leetcode/2476. 二叉搜索树最近节点查询【中等】/README"},{"text":"⏰ 2477. 到达首都的最少油耗【中等】","link":"/TNotes.leetcode/2477. 到达首都的最少油耗【中等】/README"},{"text":"⏰ 2478. 完美分割的方案数【困难】","link":"/TNotes.leetcode/2478. 完美分割的方案数【困难】/README"},{"text":"⏰ 2479. 两个不重叠子树的最大异或值【困难】","link":"/TNotes.leetcode/2479. 两个不重叠子树的最大异或值【困难】/README"},{"text":"⏰ 2480. 形成化学键【简单】","link":"/TNotes.leetcode/2480. 形成化学键【简单】/README"},{"text":"⏰ 2481. 分割圆的最少切割次数【简单】","link":"/TNotes.leetcode/2481. 分割圆的最少切割次数【简单】/README"},{"text":"⏰ 2482. 行和列中一和零的差值【中等】","link":"/TNotes.leetcode/2482. 行和列中一和零的差值【中等】/README"},{"text":"⏰ 2483. 商店的最少代价【中等】","link":"/TNotes.leetcode/2483. 商店的最少代价【中等】/README"},{"text":"⏰ 2484. 统计回文子序列数目【困难】","link":"/TNotes.leetcode/2484. 统计回文子序列数目【困难】/README"},{"text":"⏰ 2485. 找出中枢整数【简单】","link":"/TNotes.leetcode/2485. 找出中枢整数【简单】/README"},{"text":"⏰ 2486. 追加字符以获得子序列【中等】","link":"/TNotes.leetcode/2486. 追加字符以获得子序列【中等】/README"},{"text":"⏰ 2487. 从链表中移除节点【中等】","link":"/TNotes.leetcode/2487. 从链表中移除节点【中等】/README"},{"text":"⏰ 2488. 统计中位数为 K 的子数组【困难】","link":"/TNotes.leetcode/2488. 统计中位数为 K 的子数组【困难】/README"},{"text":"⏰ 2489. 固定比率的子字符串数【中等】","link":"/TNotes.leetcode/2489. 固定比率的子字符串数【中等】/README"},{"text":"⏰ 2490. 回环句【简单】","link":"/TNotes.leetcode/2490. 回环句【简单】/README"},{"text":"⏰ 2491. 划分技能点相等的团队【中等】","link":"/TNotes.leetcode/2491. 划分技能点相等的团队【中等】/README"},{"text":"⏰ 2492. 两个城市间路径的最小分数【中等】","link":"/TNotes.leetcode/2492. 两个城市间路径的最小分数【中等】/README"},{"text":"⏰ 2493. 将节点分成尽可能多的组【困难】","link":"/TNotes.leetcode/2493. 将节点分成尽可能多的组【困难】/README"},{"text":"⏰ 2494. 合并在同一个大厅重叠的活动【困难】","link":"/TNotes.leetcode/2494. 合并在同一个大厅重叠的活动【困难】/README"},{"text":"⏰ 2495. 乘积为偶数的子数组数【中等】","link":"/TNotes.leetcode/2495. 乘积为偶数的子数组数【中等】/README"},{"text":"⏰ 2496. 数组中字符串的最大值【简单】","link":"/TNotes.leetcode/2496. 数组中字符串的最大值【简单】/README"},{"text":"⏰ 2497. 图中最大星和【中等】","link":"/TNotes.leetcode/2497. 图中最大星和【中等】/README"},{"text":"⏰ 2498. 青蛙过河 II【中等】","link":"/TNotes.leetcode/2498. 青蛙过河 II【中等】/README"},{"text":"⏰ 2499. 让数组不相等的最小总代价【困难】","link":"/TNotes.leetcode/2499. 让数组不相等的最小总代价【困难】/README"},{"text":"⏰ 2500. 删除每行中的最大值【简单】","link":"/TNotes.leetcode/2500. 删除每行中的最大值【简单】/README"},{"text":"⏰ 2501. 数组中最长的方波【中等】","link":"/TNotes.leetcode/2501. 数组中最长的方波【中等】/README"},{"text":"⏰ 2502. 设计内存分配器【中等】","link":"/TNotes.leetcode/2502. 设计内存分配器【中等】/README"},{"text":"⏰ 2503. 矩阵查询可获得的最大分数【困难】","link":"/TNotes.leetcode/2503. 矩阵查询可获得的最大分数【困难】/README"},{"text":"⏰ 2504. 把名字和职业联系起来【简单】","link":"/TNotes.leetcode/2504. 把名字和职业联系起来【简单】/README"},{"text":"⏰ 2505. 所有子序列和的按位或【中等】","link":"/TNotes.leetcode/2505. 所有子序列和的按位或【中等】/README"},{"text":"⏰ 2506. 统计相似字符串对的数目【简单】","link":"/TNotes.leetcode/2506. 统计相似字符串对的数目【简单】/README"},{"text":"⏰ 2507. 使用质因数之和替换后可以取到的最小值【中等】","link":"/TNotes.leetcode/2507. 使用质因数之和替换后可以取到的最小值【中等】/README"},{"text":"⏰ 2508. 添加边使所有节点度数都为偶数【困难】","link":"/TNotes.leetcode/2508. 添加边使所有节点度数都为偶数【困难】/README"},{"text":"⏰ 2509. 查询树中环的长度【困难】","link":"/TNotes.leetcode/2509. 查询树中环的长度【困难】/README"},{"text":"⏰ 2510. 检查是否有路径经过相同数量的 0 和 1【中等】","link":"/TNotes.leetcode/2510. 检查是否有路径经过相同数量的 0 和 1【中等】/README"},{"text":"⏰ 2511. 最多可以摧毁的敌人城堡数目【简单】","link":"/TNotes.leetcode/2511. 最多可以摧毁的敌人城堡数目【简单】/README"},{"text":"⏰ 2512. 奖励最顶尖的 K 名学生【中等】","link":"/TNotes.leetcode/2512. 奖励最顶尖的 K 名学生【中等】/README"},{"text":"⏰ 2513. 最小化两个数组中的最大值【中等】","link":"/TNotes.leetcode/2513. 最小化两个数组中的最大值【中等】/README"},{"text":"⏰ 2514. 统计同位异构字符串数目【困难】","link":"/TNotes.leetcode/2514. 统计同位异构字符串数目【困难】/README"},{"text":"⏰ 2515. 到目标字符串的最短距离【简单】","link":"/TNotes.leetcode/2515. 到目标字符串的最短距离【简单】/README"},{"text":"⏰ 2516. 每种字符至少取 K 个【中等】","link":"/TNotes.leetcode/2516. 每种字符至少取 K 个【中等】/README"},{"text":"⏰ 2517. 礼盒的最大甜蜜度【中等】","link":"/TNotes.leetcode/2517. 礼盒的最大甜蜜度【中等】/README"},{"text":"⏰ 2518. 好分区的数目【困难】","link":"/TNotes.leetcode/2518. 好分区的数目【困难】/README"},{"text":"⏰ 2519. 统计 K-Big 索引的数量【困难】","link":"/TNotes.leetcode/2519. 统计 K-Big 索引的数量【困难】/README"},{"text":"⏰ 2520. 统计能整除数字的位数【简单】","link":"/TNotes.leetcode/2520. 统计能整除数字的位数【简单】/README"},{"text":"⏰ 2521. 数组乘积中的不同质因数数目【中等】","link":"/TNotes.leetcode/2521. 数组乘积中的不同质因数数目【中等】/README"},{"text":"⏰ 2522. 将字符串分割成值不超过 K 的子字符串【中等】","link":"/TNotes.leetcode/2522. 将字符串分割成值不超过 K 的子字符串【中等】/README"},{"text":"⏰ 2523. 范围内最接近的两个质数【中等】","link":"/TNotes.leetcode/2523. 范围内最接近的两个质数【中等】/README"},{"text":"⏰ 2524. 子数组的最大频率分数【困难】","link":"/TNotes.leetcode/2524. 子数组的最大频率分数【困难】/README"},{"text":"⏰ 2525. 根据规则将箱子分类【简单】","link":"/TNotes.leetcode/2525. 根据规则将箱子分类【简单】/README"},{"text":"⏰ 2526. 找到数据流中的连续整数【中等】","link":"/TNotes.leetcode/2526. 找到数据流中的连续整数【中等】/README"},{"text":"⏰ 2527. 查询数组异或美丽值【中等】","link":"/TNotes.leetcode/2527. 查询数组异或美丽值【中等】/README"},{"text":"⏰ 2528. 最大化城市的最小电量【困难】","link":"/TNotes.leetcode/2528. 最大化城市的最小电量【困难】/README"},{"text":"⏰ 2529. 正整数和负整数的最大计数【简单】","link":"/TNotes.leetcode/2529. 正整数和负整数的最大计数【简单】/README"},{"text":"⏰ 2530. 执行 K 次操作后的最大分数【中等】","link":"/TNotes.leetcode/2530. 执行 K 次操作后的最大分数【中等】/README"},{"text":"⏰ 2531. 使字符串中不同字符的数目相等【中等】","link":"/TNotes.leetcode/2531. 使字符串中不同字符的数目相等【中等】/README"},{"text":"⏰ 2532. 过桥的时间【困难】","link":"/TNotes.leetcode/2532. 过桥的时间【困难】/README"},{"text":"⏰ 2533. 好二进制字符串的数量【中等】","link":"/TNotes.leetcode/2533. 好二进制字符串的数量【中等】/README"},{"text":"⏰ 2534. 通过门的时间【困难】","link":"/TNotes.leetcode/2534. 通过门的时间【困难】/README"},{"text":"⏰ 2535. 数组元素和与数字和的绝对差【简单】","link":"/TNotes.leetcode/2535. 数组元素和与数字和的绝对差【简单】/README"},{"text":"⏰ 2536. 子矩阵元素加 1【中等】","link":"/TNotes.leetcode/2536. 子矩阵元素加 1【中等】/README"},{"text":"⏰ 2537. 统计好子数组的数目【中等】","link":"/TNotes.leetcode/2537. 统计好子数组的数目【中等】/README"},{"text":"⏰ 2538. 最大价值和与最小价值和的差值【困难】","link":"/TNotes.leetcode/2538. 最大价值和与最小价值和的差值【困难】/README"},{"text":"⏰ 2539. 好子序列的个数【中等】","link":"/TNotes.leetcode/2539. 好子序列的个数【中等】/README"},{"text":"⏰ 2540. 最小公共值【简单】","link":"/TNotes.leetcode/2540. 最小公共值【简单】/README"},{"text":"⏰ 2541. 使数组中所有元素相等的最小操作数 II【中等】","link":"/TNotes.leetcode/2541. 使数组中所有元素相等的最小操作数 II【中等】/README"},{"text":"⏰ 2542. 最大子序列的分数【中等】","link":"/TNotes.leetcode/2542. 最大子序列的分数【中等】/README"},{"text":"⏰ 2543. 判断一个点是否可以到达【困难】","link":"/TNotes.leetcode/2543. 判断一个点是否可以到达【困难】/README"},{"text":"⏰ 2544. 交替数字和【简单】","link":"/TNotes.leetcode/2544. 交替数字和【简单】/README"},{"text":"⏰ 2545. 根据第 K 场考试的分数排序【中等】","link":"/TNotes.leetcode/2545. 根据第 K 场考试的分数排序【中等】/README"},{"text":"⏰ 2546. 执行逐位运算使字符串相等【中等】","link":"/TNotes.leetcode/2546. 执行逐位运算使字符串相等【中等】/README"},{"text":"⏰ 2547. 拆分数组的最小代价【困难】","link":"/TNotes.leetcode/2547. 拆分数组的最小代价【困难】/README"},{"text":"⏰ 2548. 填满背包的最大价格【中等】","link":"/TNotes.leetcode/2548. 填满背包的最大价格【中等】/README"},{"text":"⏰ 2549. 统计桌面上的不同数字【简单】","link":"/TNotes.leetcode/2549. 统计桌面上的不同数字【简单】/README"},{"text":"⏰ 2550. 猴子碰撞的方法数【中等】","link":"/TNotes.leetcode/2550. 猴子碰撞的方法数【中等】/README"},{"text":"⏰ 2551. 将珠子放入背包中【困难】","link":"/TNotes.leetcode/2551. 将珠子放入背包中【困难】/README"},{"text":"⏰ 2552. 统计上升四元组【困难】","link":"/TNotes.leetcode/2552. 统计上升四元组【困难】/README"},{"text":"⏰ 2553. 分割数组中数字的数位【简单】","link":"/TNotes.leetcode/2553. 分割数组中数字的数位【简单】/README"},{"text":"⏰ 2554. 从一个范围内选择最多整数 I【中等】","link":"/TNotes.leetcode/2554. 从一个范围内选择最多整数 I【中等】/README"},{"text":"⏰ 2555. 两个线段获得的最多奖品【中等】","link":"/TNotes.leetcode/2555. 两个线段获得的最多奖品【中等】/README"},{"text":"⏰ 2556. 二进制矩阵中翻转最多一次使路径不连通【中等】","link":"/TNotes.leetcode/2556. 二进制矩阵中翻转最多一次使路径不连通【中等】/README"},{"text":"⏰ 2557. 从一个范围内选择最多整数 II【中等】","link":"/TNotes.leetcode/2557. 从一个范围内选择最多整数 II【中等】/README"},{"text":"⏰ 2558. 从数量最多的堆取走礼物【简单】","link":"/TNotes.leetcode/2558. 从数量最多的堆取走礼物【简单】/README"},{"text":"⏰ 2559. 统计范围内的元音字符串数【中等】","link":"/TNotes.leetcode/2559. 统计范围内的元音字符串数【中等】/README"},{"text":"⏰ 2560. 打家劫舍 IV【中等】","link":"/TNotes.leetcode/2560. 打家劫舍 IV【中等】/README"},{"text":"⏰ 2561. 重排水果【困难】","link":"/TNotes.leetcode/2561. 重排水果【困难】/README"},{"text":"⏰ 2562. 找出数组的串联值【简单】","link":"/TNotes.leetcode/2562. 找出数组的串联值【简单】/README"},{"text":"⏰ 2563. 统计公平数对的数目【中等】","link":"/TNotes.leetcode/2563. 统计公平数对的数目【中等】/README"},{"text":"⏰ 2564. 子字符串异或查询【中等】","link":"/TNotes.leetcode/2564. 子字符串异或查询【中等】/README"},{"text":"⏰ 2565. 最少得分子序列【困难】","link":"/TNotes.leetcode/2565. 最少得分子序列【困难】/README"},{"text":"⏰ 2566. 替换一个数字后的最大差值【简单】","link":"/TNotes.leetcode/2566. 替换一个数字后的最大差值【简单】/README"},{"text":"⏰ 2567. 修改两个元素的最小分数【中等】","link":"/TNotes.leetcode/2567. 修改两个元素的最小分数【中等】/README"},{"text":"⏰ 2568. 最小无法得到的或值【中等】","link":"/TNotes.leetcode/2568. 最小无法得到的或值【中等】/README"},{"text":"⏰ 2569. 更新数组后处理求和查询【困难】","link":"/TNotes.leetcode/2569. 更新数组后处理求和查询【困难】/README"},{"text":"⏰ 2570. 合并两个二维数组 - 求和法【简单】","link":"/TNotes.leetcode/2570. 合并两个二维数组 - 求和法【简单】/README"},{"text":"⏰ 2571. 将整数减少到零需要的最少操作数【中等】","link":"/TNotes.leetcode/2571. 将整数减少到零需要的最少操作数【中等】/README"},{"text":"⏰ 2572. 无平方子集计数【中等】","link":"/TNotes.leetcode/2572. 无平方子集计数【中等】/README"},{"text":"⏰ 2573. 找出对应 LCP 矩阵的字符串【困难】","link":"/TNotes.leetcode/2573. 找出对应 LCP 矩阵的字符串【困难】/README"},{"text":"⏰ 2574. 左右元素和的差值【简单】","link":"/TNotes.leetcode/2574. 左右元素和的差值【简单】/README"},{"text":"⏰ 2575. 找出字符串的可整除数组【中等】","link":"/TNotes.leetcode/2575. 找出字符串的可整除数组【中等】/README"},{"text":"⏰ 2576. 求出最多标记下标【中等】","link":"/TNotes.leetcode/2576. 求出最多标记下标【中等】/README"},{"text":"⏰ 2577. 在网格图中访问一个格子的最少时间【困难】","link":"/TNotes.leetcode/2577. 在网格图中访问一个格子的最少时间【困难】/README"},{"text":"⏰ 2578. 最小和分割【简单】","link":"/TNotes.leetcode/2578. 最小和分割【简单】/README"},{"text":"⏰ 2579. 统计染色格子数【中等】","link":"/TNotes.leetcode/2579. 统计染色格子数【中等】/README"},{"text":"⏰ 2580. 统计将重叠区间合并成组的方案数【中等】","link":"/TNotes.leetcode/2580. 统计将重叠区间合并成组的方案数【中等】/README"},{"text":"⏰ 2581. 统计可能的树根数目【困难】","link":"/TNotes.leetcode/2581. 统计可能的树根数目【困难】/README"},{"text":"⏰ 2582. 递枕头【简单】","link":"/TNotes.leetcode/2582. 递枕头【简单】/README"},{"text":"⏰ 2583. 二叉树中的第 K 大层和【中等】","link":"/TNotes.leetcode/2583. 二叉树中的第 K 大层和【中等】/README"},{"text":"⏰ 2584. 分割数组使乘积互质【困难】","link":"/TNotes.leetcode/2584. 分割数组使乘积互质【困难】/README"},{"text":"⏰ 2585. 获得分数的方法数【困难】","link":"/TNotes.leetcode/2585. 获得分数的方法数【困难】/README"},{"text":"⏰ 2586. 统计范围内的元音字符串数【简单】","link":"/TNotes.leetcode/2586. 统计范围内的元音字符串数【简单】/README"},{"text":"⏰ 2587. 重排数组以得到最大前缀分数【中等】","link":"/TNotes.leetcode/2587. 重排数组以得到最大前缀分数【中等】/README"},{"text":"⏰ 2588. 统计美丽子数组数目【中等】","link":"/TNotes.leetcode/2588. 统计美丽子数组数目【中等】/README"},{"text":"⏰ 2589. 完成所有任务的最少时间【困难】","link":"/TNotes.leetcode/2589. 完成所有任务的最少时间【困难】/README"},{"text":"⏰ 2590. 设计一个待办事项清单【中等】","link":"/TNotes.leetcode/2590. 设计一个待办事项清单【中等】/README"},{"text":"⏰ 2591. 将钱分给最多的儿童【简单】","link":"/TNotes.leetcode/2591. 将钱分给最多的儿童【简单】/README"},{"text":"⏰ 2592. 最大化数组的伟大值【中等】","link":"/TNotes.leetcode/2592. 最大化数组的伟大值【中等】/README"},{"text":"⏰ 2593. 标记所有元素后数组的分数【中等】","link":"/TNotes.leetcode/2593. 标记所有元素后数组的分数【中等】/README"},{"text":"⏰ 2594. 修车的最少时间【中等】","link":"/TNotes.leetcode/2594. 修车的最少时间【中等】/README"},{"text":"⏰ 2595. 奇偶位数【简单】","link":"/TNotes.leetcode/2595. 奇偶位数【简单】/README"},{"text":"⏰ 2596. 检查骑士巡视方案【中等】","link":"/TNotes.leetcode/2596. 检查骑士巡视方案【中等】/README"},{"text":"⏰ 2597. 美丽子集的数目【中等】","link":"/TNotes.leetcode/2597. 美丽子集的数目【中等】/README"},{"text":"⏰ 2598. 执行操作后的最大 MEX【中等】","link":"/TNotes.leetcode/2598. 执行操作后的最大 MEX【中等】/README"},{"text":"⏰ 2599. 使前缀和数组非负【中等】","link":"/TNotes.leetcode/2599. 使前缀和数组非负【中等】/README"},{"text":"⏰ 2600. K 件物品的最大和【简单】","link":"/TNotes.leetcode/2600. K 件物品的最大和【简单】/README"},{"text":"⏰ 2601. 质数减法运算【中等】","link":"/TNotes.leetcode/2601. 质数减法运算【中等】/README"},{"text":"⏰ 2602. 使数组元素全部相等的最少操作次数【中等】","link":"/TNotes.leetcode/2602. 使数组元素全部相等的最少操作次数【中等】/README"},{"text":"⏰ 2603. 收集树中金币【困难】","link":"/TNotes.leetcode/2603. 收集树中金币【困难】/README"},{"text":"⏰ 2604. 吃掉所有谷子的最短时间【困难】","link":"/TNotes.leetcode/2604. 吃掉所有谷子的最短时间【困难】/README"},{"text":"⏰ 2605. 从两个数字数组里生成最小数字【简单】","link":"/TNotes.leetcode/2605. 从两个数字数组里生成最小数字【简单】/README"},{"text":"⏰ 2606. 找到最大开销的子字符串【中等】","link":"/TNotes.leetcode/2606. 找到最大开销的子字符串【中等】/README"},{"text":"⏰ 2607. 使子数组元素和相等【中等】","link":"/TNotes.leetcode/2607. 使子数组元素和相等【中等】/README"},{"text":"⏰ 2608. 图中的最短环【困难】","link":"/TNotes.leetcode/2608. 图中的最短环【困难】/README"},{"text":"⏰ 2609. 最长平衡子字符串【简单】","link":"/TNotes.leetcode/2609. 最长平衡子字符串【简单】/README"},{"text":"⏰ 2610. 转换二维数组【中等】","link":"/TNotes.leetcode/2610. 转换二维数组【中等】/README"},{"text":"⏰ 2611. 老鼠和奶酪【中等】","link":"/TNotes.leetcode/2611. 老鼠和奶酪【中等】/README"},{"text":"⏰ 2612. 最少翻转操作数【困难】","link":"/TNotes.leetcode/2612. 最少翻转操作数【困难】/README"},{"text":"⏰ 2613. 美数对【困难】","link":"/TNotes.leetcode/2613. 美数对【困难】/README"},{"text":"⏰ 2614. 对角线上的质数【简单】","link":"/TNotes.leetcode/2614. 对角线上的质数【简单】/README"},{"text":"⏰ 2615. 等值距离和【中等】","link":"/TNotes.leetcode/2615. 等值距离和【中等】/README"},{"text":"⏰ 2616. 最小化数对的最大差值【中等】","link":"/TNotes.leetcode/2616. 最小化数对的最大差值【中等】/README"},{"text":"⏰ 2617. 网格图中最少访问的格子数【困难】","link":"/TNotes.leetcode/2617. 网格图中最少访问的格子数【困难】/README"},{"text":"⏰ 2618. 检查是否是类的对象实例【中等】","link":"/TNotes.leetcode/2618. 检查是否是类的对象实例【中等】/README"},{"text":"⏰ 2619. 数组原型对象的最后一个元素【简单】","link":"/TNotes.leetcode/2619. 数组原型对象的最后一个元素【简单】/README"},{"text":"⏰ 2620. 计数器【简单】","link":"/TNotes.leetcode/2620. 计数器【简单】/README"},{"text":"⏰ 2621. 睡眠函数【简单】","link":"/TNotes.leetcode/2621. 睡眠函数【简单】/README"},{"text":"⏰ 2622. 有时间限制的缓存【中等】","link":"/TNotes.leetcode/2622. 有时间限制的缓存【中等】/README"},{"text":"⏰ 2623. 记忆函数【中等】","link":"/TNotes.leetcode/2623. 记忆函数【中等】/README"},{"text":"⏰ 2624. 蜗牛排序【中等】","link":"/TNotes.leetcode/2624. 蜗牛排序【中等】/README"},{"text":"⏰ 2625. 扁平化嵌套数组【中等】","link":"/TNotes.leetcode/2625. 扁平化嵌套数组【中等】/README"},{"text":"⏰ 2626. 数组归约运算【简单】","link":"/TNotes.leetcode/2626. 数组归约运算【简单】/README"},{"text":"⏰ 2627. 函数防抖【中等】","link":"/TNotes.leetcode/2627. 函数防抖【中等】/README"},{"text":"⏰ 2628. 完全相等的 JSON 字符串【中等】","link":"/TNotes.leetcode/2628. 完全相等的 JSON 字符串【中等】/README"},{"text":"⏰ 2629. 复合函数【简单】","link":"/TNotes.leetcode/2629. 复合函数【简单】/README"},{"text":"⏰ 2630. 记忆函数 II【困难】","link":"/TNotes.leetcode/2630. 记忆函数 II【困难】/README"},{"text":"⏰ 2631. 分组【中等】","link":"/TNotes.leetcode/2631. 分组【中等】/README"},{"text":"⏰ 2632. 柯里化【中等】","link":"/TNotes.leetcode/2632. 柯里化【中等】/README"},{"text":"⏰ 2633. 将对象转换为 JSON 字符串【中等】","link":"/TNotes.leetcode/2633. 将对象转换为 JSON 字符串【中等】/README"},{"text":"⏰ 2634. 过滤数组中的元素【简单】","link":"/TNotes.leetcode/2634. 过滤数组中的元素【简单】/README"},{"text":"⏰ 2635. 转换数组中的每个元素【简单】","link":"/TNotes.leetcode/2635. 转换数组中的每个元素【简单】/README"},{"text":"⏰ 2636. Promise 对象池【中等】","link":"/TNotes.leetcode/2636. Promise 对象池【中等】/README"},{"text":"⏰ 2637. 有时间限制的 Promise 对象【中等】","link":"/TNotes.leetcode/2637. 有时间限制的 Promise 对象【中等】/README"},{"text":"⏰ 2638. 统计 K-Free 子集的总数【中等】","link":"/TNotes.leetcode/2638. 统计 K-Free 子集的总数【中等】/README"},{"text":"⏰ 2639. 查询网格图中每一列的宽度【简单】","link":"/TNotes.leetcode/2639. 查询网格图中每一列的宽度【简单】/README"},{"text":"⏰ 2640. 一个数组所有前缀的分数【中等】","link":"/TNotes.leetcode/2640. 一个数组所有前缀的分数【中等】/README"},{"text":"⏰ 2641. 二叉树的堂兄弟节点 II【中等】","link":"/TNotes.leetcode/2641. 二叉树的堂兄弟节点 II【中等】/README"},{"text":"⏰ 2642. 设计可以求最短路径的图类【困难】","link":"/TNotes.leetcode/2642. 设计可以求最短路径的图类【困难】/README"},{"text":"⏰ 2643. 一最多的行【简单】","link":"/TNotes.leetcode/2643. 一最多的行【简单】/README"},{"text":"⏰ 2644. 找出可整除性得分最大的整数【简单】","link":"/TNotes.leetcode/2644. 找出可整除性得分最大的整数【简单】/README"},{"text":"⏰ 2645. 构造有效字符串的最少插入数【中等】","link":"/TNotes.leetcode/2645. 构造有效字符串的最少插入数【中等】/README"},{"text":"⏰ 2646. 最小化旅行的价格总和【困难】","link":"/TNotes.leetcode/2646. 最小化旅行的价格总和【困难】/README"},{"text":"⏰ 2647. 把三角形染成红色【困难】","link":"/TNotes.leetcode/2647. 把三角形染成红色【困难】/README"},{"text":"⏰ 2648. 生成斐波那契数列【简单】","link":"/TNotes.leetcode/2648. 生成斐波那契数列【简单】/README"},{"text":"⏰ 2649. 嵌套数组生成器【中等】","link":"/TNotes.leetcode/2649. 嵌套数组生成器【中等】/README"},{"text":"⏰ 2650. 设计可取消函数【困难】","link":"/TNotes.leetcode/2650. 设计可取消函数【困难】/README"},{"text":"⏰ 2651. 计算列车到站时间【简单】","link":"/TNotes.leetcode/2651. 计算列车到站时间【简单】/README"},{"text":"⏰ 2652. 倍数求和【简单】","link":"/TNotes.leetcode/2652. 倍数求和【简单】/README"},{"text":"⏰ 2653. 滑动子数组的美丽值【中等】","link":"/TNotes.leetcode/2653. 滑动子数组的美丽值【中等】/README"},{"text":"⏰ 2654. 使数组所有元素变成 1 的最少操作次数【中等】","link":"/TNotes.leetcode/2654. 使数组所有元素变成 1 的最少操作次数【中等】/README"},{"text":"⏰ 2655. 寻找最大长度的未覆盖区间【中等】","link":"/TNotes.leetcode/2655. 寻找最大长度的未覆盖区间【中等】/README"},{"text":"⏰ 2656. K 个元素的最大和【简单】","link":"/TNotes.leetcode/2656. K 个元素的最大和【简单】/README"},{"text":"⏰ 2657. 找到两个数组的前缀公共数组【中等】","link":"/TNotes.leetcode/2657. 找到两个数组的前缀公共数组【中等】/README"},{"text":"⏰ 2658. 网格图中鱼的最大数目【中等】","link":"/TNotes.leetcode/2658. 网格图中鱼的最大数目【中等】/README"},{"text":"⏰ 2659. 将数组清空【困难】","link":"/TNotes.leetcode/2659. 将数组清空【困难】/README"},{"text":"⏰ 2660. 保龄球游戏的获胜者【简单】","link":"/TNotes.leetcode/2660. 保龄球游戏的获胜者【简单】/README"},{"text":"⏰ 2661. 找出叠涂元素【中等】","link":"/TNotes.leetcode/2661. 找出叠涂元素【中等】/README"},{"text":"⏰ 2662. 前往目标的最小代价【中等】","link":"/TNotes.leetcode/2662. 前往目标的最小代价【中等】/README"},{"text":"⏰ 2663. 字典序最小的美丽字符串【困难】","link":"/TNotes.leetcode/2663. 字典序最小的美丽字符串【困难】/README"},{"text":"⏰ 2664. 巡逻的骑士【中等】","link":"/TNotes.leetcode/2664. 巡逻的骑士【中等】/README"},{"text":"⏰ 2665. 计数器 II【简单】","link":"/TNotes.leetcode/2665. 计数器 II【简单】/README"},{"text":"⏰ 2666. 只允许一次函数调用【简单】","link":"/TNotes.leetcode/2666. 只允许一次函数调用【简单】/README"},{"text":"⏰ 2667. 创建 Hello World 函数【简单】","link":"/TNotes.leetcode/2667. 创建 Hello World 函数【简单】/README"},{"text":"⏰ 2668. 查询员工当前薪水【简单】","link":"/TNotes.leetcode/2668. 查询员工当前薪水【简单】/README"},{"text":"⏰ 2669. 统计 Spotify 排行榜上艺术家出现次数【简单】","link":"/TNotes.leetcode/2669. 统计 Spotify 排行榜上艺术家出现次数【简单】/README"},{"text":"⏰ 2670. 找出不同元素数目差数组【简单】","link":"/TNotes.leetcode/2670. 找出不同元素数目差数组【简单】/README"},{"text":"⏰ 2671. 频率跟踪器【中等】","link":"/TNotes.leetcode/2671. 频率跟踪器【中等】/README"},{"text":"⏰ 2672. 有相同颜色的相邻元素数目【中等】","link":"/TNotes.leetcode/2672. 有相同颜色的相邻元素数目【中等】/README"},{"text":"⏰ 2673. 使二叉树所有路径值相等的最小代价【中等】","link":"/TNotes.leetcode/2673. 使二叉树所有路径值相等的最小代价【中等】/README"},{"text":"⏰ 2674. 拆分循环链表【中等】","link":"/TNotes.leetcode/2674. 拆分循环链表【中等】/README"},{"text":"⏰ 2675. 将对象数组转换为矩阵【困难】","link":"/TNotes.leetcode/2675. 将对象数组转换为矩阵【困难】/README"},{"text":"⏰ 2676. 节流【中等】","link":"/TNotes.leetcode/2676. 节流【中等】/README"},{"text":"⏰ 2677. 分块数组【简单】","link":"/TNotes.leetcode/2677. 分块数组【简单】/README"},{"text":"⏰ 2678. 老人的数目【简单】","link":"/TNotes.leetcode/2678. 老人的数目【简单】/README"},{"text":"⏰ 2679. 矩阵中的和【中等】","link":"/TNotes.leetcode/2679. 矩阵中的和【中等】/README"},{"text":"⏰ 2680. 最大或值【中等】","link":"/TNotes.leetcode/2680. 最大或值【中等】/README"},{"text":"⏰ 2681. 英雄的力量【困难】","link":"/TNotes.leetcode/2681. 英雄的力量【困难】/README"},{"text":"⏰ 2682. 找出转圈游戏输家【简单】","link":"/TNotes.leetcode/2682. 找出转圈游戏输家【简单】/README"},{"text":"⏰ 2683. 相邻值的按位异或【中等】","link":"/TNotes.leetcode/2683. 相邻值的按位异或【中等】/README"},{"text":"⏰ 2684. 矩阵中移动的最大次数【中等】","link":"/TNotes.leetcode/2684. 矩阵中移动的最大次数【中等】/README"},{"text":"⏰ 2685. 统计完全连通分量的数量【中等】","link":"/TNotes.leetcode/2685. 统计完全连通分量的数量【中等】/README"},{"text":"⏰ 2686. 即时食物配送 III【中等】","link":"/TNotes.leetcode/2686. 即时食物配送 III【中等】/README"},{"text":"⏰ 2687. 自行车的最后使用时间【简单】","link":"/TNotes.leetcode/2687. 自行车的最后使用时间【简单】/README"},{"text":"⏰ 2688. 查找活跃用户【中等】","link":"/TNotes.leetcode/2688. 查找活跃用户【中等】/README"},{"text":"⏰ 2689. 从 Rope 树中提取第 K 个字符【简单】","link":"/TNotes.leetcode/2689. 从 Rope 树中提取第 K 个字符【简单】/README"},{"text":"⏰ 2690. 无穷方法对象【简单】","link":"/TNotes.leetcode/2690. 无穷方法对象【简单】/README"},{"text":"⏰ 2691. 不可变辅助工具【困难】","link":"/TNotes.leetcode/2691. 不可变辅助工具【困难】/README"},{"text":"⏰ 2692. 使对象不可变【中等】","link":"/TNotes.leetcode/2692. 使对象不可变【中等】/README"},{"text":"⏰ 2693. 使用自定义上下文调用函数【中等】","link":"/TNotes.leetcode/2693. 使用自定义上下文调用函数【中等】/README"},{"text":"⏰ 2694. 事件发射器【中等】","link":"/TNotes.leetcode/2694. 事件发射器【中等】/README"},{"text":"⏰ 2695. 包装数组【简单】","link":"/TNotes.leetcode/2695. 包装数组【简单】/README"},{"text":"⏰ 2696. 删除子串后的字符串最小长度【简单】","link":"/TNotes.leetcode/2696. 删除子串后的字符串最小长度【简单】/README"},{"text":"⏰ 2697. 字典序最小回文串【简单】","link":"/TNotes.leetcode/2697. 字典序最小回文串【简单】/README"},{"text":"⏰ 2698. 求一个整数的惩罚数【中等】","link":"/TNotes.leetcode/2698. 求一个整数的惩罚数【中等】/README"},{"text":"⏰ 2699. 修改图中的边权【困难】","link":"/TNotes.leetcode/2699. 修改图中的边权【困难】/README"},{"text":"⏰ 2700. 两个对象之间的差异【中等】","link":"/TNotes.leetcode/2700. 两个对象之间的差异【中等】/README"},{"text":"⏰ 2701. 连续递增交易【困难】","link":"/TNotes.leetcode/2701. 连续递增交易【困难】/README"},{"text":"⏰ 2702. 使数字变为非正数的最小操作次数【困难】","link":"/TNotes.leetcode/2702. 使数字变为非正数的最小操作次数【困难】/README"},{"text":"⏰ 2703. 返回传递的参数的长度【简单】","link":"/TNotes.leetcode/2703. 返回传递的参数的长度【简单】/README"},{"text":"⏰ 2704. 相等还是不相等【简单】","link":"/TNotes.leetcode/2704. 相等还是不相等【简单】/README"},{"text":"⏰ 2705. 精简对象【中等】","link":"/TNotes.leetcode/2705. 精简对象【中等】/README"},{"text":"⏰ 2706. 购买两块巧克力【简单】","link":"/TNotes.leetcode/2706. 购买两块巧克力【简单】/README"},{"text":"⏰ 2707. 字符串中的额外字符【中等】","link":"/TNotes.leetcode/2707. 字符串中的额外字符【中等】/README"},{"text":"⏰ 2708. 一个小组的最大实力值【中等】","link":"/TNotes.leetcode/2708. 一个小组的最大实力值【中等】/README"},{"text":"⏰ 2709. 最大公约数遍历【困难】","link":"/TNotes.leetcode/2709. 最大公约数遍历【困难】/README"},{"text":"⏰ 2710. 移除字符串中的尾随零【简单】","link":"/TNotes.leetcode/2710. 移除字符串中的尾随零【简单】/README"},{"text":"⏰ 2711. 对角线上不同值的数量差【中等】","link":"/TNotes.leetcode/2711. 对角线上不同值的数量差【中等】/README"},{"text":"⏰ 2712. 使所有字符相等的最小成本【中等】","link":"/TNotes.leetcode/2712. 使所有字符相等的最小成本【中等】/README"},{"text":"⏰ 2713. 矩阵中严格递增的单元格数【困难】","link":"/TNotes.leetcode/2713. 矩阵中严格递增的单元格数【困难】/README"},{"text":"⏰ 2714. 找到 K 次跨越的最短路径【困难】","link":"/TNotes.leetcode/2714. 找到 K 次跨越的最短路径【困难】/README"},{"text":"⏰ 2715. 执行可取消的延迟函数【简单】","link":"/TNotes.leetcode/2715. 执行可取消的延迟函数【简单】/README"},{"text":"⏰ 2716. 最小化字符串长度【简单】","link":"/TNotes.leetcode/2716. 最小化字符串长度【简单】/README"},{"text":"⏰ 2717. 半有序排列【简单】","link":"/TNotes.leetcode/2717. 半有序排列【简单】/README"},{"text":"⏰ 2718. 查询后矩阵的和【中等】","link":"/TNotes.leetcode/2718. 查询后矩阵的和【中等】/README"},{"text":"⏰ 2719. 统计整数数目【困难】","link":"/TNotes.leetcode/2719. 统计整数数目【困难】/README"},{"text":"⏰ 2720. 受欢迎度百分比【困难】","link":"/TNotes.leetcode/2720. 受欢迎度百分比【困难】/README"},{"text":"⏰ 2721. 并行执行异步函数【中等】","link":"/TNotes.leetcode/2721. 并行执行异步函数【中等】/README"},{"text":"⏰ 2722. 根据 ID 合并两个数组【中等】","link":"/TNotes.leetcode/2722. 根据 ID 合并两个数组【中等】/README"},{"text":"⏰ 2723. 两个 Promise 对象相加【简单】","link":"/TNotes.leetcode/2723. 两个 Promise 对象相加【简单】/README"},{"text":"⏰ 2724. 排序方式【简单】","link":"/TNotes.leetcode/2724. 排序方式【简单】/README"},{"text":"⏰ 2725. 间隔取消【简单】","link":"/TNotes.leetcode/2725. 间隔取消【简单】/README"},{"text":"⏰ 2726. 使用方法链的计算器【简单】","link":"/TNotes.leetcode/2726. 使用方法链的计算器【简单】/README"},{"text":"⏰ 2727. 判断对象是否为空【简单】","link":"/TNotes.leetcode/2727. 判断对象是否为空【简单】/README"},{"text":"⏰ 2728. 计算一个环形街道上的房屋数量【简单】","link":"/TNotes.leetcode/2728. 计算一个环形街道上的房屋数量【简单】/README"},{"text":"⏰ 2729. 判断一个数是否迷人【简单】","link":"/TNotes.leetcode/2729. 判断一个数是否迷人【简单】/README"},{"text":"⏰ 2730. 找到最长的半重复子字符串【中等】","link":"/TNotes.leetcode/2730. 找到最长的半重复子字符串【中等】/README"},{"text":"⏰ 2731. 移动机器人【中等】","link":"/TNotes.leetcode/2731. 移动机器人【中等】/README"},{"text":"⏰ 2732. 找到矩阵中的好子集【困难】","link":"/TNotes.leetcode/2732. 找到矩阵中的好子集【困难】/README"},{"text":"⏰ 2733. 既不是最小值也不是最大值【简单】","link":"/TNotes.leetcode/2733. 既不是最小值也不是最大值【简单】/README"},{"text":"⏰ 2734. 执行子串操作后的字典序最小字符串【中等】","link":"/TNotes.leetcode/2734. 执行子串操作后的字典序最小字符串【中等】/README"},{"text":"⏰ 2735. 收集巧克力【中等】","link":"/TNotes.leetcode/2735. 收集巧克力【中等】/README"},{"text":"⏰ 2736. 最大和查询【困难】","link":"/TNotes.leetcode/2736. 最大和查询【困难】/README"},{"text":"⏰ 2737. 找到最近的标记节点【中等】","link":"/TNotes.leetcode/2737. 找到最近的标记节点【中等】/README"},{"text":"⏰ 2738. 统计文本中单词的出现次数【中等】","link":"/TNotes.leetcode/2738. 统计文本中单词的出现次数【中等】/README"},{"text":"⏰ 2739. 总行驶距离【简单】","link":"/TNotes.leetcode/2739. 总行驶距离【简单】/README"},{"text":"⏰ 2740. 找出分区值【中等】","link":"/TNotes.leetcode/2740. 找出分区值【中等】/README"},{"text":"⏰ 2741. 特别的排列【中等】","link":"/TNotes.leetcode/2741. 特别的排列【中等】/README"},{"text":"⏰ 2742. 给墙壁刷油漆【困难】","link":"/TNotes.leetcode/2742. 给墙壁刷油漆【困难】/README"},{"text":"⏰ 2743. 计算没有重复字符的子字符串数量【中等】","link":"/TNotes.leetcode/2743. 计算没有重复字符的子字符串数量【中等】/README"},{"text":"⏰ 2744. 最大字符串配对数目【简单】","link":"/TNotes.leetcode/2744. 最大字符串配对数目【简单】/README"},{"text":"⏰ 2745. 构造最长的新字符串【中等】","link":"/TNotes.leetcode/2745. 构造最长的新字符串【中等】/README"},{"text":"⏰ 2746. 字符串连接删减字母【中等】","link":"/TNotes.leetcode/2746. 字符串连接删减字母【中等】/README"},{"text":"⏰ 2747. 统计没有收到请求的服务器数目【中等】","link":"/TNotes.leetcode/2747. 统计没有收到请求的服务器数目【中等】/README"},{"text":"⏰ 2748. 美丽下标对的数目【简单】","link":"/TNotes.leetcode/2748. 美丽下标对的数目【简单】/README"},{"text":"⏰ 2749. 得到整数零需要执行的最少操作数【中等】","link":"/TNotes.leetcode/2749. 得到整数零需要执行的最少操作数【中等】/README"},{"text":"⏰ 2750. 将数组划分成若干好子数组的方式【中等】","link":"/TNotes.leetcode/2750. 将数组划分成若干好子数组的方式【中等】/README"},{"text":"⏰ 2751. 机器人碰撞【困难】","link":"/TNotes.leetcode/2751. 机器人碰撞【困难】/README"},{"text":"⏰ 2752. 在连续天数上进行了最多交易次数的顾客【困难】","link":"/TNotes.leetcode/2752. 在连续天数上进行了最多交易次数的顾客【困难】/README"},{"text":"⏰ 2753. 计算一个环形街道上的房屋数量 II【困难】","link":"/TNotes.leetcode/2753. 计算一个环形街道上的房屋数量 II【困难】/README"},{"text":"⏰ 2754. 将函数绑定到上下文【中等】","link":"/TNotes.leetcode/2754. 将函数绑定到上下文【中等】/README"},{"text":"⏰ 2755. 深度合并两个对象【中等】","link":"/TNotes.leetcode/2755. 深度合并两个对象【中等】/README"},{"text":"⏰ 2756. 批处理查询【困难】","link":"/TNotes.leetcode/2756. 批处理查询【困难】/README"},{"text":"⏰ 2757. 生成循环数组的值【中等】","link":"/TNotes.leetcode/2757. 生成循环数组的值【中等】/README"},{"text":"⏰ 2758. 下一天【简单】","link":"/TNotes.leetcode/2758. 下一天【简单】/README"},{"text":"⏰ 2759. 将 JSON 字符串转换为对象【困难】","link":"/TNotes.leetcode/2759. 将 JSON 字符串转换为对象【困难】/README"},{"text":"⏰ 2760. 最长奇偶子数组【简单】","link":"/TNotes.leetcode/2760. 最长奇偶子数组【简单】/README"},{"text":"⏰ 2761. 和等于目标值的质数对【中等】","link":"/TNotes.leetcode/2761. 和等于目标值的质数对【中等】/README"},{"text":"⏰ 2762. 不间断子数组【中等】","link":"/TNotes.leetcode/2762. 不间断子数组【中等】/README"},{"text":"⏰ 2763. 所有子数组中不平衡数字之和【困难】","link":"/TNotes.leetcode/2763. 所有子数组中不平衡数字之和【困难】/README"},{"text":"⏰ 2764. 数组是否表示某二叉树的前序遍历【中等】","link":"/TNotes.leetcode/2764. 数组是否表示某二叉树的前序遍历【中等】/README"},{"text":"⏰ 2765. 最长交替子数组【简单】","link":"/TNotes.leetcode/2765. 最长交替子数组【简单】/README"},{"text":"⏰ 2766. 重新放置石块【中等】","link":"/TNotes.leetcode/2766. 重新放置石块【中等】/README"},{"text":"⏰ 2767. 将字符串分割为最少的美丽子字符串【中等】","link":"/TNotes.leetcode/2767. 将字符串分割为最少的美丽子字符串【中等】/README"},{"text":"⏰ 2768. 黑格子的数目【中等】","link":"/TNotes.leetcode/2768. 黑格子的数目【中等】/README"},{"text":"⏰ 2769. 找出最大的可达成数字【简单】","link":"/TNotes.leetcode/2769. 找出最大的可达成数字【简单】/README"},{"text":"⏰ 2770. 达到末尾下标所需的最大跳跃次数【中等】","link":"/TNotes.leetcode/2770. 达到末尾下标所需的最大跳跃次数【中等】/README"},{"text":"⏰ 2771. 构造最长非递减子数组【中等】","link":"/TNotes.leetcode/2771. 构造最长非递减子数组【中等】/README"},{"text":"⏰ 2772. 使数组中的所有元素都等于零【中等】","link":"/TNotes.leetcode/2772. 使数组中的所有元素都等于零【中等】/README"},{"text":"⏰ 2773. 特殊二叉树的高度【中等】","link":"/TNotes.leetcode/2773. 特殊二叉树的高度【中等】/README"},{"text":"⏰ 2774. 数组的上界【简单】","link":"/TNotes.leetcode/2774. 数组的上界【简单】/README"},{"text":"⏰ 2775. 将 undefined 转为 null【中等】","link":"/TNotes.leetcode/2775. 将 undefined 转为 null【中等】/README"},{"text":"⏰ 2776. 转换回调函数为 Promise 函数【中等】","link":"/TNotes.leetcode/2776. 转换回调函数为 Promise 函数【中等】/README"},{"text":"⏰ 2777. 日期范围生成器【中等】","link":"/TNotes.leetcode/2777. 日期范围生成器【中等】/README"},{"text":"⏰ 2778. 特殊元素平方和【简单】","link":"/TNotes.leetcode/2778. 特殊元素平方和【简单】/README"},{"text":"⏰ 2779. 数组的最大美丽值【中等】","link":"/TNotes.leetcode/2779. 数组的最大美丽值【中等】/README"},{"text":"⏰ 2780. 合法分割的最小下标【中等】","link":"/TNotes.leetcode/2780. 合法分割的最小下标【中等】/README"},{"text":"⏰ 2781. 最长合法子字符串的长度【困难】","link":"/TNotes.leetcode/2781. 最长合法子字符串的长度【困难】/README"},{"text":"⏰ 2782. 唯一类别的数量【中等】","link":"/TNotes.leetcode/2782. 唯一类别的数量【中等】/README"},{"text":"⏰ 2783. 航班入座率和等待名单分析【中等】","link":"/TNotes.leetcode/2783. 航班入座率和等待名单分析【中等】/README"},{"text":"⏰ 2784. 检查数组是否是好的【简单】","link":"/TNotes.leetcode/2784. 检查数组是否是好的【简单】/README"},{"text":"⏰ 2785. 将字符串中的元音字母排序【中等】","link":"/TNotes.leetcode/2785. 将字符串中的元音字母排序【中等】/README"},{"text":"⏰ 2786. 访问数组中的位置使分数最大【中等】","link":"/TNotes.leetcode/2786. 访问数组中的位置使分数最大【中等】/README"},{"text":"⏰ 2787. 将一个数字表示成幂的和的方案数【中等】","link":"/TNotes.leetcode/2787. 将一个数字表示成幂的和的方案数【中等】/README"},{"text":"⏰ 2788. 按分隔符拆分字符串【简单】","link":"/TNotes.leetcode/2788. 按分隔符拆分字符串【简单】/README"},{"text":"⏰ 2789. 合并后数组中的最大元素【中等】","link":"/TNotes.leetcode/2789. 合并后数组中的最大元素【中等】/README"},{"text":"⏰ 2790. 长度递增组的最大数目【困难】","link":"/TNotes.leetcode/2790. 长度递增组的最大数目【困难】/README"},{"text":"⏰ 2791. 树中可以形成回文的路径数【困难】","link":"/TNotes.leetcode/2791. 树中可以形成回文的路径数【困难】/README"},{"text":"⏰ 2792. 计算足够大的节点数【困难】","link":"/TNotes.leetcode/2792. 计算足够大的节点数【困难】/README"},{"text":"⏰ 2793. 航班机票状态【困难】","link":"/TNotes.leetcode/2793. 航班机票状态【困难】/README"},{"text":"⏰ 2794. 从两个数组中创建对象【简单】","link":"/TNotes.leetcode/2794. 从两个数组中创建对象【简单】/README"},{"text":"⏰ 2795. 并行执行 Promise 以获取独有的结果【中等】","link":"/TNotes.leetcode/2795. 并行执行 Promise 以获取独有的结果【中等】/README"},{"text":"⏰ 2796. 重复字符串【简单】","link":"/TNotes.leetcode/2796. 重复字符串【简单】/README"},{"text":"⏰ 2797. 带有占位符的部分函数【简单】","link":"/TNotes.leetcode/2797. 带有占位符的部分函数【简单】/README"},{"text":"⏰ 2798. 满足目标工作时长的员工数目【简单】","link":"/TNotes.leetcode/2798. 满足目标工作时长的员工数目【简单】/README"},{"text":"⏰ 2799. 统计完全子数组的数目【中等】","link":"/TNotes.leetcode/2799. 统计完全子数组的数目【中等】/README"},{"text":"⏰ 2800. 包含三个字符串的最短字符串【中等】","link":"/TNotes.leetcode/2800. 包含三个字符串的最短字符串【中等】/README"},{"text":"⏰ 2801. 统计范围内的步进数字数目【困难】","link":"/TNotes.leetcode/2801. 统计范围内的步进数字数目【困难】/README"},{"text":"⏰ 2802. 找出第 K 个幸运数字【中等】","link":"/TNotes.leetcode/2802. 找出第 K 个幸运数字【中等】/README"},{"text":"⏰ 2803. 阶乘生成器【简单】","link":"/TNotes.leetcode/2803. 阶乘生成器【简单】/README"},{"text":"⏰ 2804. 数组原型的 forEach 方法【简单】","link":"/TNotes.leetcode/2804. 数组原型的 forEach 方法【简单】/README"},{"text":"⏰ 2805. 自定义间隔【中等】","link":"/TNotes.leetcode/2805. 自定义间隔【中等】/README"},{"text":"⏰ 2806. 取整购买后的账户余额【简单】","link":"/TNotes.leetcode/2806. 取整购买后的账户余额【简单】/README"},{"text":"⏰ 2807. 在链表中插入最大公约数【中等】","link":"/TNotes.leetcode/2807. 在链表中插入最大公约数【中等】/README"},{"text":"⏰ 2808. 使循环数组所有元素相等的最少秒数【中等】","link":"/TNotes.leetcode/2808. 使循环数组所有元素相等的最少秒数【中等】/README"},{"text":"⏰ 2809. 使数组和小于等于 x 的最少时间【困难】","link":"/TNotes.leetcode/2809. 使数组和小于等于 x 的最少时间【困难】/README"},{"text":"⏰ 2810. 故障键盘【简单】","link":"/TNotes.leetcode/2810. 故障键盘【简单】/README"},{"text":"⏰ 2811. 判断是否能拆分数组【中等】","link":"/TNotes.leetcode/2811. 判断是否能拆分数组【中等】/README"},{"text":"⏰ 2812. 找出最安全路径【中等】","link":"/TNotes.leetcode/2812. 找出最安全路径【中等】/README"},{"text":"⏰ 2813. 子序列最大优雅度【困难】","link":"/TNotes.leetcode/2813. 子序列最大优雅度【困难】/README"},{"text":"⏰ 2814. 避免淹死并到达目的地的最短时间【困难】","link":"/TNotes.leetcode/2814. 避免淹死并到达目的地的最短时间【困难】/README"},{"text":"⏰ 2815. 数组中的最大数对和【简单】","link":"/TNotes.leetcode/2815. 数组中的最大数对和【简单】/README"},{"text":"⏰ 2816. 翻倍以链表形式表示的数字【中等】","link":"/TNotes.leetcode/2816. 翻倍以链表形式表示的数字【中等】/README"},{"text":"⏰ 2817. 限制条件下元素之间的最小绝对差【中等】","link":"/TNotes.leetcode/2817. 限制条件下元素之间的最小绝对差【中等】/README"},{"text":"⏰ 2818. 操作使得分最大【困难】","link":"/TNotes.leetcode/2818. 操作使得分最大【困难】/README"},{"text":"⏰ 2819. 购买巧克力后的最小相对损失【困难】","link":"/TNotes.leetcode/2819. 购买巧克力后的最小相对损失【困难】/README"},{"text":"⏰ 2820. 选举结果【中等】","link":"/TNotes.leetcode/2820. 选举结果【中等】/README"},{"text":"⏰ 2821. 延迟每个 Promise 对象的解析【中等】","link":"/TNotes.leetcode/2821. 延迟每个 Promise 对象的解析【中等】/README"},{"text":"⏰ 2822. 对象反转【简单】","link":"/TNotes.leetcode/2822. 对象反转【简单】/README"},{"text":"⏰ 2823. 深度对象筛选【中等】","link":"/TNotes.leetcode/2823. 深度对象筛选【中等】/README"},{"text":"⏰ 2824. 统计和小于目标的下标对数目【简单】","link":"/TNotes.leetcode/2824. 统计和小于目标的下标对数目【简单】/README"},{"text":"⏰ 2825. 循环增长使字符串子序列等于另一个字符串【中等】","link":"/TNotes.leetcode/2825. 循环增长使字符串子序列等于另一个字符串【中等】/README"},{"text":"⏰ 2826. 将三个组排序【中等】","link":"/TNotes.leetcode/2826. 将三个组排序【中等】/README"},{"text":"⏰ 2827. 范围中美丽整数的数目【困难】","link":"/TNotes.leetcode/2827. 范围中美丽整数的数目【困难】/README"},{"text":"⏰ 2828. 判别首字母缩略词【简单】","link":"/TNotes.leetcode/2828. 判别首字母缩略词【简单】/README"},{"text":"⏰ 2829. k-avoiding 数组的最小总和【中等】","link":"/TNotes.leetcode/2829. k-avoiding 数组的最小总和【中等】/README"},{"text":"⏰ 2830. 销售利润最大化【中等】","link":"/TNotes.leetcode/2830. 销售利润最大化【中等】/README"},{"text":"⏰ 2831. 找出最长等值子数组【中等】","link":"/TNotes.leetcode/2831. 找出最长等值子数组【中等】/README"},{"text":"⏰ 2832. 每个元素为最大值的最大范围【中等】","link":"/TNotes.leetcode/2832. 每个元素为最大值的最大范围【中等】/README"},{"text":"⏰ 2833. 距离原点最远的点【简单】","link":"/TNotes.leetcode/2833. 距离原点最远的点【简单】/README"},{"text":"⏰ 2834. 找出美丽数组的最小和【中等】","link":"/TNotes.leetcode/2834. 找出美丽数组的最小和【中等】/README"},{"text":"⏰ 2835. 使子序列的和等于目标的最少操作次数【困难】","link":"/TNotes.leetcode/2835. 使子序列的和等于目标的最少操作次数【困难】/README"},{"text":"⏰ 2836. 在传球游戏中最大化函数值【困难】","link":"/TNotes.leetcode/2836. 在传球游戏中最大化函数值【困难】/README"},{"text":"⏰ 2837. 总旅行距离【简单】","link":"/TNotes.leetcode/2837. 总旅行距离【简单】/README"},{"text":"⏰ 2838. 英雄可以获得的最大金币数【中等】","link":"/TNotes.leetcode/2838. 英雄可以获得的最大金币数【中等】/README"},{"text":"⏰ 2839. 判断通过操作能否让字符串相等 I【简单】","link":"/TNotes.leetcode/2839. 判断通过操作能否让字符串相等 I【简单】/README"},{"text":"⏰ 2840. 判断通过操作能否让字符串相等 II【中等】","link":"/TNotes.leetcode/2840. 判断通过操作能否让字符串相等 II【中等】/README"},{"text":"⏰ 2841. 几乎唯一子数组的最大和【中等】","link":"/TNotes.leetcode/2841. 几乎唯一子数组的最大和【中等】/README"},{"text":"⏰ 2842. 统计一个字符串的 k 子序列美丽值最大的数目【困难】","link":"/TNotes.leetcode/2842. 统计一个字符串的 k 子序列美丽值最大的数目【困难】/README"},{"text":"⏰ 2843. 统计对称整数的数目【简单】","link":"/TNotes.leetcode/2843. 统计对称整数的数目【简单】/README"},{"text":"⏰ 2844. 生成特殊数字的最少操作【中等】","link":"/TNotes.leetcode/2844. 生成特殊数字的最少操作【中等】/README"},{"text":"⏰ 2845. 统计趣味子数组的数目【中等】","link":"/TNotes.leetcode/2845. 统计趣味子数组的数目【中等】/README"},{"text":"⏰ 2846. 边权重均等查询【困难】","link":"/TNotes.leetcode/2846. 边权重均等查询【困难】/README"},{"text":"⏰ 2847. 给定数字乘积的最小数字【中等】","link":"/TNotes.leetcode/2847. 给定数字乘积的最小数字【中等】/README"},{"text":"⏰ 2848. 与车相交的点【简单】","link":"/TNotes.leetcode/2848. 与车相交的点【简单】/README"},{"text":"⏰ 2849. 判断能否在给定时间到达单元格【中等】","link":"/TNotes.leetcode/2849. 判断能否在给定时间到达单元格【中等】/README"},{"text":"⏰ 2850. 将石头分散到网格图的最少移动次数【中等】","link":"/TNotes.leetcode/2850. 将石头分散到网格图的最少移动次数【中等】/README"},{"text":"⏰ 2851. 字符串转换【困难】","link":"/TNotes.leetcode/2851. 字符串转换【困难】/README"},{"text":"⏰ 2852. 所有单元格的远离程度之和【中等】","link":"/TNotes.leetcode/2852. 所有单元格的远离程度之和【中等】/README"},{"text":"⏰ 2853. 最高薪水差异【简单】","link":"/TNotes.leetcode/2853. 最高薪水差异【简单】/README"},{"text":"⏰ 2854. 滚动平均步数【中等】","link":"/TNotes.leetcode/2854. 滚动平均步数【中等】/README"},{"text":"⏰ 2855. 使数组成为递增数组的最少右移次数【简单】","link":"/TNotes.leetcode/2855. 使数组成为递增数组的最少右移次数【简单】/README"},{"text":"⏰ 2856. 删除数对后的最小数组长度【中等】","link":"/TNotes.leetcode/2856. 删除数对后的最小数组长度【中等】/README"},{"text":"⏰ 2857. 统计距离为 k 的点对【中等】","link":"/TNotes.leetcode/2857. 统计距离为 k 的点对【中等】/README"},{"text":"⏰ 2858. 可以到达每一个节点的最少边反转次数【困难】","link":"/TNotes.leetcode/2858. 可以到达每一个节点的最少边反转次数【困难】/README"},{"text":"⏰ 2859. 计算 K 置位下标对应元素的和【简单】","link":"/TNotes.leetcode/2859. 计算 K 置位下标对应元素的和【简单】/README"},{"text":"⏰ 2860. 让所有学生保持开心的分组方法数【中等】","link":"/TNotes.leetcode/2860. 让所有学生保持开心的分组方法数【中等】/README"},{"text":"⏰ 2861. 最大合金数【中等】","link":"/TNotes.leetcode/2861. 最大合金数【中等】/README"},{"text":"⏰ 2862. 完全子集的最大元素和【困难】","link":"/TNotes.leetcode/2862. 完全子集的最大元素和【困难】/README"},{"text":"⏰ 2863. 最长半递减子数组的长度【中等】","link":"/TNotes.leetcode/2863. 最长半递减子数组的长度【中等】/README"},{"text":"⏰ 2864. 最大二进制奇数【简单】","link":"/TNotes.leetcode/2864. 最大二进制奇数【简单】/README"},{"text":"⏰ 2865. 美丽塔 I【中等】","link":"/TNotes.leetcode/2865. 美丽塔 I【中等】/README"},{"text":"⏰ 2866. 美丽塔 II【中等】","link":"/TNotes.leetcode/2866. 美丽塔 II【中等】/README"},{"text":"⏰ 2867. 统计树中的合法路径数目【困难】","link":"/TNotes.leetcode/2867. 统计树中的合法路径数目【困难】/README"},{"text":"⏰ 2868. 单词游戏【困难】","link":"/TNotes.leetcode/2868. 单词游戏【困难】/README"},{"text":"⏰ 2869. 收集元素的最少操作次数【简单】","link":"/TNotes.leetcode/2869. 收集元素的最少操作次数【简单】/README"},{"text":"⏰ 2870. 使数组为空的最少操作次数【中等】","link":"/TNotes.leetcode/2870. 使数组为空的最少操作次数【中等】/README"},{"text":"⏰ 2871. 将数组分割成最多数目的子数组【中等】","link":"/TNotes.leetcode/2871. 将数组分割成最多数目的子数组【中等】/README"},{"text":"⏰ 2872. 可以被 K 整除连通块的最大数目【困难】","link":"/TNotes.leetcode/2872. 可以被 K 整除连通块的最大数目【困难】/README"},{"text":"⏰ 2873. 有序三元组中的最大值 I【简单】","link":"/TNotes.leetcode/2873. 有序三元组中的最大值 I【简单】/README"},{"text":"⏰ 2874. 有序三元组中的最大值 II【中等】","link":"/TNotes.leetcode/2874. 有序三元组中的最大值 II【中等】/README"},{"text":"⏰ 2875. 无限数组的最短子数组【中等】","link":"/TNotes.leetcode/2875. 无限数组的最短子数组【中等】/README"},{"text":"⏰ 2876. 有向图访问计数【困难】","link":"/TNotes.leetcode/2876. 有向图访问计数【困难】/README"},{"text":"⏰ 2877. 从表中创建 DataFrame【简单】","link":"/TNotes.leetcode/2877. 从表中创建 DataFrame【简单】/README"},{"text":"⏰ 2878. 获取 DataFrame 的大小【简单】","link":"/TNotes.leetcode/2878. 获取 DataFrame 的大小【简单】/README"},{"text":"⏰ 2879. 显示前三行【简单】","link":"/TNotes.leetcode/2879. 显示前三行【简单】/README"},{"text":"⏰ 2880. 数据选取【简单】","link":"/TNotes.leetcode/2880. 数据选取【简单】/README"},{"text":"⏰ 2881. 创建新列【简单】","link":"/TNotes.leetcode/2881. 创建新列【简单】/README"},{"text":"⏰ 2882. 删去重复的行【简单】","link":"/TNotes.leetcode/2882. 删去重复的行【简单】/README"},{"text":"⏰ 2883. 删去丢失的数据【简单】","link":"/TNotes.leetcode/2883. 删去丢失的数据【简单】/README"},{"text":"⏰ 2884. 修改列【简单】","link":"/TNotes.leetcode/2884. 修改列【简单】/README"},{"text":"⏰ 2885. 重命名列【简单】","link":"/TNotes.leetcode/2885. 重命名列【简单】/README"},{"text":"⏰ 2886. 改变数据类型【简单】","link":"/TNotes.leetcode/2886. 改变数据类型【简单】/README"},{"text":"⏰ 2887. 填充缺失值【简单】","link":"/TNotes.leetcode/2887. 填充缺失值【简单】/README"},{"text":"⏰ 2888. 重塑数据：连结【简单】","link":"/TNotes.leetcode/2888. 重塑数据：连结【简单】/README"},{"text":"⏰ 2889. 数据重塑：透视【简单】","link":"/TNotes.leetcode/2889. 数据重塑：透视【简单】/README"},{"text":"⏰ 2890. 重塑数据：融合【简单】","link":"/TNotes.leetcode/2890. 重塑数据：融合【简单】/README"},{"text":"⏰ 2891. 方法链【简单】","link":"/TNotes.leetcode/2891. 方法链【简单】/README"},{"text":"⏰ 2892. 将相邻元素相乘后得到最小化数组【中等】","link":"/TNotes.leetcode/2892. 将相邻元素相乘后得到最小化数组【中等】/README"},{"text":"⏰ 2893. 计算每个区间内的订单【中等】","link":"/TNotes.leetcode/2893. 计算每个区间内的订单【中等】/README"},{"text":"⏰ 2894. 分类求和并作差【简单】","link":"/TNotes.leetcode/2894. 分类求和并作差【简单】/README"},{"text":"⏰ 2895. 最小处理时间【中等】","link":"/TNotes.leetcode/2895. 最小处理时间【中等】/README"},{"text":"⏰ 2896. 执行操作使两个字符串相等【中等】","link":"/TNotes.leetcode/2896. 执行操作使两个字符串相等【中等】/README"},{"text":"⏰ 2897. 对数组执行操作使平方和最大【困难】","link":"/TNotes.leetcode/2897. 对数组执行操作使平方和最大【困难】/README"},{"text":"⏰ 2898. 最大线性股票得分【中等】","link":"/TNotes.leetcode/2898. 最大线性股票得分【中等】/README"},{"text":"⏰ 2899. 上一个遍历的整数【简单】","link":"/TNotes.leetcode/2899. 上一个遍历的整数【简单】/README"},{"text":"⏰ 2900. 最长相邻不相等子序列 I【简单】","link":"/TNotes.leetcode/2900. 最长相邻不相等子序列 I【简单】/README"},{"text":"⏰ 2901. 最长相邻不相等子序列 II【中等】","link":"/TNotes.leetcode/2901. 最长相邻不相等子序列 II【中等】/README"},{"text":"⏰ 2902. 和带限制的子多重集合的数目【困难】","link":"/TNotes.leetcode/2902. 和带限制的子多重集合的数目【困难】/README"},{"text":"⏰ 2903. 找出满足差值条件的下标 I【简单】","link":"/TNotes.leetcode/2903. 找出满足差值条件的下标 I【简单】/README"},{"text":"⏰ 2904. 最短且字典序最小的美丽子字符串【中等】","link":"/TNotes.leetcode/2904. 最短且字典序最小的美丽子字符串【中等】/README"},{"text":"⏰ 2905. 找出满足差值条件的下标 II【中等】","link":"/TNotes.leetcode/2905. 找出满足差值条件的下标 II【中等】/README"},{"text":"⏰ 2906. 构造乘积矩阵【中等】","link":"/TNotes.leetcode/2906. 构造乘积矩阵【中等】/README"},{"text":"⏰ 2907. 价格递增的最大利润三元组 I【中等】","link":"/TNotes.leetcode/2907. 价格递增的最大利润三元组 I【中等】/README"},{"text":"⏰ 2908. 元素和最小的山形三元组 I【简单】","link":"/TNotes.leetcode/2908. 元素和最小的山形三元组 I【简单】/README"},{"text":"⏰ 2909. 元素和最小的山形三元组 II【中等】","link":"/TNotes.leetcode/2909. 元素和最小的山形三元组 II【中等】/README"},{"text":"⏰ 2910. 合法分组的最少组数【中等】","link":"/TNotes.leetcode/2910. 合法分组的最少组数【中等】/README"},{"text":"⏰ 2911. 得到 K 个半回文串的最少修改次数【困难】","link":"/TNotes.leetcode/2911. 得到 K 个半回文串的最少修改次数【困难】/README"},{"text":"⏰ 2912. 在网格上移动到目的地的方法数【困难】","link":"/TNotes.leetcode/2912. 在网格上移动到目的地的方法数【困难】/README"},{"text":"⏰ 2913. 子数组不同元素数目的平方和 I【简单】","link":"/TNotes.leetcode/2913. 子数组不同元素数目的平方和 I【简单】/README"},{"text":"⏰ 2914. 使二进制字符串变美丽的最少修改次数【中等】","link":"/TNotes.leetcode/2914. 使二进制字符串变美丽的最少修改次数【中等】/README"},{"text":"⏰ 2915. 和为目标值的最长子序列的长度【中等】","link":"/TNotes.leetcode/2915. 和为目标值的最长子序列的长度【中等】/README"},{"text":"⏰ 2916. 子数组不同元素数目的平方和 II【困难】","link":"/TNotes.leetcode/2916. 子数组不同元素数目的平方和 II【困难】/README"},{"text":"⏰ 2917. 找出数组中的 K-or 值【简单】","link":"/TNotes.leetcode/2917. 找出数组中的 K-or 值【简单】/README"},{"text":"⏰ 2918. 数组的最小相等和【中等】","link":"/TNotes.leetcode/2918. 数组的最小相等和【中等】/README"},{"text":"⏰ 2919. 使数组变美的最小增量运算数【中等】","link":"/TNotes.leetcode/2919. 使数组变美的最小增量运算数【中等】/README"},{"text":"⏰ 2920. 收集所有金币可获得的最大积分【困难】","link":"/TNotes.leetcode/2920. 收集所有金币可获得的最大积分【困难】/README"},{"text":"⏰ 2921. 价格递增的最大利润三元组 II【困难】","link":"/TNotes.leetcode/2921. 价格递增的最大利润三元组 II【困难】/README"},{"text":"⏰ 2922. 市场分析 III【中等】","link":"/TNotes.leetcode/2922. 市场分析 III【中等】/README"},{"text":"⏰ 2923. 找到冠军 I【简单】","link":"/TNotes.leetcode/2923. 找到冠军 I【简单】/README"},{"text":"⏰ 2924. 找到冠军 II【中等】","link":"/TNotes.leetcode/2924. 找到冠军 II【中等】/README"},{"text":"⏰ 2925. 在树上执行操作以后得到的最大分数【中等】","link":"/TNotes.leetcode/2925. 在树上执行操作以后得到的最大分数【中等】/README"},{"text":"⏰ 2926. 平衡子序列的最大和【困难】","link":"/TNotes.leetcode/2926. 平衡子序列的最大和【困难】/README"},{"text":"⏰ 2927. 给小朋友们分糖果 III【困难】","link":"/TNotes.leetcode/2927. 给小朋友们分糖果 III【困难】/README"},{"text":"⏰ 2928. 给小朋友们分糖果 I【简单】","link":"/TNotes.leetcode/2928. 给小朋友们分糖果 I【简单】/README"},{"text":"⏰ 2929. 给小朋友们分糖果 II【中等】","link":"/TNotes.leetcode/2929. 给小朋友们分糖果 II【中等】/README"},{"text":"⏰ 2930. 重新排列后包含指定子字符串的字符串数目【中等】","link":"/TNotes.leetcode/2930. 重新排列后包含指定子字符串的字符串数目【中等】/README"},{"text":"⏰ 2931. 购买物品的最大开销【困难】","link":"/TNotes.leetcode/2931. 购买物品的最大开销【困难】/README"},{"text":"⏰ 2932. 找出强数对的最大异或值 I【简单】","link":"/TNotes.leetcode/2932. 找出强数对的最大异或值 I【简单】/README"},{"text":"⏰ 2933. 高访问员工【中等】","link":"/TNotes.leetcode/2933. 高访问员工【中等】/README"},{"text":"⏰ 2934. 最大化数组末位元素的最少操作次数【中等】","link":"/TNotes.leetcode/2934. 最大化数组末位元素的最少操作次数【中等】/README"},{"text":"⏰ 2935. 找出强数对的最大异或值 II【困难】","link":"/TNotes.leetcode/2935. 找出强数对的最大异或值 II【困难】/README"},{"text":"⏰ 2936. 包含相等值数字块的数量【中等】","link":"/TNotes.leetcode/2936. 包含相等值数字块的数量【中等】/README"},{"text":"⏰ 2937. 使三个字符串相等【简单】","link":"/TNotes.leetcode/2937. 使三个字符串相等【简单】/README"},{"text":"⏰ 2938. 区分黑球与白球【中等】","link":"/TNotes.leetcode/2938. 区分黑球与白球【中等】/README"},{"text":"⏰ 2939. 最大异或乘积【中等】","link":"/TNotes.leetcode/2939. 最大异或乘积【中等】/README"},{"text":"⏰ 2940. 找到 Alice 和 Bob 可以相遇的建筑【困难】","link":"/TNotes.leetcode/2940. 找到 Alice 和 Bob 可以相遇的建筑【困难】/README"},{"text":"⏰ 2941. 子数组的最大 GCD-Sum【困难】","link":"/TNotes.leetcode/2941. 子数组的最大 GCD-Sum【困难】/README"},{"text":"⏰ 2942. 查找包含给定字符的单词【简单】","link":"/TNotes.leetcode/2942. 查找包含给定字符的单词【简单】/README"},{"text":"⏰ 2943. 最大化网格图中正方形空洞的面积【中等】","link":"/TNotes.leetcode/2943. 最大化网格图中正方形空洞的面积【中等】/README"},{"text":"⏰ 2944. 购买水果需要的最少金币数【中等】","link":"/TNotes.leetcode/2944. 购买水果需要的最少金币数【中等】/README"},{"text":"⏰ 2945. 找到最大非递减数组的长度【困难】","link":"/TNotes.leetcode/2945. 找到最大非递减数组的长度【困难】/README"},{"text":"⏰ 2946. 循环移位后的矩阵相似检查【简单】","link":"/TNotes.leetcode/2946. 循环移位后的矩阵相似检查【简单】/README"},{"text":"⏰ 2947. 统计美丽子字符串 I【中等】","link":"/TNotes.leetcode/2947. 统计美丽子字符串 I【中等】/README"},{"text":"⏰ 2948. 交换得到字典序最小的数组【中等】","link":"/TNotes.leetcode/2948. 交换得到字典序最小的数组【中等】/README"},{"text":"⏰ 2949. 统计美丽子字符串 II【困难】","link":"/TNotes.leetcode/2949. 统计美丽子字符串 II【困难】/README"},{"text":"⏰ 2950. 可整除子串的数量【中等】","link":"/TNotes.leetcode/2950. 可整除子串的数量【中等】/README"},{"text":"⏰ 2951. 找出峰值【简单】","link":"/TNotes.leetcode/2951. 找出峰值【简单】/README"},{"text":"⏰ 2952. 需要添加的硬币的最小数量【中等】","link":"/TNotes.leetcode/2952. 需要添加的硬币的最小数量【中等】/README"},{"text":"⏰ 2953. 统计完全子字符串【困难】","link":"/TNotes.leetcode/2953. 统计完全子字符串【困难】/README"},{"text":"⏰ 2954. 统计感冒序列的数目【困难】","link":"/TNotes.leetcode/2954. 统计感冒序列的数目【困难】/README"},{"text":"⏰ 2955. 同端子串的数量【中等】","link":"/TNotes.leetcode/2955. 同端子串的数量【中等】/README"},{"text":"⏰ 2956. 找到两个数组中的公共元素【简单】","link":"/TNotes.leetcode/2956. 找到两个数组中的公共元素【简单】/README"},{"text":"⏰ 2957. 消除相邻近似相等字符【中等】","link":"/TNotes.leetcode/2957. 消除相邻近似相等字符【中等】/README"},{"text":"⏰ 2958. 最多 K 个重复元素的最长子数组【中等】","link":"/TNotes.leetcode/2958. 最多 K 个重复元素的最长子数组【中等】/README"},{"text":"⏰ 2959. 关闭分部的可行集合数目【困难】","link":"/TNotes.leetcode/2959. 关闭分部的可行集合数目【困难】/README"},{"text":"⏰ 2960. 统计已测试设备【简单】","link":"/TNotes.leetcode/2960. 统计已测试设备【简单】/README"},{"text":"⏰ 2961. 双模幂运算【中等】","link":"/TNotes.leetcode/2961. 双模幂运算【中等】/README"},{"text":"⏰ 2962. 统计最大元素出现至少 K 次的子数组【中等】","link":"/TNotes.leetcode/2962. 统计最大元素出现至少 K 次的子数组【中等】/README"},{"text":"⏰ 2963. 统计好分割方案的数目【困难】","link":"/TNotes.leetcode/2963. 统计好分割方案的数目【困难】/README"},{"text":"⏰ 2964. 可被整除的三元组数量【中等】","link":"/TNotes.leetcode/2964. 可被整除的三元组数量【中等】/README"},{"text":"⏰ 2965. 找出缺失和重复的数字【简单】","link":"/TNotes.leetcode/2965. 找出缺失和重复的数字【简单】/README"},{"text":"⏰ 2966. 划分数组并满足最大差限制【中等】","link":"/TNotes.leetcode/2966. 划分数组并满足最大差限制【中等】/README"},{"text":"⏰ 2967. 使数组成为等数数组的最小代价【中等】","link":"/TNotes.leetcode/2967. 使数组成为等数数组的最小代价【中等】/README"},{"text":"⏰ 2968. 执行操作使频率分数最大【困难】","link":"/TNotes.leetcode/2968. 执行操作使频率分数最大【困难】/README"},{"text":"⏰ 2969. 购买水果需要的最少金币数 II【困难】","link":"/TNotes.leetcode/2969. 购买水果需要的最少金币数 II【困难】/README"},{"text":"⏰ 2970. 统计移除递增子数组的数目 I【简单】","link":"/TNotes.leetcode/2970. 统计移除递增子数组的数目 I【简单】/README"},{"text":"⏰ 2971. 找到最大周长的多边形【中等】","link":"/TNotes.leetcode/2971. 找到最大周长的多边形【中等】/README"},{"text":"⏰ 2972. 统计移除递增子数组的数目 II【困难】","link":"/TNotes.leetcode/2972. 统计移除递增子数组的数目 II【困难】/README"},{"text":"⏰ 2973. 树中每个节点放置的金币数目【困难】","link":"/TNotes.leetcode/2973. 树中每个节点放置的金币数目【困难】/README"},{"text":"⏰ 2974. 最小数字游戏【简单】","link":"/TNotes.leetcode/2974. 最小数字游戏【简单】/README"},{"text":"⏰ 2975. 移除栅栏得到的正方形田地的最大面积【中等】","link":"/TNotes.leetcode/2975. 移除栅栏得到的正方形田地的最大面积【中等】/README"},{"text":"⏰ 2976. 转换字符串的最小成本 I【中等】","link":"/TNotes.leetcode/2976. 转换字符串的最小成本 I【中等】/README"},{"text":"⏰ 2977. 转换字符串的最小成本 II【困难】","link":"/TNotes.leetcode/2977. 转换字符串的最小成本 II【困难】/README"},{"text":"⏰ 2978. 对称坐标【中等】","link":"/TNotes.leetcode/2978. 对称坐标【中等】/README"},{"text":"⏰ 2979. 最贵的无法购买的商品【中等】","link":"/TNotes.leetcode/2979. 最贵的无法购买的商品【中等】/README"},{"text":"⏰ 2980. 检查按位或是否存在尾随零【简单】","link":"/TNotes.leetcode/2980. 检查按位或是否存在尾随零【简单】/README"},{"text":"⏰ 2981. 找出出现至少三次的最长特殊子字符串 I【中等】","link":"/TNotes.leetcode/2981. 找出出现至少三次的最长特殊子字符串 I【中等】/README"},{"text":"⏰ 2982. 找出出现至少三次的最长特殊子字符串 II【中等】","link":"/TNotes.leetcode/2982. 找出出现至少三次的最长特殊子字符串 II【中等】/README"},{"text":"⏰ 2983. 回文串重新排列查询【困难】","link":"/TNotes.leetcode/2983. 回文串重新排列查询【困难】/README"},{"text":"⏰ 2984. 找到每座城市的高峰通话时间【中等】","link":"/TNotes.leetcode/2984. 找到每座城市的高峰通话时间【中等】/README"},{"text":"⏰ 2985. 计算订单平均商品数量【简单】","link":"/TNotes.leetcode/2985. 计算订单平均商品数量【简单】/README"},{"text":"⏰ 2986. 找到第三笔交易【中等】","link":"/TNotes.leetcode/2986. 找到第三笔交易【中等】/README"},{"text":"⏰ 2987. 寻找房价最贵的城市【简单】","link":"/TNotes.leetcode/2987. 寻找房价最贵的城市【简单】/README"},{"text":"⏰ 2988. 最大部门的经理【中等】","link":"/TNotes.leetcode/2988. 最大部门的经理【中等】/README"},{"text":"⏰ 2989. 班级表现【中等】","link":"/TNotes.leetcode/2989. 班级表现【中等】/README"},{"text":"⏰ 2990. 贷款类型【简单】","link":"/TNotes.leetcode/2990. 贷款类型【简单】/README"},{"text":"⏰ 2991. 最好的三家酒庄【困难】","link":"/TNotes.leetcode/2991. 最好的三家酒庄【困难】/README"},{"text":"⏰ 2992. 自整除排列的数量【中等】","link":"/TNotes.leetcode/2992. 自整除排列的数量【中等】/README"},{"text":"⏰ 2993. 发生在周五的交易 I【中等】","link":"/TNotes.leetcode/2993. 发生在周五的交易 I【中等】/README"},{"text":"⏰ 2994. 发生在周五的交易 II【困难】","link":"/TNotes.leetcode/2994. 发生在周五的交易 II【困难】/README"},{"text":"⏰ 2995. 观众变主播【困难】","link":"/TNotes.leetcode/2995. 观众变主播【困难】/README"},{"text":"⏰ 2996. 大于等于顺序前缀和的最小缺失整数【简单】","link":"/TNotes.leetcode/2996. 大于等于顺序前缀和的最小缺失整数【简单】/README"},{"text":"⏰ 2997. 使数组异或和等于 K 的最少操作次数【中等】","link":"/TNotes.leetcode/2997. 使数组异或和等于 K 的最少操作次数【中等】/README"},{"text":"⏰ 2998. 使 X 和 Y 相等的最少操作次数【中等】","link":"/TNotes.leetcode/2998. 使 X 和 Y 相等的最少操作次数【中等】/README"},{"text":"⏰ 2999. 统计强大整数的数目【困难】","link":"/TNotes.leetcode/2999. 统计强大整数的数目【困难】/README"},{"text":"⏰ 3000. 对角线最长的矩形的面积【简单】","link":"/TNotes.leetcode/3000. 对角线最长的矩形的面积【简单】/README"},{"text":"⏰ 3001. 捕获黑皇后需要的最少移动次数【中等】","link":"/TNotes.leetcode/3001. 捕获黑皇后需要的最少移动次数【中等】/README"},{"text":"⏰ 3002. 移除后集合的最多元素数【中等】","link":"/TNotes.leetcode/3002. 移除后集合的最多元素数【中等】/README"},{"text":"⏰ 3003. 执行操作后的最大分割数量【困难】","link":"/TNotes.leetcode/3003. 执行操作后的最大分割数量【困难】/README"},{"text":"⏰ 3004. 相同颜色的最大子树【中等】","link":"/TNotes.leetcode/3004. 相同颜色的最大子树【中等】/README"},{"text":"⏰ 3005. 最大频率元素计数【简单】","link":"/TNotes.leetcode/3005. 最大频率元素计数【简单】/README"},{"text":"⏰ 3006. 找出数组中的美丽下标 I【中等】","link":"/TNotes.leetcode/3006. 找出数组中的美丽下标 I【中等】/README"},{"text":"⏰ 3007. 价值和小于等于 K 的最大数字【中等】","link":"/TNotes.leetcode/3007. 价值和小于等于 K 的最大数字【中等】/README"},{"text":"⏰ 3008. 找出数组中的美丽下标 II【困难】","link":"/TNotes.leetcode/3008. 找出数组中的美丽下标 II【困难】/README"},{"text":"⏰ 3009. 折线图上的最大交点数量【困难】","link":"/TNotes.leetcode/3009. 折线图上的最大交点数量【困难】/README"},{"text":"⏰ 3010. 将数组分成最小总代价的子数组 I【简单】","link":"/TNotes.leetcode/3010. 将数组分成最小总代价的子数组 I【简单】/README"},{"text":"⏰ 3011. 判断一个数组是否可以变为有序【中等】","link":"/TNotes.leetcode/3011. 判断一个数组是否可以变为有序【中等】/README"},{"text":"⏰ 3012. 通过操作使数组长度最小【中等】","link":"/TNotes.leetcode/3012. 通过操作使数组长度最小【中等】/README"},{"text":"⏰ 3013. 将数组分成最小总代价的子数组 II【困难】","link":"/TNotes.leetcode/3013. 将数组分成最小总代价的子数组 II【困难】/README"},{"text":"⏰ 3014. 输入单词需要的最少按键次数 I【简单】","link":"/TNotes.leetcode/3014. 输入单词需要的最少按键次数 I【简单】/README"},{"text":"⏰ 3015. 按距离统计房屋对数目 I【中等】","link":"/TNotes.leetcode/3015. 按距离统计房屋对数目 I【中等】/README"},{"text":"⏰ 3016. 输入单词需要的最少按键次数 II【中等】","link":"/TNotes.leetcode/3016. 输入单词需要的最少按键次数 II【中等】/README"},{"text":"⏰ 3017. 按距离统计房屋对数目 II【困难】","link":"/TNotes.leetcode/3017. 按距离统计房屋对数目 II【困难】/README"},{"text":"⏰ 3018. 可处理的最大删除操作数 I【困难】","link":"/TNotes.leetcode/3018. 可处理的最大删除操作数 I【困难】/README"},{"text":"⏰ 3019. 按键变更的次数【简单】","link":"/TNotes.leetcode/3019. 按键变更的次数【简单】/README"},{"text":"⏰ 3020. 子集中元素的最大数量【中等】","link":"/TNotes.leetcode/3020. 子集中元素的最大数量【中等】/README"},{"text":"⏰ 3021. Alice 和 Bob 玩鲜花游戏【中等】","link":"/TNotes.leetcode/3021. Alice 和 Bob 玩鲜花游戏【中等】/README"},{"text":"⏰ 3022. 给定操作次数内使剩余元素的或值最小【困难】","link":"/TNotes.leetcode/3022. 给定操作次数内使剩余元素的或值最小【困难】/README"},{"text":"⏰ 3023. 在无限流中寻找模式 I【中等】","link":"/TNotes.leetcode/3023. 在无限流中寻找模式 I【中等】/README"},{"text":"⏰ 3024. 三角形类型【简单】","link":"/TNotes.leetcode/3024. 三角形类型【简单】/README"},{"text":"⏰ 3025. 人员站位的方案数 I【中等】","link":"/TNotes.leetcode/3025. 人员站位的方案数 I【中等】/README"},{"text":"⏰ 3026. 最大好子数组和【中等】","link":"/TNotes.leetcode/3026. 最大好子数组和【中等】/README"},{"text":"⏰ 3027. 人员站位的方案数 II【困难】","link":"/TNotes.leetcode/3027. 人员站位的方案数 II【困难】/README"},{"text":"⏰ 3028. 边界上的蚂蚁【简单】","link":"/TNotes.leetcode/3028. 边界上的蚂蚁【简单】/README"},{"text":"⏰ 3029. 将单词恢复初始状态所需的最短时间 I【中等】","link":"/TNotes.leetcode/3029. 将单词恢复初始状态所需的最短时间 I【中等】/README"},{"text":"⏰ 3030. 找出网格的区域平均强度【中等】","link":"/TNotes.leetcode/3030. 找出网格的区域平均强度【中等】/README"},{"text":"⏰ 3031. 将单词恢复初始状态所需的最短时间 II【困难】","link":"/TNotes.leetcode/3031. 将单词恢复初始状态所需的最短时间 II【困难】/README"},{"text":"⏰ 3032. 统计各位数字都不同的数字个数 II【简单】","link":"/TNotes.leetcode/3032. 统计各位数字都不同的数字个数 II【简单】/README"},{"text":"⏰ 3033. 修改矩阵【简单】","link":"/TNotes.leetcode/3033. 修改矩阵【简单】/README"},{"text":"⏰ 3034. 匹配模式数组的子数组数目 I【中等】","link":"/TNotes.leetcode/3034. 匹配模式数组的子数组数目 I【中等】/README"},{"text":"⏰ 3035. 回文字符串的最大数量【中等】","link":"/TNotes.leetcode/3035. 回文字符串的最大数量【中等】/README"},{"text":"⏰ 3036. 匹配模式数组的子数组数目 II【困难】","link":"/TNotes.leetcode/3036. 匹配模式数组的子数组数目 II【困难】/README"},{"text":"⏰ 3037. 在无限流中寻找模式 II【困难】","link":"/TNotes.leetcode/3037. 在无限流中寻找模式 II【困难】/README"},{"text":"⏰ 3038. 相同分数的最大操作数目 I【简单】","link":"/TNotes.leetcode/3038. 相同分数的最大操作数目 I【简单】/README"},{"text":"⏰ 3039. 进行操作使字符串为空【中等】","link":"/TNotes.leetcode/3039. 进行操作使字符串为空【中等】/README"},{"text":"⏰ 3040. 相同分数的最大操作数目 II【中等】","link":"/TNotes.leetcode/3040. 相同分数的最大操作数目 II【中等】/README"},{"text":"⏰ 3041. 修改数组后最大化数组中的连续元素数目【困难】","link":"/TNotes.leetcode/3041. 修改数组后最大化数组中的连续元素数目【困难】/README"},{"text":"⏰ 3042. 统计前后缀下标对 I【简单】","link":"/TNotes.leetcode/3042. 统计前后缀下标对 I【简单】/README"},{"text":"⏰ 3043. 最长公共前缀的长度【中等】","link":"/TNotes.leetcode/3043. 最长公共前缀的长度【中等】/README"},{"text":"⏰ 3044. 出现频率最高的质数【中等】","link":"/TNotes.leetcode/3044. 出现频率最高的质数【中等】/README"},{"text":"⏰ 3045. 统计前后缀下标对 II【困难】","link":"/TNotes.leetcode/3045. 统计前后缀下标对 II【困难】/README"},{"text":"⏰ 3046. 分割数组【简单】","link":"/TNotes.leetcode/3046. 分割数组【简单】/README"},{"text":"⏰ 3047. 求交集区域内的最大正方形面积【中等】","link":"/TNotes.leetcode/3047. 求交集区域内的最大正方形面积【中等】/README"},{"text":"⏰ 3048. 标记所有下标的最早秒数 I【中等】","link":"/TNotes.leetcode/3048. 标记所有下标的最早秒数 I【中等】/README"},{"text":"⏰ 3049. 标记所有下标的最早秒数 II【困难】","link":"/TNotes.leetcode/3049. 标记所有下标的最早秒数 II【困难】/README"},{"text":"⏰ 3050. 披萨配料成本分析【中等】","link":"/TNotes.leetcode/3050. 披萨配料成本分析【中等】/README"},{"text":"⏰ 3051. 寻找数据科学家职位的候选人【简单】","link":"/TNotes.leetcode/3051. 寻找数据科学家职位的候选人【简单】/README"},{"text":"⏰ 3052. 最大化商品【困难】","link":"/TNotes.leetcode/3052. 最大化商品【困难】/README"},{"text":"⏰ 3053. 根据长度分类三角形【简单】","link":"/TNotes.leetcode/3053. 根据长度分类三角形【简单】/README"},{"text":"⏰ 3054. 二叉树节点【中等】","link":"/TNotes.leetcode/3054. 二叉树节点【中等】/README"},{"text":"⏰ 3055. 最高欺诈百分位数【中等】","link":"/TNotes.leetcode/3055. 最高欺诈百分位数【中等】/README"},{"text":"⏰ 3056. 快照分析【中等】","link":"/TNotes.leetcode/3056. 快照分析【中等】/README"},{"text":"⏰ 3057. 员工项目分配【困难】","link":"/TNotes.leetcode/3057. 员工项目分配【困难】/README"},{"text":"⏰ 3058. 没有共同朋友的朋友【中等】","link":"/TNotes.leetcode/3058. 没有共同朋友的朋友【中等】/README"},{"text":"⏰ 3059. 找到所有不同的邮件域名【简单】","link":"/TNotes.leetcode/3059. 找到所有不同的邮件域名【简单】/README"},{"text":"⏰ 3060. 时间范围内的用户活动【困难】","link":"/TNotes.leetcode/3060. 时间范围内的用户活动【困难】/README"},{"text":"⏰ 3061. 计算滞留雨水【困难】","link":"/TNotes.leetcode/3061. 计算滞留雨水【困难】/README"},{"text":"⏰ 3062. 链表游戏的获胜者【简单】","link":"/TNotes.leetcode/3062. 链表游戏的获胜者【简单】/README"},{"text":"⏰ 3063. 链表频率【简单】","link":"/TNotes.leetcode/3063. 链表频率【简单】/README"},{"text":"⏰ 3064. 使用按位查询猜测数字 I【中等】","link":"/TNotes.leetcode/3064. 使用按位查询猜测数字 I【中等】/README"},{"text":"⏰ 3065. 超过阈值的最少操作数 I【简单】","link":"/TNotes.leetcode/3065. 超过阈值的最少操作数 I【简单】/README"},{"text":"⏰ 3066. 超过阈值的最少操作数 II【中等】","link":"/TNotes.leetcode/3066. 超过阈值的最少操作数 II【中等】/README"},{"text":"⏰ 3067. 在带权树网络中统计可连接服务器对数目【中等】","link":"/TNotes.leetcode/3067. 在带权树网络中统计可连接服务器对数目【中等】/README"},{"text":"⏰ 3068. 最大节点价值之和【困难】","link":"/TNotes.leetcode/3068. 最大节点价值之和【困难】/README"},{"text":"⏰ 3069. 将元素分配到两个数组中 I【简单】","link":"/TNotes.leetcode/3069. 将元素分配到两个数组中 I【简单】/README"},{"text":"⏰ 3070. 元素和小于等于 k 的子矩阵的数目【中等】","link":"/TNotes.leetcode/3070. 元素和小于等于 k 的子矩阵的数目【中等】/README"},{"text":"⏰ 3071. 在矩阵上写出字母 Y 所需的最少操作次数【中等】","link":"/TNotes.leetcode/3071. 在矩阵上写出字母 Y 所需的最少操作次数【中等】/README"},{"text":"⏰ 3072. 将元素分配到两个数组中 II【困难】","link":"/TNotes.leetcode/3072. 将元素分配到两个数组中 II【困难】/README"},{"text":"⏰ 3073. 最大递增三元组【中等】","link":"/TNotes.leetcode/3073. 最大递增三元组【中等】/README"},{"text":"⏰ 3074. 重新分装苹果【简单】","link":"/TNotes.leetcode/3074. 重新分装苹果【简单】/README"},{"text":"⏰ 3075. 幸福值最大化的选择方案【中等】","link":"/TNotes.leetcode/3075. 幸福值最大化的选择方案【中等】/README"},{"text":"⏰ 3076. 数组中的最短非公共子字符串【中等】","link":"/TNotes.leetcode/3076. 数组中的最短非公共子字符串【中等】/README"},{"text":"⏰ 3077. K 个不相交子数组的最大能量值【困难】","link":"/TNotes.leetcode/3077. K 个不相交子数组的最大能量值【困难】/README"},{"text":"⏰ 3078. 矩阵中的字母数字模式匹配 I【中等】","link":"/TNotes.leetcode/3078. 矩阵中的字母数字模式匹配 I【中等】/README"},{"text":"⏰ 3079. 求出加密整数的和【简单】","link":"/TNotes.leetcode/3079. 求出加密整数的和【简单】/README"},{"text":"⏰ 3080. 执行操作标记数组中的元素【中等】","link":"/TNotes.leetcode/3080. 执行操作标记数组中的元素【中等】/README"},{"text":"⏰ 3081. 替换字符串中的问号使分数最小【中等】","link":"/TNotes.leetcode/3081. 替换字符串中的问号使分数最小【中等】/README"},{"text":"⏰ 3082. 求出所有子序列的能量和【困难】","link":"/TNotes.leetcode/3082. 求出所有子序列的能量和【困难】/README"},{"text":"⏰ 3083. 字符串及其反转中是否存在同一子字符串【简单】","link":"/TNotes.leetcode/3083. 字符串及其反转中是否存在同一子字符串【简单】/README"},{"text":"⏰ 3084. 统计以给定字符开头和结尾的子字符串总数【中等】","link":"/TNotes.leetcode/3084. 统计以给定字符开头和结尾的子字符串总数【中等】/README"},{"text":"⏰ 3085. 成为 K 特殊字符串需要删除的最少字符数【中等】","link":"/TNotes.leetcode/3085. 成为 K 特殊字符串需要删除的最少字符数【中等】/README"},{"text":"⏰ 3086. 拾起 K 个 1 需要的最少行动次数【困难】","link":"/TNotes.leetcode/3086. 拾起 K 个 1 需要的最少行动次数【困难】/README"},{"text":"⏰ 3087. 查找热门话题标签【中等】","link":"/TNotes.leetcode/3087. 查找热门话题标签【中等】/README"},{"text":"⏰ 3088. 使字符串反回文【困难】","link":"/TNotes.leetcode/3088. 使字符串反回文【困难】/README"},{"text":"⏰ 3089. 查找突发行为【中等】","link":"/TNotes.leetcode/3089. 查找突发行为【中等】/README"},{"text":"⏰ 3090. 每个字符最多出现两次的最长子字符串【简单】","link":"/TNotes.leetcode/3090. 每个字符最多出现两次的最长子字符串【简单】/README"},{"text":"⏰ 3091. 执行操作使数据元素之和大于等于 K【中等】","link":"/TNotes.leetcode/3091. 执行操作使数据元素之和大于等于 K【中等】/README"},{"text":"⏰ 3092. 最高频率的 ID【中等】","link":"/TNotes.leetcode/3092. 最高频率的 ID【中等】/README"},{"text":"⏰ 3093. 最长公共后缀查询【困难】","link":"/TNotes.leetcode/3093. 最长公共后缀查询【困难】/README"},{"text":"⏰ 3094. 使用按位查询猜测数字 II【中等】","link":"/TNotes.leetcode/3094. 使用按位查询猜测数字 II【中等】/README"},{"text":"⏰ 3095. 或值至少 K 的最短子数组 I【简单】","link":"/TNotes.leetcode/3095. 或值至少 K 的最短子数组 I【简单】/README"},{"text":"⏰ 3096. 得到更多分数的最少关卡数目【中等】","link":"/TNotes.leetcode/3096. 得到更多分数的最少关卡数目【中等】/README"},{"text":"⏰ 3097. 或值至少为 K 的最短子数组 II【中等】","link":"/TNotes.leetcode/3097. 或值至少为 K 的最短子数组 II【中等】/README"},{"text":"⏰ 3098. 求出所有子序列的能量和【困难】","link":"/TNotes.leetcode/3098. 求出所有子序列的能量和【困难】/README"},{"text":"⏰ 3099. 哈沙德数【简单】","link":"/TNotes.leetcode/3099. 哈沙德数【简单】/README"},{"text":"⏰ 3100. 换水问题 II【中等】","link":"/TNotes.leetcode/3100. 换水问题 II【中等】/README"},{"text":"⏰ 3101. 交替子数组计数【中等】","link":"/TNotes.leetcode/3101. 交替子数组计数【中等】/README"},{"text":"⏰ 3102. 最小化曼哈顿距离【困难】","link":"/TNotes.leetcode/3102. 最小化曼哈顿距离【困难】/README"},{"text":"⏰ 3103. 查找热门话题标签 II【困难】","link":"/TNotes.leetcode/3103. 查找热门话题标签 II【困难】/README"},{"text":"⏰ 3104. 查找最长的自包含子串【困难】","link":"/TNotes.leetcode/3104. 查找最长的自包含子串【困难】/README"},{"text":"⏰ 3105. 最长的严格递增或递减子数组【简单】","link":"/TNotes.leetcode/3105. 最长的严格递增或递减子数组【简单】/README"},{"text":"⏰ 3106. 满足距离约束且字典序最小的字符串【中等】","link":"/TNotes.leetcode/3106. 满足距离约束且字典序最小的字符串【中等】/README"},{"text":"⏰ 3107. 使数组中位数等于 K 的最少操作数【中等】","link":"/TNotes.leetcode/3107. 使数组中位数等于 K 的最少操作数【中等】/README"},{"text":"⏰ 3108. 带权图里旅途的最小代价【困难】","link":"/TNotes.leetcode/3108. 带权图里旅途的最小代价【困难】/README"},{"text":"⏰ 3109. 查找排列的下标【中等】","link":"/TNotes.leetcode/3109. 查找排列的下标【中等】/README"},{"text":"⏰ 3110. 字符串的分数【简单】","link":"/TNotes.leetcode/3110. 字符串的分数【简单】/README"},{"text":"⏰ 3111. 覆盖所有点的最少矩形数目【中等】","link":"/TNotes.leetcode/3111. 覆盖所有点的最少矩形数目【中等】/README"},{"text":"⏰ 3112. 访问消失节点的最少时间【中等】","link":"/TNotes.leetcode/3112. 访问消失节点的最少时间【中等】/README"},{"text":"⏰ 3113. 边界元素是最大值的子数组数目【困难】","link":"/TNotes.leetcode/3113. 边界元素是最大值的子数组数目【困难】/README"},{"text":"⏰ 3114. 替换字符可以得到的最晚时间【简单】","link":"/TNotes.leetcode/3114. 替换字符可以得到的最晚时间【简单】/README"},{"text":"⏰ 3115. 质数的最大距离【中等】","link":"/TNotes.leetcode/3115. 质数的最大距离【中等】/README"},{"text":"⏰ 3116. 单面值组合的第 K 小金额【困难】","link":"/TNotes.leetcode/3116. 单面值组合的第 K 小金额【困难】/README"},{"text":"⏰ 3117. 划分数组得到最小的值之和【困难】","link":"/TNotes.leetcode/3117. 划分数组得到最小的值之和【困难】/README"},{"text":"⏰ 3118. 发生在周五的交易 III【中等】","link":"/TNotes.leetcode/3118. 发生在周五的交易 III【中等】/README"},{"text":"⏰ 3119. 最大数量的可修复坑洼【中等】","link":"/TNotes.leetcode/3119. 最大数量的可修复坑洼【中等】/README"},{"text":"⏰ 3120. 统计特殊字母的数量 I【简单】","link":"/TNotes.leetcode/3120. 统计特殊字母的数量 I【简单】/README"},{"text":"⏰ 3121. 统计特殊字母的数量 II【中等】","link":"/TNotes.leetcode/3121. 统计特殊字母的数量 II【中等】/README"},{"text":"⏰ 3122. 使矩阵满足条件的最少操作次数【中等】","link":"/TNotes.leetcode/3122. 使矩阵满足条件的最少操作次数【中等】/README"},{"text":"⏰ 3123. 最短路径中的边【困难】","link":"/TNotes.leetcode/3123. 最短路径中的边【困难】/README"},{"text":"⏰ 3124. 查找最长的电话【中等】","link":"/TNotes.leetcode/3124. 查找最长的电话【中等】/README"},{"text":"⏰ 3125. 使得按位与结果为 0 的最大数字【中等】","link":"/TNotes.leetcode/3125. 使得按位与结果为 0 的最大数字【中等】/README"},{"text":"⏰ 3126. 服务器利用时间【中等】","link":"/TNotes.leetcode/3126. 服务器利用时间【中等】/README"},{"text":"⏰ 3127. 构造相同颜色的正方形【简单】","link":"/TNotes.leetcode/3127. 构造相同颜色的正方形【简单】/README"},{"text":"⏰ 3128. 直角三角形【中等】","link":"/TNotes.leetcode/3128. 直角三角形【中等】/README"},{"text":"⏰ 3129. 找出所有稳定的二进制数组 I【中等】","link":"/TNotes.leetcode/3129. 找出所有稳定的二进制数组 I【中等】/README"},{"text":"⏰ 3130. 找出所有稳定的二进制数组 II【困难】","link":"/TNotes.leetcode/3130. 找出所有稳定的二进制数组 II【困难】/README"},{"text":"⏰ 3131. 找出与数组相加的整数 I【简单】","link":"/TNotes.leetcode/3131. 找出与数组相加的整数 I【简单】/README"},{"text":"⏰ 3132. 找出与数组相加的整数 II【中等】","link":"/TNotes.leetcode/3132. 找出与数组相加的整数 II【中等】/README"},{"text":"⏰ 3133. 数组最后一个元素的最小值【中等】","link":"/TNotes.leetcode/3133. 数组最后一个元素的最小值【中等】/README"},{"text":"⏰ 3134. 找出唯一性数组的中位数【困难】","link":"/TNotes.leetcode/3134. 找出唯一性数组的中位数【困难】/README"},{"text":"⏰ 3135. 通过添加或删除结尾字符来同化字符串【中等】","link":"/TNotes.leetcode/3135. 通过添加或删除结尾字符来同化字符串【中等】/README"},{"text":"⏰ 3136. 有效单词【简单】","link":"/TNotes.leetcode/3136. 有效单词【简单】/README"},{"text":"⏰ 3137. K 周期字符串需要的最少操作次数【中等】","link":"/TNotes.leetcode/3137. K 周期字符串需要的最少操作次数【中等】/README"},{"text":"⏰ 3138. 同位字符串连接的最小长度【中等】","link":"/TNotes.leetcode/3138. 同位字符串连接的最小长度【中等】/README"},{"text":"⏰ 3139. 使数组中所有元素相等的最小开销【困难】","link":"/TNotes.leetcode/3139. 使数组中所有元素相等的最小开销【困难】/README"},{"text":"⏰ 3140. 连续空余座位 II【中等】","link":"/TNotes.leetcode/3140. 连续空余座位 II【中等】/README"},{"text":"⏰ 3141. 最大汉明距离【困难】","link":"/TNotes.leetcode/3141. 最大汉明距离【困难】/README"},{"text":"⏰ 3142. 判断矩阵是否满足条件【简单】","link":"/TNotes.leetcode/3142. 判断矩阵是否满足条件【简单】/README"},{"text":"⏰ 3143. 正方形中的最多点数【中等】","link":"/TNotes.leetcode/3143. 正方形中的最多点数【中等】/README"},{"text":"⏰ 3144. 分割字符频率相等的最少子字符串【中等】","link":"/TNotes.leetcode/3144. 分割字符频率相等的最少子字符串【中等】/README"},{"text":"⏰ 3145. 大数组元素的乘积【困难】","link":"/TNotes.leetcode/3145. 大数组元素的乘积【困难】/README"},{"text":"⏰ 3146. 两个字符串的排列差【简单】","link":"/TNotes.leetcode/3146. 两个字符串的排列差【简单】/README"},{"text":"⏰ 3147. 从魔法师身上吸取的最大能量【中等】","link":"/TNotes.leetcode/3147. 从魔法师身上吸取的最大能量【中等】/README"},{"text":"⏰ 3148. 矩阵中的最大得分【中等】","link":"/TNotes.leetcode/3148. 矩阵中的最大得分【中等】/README"},{"text":"⏰ 3149. 找出分数最低的排列【困难】","link":"/TNotes.leetcode/3149. 找出分数最低的排列【困难】/README"},{"text":"⏰ 3150. 无效的推文 II【简单】","link":"/TNotes.leetcode/3150. 无效的推文 II【简单】/README"},{"text":"⏰ 3151. 特殊数组 I【简单】","link":"/TNotes.leetcode/3151. 特殊数组 I【简单】/README"},{"text":"⏰ 3152. 特殊数组 II【中等】","link":"/TNotes.leetcode/3152. 特殊数组 II【中等】/README"},{"text":"⏰ 3153. 所有数对中数位差之和【中等】","link":"/TNotes.leetcode/3153. 所有数对中数位差之和【中等】/README"},{"text":"⏰ 3154. 到达第 K 级台阶的方案数【困难】","link":"/TNotes.leetcode/3154. 到达第 K 级台阶的方案数【困难】/README"},{"text":"⏰ 3155. 可升级服务器的最大数量【中等】","link":"/TNotes.leetcode/3155. 可升级服务器的最大数量【中等】/README"},{"text":"⏰ 3156. 员工任务持续时间和并发任务【困难】","link":"/TNotes.leetcode/3156. 员工任务持续时间和并发任务【困难】/README"},{"text":"⏰ 3157. 找到具有最小和的树的层数【中等】","link":"/TNotes.leetcode/3157. 找到具有最小和的树的层数【中等】/README"},{"text":"⏰ 3158. 求出出现两次数字的 XOR 值【简单】","link":"/TNotes.leetcode/3158. 求出出现两次数字的 XOR 值【简单】/README"},{"text":"⏰ 3159. 查询数组中元素的出现位置【中等】","link":"/TNotes.leetcode/3159. 查询数组中元素的出现位置【中等】/README"},{"text":"⏰ 3160. 所有球里面不同颜色的数目【中等】","link":"/TNotes.leetcode/3160. 所有球里面不同颜色的数目【中等】/README"},{"text":"⏰ 3161. 物块放置查询【困难】","link":"/TNotes.leetcode/3161. 物块放置查询【困难】/README"},{"text":"⏰ 3162. 优质数对的总数 I【简单】","link":"/TNotes.leetcode/3162. 优质数对的总数 I【简单】/README"},{"text":"⏰ 3163. 压缩字符串 III【中等】","link":"/TNotes.leetcode/3163. 压缩字符串 III【中等】/README"},{"text":"⏰ 3164. 优质数对的总数 II【中等】","link":"/TNotes.leetcode/3164. 优质数对的总数 II【中等】/README"},{"text":"⏰ 3165. 不包含相邻元素的子序列的最大和【困难】","link":"/TNotes.leetcode/3165. 不包含相邻元素的子序列的最大和【困难】/README"},{"text":"⏰ 3166. 计算停车费与时长【中等】","link":"/TNotes.leetcode/3166. 计算停车费与时长【中等】/README"},{"text":"⏰ 3167. 字符串的更好压缩【中等】","link":"/TNotes.leetcode/3167. 字符串的更好压缩【中等】/README"},{"text":"⏰ 3168. 候诊室中的最少椅子数【简单】","link":"/TNotes.leetcode/3168. 候诊室中的最少椅子数【简单】/README"},{"text":"⏰ 3169. 无需开会的工作日【中等】","link":"/TNotes.leetcode/3169. 无需开会的工作日【中等】/README"},{"text":"⏰ 3170. 删除星号以后字典序最小的字符串【中等】","link":"/TNotes.leetcode/3170. 删除星号以后字典序最小的字符串【中等】/README"},{"text":"⏰ 3171. 找到按位或最接近 K 的子数组【困难】","link":"/TNotes.leetcode/3171. 找到按位或最接近 K 的子数组【困难】/README"},{"text":"⏰ 3172. 第二天验证【简单】","link":"/TNotes.leetcode/3172. 第二天验证【简单】/README"},{"text":"⏰ 3173. 相邻元素的按位或【简单】","link":"/TNotes.leetcode/3173. 相邻元素的按位或【简单】/README"},{"text":"⏰ 3174. 清除数字【简单】","link":"/TNotes.leetcode/3174. 清除数字【简单】/README"},{"text":"⏰ 3175. 找到连续赢 K 场比赛的第一位玩家【中等】","link":"/TNotes.leetcode/3175. 找到连续赢 K 场比赛的第一位玩家【中等】/README"},{"text":"⏰ 3176. 求出最长好子序列 I【中等】","link":"/TNotes.leetcode/3176. 求出最长好子序列 I【中等】/README"},{"text":"⏰ 3177. 求出最长好子序列 II【困难】","link":"/TNotes.leetcode/3177. 求出最长好子序列 II【困难】/README"},{"text":"⏰ 3178. 找出 K 秒后拿着球的孩子【简单】","link":"/TNotes.leetcode/3178. 找出 K 秒后拿着球的孩子【简单】/README"},{"text":"⏰ 3179. K 秒后第 N 个元素的值【中等】","link":"/TNotes.leetcode/3179. K 秒后第 N 个元素的值【中等】/README"},{"text":"⏰ 3180. 执行操作可获得的最大总奖励 I【中等】","link":"/TNotes.leetcode/3180. 执行操作可获得的最大总奖励 I【中等】/README"},{"text":"⏰ 3181. 执行操作可获得的最大总奖励 II【困难】","link":"/TNotes.leetcode/3181. 执行操作可获得的最大总奖励 II【困难】/README"},{"text":"⏰ 3182. 查找得分最高的学生【中等】","link":"/TNotes.leetcode/3182. 查找得分最高的学生【中等】/README"},{"text":"⏰ 3183. 达到总和的方法数量【中等】","link":"/TNotes.leetcode/3183. 达到总和的方法数量【中等】/README"},{"text":"⏰ 3184. 构成整天的下标对数目 I【简单】","link":"/TNotes.leetcode/3184. 构成整天的下标对数目 I【简单】/README"},{"text":"⏰ 3185. 构成整天的下标对数目 II【中等】","link":"/TNotes.leetcode/3185. 构成整天的下标对数目 II【中等】/README"},{"text":"⏰ 3186. 施咒的最大总伤害【中等】","link":"/TNotes.leetcode/3186. 施咒的最大总伤害【中等】/README"},{"text":"⏰ 3187. 数组中的峰值【困难】","link":"/TNotes.leetcode/3187. 数组中的峰值【困难】/README"},{"text":"⏰ 3188. 查找得分最高的学生 II【困难】","link":"/TNotes.leetcode/3188. 查找得分最高的学生 II【困难】/README"},{"text":"⏰ 3189. 得到一个和平棋盘的最少步骤【中等】","link":"/TNotes.leetcode/3189. 得到一个和平棋盘的最少步骤【中等】/README"},{"text":"⏰ 3190. 使所有元素都可以被 3 整除的最少操作数【简单】","link":"/TNotes.leetcode/3190. 使所有元素都可以被 3 整除的最少操作数【简单】/README"},{"text":"⏰ 3191. 使二进制数组全部等于 1 的最少操作次数 I【中等】","link":"/TNotes.leetcode/3191. 使二进制数组全部等于 1 的最少操作次数 I【中等】/README"},{"text":"⏰ 3192. 使二进制数组全部等于 1 的最少操作次数 II【中等】","link":"/TNotes.leetcode/3192. 使二进制数组全部等于 1 的最少操作次数 II【中等】/README"},{"text":"⏰ 3193. 统计逆序对的数目【困难】","link":"/TNotes.leetcode/3193. 统计逆序对的数目【困难】/README"},{"text":"⏰ 3194. 最小元素和最大元素的最小平均值【简单】","link":"/TNotes.leetcode/3194. 最小元素和最大元素的最小平均值【简单】/README"},{"text":"⏰ 3195. 包含所有 1 的最小矩形面积 I【中等】","link":"/TNotes.leetcode/3195. 包含所有 1 的最小矩形面积 I【中等】/README"},{"text":"⏰ 3196. 最大化子数组的总成本【中等】","link":"/TNotes.leetcode/3196. 最大化子数组的总成本【中等】/README"},{"text":"⏰ 3197. 包含所有 1 的最小矩形面积 II【困难】","link":"/TNotes.leetcode/3197. 包含所有 1 的最小矩形面积 II【困难】/README"},{"text":"⏰ 3198. 查找每个州的城市【简单】","link":"/TNotes.leetcode/3198. 查找每个州的城市【简单】/README"},{"text":"⏰ 3199. 用偶数异或设置位计数三元组 I【简单】","link":"/TNotes.leetcode/3199. 用偶数异或设置位计数三元组 I【简单】/README"},{"text":"⏰ 3200. 三角形的最大高度【简单】","link":"/TNotes.leetcode/3200. 三角形的最大高度【简单】/README"},{"text":"⏰ 3201. 找出有效子序列的最大长度 I【中等】","link":"/TNotes.leetcode/3201. 找出有效子序列的最大长度 I【中等】/README"},{"text":"⏰ 3202. 找出有效子序列的最大长度 II【中等】","link":"/TNotes.leetcode/3202. 找出有效子序列的最大长度 II【中等】/README"},{"text":"⏰ 3203. 合并两棵树后的最小直径【困难】","link":"/TNotes.leetcode/3203. 合并两棵树后的最小直径【困难】/README"},{"text":"⏰ 3204. 按位用户权限分析【中等】","link":"/TNotes.leetcode/3204. 按位用户权限分析【中等】/README"},{"text":"⏰ 3205. 最大数组跳跃得分 I【中等】","link":"/TNotes.leetcode/3205. 最大数组跳跃得分 I【中等】/README"},{"text":"⏰ 3206. 交替组 I【简单】","link":"/TNotes.leetcode/3206. 交替组 I【简单】/README"},{"text":"⏰ 3207. 与敌人战斗后的最大分数【中等】","link":"/TNotes.leetcode/3207. 与敌人战斗后的最大分数【中等】/README"},{"text":"⏰ 3208. 交替组 II【中等】","link":"/TNotes.leetcode/3208. 交替组 II【中等】/README"},{"text":"⏰ 3209. 子数组按位与值为 K 的数目【困难】","link":"/TNotes.leetcode/3209. 子数组按位与值为 K 的数目【困难】/README"},{"text":"⏰ 3210. 找出加密后的字符串【简单】","link":"/TNotes.leetcode/3210. 找出加密后的字符串【简单】/README"},{"text":"⏰ 3211. 生成不含相邻零的二进制字符串【中等】","link":"/TNotes.leetcode/3211. 生成不含相邻零的二进制字符串【中等】/README"},{"text":"⏰ 3212. 统计 X 和 Y 频数相等的子矩阵数量【中等】","link":"/TNotes.leetcode/3212. 统计 X 和 Y 频数相等的子矩阵数量【中等】/README"},{"text":"⏰ 3213. 最小代价构造字符串【困难】","link":"/TNotes.leetcode/3213. 最小代价构造字符串【困难】/README"},{"text":"⏰ 3214. 同比增长率【困难】","link":"/TNotes.leetcode/3214. 同比增长率【困难】/README"},{"text":"⏰ 3215. 用偶数异或设置位计数三元组 II【中等】","link":"/TNotes.leetcode/3215. 用偶数异或设置位计数三元组 II【中等】/README"},{"text":"⏰ 3216. 交换后字典序最小的字符串【简单】","link":"/TNotes.leetcode/3216. 交换后字典序最小的字符串【简单】/README"},{"text":"⏰ 3217. 从链表中移除在数组中存在的节点【中等】","link":"/TNotes.leetcode/3217. 从链表中移除在数组中存在的节点【中等】/README"},{"text":"⏰ 3218. 切蛋糕的最小总开销 I【中等】","link":"/TNotes.leetcode/3218. 切蛋糕的最小总开销 I【中等】/README"},{"text":"⏰ 3219. 切蛋糕的最小总开销 II【困难】","link":"/TNotes.leetcode/3219. 切蛋糕的最小总开销 II【困难】/README"},{"text":"⏰ 3220. 奇数和偶数交易【中等】","link":"/TNotes.leetcode/3220. 奇数和偶数交易【中等】/README"},{"text":"⏰ 3221. 最大数组跳跃得分 II【中等】","link":"/TNotes.leetcode/3221. 最大数组跳跃得分 II【中等】/README"},{"text":"⏰ 3222. 求出硬币游戏的赢家【简单】","link":"/TNotes.leetcode/3222. 求出硬币游戏的赢家【简单】/README"},{"text":"⏰ 3223. 操作后字符串的最短长度【中等】","link":"/TNotes.leetcode/3223. 操作后字符串的最短长度【中等】/README"},{"text":"⏰ 3224. 使差值相等的最少数组改动次数【中等】","link":"/TNotes.leetcode/3224. 使差值相等的最少数组改动次数【中等】/README"},{"text":"⏰ 3225. 网格图操作后的最大分数【困难】","link":"/TNotes.leetcode/3225. 网格图操作后的最大分数【困难】/README"},{"text":"⏰ 3226. 使两个整数相等的位更改次数【简单】","link":"/TNotes.leetcode/3226. 使两个整数相等的位更改次数【简单】/README"},{"text":"⏰ 3227. 字符串元音游戏【中等】","link":"/TNotes.leetcode/3227. 字符串元音游戏【中等】/README"},{"text":"⏰ 3228. 将 1 移动到末尾的最大操作次数【中等】","link":"/TNotes.leetcode/3228. 将 1 移动到末尾的最大操作次数【中等】/README"},{"text":"⏰ 3229. 使数组等于目标数组所需的最少操作次数【困难】","link":"/TNotes.leetcode/3229. 使数组等于目标数组所需的最少操作次数【困难】/README"},{"text":"⏰ 3230. 客户购买行为分析【中等】","link":"/TNotes.leetcode/3230. 客户购买行为分析【中等】/README"},{"text":"⏰ 3231. 要删除的递增子序列的最小数量【困难】","link":"/TNotes.leetcode/3231. 要删除的递增子序列的最小数量【困难】/README"},{"text":"⏰ 3232. 判断是否可以赢得数字游戏【简单】","link":"/TNotes.leetcode/3232. 判断是否可以赢得数字游戏【简单】/README"},{"text":"⏰ 3233. 统计不是特殊数字的数字数量【中等】","link":"/TNotes.leetcode/3233. 统计不是特殊数字的数字数量【中等】/README"},{"text":"⏰ 3234. 统计 1 显著的字符串的数量【中等】","link":"/TNotes.leetcode/3234. 统计 1 显著的字符串的数量【中等】/README"},{"text":"⏰ 3235. 判断矩形的两个角落是否可达【困难】","link":"/TNotes.leetcode/3235. 判断矩形的两个角落是否可达【困难】/README"},{"text":"⏰ 3236. 首席执行官下属层级【困难】","link":"/TNotes.leetcode/3236. 首席执行官下属层级【困难】/README"},{"text":"⏰ 3237. Alt 和 Tab 模拟【中等】","link":"/TNotes.leetcode/3237. Alt 和 Tab 模拟【中等】/README"},{"text":"⏰ 3238. 求出胜利玩家的数目【简单】","link":"/TNotes.leetcode/3238. 求出胜利玩家的数目【简单】/README"},{"text":"⏰ 3239. 最少翻转次数使二进制矩阵回文 I【中等】","link":"/TNotes.leetcode/3239. 最少翻转次数使二进制矩阵回文 I【中等】/README"},{"text":"⏰ 3240. 最少翻转次数使二进制矩阵回文 II【中等】","link":"/TNotes.leetcode/3240. 最少翻转次数使二进制矩阵回文 II【中等】/README"},{"text":"⏰ 3241. 标记所有节点需要的时间【困难】","link":"/TNotes.leetcode/3241. 标记所有节点需要的时间【困难】/README"},{"text":"⏰ 3242. 设计相邻元素求和服务【简单】","link":"/TNotes.leetcode/3242. 设计相邻元素求和服务【简单】/README"},{"text":"⏰ 3243. 新增道路查询后的最短距离 I【中等】","link":"/TNotes.leetcode/3243. 新增道路查询后的最短距离 I【中等】/README"},{"text":"⏰ 3244. 新增道路查询后的最短距离 II【困难】","link":"/TNotes.leetcode/3244. 新增道路查询后的最短距离 II【困难】/README"},{"text":"⏰ 3245. 交替组 III【困难】","link":"/TNotes.leetcode/3245. 交替组 III【困难】/README"},{"text":"⏰ 3246. 英超积分榜排名【简单】","link":"/TNotes.leetcode/3246. 英超积分榜排名【简单】/README"},{"text":"⏰ 3247. 奇数和子序列的数量【中等】","link":"/TNotes.leetcode/3247. 奇数和子序列的数量【中等】/README"},{"text":"⏰ 3248. 矩阵中的蛇【简单】","link":"/TNotes.leetcode/3248. 矩阵中的蛇【简单】/README"},{"text":"⏰ 3249. 统计好节点的数目【中等】","link":"/TNotes.leetcode/3249. 统计好节点的数目【中等】/README"},{"text":"⏰ 3250. 单调数组对的数目 I【困难】","link":"/TNotes.leetcode/3250. 单调数组对的数目 I【困难】/README"},{"text":"⏰ 3251. 单调数组对的数目 II【困难】","link":"/TNotes.leetcode/3251. 单调数组对的数目 II【困难】/README"},{"text":"⏰ 3252. 英超积分榜排名 II【中等】","link":"/TNotes.leetcode/3252. 英超积分榜排名 II【中等】/README"},{"text":"⏰ 3253. 最小代价构造字符串（简单）【中等】","link":"/TNotes.leetcode/3253. 最小代价构造字符串（简单）【中等】/README"},{"text":"⏰ 3254. 长度为 K 的子数组的能量值 I【中等】","link":"/TNotes.leetcode/3254. 长度为 K 的子数组的能量值 I【中等】/README"},{"text":"⏰ 3255. 长度为 K 的子数组的能量值 II【中等】","link":"/TNotes.leetcode/3255. 长度为 K 的子数组的能量值 II【中等】/README"},{"text":"⏰ 3256. 放三个车的价值之和最大 I【困难】","link":"/TNotes.leetcode/3256. 放三个车的价值之和最大 I【困难】/README"},{"text":"⏰ 3257. 放三个车的价值之和最大 II【困难】","link":"/TNotes.leetcode/3257. 放三个车的价值之和最大 II【困难】/README"},{"text":"⏰ 3258. 统计满足 K 约束的子字符串数量 I【简单】","link":"/TNotes.leetcode/3258. 统计满足 K 约束的子字符串数量 I【简单】/README"},{"text":"⏰ 3259. 超级饮料的最大强化能量【中等】","link":"/TNotes.leetcode/3259. 超级饮料的最大强化能量【中等】/README"},{"text":"⏰ 3260. 找出最大的 N 位 K 回文数【困难】","link":"/TNotes.leetcode/3260. 找出最大的 N 位 K 回文数【困难】/README"},{"text":"⏰ 3261. 统计满足 K 约束的子字符串数量 II【困难】","link":"/TNotes.leetcode/3261. 统计满足 K 约束的子字符串数量 II【困难】/README"},{"text":"⏰ 3262. 查找重叠的班次【中等】","link":"/TNotes.leetcode/3262. 查找重叠的班次【中等】/README"},{"text":"⏰ 3263. 将双链表转换为数组 I【简单】","link":"/TNotes.leetcode/3263. 将双链表转换为数组 I【简单】/README"},{"text":"⏰ 3264. K 次乘运算后的最终数组 I【简单】","link":"/TNotes.leetcode/3264. K 次乘运算后的最终数组 I【简单】/README"},{"text":"⏰ 3265. 统计近似相等数对 I【中等】","link":"/TNotes.leetcode/3265. 统计近似相等数对 I【中等】/README"},{"text":"⏰ 3266. K 次乘运算后的最终数组 II【困难】","link":"/TNotes.leetcode/3266. K 次乘运算后的最终数组 II【困难】/README"},{"text":"⏰ 3267. 统计近似相等数对 II【困难】","link":"/TNotes.leetcode/3267. 统计近似相等数对 II【困难】/README"},{"text":"⏰ 3268. 查找重叠的班次 II【困难】","link":"/TNotes.leetcode/3268. 查找重叠的班次 II【困难】/README"},{"text":"⏰ 3269. 构建两个递增数组【困难】","link":"/TNotes.leetcode/3269. 构建两个递增数组【困难】/README"},{"text":"⏰ 3270. 求出数字答案【简单】","link":"/TNotes.leetcode/3270. 求出数字答案【简单】/README"},{"text":"⏰ 3271. 哈希分割字符串【中等】","link":"/TNotes.leetcode/3271. 哈希分割字符串【中等】/README"},{"text":"⏰ 3272. 统计好整数的数目【困难】","link":"/TNotes.leetcode/3272. 统计好整数的数目【困难】/README"},{"text":"⏰ 3273. 对 Bob 造成的最少伤害【困难】","link":"/TNotes.leetcode/3273. 对 Bob 造成的最少伤害【困难】/README"},{"text":"⏰ 3274. 检查棋盘方格颜色是否相同【简单】","link":"/TNotes.leetcode/3274. 检查棋盘方格颜色是否相同【简单】/README"},{"text":"⏰ 3275. 第 K 近障碍物查询【中等】","link":"/TNotes.leetcode/3275. 第 K 近障碍物查询【中等】/README"},{"text":"⏰ 3276. 选择矩阵中单元格的最大得分【困难】","link":"/TNotes.leetcode/3276. 选择矩阵中单元格的最大得分【困难】/README"},{"text":"⏰ 3277. 查询子数组最大异或值【困难】","link":"/TNotes.leetcode/3277. 查询子数组最大异或值【困难】/README"},{"text":"⏰ 3278. 寻找数据科学家职位的候选人 II【中等】","link":"/TNotes.leetcode/3278. 寻找数据科学家职位的候选人 II【中等】/README"},{"text":"⏰ 3279. 活塞占据的最大总区域【困难】","link":"/TNotes.leetcode/3279. 活塞占据的最大总区域【困难】/README"},{"text":"⏰ 3280. 将日期转换为二进制表示【简单】","link":"/TNotes.leetcode/3280. 将日期转换为二进制表示【简单】/README"},{"text":"⏰ 3281. 范围内整数的最大得分【中等】","link":"/TNotes.leetcode/3281. 范围内整数的最大得分【中等】/README"},{"text":"⏰ 3282. 到达数组末尾的最大得分【中等】","link":"/TNotes.leetcode/3282. 到达数组末尾的最大得分【中等】/README"},{"text":"⏰ 3283. 吃掉所有兵需要的最多移动次数【困难】","link":"/TNotes.leetcode/3283. 吃掉所有兵需要的最多移动次数【困难】/README"},{"text":"⏰ 3284. 连续子数组的和【中等】","link":"/TNotes.leetcode/3284. 连续子数组的和【中等】/README"},{"text":"⏰ 3285. 找到稳定山的下标【简单】","link":"/TNotes.leetcode/3285. 找到稳定山的下标【简单】/README"},{"text":"⏰ 3286. 穿越网格图的安全路径【中等】","link":"/TNotes.leetcode/3286. 穿越网格图的安全路径【中等】/README"},{"text":"⏰ 3287. 求出数组中最大序列值【困难】","link":"/TNotes.leetcode/3287. 求出数组中最大序列值【困难】/README"},{"text":"⏰ 3288. 最长上升路径的长度【困难】","link":"/TNotes.leetcode/3288. 最长上升路径的长度【困难】/README"},{"text":"⏰ 3289. 数字小镇中的捣蛋鬼【简单】","link":"/TNotes.leetcode/3289. 数字小镇中的捣蛋鬼【简单】/README"},{"text":"⏰ 3290. 最高乘法得分【中等】","link":"/TNotes.leetcode/3290. 最高乘法得分【中等】/README"},{"text":"⏰ 3291. 形成目标字符串需要的最少字符串数 I【中等】","link":"/TNotes.leetcode/3291. 形成目标字符串需要的最少字符串数 I【中等】/README"},{"text":"⏰ 3292. 形成目标字符串需要的最少字符串数 II【困难】","link":"/TNotes.leetcode/3292. 形成目标字符串需要的最少字符串数 II【困难】/README"},{"text":"⏰ 3293. 计算产品最终价格【中等】","link":"/TNotes.leetcode/3293. 计算产品最终价格【中等】/README"},{"text":"⏰ 3294. 将双链表转换为数组 II【中等】","link":"/TNotes.leetcode/3294. 将双链表转换为数组 II【中等】/README"},{"text":"⏰ 3295. 举报垃圾信息【中等】","link":"/TNotes.leetcode/3295. 举报垃圾信息【中等】/README"},{"text":"⏰ 3296. 移山所需的最少秒数【中等】","link":"/TNotes.leetcode/3296. 移山所需的最少秒数【中等】/README"},{"text":"⏰ 3297. 统计重新排列后包含另一个字符串的子字符串数目 I【中等】","link":"/TNotes.leetcode/3297. 统计重新排列后包含另一个字符串的子字符串数目 I【中等】/README"},{"text":"⏰ 3298. 统计重新排列后包含另一个字符串的子字符串数目 II【困难】","link":"/TNotes.leetcode/3298. 统计重新排列后包含另一个字符串的子字符串数目 II【困难】/README"},{"text":"⏰ 3299. 连续子序列的和【困难】","link":"/TNotes.leetcode/3299. 连续子序列的和【困难】/README"},{"text":"⏰ 3300. 替换为数位和以后的最小元素【简单】","link":"/TNotes.leetcode/3300. 替换为数位和以后的最小元素【简单】/README"},{"text":"⏰ 3301. 高度互不相同的最大塔高和【中等】","link":"/TNotes.leetcode/3301. 高度互不相同的最大塔高和【中等】/README"},{"text":"⏰ 3302. 字典序最小的合法序列【中等】","link":"/TNotes.leetcode/3302. 字典序最小的合法序列【中等】/README"},{"text":"⏰ 3303. 第一个几乎相等子字符串的下标【困难】","link":"/TNotes.leetcode/3303. 第一个几乎相等子字符串的下标【困难】/README"},{"text":"⏰ 3304. 找出第 K 个字符 I【简单】","link":"/TNotes.leetcode/3304. 找出第 K 个字符 I【简单】/README"},{"text":"⏰ 3305. 元音辅音字符串计数 I【中等】","link":"/TNotes.leetcode/3305. 元音辅音字符串计数 I【中等】/README"},{"text":"⏰ 3306. 元音辅音字符串计数 II【中等】","link":"/TNotes.leetcode/3306. 元音辅音字符串计数 II【中等】/README"},{"text":"⏰ 3307. 找出第 K 个字符 II【困难】","link":"/TNotes.leetcode/3307. 找出第 K 个字符 II【困难】/README"},{"text":"⏰ 3308. 寻找表现最佳的司机【中等】","link":"/TNotes.leetcode/3308. 寻找表现最佳的司机【中等】/README"},{"text":"⏰ 3309. 连接二进制表示可形成的最大数值【中等】","link":"/TNotes.leetcode/3309. 连接二进制表示可形成的最大数值【中等】/README"},{"text":"⏰ 3310. 移除可疑的方法【中等】","link":"/TNotes.leetcode/3310. 移除可疑的方法【中等】/README"},{"text":"⏰ 3311. 构造符合图结构的二维矩阵【困难】","link":"/TNotes.leetcode/3311. 构造符合图结构的二维矩阵【困难】/README"},{"text":"⏰ 3312. 查询排序后的最大公约数【困难】","link":"/TNotes.leetcode/3312. 查询排序后的最大公约数【困难】/README"},{"text":"⏰ 3313. 查找树中最后标记的节点【困难】","link":"/TNotes.leetcode/3313. 查找树中最后标记的节点【困难】/README"},{"text":"⏰ 3314. 构造最小位运算数组 I【简单】","link":"/TNotes.leetcode/3314. 构造最小位运算数组 I【简单】/README"},{"text":"⏰ 3315. 构造最小位运算数组 II【中等】","link":"/TNotes.leetcode/3315. 构造最小位运算数组 II【中等】/README"},{"text":"⏰ 3316. 从原字符串里进行删除操作的最多次数【中等】","link":"/TNotes.leetcode/3316. 从原字符串里进行删除操作的最多次数【中等】/README"},{"text":"⏰ 3317. 安排活动的方案数【困难】","link":"/TNotes.leetcode/3317. 安排活动的方案数【困难】/README"},{"text":"⏰ 3318. 计算子数组的 x-sum I【简单】","link":"/TNotes.leetcode/3318. 计算子数组的 x-sum I【简单】/README"},{"text":"⏰ 3319. 第 K 大的完美二叉子树的大小【中等】","link":"/TNotes.leetcode/3319. 第 K 大的完美二叉子树的大小【中等】/README"},{"text":"⏰ 3320. 统计能获胜的出招序列数【困难】","link":"/TNotes.leetcode/3320. 统计能获胜的出招序列数【困难】/README"},{"text":"⏰ 3321. 计算子数组的 x-sum II【困难】","link":"/TNotes.leetcode/3321. 计算子数组的 x-sum II【困难】/README"},{"text":"⏰ 3322. 英超积分榜排名 III【中等】","link":"/TNotes.leetcode/3322. 英超积分榜排名 III【中等】/README"},{"text":"⏰ 3323. 通过插入区间最小化连通组【中等】","link":"/TNotes.leetcode/3323. 通过插入区间最小化连通组【中等】/README"},{"text":"⏰ 3324. 出现在屏幕上的字符串序列【中等】","link":"/TNotes.leetcode/3324. 出现在屏幕上的字符串序列【中等】/README"},{"text":"⏰ 3325. 字符至少出现 K 次的子字符串 I【中等】","link":"/TNotes.leetcode/3325. 字符至少出现 K 次的子字符串 I【中等】/README"},{"text":"⏰ 3326. 使数组非递减的最少除法操作次数【中等】","link":"/TNotes.leetcode/3326. 使数组非递减的最少除法操作次数【中等】/README"},{"text":"⏰ 3327. 判断 DFS 字符串是否是回文串【困难】","link":"/TNotes.leetcode/3327. 判断 DFS 字符串是否是回文串【困难】/README"},{"text":"⏰ 3328. 查找每个州的城市 II【中等】","link":"/TNotes.leetcode/3328. 查找每个州的城市 II【中等】/README"},{"text":"⏰ 3329. 字符至少出现 K 次的子字符串 II【困难】","link":"/TNotes.leetcode/3329. 字符至少出现 K 次的子字符串 II【困难】/README"},{"text":"⏰ 3330. 找到初始输入字符串 I【简单】","link":"/TNotes.leetcode/3330. 找到初始输入字符串 I【简单】/README"},{"text":"⏰ 3331. 修改后子树的大小【中等】","link":"/TNotes.leetcode/3331. 修改后子树的大小【中等】/README"},{"text":"⏰ 3332. 旅客可以得到的最多点数【中等】","link":"/TNotes.leetcode/3332. 旅客可以得到的最多点数【中等】/README"},{"text":"⏰ 3333. 找到初始输入字符串 II【困难】","link":"/TNotes.leetcode/3333. 找到初始输入字符串 II【困难】/README"},{"text":"⏰ 3334. 数组的最大因子得分【中等】","link":"/TNotes.leetcode/3334. 数组的最大因子得分【中等】/README"},{"text":"⏰ 3335. 字符串转换后的长度 I【中等】","link":"/TNotes.leetcode/3335. 字符串转换后的长度 I【中等】/README"},{"text":"⏰ 3336. 最大公约数相等的子序列数量【困难】","link":"/TNotes.leetcode/3336. 最大公约数相等的子序列数量【困难】/README"},{"text":"⏰ 3337. 字符串转换后的长度 II【困难】","link":"/TNotes.leetcode/3337. 字符串转换后的长度 II【困难】/README"},{"text":"⏰ 3338. 第二高的薪水 II【中等】","link":"/TNotes.leetcode/3338. 第二高的薪水 II【中等】/README"},{"text":"⏰ 3339. 查找 K 偶数数组的数量【中等】","link":"/TNotes.leetcode/3339. 查找 K 偶数数组的数量【中等】/README"},{"text":"⏰ 3340. 检查平衡字符串【简单】","link":"/TNotes.leetcode/3340. 检查平衡字符串【简单】/README"},{"text":"⏰ 3341. 到达最后一个房间的最少时间 I【中等】","link":"/TNotes.leetcode/3341. 到达最后一个房间的最少时间 I【中等】/README"},{"text":"⏰ 3342. 到达最后一个房间的最少时间 II【中等】","link":"/TNotes.leetcode/3342. 到达最后一个房间的最少时间 II【中等】/README"},{"text":"⏰ 3343. 统计平衡排列的数目【困难】","link":"/TNotes.leetcode/3343. 统计平衡排列的数目【困难】/README"},{"text":"⏰ 3344. 最大尺寸数组【中等】","link":"/TNotes.leetcode/3344. 最大尺寸数组【中等】/README"},{"text":"⏰ 3345. 最小可整除数位乘积 I【简单】","link":"/TNotes.leetcode/3345. 最小可整除数位乘积 I【简单】/README"},{"text":"⏰ 3346. 执行操作后元素的最高频率 I【中等】","link":"/TNotes.leetcode/3346. 执行操作后元素的最高频率 I【中等】/README"},{"text":"⏰ 3347. 执行操作后元素的最高频率 II【困难】","link":"/TNotes.leetcode/3347. 执行操作后元素的最高频率 II【困难】/README"},{"text":"⏰ 3348. 最小可整除数位乘积 II【困难】","link":"/TNotes.leetcode/3348. 最小可整除数位乘积 II【困难】/README"},{"text":"⏰ 3349. 检测相邻递增子数组 I【简单】","link":"/TNotes.leetcode/3349. 检测相邻递增子数组 I【简单】/README"},{"text":"⏰ 3350. 检测相邻递增子数组 II【中等】","link":"/TNotes.leetcode/3350. 检测相邻递增子数组 II【中等】/README"},{"text":"⏰ 3351. 好子序列的元素之和【困难】","link":"/TNotes.leetcode/3351. 好子序列的元素之和【困难】/README"},{"text":"⏰ 3352. 统计小于 N 的 K 可约简整数【困难】","link":"/TNotes.leetcode/3352. 统计小于 N 的 K 可约简整数【困难】/README"},{"text":"⏰ 3353. 最小总操作数【简单】","link":"/TNotes.leetcode/3353. 最小总操作数【简单】/README"},{"text":"⏰ 3354. 使数组元素等于零【简单】","link":"/TNotes.leetcode/3354. 使数组元素等于零【简单】/README"},{"text":"⏰ 3355. 零数组变换 I【中等】","link":"/TNotes.leetcode/3355. 零数组变换 I【中等】/README"},{"text":"⏰ 3356. 零数组变换 II【中等】","link":"/TNotes.leetcode/3356. 零数组变换 II【中等】/README"},{"text":"⏰ 3357. 最小化相邻元素的最大差值【困难】","link":"/TNotes.leetcode/3357. 最小化相邻元素的最大差值【困难】/README"},{"text":"⏰ 3358. 评分为 NULL 的图书【简单】","link":"/TNotes.leetcode/3358. 评分为 NULL 的图书【简单】/README"},{"text":"⏰ 3359. 查找最大元素不超过 K 的有序子矩阵【困难】","link":"/TNotes.leetcode/3359. 查找最大元素不超过 K 的有序子矩阵【困难】/README"},{"text":"⏰ 3360. 移除石头游戏【简单】","link":"/TNotes.leetcode/3360. 移除石头游戏【简单】/README"},{"text":"⏰ 3361. 两个字符串的切换距离【中等】","link":"/TNotes.leetcode/3361. 两个字符串的切换距离【中等】/README"},{"text":"⏰ 3362. 零数组变换 III【中等】","link":"/TNotes.leetcode/3362. 零数组变换 III【中等】/README"},{"text":"⏰ 3363. 最多可收集的水果数目【困难】","link":"/TNotes.leetcode/3363. 最多可收集的水果数目【困难】/README"},{"text":"⏰ 3364. 最小正和子数组【简单】","link":"/TNotes.leetcode/3364. 最小正和子数组【简单】/README"},{"text":"⏰ 3365. 重排子字符串以形成目标字符串【中等】","link":"/TNotes.leetcode/3365. 重排子字符串以形成目标字符串【中等】/README"},{"text":"⏰ 3366. 最小数组和【中等】","link":"/TNotes.leetcode/3366. 最小数组和【中等】/README"},{"text":"⏰ 3367. 移除边之后的权重最大和【困难】","link":"/TNotes.leetcode/3367. 移除边之后的权重最大和【困难】/README"},{"text":"⏰ 3368. 首字母大写【困难】","link":"/TNotes.leetcode/3368. 首字母大写【困难】/README"},{"text":"⏰ 3369. 设计数组统计跟踪器【困难】","link":"/TNotes.leetcode/3369. 设计数组统计跟踪器【困难】/README"},{"text":"⏰ 3370. 仅含置位位的最小整数【简单】","link":"/TNotes.leetcode/3370. 仅含置位位的最小整数【简单】/README"},{"text":"⏰ 3371. 识别数组中的最大异常值【中等】","link":"/TNotes.leetcode/3371. 识别数组中的最大异常值【中等】/README"},{"text":"⏰ 3372. 连接两棵树后最大目标节点数目 I【中等】","link":"/TNotes.leetcode/3372. 连接两棵树后最大目标节点数目 I【中等】/README"},{"text":"⏰ 3373. 连接两棵树后最大目标节点数目 II【困难】","link":"/TNotes.leetcode/3373. 连接两棵树后最大目标节点数目 II【困难】/README"},{"text":"⏰ 3374. 首字母大写 II【困难】","link":"/TNotes.leetcode/3374. 首字母大写 II【困难】/README"},{"text":"⏰ 3375. 使数组的值全部为 K 的最少操作次数【简单】","link":"/TNotes.leetcode/3375. 使数组的值全部为 K 的最少操作次数【简单】/README"},{"text":"⏰ 3376. 破解锁的最少时间 I【中等】","link":"/TNotes.leetcode/3376. 破解锁的最少时间 I【中等】/README"},{"text":"⏰ 3377. 使两个整数相等的数位操作【中等】","link":"/TNotes.leetcode/3377. 使两个整数相等的数位操作【中等】/README"},{"text":"⏰ 3378. 统计最小公倍数图中的连通块数目【困难】","link":"/TNotes.leetcode/3378. 统计最小公倍数图中的连通块数目【困难】/README"},{"text":"⏰ 3379. 转换数组【简单】","link":"/TNotes.leetcode/3379. 转换数组【简单】/README"},{"text":"⏰ 3380. 用点构造面积最大的矩形 I【中等】","link":"/TNotes.leetcode/3380. 用点构造面积最大的矩形 I【中等】/README"},{"text":"⏰ 3381. 长度可被 K 整除的子数组的最大元素和【中等】","link":"/TNotes.leetcode/3381. 长度可被 K 整除的子数组的最大元素和【中等】/README"},{"text":"⏰ 3382. 用点构造面积最大的矩形 II【困难】","link":"/TNotes.leetcode/3382. 用点构造面积最大的矩形 II【困难】/README"},{"text":"⏰ 3383. 施法所需最低符文数量【困难】","link":"/TNotes.leetcode/3383. 施法所需最低符文数量【困难】/README"},{"text":"⏰ 3384. 球队传球成功的优势得分【困难】","link":"/TNotes.leetcode/3384. 球队传球成功的优势得分【困难】/README"},{"text":"⏰ 3385. 破解锁的最少时间 II【困难】","link":"/TNotes.leetcode/3385. 破解锁的最少时间 II【困难】/README"},{"text":"⏰ 3386. 按下时间最长的按钮【简单】","link":"/TNotes.leetcode/3386. 按下时间最长的按钮【简单】/README"},{"text":"⏰ 3387. 两天自由外汇交易后的最大货币数【中等】","link":"/TNotes.leetcode/3387. 两天自由外汇交易后的最大货币数【中等】/README"},{"text":"⏰ 3388. 统计数组中的美丽分割【中等】","link":"/TNotes.leetcode/3388. 统计数组中的美丽分割【中等】/README"},{"text":"⏰ 3389. 使字符频率相等的最少操作次数【困难】","link":"/TNotes.leetcode/3389. 使字符频率相等的最少操作次数【困难】/README"},{"text":"⏰ 3390. Longest Team Pass Streak【困难】","link":"/TNotes.leetcode/3390. Longest Team Pass Streak【困难】/README"},{"text":"⏰ 3391. 设计一个高效的层跟踪三维二进制矩阵【中等】","link":"/TNotes.leetcode/3391. 设计一个高效的层跟踪三维二进制矩阵【中等】/README"},{"text":"⏰ 3392. 统计符合条件长度为 3 的子数组数目【简单】","link":"/TNotes.leetcode/3392. 统计符合条件长度为 3 的子数组数目【简单】/README"},{"text":"⏰ 3393. 统计异或值为给定值的路径数目【中等】","link":"/TNotes.leetcode/3393. 统计异或值为给定值的路径数目【中等】/README"},{"text":"⏰ 3394. 判断网格图能否被切割成块【中等】","link":"/TNotes.leetcode/3394. 判断网格图能否被切割成块【中等】/README"},{"text":"⏰ 3395. 唯一中间众数子序列 I【困难】","link":"/TNotes.leetcode/3395. 唯一中间众数子序列 I【困难】/README"},{"text":"⏰ 3396. 使数组元素互不相同所需的最少操作次数【简单】","link":"/TNotes.leetcode/3396. 使数组元素互不相同所需的最少操作次数【简单】/README"},{"text":"⏰ 3397. 执行操作后不同元素的最大数量【中等】","link":"/TNotes.leetcode/3397. 执行操作后不同元素的最大数量【中等】/README"},{"text":"⏰ 3398. 字符相同的最短子字符串 I【困难】","link":"/TNotes.leetcode/3398. 字符相同的最短子字符串 I【困难】/README"},{"text":"⏰ 3399. 字符相同的最短子字符串 II【困难】","link":"/TNotes.leetcode/3399. 字符相同的最短子字符串 II【困难】/README"},{"text":"⏰ 3400. 右移后的最大匹配索引数【中等】","link":"/TNotes.leetcode/3400. 右移后的最大匹配索引数【中等】/README"},{"text":"⏰ 3401. 寻找环形礼物交换链【困难】","link":"/TNotes.leetcode/3401. 寻找环形礼物交换链【困难】/README"},{"text":"⏰ 3402. 使每一列严格递增的最少操作次数【简单】","link":"/TNotes.leetcode/3402. 使每一列严格递增的最少操作次数【简单】/README"},{"text":"⏰ 3403. 从盒子中找出字典序最大的字符串 I【中等】","link":"/TNotes.leetcode/3403. 从盒子中找出字典序最大的字符串 I【中等】/README"},{"text":"⏰ 3404. 统计特殊子序列的数目【中等】","link":"/TNotes.leetcode/3404. 统计特殊子序列的数目【中等】/README"},{"text":"⏰ 3405. 统计恰好有 K 个相等相邻元素的数组数目【困难】","link":"/TNotes.leetcode/3405. 统计恰好有 K 个相等相邻元素的数组数目【困难】/README"},{"text":"⏰ 3406. 从盒子中找出字典序最大的字符串 II【困难】","link":"/TNotes.leetcode/3406. 从盒子中找出字典序最大的字符串 II【困难】/README"},{"text":"⏰ 3407. 子字符串匹配模式【简单】","link":"/TNotes.leetcode/3407. 子字符串匹配模式【简单】/README"},{"text":"⏰ 3408. 设计任务管理器【中等】","link":"/TNotes.leetcode/3408. 设计任务管理器【中等】/README"},{"text":"⏰ 3409. 最长相邻绝对差递减子序列【中等】","link":"/TNotes.leetcode/3409. 最长相邻绝对差递减子序列【中等】/README"},{"text":"⏰ 3410. 删除所有值为某个元素后的最大子数组和【困难】","link":"/TNotes.leetcode/3410. 删除所有值为某个元素后的最大子数组和【困难】/README"},{"text":"⏰ 3411. 最长乘积等价子数组【简单】","link":"/TNotes.leetcode/3411. 最长乘积等价子数组【简单】/README"},{"text":"⏰ 3412. 计算字符串的镜像分数【中等】","link":"/TNotes.leetcode/3412. 计算字符串的镜像分数【中等】/README"},{"text":"⏰ 3413. 收集连续 K 个袋子可以获得的最多硬币数量【中等】","link":"/TNotes.leetcode/3413. 收集连续 K 个袋子可以获得的最多硬币数量【中等】/README"},{"text":"⏰ 3414. 不重叠区间的最大得分【困难】","link":"/TNotes.leetcode/3414. 不重叠区间的最大得分【困难】/README"},{"text":"⏰ 3415. 查找具有三个连续数字的产品【简单】","link":"/TNotes.leetcode/3415. 查找具有三个连续数字的产品【简单】/README"},{"text":"⏰ 3416. 唯一中间众数子序列 II【困难】","link":"/TNotes.leetcode/3416. 唯一中间众数子序列 II【困难】/README"},{"text":"⏰ 3417. 跳过交替单元格的之字形遍历【简单】","link":"/TNotes.leetcode/3417. 跳过交替单元格的之字形遍历【简单】/README"},{"text":"⏰ 3418. 机器人可以获得的最大金币数【中等】","link":"/TNotes.leetcode/3418. 机器人可以获得的最大金币数【中等】/README"},{"text":"⏰ 3419. 图的最大边权的最小值【中等】","link":"/TNotes.leetcode/3419. 图的最大边权的最小值【中等】/README"},{"text":"⏰ 3420. 统计 K 次操作以内得到非递减子数组的数目【困难】","link":"/TNotes.leetcode/3420. 统计 K 次操作以内得到非递减子数组的数目【困难】/README"},{"text":"⏰ 3421. 查找进步的学生【中等】","link":"/TNotes.leetcode/3421. 查找进步的学生【中等】/README"},{"text":"⏰ 3422. 将子数组元素变为相等所需的最小操作数【中等】","link":"/TNotes.leetcode/3422. 将子数组元素变为相等所需的最小操作数【中等】/README"},{"text":"⏰ 3423. 循环数组中相邻元素的最大差值【简单】","link":"/TNotes.leetcode/3423. 循环数组中相邻元素的最大差值【简单】/README"},{"text":"⏰ 3424. 将数组变相同的最小代价【中等】","link":"/TNotes.leetcode/3424. 将数组变相同的最小代价【中等】/README"},{"text":"⏰ 3425. 最长特殊路径【困难】","link":"/TNotes.leetcode/3425. 最长特殊路径【困难】/README"},{"text":"⏰ 3426. 所有安放棋子方案的曼哈顿距离【困难】","link":"/TNotes.leetcode/3426. 所有安放棋子方案的曼哈顿距离【困难】/README"},{"text":"⏰ 3427. 变长子数组求和【简单】","link":"/TNotes.leetcode/3427. 变长子数组求和【简单】/README"},{"text":"⏰ 3428. 最多 K 个元素的子序列的最值之和【中等】","link":"/TNotes.leetcode/3428. 最多 K 个元素的子序列的最值之和【中等】/README"},{"text":"⏰ 3429. 粉刷房子 IV【中等】","link":"/TNotes.leetcode/3429. 粉刷房子 IV【中等】/README"},{"text":"⏰ 3430. 最多 K 个元素的子数组的最值之和【困难】","link":"/TNotes.leetcode/3430. 最多 K 个元素的子数组的最值之和【困难】/README"},{"text":"⏰ 3431. 对数字排序的最小解锁下标【中等】","link":"/TNotes.leetcode/3431. 对数字排序的最小解锁下标【中等】/README"},{"text":"⏰ 3432. 统计元素和差值为偶数的分区方案【简单】","link":"/TNotes.leetcode/3432. 统计元素和差值为偶数的分区方案【简单】/README"},{"text":"⏰ 3433. 统计用户被提及情况【中等】","link":"/TNotes.leetcode/3433. 统计用户被提及情况【中等】/README"},{"text":"⏰ 3434. 子数组操作后的最大频率【中等】","link":"/TNotes.leetcode/3434. 子数组操作后的最大频率【中等】/README"},{"text":"⏰ 3435. 最短公共超序列的字母出现频率【困难】","link":"/TNotes.leetcode/3435. 最短公共超序列的字母出现频率【困难】/README"},{"text":"⏰ 3436. 查找合法邮箱【简单】","link":"/TNotes.leetcode/3436. 查找合法邮箱【简单】/README"},{"text":"⏰ 3437. 全排列 III【中等】","link":"/TNotes.leetcode/3437. 全排列 III【中等】/README"},{"text":"⏰ 3438. 找到字符串中合法的相邻数字【简单】","link":"/TNotes.leetcode/3438. 找到字符串中合法的相邻数字【简单】/README"},{"text":"⏰ 3439. 重新安排会议得到最多空余时间 I【中等】","link":"/TNotes.leetcode/3439. 重新安排会议得到最多空余时间 I【中等】/README"},{"text":"⏰ 3440. 重新安排会议得到最多空余时间 II【中等】","link":"/TNotes.leetcode/3440. 重新安排会议得到最多空余时间 II【中等】/README"},{"text":"⏰ 3441. 变成好标题的最少代价【困难】","link":"/TNotes.leetcode/3441. 变成好标题的最少代价【困难】/README"},{"text":"⏰ 3442. 奇偶频次间的最大差值 I【简单】","link":"/TNotes.leetcode/3442. 奇偶频次间的最大差值 I【简单】/README"},{"text":"⏰ 3443. K 次修改后的最大曼哈顿距离【中等】","link":"/TNotes.leetcode/3443. K 次修改后的最大曼哈顿距离【中等】/README"},{"text":"⏰ 3444. 使数组包含目标值倍数的最少增量【困难】","link":"/TNotes.leetcode/3444. 使数组包含目标值倍数的最少增量【困难】/README"},{"text":"⏰ 3445. 奇偶频次间的最大差值 II【困难】","link":"/TNotes.leetcode/3445. 奇偶频次间的最大差值 II【困难】/README"},{"text":"⏰ 3446. 按对角线进行矩阵排序【中等】","link":"/TNotes.leetcode/3446. 按对角线进行矩阵排序【中等】/README"},{"text":"⏰ 3447. 将元素分配给有约束条件的组【中等】","link":"/TNotes.leetcode/3447. 将元素分配给有约束条件的组【中等】/README"},{"text":"⏰ 3448. 统计可以被最后一个数位整除的子字符串数目【困难】","link":"/TNotes.leetcode/3448. 统计可以被最后一个数位整除的子字符串数目【困难】/README"},{"text":"⏰ 3449. 最大化游戏分数的最小值【困难】","link":"/TNotes.leetcode/3449. 最大化游戏分数的最小值【困难】/README"},{"text":"⏰ 3450. 一张长椅上的最多学生【简单】","link":"/TNotes.leetcode/3450. 一张长椅上的最多学生【简单】/README"},{"text":"⏰ 3451. 查找无效的 IP 地址【困难】","link":"/TNotes.leetcode/3451. 查找无效的 IP 地址【困难】/README"},{"text":"⏰ 3452. 好数字之和【简单】","link":"/TNotes.leetcode/3452. 好数字之和【简单】/README"},{"text":"⏰ 3453. 分割正方形 I【中等】","link":"/TNotes.leetcode/3453. 分割正方形 I【中等】/README"},{"text":"⏰ 3454. 分割正方形 II【困难】","link":"/TNotes.leetcode/3454. 分割正方形 II【困难】/README"},{"text":"⏰ 3455. 最短匹配子字符串【困难】","link":"/TNotes.leetcode/3455. 最短匹配子字符串【困难】/README"},{"text":"⏰ 3456. 找出长度为 K 的特殊子字符串【简单】","link":"/TNotes.leetcode/3456. 找出长度为 K 的特殊子字符串【简单】/README"},{"text":"⏰ 3457. 吃披萨【中等】","link":"/TNotes.leetcode/3457. 吃披萨【中等】/README"},{"text":"⏰ 3458. 选择 K 个互不重叠的特殊子字符串【中等】","link":"/TNotes.leetcode/3458. 选择 K 个互不重叠的特殊子字符串【中等】/README"},{"text":"⏰ 3459. 最长 V 形对角线段的长度【困难】","link":"/TNotes.leetcode/3459. 最长 V 形对角线段的长度【困难】/README"},{"text":"⏰ 3460. 最多删除一次后的最长公共前缀【中等】","link":"/TNotes.leetcode/3460. 最多删除一次后的最长公共前缀【中等】/README"},{"text":"⏰ 3461. 判断操作后字符串中的数字是否相等 I【简单】","link":"/TNotes.leetcode/3461. 判断操作后字符串中的数字是否相等 I【简单】/README"},{"text":"⏰ 3462. 提取至多 K 个元素的最大总和【中等】","link":"/TNotes.leetcode/3462. 提取至多 K 个元素的最大总和【中等】/README"},{"text":"⏰ 3463. 判断操作后字符串中的数字是否相等 II【困难】","link":"/TNotes.leetcode/3463. 判断操作后字符串中的数字是否相等 II【困难】/README"},{"text":"⏰ 3464. 正方形上的点之间的最大距离【困难】","link":"/TNotes.leetcode/3464. 正方形上的点之间的最大距离【困难】/README"},{"text":"⏰ 3465. 查找具有有效序列号的产品【简单】","link":"/TNotes.leetcode/3465. 查找具有有效序列号的产品【简单】/README"},{"text":"⏰ 3466. 最大硬币收集量【中等】","link":"/TNotes.leetcode/3466. 最大硬币收集量【中等】/README"},{"text":"⏰ 3467. 将数组按照奇偶性转化【简单】","link":"/TNotes.leetcode/3467. 将数组按照奇偶性转化【简单】/README"},{"text":"⏰ 3468. 可行数组的数目【中等】","link":"/TNotes.leetcode/3468. 可行数组的数目【中等】/README"},{"text":"⏰ 3469. 移除所有数组元素的最小代价【中等】","link":"/TNotes.leetcode/3469. 移除所有数组元素的最小代价【中等】/README"},{"text":"⏰ 3470. 全排列 IV【困难】","link":"/TNotes.leetcode/3470. 全排列 IV【困难】/README"},{"text":"⏰ 3471. 找出最大的几近缺失整数【简单】","link":"/TNotes.leetcode/3471. 找出最大的几近缺失整数【简单】/README"},{"text":"⏰ 3472. 至多 K 次操作后的最长回文子序列【中等】","link":"/TNotes.leetcode/3472. 至多 K 次操作后的最长回文子序列【中等】/README"},{"text":"⏰ 3473. 长度至少为 M 的 K 个子数组之和【中等】","link":"/TNotes.leetcode/3473. 长度至少为 M 的 K 个子数组之和【中等】/README"},{"text":"⏰ 3474. 字典序最小的生成字符串【困难】","link":"/TNotes.leetcode/3474. 字典序最小的生成字符串【困难】/README"},{"text":"⏰ 3475. DNA 模式识别【中等】","link":"/TNotes.leetcode/3475. DNA 模式识别【中等】/README"},{"text":"⏰ 3476. 最大化任务分配的利润【中等】","link":"/TNotes.leetcode/3476. 最大化任务分配的利润【中等】/README"},{"text":"⏰ 3477. 水果成篮 II【简单】","link":"/TNotes.leetcode/3477. 水果成篮 II【简单】/README"},{"text":"⏰ 3478. 选出和最大的 K 个元素【中等】","link":"/TNotes.leetcode/3478. 选出和最大的 K 个元素【中等】/README"},{"text":"⏰ 3479. 将水果装入篮子 III【中等】","link":"/TNotes.leetcode/3479. 将水果装入篮子 III【中等】/README"},{"text":"⏰ 3480. 删除一个冲突对后最大子数组数目【困难】","link":"/TNotes.leetcode/3480. 删除一个冲突对后最大子数组数目【困难】/README"},{"text":"⏰ 3481. 应用替换【中等】","link":"/TNotes.leetcode/3481. 应用替换【中等】/README"},{"text":"⏰ 3482. 分析组织层级【困难】","link":"/TNotes.leetcode/3482. 分析组织层级【困难】/README"},{"text":"⏰ 3483. 不同三位偶数的数目【简单】","link":"/TNotes.leetcode/3483. 不同三位偶数的数目【简单】/README"},{"text":"⏰ 3484. 设计电子表格【中等】","link":"/TNotes.leetcode/3484. 设计电子表格【中等】/README"},{"text":"⏰ 3485. 删除元素后 K 个字符串的最长公共前缀【困难】","link":"/TNotes.leetcode/3485. 删除元素后 K 个字符串的最长公共前缀【困难】/README"},{"text":"⏰ 3486. 最长特殊路径 II【困难】","link":"/TNotes.leetcode/3486. 最长特殊路径 II【困难】/README"},{"text":"⏰ 3487. 删除后的最大子数组元素和【简单】","link":"/TNotes.leetcode/3487. 删除后的最大子数组元素和【简单】/README"},{"text":"⏰ 3488. 距离最小相等元素查询【中等】","link":"/TNotes.leetcode/3488. 距离最小相等元素查询【中等】/README"},{"text":"⏰ 3489. 零数组变换 IV【中等】","link":"/TNotes.leetcode/3489. 零数组变换 IV【中等】/README"},{"text":"⏰ 3490. 统计美丽整数的数目【困难】","link":"/TNotes.leetcode/3490. 统计美丽整数的数目【困难】/README"},{"text":"⏰ 3491. 电话号码前缀【简单】","link":"/TNotes.leetcode/3491. 电话号码前缀【简单】/README"},{"text":"⏰ 3492. 船上可以装载的最大集装箱数量【简单】","link":"/TNotes.leetcode/3492. 船上可以装载的最大集装箱数量【简单】/README"},{"text":"⏰ 3493. 属性图【中等】","link":"/TNotes.leetcode/3493. 属性图【中等】/README"},{"text":"⏰ 3494. 酿造药水需要的最少总时间【中等】","link":"/TNotes.leetcode/3494. 酿造药水需要的最少总时间【中等】/README"},{"text":"⏰ 3495. 使数组元素都变为零的最少操作次数【困难】","link":"/TNotes.leetcode/3495. 使数组元素都变为零的最少操作次数【困难】/README"},{"text":"⏰ 3496. 最大化配对删除后的得分【中等】","link":"/TNotes.leetcode/3496. 最大化配对删除后的得分【中等】/README"},{"text":"⏰ 3497. 分析订阅转化【中等】","link":"/TNotes.leetcode/3497. 分析订阅转化【中等】/README"},{"text":"⏰ 3498. 字符串的反转度【简单】","link":"/TNotes.leetcode/3498. 字符串的反转度【简单】/README"},{"text":"⏰ 3499. 操作后最大活跃区段数 I【中等】","link":"/TNotes.leetcode/3499. 操作后最大活跃区段数 I【中等】/README"},{"text":"⏰ 3500. 将数组分割为子数组的最小代价【困难】","link":"/TNotes.leetcode/3500. 将数组分割为子数组的最小代价【困难】/README"},{"text":"⏰ 3501. 操作后最大活跃区段数 II【困难】","link":"/TNotes.leetcode/3501. 操作后最大活跃区段数 II【困难】/README"},{"text":"⏰ 3502. 到达每个位置的最小费用【简单】","link":"/TNotes.leetcode/3502. 到达每个位置的最小费用【简单】/README"},{"text":"⏰ 3503. 子字符串连接后的最长回文串 I【中等】","link":"/TNotes.leetcode/3503. 子字符串连接后的最长回文串 I【中等】/README"},{"text":"⏰ 3504. 子字符串连接后的最长回文串 II【困难】","link":"/TNotes.leetcode/3504. 子字符串连接后的最长回文串 II【困难】/README"},{"text":"⏰ 3505. 使 K 个子数组内元素相等的最少操作数【困难】","link":"/TNotes.leetcode/3505. 使 K 个子数组内元素相等的最少操作数【困难】/README"},{"text":"⏰ 3506. 查找消除细菌菌株所需时间【困难】","link":"/TNotes.leetcode/3506. 查找消除细菌菌株所需时间【困难】/README"},{"text":"⏰ 3507. 移除最小数对使数组有序 I【简单】","link":"/TNotes.leetcode/3507. 移除最小数对使数组有序 I【简单】/README"},{"text":"⏰ 3508. 设计路由器【中等】","link":"/TNotes.leetcode/3508. 设计路由器【中等】/README"},{"text":"⏰ 3509. 最大化交错和为 K 的子序列乘积【困难】","link":"/TNotes.leetcode/3509. 最大化交错和为 K 的子序列乘积【困难】/README"},{"text":"⏰ 3510. 移除最小数对使数组有序 II【困难】","link":"/TNotes.leetcode/3510. 移除最小数对使数组有序 II【困难】/README"},{"text":"⏰ 3511. 构造正数组【中等】","link":"/TNotes.leetcode/3511. 构造正数组【中等】/README"},{"text":"⏰ 3512. 使数组和能被 K 整除的最少操作次数【简单】","link":"/TNotes.leetcode/3512. 使数组和能被 K 整除的最少操作次数【简单】/README"},{"text":"⏰ 3513. 不同 XOR 三元组的数目 I【中等】","link":"/TNotes.leetcode/3513. 不同 XOR 三元组的数目 I【中等】/README"},{"text":"⏰ 3514. 不同 XOR 三元组的数目 II【中等】","link":"/TNotes.leetcode/3514. 不同 XOR 三元组的数目 II【中等】/README"},{"text":"⏰ 3515. 带权树中的最短路径【困难】","link":"/TNotes.leetcode/3515. 带权树中的最短路径【困难】/README"},{"text":"⏰ 3516. 找到最近的人【简单】","link":"/TNotes.leetcode/3516. 找到最近的人【简单】/README"},{"text":"⏰ 3517. 最小回文排列 I【中等】","link":"/TNotes.leetcode/3517. 最小回文排列 I【中等】/README"},{"text":"⏰ 3518. 最小回文排列 II【困难】","link":"/TNotes.leetcode/3518. 最小回文排列 II【困难】/README"},{"text":"⏰ 3519. 统计逐位非递减的整数【困难】","link":"/TNotes.leetcode/3519. 统计逐位非递减的整数【困难】/README"},{"text":"⏰ 3520. 逆序对计数的最小阈值【中等】","link":"/TNotes.leetcode/3520. 逆序对计数的最小阈值【中等】/README"},{"text":"⏰ 3521. 查找推荐产品对【中等】","link":"/TNotes.leetcode/3521. 查找推荐产品对【中等】/README"},{"text":"⏰ 3522. 执行指令后的得分【中等】","link":"/TNotes.leetcode/3522. 执行指令后的得分【中等】/README"},{"text":"⏰ 3523. 非递减数组的最大长度【中等】","link":"/TNotes.leetcode/3523. 非递减数组的最大长度【中等】/README"},{"text":"⏰ 3524. 求出数组的 X 值 I【中等】","link":"/TNotes.leetcode/3524. 求出数组的 X 值 I【中等】/README"},{"text":"⏰ 3525. 求出数组的 X 值 II【困难】","link":"/TNotes.leetcode/3525. 求出数组的 X 值 II【困难】/README"},{"text":"⏰ 3526. 范围异或查询与子数组反转【困难】","link":"/TNotes.leetcode/3526. 范围异或查询与子数组反转【困难】/README"},{"text":"⏰ 3527. 找到最常见的回答【中等】","link":"/TNotes.leetcode/3527. 找到最常见的回答【中等】/README"},{"text":"⏰ 3528. 单位转换 I【中等】","link":"/TNotes.leetcode/3528. 单位转换 I【中等】/README"},{"text":"⏰ 3529. 统计水平子串和垂直子串重叠格子的数目【中等】","link":"/TNotes.leetcode/3529. 统计水平子串和垂直子串重叠格子的数目【中等】/README"},{"text":"⏰ 3530. 有向无环图中合法拓扑排序的最大利润【困难】","link":"/TNotes.leetcode/3530. 有向无环图中合法拓扑排序的最大利润【困难】/README"},{"text":"⏰ 3531. 统计被覆盖的建筑【中等】","link":"/TNotes.leetcode/3531. 统计被覆盖的建筑【中等】/README"},{"text":"⏰ 3532. 针对图的路径存在性查询 I【中等】","link":"/TNotes.leetcode/3532. 针对图的路径存在性查询 I【中等】/README"},{"text":"⏰ 3533. 判断连接可整除性【困难】","link":"/TNotes.leetcode/3533. 判断连接可整除性【困难】/README"},{"text":"⏰ 3534. 针对图的路径存在性查询 II【困难】","link":"/TNotes.leetcode/3534. 针对图的路径存在性查询 II【困难】/README"},{"text":"⏰ 3535. 单位转换 II【中等】","link":"/TNotes.leetcode/3535. 单位转换 II【中等】/README"},{"text":"⏰ 3536. 两个数字的最大乘积【简单】","link":"/TNotes.leetcode/3536. 两个数字的最大乘积【简单】/README"},{"text":"⏰ 3537. 填充特殊网格【中等】","link":"/TNotes.leetcode/3537. 填充特殊网格【中等】/README"},{"text":"⏰ 3538. 合并得到最小旅行时间【困难】","link":"/TNotes.leetcode/3538. 合并得到最小旅行时间【困难】/README"},{"text":"⏰ 3539. 魔法序列的数组乘积之和【困难】","link":"/TNotes.leetcode/3539. 魔法序列的数组乘积之和【困难】/README"},{"text":"⏰ 3540. 访问所有房屋的最短时间【中等】","link":"/TNotes.leetcode/3540. 访问所有房屋的最短时间【中等】/README"},{"text":"⏰ 3541. 找到频率最高的元音和辅音【简单】","link":"/TNotes.leetcode/3541. 找到频率最高的元音和辅音【简单】/README"},{"text":"⏰ 3542. 将所有元素变为 0 的最少操作次数【中等】","link":"/TNotes.leetcode/3542. 将所有元素变为 0 的最少操作次数【中等】/README"},{"text":"⏰ 3543. K 条边路径的最大边权和【中等】","link":"/TNotes.leetcode/3543. K 条边路径的最大边权和【中等】/README"},{"text":"⏰ 3544. 子树反转和【困难】","link":"/TNotes.leetcode/3544. 子树反转和【困难】/README"},{"text":"⏰ 3545. 不同字符数量最多为 K 时的最少删除数【简单】","link":"/TNotes.leetcode/3545. 不同字符数量最多为 K 时的最少删除数【简单】/README"},{"text":"⏰ 3546. 等和矩阵分割 I【中等】","link":"/TNotes.leetcode/3546. 等和矩阵分割 I【中等】/README"},{"text":"⏰ 3547. 图中边值的最大和【困难】","link":"/TNotes.leetcode/3547. 图中边值的最大和【困难】/README"},{"text":"⏰ 3548. 等和矩阵分割 II【困难】","link":"/TNotes.leetcode/3548. 等和矩阵分割 II【困难】/README"},{"text":"⏰ 3549. 两个多项式相乘【困难】","link":"/TNotes.leetcode/3549. 两个多项式相乘【困难】/README"},{"text":"⏰ 3550. 数位和等于下标的最小下标【简单】","link":"/TNotes.leetcode/3550. 数位和等于下标的最小下标【简单】/README"},{"text":"⏰ 3551. 数位和排序需要的最小交换次数【中等】","link":"/TNotes.leetcode/3551. 数位和排序需要的最小交换次数【中等】/README"},{"text":"⏰ 3552. 网格传送门旅游【中等】","link":"/TNotes.leetcode/3552. 网格传送门旅游【中等】/README"},{"text":"⏰ 3553. 包含给定路径的最小带权子树 II【困难】","link":"/TNotes.leetcode/3553. 包含给定路径的最小带权子树 II【困难】/README"},{"text":"⏰ 3554. 查找类别推荐对【困难】","link":"/TNotes.leetcode/3554. 查找类别推荐对【困难】/README"},{"text":"⏰ 3555. 排序每个滑动窗口中最小的子数组【中等】","link":"/TNotes.leetcode/3555. 排序每个滑动窗口中最小的子数组【中等】/README"},{"text":"⏰ 3556. 最大质数子字符串之和【中等】","link":"/TNotes.leetcode/3556. 最大质数子字符串之和【中等】/README"},{"text":"⏰ 3557. 不相交子字符串的最大数量【中等】","link":"/TNotes.leetcode/3557. 不相交子字符串的最大数量【中等】/README"},{"text":"⏰ 3558. 给边赋权值的方案数 I【中等】","link":"/TNotes.leetcode/3558. 给边赋权值的方案数 I【中等】/README"},{"text":"⏰ 3559. 给边赋权值的方案数 II【困难】","link":"/TNotes.leetcode/3559. 给边赋权值的方案数 II【困难】/README"},{"text":"⏰ 3560. 木材运输的最小成本【简单】","link":"/TNotes.leetcode/3560. 木材运输的最小成本【简单】/README"},{"text":"⏰ 3561. 移除相邻字符【中等】","link":"/TNotes.leetcode/3561. 移除相邻字符【中等】/README"},{"text":"⏰ 3562. 折扣价交易股票的最大利润【困难】","link":"/TNotes.leetcode/3562. 折扣价交易股票的最大利润【困难】/README"},{"text":"⏰ 3563. 移除相邻字符后字典序最小的字符串【困难】","link":"/TNotes.leetcode/3563. 移除相邻字符后字典序最小的字符串【困难】/README"},{"text":"⏰ 3564. 季节性销售分析【中等】","link":"/TNotes.leetcode/3564. 季节性销售分析【中等】/README"}]},{"text":"2. 其他","collapsed":true,"items":[{"text":"2.1. 一键提取题目内容为 markdown 的油猴脚本","collapsed":true,"items":[{"text":"⏰ 9999. 油猴脚本 - LeetCode 题目描述爬取","link":"/TNotes.leetcode/9999. 油猴脚本 - LeetCode 题目描述爬取/README"}]},{"text":"2.2. GitHub 技术社区 Doocs 开源项目 leetcode","collapsed":true,"items":[{"text":"⏰ 9997. GitHub 技术社区 Doocs 开源项目 leetcode","link":"/TNotes.leetcode/9997. GitHub 技术社区 Doocs 开源项目 leetcode/README"},{"text":"⏰ 9998. leetcode 刷题指南 - 新手快速入门 - 数据结构、算法","link":"/TNotes.leetcode/9998. leetcode 刷题指南 - 新手快速入门 - 数据结构、算法/README"}]}]}]},{"text":"miniprogram","link":"https://tdahuyou.github.io/TNotes.miniprogram/","collapsed":true,"items":[{"text":"1. 快速开始","collapsed":true,"items":[{"text":"⏰ 创建你的第一个微信小程序","link":"/TNotes.miniprogram/0001. 创建你的第一个微信小程序/README"}]},{"text":"2. WXML","collapsed":true,"items":[{"text":"⏰ WXML - 简介","link":"/TNotes.miniprogram/0002. WXML - 简介/README"},{"text":"⏰ WXML - 基本使用","link":"/TNotes.miniprogram/0003. WXML - 基本使用/README"},{"text":"⏰ WXML - 数据绑定","link":"/TNotes.miniprogram/0004. WXML - 数据绑定/README"},{"text":"⏰ WXML - 列表渲染","link":"/TNotes.miniprogram/0005. WXML - 列表渲染/README"},{"text":"⏰ WXML - 条件渲染","link":"/TNotes.miniprogram/0006. WXML - 条件渲染/README"},{"text":"⏰ WXML - 模板","link":"/TNotes.miniprogram/0007. WXML - 模板/README"},{"text":"⏰ WXML - 引用","link":"/TNotes.miniprogram/0008. WXML - 引用/README"}]},{"text":"3. 网络请求","collapsed":true,"items":[{"text":"⏰ 使用 wx.request 请求本地服务","link":"/TNotes.miniprogram/0009. 使用 wx.request 请求本地服务/README"}]},{"text":"4. 实战小练习","collapsed":true,"items":[{"text":"⏰ 实现翻译小程序","link":"/TNotes.miniprogram/0010. 实现翻译小程序/README"}]},{"text":"5. 其他","collapsed":true,"items":[{"text":"⏰ 查看 AppID","link":"/TNotes.miniprogram/0011. 查看 AppID/README"}]}]},{"text":"network","link":"https://tdahuyou.github.io/TNotes.network/","collapsed":true,"items":[{"text":"1. ⏰ pending","collapsed":true,"items":[{"text":"⏰ web 服务器的 429 错误","link":"/TNotes.network/0001. web 服务器的 429 错误/README"}]}]},{"text":"nodejs","link":"https://tdahuyou.github.io/TNotes.nodejs/","collapsed":true,"items":[{"text":"1. 学习资源","collapsed":true,"items":[{"text":"1.1. 概述","collapsed":true,"items":[{"text":"✅ nodejs 学习资源概述","link":"/TNotes.nodejs/0030. nodejs 学习资源概述/README"}]},{"text":"1.2. 官方文档","collapsed":true,"items":[{"text":"⏰ nodejs 官方文档","link":"/TNotes.nodejs/0026. nodejs 官方文档/README"}]},{"text":"1.3. Node.js 书籍","collapsed":true,"items":[{"text":"✅ 《Node.js 从入门到精通》","link":"/TNotes.nodejs/0032. 《Node.js 从入门到精通》/README"},{"text":"✅ 《深入浅出 Node.js》","link":"/TNotes.nodejs/0015. 《深入浅出 Node.js》/README"},{"text":"✅ 《Node.js来一打C++扩展》","link":"/TNotes.nodejs/0016. 《Node.js来一打C++扩展》/README"},{"text":"✅ 《Node与Express开发》","link":"/TNotes.nodejs/0017. 《Node与Express开发》/README"},{"text":"✅ 《Node.js开发指南》","link":"/TNotes.nodejs/0018. 《Node.js开发指南》/README"},{"text":"✅ 《了不起的Node js 将JavaScript进行到底》","link":"/TNotes.nodejs/0019. 《了不起的Node js 将JavaScript进行到底》/README"}]},{"text":"1.4. Node.js 掘金小册","collapsed":true,"items":[{"text":"✅ 《Node.js 入门教程》（免费掘金小册）","link":"/TNotes.nodejs/0022. 《Node.js 入门教程》（免费掘金小册）/README"}]},{"text":"1.5. 其他在线教程","collapsed":true,"items":[{"text":"✅ 菜鸟教程","link":"/TNotes.nodejs/0025. 菜鸟教程/README"}]}]},{"text":"2. 认识 Node.js","collapsed":true,"items":[{"text":"✅ 什么是 Node.js","link":"/TNotes.nodejs/0031. 什么是 Node.js/README"},{"text":"✅ Node.js 的工作原理概述","link":"/TNotes.nodejs/0033. Node.js 的工作原理概述/README"},{"text":"✅ Node.js 的优缺点","link":"/TNotes.nodejs/0034. Node.js 的优缺点/README"},{"text":"✅ Node.js 能用来做什么","link":"/TNotes.nodejs/0035. Node.js 能用来做什么/README"},{"text":"✅ 谁在使用 Node.js","link":"/TNotes.nodejs/0036. 谁在使用 Node.js/README"},{"text":"✅ 第一个 Node.js 服务器程序 - Hello World","link":"/TNotes.nodejs/0037. 第一个 Node.js 服务器程序 - Hello World/README"}]},{"text":"3. npm 包管理器","collapsed":true,"items":[{"text":"✅ 认识 npm","link":"/TNotes.nodejs/0038. 认识 npm/README"},{"text":"✅ 常见的 npm 包及作用","link":"/TNotes.nodejs/0039. 常见的 npm 包及作用/README"},{"text":"✅ npm 版本","link":"/TNotes.nodejs/0040. npm 版本/README"},{"text":"✅ 常见的 npm 命令","link":"/TNotes.nodejs/0041. 常见的 npm 命令/README"},{"text":"✅ 认识 package.json","link":"/TNotes.nodejs/0042. 认识 package.json/README"},{"text":"✅ 认识 package-lock.json","link":"/TNotes.nodejs/0043. 认识 package-lock.json/README"}]},{"text":"4. 全局模块","collapsed":true,"items":[{"text":"✅ __filename 和 __dirname","link":"/TNotes.nodejs/0044. __filename 和 __dirname/README"},{"text":"✅ console","link":"/TNotes.nodejs/0045. console/README"},{"text":"✅ process","link":"/TNotes.nodejs/0049. process/README"},{"text":"✅ 全局定时器：setTimeout、setInterval、setImmediate","link":"/TNotes.nodejs/0046. 全局定时器：setTimeout、setInterval、setImmediate/README"},{"text":"⏰ exports 对象","link":"/TNotes.nodejs/0047. exports 对象/README"},{"text":"⏰ module 对象","link":"/TNotes.nodejs/0048. module 对象/README"}]},{"text":"5. 事件的监听与触发","collapsed":true,"items":[{"text":"✅ EventEmitter","link":"/TNotes.nodejs/0052. EventEmitter/README"}]},{"text":"6. util 工具模块","collapsed":true,"items":[{"text":"✅ util","link":"/TNotes.nodejs/0051. util/README"},{"text":"✅ 错误优先的回调风格","link":"/TNotes.nodejs/0054. 错误优先的回调风格/README"}]},{"text":"7. fs 文件系统模块","collapsed":true,"items":[{"text":"✅ fs 文件系统模块概述","link":"/TNotes.nodejs/0055. fs 文件系统模块概述/README"},{"text":"✅ 文件检查","link":"/TNotes.nodejs/0056. 文件检查/README"},{"text":"✅ 文件读取","link":"/TNotes.nodejs/0057. 文件读取/README"},{"text":"✅ 文件写入","link":"/TNotes.nodejs/0058. 文件写入/README"},{"text":"✅ 文件截断","link":"/TNotes.nodejs/0066. 文件截断/README"},{"text":"✅ 文件删除","link":"/TNotes.nodejs/0067. 文件删除/README"},{"text":"✅ 文件复制","link":"/TNotes.nodejs/0068. 文件复制/README"},{"text":"✅ 文件重命名","link":"/TNotes.nodejs/0069. 文件重命名/README"},{"text":"✅ 创建目录","link":"/TNotes.nodejs/0053. 创建目录/README"},{"text":"✅ 删除目录","link":"/TNotes.nodejs/0060. 删除目录/README"},{"text":"✅ 读取目录内容","link":"/TNotes.nodejs/0064. 读取目录内容/README"},{"text":"✅ 查看目录或文件信息","link":"/TNotes.nodejs/0065. 查看目录或文件信息/README"},{"text":"✅ 认识符号链接","link":"/TNotes.nodejs/0071. 认识符号链接/README"},{"text":"✅ 创建符号链接","link":"/TNotes.nodejs/0072. 创建符号链接/README"},{"text":"✅ 查看符号链接信息","link":"/TNotes.nodejs/0070. 查看符号链接信息/README"},{"text":"✅ 获取解析后的绝对路径","link":"/TNotes.nodejs/0059. 获取解析后的绝对路径/README"},{"text":"✅ fs.constants","link":"/TNotes.nodejs/0061. fs.constants/README"},{"text":"✅ fs 中的 mode","link":"/TNotes.nodejs/0062. fs 中的 mode/README"}]},{"text":"8. path 路径处理模块","collapsed":true,"items":[{"text":"✅ path 模块概述","link":"/TNotes.nodejs/0078. path 模块概述/README"}]},{"text":"9. os 操作系统模块","collapsed":true,"items":[{"text":"✅ os 操作系统模块概述","link":"/TNotes.nodejs/0073. os 操作系统模块概述/README"},{"text":"✅ 管理进程的调度优先级","link":"/TNotes.nodejs/0074. 管理进程的调度优先级/README"}]},{"text":"10. 网络基础概念","collapsed":true,"items":[{"text":"✅ 理解“请求”和“响应”","link":"/TNotes.nodejs/0084. 理解“请求”和“响应”/README"},{"text":"✅ 理解“客户端”和“服务端”","link":"/TNotes.nodejs/0085. 理解“客户端”和“服务端”/README"}]},{"text":"11. 网络相关模块","collapsed":true,"items":[{"text":"11.1. net","collapsed":true,"items":[{"text":"⏰ net 模块概述","link":"/TNotes.nodejs/0077. net 模块概述/README"}]},{"text":"11.2. http","collapsed":true,"items":[{"text":"✅ http 模块概述","link":"/TNotes.nodejs/0080. http 模块概述/README"},{"text":"⏰ 基于 http 模块实现一个简单的静态资源服务器","link":"/TNotes.nodejs/0081. 基于 http 模块实现一个简单的静态资源服务器/README"}]},{"text":"11.3. https","collapsed":true,"items":[{"text":"✅ 基于 nodejs 在本地快速启动一个 https 服务","link":"/TNotes.nodejs/0028. 基于 nodejs 在本地快速启动一个 https 服务/README"}]},{"text":"11.4. url","collapsed":true,"items":[{"text":"✅ url 模块概述","link":"/TNotes.nodejs/0082. url 模块概述/README"}]},{"text":"11.5. querystring","collapsed":true,"items":[{"text":"✅ querystring 模块概述","link":"/TNotes.nodejs/0083. querystring 模块概述/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0086. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0087. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0088. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0089. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0090. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0091. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0092. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0093. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0094. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0095. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0096. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0097. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0098. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0099. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.nodejs/0100. xxx/README"}]}]},{"text":"12. I/O 流操作 ⏰","collapsed":true,"items":[{"text":"⏰ I、O 流操作概述","link":"/TNotes.nodejs/0075. I、O 流操作概述/README"}]},{"text":"13. Web 应用构建基础 ⏰","collapsed":true,"items":[]},{"text":"14. 数据库基础知识 💪","collapsed":true,"items":[{"text":"⏰ 表之间的关系","link":"/TNotes.nodejs/0079. 表之间的关系/README"}]},{"text":"15. 核心原理","collapsed":true,"items":[{"text":"✅ Node.js 生命周期","link":"/TNotes.nodejs/0050. Node.js 生命周期/README"}]},{"text":"16. ⏰ pending","collapsed":true,"items":[{"text":"16.1. process","collapsed":true,"items":[{"text":"⏰ 使用 process 模块来区分不同的操作系统","link":"/TNotes.nodejs/0001. 使用 process 模块来区分不同的操作系统/README"},{"text":"⏰ 通过 process.argv 获取脚本的命令行参数","link":"/TNotes.nodejs/0020. 通过 process.argv 获取脚本的命令行参数/README"}]},{"text":"16.2. crypto","collapsed":true,"items":[{"text":"⏰ crypto 模块中的 hash 工具方法 createHash","link":"/TNotes.nodejs/0002. crypto 模块中的 hash 工具方法 createHash/README"},{"text":"⏰ crypto 模块","link":"/TNotes.nodejs/0007. crypto 模块/README"}]},{"text":"16.3. 版本管理工具","collapsed":true,"items":[{"text":"✅ nvm","link":"/TNotes.nodejs/0029. nvm/README"}]},{"text":"16.4. koa","collapsed":true,"items":[{"text":"⏰ koa-send","link":"/TNotes.nodejs/0008. koa-send/README"},{"text":"⏰ koa-static","link":"/TNotes.nodejs/0009. koa-static/README"}]},{"text":"16.5. npm 相关","collapsed":true,"items":[{"text":"⏰ 使用 nrm 管理 npm 源","link":"/TNotes.nodejs/0012. 使用 nrm 管理 npm 源/README"},{"text":"⏰ 如何使用 nvm 管理 nodejs 版本","link":"/TNotes.nodejs/0014. 如何使用 nvm 管理 nodejs 版本/README"},{"text":"⏰ npm 生命周期 prepublish","link":"/TNotes.nodejs/0010. npm 生命周期 prepublish/README"},{"text":"⏰ npm 配置文件 .npmrc","link":"/TNotes.nodejs/0011. npm 配置文件 .npmrc/README"},{"text":"⏰ npm link 基本使用","link":"/TNotes.nodejs/0024. npm link 基本使用/README"},{"text":"⏰ npm 内置命令","link":"/TNotes.nodejs/0023. npm 内置命令/README"}]},{"text":"16.6. nodejs 命令行操作","collapsed":true,"items":[{"text":"⏰ 使用 npm_lifecycle_script 获取当前运行的 nodejs 命令","link":"/TNotes.nodejs/0003. 使用 npm_lifecycle_script 获取当前运行的 nodejs 命令/README"},{"text":"⏰ 学会使用 nodejs 运行 .js 文件","link":"/TNotes.nodejs/0004. 学会使用 nodejs 运行 .js 文件/README"},{"text":"⏰ 安装 nodejs","link":"/TNotes.nodejs/0013. 安装 nodejs/README"},{"text":"⏰ minimist 基本使用","link":"/TNotes.nodejs/0021. minimist 基本使用/README"}]},{"text":"16.7. others","collapsed":true,"items":[{"text":"⏰ 获取 macos 下都安装了哪些应用","link":"/TNotes.nodejs/0005. 获取 macos 下都安装了哪些应用/README"},{"text":"⏰ 使用 screencapture 命令实现 macos 系统截图","link":"/TNotes.nodejs/0006. 使用 screencapture 命令实现 macos 系统截图/README"},{"text":"⏰ 在 Windows 的 power shell 中执行 pnpm i 命令错误问题","link":"/TNotes.nodejs/0027. 在 Windows 的 power shell 中执行 pnpm i 命令错误问题/README"},{"text":"⏰ Node.js 学习路线","link":"/TNotes.nodejs/0063. Node.js 学习路线/README"},{"text":"⏰ exec vs. spawn","link":"/TNotes.nodejs/0076. exec vs. spawn/README"}]}]}]},{"text":"notes","link":"https://tdahuyou.github.io/TNotes.notes/","collapsed":true,"items":[{"text":"1. Introduction","collapsed":true,"items":[{"text":"✅ 仓库简介","link":"/TNotes.notes/0016. 仓库简介/README"}]},{"text":"2. Snipaste","collapsed":true,"items":[{"text":"✅ Snipaste 截图工具","link":"/TNotes.notes/0005. Snipaste 截图工具/README"},{"text":"✅ 回复关于 snipaste 下载失败的问题","link":"/TNotes.notes/0017. 回复关于 snipaste 下载失败的问题/README"},{"text":"✅ 梦想中完美的截图软件，终于有人开发出来了！","link":"/TNotes.notes/0019. 梦想中完美的截图软件，终于有人开发出来了！/README"}]},{"text":"3. LICEcap","collapsed":true,"items":[{"text":"✅ 使用 LICEcap 在 macos 和 windows 系统上录制 gif 图","link":"/TNotes.notes/0001. 使用 LICEcap 在 macos 和 windows 系统上录制 gif 图/README"}]},{"text":"4. AltTab","collapsed":true,"items":[{"text":"✅ AltTab","link":"/TNotes.notes/0046. AltTab/README"}]},{"text":"5. Wgesture","collapsed":true,"items":[{"text":"✅ Wgesture 鼠标手势工具","link":"/TNotes.notes/0006. Wgesture 鼠标手势工具/README"}]},{"text":"6. WeRead","collapsed":true,"items":[{"text":"❌ WeRead 微信读书辅助工具","link":"/TNotes.notes/0007. WeRead 微信读书辅助工具/README"}]},{"text":"7. SimpRead","collapsed":true,"items":[{"text":"✅ SimpRead 文章收集工具","link":"/TNotes.notes/0010. SimpRead 文章收集工具/README"}]},{"text":"8. TypingClub","collapsed":true,"items":[{"text":"✅ TypingClub 打字练习工具","link":"/TNotes.notes/0008. TypingClub 打字练习工具/README"}]},{"text":"9. Qwerty Learner","collapsed":true,"items":[{"text":"✅ Qwerty Learner 打字练习 + 学习外语工具","link":"/TNotes.notes/0009. Qwerty Learner 打字练习 + 学习外语工具/README"}]},{"text":"10. TTSmaker","collapsed":true,"items":[{"text":"✅ TTSmaker 文本转语音在线工具","link":"/TNotes.notes/0011. TTSmaker 文本转语音在线工具/README"}]},{"text":"11. Deskpins","collapsed":true,"items":[{"text":"✅ DeskPins windows 窗口置顶工具","link":"/TNotes.notes/0012. DeskPins windows 窗口置顶工具/README"}]},{"text":"12. ScreenBrush","collapsed":true,"items":[{"text":"✅ screen brush macos 屏幕画笔工具","link":"/TNotes.notes/0014. screen brush macos 屏幕画笔工具/README"}]},{"text":"13. twinkle-tray","collapsed":true,"items":[{"text":"✅ twinkletray","link":"/TNotes.notes/0042. twinkletray/README"}]},{"text":"14. Chrome","collapsed":true,"items":[{"text":"✅ chrome 上的 Scripty 插件介绍","link":"/TNotes.notes/0004. chrome 上的 Scripty 插件介绍/README"},{"text":"✅ Video Speed Controller","link":"/TNotes.notes/0022. Video Speed Controller/README"},{"text":"✅ 在 GitHub 上预览自己的笔记时处理一些默认样式","link":"/TNotes.notes/0003. 在 GitHub 上预览自己的笔记时处理一些默认样式/README"},{"text":"✅ chrome for developers 站点简介","link":"/TNotes.notes/0015. chrome for developers 站点简介/README"},{"text":"✅ chrome 插件发布流程","link":"/TNotes.notes/0034. chrome 插件发布流程/README"},{"text":"✅ 将网页转为本地应用","link":"/TNotes.notes/0035. 将网页转为本地应用/README"},{"text":"✅ 基于 chromium 内核的浏览器","link":"/TNotes.notes/0036. 基于 chromium 内核的浏览器/README"},{"text":"✅ 语雀网页脚本","link":"/TNotes.notes/0039. 语雀网页脚本/README"},{"text":"✅ 3ts","link":"/TNotes.notes/0018. 3ts/README"}]},{"text":"15. VS Code","collapsed":true,"items":[{"text":"✅ VSCode 简介","link":"/TNotes.notes/0038. VSCode 简介/README"},{"text":"✅ explorer.confirmDelete","link":"/TNotes.notes/0031. explorer.confirmDelete/README"},{"text":"✅ 固定的标签换行展示","link":"/TNotes.notes/0029. 固定的标签换行展示/README"},{"text":"✅ region 注释","link":"/TNotes.notes/0028. region 注释/README"},{"text":"✅ 修改编辑器的字体为 Fira Code","link":"/TNotes.notes/0030. 修改编辑器的字体为 Fira Code/README"},{"text":"✅ lake-editor 插件","link":"/TNotes.notes/0032. lake-editor 插件/README"},{"text":"✅ 解决“在 VSCode 中修改文件、目录时，VSCode 卡死的问题”","link":"/TNotes.notes/0033. 解决“在 VSCode 中修改文件、目录时，VSCode 卡死的问题”/README"},{"text":"⏰ TNotes 的 VSCode 配置项","link":"/TNotes.notes/0037. TNotes 的 VSCode 配置项/README"}]},{"text":"16. Windows","collapsed":true,"items":[{"text":"✅ Windows 锁屏快捷键","link":"/TNotes.notes/0002. Windows 锁屏快捷键/README"},{"text":"✅ 30年前的技术债引发win11离奇bug，微软不敢修！","link":"/TNotes.notes/0020. 30年前的技术债引发win11离奇bug，微软不敢修！/README"}]},{"text":"17. markdown","collapsed":true,"items":[{"text":"✅ Writing on GitHub","link":"/TNotes.notes/0023. Writing on GitHub/README"},{"text":"✅ 在 GitHub 上编写内联公式需要和中文字符区分开","link":"/TNotes.notes/0024. 在 GitHub 上编写内联公式需要和中文字符区分开/README"},{"text":"✅ mermaid 概述","link":"/TNotes.notes/0025. mermaid 概述/README"},{"text":"✅ 使用 mermaid 来绘制思维导图","link":"/TNotes.notes/0027. 使用 mermaid 来绘制思维导图/README"}]},{"text":"18. 猫","collapsed":true,"items":[{"text":"✅ 猫咪一天的活动时间","link":"/TNotes.notes/0040. 猫咪一天的活动时间/README"},{"text":"✅ 金吉拉","link":"/TNotes.notes/0047. 金吉拉/README"}]},{"text":"19. 蜡笔小新","collapsed":true,"items":[{"text":"✅ 蜡笔小新女明星录","link":"/TNotes.notes/0043. 蜡笔小新女明星录/README"}]},{"text":"20. 百科","collapsed":true,"items":[{"text":"✅ 下载开源软件还要付钱？论国内搜索引擎中的广告究竟有多不要脸？","link":"/TNotes.notes/0021. 下载开源软件还要付钱？论国内搜索引擎中的广告究竟有多不要脸？/README"},{"text":"✅ 拔罐后能洗澡吗？","link":"/TNotes.notes/0041. 拔罐后能洗澡吗？/README"},{"text":"✅ 烤红薯，吃不完，放冰箱，能放多久呢？","link":"/TNotes.notes/0044. 烤红薯，吃不完，放冰箱，能放多久呢？/README"},{"text":"✅ 路由器和光猫的功能与区别","link":"/TNotes.notes/0045. 路由器和光猫的功能与区别/README"}]},{"text":"21. 语雀","collapsed":true,"items":[{"text":"✅ 语雀浏览器插件","link":"/TNotes.notes/0013. 语雀浏览器插件/README"}]},{"text":"22. AI","collapsed":true,"items":[{"text":"✅ 体验 claude 4","link":"/TNotes.notes/0048. 体验 claude 4/README"}]},{"text":"23. ⏰ project graph","collapsed":true,"items":[{"text":"⏰ project graph","link":"/TNotes.notes/0026. project graph/README"}]},{"text":"24. ⏰ pending","collapsed":true,"items":[{"text":"⏰ xxx","link":"/TNotes.notes/0049. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.notes/0050. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.notes/0051. xxx/README"}]}]},{"text":"react","link":"https://tdahuyou.github.io/TNotes.react/","collapsed":true,"items":[{"text":"1. 认识 react","collapsed":true,"items":[{"text":"✅ react 是什么","link":"/TNotes.react/0032. react 是什么/README"}]},{"text":"2. 官方资料","collapsed":true,"items":[{"text":"✅ 了解 react 官方文档的基本结构","link":"/TNotes.react/0040. 了解 react 官方文档的基本结构/README"},{"text":"✅ react github 仓库链接","link":"/TNotes.react/0039. react github 仓库链接/README"}]},{"text":"3. 准备工作","collapsed":true,"items":[{"text":"✅ 开发 react 项目之前推荐安装的 vscode 插件 - eslint","link":"/TNotes.react/0034. 开发 react 项目之前推荐安装的 vscode 插件 - eslint/README"},{"text":"✅ 在 vscode 中，让 Emmet 语法支持 JSX","link":"/TNotes.react/0035. 在 vscode 中，让 Emmet 语法支持 JSX/README"},{"text":"✅ npm create vite 使用 vite 快速初始化一个 react 工程","link":"/TNotes.react/0008. npm create vite 使用 vite 快速初始化一个 react 工程/README"}]},{"text":"4. 第一个 react 应用","collapsed":true,"items":[{"text":"✅ 第一个 react v16 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World","link":"/TNotes.react/0042. 第一个 react v16 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World/README"},{"text":"✅ 第一个 react v19 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World","link":"/TNotes.react/0001. 第一个 react v19 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World/README"}]},{"text":"5. 需要注意的一些和版本相关的问题","collapsed":true,"items":[{"text":"✅ ReactDOM.render","link":"/TNotes.react/0043. ReactDOM.render/README"},{"text":"✅ 在 react v19 中，移除了 UMD，推荐使用 ESM","link":"/TNotes.react/0041. 在 react v19 中，移除了 UMD，推荐使用 ESM/README"}]},{"text":"6. JSX","collapsed":true,"items":[{"text":"✅ JSX 概述","link":"/TNotes.react/0013. JSX 概述/README"},{"text":"✅ HTML Tag vs. React Element vs. JSX Element","link":"/TNotes.react/0048. HTML Tag vs. React Element vs. JSX Element/README"},{"text":"✅ react element 是只读的","link":"/TNotes.react/0044. react element 是只读的/README"},{"text":"✅ jsx 必须单根","link":"/TNotes.react/0045. jsx 必须单根/README"},{"text":"✅ html to jsx 在线转换","link":"/TNotes.react/0003. html to jsx 在线转换/README"},{"text":"✅ 在 JSX 中使用注释","link":"/TNotes.react/0015. 在 JSX 中使用注释/README"},{"text":"✅ 在 JSX 中使用 JS 表达式","link":"/TNotes.react/0009. 在 JSX 中使用 JS 表达式/README"},{"text":"✅ 在 JSX 中书写内联样式 style","link":"/TNotes.react/0017. 在 JSX 中书写内联样式 style/README"},{"text":"✅ 使用 className 添加样式名","link":"/TNotes.react/0004. 使用 className 添加样式名/README"},{"text":"✅ JSX 元素的正确使用及常见错误示例","link":"/TNotes.react/0046. JSX 元素的正确使用及常见错误示例/README"},{"text":"✅ 条件渲染","link":"/TNotes.react/0010. 条件渲染/README"},{"text":"✅ 列表渲染","link":"/TNotes.react/0011. 列表渲染/README"}]},{"text":"7. dangerouslySetInnerHTML","collapsed":true,"items":[{"text":"✅ dangerouslySetInnerHTML","link":"/TNotes.react/0016. dangerouslySetInnerHTML/README"}]},{"text":"8. 组件基础知识","collapsed":true,"items":[{"text":"✅ 组件的基本组成","link":"/TNotes.react/0021. 组件的基本组成/README"},{"text":"✅ react 组件名的命名规则","link":"/TNotes.react/0002. react 组件名的命名规则/README"},{"text":"✅ 函数组件概述","link":"/TNotes.react/0022. 函数组件概述/README"},{"text":"✅ 类组件概述","link":"/TNotes.react/0023. 类组件概述/README"},{"text":"⏰ 单向数据流是什么","link":"/TNotes.react/0024. 单向数据流是什么/README"}]},{"text":"9. 组件调用","collapsed":true,"items":[{"text":"✅ React 组件调用方式对比：JSX 渲染 vs 直接函数调用","link":"/TNotes.react/0049. React 组件调用方式对比：JSX 渲染 vs 直接函数调用/README"}]},{"text":"10. 组件属性","collapsed":true,"items":[{"text":"✅ 组件属性的传递和接收","link":"/TNotes.react/0019. 组件属性的传递和接收/README"},{"text":"✅ 通过 props 和 children 来传递元素内容","link":"/TNotes.react/0005. 通过 props 和 children 来传递元素内容/README"},{"text":"✅ 布尔属性","link":"/TNotes.react/0025. 布尔属性/README"},{"text":"⏰ 组件属性的校验","link":"/TNotes.react/0020. 组件属性的校验/README"}]},{"text":"11. 组件状态","collapsed":true,"items":[]},{"text":"12. 组件生命周期","collapsed":true,"items":[{"text":"⏰ 生命周期","link":"/TNotes.react/0027. 生命周期/README"}]},{"text":"13. ref","collapsed":true,"items":[{"text":"✅ ref","link":"/TNotes.react/0007. ref/README"},{"text":"✅ demo-图片定时切换","link":"/TNotes.react/0018. demo-图片定时切换/README"}]},{"text":"14. hooks","collapsed":true,"items":[]},{"text":"15. hoc","collapsed":true,"items":[]},{"text":"16. 内置组件","collapsed":true,"items":[{"text":"✅ React.Fragment","link":"/TNotes.react/0014. React.Fragment/README"}]},{"text":"17. redux","collapsed":true,"items":[{"text":"✅ redux 是什么","link":"/TNotes.react/0047. redux 是什么/README"},{"text":"⏰ redux 的基本使用","link":"/TNotes.react/0028. redux 的基本使用/README"},{"text":"⏰ 为什么说前端的 mvc 已死","link":"/TNotes.react/0029. 为什么说前端的 mvc 已死/README"},{"text":"⏰ redux 中的 action","link":"/TNotes.react/0030. redux 中的 action/README"},{"text":"⏰ 在 redux 中，store、reducer、action 三者之间的关系","link":"/TNotes.react/0031. 在 redux 中，store、reducer、action 三者之间的关系/README"}]},{"text":"18. 第三方库","collapsed":true,"items":[{"text":"✅ react-modal","link":"/TNotes.react/0006. react-modal/README"},{"text":"✅ react-monaco-editor","link":"/TNotes.react/0012. react-monaco-editor/README"},{"text":"⏰ react-tooltip","link":"/TNotes.react/0033. react-tooltip/README"},{"text":"⏰ react-intl","link":"/TNotes.react/0038. react-intl/README"}]},{"text":"19. 工程化","collapsed":true,"items":[{"text":"✅ npm create vite 使用 vite 快速初始化一个 react 工程","link":"/TNotes.react/0008. npm create vite 使用 vite 快速初始化一个 react 工程/README"},{"text":"⏰ 快速搭建一个基于 vite、antd 的 react 项目","link":"/TNotes.react/0036. 快速搭建一个基于 vite、antd 的 react 项目/README"}]},{"text":"20. UI 组件库","collapsed":true,"items":[{"text":"⏰ 学习 antd Message 组件的使用","link":"/TNotes.react/0037. 学习 antd Message 组件的使用/README"}]},{"text":"21. empty","collapsed":true,"items":[{"text":"⏰ xxx","link":"/TNotes.react/0026. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0050. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0051. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0052. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0053. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0054. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0055. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0056. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0057. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0058. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0059. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0060. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0061. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0062. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0063. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0064. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0065. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0066. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0067. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0068. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0069. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0070. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0071. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0072. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0073. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0074. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0075. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0076. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0077. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0078. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0079. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0080. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0081. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0082. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0083. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0084. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0085. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0086. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0087. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0088. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0089. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0090. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0091. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0092. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0093. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0094. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0095. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0096. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0097. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0098. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0099. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.react/0100. xxx/README"}]}]},{"text":"sql","link":"https://tdahuyou.github.io/TNotes.mysql/","collapsed":true,"items":[{"text":"1. SQL Roadmap","collapsed":true,"items":[{"text":"✅ SQL Roadmap","link":"/TNotes.sql/0007. SQL Roadmap/README"}]},{"text":"2. MySQL 学习资源","collapsed":true,"items":[{"text":"✅ MySQL 学习资源概述","link":"/TNotes.sql/0008. MySQL 学习资源概述/README"},{"text":"✅ MySQL 8 从入门到精通","link":"/TNotes.sql/0001. MySQL 8 从入门到精通/README"}]},{"text":"3. 初始数据库","collapsed":true,"items":[{"text":"✅ 什么是“MySQL”","link":"/TNotes.sql/0002. 什么是“MySQL”/README"},{"text":"✅ 什么是“数据库”","link":"/TNotes.sql/0003. 什么是“数据库”/README"},{"text":"✅ 什么是“表”、“数据类型”、“主键”","link":"/TNotes.sql/0004. 什么是“表”、“数据类型”、“主键”/README"},{"text":"✅ 数据库系统的组成","link":"/TNotes.sql/0005. 数据库系统的组成/README"},{"text":"✅ MySQL 的优势","link":"/TNotes.sql/0017. MySQL 的优势/README"},{"text":"✅ MySQL 的社区版和企业版","link":"/TNotes.sql/0018. MySQL 的社区版和企业版/README"}]},{"text":"4. MySQL 的安装","collapsed":true,"items":[{"text":"✅ 在 macOS 上安装 mysql","link":"/TNotes.sql/0044. 在 macOS 上安装 mysql/README"}]},{"text":"5. MySQL 常用命令","collapsed":true,"items":[{"text":"✅ 查看 mysql 版本","link":"/TNotes.sql/0020. 查看 mysql 版本/README"},{"text":"✅ 启动 MySQL 服务","link":"/TNotes.sql/0039. 启动 MySQL 服务/README"}]},{"text":"6. SQL","collapsed":true,"items":[{"text":"✅ SQL 语言概述","link":"/TNotes.sql/0009. SQL 语言概述/README"},{"text":"✅ SQL 中的注释写法","link":"/TNotes.sql/0025. SQL 中的注释写法/README"},{"text":"✅ 创建数据库","link":"/TNotes.sql/0015. 创建数据库/README"},{"text":"✅ 删除数据库","link":"/TNotes.sql/0045. 删除数据库/README"},{"text":"✅ 查看所有数据库","link":"/TNotes.sql/0043. 查看所有数据库/README"},{"text":"✅ 在 MySQL 中批量创建或删除数据库、数据表","link":"/TNotes.sql/0047. 在 MySQL 中批量创建或删除数据库、数据表/README"},{"text":"✅ 使用数据库","link":"/TNotes.sql/0046. 使用数据库/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0049. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0050. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0051. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0052. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0053. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0054. xxx/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0055. xxx/README"},{"text":"⏰ TABLE 基本操作概述","link":"/TNotes.sql/0014. TABLE 基本操作概述/README"},{"text":"⏰ 使用主键约束","link":"/TNotes.sql/0016. 使用主键约束/README"},{"text":"✅ SQL 标准","link":"/TNotes.sql/0010. SQL 标准/README"},{"text":"⏰ 执行计划 EXPLLAIN","link":"/TNotes.sql/0038. 执行计划 EXPLLAIN/README"}]},{"text":"7. “数据访问接口” 和 “ORM”","collapsed":true,"items":[{"text":"✅ 数据库访问接口","link":"/TNotes.sql/0011. 数据库访问接口/README"},{"text":"✅ ORM vs. 数据访问接口","link":"/TNotes.sql/0013. ORM vs. 数据访问接口/README"}]},{"text":"8. C/S、B/S 架构 vs. 文件共享架构","collapsed":true,"items":[{"text":"✅ CS 架构 vs. 文件共享架构","link":"/TNotes.sql/0012. CS 架构 vs. 文件共享架构/README"}]},{"text":"9. 存储引擎","collapsed":true,"items":[{"text":"✅ InnoDB 简介","link":"/TNotes.sql/0028. InnoDB 简介/README"}]},{"text":"10. MySQL 版本命名机制","collapsed":true,"items":[{"text":"✅ MySQL 版本命名机制","link":"/TNotes.sql/0021. MySQL 版本命名机制/README"}]},{"text":"11. MySQL 8.0 新特性","collapsed":true,"items":[{"text":"⏰ MySQL 8.0 新特性概述","link":"/TNotes.sql/0022. MySQL 8.0 新特性概述/README"},{"text":"⏰ MySQL 8.0 新特性 - 数据字典","link":"/TNotes.sql/0023. MySQL 8.0 新特性 - 数据字典/README"},{"text":"⏰ MySQL 8.0 新特性 - 原子 DDL","link":"/TNotes.sql/0024. MySQL 8.0 新特性 - 原子 DDL/README"},{"text":"⏰ MySQL 8.0 新特性 - 安全和账号管理","link":"/TNotes.sql/0026. MySQL 8.0 新特性 - 安全和账号管理/README"},{"text":"⏰ MySQL 8.0 新特性 - 资源管理","link":"/TNotes.sql/0027. MySQL 8.0 新特性 - 资源管理/README"},{"text":"⏰ MySQL 8.0 新特性 - InnoDB 增强功能","link":"/TNotes.sql/0029. MySQL 8.0 新特性 - InnoDB 增强功能/README"},{"text":"⏰ MySQL 8.0 新特性 - 字符集支持","link":"/TNotes.sql/0030. MySQL 8.0 新特性 - 字符集支持/README"},{"text":"⏰ MySQL 8.0 新特性 - JSON 功能增强","link":"/TNotes.sql/0031. MySQL 8.0 新特性 - JSON 功能增强/README"},{"text":"⏰ MySQL 8.0 新特性 - 支持表达式作为默认值","link":"/TNotes.sql/0032. MySQL 8.0 新特性 - 支持表达式作为默认值/README"},{"text":"⏰ MySQL 8.0 新特性 - 查询优化","link":"/TNotes.sql/0033. MySQL 8.0 新特性 - 查询优化/README"},{"text":"⏰ MySQL 8.0 新特性 - 公用表表达式","link":"/TNotes.sql/0034. MySQL 8.0 新特性 - 公用表表达式/README"},{"text":"⏰ MySQL 8.0 新特性 - 窗口函数","link":"/TNotes.sql/0035. MySQL 8.0 新特性 - 窗口函数/README"},{"text":"⏰ MySQL 8.0 新特性 - 统计直方图","link":"/TNotes.sql/0036. MySQL 8.0 新特性 - 统计直方图/README"},{"text":"⏰ MySQL 8.0 新特性 - 备份锁","link":"/TNotes.sql/0037. MySQL 8.0 新特性 - 备份锁/README"},{"text":"⏰ MySQL Cluster 简介","link":"/TNotes.sql/0041. MySQL Cluster 简介/README"}]},{"text":"12. 数据库管理工具","collapsed":true,"items":[{"text":"✅ 数据库管理工具概述","link":"/TNotes.sql/0006. 数据库管理工具概述/README"},{"text":"✅ MySQL 自带的命令行工具","link":"/TNotes.sql/0019. MySQL 自带的命令行工具/README"},{"text":"✅ VSCode MySQL 插件简介","link":"/TNotes.sql/0040. VSCode MySQL 插件简介/README"},{"text":"✅ 数据库管理工具 - DBeaver","link":"/TNotes.sql/0042. 数据库管理工具 - DBeaver/README"},{"text":"⏰ xxx","link":"/TNotes.sql/0056. xxx/README"}]},{"text":"13. 练习","collapsed":true,"items":[{"text":"✅ leetcode 数据库相关例题列表","link":"/TNotes.sql/0048. leetcode 数据库相关例题列表/README"}]}]},{"text":"svg","link":"https://tdahuyou.github.io/TNotes.svg/","collapsed":true,"items":[{"text":"1. svg 起步","collapsed":true,"items":[{"text":"✅ 理解 svg 是什么","link":"/TNotes.svg/0043. 理解 svg 是什么/README"},{"text":"✅ 对比 svg 和 canvas","link":"/TNotes.svg/0044. 对比 svg 和 canvas/README"},{"text":"✅ 区分 Image 和 Graphic","link":"/TNotes.svg/0045. 区分 Image 和 Graphic/README"},{"text":"✅ 理解 svg 的 xmlns 属性","link":"/TNotes.svg/0046. 理解 svg 的 xmlns 属性/README"},{"text":"✅ 理解 svg 的 version 属性","link":"/TNotes.svg/0047. 理解 svg 的 version 属性/README"},{"text":"✅ vscode svg 相关插件","link":"/TNotes.svg/0009. vscode svg 相关插件/README"},{"text":"✅ 在 html 中嵌入 svg","link":"/TNotes.svg/0001. 在 html 中嵌入 svg/README"},{"text":"✅ 在 .html 和 .svg 文件中，根元素 svg 的数量","link":"/TNotes.svg/0002. 在 .html 和 .svg 文件中，根元素 svg 的数量/README"},{"text":"✅ 绘制坐标系网格","link":"/TNotes.svg/0035. 绘制坐标系网格/README"},{"text":"✅ 理解 viewBox 视口","link":"/TNotes.svg/0034. 理解 viewBox 视口/README"}]},{"text":"2. 基本图形绘制","collapsed":true,"items":[{"text":"✅ 使用 line 绘制直线","link":"/TNotes.svg/0005. 使用 line 绘制直线/README"},{"text":"✅ 使用 polyline 绘制折线","link":"/TNotes.svg/0007. 使用 polyline 绘制折线/README"},{"text":"✅ 使用 rect 绘制矩形","link":"/TNotes.svg/0008. 使用 rect 绘制矩形/README"},{"text":"✅ 使用 polygon 绘制多边形","link":"/TNotes.svg/0006. 使用 polygon 绘制多边形/README"},{"text":"✅ 使用 circle 绘制圆形","link":"/TNotes.svg/0003. 使用 circle 绘制圆形/README"},{"text":"✅ 使用 ellipse 绘制椭圆形","link":"/TNotes.svg/0004. 使用 ellipse 绘制椭圆形/README"},{"text":"✅ 使用属性 x、y、dx、dy 控制文本的绘制位置","link":"/TNotes.svg/0031. 使用属性 x、y、dx、dy 控制文本的绘制位置/README"},{"text":"✅ 使用属性 text-anchor 设置文本的水平对齐方式","link":"/TNotes.svg/0029. 使用属性 text-anchor 设置文本的水平对齐方式/README"},{"text":"✅ 使用属性 textLength 约束文本长度","link":"/TNotes.svg/0030. 使用属性 textLength 约束文本长度/README"},{"text":"✅ 通过 text 的其他属性来控制文本样式","link":"/TNotes.svg/0032. 通过 text 的其他属性来控制文本样式/README"},{"text":"✅ 使用 tspan 更细粒度地控制 text 中的内容","link":"/TNotes.svg/0019. 使用 tspan 更细粒度地控制 text 中的内容/README"},{"text":"✅ 使用 textPath 实现按照指定路径绘制文本","link":"/TNotes.svg/0018. 使用 textPath 实现按照指定路径绘制文本/README"}]},{"text":"3. path 路径","collapsed":true,"items":[{"text":"✅ 认识 path 元素","link":"/TNotes.svg/0048. 认识 path 元素/README"},{"text":"✅ 使用 path 绘制直线","link":"/TNotes.svg/0012. 使用 path 绘制直线/README"},{"text":"✅ 绘制【扫码】图标","link":"/TNotes.svg/0013. 绘制【扫码】图标/README"},{"text":"✅ 使用 path 绘制弧","link":"/TNotes.svg/0011. 使用 path 绘制弧/README"},{"text":"✅ 绘制【群】图标","link":"/TNotes.svg/0036. 绘制【群】图标/README"},{"text":"✅ 使用 path 绘制二次贝塞尔曲线","link":"/TNotes.svg/0010. 使用 path 绘制二次贝塞尔曲线/README"},{"text":"✅ 使用 path 绘制三次贝塞尔曲线","link":"/TNotes.svg/0014. 使用 path 绘制三次贝塞尔曲线/README"}]},{"text":"4. stroke 描边和 fill 填充","collapsed":true,"items":[{"text":"✅ 使用属性 stroke、stroke-width、stroke-opacity、stroke-linecap 设置描边样式","link":"/TNotes.svg/0028. 使用属性 stroke、stroke-width、stroke-opacity、stroke-linecap 设置描边样式/README"},{"text":"✅ 使用属性 stroke-linejoin 设置线条连接处样式","link":"/TNotes.svg/0027. 使用属性 stroke-linejoin 设置线条连接处样式/README"},{"text":"✅ 使用属性 stroke-dasharray 设置虚线","link":"/TNotes.svg/0025. 使用属性 stroke-dasharray 设置虚线/README"},{"text":"✅ 使用属性 stroke-dashoffset 设置虚线的偏移","link":"/TNotes.svg/0026. 使用属性 stroke-dashoffset 设置虚线的偏移/README"},{"text":"✅ 【练习】使用 stroke-dasharray 模拟加载中动画效果","link":"/TNotes.svg/0023. 【练习】使用 stroke-dasharray 模拟加载中动画效果/README"},{"text":"⏰ 使用属性 fill、fill-opacity 设置填充样式","link":"/TNotes.svg/0015. 使用属性 fill、fill-opacity 设置填充样式/README"},{"text":"⏰ 使用属性 fill-rule 设置填充规则","link":"/TNotes.svg/0024. 使用属性 fill-rule 设置填充规则/README"},{"text":"⏰ 绘制【眼睛】图标","link":"/TNotes.svg/0037. 绘制【眼睛】图标/README"}]},{"text":"5. 复用","collapsed":true,"items":[{"text":"⏰ 使用 use 引用图形","link":"/TNotes.svg/0020. 使用 use 引用图形/README"},{"text":"⏰ 使用 g 作为容器","link":"/TNotes.svg/0017. 使用 g 作为容器/README"},{"text":"⏰ 使用 defs 定义图形","link":"/TNotes.svg/0016. 使用 defs 定义图形/README"}]},{"text":"6. svg 与传统前端技术相结合","collapsed":true,"items":[{"text":"6.1. svg + html","collapsed":true,"items":[{"text":"✅ 在 html 中嵌入 svg","link":"/TNotes.svg/0001. 在 html 中嵌入 svg/README"}]},{"text":"6.2. svg + css","collapsed":true,"items":[{"text":"⏰ 使用 css 控制 svg 样式","link":"/TNotes.svg/0021. 使用 css 控制 svg 样式/README"}]},{"text":"6.3. svg + js","collapsed":true,"items":[{"text":"⏰ 使用 js 控制 svg 实现 CRUD 操作","link":"/TNotes.svg/0022. 使用 js 控制 svg 实现 CRUD 操作/README"}]}]},{"text":"7. 练习","collapsed":true,"items":[{"text":"⏰ 简易动态坐标系制作","link":"/TNotes.svg/0033. 简易动态坐标系制作/README"},{"text":"⏰ 【练习】绘制静态折线图","link":"/TNotes.svg/0039. 【练习】绘制静态折线图/README"},{"text":"⏰ 【练习】绘制动态折线图","link":"/TNotes.svg/0038. 【练习】绘制动态折线图/README"},{"text":"⏰ 【练习】绘制柱状图","link":"/TNotes.svg/0040. 【练习】绘制柱状图/README"},{"text":"⏰ 【练习】绘制静态的饼图","link":"/TNotes.svg/0042. 【练习】绘制静态的饼图/README"},{"text":"⏰ 【练习】绘制动态饼图","link":"/TNotes.svg/0041. 【练习】绘制动态饼图/README"}]},{"text":"8. ⏰ empty","collapsed":true,"items":[{"text":"⏰ empty","link":"/TNotes.svg/0049. empty/README"}]}]},{"text":"typescript","link":"https://tdahuyou.github.io/TNotes.typescript/","collapsed":true,"items":[{"text":"1. ⏰ pending","collapsed":true,"items":[{"text":"⏰ 核心概念","link":"/TNotes.typescript/0002. 核心概念/README"},{"text":"⏰ 泛型工具","link":"/TNotes.typescript/0001. 泛型工具/README"},{"text":"⏰ 简介","link":"/TNotes.typescript/0003. 简介/README"},{"text":"⏰ 特殊类型","link":"/TNotes.typescript/0004. 特殊类型/README"},{"text":"⏰ 装饰器（旧）","link":"/TNotes.typescript/0005. 装饰器（旧）/README"},{"text":"⏰ 装饰器（新）","link":"/TNotes.typescript/0006. 装饰器（新）/README"},{"text":"⏰ typescript v7","link":"/TNotes.typescript/0007. typescript v7/README"}]}]},{"text":"vite","link":"https://tdahuyou.github.io/TNotes.vite/","collapsed":true,"items":[{"text":"1. vite 官方文档","collapsed":true,"items":[{"text":"⏰ vite 官方文档","link":"/TNotes.vite/0009. vite 官方文档/README"}]},{"text":"2. vite github 仓库","collapsed":true,"items":[{"text":"⏰ vite github 仓库","link":"/TNotes.vite/0010. vite github 仓库/README"}]},{"text":"3. vite 在线学习资源 - 掘金小册","collapsed":true,"items":[{"text":"⏰ 《深入浅出 Vite》（掘金小册）","link":"/TNotes.vite/0011. 《深入浅出 Vite》（掘金小册）/README"},{"text":"⏰ 《基于 Vite 的 SSG 框架开发实战》（掘金小册）","link":"/TNotes.vite/0012. 《基于 Vite 的 SSG 框架开发实战》（掘金小册）/README"}]},{"text":"4. ⏰ pending","collapsed":true,"items":[{"text":"⏰ 从 0 到 1 搭建一个原生的（vanilla） vite 工程","link":"/TNotes.vite/0001. 从 0 到 1 搭建一个原生的（vanilla） vite 工程/README"},{"text":"⏰ 一次性导入所有模块","link":"/TNotes.vite/0002. 一次性导入所有模块/README"},{"text":"⏰ vite-plugin-mock 的基本使用","link":"/TNotes.vite/0003. vite-plugin-mock 的基本使用/README"},{"text":"⏰ 开始使用 unocss","link":"/TNotes.vite/0004. 开始使用 unocss/README"},{"text":"⏰ Vite 路径别名","link":"/TNotes.vite/0005. Vite 路径别名/README"},{"text":"⏰ UnoCSS 学习资源","link":"/TNotes.vite/0006. UnoCSS 学习资源/README"},{"text":"⏰ unocss 究竟比 tailwindcss 快多少","link":"/TNotes.vite/0007. unocss 究竟比 tailwindcss 快多少/README"},{"text":"⏰ 前端工程的痛点","link":"/TNotes.vite/0008. 前端工程的痛点/README"},{"text":"⏰ 了解 Rollup","link":"/TNotes.vite/0013. 了解 Rollup/README"}]}]},{"text":"vitepress","link":"https://tdahuyou.github.io/TNotes.vitepress/","collapsed":true,"items":[{"text":"1. vitepress 起步","collapsed":true,"items":[{"text":"⏰ 安装 vitepress","link":"/TNotes.vitepress/0001. 安装 vitepress/README"},{"text":"✅ srcExclude 配置需要忽略的文档内容","link":"/TNotes.vitepress/0002. srcExclude 配置需要忽略的文档内容/README"},{"text":"⏰ sitemap","link":"/TNotes.vitepress/0003. sitemap/README"}]}]},{"text":"vue","link":"https://tdahuyou.github.io/TNotes.vue/","collapsed":true,"items":[{"text":"1. vue github 仓库","collapsed":true,"items":[{"text":"⏰ vue github 仓库","link":"/TNotes.vue/0015. vue github 仓库/README"}]},{"text":"2. vue 官方文档","collapsed":true,"items":[{"text":"⏰ vue 官方文档","link":"/TNotes.vue/0016. vue 官方文档/README"}]},{"text":"3. vue playground","collapsed":true,"items":[{"text":"⏰ vue playground","link":"/TNotes.vue/0017. vue playground/README"}]},{"text":"4. 面试题","collapsed":true,"items":[{"text":"⏰ 谈谈你对 MVVM 模式的理解，可以对比 MVC 来讲讲。","link":"/TNotes.vue/0013. 谈谈你对 MVVM 模式的理解，可以对比 MVC 来讲讲。/README"},{"text":"⏰ 谈谈你知道的 Vue 的优点","link":"/TNotes.vue/0014. 谈谈你知道的 Vue 的优点/README"}]},{"text":"5. 组件","collapsed":true,"items":[{"text":"⏰ 属性","link":"/TNotes.vue/0001. 属性/README"},{"text":"⏰ 事件","link":"/TNotes.vue/0002. 事件/README"},{"text":"⏰ toRef","link":"/TNotes.vue/0003. toRef/README"},{"text":"⏰ 插槽","link":"/TNotes.vue/0004. 插槽/README"},{"text":"⏰ 特殊元素 component","link":"/TNotes.vue/0011. 特殊元素 component/README"},{"text":"⏰ 内置组件 keep-alive","link":"/TNotes.vue/0012. 内置组件 keep-alive/README"}]},{"text":"6. 指令 `v-model`","collapsed":true,"items":[{"text":"⏰ v-model 表单元素的双向绑定","link":"/TNotes.vue/0005. v-model 表单元素的双向绑定/README"},{"text":"⏰ v-on 键盘按键修饰符","link":"/TNotes.vue/0006. v-on 键盘按键修饰符/README"},{"text":"⏰ 使用 v-on 绑定事件及事件对象 $event 的获取","link":"/TNotes.vue/0007. 使用 v-on 绑定事件及事件对象 $event 的获取/README"},{"text":"⏰ v-on 鼠标按键修饰符","link":"/TNotes.vue/0008. v-on 鼠标按键修饰符/README"},{"text":"⏰ v-on 事件修饰符","link":"/TNotes.vue/0009. v-on 事件修饰符/README"}]},{"text":"7. 宏","collapsed":true,"items":[{"text":"⏰ defineModel","link":"/TNotes.vue/0010. defineModel/README"}]},{"text":"8. 国际化","collapsed":true,"items":[{"text":"⏰ i18n 基本使用","link":"/TNotes.vue/0018. i18n 基本使用/README"},{"text":"⏰ i18n 的 message 缓存机制","link":"/TNotes.vue/0019. i18n 的 message 缓存机制/README"},{"text":"⏰ 术语","link":"/TNotes.vue/0020. 术语/README"},{"text":"⏰ vue-i18n 简介","link":"/TNotes.vue/0021. vue-i18n 简介/README"}]}]},{"text":"webpack","link":"https://tdahuyou.github.io/TNotes.webpack/","collapsed":true,"items":[{"text":"1. 初步认识 webpack","collapsed":true,"items":[{"text":"⏰ webpack 是什么？","link":"/TNotes.webpack/0001. webpack 是什么？/README"},{"text":"⏰ webpack 中的 loader 是什么？","link":"/TNotes.webpack/0002. webpack 中的 loader 是什么？/README"}]}]}],"socialLinks":[{"ariaLabel":"Tdahuyou 语雀主页链接","link":"https://www.yuque.com/tdahuyou","icon":{"svg":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\"><path fill=\\"currentColor\\" d=\\"M17.28 2.955c2.97.203 3.756 2.342 3.84 2.597l1.297.096c.13 0 .169.18.054.236c-1.323.716-1.727 2.17-1.49 3.118c.09.358.254.69.412 1.02c.307.642.651 1.418.707 2.981c.117 3.24-2.51 6.175-5.789 6.593c1.17-1.187 1.815-2.444 2.12-3.375c.606-1.846.508-3.316.055-4.44a4.46 4.46 0 0 0-1.782-2.141c-1.683-1.02-3.22-1.09-4.444-.762c.465-.594.876-1.201 1.2-1.864c.584-1.65-.102-2.848-.704-3.519c-.192-.246-.061-.655.305-.655c1.41 0 2.813.02 4.22.115M3.32 19.107c1.924-2.202 4.712-5.394 7.162-8.15c.559-.63 2.769-2.338 5.748-.533c.878.532 2.43 2.165 1.332 5.51c-.803 2.446-4.408 7.796-15.76 5.844c-.227-.039-.511-.354-.218-.687z\\"/></svg>"}},{"ariaLabel":"Tdahuyou B 站主页链接","link":"https://space.bilibili.com/407241004","icon":{"svg":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"1024\\" height=\\"1024\\" viewBox=\\"0 0 1024 1024\\"><g fill=\\"currentColor\\"><path d=\\"M310.134 596.45c-7.999-4.463-16.498-8.43-24.997-11.9a274 274 0 0 0-26.996-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c.999.992 1.999 1.488 2.999.496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c1.5-1.487 0-2.479.5-2.975m323.96-11.9a274 274 0 0 0-26.997-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c1 .992 2 1.488 3 .496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c2-1.487.5-2.479.5-2.975c-7.5-4.463-16.498-8.43-24.997-11.9\\"/><path d=\\"M741.496 112H283c-94.501 0-171 76.5-171 171.5v458c.5 94 77 170.5 170.999 170.5h457.997c94.5 0 171.002-76.5 171.002-170.5v-458c.497-95-76.002-171.5-170.502-171.5m95 343.5h15.5v48h-15.5zm-95.5-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 1.5l-6.5-47.5h17zm-230.498 1.5h15v48h-15zm-96-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 2l-6-47.5zm-3.5 149C343.498 668.5 216 662.5 204.5 660.5C195.5 499 181.5 464 170 385l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 47c.5 3 0 6-1.5 8.5m20.5 35.5l-23.5-124h35.5l13 123zm44.5-8l-27-235l33.5-1.5l21 236H429zm34-175h17.5v48H467zm41 190h-26.5l-9.5-126h36zm209.998-43C693.496 668 565.997 662 554.497 660c-9-161-23-196-34.5-275l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 46.5c.5 3 0 6-1.5 8.5m19.5 36l-23-124h35.5l13 123zm45.5-8l-27.5-235l33.5-1.5l21 236h-27zm33.5-175h17.5v48h-13zm41 190h-26.5l-9.5-126h36z\\"/></g></svg>"}},{"ariaLabel":"Tdahuyou github 主页链接","link":"https://github.com/Tdahuyou","icon":"github"}],"docFooter":{"prev":"上一页","next":"下一页"},"externalLinkIcon":true},"locales":{},"scrollOffset":134,"cleanUrls":false}'));
const __vite_import_meta_env__ = {};
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
const APPEARANCE_KEY = "vitepress-theme-appearance";
const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;
const inBrowser = typeof document !== "undefined";
const notFoundPageData = {
  relativePath: "404.md",
  filePath: "",
  title: "404",
  description: "Not Found",
  headers: [],
  frontmatter: { sidebar: false, layout: "page" },
  lastUpdated: 0,
  isNotFound: true
};
function isActive(currentPath, matchPath, asRegex = false) {
  if (matchPath === void 0) {
    return false;
  }
  currentPath = normalize(`/${currentPath}`);
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }
  if (normalize(matchPath) !== currentPath) {
    return false;
  }
  const hashMatch = matchPath.match(HASH_RE);
  if (hashMatch) {
    return (inBrowser ? location.hash : "") === hashMatch[0];
  }
  return true;
}
function normalize(path) {
  return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
}
function isExternal(path) {
  return EXTERNAL_URL_RE.test(path);
}
function getLocaleForPath(siteData2, relativePath) {
  return Object.keys((siteData2 == null ? void 0 : siteData2.locales) || {}).find((key) => key !== "root" && !isExternal(key) && isActive(relativePath, `/${key}/`, true)) || "root";
}
function resolveSiteDataByRoute(siteData2, relativePath) {
  var _a, _b, _c, _d, _e, _f, _g;
  const localeIndex = getLocaleForPath(siteData2, relativePath);
  return Object.assign({}, siteData2, {
    localeIndex,
    lang: ((_a = siteData2.locales[localeIndex]) == null ? void 0 : _a.lang) ?? siteData2.lang,
    dir: ((_b = siteData2.locales[localeIndex]) == null ? void 0 : _b.dir) ?? siteData2.dir,
    title: ((_c = siteData2.locales[localeIndex]) == null ? void 0 : _c.title) ?? siteData2.title,
    titleTemplate: ((_d = siteData2.locales[localeIndex]) == null ? void 0 : _d.titleTemplate) ?? siteData2.titleTemplate,
    description: ((_e = siteData2.locales[localeIndex]) == null ? void 0 : _e.description) ?? siteData2.description,
    head: mergeHead(siteData2.head, ((_f = siteData2.locales[localeIndex]) == null ? void 0 : _f.head) ?? []),
    themeConfig: {
      ...siteData2.themeConfig,
      ...(_g = siteData2.locales[localeIndex]) == null ? void 0 : _g.themeConfig
    }
  });
}
function createTitle(siteData2, pageData) {
  const title = pageData.title || siteData2.title;
  const template = pageData.titleTemplate ?? siteData2.titleTemplate;
  if (typeof template === "string" && template.includes(":title")) {
    return template.replace(/:title/g, title);
  }
  const templateString = createTitleTemplate(siteData2.title, template);
  if (title === templateString.slice(3)) {
    return title;
  }
  return `${title}${templateString}`;
}
function createTitleTemplate(siteTitle, template) {
  if (template === false) {
    return "";
  }
  if (template === true || template === void 0) {
    return ` | ${siteTitle}`;
  }
  if (siteTitle === template) {
    return "";
  }
  return ` | ${template}`;
}
function hasTag(head, tag) {
  const [tagType, tagAttrs] = tag;
  if (tagType !== "meta")
    return false;
  const keyAttr = Object.entries(tagAttrs)[0];
  if (keyAttr == null)
    return false;
  return head.some(([type, attrs]) => type === tagType && attrs[keyAttr[0]] === keyAttr[1]);
}
function mergeHead(prev, curr) {
  return [...prev.filter((tagAttrs) => !hasTag(curr, tagAttrs)), ...curr];
}
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
function sanitizeFileName(name) {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";
  return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}
const KNOWN_EXTENSIONS = /* @__PURE__ */ new Set();
function treatAsHtml(filename) {
  var _a;
  if (KNOWN_EXTENSIONS.size === 0) {
    const extraExts = typeof process === "object" && ((_a = process.env) == null ? void 0 : _a.VITE_EXTRA_EXTENSIONS) || (__vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_EXTRA_EXTENSIONS) || "";
    ("3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" + (extraExts && typeof extraExts === "string" ? "," + extraExts : "")).split(",").forEach((ext2) => KNOWN_EXTENSIONS.add(ext2));
  }
  const ext = filename.split(".").pop();
  return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
function escapeRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
const dataSymbol = Symbol();
const siteDataRef = shallowRef(siteData);
function initData(route) {
  const site = computed(() => resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath));
  const appearance = site.value.appearance;
  const isDark = appearance === "force-dark" ? ref(true) : appearance === "force-auto" ? usePreferredDark() : appearance ? useDark({
    storageKey: APPEARANCE_KEY,
    initialValue: () => appearance === "dark" ? "dark" : "auto",
    ...typeof appearance === "object" ? appearance : {}
  }) : ref(false);
  const hashRef = ref(inBrowser ? location.hash : "");
  if (inBrowser) {
    window.addEventListener("hashchange", () => {
      hashRef.value = location.hash;
    });
  }
  watch(() => route.data, () => {
    hashRef.value = inBrowser ? location.hash : "";
  });
  return {
    site,
    theme: computed(() => site.value.themeConfig),
    page: computed(() => route.data),
    frontmatter: computed(() => route.data.frontmatter),
    params: computed(() => route.data.params),
    lang: computed(() => site.value.lang),
    dir: computed(() => route.data.frontmatter.dir || site.value.dir),
    localeIndex: computed(() => site.value.localeIndex || "root"),
    title: computed(() => createTitle(site.value, route.data)),
    description: computed(() => route.data.description || site.value.description),
    isDark,
    hash: computed(() => hashRef.value)
  };
}
function useData$1() {
  const data2 = inject(dataSymbol);
  if (!data2) {
    throw new Error("vitepress data not properly injected in app");
  }
  return data2;
}
function joinPath(base, path) {
  return `${base}${path}`.replace(/\/+/g, "/");
}
function withBase(path) {
  return EXTERNAL_URL_RE.test(path) || !path.startsWith("/") ? path : joinPath(siteDataRef.value.base, path);
}
function pathToFile(path) {
  let pagePath = path.replace(/\.html$/, "");
  pagePath = decodeURIComponent(pagePath);
  pagePath = pagePath.replace(/\/$/, "/index");
  {
    if (inBrowser) {
      const base = "/notes/";
      pagePath = sanitizeFileName(pagePath.slice(base.length).replace(/\//g, "_") || "index") + ".md";
      let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      if (!pageHash) {
        pagePath = pagePath.endsWith("_index.md") ? pagePath.slice(0, -9) + ".md" : pagePath.slice(0, -3) + "_index.md";
        pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      }
      if (!pageHash)
        return null;
      pagePath = `${base}${"assets"}/${pagePath}.${pageHash}.js`;
    } else {
      pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, "_"))}.md.js`;
    }
  }
  return pagePath;
}
let contentUpdatedCallbacks = [];
function onContentUpdated(fn) {
  contentUpdatedCallbacks.push(fn);
  onUnmounted(() => {
    contentUpdatedCallbacks = contentUpdatedCallbacks.filter((f) => f !== fn);
  });
}
function getScrollOffset() {
  let scrollOffset = siteDataRef.value.scrollOffset;
  let offset = 0;
  let padding = 24;
  if (typeof scrollOffset === "object" && "padding" in scrollOffset) {
    padding = scrollOffset.padding;
    scrollOffset = scrollOffset.selector;
  }
  if (typeof scrollOffset === "number") {
    offset = scrollOffset;
  } else if (typeof scrollOffset === "string") {
    offset = tryOffsetSelector(scrollOffset, padding);
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding);
      if (res) {
        offset = res;
        break;
      }
    }
  }
  return offset;
}
function tryOffsetSelector(selector, padding) {
  const el = document.querySelector(selector);
  if (!el)
    return 0;
  const bot = el.getBoundingClientRect().bottom;
  if (bot < 0)
    return 0;
  return bot + padding;
}
const RouterSymbol = Symbol();
const fakeHost = "http://a.com";
const getDefaultRoute = () => ({
  path: "/",
  component: null,
  data: notFoundPageData
});
function createRouter(loadPageModule, fallbackComponent) {
  const route = reactive(getDefaultRoute());
  const router = {
    route,
    go
  };
  async function go(href = inBrowser ? location.href : "/") {
    var _a, _b;
    href = normalizeHref(href);
    if (await ((_a = router.onBeforeRouteChange) == null ? void 0 : _a.call(router, href)) === false)
      return;
    if (inBrowser && href !== normalizeHref(location.href)) {
      history.replaceState({ scrollPosition: window.scrollY }, "");
      history.pushState({}, "", href);
    }
    await loadPage(href);
    await ((_b = router.onAfterRouteChange ?? router.onAfterRouteChanged) == null ? void 0 : _b(href));
  }
  let latestPendingPath = null;
  async function loadPage(href, scrollPosition = 0, isRetry = false) {
    var _a, _b;
    if (await ((_a = router.onBeforePageLoad) == null ? void 0 : _a.call(router, href)) === false)
      return;
    const targetLoc = new URL(href, fakeHost);
    const pendingPath = latestPendingPath = targetLoc.pathname;
    try {
      let page = await loadPageModule(pendingPath);
      if (!page) {
        throw new Error(`Page not found: ${pendingPath}`);
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        const { default: comp, __pageData } = page;
        if (!comp) {
          throw new Error(`Invalid route component: ${comp}`);
        }
        await ((_b = router.onAfterPageLoad) == null ? void 0 : _b.call(router, href));
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = markRaw(comp);
        route.data = true ? markRaw(__pageData) : readonly(__pageData);
        if (inBrowser) {
          nextTick(() => {
            let actualPathname = siteDataRef.value.base + __pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
            if (!siteDataRef.value.cleanUrls && !actualPathname.endsWith("/")) {
              actualPathname += ".html";
            }
            if (actualPathname !== targetLoc.pathname) {
              targetLoc.pathname = actualPathname;
              href = actualPathname + targetLoc.search + targetLoc.hash;
              history.replaceState({}, "", href);
            }
            if (targetLoc.hash && !scrollPosition) {
              let target = null;
              try {
                target = document.getElementById(decodeURIComponent(targetLoc.hash).slice(1));
              } catch (e) {
                console.warn(e);
              }
              if (target) {
                scrollTo(target, targetLoc.hash);
                return;
              }
            }
            window.scrollTo(0, scrollPosition);
          });
        }
      }
    } catch (err) {
      if (!/fetch|Page not found/.test(err.message) && !/^\/404(\.html|\/)?$/.test(href)) {
        console.error(err);
      }
      if (!isRetry) {
        try {
          const res = await fetch(siteDataRef.value.base + "hashmap.json");
          window.__VP_HASH_MAP__ = await res.json();
          await loadPage(href, scrollPosition, true);
          return;
        } catch (e) {
        }
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = fallbackComponent ? markRaw(fallbackComponent) : null;
        const relativePath = inBrowser ? pendingPath.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md").replace(/^\//, "") : "404.md";
        route.data = { ...notFoundPageData, relativePath };
      }
    }
  }
  if (inBrowser) {
    if (history.state === null) {
      history.replaceState({}, "");
    }
    window.addEventListener("click", (e) => {
      if (e.defaultPrevented || !(e.target instanceof Element) || e.target.closest("button") || // temporary fix for docsearch action buttons
      e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
        return;
      const link2 = e.target.closest("a");
      if (!link2 || link2.closest(".vp-raw") || link2.hasAttribute("download") || link2.hasAttribute("target"))
        return;
      const linkHref = link2.getAttribute("href") ?? (link2 instanceof SVGAElement ? link2.getAttribute("xlink:href") : null);
      if (linkHref == null)
        return;
      const { href, origin, pathname, hash, search } = new URL(linkHref, link2.baseURI);
      const currentUrl = new URL(location.href);
      if (origin === currentUrl.origin && treatAsHtml(pathname)) {
        e.preventDefault();
        if (pathname === currentUrl.pathname && search === currentUrl.search) {
          if (hash !== currentUrl.hash) {
            history.pushState({}, "", href);
            window.dispatchEvent(new HashChangeEvent("hashchange", {
              oldURL: currentUrl.href,
              newURL: href
            }));
          }
          if (hash) {
            scrollTo(link2, hash, link2.classList.contains("header-anchor"));
          } else {
            window.scrollTo(0, 0);
          }
        } else {
          go(href);
        }
      }
    }, { capture: true });
    window.addEventListener("popstate", async (e) => {
      var _a;
      if (e.state === null)
        return;
      const href = normalizeHref(location.href);
      await loadPage(href, e.state && e.state.scrollPosition || 0);
      await ((_a = router.onAfterRouteChange ?? router.onAfterRouteChanged) == null ? void 0 : _a(href));
    });
    window.addEventListener("hashchange", (e) => {
      e.preventDefault();
    });
  }
  return router;
}
function useRouter() {
  const router = inject(RouterSymbol);
  if (!router) {
    throw new Error("useRouter() is called without provider.");
  }
  return router;
}
function useRoute() {
  return useRouter().route;
}
function scrollTo(el, hash, smooth = false) {
  let target = null;
  try {
    target = el.classList.contains("header-anchor") ? el : document.getElementById(decodeURIComponent(hash).slice(1));
  } catch (e) {
    console.warn(e);
  }
  if (target) {
    let scrollToTarget = function() {
      if (!smooth || Math.abs(targetTop - window.scrollY) > window.innerHeight)
        window.scrollTo(0, targetTop);
      else
        window.scrollTo({ left: 0, top: targetTop, behavior: "smooth" });
    };
    const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10);
    const targetTop = window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + targetPadding;
    requestAnimationFrame(scrollToTarget);
  }
}
function normalizeHref(href) {
  const url = new URL(href, fakeHost);
  url.pathname = url.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
  if (siteDataRef.value.cleanUrls)
    url.pathname = url.pathname.replace(/\.html$/, "");
  else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html"))
    url.pathname += ".html";
  return url.pathname + url.search + url.hash;
}
const runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn());
const Content = defineComponent({
  name: "VitePressContent",
  props: {
    as: { type: [Object, String], default: "div" }
  },
  setup(props) {
    const route = useRoute();
    const { frontmatter, site } = useData$1();
    watch(frontmatter, runCbs, { deep: true, flush: "post" });
    return () => h(props.as, site.value.contentProps ?? { style: { position: "relative" } }, [
      route.component ? h(route.component, {
        onVnodeMounted: runCbs,
        onVnodeUpdated: runCbs,
        onVnodeUnmounted: runCbs
      }) : "404 Page Not Found"
    ]);
  }
});
const _sfc_main$1c = {
  __name: "Mermaid",
  __ssrInlineRender: true,
  props: {
    graph: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: false,
      default: "mermaid"
    }
  },
  setup(__props) {
    const pluginSettings = ref({
      securityLevel: "loose",
      startOnLoad: false,
      externalDiagrams: []
    });
    const { page } = useData$1();
    const { frontmatter } = toRaw(page.value);
    const mermaidPageTheme = frontmatter.mermaidTheme || "";
    const props = __props;
    const svg = ref(null);
    let mut = null;
    onMounted(async () => {
      var _a;
      await init(pluginSettings.value.externalDiagrams);
      let settings = await import("./virtual_mermaid-config.CM0F1BUC.js");
      if (settings == null ? void 0 : settings.default) pluginSettings.value = settings.default;
      mut = new MutationObserver(async () => await renderChart());
      mut.observe(document.documentElement, { attributes: true });
      await renderChart();
      const hasImages = ((_a = /<img([\w\W]+?)>/.exec(decodeURIComponent(props.graph))) == null ? void 0 : _a.length) > 0;
      if (hasImages)
        setTimeout(() => {
          let imgElements = document.getElementsByTagName("img");
          let imgs = Array.from(imgElements);
          if (imgs.length) {
            Promise.all(
              imgs.filter((img) => !img.complete).map(
                (img) => new Promise((resolve) => {
                  img.onload = img.onerror = resolve;
                })
              )
            ).then(async () => {
              await renderChart();
            });
          }
        }, 100);
    });
    onUnmounted(() => mut.disconnect());
    const renderChart = async () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      let mermaidConfig = {
        ...pluginSettings.value
      };
      if (mermaidPageTheme) mermaidConfig.theme = mermaidPageTheme;
      if (hasDarkClass) mermaidConfig.theme = "dark";
      let svgCode = await render$1(
        props.id,
        decodeURIComponent(props.graph),
        mermaidConfig
      );
      const salt = Math.random().toString(36).substring(7);
      svg.value = `${svgCode} <span style="display: none">${salt}</span>`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: props.class
      }, _attrs))}>${svg.value ?? ""}</div>`);
    };
  }
};
const _sfc_setup$1c = _sfc_main$1c.setup;
_sfc_main$1c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress-plugin-mermaid/dist/Mermaid.vue");
  return _sfc_setup$1c ? _sfc_setup$1c(props, ctx) : void 0;
};
const _sfc_main$1b = /* @__PURE__ */ defineComponent({
  __name: "VPBadge",
  __ssrInlineRender: true,
  props: {
    text: {},
    type: { default: "tip" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["VPBadge", _ctx.type]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${ssrInterpolate(_ctx.text)}`);
      }, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$1b = _sfc_main$1b.setup;
_sfc_main$1b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue");
  return _sfc_setup$1b ? _sfc_setup$1b(props, ctx) : void 0;
};
const _sfc_main$1a = /* @__PURE__ */ defineComponent({
  __name: "VPBackdrop",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPBackdrop" }, _attrs))} data-v-b06cdb19></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1a = _sfc_main$1a.setup;
_sfc_main$1a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue");
  return _sfc_setup$1a ? _sfc_setup$1a(props, ctx) : void 0;
};
const VPBackdrop = /* @__PURE__ */ _export_sfc(_sfc_main$1a, [["__scopeId", "data-v-b06cdb19"]]);
const useData = useData$1;
function throttleAndDebounce(fn, delay) {
  let timeoutId;
  let called = false;
  return () => {
    if (timeoutId)
      clearTimeout(timeoutId);
    if (!called) {
      fn();
      (called = true) && setTimeout(() => called = false, delay);
    } else
      timeoutId = setTimeout(fn, delay);
  };
}
function ensureStartingSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
}
function normalizeLink$1(url) {
  const { pathname, search, hash, protocol } = new URL(url, "http://a.com");
  if (isExternal(url) || url.startsWith("#") || !protocol.startsWith("http") || !treatAsHtml(pathname))
    return url;
  const { site } = useData();
  const normalizedPath = pathname.endsWith("/") || pathname.endsWith(".html") ? url : url.replace(/(?:(^\.+)\/)?.*$/, `$1${pathname.replace(/(\.md)?$/, site.value.cleanUrls ? "" : ".html")}${search}${hash}`);
  return withBase(normalizedPath);
}
function useLangs({ correspondingLink = false } = {}) {
  const { site, localeIndex, page, theme: theme2, hash } = useData();
  const currentLang = computed(() => {
    var _a, _b;
    return {
      label: (_a = site.value.locales[localeIndex.value]) == null ? void 0 : _a.label,
      link: ((_b = site.value.locales[localeIndex.value]) == null ? void 0 : _b.link) || (localeIndex.value === "root" ? "/" : `/${localeIndex.value}/`)
    };
  });
  const localeLinks = computed(() => Object.entries(site.value.locales).flatMap(([key, value]) => currentLang.value.label === value.label ? [] : {
    text: value.label,
    link: normalizeLink(value.link || (key === "root" ? "/" : `/${key}/`), theme2.value.i18nRouting !== false && correspondingLink, page.value.relativePath.slice(currentLang.value.link.length - 1), !site.value.cleanUrls) + hash.value
  }));
  return { localeLinks, currentLang };
}
function normalizeLink(link2, addPath, path, addExt) {
  return addPath ? link2.replace(/\/$/, "") + ensureStartingSlash(path.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, addExt ? ".html" : "")) : link2;
}
const _sfc_main$19 = /* @__PURE__ */ defineComponent({
  __name: "NotFound",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const { currentLang } = useLangs();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "NotFound" }, _attrs))} data-v-951cab6c><p class="code" data-v-951cab6c>${ssrInterpolate(((_a = unref(theme2).notFound) == null ? void 0 : _a.code) ?? "404")}</p><h1 class="title" data-v-951cab6c>${ssrInterpolate(((_b = unref(theme2).notFound) == null ? void 0 : _b.title) ?? "PAGE NOT FOUND")}</h1><div class="divider" data-v-951cab6c></div><blockquote class="quote" data-v-951cab6c>${ssrInterpolate(((_c = unref(theme2).notFound) == null ? void 0 : _c.quote) ?? "But if you don't change your direction, and if you keep looking, you may end up where you are heading.")}</blockquote><div class="action" data-v-951cab6c><a class="link"${ssrRenderAttr("href", unref(withBase)(unref(currentLang).link))}${ssrRenderAttr("aria-label", ((_d = unref(theme2).notFound) == null ? void 0 : _d.linkLabel) ?? "go to home")} data-v-951cab6c>${ssrInterpolate(((_e = unref(theme2).notFound) == null ? void 0 : _e.linkText) ?? "Take me home")}</a></div></div>`);
    };
  }
});
const _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/NotFound.vue");
  return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
const NotFound = /* @__PURE__ */ _export_sfc(_sfc_main$19, [["__scopeId", "data-v-951cab6c"]]);
function getSidebar(_sidebar, path) {
  if (Array.isArray(_sidebar))
    return addBase(_sidebar);
  if (_sidebar == null)
    return [];
  path = ensureStartingSlash(path);
  const dir = Object.keys(_sidebar).sort((a, b) => {
    return b.split("/").length - a.split("/").length;
  }).find((dir2) => {
    return path.startsWith(ensureStartingSlash(dir2));
  });
  const sidebar = dir ? _sidebar[dir] : [];
  return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base);
}
function getSidebarGroups(sidebar) {
  const groups = [];
  let lastGroupIndex = 0;
  for (const index in sidebar) {
    const item = sidebar[index];
    if (item.items) {
      lastGroupIndex = groups.push(item);
      continue;
    }
    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] });
    }
    groups[lastGroupIndex].items.push(item);
  }
  return groups;
}
function getFlatSideBarLinks(sidebar) {
  const links = [];
  function recursivelyExtractLinks(items) {
    for (const item of items) {
      if (item.text && item.link) {
        links.push({
          text: item.text,
          link: item.link,
          docFooterText: item.docFooterText
        });
      }
      if (item.items) {
        recursivelyExtractLinks(item.items);
      }
    }
  }
  recursivelyExtractLinks(sidebar);
  return links;
}
function hasActiveLink(path, items) {
  if (Array.isArray(items)) {
    return items.some((item) => hasActiveLink(path, item));
  }
  return isActive(path, items.link) ? true : items.items ? hasActiveLink(path, items.items) : false;
}
function addBase(items, _base) {
  return [...items].map((_item) => {
    const item = { ..._item };
    const base = item.base || _base;
    if (base && item.link)
      item.link = base + item.link;
    if (item.items)
      item.items = addBase(item.items, base);
    return item;
  });
}
function useSidebar() {
  const { frontmatter, page, theme: theme2 } = useData();
  const is960 = useMediaQuery("(min-width: 960px)");
  const isOpen = ref(false);
  const _sidebar = computed(() => {
    const sidebarConfig = theme2.value.sidebar;
    const relativePath = page.value.relativePath;
    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
  });
  const sidebar = ref(_sidebar.value);
  watch(_sidebar, (next, prev) => {
    if (JSON.stringify(next) !== JSON.stringify(prev))
      sidebar.value = _sidebar.value;
  });
  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && frontmatter.value.layout !== "home";
  });
  const leftAside = computed(() => {
    if (hasAside)
      return frontmatter.value.aside == null ? theme2.value.aside === "left" : frontmatter.value.aside === "left";
    return false;
  });
  const hasAside = computed(() => {
    if (frontmatter.value.layout === "home")
      return false;
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside;
    return theme2.value.aside !== false;
  });
  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value);
  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
  });
  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value ? close() : open();
  }
  return {
    isOpen,
    sidebar,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle
  };
}
function useCloseSidebarOnEscape(isOpen, close) {
  let triggerElement;
  watchEffect(() => {
    triggerElement = isOpen.value ? document.activeElement : void 0;
  });
  onMounted(() => {
    window.addEventListener("keyup", onEscape);
  });
  onUnmounted(() => {
    window.removeEventListener("keyup", onEscape);
  });
  function onEscape(e) {
    if (e.key === "Escape" && isOpen.value) {
      close();
      triggerElement == null ? void 0 : triggerElement.focus();
    }
  }
}
function useSidebarControl(item) {
  const { page, hash } = useData();
  const collapsed = ref(false);
  const collapsible = computed(() => {
    return item.value.collapsed != null;
  });
  const isLink = computed(() => {
    return !!item.value.link;
  });
  const isActiveLink = ref(false);
  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(page.value.relativePath, item.value.link);
  };
  watch([page, item, hash], updateIsActiveLink);
  onMounted(updateIsActiveLink);
  const hasActiveLink$1 = computed(() => {
    if (isActiveLink.value) {
      return true;
    }
    return item.value.items ? hasActiveLink(page.value.relativePath, item.value.items) : false;
  });
  const hasChildren = computed(() => {
    return !!(item.value.items && item.value.items.length);
  });
  watchEffect(() => {
    collapsed.value = !!(collapsible.value && item.value.collapsed);
  });
  watchPostEffect(() => {
    (isActiveLink.value || hasActiveLink$1.value) && (collapsed.value = false);
  });
  function toggle() {
    if (collapsible.value) {
      collapsed.value = !collapsed.value;
    }
  }
  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink: hasActiveLink$1,
    hasChildren,
    toggle
  };
}
function useAside() {
  const { hasSidebar } = useSidebar();
  const is960 = useMediaQuery("(min-width: 960px)");
  const is1280 = useMediaQuery("(min-width: 1280px)");
  const isAsideEnabled = computed(() => {
    if (!is1280.value && !is960.value) {
      return false;
    }
    return hasSidebar.value ? is1280.value : is960.value;
  });
  return {
    isAsideEnabled
  };
}
const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/;
const resolvedHeaders = [];
function resolveTitle(theme2) {
  return typeof theme2.outline === "object" && !Array.isArray(theme2.outline) && theme2.outline.label || theme2.outlineTitle || "On this page";
}
function getHeaders(range) {
  const headers = [
    ...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")
  ].filter((el) => el.id && el.hasChildNodes()).map((el) => {
    const level = Number(el.tagName[1]);
    return {
      element: el,
      title: serializeHeader(el),
      link: "#" + el.id,
      level
    };
  });
  return resolveHeaders(headers, range);
}
function serializeHeader(h2) {
  let ret = "";
  for (const node of h2.childNodes) {
    if (node.nodeType === 1) {
      if (ignoreRE.test(node.className))
        continue;
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}
function resolveHeaders(headers, range) {
  if (range === false) {
    return [];
  }
  const levelsRange = (typeof range === "object" && !Array.isArray(range) ? range.level : range) || 2;
  const [high, low] = typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;
  return buildTree(headers, high, low);
}
function useActiveAnchor(container, marker) {
  const { isAsideEnabled } = useAside();
  const onScroll = throttleAndDebounce(setActiveLink, 100);
  let prevActiveLink = null;
  onMounted(() => {
    requestAnimationFrame(setActiveLink);
    window.addEventListener("scroll", onScroll);
  });
  onUpdated(() => {
    activateLink(location.hash);
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  });
  function setActiveLink() {
    if (!isAsideEnabled.value) {
      return;
    }
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;
    const headers = resolvedHeaders.map(({ element, link: link2 }) => ({
      link: link2,
      top: getAbsoluteTop(element)
    })).filter(({ top }) => !Number.isNaN(top)).sort((a, b) => a.top - b.top);
    if (!headers.length) {
      activateLink(null);
      return;
    }
    if (scrollY < 1) {
      activateLink(null);
      return;
    }
    if (isBottom) {
      activateLink(headers[headers.length - 1].link);
      return;
    }
    let activeLink = null;
    for (const { link: link2, top } of headers) {
      if (top > scrollY + getScrollOffset() + 4) {
        break;
      }
      activeLink = link2;
    }
    activateLink(activeLink);
  }
  function activateLink(hash) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove("active");
    }
    if (hash == null) {
      prevActiveLink = null;
    } else {
      prevActiveLink = container.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`);
    }
    const activeLink = prevActiveLink;
    if (activeLink) {
      activeLink.classList.add("active");
      marker.value.style.top = activeLink.offsetTop + 39 + "px";
      marker.value.style.opacity = "1";
    } else {
      marker.value.style.top = "33px";
      marker.value.style.opacity = "0";
    }
  }
}
function getAbsoluteTop(element) {
  let offsetTop = 0;
  while (element !== document.body) {
    if (element === null) {
      return NaN;
    }
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}
function buildTree(data2, min, max) {
  resolvedHeaders.length = 0;
  const result = [];
  const stack = [];
  data2.forEach((item) => {
    const node = { ...item, children: [] };
    let parent = stack[stack.length - 1];
    while (parent && parent.level >= node.level) {
      stack.pop();
      parent = stack[stack.length - 1];
    }
    if (node.element.classList.contains("ignore-header") || parent && "shouldIgnore" in parent) {
      stack.push({ level: node.level, shouldIgnore: true });
      return;
    }
    if (node.level > max || node.level < min)
      return;
    resolvedHeaders.push({ element: node.element, link: node.link });
    if (parent)
      parent.children.push(node);
    else
      result.push(node);
    stack.push(node);
  });
  return result;
}
const _sfc_main$18 = /* @__PURE__ */ defineComponent({
  __name: "VPDocOutlineItem",
  __ssrInlineRender: true,
  props: {
    headers: {},
    root: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VPDocOutlineItem = resolveComponent("VPDocOutlineItem", true);
      _push(`<ul${ssrRenderAttrs(mergeProps({
        class: ["VPDocOutlineItem", _ctx.root ? "root" : "nested"]
      }, _attrs))} data-v-3f927ebe><!--[-->`);
      ssrRenderList(_ctx.headers, ({ children, link: link2, title }) => {
        _push(`<li data-v-3f927ebe><a class="outline-link"${ssrRenderAttr("href", link2)}${ssrRenderAttr("title", title)} data-v-3f927ebe>${ssrInterpolate(title)}</a>`);
        if (children == null ? void 0 : children.length) {
          _push(ssrRenderComponent(_component_VPDocOutlineItem, { headers: children }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue");
  return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
const VPDocOutlineItem = /* @__PURE__ */ _export_sfc(_sfc_main$18, [["__scopeId", "data-v-3f927ebe"]]);
const _sfc_main$17 = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideOutline",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter, theme: theme2 } = useData();
    const headers = shallowRef([]);
    onContentUpdated(() => {
      headers.value = getHeaders(frontmatter.value.outline ?? theme2.value.outline);
    });
    const container = ref();
    const marker = ref();
    useActiveAnchor(container, marker);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        "aria-labelledby": "doc-outline-aria-label",
        class: ["VPDocAsideOutline", { "has-outline": headers.value.length > 0 }],
        ref_key: "container",
        ref: container
      }, _attrs))} data-v-b38bf2ff><div class="content" data-v-b38bf2ff><div class="outline-marker" data-v-b38bf2ff></div><div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading" data-v-b38bf2ff>${ssrInterpolate(unref(resolveTitle)(unref(theme2)))}</div>`);
      _push(ssrRenderComponent(VPDocOutlineItem, {
        headers: headers.value,
        root: true
      }, null, _parent));
      _push(`</div></nav>`);
    };
  }
});
const _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue");
  return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
const VPDocAsideOutline = /* @__PURE__ */ _export_sfc(_sfc_main$17, [["__scopeId", "data-v-b38bf2ff"]]);
const _sfc_main$16 = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideCarbonAds",
  __ssrInlineRender: true,
  props: {
    carbonAds: {}
  },
  setup(__props) {
    const VPCarbonAds = () => null;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideCarbonAds" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(VPCarbonAds), { "carbon-ads": _ctx.carbonAds }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue");
  return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
const _sfc_main$15 = /* @__PURE__ */ defineComponent({
  __name: "VPDocAside",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAside" }, _attrs))} data-v-6d7b3c46>`);
      ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(VPDocAsideOutline, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent);
      _push(`<div class="spacer" data-v-6d7b3c46></div>`);
      ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent);
      if (unref(theme2).carbonAds) {
        _push(ssrRenderComponent(_sfc_main$16, {
          "carbon-ads": unref(theme2).carbonAds
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue");
  return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
const VPDocAside = /* @__PURE__ */ _export_sfc(_sfc_main$15, [["__scopeId", "data-v-6d7b3c46"]]);
function useEditLink() {
  const { theme: theme2, page } = useData();
  return computed(() => {
    const { text = "Edit this page", pattern = "" } = theme2.value.editLink || {};
    let url;
    if (typeof pattern === "function") {
      url = pattern(page.value);
    } else {
      url = pattern.replace(/:path/g, page.value.filePath);
    }
    return { url, text };
  });
}
function usePrevNext() {
  const { page, theme: theme2, frontmatter } = useData();
  return computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const sidebar = getSidebar(theme2.value.sidebar, page.value.relativePath);
    const links = getFlatSideBarLinks(sidebar);
    const candidates = uniqBy(links, (link2) => link2.link.replace(/[?#].*$/, ""));
    const index = candidates.findIndex((link2) => {
      return isActive(page.value.relativePath, link2.link);
    });
    const hidePrev = ((_a = theme2.value.docFooter) == null ? void 0 : _a.prev) === false && !frontmatter.value.prev || frontmatter.value.prev === false;
    const hideNext = ((_b = theme2.value.docFooter) == null ? void 0 : _b.next) === false && !frontmatter.value.next || frontmatter.value.next === false;
    return {
      prev: hidePrev ? void 0 : {
        text: (typeof frontmatter.value.prev === "string" ? frontmatter.value.prev : typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.text : void 0) ?? ((_c = candidates[index - 1]) == null ? void 0 : _c.docFooterText) ?? ((_d = candidates[index - 1]) == null ? void 0 : _d.text),
        link: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.link : void 0) ?? ((_e = candidates[index - 1]) == null ? void 0 : _e.link)
      },
      next: hideNext ? void 0 : {
        text: (typeof frontmatter.value.next === "string" ? frontmatter.value.next : typeof frontmatter.value.next === "object" ? frontmatter.value.next.text : void 0) ?? ((_f = candidates[index + 1]) == null ? void 0 : _f.docFooterText) ?? ((_g = candidates[index + 1]) == null ? void 0 : _g.text),
        link: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.link : void 0) ?? ((_h = candidates[index + 1]) == null ? void 0 : _h.link)
      }
    };
  });
}
function uniqBy(array, keyFn) {
  const seen = /* @__PURE__ */ new Set();
  return array.filter((item) => {
    const k = keyFn(item);
    return seen.has(k) ? false : seen.add(k);
  });
}
const _sfc_main$14 = /* @__PURE__ */ defineComponent({
  __name: "VPLink",
  __ssrInlineRender: true,
  props: {
    tag: {},
    href: {},
    noIcon: { type: Boolean },
    target: {},
    rel: {}
  },
  setup(__props) {
    const props = __props;
    const tag = computed(() => props.tag ?? (props.href ? "a" : "span"));
    const isExternal2 = computed(
      () => props.href && EXTERNAL_URL_RE.test(props.href) || props.target === "_blank"
    );
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tag.value), mergeProps({
        class: ["VPLink", {
          link: _ctx.href,
          "vp-external-link-icon": isExternal2.value,
          "no-icon": _ctx.noIcon
        }],
        href: _ctx.href ? unref(normalizeLink$1)(_ctx.href) : void 0,
        target: _ctx.target ?? (isExternal2.value ? "_blank" : void 0),
        rel: _ctx.rel ?? (isExternal2.value ? "noreferrer" : void 0)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPLink.vue");
  return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
const _sfc_main$13 = /* @__PURE__ */ defineComponent({
  __name: "VPDocFooterLastUpdated",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, page, lang } = useData();
    const date = computed(
      () => new Date(page.value.lastUpdated)
    );
    const isoDatetime = computed(() => date.value.toISOString());
    const datetime = ref("");
    onMounted(() => {
      watchEffect(() => {
        var _a, _b, _c;
        datetime.value = new Intl.DateTimeFormat(
          ((_b = (_a = theme2.value.lastUpdated) == null ? void 0 : _a.formatOptions) == null ? void 0 : _b.forceLocale) ? lang.value : void 0,
          ((_c = theme2.value.lastUpdated) == null ? void 0 : _c.formatOptions) ?? {
            dateStyle: "short",
            timeStyle: "short"
          }
        ).format(date.value);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<p${ssrRenderAttrs(mergeProps({ class: "VPLastUpdated" }, _attrs))} data-v-475f71b8>${ssrInterpolate(((_a = unref(theme2).lastUpdated) == null ? void 0 : _a.text) || unref(theme2).lastUpdatedText || "Last updated")}: <time${ssrRenderAttr("datetime", isoDatetime.value)} data-v-475f71b8>${ssrInterpolate(datetime.value)}</time></p>`);
    };
  }
});
const _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue");
  return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
const VPDocFooterLastUpdated = /* @__PURE__ */ _export_sfc(_sfc_main$13, [["__scopeId", "data-v-475f71b8"]]);
const _sfc_main$12 = /* @__PURE__ */ defineComponent({
  __name: "VPDocFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, page, frontmatter } = useData();
    const editLink = useEditLink();
    const control = usePrevNext();
    const hasEditLink = computed(
      () => theme2.value.editLink && frontmatter.value.editLink !== false
    );
    const hasLastUpdated = computed(() => page.value.lastUpdated);
    const showFooter = computed(
      () => hasEditLink.value || hasLastUpdated.value || control.value.prev || control.value.next
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      if (showFooter.value) {
        _push(`<footer${ssrRenderAttrs(mergeProps({ class: "VPDocFooter" }, _attrs))} data-v-4f9813fa>`);
        ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent);
        if (hasEditLink.value || hasLastUpdated.value) {
          _push(`<div class="edit-info" data-v-4f9813fa>`);
          if (hasEditLink.value) {
            _push(`<div class="edit-link" data-v-4f9813fa>`);
            _push(ssrRenderComponent(_sfc_main$14, {
              class: "edit-link-button",
              href: unref(editLink).url,
              "no-icon": true
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="vpi-square-pen edit-link-icon" data-v-4f9813fa${_scopeId}></span> ${ssrInterpolate(unref(editLink).text)}`);
                } else {
                  return [
                    createVNode("span", { class: "vpi-square-pen edit-link-icon" }),
                    createTextVNode(" " + toDisplayString(unref(editLink).text), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (hasLastUpdated.value) {
            _push(`<div class="last-updated" data-v-4f9813fa>`);
            _push(ssrRenderComponent(VPDocFooterLastUpdated, null, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_a = unref(control).prev) == null ? void 0 : _a.link) || ((_b = unref(control).next) == null ? void 0 : _b.link)) {
          _push(`<nav class="prev-next" aria-labelledby="doc-footer-aria-label" data-v-4f9813fa><span class="visually-hidden" id="doc-footer-aria-label" data-v-4f9813fa>Pager</span><div class="pager" data-v-4f9813fa>`);
          if ((_c = unref(control).prev) == null ? void 0 : _c.link) {
            _push(ssrRenderComponent(_sfc_main$14, {
              class: "pager-link prev",
              href: unref(control).prev.link
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<span class="desc" data-v-4f9813fa${_scopeId}>${((_a2 = unref(theme2).docFooter) == null ? void 0 : _a2.prev) || "Previous page"}</span><span class="title" data-v-4f9813fa${_scopeId}>${unref(control).prev.text ?? ""}</span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "desc",
                      innerHTML: ((_b2 = unref(theme2).docFooter) == null ? void 0 : _b2.prev) || "Previous page"
                    }, null, 8, ["innerHTML"]),
                    createVNode("span", {
                      class: "title",
                      innerHTML: unref(control).prev.text
                    }, null, 8, ["innerHTML"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="pager" data-v-4f9813fa>`);
          if ((_d = unref(control).next) == null ? void 0 : _d.link) {
            _push(ssrRenderComponent(_sfc_main$14, {
              class: "pager-link next",
              href: unref(control).next.link
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<span class="desc" data-v-4f9813fa${_scopeId}>${((_a2 = unref(theme2).docFooter) == null ? void 0 : _a2.next) || "Next page"}</span><span class="title" data-v-4f9813fa${_scopeId}>${unref(control).next.text ?? ""}</span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "desc",
                      innerHTML: ((_b2 = unref(theme2).docFooter) == null ? void 0 : _b2.next) || "Next page"
                    }, null, 8, ["innerHTML"]),
                    createVNode("span", {
                      class: "title",
                      innerHTML: unref(control).next.text
                    }, null, 8, ["innerHTML"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></nav>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</footer>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue");
  return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
const VPDocFooter = /* @__PURE__ */ _export_sfc(_sfc_main$12, [["__scopeId", "data-v-4f9813fa"]]);
const _sfc_main$11 = /* @__PURE__ */ defineComponent({
  __name: "VPDoc",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const route = useRoute();
    const { hasSidebar, hasAside, leftAside } = useSidebar();
    const pageName = computed(
      () => route.path.replace(/[./]+/g, "_").replace(/_html$/, "")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Content = resolveComponent("Content");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPDoc", { "has-sidebar": unref(hasSidebar), "has-aside": unref(hasAside) }]
      }, _attrs))} data-v-83890dd9>`);
      ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent);
      _push(`<div class="container" data-v-83890dd9>`);
      if (unref(hasAside)) {
        _push(`<div class="${ssrRenderClass([{ "left-aside": unref(leftAside) }, "aside"])}" data-v-83890dd9><div class="aside-curtain" data-v-83890dd9></div><div class="aside-container" data-v-83890dd9><div class="aside-content" data-v-83890dd9>`);
        _push(ssrRenderComponent(VPDocAside, null, {
          "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)
              ];
            }
          }),
          "aside-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="content" data-v-83890dd9><div class="content-container" data-v-83890dd9>`);
      ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent);
      _push(`<main class="main" data-v-83890dd9>`);
      _push(ssrRenderComponent(_component_Content, {
        class: ["vp-doc", [
          pageName.value,
          unref(theme2).externalLinkIcon && "external-link-icon-enabled"
        ]]
      }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(VPDocFooter, null, {
        "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent);
      _push(`</div></div></div>`);
      ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue");
  return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
const VPDoc = /* @__PURE__ */ _export_sfc(_sfc_main$11, [["__scopeId", "data-v-83890dd9"]]);
const _sfc_main$10 = /* @__PURE__ */ defineComponent({
  __name: "VPButton",
  __ssrInlineRender: true,
  props: {
    tag: {},
    size: { default: "medium" },
    theme: { default: "brand" },
    text: {},
    href: {},
    target: {},
    rel: {}
  },
  setup(__props) {
    const props = __props;
    const isExternal2 = computed(
      () => props.href && EXTERNAL_URL_RE.test(props.href)
    );
    const component = computed(() => {
      return props.tag || (props.href ? "a" : "button");
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(component.value), mergeProps({
        class: ["VPButton", [_ctx.size, _ctx.theme]],
        href: _ctx.href ? unref(normalizeLink$1)(_ctx.href) : void 0,
        target: props.target ?? (isExternal2.value ? "_blank" : void 0),
        rel: props.rel ?? (isExternal2.value ? "noreferrer" : void 0)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.text), 1)
            ];
          }
        }),
        _: 1
      }), _parent);
    };
  }
});
const _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPButton.vue");
  return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
const VPButton = /* @__PURE__ */ _export_sfc(_sfc_main$10, [["__scopeId", "data-v-906d7fb4"]]);
const _sfc_main$$ = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "VPImage",
  __ssrInlineRender: true,
  props: {
    image: {},
    alt: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VPImage = resolveComponent("VPImage", true);
      if (_ctx.image) {
        _push(`<!--[-->`);
        if (typeof _ctx.image === "string" || "src" in _ctx.image) {
          _push(`<img${ssrRenderAttrs(mergeProps({ class: "VPImage" }, typeof _ctx.image === "string" ? _ctx.$attrs : { ..._ctx.image, ..._ctx.$attrs }, {
            src: unref(withBase)(typeof _ctx.image === "string" ? _ctx.image : _ctx.image.src),
            alt: _ctx.alt ?? (typeof _ctx.image === "string" ? "" : _ctx.image.alt || "")
          }))} data-v-35a7d0b8>`);
        } else {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_VPImage, mergeProps({
            class: "dark",
            image: _ctx.image.dark,
            alt: _ctx.image.alt
          }, _ctx.$attrs), null, _parent));
          _push(ssrRenderComponent(_component_VPImage, mergeProps({
            class: "light",
            image: _ctx.image.light,
            alt: _ctx.image.alt
          }, _ctx.$attrs), null, _parent));
          _push(`<!--]-->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$$ = _sfc_main$$.setup;
_sfc_main$$.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPImage.vue");
  return _sfc_setup$$ ? _sfc_setup$$(props, ctx) : void 0;
};
const VPImage = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["__scopeId", "data-v-35a7d0b8"]]);
const _sfc_main$_ = /* @__PURE__ */ defineComponent({
  __name: "VPHero",
  __ssrInlineRender: true,
  props: {
    name: {},
    text: {},
    tagline: {},
    image: {},
    actions: {}
  },
  setup(__props) {
    const heroImageSlotExists = inject("hero-image-slot-exists");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPHero", { "has-image": _ctx.image || unref(heroImageSlotExists) }]
      }, _attrs))} data-v-3d256e5e><div class="container" data-v-3d256e5e><div class="main" data-v-3d256e5e>`);
      ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, () => {
        _push(`<h1 class="heading" data-v-3d256e5e>`);
        if (_ctx.name) {
          _push(`<span class="name clip" data-v-3d256e5e>${_ctx.name ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.text) {
          _push(`<span class="text" data-v-3d256e5e>${_ctx.text ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h1>`);
        if (_ctx.tagline) {
          _push(`<p class="tagline" data-v-3d256e5e>${_ctx.tagline ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent);
      if (_ctx.actions) {
        _push(`<div class="actions" data-v-3d256e5e><!--[-->`);
        ssrRenderList(_ctx.actions, (action) => {
          _push(`<div class="action" data-v-3d256e5e>`);
          _push(ssrRenderComponent(VPButton, {
            tag: "a",
            size: "medium",
            theme: action.theme,
            text: action.text,
            href: action.link,
            target: action.target,
            rel: action.rel
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent);
      _push(`</div>`);
      if (_ctx.image || unref(heroImageSlotExists)) {
        _push(`<div class="image" data-v-3d256e5e><div class="image-container" data-v-3d256e5e><div class="image-bg" data-v-3d256e5e></div>`);
        ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, () => {
          if (_ctx.image) {
            _push(ssrRenderComponent(VPImage, {
              class: "image-src",
              image: _ctx.image
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$_ = _sfc_main$_.setup;
_sfc_main$_.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPHero.vue");
  return _sfc_setup$_ ? _sfc_setup$_(props, ctx) : void 0;
};
const VPHero = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["__scopeId", "data-v-3d256e5e"]]);
const _sfc_main$Z = /* @__PURE__ */ defineComponent({
  __name: "VPHomeHero",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter: fm } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(fm).hero) {
        _push(ssrRenderComponent(VPHero, mergeProps({
          class: "VPHomeHero",
          name: unref(fm).hero.name,
          text: unref(fm).hero.text,
          tagline: unref(fm).hero.tagline,
          image: unref(fm).hero.image,
          actions: unref(fm).hero.actions
        }, _attrs), {
          "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-before")
              ];
            }
          }),
          "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info")
              ];
            }
          }),
          "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-after")
              ];
            }
          }),
          "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-actions-after")
              ];
            }
          }),
          "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-image")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$Z = _sfc_main$Z.setup;
_sfc_main$Z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue");
  return _sfc_setup$Z ? _sfc_setup$Z(props, ctx) : void 0;
};
const _sfc_main$Y = /* @__PURE__ */ defineComponent({
  __name: "VPFeature",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    details: {},
    link: {},
    linkText: {},
    rel: {},
    target: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$14, mergeProps({
        class: "VPFeature",
        href: _ctx.link,
        rel: _ctx.rel,
        target: _ctx.target,
        "no-icon": true,
        tag: _ctx.link ? "a" : "div"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<article class="box" data-v-f5e9645b${_scopeId}>`);
            if (typeof _ctx.icon === "object" && _ctx.icon.wrap) {
              _push2(`<div class="icon" data-v-f5e9645b${_scopeId}>`);
              _push2(ssrRenderComponent(VPImage, {
                image: _ctx.icon,
                alt: _ctx.icon.alt,
                height: _ctx.icon.height || 48,
                width: _ctx.icon.width || 48
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (typeof _ctx.icon === "object") {
              _push2(ssrRenderComponent(VPImage, {
                image: _ctx.icon,
                alt: _ctx.icon.alt,
                height: _ctx.icon.height || 48,
                width: _ctx.icon.width || 48
              }, null, _parent2, _scopeId));
            } else if (_ctx.icon) {
              _push2(`<div class="icon" data-v-f5e9645b${_scopeId}>${_ctx.icon ?? ""}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h2 class="title" data-v-f5e9645b${_scopeId}>${_ctx.title ?? ""}</h2>`);
            if (_ctx.details) {
              _push2(`<p class="details" data-v-f5e9645b${_scopeId}>${_ctx.details ?? ""}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.linkText) {
              _push2(`<div class="link-text" data-v-f5e9645b${_scopeId}><p class="link-text-value" data-v-f5e9645b${_scopeId}>${ssrInterpolate(_ctx.linkText)} <span class="vpi-arrow-right link-text-icon" data-v-f5e9645b${_scopeId}></span></p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</article>`);
          } else {
            return [
              createVNode("article", { class: "box" }, [
                typeof _ctx.icon === "object" && _ctx.icon.wrap ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "icon"
                }, [
                  createVNode(VPImage, {
                    image: _ctx.icon,
                    alt: _ctx.icon.alt,
                    height: _ctx.icon.height || 48,
                    width: _ctx.icon.width || 48
                  }, null, 8, ["image", "alt", "height", "width"])
                ])) : typeof _ctx.icon === "object" ? (openBlock(), createBlock(VPImage, {
                  key: 1,
                  image: _ctx.icon,
                  alt: _ctx.icon.alt,
                  height: _ctx.icon.height || 48,
                  width: _ctx.icon.width || 48
                }, null, 8, ["image", "alt", "height", "width"])) : _ctx.icon ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "icon",
                  innerHTML: _ctx.icon
                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                createVNode("h2", {
                  class: "title",
                  innerHTML: _ctx.title
                }, null, 8, ["innerHTML"]),
                _ctx.details ? (openBlock(), createBlock("p", {
                  key: 3,
                  class: "details",
                  innerHTML: _ctx.details
                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                _ctx.linkText ? (openBlock(), createBlock("div", {
                  key: 4,
                  class: "link-text"
                }, [
                  createVNode("p", { class: "link-text-value" }, [
                    createTextVNode(toDisplayString(_ctx.linkText) + " ", 1),
                    createVNode("span", { class: "vpi-arrow-right link-text-icon" })
                  ])
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$Y = _sfc_main$Y.setup;
_sfc_main$Y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue");
  return _sfc_setup$Y ? _sfc_setup$Y(props, ctx) : void 0;
};
const VPFeature = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["__scopeId", "data-v-f5e9645b"]]);
const _sfc_main$X = /* @__PURE__ */ defineComponent({
  __name: "VPFeatures",
  __ssrInlineRender: true,
  props: {
    features: {}
  },
  setup(__props) {
    const props = __props;
    const grid = computed(() => {
      const length = props.features.length;
      if (!length) {
        return;
      } else if (length === 2) {
        return "grid-2";
      } else if (length === 3) {
        return "grid-3";
      } else if (length % 3 === 0) {
        return "grid-6";
      } else if (length > 3) {
        return "grid-4";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.features) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPFeatures" }, _attrs))} data-v-d0a190d7><div class="container" data-v-d0a190d7><div class="items" data-v-d0a190d7><!--[-->`);
        ssrRenderList(_ctx.features, (feature) => {
          _push(`<div class="${ssrRenderClass([[grid.value], "item"])}" data-v-d0a190d7>`);
          _push(ssrRenderComponent(VPFeature, {
            icon: feature.icon,
            title: feature.title,
            details: feature.details,
            link: feature.link,
            "link-text": feature.linkText,
            rel: feature.rel,
            target: feature.target
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const VPFeatures = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["__scopeId", "data-v-d0a190d7"]]);
const _sfc_main$W = /* @__PURE__ */ defineComponent({
  __name: "VPHomeFeatures",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter: fm } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(fm).features) {
        _push(ssrRenderComponent(VPFeatures, mergeProps({
          class: "VPHomeFeatures",
          features: unref(fm).features
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const _sfc_main$V = /* @__PURE__ */ defineComponent({
  __name: "VPHomeContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { width: vw } = useWindowSize({
      initialWidth: 0,
      includeScrollbar: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "vp-doc container",
        style: unref(vw) ? { "--vp-offset": `calc(50% - ${unref(vw) / 2}px)` } : {}
      }, _attrs))} data-v-7a48a447>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const VPHomeContent = /* @__PURE__ */ _export_sfc(_sfc_main$V, [["__scopeId", "data-v-7a48a447"]]);
const _sfc_main$U = /* @__PURE__ */ defineComponent({
  __name: "VPHome",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter, theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Content = resolveComponent("Content");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPHome", {
          "external-link-icon-enabled": unref(theme2).externalLinkIcon
        }]
      }, _attrs))} data-v-e40e30de>`);
      ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$Z, null, {
        "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)
            ];
          }
        }),
        "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)
            ];
          }
        }),
        "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)
            ];
          }
        }),
        "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)
            ];
          }
        }),
        "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$W, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent);
      if (unref(frontmatter).markdownStyles !== false) {
        _push(ssrRenderComponent(VPHomeContent, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Content, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Content)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_Content, null, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPHome.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const VPHome = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["__scopeId", "data-v-e40e30de"]]);
const _sfc_main$T = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_Content = resolveComponent("Content");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPPage" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_Content, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPPage.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const VPPage = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$S = /* @__PURE__ */ defineComponent({
  __name: "VPContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { page, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPContent", {
          "has-sidebar": unref(hasSidebar),
          "is-home": unref(frontmatter).layout === "home"
        }],
        id: "VPContent"
      }, _attrs))} data-v-91765379>`);
      if (unref(page).isNotFound) {
        ssrRenderSlot(_ctx.$slots, "not-found", {}, () => {
          _push(ssrRenderComponent(NotFound, null, null, _parent));
        }, _push, _parent);
      } else if (unref(frontmatter).layout === "page") {
        _push(ssrRenderComponent(VPPage, null, {
          "page-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-top", {}, void 0, true)
              ];
            }
          }),
          "page-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      } else if (unref(frontmatter).layout === "home") {
        _push(ssrRenderComponent(VPHome, null, {
          "home-hero-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)
              ];
            }
          }),
          "home-hero-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)
              ];
            }
          }),
          "home-features-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)
              ];
            }
          }),
          "home-features-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      } else if (unref(frontmatter).layout && unref(frontmatter).layout !== "doc") {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(frontmatter).layout), null, null), _parent);
      } else {
        _push(ssrRenderComponent(VPDoc, null, {
          "doc-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)
              ];
            }
          }),
          "doc-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)
              ];
            }
          }),
          "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)
              ];
            }
          }),
          "doc-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)
              ];
            }
          }),
          "doc-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)
              ];
            }
          }),
          "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)
              ];
            }
          }),
          "aside-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPContent.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const VPContent = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["__scopeId", "data-v-91765379"]]);
const _sfc_main$R = /* @__PURE__ */ defineComponent({
  __name: "VPFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).footer && unref(frontmatter).footer !== false) {
        _push(`<footer${ssrRenderAttrs(mergeProps({
          class: ["VPFooter", { "has-sidebar": unref(hasSidebar) }]
        }, _attrs))} data-v-c970a860><div class="container" data-v-c970a860>`);
        if (unref(theme2).footer.message) {
          _push(`<p class="message" data-v-c970a860>${unref(theme2).footer.message ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(theme2).footer.copyright) {
          _push(`<p class="copyright" data-v-c970a860>${unref(theme2).footer.copyright ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></footer>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const VPFooter = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["__scopeId", "data-v-c970a860"]]);
function useLocalNav() {
  const { theme: theme2, frontmatter } = useData();
  const headers = shallowRef([]);
  const hasLocalNav = computed(() => {
    return headers.value.length > 0;
  });
  onContentUpdated(() => {
    headers.value = getHeaders(frontmatter.value.outline ?? theme2.value.outline);
  });
  return {
    headers,
    hasLocalNav
  };
}
const _sfc_main$Q = /* @__PURE__ */ defineComponent({
  __name: "VPLocalNavOutlineDropdown",
  __ssrInlineRender: true,
  props: {
    headers: {},
    navHeight: {}
  },
  setup(__props) {
    const { theme: theme2 } = useData();
    const open = ref(false);
    const vh = ref(0);
    const main = ref();
    ref();
    function closeOnClickOutside(e) {
      var _a;
      if (!((_a = main.value) == null ? void 0 : _a.contains(e.target))) {
        open.value = false;
      }
    }
    watch(open, (value) => {
      if (value) {
        document.addEventListener("click", closeOnClickOutside);
        return;
      }
      document.removeEventListener("click", closeOnClickOutside);
    });
    onKeyStroke("Escape", () => {
      open.value = false;
    });
    onContentUpdated(() => {
      open.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "VPLocalNavOutlineDropdown",
        style: { "--vp-vh": vh.value + "px" },
        ref_key: "main",
        ref: main
      }, _attrs))} data-v-168ddf5d>`);
      if (_ctx.headers.length > 0) {
        _push(`<button class="${ssrRenderClass({ open: open.value })}" data-v-168ddf5d><span class="menu-text" data-v-168ddf5d>${ssrInterpolate(unref(resolveTitle)(unref(theme2)))}</span><span class="vpi-chevron-right icon" data-v-168ddf5d></span></button>`);
      } else {
        _push(`<button data-v-168ddf5d>${ssrInterpolate(unref(theme2).returnToTopLabel || "Return to top")}</button>`);
      }
      if (open.value) {
        _push(`<div class="items" data-v-168ddf5d><div class="header" data-v-168ddf5d><a class="top-link" href="#" data-v-168ddf5d>${ssrInterpolate(unref(theme2).returnToTopLabel || "Return to top")}</a></div><div class="outline" data-v-168ddf5d>`);
        _push(ssrRenderComponent(VPDocOutlineItem, { headers: _ctx.headers }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const VPLocalNavOutlineDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["__scopeId", "data-v-168ddf5d"]]);
const _sfc_main$P = /* @__PURE__ */ defineComponent({
  __name: "VPLocalNav",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["open-menu"],
  setup(__props) {
    const { theme: theme2, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    const { headers } = useLocalNav();
    const { y } = useWindowScroll();
    const navHeight = ref(0);
    onMounted(() => {
      navHeight.value = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--vp-nav-height"
        )
      );
    });
    onContentUpdated(() => {
      headers.value = getHeaders(frontmatter.value.outline ?? theme2.value.outline);
    });
    const empty = computed(() => {
      return headers.value.length === 0;
    });
    const emptyAndNoSidebar = computed(() => {
      return empty.value && !hasSidebar.value;
    });
    const classes = computed(() => {
      return {
        VPLocalNav: true,
        "has-sidebar": hasSidebar.value,
        empty: empty.value,
        fixed: emptyAndNoSidebar.value
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(frontmatter).layout !== "home" && (!emptyAndNoSidebar.value || unref(y) >= navHeight.value)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: classes.value }, _attrs))} data-v-070ab83d><div class="container" data-v-070ab83d>`);
        if (unref(hasSidebar)) {
          _push(`<button class="menu"${ssrRenderAttr("aria-expanded", _ctx.open)} aria-controls="VPSidebarNav" data-v-070ab83d><span class="vpi-align-left menu-icon" data-v-070ab83d></span><span class="menu-text" data-v-070ab83d>${ssrInterpolate(unref(theme2).sidebarMenuLabel || "Menu")}</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(VPLocalNavOutlineDropdown, {
          headers: unref(headers),
          navHeight: navHeight.value
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const VPLocalNav = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["__scopeId", "data-v-070ab83d"]]);
function useNav() {
  const isScreenOpen = ref(false);
  function openScreen() {
    isScreenOpen.value = true;
    window.addEventListener("resize", closeScreenOnTabletWindow);
  }
  function closeScreen() {
    isScreenOpen.value = false;
    window.removeEventListener("resize", closeScreenOnTabletWindow);
  }
  function toggleScreen() {
    isScreenOpen.value ? closeScreen() : openScreen();
  }
  function closeScreenOnTabletWindow() {
    window.outerWidth >= 768 && closeScreen();
  }
  const route = useRoute();
  watch(() => route.path, closeScreen);
  return {
    isScreenOpen,
    openScreen,
    closeScreen,
    toggleScreen
  };
}
const _sfc_main$O = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<button${ssrRenderAttrs(mergeProps({
    class: "VPSwitch",
    type: "button",
    role: "switch"
  }, _attrs))} data-v-4a1c76db><span class="check" data-v-4a1c76db>`);
  if (_ctx.$slots.default) {
    _push(`<span class="icon" data-v-4a1c76db>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</span></button>`);
}
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const VPSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-4a1c76db"]]);
const _sfc_main$N = /* @__PURE__ */ defineComponent({
  __name: "VPSwitchAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { isDark, theme: theme2 } = useData();
    const toggleAppearance = inject("toggle-appearance", () => {
      isDark.value = !isDark.value;
    });
    const switchTitle = ref("");
    watchPostEffect(() => {
      switchTitle.value = isDark.value ? theme2.value.lightModeSwitchTitle || "Switch to light theme" : theme2.value.darkModeSwitchTitle || "Switch to dark theme";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VPSwitch, mergeProps({
        title: switchTitle.value,
        class: "VPSwitchAppearance",
        "aria-checked": unref(isDark),
        onClick: unref(toggleAppearance)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="vpi-sun sun" data-v-e40a8bb6${_scopeId}></span><span class="vpi-moon moon" data-v-e40a8bb6${_scopeId}></span>`);
          } else {
            return [
              createVNode("span", { class: "vpi-sun sun" }),
              createVNode("span", { class: "vpi-moon moon" })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const VPSwitchAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["__scopeId", "data-v-e40a8bb6"]]);
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { site } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(site).appearance && unref(site).appearance !== "force-dark" && unref(site).appearance !== "force-auto") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarAppearance" }, _attrs))} data-v-af096f4a>`);
        _push(ssrRenderComponent(VPSwitchAppearance, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const VPNavBarAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["__scopeId", "data-v-af096f4a"]]);
const focusedElement = ref();
let active = false;
let listeners = 0;
function useFlyout(options) {
  const focus = ref(false);
  if (inBrowser) {
    !active && activateFocusTracking();
    listeners++;
    const unwatch = watch(focusedElement, (el) => {
      var _a, _b, _c;
      if (el === options.el.value || ((_a = options.el.value) == null ? void 0 : _a.contains(el))) {
        focus.value = true;
        (_b = options.onFocus) == null ? void 0 : _b.call(options);
      } else {
        focus.value = false;
        (_c = options.onBlur) == null ? void 0 : _c.call(options);
      }
    });
    onUnmounted(() => {
      unwatch();
      listeners--;
      if (!listeners) {
        deactivateFocusTracking();
      }
    });
  }
  return readonly(focus);
}
function activateFocusTracking() {
  document.addEventListener("focusin", handleFocusIn);
  active = true;
  focusedElement.value = document.activeElement;
}
function deactivateFocusTracking() {
  document.removeEventListener("focusin", handleFocusIn);
}
function handleFocusIn() {
  focusedElement.value = document.activeElement;
}
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "VPMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const { page } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenuLink" }, _attrs))} data-v-acbfed09>`);
      _push(ssrRenderComponent(_sfc_main$14, {
        class: {
          active: unref(isActive)(
            unref(page).relativePath,
            _ctx.item.activeMatch || _ctx.item.link,
            !!_ctx.item.activeMatch
          )
        },
        href: _ctx.item.link,
        target: _ctx.item.target,
        rel: _ctx.item.rel,
        "no-icon": _ctx.item.noIcon
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-acbfed09${_scopeId}>${_ctx.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: _ctx.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const VPMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["__scopeId", "data-v-acbfed09"]]);
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "VPMenuGroup",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenuGroup" }, _attrs))} data-v-48c802d0>`);
      if (_ctx.text) {
        _push(`<p class="title" data-v-48c802d0>${ssrInterpolate(_ctx.text)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(_ctx.items, (item) => {
        _push(`<!--[-->`);
        if ("link" in item) {
          _push(ssrRenderComponent(VPMenuLink, { item }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const VPMenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["__scopeId", "data-v-48c802d0"]]);
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "VPMenu",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenu" }, _attrs))} data-v-7dd3104a>`);
      if (_ctx.items) {
        _push(`<div class="items" data-v-7dd3104a><!--[-->`);
        ssrRenderList(_ctx.items, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props), null), _parent);
          } else {
            _push(ssrRenderComponent(VPMenuGroup, {
              text: item.text,
              items: item.items
            }, null, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const VPMenu = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["__scopeId", "data-v-7dd3104a"]]);
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "VPFlyout",
  __ssrInlineRender: true,
  props: {
    icon: {},
    button: {},
    label: {},
    items: {}
  },
  setup(__props) {
    const open = ref(false);
    const el = ref();
    useFlyout({ el, onBlur });
    function onBlur() {
      open.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "VPFlyout",
        ref_key: "el",
        ref: el
      }, _attrs))} data-v-04f5c5e9><button type="button" class="button" aria-haspopup="true"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-label", _ctx.label)} data-v-04f5c5e9>`);
      if (_ctx.button || _ctx.icon) {
        _push(`<span class="text" data-v-04f5c5e9>`);
        if (_ctx.icon) {
          _push(`<span class="${ssrRenderClass([_ctx.icon, "option-icon"])}" data-v-04f5c5e9></span>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.button) {
          _push(`<span data-v-04f5c5e9>${_ctx.button ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="vpi-chevron-down text-icon" data-v-04f5c5e9></span></span>`);
      } else {
        _push(`<span class="vpi-more-horizontal icon" data-v-04f5c5e9></span>`);
      }
      _push(`</button><div class="menu" data-v-04f5c5e9>`);
      _push(ssrRenderComponent(VPMenu, { items: _ctx.items }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const VPFlyout = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["__scopeId", "data-v-04f5c5e9"]]);
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "VPSocialLink",
  __ssrInlineRender: true,
  props: {
    icon: {},
    link: {},
    ariaLabel: {}
  },
  setup(__props) {
    var _a;
    const props = __props;
    const el = ref();
    onMounted(async () => {
      var _a2;
      await nextTick();
      const span = (_a2 = el.value) == null ? void 0 : _a2.children[0];
      if (span instanceof HTMLElement && span.className.startsWith("vpi-social-") && (getComputedStyle(span).maskImage || getComputedStyle(span).webkitMaskImage) === "none") {
        span.style.setProperty(
          "--icon",
          `url('https://api.iconify.design/simple-icons/${props.icon}.svg')`
        );
      }
    });
    const svg = computed(() => {
      if (typeof props.icon === "object") return props.icon.svg;
      return `<span class="vpi-social-${props.icon}"></span>`;
    });
    {
      typeof props.icon === "string" && ((_a = useSSRContext()) == null ? void 0 : _a.vpSocialIcons.add(props.icon));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        ref_key: "el",
        ref: el,
        class: "VPSocialLink no-icon",
        href: _ctx.link,
        "aria-label": _ctx.ariaLabel ?? (typeof _ctx.icon === "string" ? _ctx.icon : ""),
        target: "_blank",
        rel: "noopener"
      }, _attrs))} data-v-d26d30cb>${svg.value ?? ""}</a>`);
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const VPSocialLink = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["__scopeId", "data-v-d26d30cb"]]);
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "VPSocialLinks",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPSocialLinks" }, _attrs))} data-v-ee7a9424><!--[-->`);
      ssrRenderList(_ctx.links, ({ link: link2, icon, ariaLabel }) => {
        _push(ssrRenderComponent(VPSocialLink, {
          key: link2,
          icon,
          link: link2,
          ariaLabel
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const VPSocialLinks = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["__scopeId", "data-v-ee7a9424"]]);
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarExtra",
  __ssrInlineRender: true,
  setup(__props) {
    const { site, theme: theme2 } = useData();
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    const hasExtraContent = computed(
      () => localeLinks.value.length && currentLang.value.label || site.value.appearance || theme2.value.socialLinks
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (hasExtraContent.value) {
        _push(ssrRenderComponent(VPFlyout, mergeProps({
          class: "VPNavBarExtra",
          label: "extra navigation"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(localeLinks).length && unref(currentLang).label) {
                _push2(`<div class="group translations" data-v-925effce${_scopeId}><p class="trans-title" data-v-925effce${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><!--[-->`);
                ssrRenderList(unref(localeLinks), (locale) => {
                  _push2(ssrRenderComponent(VPMenuLink, { item: locale }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(site).appearance && unref(site).appearance !== "force-dark" && unref(site).appearance !== "force-auto") {
                _push2(`<div class="group" data-v-925effce${_scopeId}><div class="item appearance" data-v-925effce${_scopeId}><p class="label" data-v-925effce${_scopeId}>${ssrInterpolate(unref(theme2).darkModeSwitchLabel || "Appearance")}</p><div class="appearance-action" data-v-925effce${_scopeId}>`);
                _push2(ssrRenderComponent(VPSwitchAppearance, null, null, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(theme2).socialLinks) {
                _push2(`<div class="group" data-v-925effce${_scopeId}><div class="item social-links" data-v-925effce${_scopeId}>`);
                _push2(ssrRenderComponent(VPSocialLinks, {
                  class: "social-links-list",
                  links: unref(theme2).socialLinks
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(localeLinks).length && unref(currentLang).label ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "group translations"
                }, [
                  createVNode("p", { class: "trans-title" }, toDisplayString(unref(currentLang).label), 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(localeLinks), (locale) => {
                    return openBlock(), createBlock(VPMenuLink, {
                      key: locale.link,
                      item: locale
                    }, null, 8, ["item"]);
                  }), 128))
                ])) : createCommentVNode("", true),
                unref(site).appearance && unref(site).appearance !== "force-dark" && unref(site).appearance !== "force-auto" ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "group"
                }, [
                  createVNode("div", { class: "item appearance" }, [
                    createVNode("p", { class: "label" }, toDisplayString(unref(theme2).darkModeSwitchLabel || "Appearance"), 1),
                    createVNode("div", { class: "appearance-action" }, [
                      createVNode(VPSwitchAppearance)
                    ])
                  ])
                ])) : createCommentVNode("", true),
                unref(theme2).socialLinks ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "group"
                }, [
                  createVNode("div", { class: "item social-links" }, [
                    createVNode(VPSocialLinks, {
                      class: "social-links-list",
                      links: unref(theme2).socialLinks
                    }, null, 8, ["links"])
                  ])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const VPNavBarExtra = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["__scopeId", "data-v-925effce"]]);
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarHamburger",
  __ssrInlineRender: true,
  props: {
    active: { type: Boolean }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: ["VPNavBarHamburger", { active: _ctx.active }],
        "aria-label": "mobile navigation",
        "aria-expanded": _ctx.active,
        "aria-controls": "VPNavScreen"
      }, _attrs))} data-v-5dea55bf><span class="container" data-v-5dea55bf><span class="top" data-v-5dea55bf></span><span class="middle" data-v-5dea55bf></span><span class="bottom" data-v-5dea55bf></span></span></button>`);
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const VPNavBarHamburger = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["__scopeId", "data-v-5dea55bf"]]);
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const { page } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$14, mergeProps({
        class: {
          VPNavBarMenuLink: true,
          active: unref(isActive)(
            unref(page).relativePath,
            _ctx.item.activeMatch || _ctx.item.link,
            !!_ctx.item.activeMatch
          )
        },
        href: _ctx.item.link,
        target: _ctx.item.target,
        rel: _ctx.item.rel,
        "no-icon": _ctx.item.noIcon,
        tabindex: "0"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-956ec74c${_scopeId}>${_ctx.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: _ctx.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenuLink.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const VPNavBarMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-956ec74c"]]);
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenuGroup",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const props = __props;
    const { page } = useData();
    const isChildActive = (navItem) => {
      if ("component" in navItem) return false;
      if ("link" in navItem) {
        return isActive(
          page.value.relativePath,
          navItem.link,
          !!props.item.activeMatch
        );
      }
      return navItem.items.some(isChildActive);
    };
    const childrenActive = computed(() => isChildActive(props.item));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VPFlyout, mergeProps({
        class: {
          VPNavBarMenuGroup: true,
          active: unref(isActive)(unref(page).relativePath, _ctx.item.activeMatch, !!_ctx.item.activeMatch) || childrenActive.value
        },
        button: _ctx.item.text,
        items: _ctx.item.items
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenuGroup.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).nav) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-labelledby": "main-nav-aria-label",
          class: "VPNavBarMenu"
        }, _attrs))} data-v-e6d46098><span id="main-nav-aria-label" class="visually-hidden" data-v-e6d46098> Main Navigation </span><!--[-->`);
        ssrRenderList(unref(theme2).nav, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPNavBarMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props), null), _parent);
          } else {
            _push(ssrRenderComponent(_sfc_main$C, { item }, null, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenu.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const VPNavBarMenu = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-e6d46098"]]);
function createSearchTranslate(defaultTranslations) {
  const { localeIndex, theme: theme2 } = useData();
  function translate(key) {
    var _a, _b, _c;
    const keyPath = key.split(".");
    const themeObject = (_a = theme2.value.search) == null ? void 0 : _a.options;
    const isObject = themeObject && typeof themeObject === "object";
    const locales = isObject && ((_c = (_b = themeObject.locales) == null ? void 0 : _b[localeIndex.value]) == null ? void 0 : _c.translations) || null;
    const translations = isObject && themeObject.translations || null;
    let localeResult = locales;
    let translationResult = translations;
    let defaultResult = defaultTranslations;
    const lastKey = keyPath.pop();
    for (const k of keyPath) {
      let fallbackResult = null;
      const foundInFallback = defaultResult == null ? void 0 : defaultResult[k];
      if (foundInFallback) {
        fallbackResult = defaultResult = foundInFallback;
      }
      const foundInTranslation = translationResult == null ? void 0 : translationResult[k];
      if (foundInTranslation) {
        fallbackResult = translationResult = foundInTranslation;
      }
      const foundInLocale = localeResult == null ? void 0 : localeResult[k];
      if (foundInLocale) {
        fallbackResult = localeResult = foundInLocale;
      }
      if (!foundInFallback) {
        defaultResult = fallbackResult;
      }
      if (!foundInTranslation) {
        translationResult = fallbackResult;
      }
      if (!foundInLocale) {
        localeResult = fallbackResult;
      }
    }
    return (localeResult == null ? void 0 : localeResult[lastKey]) ?? (translationResult == null ? void 0 : translationResult[lastKey]) ?? (defaultResult == null ? void 0 : defaultResult[lastKey]) ?? "";
  }
  return translate;
}
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSearchButton",
  __ssrInlineRender: true,
  setup(__props) {
    const defaultTranslations = {
      button: {
        buttonText: "Search",
        buttonAriaLabel: "Search"
      }
    };
    const translate = createSearchTranslate(defaultTranslations);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: "DocSearch DocSearch-Button",
        "aria-label": unref(translate)("button.buttonAriaLabel")
      }, _attrs))}><span class="DocSearch-Button-Container"><span class="vp-icon DocSearch-Search-Icon"></span><span class="DocSearch-Button-Placeholder">${ssrInterpolate(unref(translate)("button.buttonText"))}</span></span><span class="DocSearch-Button-Keys"><kbd class="DocSearch-Button-Key"></kbd><kbd class="DocSearch-Button-Key">K</kbd></span></button>`);
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSearch",
  __ssrInlineRender: true,
  setup(__props) {
    const VPLocalSearchBox = defineAsyncComponent(() => import("./VPLocalSearchBox.CXHp9zwR.js"));
    const VPAlgoliaSearchBox = () => null;
    const { theme: theme2 } = useData();
    const loaded = ref(false);
    const actuallyLoaded = ref(false);
    onMounted(() => {
      {
        return;
      }
    });
    function load() {
      if (!loaded.value) {
        loaded.value = true;
        setTimeout(poll, 16);
      }
    }
    function poll() {
      const e = new Event("keydown");
      e.key = "k";
      e.metaKey = true;
      window.dispatchEvent(e);
      setTimeout(() => {
        if (!document.querySelector(".DocSearch-Modal")) {
          poll();
        }
      }, 16);
    }
    function isEditingContent(event2) {
      const element = event2.target;
      const tagName = element.tagName;
      return element.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
    }
    const showSearch = ref(false);
    {
      onKeyStroke("k", (event2) => {
        if (event2.ctrlKey || event2.metaKey) {
          event2.preventDefault();
          showSearch.value = true;
        }
      });
      onKeyStroke("/", (event2) => {
        if (!isEditingContent(event2)) {
          event2.preventDefault();
          showSearch.value = true;
        }
      });
    }
    const provider = "local";
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarSearch" }, _attrs))}>`);
      if (unref(provider) === "local") {
        _push(`<!--[-->`);
        if (showSearch.value) {
          _push(ssrRenderComponent(unref(VPLocalSearchBox), {
            onClose: ($event) => showSearch.value = false
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div id="local-search">`);
        _push(ssrRenderComponent(_sfc_main$A, {
          onClick: ($event) => showSearch.value = true
        }, null, _parent));
        _push(`</div><!--]-->`);
      } else if (unref(provider) === "algolia") {
        _push(`<!--[-->`);
        if (loaded.value) {
          _push(ssrRenderComponent(unref(VPAlgoliaSearchBox), {
            algolia: ((_a = unref(theme2).search) == null ? void 0 : _a.options) ?? unref(theme2).algolia,
            onVnodeBeforeMount: ($event) => actuallyLoaded.value = true
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!actuallyLoaded.value) {
          _push(`<div id="docsearch">`);
          _push(ssrRenderComponent(_sfc_main$A, { onClick: load }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSocialLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).socialLinks) {
        _push(ssrRenderComponent(VPSocialLinks, mergeProps({
          class: "VPNavBarSocialLinks",
          links: unref(theme2).socialLinks
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const VPNavBarSocialLinks = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["__scopeId", "data-v-164c457f"]]);
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarTitle",
  __ssrInlineRender: true,
  setup(__props) {
    const { site, theme: theme2 } = useData();
    const { hasSidebar } = useSidebar();
    const { currentLang } = useLangs();
    const link2 = computed(
      () => {
        var _a;
        return typeof theme2.value.logoLink === "string" ? theme2.value.logoLink : (_a = theme2.value.logoLink) == null ? void 0 : _a.link;
      }
    );
    const rel = computed(
      () => {
        var _a;
        return typeof theme2.value.logoLink === "string" ? void 0 : (_a = theme2.value.logoLink) == null ? void 0 : _a.rel;
      }
    );
    const target = computed(
      () => {
        var _a;
        return typeof theme2.value.logoLink === "string" ? void 0 : (_a = theme2.value.logoLink) == null ? void 0 : _a.target;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPNavBarTitle", { "has-sidebar": unref(hasSidebar) }]
      }, _attrs))} data-v-0f4f798b><a class="title"${ssrRenderAttr("href", link2.value ?? unref(normalizeLink$1)(unref(currentLang).link))}${ssrRenderAttr("rel", rel.value)}${ssrRenderAttr("target", target.value)} data-v-0f4f798b>`);
      ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent);
      if (unref(theme2).logo) {
        _push(ssrRenderComponent(VPImage, {
          class: "logo",
          image: unref(theme2).logo
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(theme2).siteTitle) {
        _push(`<span data-v-0f4f798b>${unref(theme2).siteTitle ?? ""}</span>`);
      } else if (unref(theme2).siteTitle === void 0) {
        _push(`<span data-v-0f4f798b>${ssrInterpolate(unref(site).title)}</span>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent);
      _push(`</a></div>`);
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const VPNavBarTitle = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-0f4f798b"]]);
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarTranslations",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(localeLinks).length && unref(currentLang).label) {
        _push(ssrRenderComponent(VPFlyout, mergeProps({
          class: "VPNavBarTranslations",
          icon: "vpi-languages",
          label: unref(theme2).langMenuLabel || "Change language"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="items" data-v-c80d9ad0${_scopeId}><p class="title" data-v-c80d9ad0${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><!--[-->`);
              ssrRenderList(unref(localeLinks), (locale) => {
                _push2(ssrRenderComponent(VPMenuLink, { item: locale }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "items" }, [
                  createVNode("p", { class: "title" }, toDisplayString(unref(currentLang).label), 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(localeLinks), (locale) => {
                    return openBlock(), createBlock(VPMenuLink, {
                      key: locale.link,
                      item: locale
                    }, null, 8, ["item"]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTranslations.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const VPNavBarTranslations = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-c80d9ad0"]]);
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "VPNavBar",
  __ssrInlineRender: true,
  props: {
    isScreenOpen: { type: Boolean }
  },
  emits: ["toggle-screen"],
  setup(__props) {
    const props = __props;
    const { y } = useWindowScroll();
    const { hasSidebar } = useSidebar();
    const { frontmatter } = useData();
    const classes = ref({});
    watchPostEffect(() => {
      classes.value = {
        "has-sidebar": hasSidebar.value,
        "home": frontmatter.value.layout === "home",
        "top": y.value === 0,
        "screen-open": props.isScreenOpen
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPNavBar", classes.value]
      }, _attrs))} data-v-822684d1><div class="wrapper" data-v-822684d1><div class="container" data-v-822684d1><div class="title" data-v-822684d1>`);
      _push(ssrRenderComponent(VPNavBarTitle, null, {
        "nav-bar-title-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)
            ];
          }
        }),
        "nav-bar-title-after": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div><div class="content" data-v-822684d1><div class="content-body" data-v-822684d1>`);
      ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$z, { class: "search" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarMenu, { class: "menu" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarTranslations, { class: "translations" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarAppearance, { class: "appearance" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarSocialLinks, { class: "social-links" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarExtra, { class: "extra" }, null, _parent));
      ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent);
      _push(ssrRenderComponent(VPNavBarHamburger, {
        class: "hamburger",
        active: _ctx.isScreenOpen,
        onClick: ($event) => _ctx.$emit("toggle-screen")
      }, null, _parent));
      _push(`</div></div></div></div><div class="divider" data-v-822684d1><div class="divider-line" data-v-822684d1></div></div></div>`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const VPNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-822684d1"]]);
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { site, theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(site).appearance && unref(site).appearance !== "force-dark" && unref(site).appearance !== "force-auto") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavScreenAppearance" }, _attrs))} data-v-ffb44008><p class="text" data-v-ffb44008>${ssrInterpolate(unref(theme2).darkModeSwitchLabel || "Appearance")}</p>`);
        _push(ssrRenderComponent(VPSwitchAppearance, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenAppearance.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const VPNavScreenAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-ffb44008"]]);
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const closeScreen = inject("close-screen");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$14, mergeProps({
        class: "VPNavScreenMenuLink",
        href: _ctx.item.link,
        target: _ctx.item.target,
        rel: _ctx.item.rel,
        "no-icon": _ctx.item.noIcon,
        onClick: unref(closeScreen)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-735512b8${_scopeId}>${_ctx.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: _ctx.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuLink.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const VPNavScreenMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-735512b8"]]);
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroupLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const closeScreen = inject("close-screen");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$14, mergeProps({
        class: "VPNavScreenMenuGroupLink",
        href: _ctx.item.link,
        target: _ctx.item.target,
        rel: _ctx.item.rel,
        "no-icon": _ctx.item.noIcon,
        onClick: unref(closeScreen)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-372ae7c0${_scopeId}>${_ctx.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: _ctx.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroupLink.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const VPNavScreenMenuGroupLink = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-372ae7c0"]]);
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroupSection",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavScreenMenuGroupSection" }, _attrs))} data-v-4b8941ac>`);
      if (_ctx.text) {
        _push(`<p class="title" data-v-4b8941ac>${ssrInterpolate(_ctx.text)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(_ctx.items, (item) => {
        _push(ssrRenderComponent(VPNavScreenMenuGroupLink, {
          key: item.text,
          item
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroupSection.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const VPNavScreenMenuGroupSection = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-4b8941ac"]]);
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroup",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    const props = __props;
    const isOpen = ref(false);
    const groupId = computed(
      () => `NavScreenGroup-${props.text.replace(" ", "-").toLowerCase()}`
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPNavScreenMenuGroup", { open: isOpen.value }]
      }, _attrs))} data-v-875057a5><button class="button"${ssrRenderAttr("aria-controls", groupId.value)}${ssrRenderAttr("aria-expanded", isOpen.value)} data-v-875057a5><span class="button-text" data-v-875057a5>${_ctx.text ?? ""}</span><span class="vpi-plus button-icon" data-v-875057a5></span></button><div${ssrRenderAttr("id", groupId.value)} class="items" data-v-875057a5><!--[-->`);
      ssrRenderList(_ctx.items, (item) => {
        _push(`<!--[-->`);
        if ("link" in item) {
          _push(`<div class="item" data-v-875057a5>`);
          _push(ssrRenderComponent(VPNavScreenMenuGroupLink, { item }, null, _parent));
          _push(`</div>`);
        } else if ("component" in item) {
          _push(`<div class="item" data-v-875057a5>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": "" }), null), _parent);
          _push(`</div>`);
        } else {
          _push(`<div class="group" data-v-875057a5>`);
          _push(ssrRenderComponent(VPNavScreenMenuGroupSection, {
            text: item.text,
            items: item.items
          }, null, _parent));
          _push(`</div>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroup.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const VPNavScreenMenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-875057a5"]]);
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).nav) {
        _push(`<nav${ssrRenderAttrs(mergeProps({ class: "VPNavScreenMenu" }, _attrs))}><!--[-->`);
        ssrRenderList(unref(theme2).nav, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPNavScreenMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": "" }), null), _parent);
          } else {
            _push(ssrRenderComponent(VPNavScreenMenuGroup, {
              text: item.text || "",
              items: item.items
            }, null, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenu.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenSocialLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).socialLinks) {
        _push(ssrRenderComponent(VPSocialLinks, mergeProps({
          class: "VPNavScreenSocialLinks",
          links: unref(theme2).socialLinks
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenSocialLinks.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenTranslations",
  __ssrInlineRender: true,
  setup(__props) {
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(localeLinks).length && unref(currentLang).label) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["VPNavScreenTranslations", { open: isOpen.value }]
        }, _attrs))} data-v-362991c2><button class="title" data-v-362991c2><span class="vpi-languages icon lang" data-v-362991c2></span> ${ssrInterpolate(unref(currentLang).label)} <span class="vpi-chevron-down icon chevron" data-v-362991c2></span></button><ul class="list" data-v-362991c2><!--[-->`);
        ssrRenderList(unref(localeLinks), (locale) => {
          _push(`<li class="item" data-v-362991c2>`);
          _push(ssrRenderComponent(_sfc_main$14, {
            class: "link",
            href: locale.link
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(locale.text)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(locale.text), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenTranslations.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const VPNavScreenTranslations = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-362991c2"]]);
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreen",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  setup(__props) {
    const screen = ref(null);
    useScrollLock(inBrowser ? document.body : null);
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.open) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "VPNavScreen",
          ref_key: "screen",
          ref: screen,
          id: "VPNavScreen"
        }, _attrs))} data-v-833aabba><div class="container" data-v-833aabba>`);
        ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent);
        _push(ssrRenderComponent(_sfc_main$p, { class: "menu" }, null, _parent));
        _push(ssrRenderComponent(VPNavScreenTranslations, { class: "translations" }, null, _parent));
        _push(ssrRenderComponent(VPNavScreenAppearance, { class: "appearance" }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$o, { class: "social-links" }, null, _parent));
        ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const VPNavScreen = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-833aabba"]]);
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "VPNav",
  __ssrInlineRender: true,
  setup(__props) {
    const { isScreenOpen, closeScreen, toggleScreen } = useNav();
    const { frontmatter } = useData();
    const hasNavbar = computed(() => {
      return frontmatter.value.navbar !== false;
    });
    provide("close-screen", closeScreen);
    watchEffect(() => {
      if (inBrowser) {
        document.documentElement.classList.toggle("hide-nav", !hasNavbar.value);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (hasNavbar.value) {
        _push(`<header${ssrRenderAttrs(mergeProps({ class: "VPNav" }, _attrs))} data-v-f1e365da>`);
        _push(ssrRenderComponent(VPNavBar, {
          "is-screen-open": unref(isScreenOpen),
          onToggleScreen: unref(toggleScreen)
        }, {
          "nav-bar-title-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-title-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPNavScreen, { open: unref(isScreenOpen) }, {
          "nav-screen-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-screen-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPNav.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const VPNav = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-f1e365da"]]);
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "VPSidebarItem",
  __ssrInlineRender: true,
  props: {
    item: {},
    depth: {}
  },
  setup(__props) {
    const props = __props;
    const {
      collapsed,
      collapsible,
      isLink,
      isActiveLink,
      hasActiveLink: hasActiveLink2,
      hasChildren,
      toggle
    } = useSidebarControl(computed(() => props.item));
    const sectionTag = computed(() => hasChildren.value ? "section" : `div`);
    const linkTag = computed(() => isLink.value ? "a" : "div");
    const textTag = computed(() => {
      return !hasChildren.value ? "p" : props.depth + 2 === 7 ? "p" : `h${props.depth + 2}`;
    });
    const itemRole = computed(() => isLink.value ? void 0 : "button");
    const classes = computed(() => [
      [`level-${props.depth}`],
      { collapsible: collapsible.value },
      { collapsed: collapsed.value },
      { "is-link": isLink.value },
      { "is-active": isActiveLink.value },
      { "has-active": hasActiveLink2.value }
    ]);
    function onItemInteraction(e) {
      if ("key" in e && e.key !== "Enter") {
        return;
      }
      !props.item.link && toggle();
    }
    function onCaretClick() {
      props.item.link && toggle();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VPSidebarItem = resolveComponent("VPSidebarItem", true);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sectionTag.value), mergeProps({
        class: ["VPSidebarItem", classes.value]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.item.text) {
              _push2(`<div class="item"${ssrRenderAttr("role", itemRole.value)}${ssrRenderAttr("tabindex", _ctx.item.items && 0)} data-v-a4b0d9bf${_scopeId}><div class="indicator" data-v-a4b0d9bf${_scopeId}></div>`);
              if (_ctx.item.link) {
                _push2(ssrRenderComponent(_sfc_main$14, {
                  tag: linkTag.value,
                  class: "link",
                  href: _ctx.item.link,
                  rel: _ctx.item.rel,
                  target: _ctx.item.target
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent3, _scopeId2);
                    } else {
                      return [
                        (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
                          class: "text",
                          innerHTML: _ctx.item.text
                        }, null, 8, ["innerHTML"]))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent2, _scopeId);
              }
              if (_ctx.item.collapsed != null && _ctx.item.items && _ctx.item.items.length) {
                _push2(`<div class="caret" role="button" aria-label="toggle section" tabindex="0" data-v-a4b0d9bf${_scopeId}><span class="vpi-chevron-right caret-icon" data-v-a4b0d9bf${_scopeId}></span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.item.items && _ctx.item.items.length) {
              _push2(`<div class="items" data-v-a4b0d9bf${_scopeId}>`);
              if (_ctx.depth < 5) {
                _push2(`<!--[-->`);
                ssrRenderList(_ctx.item.items, (i) => {
                  _push2(ssrRenderComponent(_component_VPSidebarItem, {
                    key: i.text,
                    item: i,
                    depth: _ctx.depth + 1
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              _ctx.item.text ? (openBlock(), createBlock("div", mergeProps({
                key: 0,
                class: "item",
                role: itemRole.value
              }, toHandlers(
                _ctx.item.items ? { click: onItemInteraction, keydown: onItemInteraction } : {},
                true
              ), {
                tabindex: _ctx.item.items && 0
              }), [
                createVNode("div", { class: "indicator" }),
                _ctx.item.link ? (openBlock(), createBlock(_sfc_main$14, {
                  key: 0,
                  tag: linkTag.value,
                  class: "link",
                  href: _ctx.item.link,
                  rel: _ctx.item.rel,
                  target: _ctx.item.target
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
                      class: "text",
                      innerHTML: _ctx.item.text
                    }, null, 8, ["innerHTML"]))
                  ]),
                  _: 1
                }, 8, ["tag", "href", "rel", "target"])) : (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
                  key: 1,
                  class: "text",
                  innerHTML: _ctx.item.text
                }, null, 8, ["innerHTML"])),
                _ctx.item.collapsed != null && _ctx.item.items && _ctx.item.items.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "caret",
                  role: "button",
                  "aria-label": "toggle section",
                  onClick: onCaretClick,
                  onKeydown: withKeys(onCaretClick, ["enter"]),
                  tabindex: "0"
                }, [
                  createVNode("span", { class: "vpi-chevron-right caret-icon" })
                ], 32)) : createCommentVNode("", true)
              ], 16, ["role", "tabindex"])) : createCommentVNode("", true),
              _ctx.item.items && _ctx.item.items.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "items"
              }, [
                _ctx.depth < 5 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(_ctx.item.items, (i) => {
                  return openBlock(), createBlock(_component_VPSidebarItem, {
                    key: i.text,
                    item: i,
                    depth: _ctx.depth + 1
                  }, null, 8, ["item", "depth"]);
                }), 128)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }), _parent);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const VPSidebarItem = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-a4b0d9bf"]]);
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "VPSidebarGroup",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    const disableTransition = ref(true);
    let timer = null;
    onMounted(() => {
      timer = setTimeout(() => {
        timer = null;
        disableTransition.value = false;
      }, 300);
    });
    onBeforeUnmount(() => {
      if (timer != null) {
        clearTimeout(timer);
        timer = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(_ctx.items, (item) => {
        _push(`<div class="${ssrRenderClass([{ "no-transition": disableTransition.value }, "group"])}" data-v-9e426adc>`);
        _push(ssrRenderComponent(VPSidebarItem, {
          item,
          depth: 0
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const VPSidebarGroup = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-9e426adc"]]);
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "VPSidebar",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  setup(__props) {
    const { sidebarGroups, hasSidebar } = useSidebar();
    const props = __props;
    const navEl = ref(null);
    const isLocked = useScrollLock(inBrowser ? document.body : null);
    watch(
      [props, navEl],
      () => {
        var _a;
        if (props.open) {
          isLocked.value = true;
          (_a = navEl.value) == null ? void 0 : _a.focus();
        } else isLocked.value = false;
      },
      { immediate: true, flush: "post" }
    );
    const key = ref(0);
    watch(
      sidebarGroups,
      () => {
        key.value += 1;
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(hasSidebar)) {
        _push(`<aside${ssrRenderAttrs(mergeProps({
          class: ["VPSidebar", { open: _ctx.open }],
          ref_key: "navEl",
          ref: navEl
        }, _attrs))} data-v-18756405><div class="curtain" data-v-18756405></div><nav class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1" data-v-18756405><span class="visually-hidden" id="sidebar-aria-label" data-v-18756405> Sidebar Navigation </span>`);
        ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push, _parent);
        _push(ssrRenderComponent(VPSidebarGroup, {
          items: unref(sidebarGroups),
          key: key.value
        }, null, _parent));
        ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push, _parent);
        _push(`</nav></aside>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const VPSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-18756405"]]);
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "VPSkipLink",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const route = useRoute();
    const backToTop = ref();
    watch(() => route.path, () => backToTop.value.focus());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><span tabindex="-1" data-v-492508fc></span><a href="#VPContent" class="VPSkipLink visually-hidden" data-v-492508fc>${ssrInterpolate(unref(theme2).skipToContentLabel || "Skip to content")}</a><!--]-->`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const VPSkipLink = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-492508fc"]]);
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "Layout",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      isOpen: isSidebarOpen,
      open: openSidebar,
      close: closeSidebar
    } = useSidebar();
    const route = useRoute();
    watch(() => route.path, closeSidebar);
    useCloseSidebarOnEscape(isSidebarOpen, closeSidebar);
    const { frontmatter } = useData();
    const slots = useSlots();
    const heroImageSlotExists = computed(() => !!slots["home-hero-image"]);
    provide("hero-image-slot-exists", heroImageSlotExists);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Content = resolveComponent("Content");
      if (unref(frontmatter).layout !== false) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["Layout", unref(frontmatter).pageClass]
        }, _attrs))} data-v-a9a9e638>`);
        ssrRenderSlot(_ctx.$slots, "layout-top", {}, null, _push, _parent);
        _push(ssrRenderComponent(VPSkipLink, null, null, _parent));
        _push(ssrRenderComponent(VPBackdrop, {
          class: "backdrop",
          show: unref(isSidebarOpen),
          onClick: unref(closeSidebar)
        }, null, _parent));
        _push(ssrRenderComponent(VPNav, null, {
          "nav-bar-title-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-title-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)
              ];
            }
          }),
          "nav-screen-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-screen-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPLocalNav, {
          open: unref(isSidebarOpen),
          onOpenMenu: unref(openSidebar)
        }, null, _parent));
        _push(ssrRenderComponent(VPSidebar, { open: unref(isSidebarOpen) }, {
          "sidebar-nav-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "sidebar-nav-before", {}, void 0, true)
              ];
            }
          }),
          "sidebar-nav-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "sidebar-nav-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPContent, null, {
          "page-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-top", {}, void 0, true)
              ];
            }
          }),
          "page-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)
              ];
            }
          }),
          "not-found": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "not-found", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "not-found", {}, void 0, true)
              ];
            }
          }),
          "home-hero-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)
              ];
            }
          }),
          "home-hero-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)
              ];
            }
          }),
          "home-features-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)
              ];
            }
          }),
          "home-features-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)
              ];
            }
          }),
          "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)
              ];
            }
          }),
          "doc-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)
              ];
            }
          }),
          "doc-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)
              ];
            }
          }),
          "doc-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)
              ];
            }
          }),
          "doc-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)
              ];
            }
          }),
          "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)
              ];
            }
          }),
          "aside-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPFooter, null, null, _parent));
        ssrRenderSlot(_ctx.$slots, "layout-bottom", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_Content, _attrs, null, _parent));
      }
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/Layout.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const Layout = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-a9a9e638"]]);
const GridSettings = {
  xmini: [[0, 2]],
  mini: [],
  small: [
    [920, 6],
    [768, 5],
    [640, 4],
    [480, 3],
    [0, 2]
  ],
  medium: [
    [960, 5],
    [832, 4],
    [640, 3],
    [480, 2]
  ],
  big: [
    [832, 3],
    [640, 2]
  ]
};
function useSponsorsGrid({ el, size = "medium" }) {
  const onResize = throttleAndDebounce(manage, 100);
  onMounted(() => {
    manage();
    window.addEventListener("resize", onResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
  });
  function manage() {
    adjustSlots(el.value, size);
  }
}
function adjustSlots(el, size) {
  const tsize = el.children.length;
  const asize = el.querySelectorAll(".vp-sponsor-grid-item:not(.empty)").length;
  const grid = setGrid(el, size, asize);
  manageSlots(el, grid, tsize, asize);
}
function setGrid(el, size, items) {
  const settings = GridSettings[size];
  const screen = window.innerWidth;
  let grid = 1;
  settings.some(([breakpoint, value]) => {
    if (screen >= breakpoint) {
      grid = items < value ? items : value;
      return true;
    }
  });
  setGridData(el, grid);
  return grid;
}
function setGridData(el, value) {
  el.dataset.vpGrid = String(value);
}
function manageSlots(el, grid, tsize, asize) {
  const diff = tsize - asize;
  const rem = asize % grid;
  const drem = rem === 0 ? rem : grid - rem;
  neutralizeSlots(el, drem - diff);
}
function neutralizeSlots(el, count) {
  if (count === 0) {
    return;
  }
  count > 0 ? addSlots(el, count) : removeSlots(el, count * -1);
}
function addSlots(el, count) {
  for (let i = 0; i < count; i++) {
    const slot = document.createElement("div");
    slot.classList.add("vp-sponsor-grid-item", "empty");
    el.append(slot);
  }
}
function removeSlots(el, count) {
  for (let i = 0; i < count; i++) {
    el.removeChild(el.lastElementChild);
  }
}
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "VPSponsorsGrid",
  __ssrInlineRender: true,
  props: {
    size: { default: "medium" },
    data: {}
  },
  setup(__props) {
    const props = __props;
    const el = ref(null);
    useSponsorsGrid({ el, size: props.size });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPSponsorsGrid vp-sponsor-grid", [_ctx.size]],
        ref_key: "el",
        ref: el
      }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.data, (sponsor) => {
        _push(`<div class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link"${ssrRenderAttr("href", sponsor.url)} target="_blank" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><h4 class="visually-hidden">${ssrInterpolate(sponsor.name)}</h4><img class="vp-sponsor-grid-image"${ssrRenderAttr("src", sponsor.img)}${ssrRenderAttr("alt", sponsor.name)}></article></a></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "VPSponsors",
  __ssrInlineRender: true,
  props: {
    mode: { default: "normal" },
    tier: {},
    size: {},
    data: {}
  },
  setup(__props) {
    const props = __props;
    const sponsors = computed(() => {
      const isSponsors = props.data.some((s) => {
        return "items" in s;
      });
      if (isSponsors) {
        return props.data;
      }
      return [
        { tier: props.tier, size: props.size, items: props.data }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPSponsors vp-sponsor", [_ctx.mode]]
      }, _attrs))}><!--[-->`);
      ssrRenderList(sponsors.value, (sponsor, index) => {
        _push(`<section class="vp-sponsor-section">`);
        if (sponsor.tier) {
          _push(`<h3 class="vp-sponsor-tier">${ssrInterpolate(sponsor.tier)}</h3>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_sfc_main$f, {
          size: sponsor.size,
          data: sponsor.items
        }, null, _parent));
        _push(`</section>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideSponsors",
  __ssrInlineRender: true,
  props: {
    tier: {},
    size: {},
    data: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideSponsors" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$e, {
        mode: "aside",
        tier: _ctx.tier,
        size: _ctx.size,
        data: _ctx.data
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "VPHomeSponsors",
  __ssrInlineRender: true,
  props: {
    message: {},
    actionText: { default: "Become a sponsor" },
    actionLink: {},
    data: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "VPHomeSponsors" }, _attrs))} data-v-db81191c><div class="container" data-v-db81191c><div class="header" data-v-db81191c><div class="love" data-v-db81191c><span class="vpi-heart icon" data-v-db81191c></span></div>`);
      if (_ctx.message) {
        _push(`<h2 class="message" data-v-db81191c>${ssrInterpolate(_ctx.message)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sponsors" data-v-db81191c>`);
      _push(ssrRenderComponent(_sfc_main$e, { data: _ctx.data }, null, _parent));
      _push(`</div>`);
      if (_ctx.actionLink) {
        _push(`<div class="action" data-v-db81191c>`);
        _push(ssrRenderComponent(VPButton, {
          theme: "sponsor",
          text: _ctx.actionText,
          href: _ctx.actionLink
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "VPTeamMembersItem",
  __ssrInlineRender: true,
  props: {
    size: { default: "medium" },
    member: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: ["VPTeamMembersItem", [_ctx.size]]
      }, _attrs))} data-v-f9987cb6><div class="profile" data-v-f9987cb6><figure class="avatar" data-v-f9987cb6><img class="avatar-img"${ssrRenderAttr("src", _ctx.member.avatar)}${ssrRenderAttr("alt", _ctx.member.name)} data-v-f9987cb6></figure><div class="data" data-v-f9987cb6><h1 class="name" data-v-f9987cb6>${ssrInterpolate(_ctx.member.name)}</h1>`);
      if (_ctx.member.title || _ctx.member.org) {
        _push(`<p class="affiliation" data-v-f9987cb6>`);
        if (_ctx.member.title) {
          _push(`<span class="title" data-v-f9987cb6>${ssrInterpolate(_ctx.member.title)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.member.title && _ctx.member.org) {
          _push(`<span class="at" data-v-f9987cb6> @ </span>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.member.org) {
          _push(ssrRenderComponent(_sfc_main$14, {
            class: ["org", { link: _ctx.member.orgLink }],
            href: _ctx.member.orgLink,
            "no-icon": ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.member.org)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.member.org), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.member.desc) {
        _push(`<p class="desc" data-v-f9987cb6>${_ctx.member.desc ?? ""}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.member.links) {
        _push(`<div class="links" data-v-f9987cb6>`);
        _push(ssrRenderComponent(VPSocialLinks, {
          links: _ctx.member.links
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (_ctx.member.sponsor) {
        _push(`<div class="sp" data-v-f9987cb6>`);
        _push(ssrRenderComponent(_sfc_main$14, {
          class: "sp-link",
          href: _ctx.member.sponsor,
          "no-icon": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="vpi-heart sp-icon" data-v-f9987cb6${_scopeId}></span> ${ssrInterpolate(_ctx.member.actionText || "Sponsor")}`);
            } else {
              return [
                createVNode("span", { class: "vpi-heart sp-icon" }),
                createTextVNode(" " + toDisplayString(_ctx.member.actionText || "Sponsor"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const VPTeamMembersItem = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-f9987cb6"]]);
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "VPTeamMembers",
  __ssrInlineRender: true,
  props: {
    size: { default: "medium" },
    members: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => [props.size, `count-${props.members.length}`]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPTeamMembers", classes.value]
      }, _attrs))} data-v-fba19bad><div class="container" data-v-fba19bad><!--[-->`);
      ssrRenderList(_ctx.members, (member) => {
        _push(`<div class="item" data-v-fba19bad>`);
        _push(ssrRenderComponent(VPTeamMembersItem, {
          size: _ctx.size,
          member
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = {};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", _sfc_main$1b);
  }
};
const _imports_0 = "data:image/svg+xml,%3csvg%20t='1733712883490'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='23919'%20width='200'%20height='200'%3e%3cpath%20d='M746.222933%20102.239573l-359.799466%20330.820267L185.347413%20281.4976%20102.2464%20329.864533l198.20544%20182.132054-198.20544%20182.132053%2083.101013%2048.510293%20201.076054-151.558826%20359.799466%20330.676906%20175.527254-85.251413V187.4944z%20m0%20217.57952v384.341334l-255.040853-192.177494z'%20fill='%232196F3'%20p-id='23920'%3e%3c/path%3e%3c/svg%3e";
const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACCCAYAAADIQGNqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAG7ElEQVR4nO2d3XHbOBRGT7JbwHYQpJLAD3nfDkxVYvrVTZipYEswUkmwlWQfQFmMVrHFS0C4AO+Z0XjsIcBPwjHxQ4r88PT0RMd4wM2vML9qMMwZjBMBiPPrlT8rBLkFI3DPrxI8zD8PwHSDDA54Jv1TGP/ngSTjgcWB4mOlMCVwJAF+kt6s+812zyRhS2f5gcn4Hg54YdEevQg5kgQYrtz+LWFz8FKw7h55bY8ehHzh1B2v4Tl3kJkRGy9KeIa2hfRs6xY9ZcT5VKDOPeAB1+qkxqO3W/S1A7RMi0dIh14Z4WwZw1hFbE1IRz4ZI2XkKVHnHojQ3hHymXzjvm+Z6rlUbyxUd898g7aEHMk3PouUW4sMlJO9VyJze7QipEO2tHOJANxlqut3jKSzQbHwfnogsGiPVoTMsWYYSaep7riNKAdOp8XijfbZEhMX2qOFZR/Ptq46kLrQaXsU0b5Dhf02SwtCbjk6TqT/QqMRtAs5Ip9V3+qqHiMj2seQ98JyEyZjk2gW0iE7Ogasm24WzUIOwnImY8NoFlKy7viILa80jVYhnbDcmDGDUQGtQg6CMo+5Qxi3R6uQku465A5h3B6NQjpBmYgJ2QUahRwEZezqmk7QKKSEUDuAkQeNQn4RlAm5Qxh10CakY/2VPTF7CqMa2oSUYOPHjtAm5CAoEzJnMCqiTUgJoXYAIx/ahFw7oYklQhj10CakX7l9LJDBqIgmIZ2gzPfcIYy6tC6k0RmahPSCMiFzBqMymoSUEGoHMPKiSUibYRuqhPQrt48FMhiV0SKkE5SxGXaHaBHSMAA9QnpBmZA5g6EALUI6QZmQOYOhAC1C2gzbAPQI6WsHMHSgQUgnKBMyZzCU0KqQ/+YOYehAg5BeUCZkzmAoQYOQ9i1D4xUNQvqV28cCGQwl1BbSCcrYtww7praQQ+X9G8qoLaTkLmdj7hCGHmoK6QRlYuYMhjJqCil5/oyNHzunlpAeW380LlBDSIfsmdcRE7J7bi2kQ/6oOOuud8B7j5ZzGfbh5tcXti3zBLbliRvK5sBV3r824qU/ngvpSEsxHn0foKSbXxJIH8Itn2UzkD5Pd6P9tUTgQnsshfRsb3TN+MXP0s/MdqShiX97s13jFz9f2+M4hnT0LeMSR3qvruA+BkzGa3Es2uMopOSMScs4yp229Ozv89yKY26Po5BDpSA1KSWNL1Rv7zxAEtLVzVEVV6BOyfWdRsKZkG3UuRfcR/Z79iNS5r2XqHMPRCB8XPxi5MHuObSBo5CHqinqcFeo3gn7B5dwBychA/t63vSBstKUXnjvjdf2WF5cMdL/BzmR3uNUeD8R+IwdLd9j4qw9zs9lB9IHCfnOZx/ruN9Y39Zz0NOGslKOQyGPzb7PmS798a2rfULmACPbLjaI1JEqB6F2gFa49fWQE/Lx233WJIZKalwxHpBdbOuxbq97an2nZkR2lByypjDUUfNbh5KjpJ0n7pyaQo6sP0p6rNvumtp3rgiCMj5zBkMRtYWUnPe1brtjags5sb7bdtlTGGqoLaQEj0nZLRqEDIIyLnMGQwkahJSMI13uEIYONAgZBWVsYtMpGoQM2MTGmNEgJMgWyI0OaVVIsKNkl2gR0iY2BqBHyCgo4zJnMBTQspA20+4QTULGlWVc9hRGdbQICSakQftCuuwpjKpoEtJuQWKoElKCrx3AyIsmIaOgjM20O0OTkAG77cju0SSkBF87gJEXbUKGlds7bKbdFdqEtHPaO0ebkFFQxmXOYFREm5BBUMZuQtUR2oQEu5vFrtEoZKgdwKiHRiElE5shdwijDhqFjIIydsamEzQKGbBx5G7RKCTIxpFD5gxGBbQKKRlHSm+mbyhCq5ATdsvnXaJVSJB123aUbBzNQkqvIB9yhjBui2YhJ2Td9gPp/uVGg2gWEmRPagDruptFu5Aj8qvIf2Ddd3NoFxLkR0mA5/nl8kQxSvPh6empdoZr+MF2qQLln5N9iYF0atPdeL/a+U5qk7D841tPg9XEAXjZWIcniT2x/VHH1+5va+ae8aSx/iOLCWwLXTZc+E/awED5seWIyXgtDyza44+vX7/Wi7KO78DfwF8Z6vLAB8pce+mAfwrU2zOeuT1aOUJCOqTfka+rLXXJ2lCo3t75Au102UciadYdM9TlKTPRsGszZXjAtSYkpPHZlqWgJS5TPaXr3AtNCglJyhwz5bA1yAVigTr3QlNjyHNGtq0rSsvVqrd3IrQ3hjwnAJ9J61hrecya5Nd6Y6G6e+YA7Qt55ECagYcrtw/IJL6GSL4x7l4I86sbISG9oTveF/Nx3qYkI3mXqHrml/Zo5dThGsL88pxu1/eJ07nTeMMcnxc5bDnoROQ37fEfwtId7cymRCYAAAAASUVORK5CYII=";
const _imports_2 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%238a8a8a'%20d='M12%20.297c-6.63%200-12%205.373-12%2012c0%205.303%203.438%209.8%208.205%2011.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422%2018.07%203.633%2017.7%203.633%2017.7c-1.087-.744.084-.729.084-.729c1.205.084%201.838%201.236%201.838%201.236c1.07%201.835%202.809%201.305%203.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38%201.235-3.22c-.135-.303-.54-1.523.105-3.176c0%200%201.005-.322%203.3%201.23c.96-.267%201.98-.399%203-.405c1.02.006%202.04.138%203%20.405c2.28-1.552%203.285-1.23%203.285-1.23c.645%201.653.24%202.873.12%203.176c.765.84%201.23%201.91%201.23%203.22c0%204.61-2.805%205.625-5.475%205.92c.42.36.81%201.096.81%202.22c0%201.606-.015%202.896-.015%203.286c0%20.315.21.69.825.57C20.565%2022.092%2024%2017.592%2024%2012.297c0-6.627-5.373-12-12-12'%20/%3e%3c/svg%3e";
const _imports_3 = "data:image/svg+xml,%3csvg%20t='1735484601745'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='4282'%20width='200'%20height='200'%3e%3cpath%20d='M820.394667%20614.165333a21.333333%2021.333333%200%200%200%2030.165333-30.186666L528.853333%20262.250667a21.333333%2021.333333%200%200%200-30.186666%200L176.917333%20583.978667a21.333333%2021.333333%200%201%200%2030.165334%2030.186666L490.666667%20330.581333v501.482667c0%2011.882667%209.557333%2021.269333%2021.333333%2021.269333%2011.861333%200%2021.333333-9.514667%2021.333333-21.269333v-504.96l287.061334%20287.061333zM170.666667%20192c0-11.776%209.706667-21.333333%2021.333333-21.333333h640c11.776%200%2021.333333%209.472%2021.333333%2021.333333%200%2011.776-9.706667%2021.333333-21.333333%2021.333333H192c-11.776%200-21.333333-9.472-21.333333-21.333333z'%20fill='%238a8a8a'%20p-id='4283'%3e%3c/path%3e%3c/svg%3e";
const data = JSON.parse("{}");
const github_username = "Tdahuyou";
const common_ignore_dirs = [
  "md-imgs",
  ".git",
  "assets",
  ".vscode",
  "0000",
  "9999. templates",
  "node_modules"
];
const repos = [
  "0",
  "c-cpp",
  "canvas",
  "chrome",
  "electron",
  "en-notes",
  "en-words",
  "eslint",
  "git",
  "html-css-js",
  "i18n",
  "chrome",
  "leetcode",
  "markdown",
  "miniprogram-wechat",
  "nodejs",
  "pc",
  "prettier",
  "react",
  "svg",
  "typescript",
  "vite",
  "vitepress",
  "vscode",
  "vue",
  "we_",
  "webpack",
  "wh-bot_"
];
const repos_vitepress = [
  "c-cpp",
  "canvas",
  "chrome",
  "electron",
  "en-notes",
  "eslint",
  "git",
  "html-css-js",
  "i18n",
  "leetcode",
  "markdown",
  "miniprogram-wechat",
  "nodejs",
  "pc",
  "prettier",
  "react",
  "svg",
  "typescript",
  "vite",
  "vitepress",
  "vscode",
  "vue",
  "webpack"
];
const notesmeta = {
  github_username,
  common_ignore_dirs,
  repos,
  repos_vitepress
};
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = weekDays[date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}年${month}月${day}日 周${weekDay} ${hours}:${minutes}:${seconds}`;
};
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
const _sfc_main$6 = {
  __name: "MyLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const swiperInstance = ref(null);
    const initSwiper = () => {
      import("swiper").then(({ default: Swiper }) => {
        import("swiper/modules").then(({ Navigation, Pagination }) => {
          swiperInstance.value = new Swiper(".swiper-container", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            modules: [Navigation, Pagination],
            pagination: {
              el: ".swiper-pagination",
              clickable: true
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev"
            }
          });
        });
      });
    };
    function destroySwiper() {
      if (swiperInstance.value && swiperInstance.value.destroy) {
        try {
          swiperInstance.value.destroy(true, true);
        } catch (error) {
          console.log(error);
        }
      }
    }
    onBeforeUnmount(destroySwiper);
    const { Layout: Layout2 } = theme;
    const vpData = useData$1();
    const vscodeNoteDir = ref("");
    const updateVscodeNoteDir = () => {
      var _a, _b;
      if ((_b = (_a = vpData.page.value) == null ? void 0 : _a.relativePath) == null ? void 0 : _b.startsWith("notes/")) {
        const TNotesDir2 = localStorage.getItem("TNotesDir");
        const relativePath = vpData.page.value.relativePath.replaceAll(/^notes\//g, "").replaceAll("README.md", "");
        vscodeNoteDir.value = TNotesDir2 ? `vscode://file/${TNotesDir2}/${relativePath}` : "";
      } else {
        vscodeNoteDir.value = "";
      }
    };
    onMounted(() => {
      updateVscodeNoteDir();
      initSwiper();
    });
    watch(() => vpData.page.value.relativePath, () => {
      updateVscodeNoteDir();
      initSwiper();
    });
    const allNotesLen = computed(() => {
      var _a;
      return (_a = data[vpData.page.value.title.toLowerCase()]) == null ? void 0 : _a.allNotesLen;
    });
    const doneNotesLen = computed(() => {
      var _a;
      return (_a = data[vpData.page.value.title.toLowerCase()]) == null ? void 0 : _a.doneNotesLen;
    });
    const isCopied = ref(false);
    const copyRawFile = () => {
      const noteData = data[vpData.page.value.title.toLowerCase()];
      if (!noteData) return;
      let data$1 = data[vpData.page.value.title.toLowerCase()].fileContent;
      data$1 = data$1.replace("<MyGlobalComponent />", "");
      navigator.clipboard.writeText(data$1);
      isCopied.value = true;
      setTimeout(() => isCopied.value = false, 1e3);
      const targetWindow = window.open("https://tdahuyou.github.io/m2mm/", "_blank");
      setTimeout(() => {
        targetWindow.postMessage({
          senderID: "__TNotes__",
          message: data$1
        }, "*");
      }, 1e3);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Layout2), _attrs, {
        "doc-top": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) ;
          else {
            return [];
          }
        }),
        "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="footer-update-time" style="${ssrRenderStyle(!unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title) ? null : { display: "none" })}"${_scopeId}> 更新于：${ssrInterpolate(unref(formatDate)(unref(vpData).page.value.lastUpdated))}</div>`);
          } else {
            return [
              withDirectives(createVNode("div", { class: "footer-update-time" }, " 更新于：" + toDisplayString(unref(formatDate)(unref(vpData).page.value.lastUpdated)), 513), [
                [vShow, !unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title)]
              ])
            ];
          }
        }),
        "doc-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="doc-before-container"${_scopeId}><div class="left-area"${_scopeId}><div class="vscode-box" style="${ssrRenderStyle(vscodeNoteDir.value ? null : { display: "none" })}"${_scopeId}><a${ssrRenderAttr("href", vscodeNoteDir.value)} aria-label="open in vscode" title="open in vscode" target="_blank"${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="open in vscode"${_scopeId}></a></div><div class="copy-box" style="${ssrRenderStyle(unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title) ? null : { display: "none" })}"${_scopeId}><span class="tip" style="${ssrRenderStyle(isCopied.value ? null : { display: "none" })}"${_scopeId}>Copied!</span><button class="copy-raw-file" title="Copy raw file"${_scopeId}><img class="icon"${ssrRenderAttr("src", _imports_1)} alt="icon__clipboard"${_scopeId}></button></div><div class="github-box" style="${ssrRenderStyle(unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title) ? null : { display: "none" })}"${_scopeId}><a${ssrRenderAttr("href", `https://github.com/Tdahuyou/${unref(vpData).page.value.title.toLowerCase()}/blob/main/README.md`)}${ssrRenderAttr("aria-label", `Tdahuyou github - ${unref(vpData).page.value.title.toLowerCase()} 笔记仓库链接`)}${ssrRenderAttr("title", `Tdahuyou github - ${unref(vpData).page.value.title.toLowerCase()} 笔记仓库链接`)} target="_blank" rel="noopener"${_scopeId}><img${ssrRenderAttr("src", _imports_2)} alt="github icon"${_scopeId}></a></div></div><div class="right-area" style="${ssrRenderStyle(unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title) ? null : { display: "none" })}"${_scopeId}><div class="notes-length" title="已完成笔记数量/所有笔记数量"${_scopeId}>${ssrInterpolate(doneNotesLen.value)}/${ssrInterpolate(allNotesLen.value)}｜ </div><div class="update-time"${_scopeId}> 更新于：${ssrInterpolate(unref(formatDate)(unref(vpData).page.value.lastUpdated))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "doc-before-container" }, [
                createVNode("div", { class: "left-area" }, [
                  withDirectives(createVNode("div", { class: "vscode-box" }, [
                    createVNode("a", {
                      href: vscodeNoteDir.value,
                      "aria-label": "open in vscode",
                      title: "open in vscode",
                      target: "_blank"
                    }, [
                      createVNode("img", {
                        src: _imports_0,
                        alt: "open in vscode"
                      })
                    ], 8, ["href"])
                  ], 512), [
                    [vShow, vscodeNoteDir.value]
                  ]),
                  withDirectives(createVNode("div", { class: "copy-box" }, [
                    withDirectives(createVNode("span", { class: "tip" }, "Copied!", 512), [
                      [vShow, isCopied.value]
                    ]),
                    createVNode("button", {
                      class: "copy-raw-file",
                      onClick: copyRawFile,
                      title: "Copy raw file"
                    }, [
                      createVNode("img", {
                        class: "icon",
                        src: _imports_1,
                        alt: "icon__clipboard"
                      })
                    ])
                  ], 512), [
                    [vShow, unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title)]
                  ]),
                  withDirectives(createVNode("div", { class: "github-box" }, [
                    createVNode("a", {
                      href: `https://github.com/Tdahuyou/${unref(vpData).page.value.title.toLowerCase()}/blob/main/README.md`,
                      "aria-label": `Tdahuyou github - ${unref(vpData).page.value.title.toLowerCase()} 笔记仓库链接`,
                      title: `Tdahuyou github - ${unref(vpData).page.value.title.toLowerCase()} 笔记仓库链接`,
                      target: "_blank",
                      rel: "noopener"
                    }, [
                      createVNode("img", {
                        src: _imports_2,
                        alt: "github icon"
                      })
                    ], 8, ["href", "aria-label", "title"])
                  ], 512), [
                    [vShow, unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title)]
                  ])
                ]),
                withDirectives(createVNode("div", { class: "right-area" }, [
                  createVNode("div", {
                    class: "notes-length",
                    title: "已完成笔记数量/所有笔记数量"
                  }, toDisplayString(doneNotesLen.value) + "/" + toDisplayString(allNotesLen.value) + "｜ ", 1),
                  createVNode("div", { class: "update-time" }, " 更新于：" + toDisplayString(unref(formatDate)(unref(vpData).page.value.lastUpdated)), 1)
                ], 512), [
                  [vShow, unref(notesmeta).repos_vitepress.includes(unref(vpData).page.value.title)]
                ])
              ])
            ];
          }
        }),
        "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) ;
          else {
            return [];
          }
        }),
        "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span style="${ssrRenderStyle({ "cursor": "pointer", "height": "1em", "width": "1em" })}" title="回到顶部"${_scopeId}><img${ssrRenderAttr("src", _imports_3)} alt="to top"${_scopeId}></span>`);
          } else {
            return [
              createVNode("span", {
                onClick: unref(scrollToTop),
                style: { "cursor": "pointer", "height": "1em", "width": "1em" },
                title: "回到顶部"
              }, [
                createVNode("img", {
                  src: _imports_3,
                  alt: "to top"
                })
              ], 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/MyLayout.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "Footprints",
  __ssrInlineRender: true,
  props: {
    times: {
      type: Array,
      default: () => [],
      validator: (value) => {
        return value.length >= 2 && value.length <= 6 && value.every((item, index) => {
          if (index === 0) return typeof item === "number" && item >= 0;
          if (index === 1) return typeof item === "number" && item >= 1 && item <= 12;
          if (index === 2) return typeof item === "number" && item >= 1 && item <= 31;
          if (index === 3) return typeof item === "number" && item >= 0 && item <= 23;
          if (index === 4) return typeof item === "number" && item >= 0 && item <= 59;
          if (index === 5) return typeof item === "number" && item >= 0 && item <= 59;
          return false;
        });
      }
    }
  },
  setup(__props) {
    const imageContainer = ref(null);
    const images = ref([]);
    const isModalVisible = ref(false);
    const currentIndex = ref(0);
    const currentImage = computed(() => images.value[currentIndex.value]);
    const instanceId = Math.random().toString(36).substr(2, 9);
    const openModal = (index) => {
      currentIndex.value = index;
      isModalVisible.value = true;
    };
    const closeModal = () => isModalVisible.value = false;
    const handleKeyDown = (event2) => {
      if (!isModalVisible.value) return;
      switch (event2.key) {
        case "ArrowLeft":
          if (currentIndex.value > 0) currentIndex.value -= 1;
          break;
        case "ArrowRight":
          if (currentIndex.value < images.value.length - 1) currentIndex.value += 1;
          break;
        case "Escape":
          closeModal();
          break;
      }
    };
    let touchStartX = 0;
    let touchEndX = 0;
    const handleTouchStart = (event2) => {
      event2.preventDefault();
      touchStartX = event2.touches[0].clientX;
    };
    const handleTouchMove = (event2) => {
      event2.preventDefault();
      event2.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      console.log(`Touch end at: ${touchEndX}, Distance: ${swipeDistance}`);
      if (swipeDistance > swipeThreshold && currentIndex.value > 0) {
        currentIndex.value--;
      } else if (swipeDistance < -50 && currentIndex.value < images.value.length - 1) {
        currentIndex.value++;
      }
    };
    let mouseStartX = 0;
    const handleMouseDown = (event2) => {
      event2.preventDefault();
      mouseStartX = event2.clientX;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };
    const handleMouseMove = (event2) => {
      event2.preventDefault();
      event2.clientX;
    };
    const handleMouseUp = () => {
      const swipeThreshold = 50;
      const modalContent = document.querySelector(".__dynamic__modal-content");
      if (!modalContent) return;
      const currentX = event.clientX;
      const moveDistance = currentX - mouseStartX;
      if (moveDistance > swipeThreshold && currentIndex.value > 0) {
        currentIndex.value--;
      } else if (moveDistance < -50 && currentIndex.value < images.value.length - 1) {
        currentIndex.value++;
      }
      mouseStartX = 0;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    onMounted(() => {
      const imgElements = imageContainer.value.querySelectorAll("img");
      images.value = Array.from(imgElements).map((img) => img.src);
      window.addEventListener("keydown", handleKeyDown);
      const modalContent = document.querySelector(`.__dynamic__modal-content-${instanceId}`);
      if (modalContent) {
        modalContent.addEventListener("touchstart", handleTouchStart);
        modalContent.addEventListener("touchmove", handleTouchMove);
        modalContent.addEventListener("touchend", (event2) => {
          touchEndX = event2.changedTouches[0].clientX;
          handleTouchEnd();
        });
        modalContent.addEventListener("mousedown", handleMouseDown);
      }
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown);
      const modalContent = document.querySelector(`.__dynamic__modal-content-${instanceId}`);
      if (modalContent) {
        modalContent.removeEventListener("touchstart", handleTouchStart);
        modalContent.removeEventListener("touchmove", handleTouchMove);
        modalContent.removeEventListener("touchend", handleTouchEnd);
        modalContent.removeEventListener("mousedown", handleMouseDown);
      }
    });
    const textContainer = ref(null);
    const isCollapsed = ref(true);
    const isExpandable = ref(false);
    const checkChildElementCount = () => {
      if (textContainer.value) {
        const childElements = textContainer.value.children;
        isExpandable.value = childElements.length > 2;
      }
    };
    onMounted(() => {
      nextTick(checkChildElementCount);
    });
    const props = __props;
    const formattedTime = computed(() => {
      if (props.times.length < 2) return "";
      const [year, month, day, hour, minute, second] = props.times;
      const datePart = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
      const dayPart = day !== void 0 ? `-${String(day).padStart(2, "0")}` : "";
      let timePart = "";
      if (hour !== void 0 && minute !== void 0 && second !== void 0) {
        timePart = ` ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
      } else if (hour !== void 0 && minute !== void 0) {
        timePart = ` ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      }
      let daysSinceBirthday = "";
      if (day !== void 0) {
        const birthday = new Date(Date.UTC(1999, 5, 29));
        const currentDate = new Date(Date.UTC(year, month - 1, day));
        const diffInMilliseconds = currentDate - birthday;
        const diffInDays = Math.floor(diffInMilliseconds / (1e3 * 60 * 60 * 24)) + 1;
        daysSinceBirthday = `👣 ${diffInDays} | `;
      }
      return daysSinceBirthday + datePart + dayPart + timePart;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="__dynamic__text-container"><div class="${ssrRenderClass([{ collapsed: isCollapsed.value }, "__dynamic__text-content"])}">`);
      ssrRenderSlot(_ctx.$slots, "text-area", {}, null, _push, _parent);
      _push(`</div>`);
      if (isExpandable.value) {
        _push(`<button class="__dynamic__toggle-button">${ssrInterpolate(isCollapsed.value ? "全文" : "收起")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="__dynamic__image-container">`);
      ssrRenderSlot(_ctx.$slots, "image-list", {
        openModal,
        closeModal,
        currentImage: currentImage.value,
        isModalVisible: isModalVisible.value
      }, null, _push, _parent);
      _push(`</div><div class="__dynamic__modal" style="${ssrRenderStyle(isModalVisible.value ? null : { display: "none" })}"><span class="__dynamic__close">×</span><img class="${ssrRenderClass([`__dynamic__modal-content-${unref(instanceId)}`, "__dynamic__modal-content"])}"${ssrRenderAttr("src", currentImage.value)} alt="Preview"></div><div class="__dynamic__time-container"><p>${ssrInterpolate(formattedTime.value)}</p></div><div class="__dynamic__other-info-container">`);
      ssrRenderSlot(_ctx.$slots, "other-info", {}, null, _push, _parent);
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/Footprints.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "RightClickMenu",
  __ssrInlineRender: true,
  props: {
    show: Boolean,
    isAutoShowCard: Boolean,
    x: Number,
    y: Number
  },
  emits: ["pin", "pronounce"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "right-click-menu",
          style: { left: __props.x + "px", top: __props.y + "px" }
        }, _attrs))} data-v-e417bd57><div class="menu-item" data-v-e417bd57>📌 Pin</div><div class="menu-item" data-v-e417bd57> 📢 Pronounce（英） </div><div class="menu-item" data-v-e417bd57> 📢 Pronounce（美） </div><div class="menu-item" data-v-e417bd57> 📢 Pronounce All（英） </div><div class="menu-item" data-v-e417bd57> 📢 Pronounce All（美） </div><div class="menu-item" data-v-e417bd57> 🔍 Auto Show Card（${ssrInterpolate(__props.isAutoShowCard ? "关" : "开")}） </div><div class="menu-item" data-v-e417bd57>✅ Check All</div><div class="menu-item" data-v-e417bd57>❌ Reset</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/RightClickMenu.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const RightClickMenu = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-e417bd57"]]);
const EN_WORDS_REPO_BASE_URL = "https://github.com/Tdahuyou/TNotes.en-words/blob/main/";
const EN_WORDS_REPO_BASE_RAW_URL = "https://raw.githubusercontent.com/Tdahuyou/TNotes.en-words/refs/heads/main/";
const _sfc_main$3 = {
  __name: "EnWordList",
  __ssrInlineRender: true,
  props: {
    words: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const pathname = window.location.pathname;
    const sortedWords = computed(() => [...new Set(props.words)].sort());
    const checkedStates = ref({});
    const updateCheckedState = (word, isChecked) => {
      const key = `${pathname}-${word}`;
      checkedStates.value[word] = isChecked;
      localStorage.setItem(key, isChecked);
    };
    const checkAll = () => {
      Object.keys(checkedStates.value).forEach((word) => {
        updateCheckedState(word, true);
      });
      hideContextMenu();
    };
    const reset = () => {
      sortedWords.value.forEach((word) => {
        const key = `${pathname}-${word}`;
        localStorage.removeItem(key);
        checkedStates.value[word] = false;
      });
      hideContextMenu();
    };
    ref(1e4);
    const isAutoShowCard = ref(true);
    const showCard = ref(false);
    const cardX = ref(0);
    const cardY = ref(0);
    const cardContent = ref("");
    const wordCache = ref({});
    const pinnedCards = ref([]);
    let draggingCard = null;
    let offsetX = 0;
    let offsetY = 0;
    const contextMenuVisible = ref(false);
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);
    let currentWordForContextMenu = null;
    let hoverTimer = null;
    const preloadWords = async () => {
      const wordsToPreload = sortedWords.value;
      if (!wordsToPreload.length) return;
      for (let i = 0; i < wordsToPreload.length; i++) {
        const word = wordsToPreload[i];
        if (wordCache.value[word]) continue;
        const url = `${EN_WORDS_REPO_BASE_RAW_URL}${encodeURIComponent(word)}.md`;
        try {
          const res = await fetch(url);
          if (res.ok) {
            let text = await res.text();
            text = marked.parse(text);
            wordCache.value[word] = text;
            console.log(`✅ 预加载完成: ${word}`);
          } else {
            wordCache.value[word] = `<em>无法加载单词内容</em>`;
          }
        } catch (err) {
          console.error(`❌ 加载失败: ${word}`, err);
          wordCache.value[word] = `<em>加载失败</em>`;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    };
    const onDragging = (e) => {
      if (!draggingCard) return;
      draggingCard.x = e.clientX - offsetX;
      draggingCard.y = e.clientY - offsetY;
    };
    const stopDrag = () => {
      draggingCard = null;
      document.removeEventListener("mousemove", onDragging);
      document.removeEventListener("mouseup", stopDrag);
    };
    const hideContextMenu = () => {
      contextMenuVisible.value = false;
    };
    const handleContextMenuPin = () => {
    };
    let currentPronounceAllIndex = ref(0);
    let isPronouncingAll = ref(false);
    let pronounceAllInterval = null;
    const handlePronounceAll = (lang) => {
      if (isPronouncingAll.value) {
        stopPronounceAll();
        return;
      }
      const wordsToSpeak = sortedWords.value;
      if (!wordsToSpeak.length) return;
      currentPronounceAllIndex.value = 0;
      isPronouncingAll.value = true;
      const speakNext = async () => {
        if (!isPronouncingAll.value || currentPronounceAllIndex.value >= wordsToSpeak.length) {
          stopPronounceAll();
          return;
        }
        const word = wordsToSpeak[currentPronounceAllIndex.value];
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
        await nextTick();
        currentPronounceAllIndex.value++;
      };
      speakNext();
      pronounceAllInterval = setInterval(speakNext, 1500);
      hideContextMenu();
    };
    const stopPronounceAll = () => {
      isPronouncingAll.value = false;
      if (pronounceAllInterval) {
        clearInterval(pronounceAllInterval);
        pronounceAllInterval = null;
      }
      speechSynthesis.cancel();
    };
    const handlePronounce = (word, lang = "en-GB") => {
      if ("speechSynthesis" in window) {
        stopPronounceAll();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
        hideContextMenu();
      } else {
        alert("您的浏览器不支持语音功能，请尝试使用 Chrome 或 Edge 浏览器。");
      }
    };
    onMounted(() => {
      sortedWords.value.forEach((word) => {
        const key = `${pathname}-${word}`;
        const storedState = localStorage.getItem(key);
        checkedStates.value[word] = storedState === "true";
      });
      preloadWords();
    });
    onUnmounted(() => {
      clearTimeout(hoverTimer);
      document.removeEventListener("mousemove", onDragging);
      document.removeEventListener("mouseup", stopDrag);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="__EnWordList__" data-v-1e47ccd7><ol data-v-1e47ccd7><!--[-->`);
      ssrRenderList(sortedWords.value, (word, index) => {
        _push(`<li class="${ssrRenderClass({
          pronounced: unref(isPronouncingAll) && unref(currentPronounceAllIndex) === index + 1
        })}" data-v-1e47ccd7><span class="index" data-v-1e47ccd7>${ssrInterpolate(index + 1)}.</span><input type="checkbox"${ssrRenderAttr("id", word)}${ssrIncludeBooleanAttr(checkedStates.value[word]) ? " checked" : ""} data-v-1e47ccd7><label${ssrRenderAttr("for", word)} data-v-1e47ccd7><a${ssrRenderAttr("href", `${EN_WORDS_REPO_BASE_URL}${encodeURIComponent(word)}.md`)} class="${ssrRenderClass({ "line-through": checkedStates.value[word] })}" data-v-1e47ccd7>${ssrInterpolate(word)}</a></label></li>`);
      });
      _push(`<!--]--></ol>`);
      if (showCard.value) {
        _push(`<div class="word-card" style="${ssrRenderStyle({ left: cardX.value + "px", top: cardY.value + "px" })}" data-v-1e47ccd7><div class="word-card-content" data-v-1e47ccd7>${cardContent.value ?? ""}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(pinnedCards.value, (card) => {
        _push(`<div class="word-card pinned" style="${ssrRenderStyle({
          left: card.x + "px",
          top: card.y + "px",
          width: card.width + "px",
          height: card.height + "px",
          zIndex: card.zIndex
        })}" data-v-1e47ccd7><div class="word-card-content-wrapper" data-v-1e47ccd7><div class="word-card-content" data-v-1e47ccd7>${card.content ?? ""}</div></div><button class="close-btn" data-v-1e47ccd7>✖</button><div class="resize-handle" data-v-1e47ccd7></div></div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(RightClickMenu, {
        show: contextMenuVisible.value,
        x: contextMenuX.value,
        y: contextMenuY.value,
        isAutoShowCard: isAutoShowCard.value,
        onPin: handleContextMenuPin,
        onPronounce: (lang) => handlePronounce(unref(currentWordForContextMenu), lang),
        onPronounceAll: (lang) => handlePronounceAll(lang),
        onAutoShowCard: () => {
          isAutoShowCard.value = !isAutoShowCard.value;
          hideContextMenu();
        },
        onCheckAll: checkAll,
        onReset: reset
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/EnWordList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const EnWordList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-1e47ccd7"]]);
const _sfc_main$2 = {
  __name: "MyGiscusComp",
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      const giscusScript = document.createElement("script");
      giscusScript.src = "https://giscus.app/client.js";
      giscusScript.setAttribute("data-repo", "Tdahuyou/notes");
      giscusScript.setAttribute("data-repo-id", "R_kgDONayFGQ");
      giscusScript.setAttribute("data-category", "Announcements");
      giscusScript.setAttribute("data-category-id", "DIC_kwDONayFGc4Cl8dM");
      giscusScript.setAttribute("data-mapping", "pathname");
      giscusScript.setAttribute("data-strict", "0");
      giscusScript.setAttribute("data-reactions-enabled", "1");
      giscusScript.setAttribute("data-emit-metadata", "0");
      giscusScript.setAttribute("data-input-position", "top");
      giscusScript.setAttribute("data-theme", "noborder_dark");
      giscusScript.setAttribute("data-lang", "zh-CN");
      giscusScript.setAttribute("data-loading", "lazy");
      giscusScript.setAttribute("crossorigin", "anonymous");
      giscusScript.async = true;
      if (!document.getElementById("giscus-script")) {
        giscusScript.id = "giscus-script";
        document.getElementById("giscus-comments").appendChild(giscusScript);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "giscus-comments" }, _attrs))}></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/MyGiscusComp.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BilibiliOutsidePlayer",
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<iframe${ssrRenderAttrs(mergeProps({
        style: { "width": "100%", "aspect-ratio": "16/9", "margin": "1rem 0" },
        src: "//player.bilibili.com/player.html?isOutside=true&bvid=" + __props.id,
        scrolling: "no",
        border: "0",
        frameborder: "no",
        framespacing: "0",
        allowfullscreen: "true"
      }, _attrs))}></iframe>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/BilibiliOutsidePlayer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "TNotesDir",
  __ssrInlineRender: true,
  setup(__props) {
    const path = ref(localStorage.getItem("TNotesDir") || "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-fe7dbdb4><p data-v-fe7dbdb4><input${ssrRenderAttr("value", path.value)} placeholder="请输入 TNotesDir 路径" data-v-fe7dbdb4></p><p data-v-fe7dbdb4><button data-v-fe7dbdb4>确定</button></p></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/components/TNotesDir.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TNotesDir = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fe7dbdb4"]]);
const RawTheme = {
  extends: theme,
  // doc: https://vitepress.dev/zh/guide/extending-default-theme#registering-global-components
  // enhanceApp({ app }) {
  //   // 注册自定义全局组件
  //   app.component("MyGlobalComponent", MyGlobalComponent);
  // },
  // doc: https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
  // 使用注入插槽的包装组件覆盖 Layout
  Layout: _sfc_main$6,
  // doc: https://vitepress.dev/zh/guide/extending-default-theme#registering-global-components
  enhanceApp({ app }) {
    app.component("Footprints", _sfc_main$5);
    app.component("F", _sfc_main$5);
    app.component("EnWordList", EnWordList);
    app.component("E", EnWordList);
    app.component("MyGiscusComp", _sfc_main$2);
    app.component("BilibiliOutsidePlayer", _sfc_main$1);
    app.component("B", _sfc_main$1);
    app.component("TNotesDir", TNotesDir);
  }
};
const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
function useCodeGroups() {
  if (inBrowser) {
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches(".vp-code-group input")) {
        const group = (_a = el.parentElement) == null ? void 0 : _a.parentElement;
        if (!group)
          return;
        const i = Array.from(group.querySelectorAll("input")).indexOf(el);
        if (i < 0)
          return;
        const blocks = group.querySelector(".blocks");
        if (!blocks)
          return;
        const current = Array.from(blocks.children).find((child) => child.classList.contains("active"));
        if (!current)
          return;
        const next = blocks.children[i];
        if (!next || current === next)
          return;
        current.classList.remove("active");
        next.classList.add("active");
        const label = group == null ? void 0 : group.querySelector(`label[for="${el.id}"]`);
        label == null ? void 0 : label.scrollIntoView({ block: "nearest" });
      }
    });
  }
}
function useCopyCode() {
  if (inBrowser) {
    const timeoutIdMap = /* @__PURE__ */ new WeakMap();
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches('div[class*="language-"] > button.copy')) {
        const parent = el.parentElement;
        const sibling = (_a = el.nextElementSibling) == null ? void 0 : _a.nextElementSibling;
        if (!parent || !sibling) {
          return;
        }
        const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className);
        const ignoredNodes = [".vp-copy-ignore", ".diff.remove"];
        const clone = sibling.cloneNode(true);
        clone.querySelectorAll(ignoredNodes.join(",")).forEach((node) => node.remove());
        let text = clone.textContent || "";
        if (isShell) {
          text = text.replace(/^ *(\$|>) /gm, "").trim();
        }
        copyToClipboard(text).then(() => {
          el.classList.add("copied");
          clearTimeout(timeoutIdMap.get(el));
          const timeoutId = setTimeout(() => {
            el.classList.remove("copied");
            el.blur();
            timeoutIdMap.delete(el);
          }, 2e3);
          timeoutIdMap.set(el, timeoutId);
        });
      }
    });
  }
}
async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
    document.body.appendChild(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand("copy");
    document.body.removeChild(element);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}
function useUpdateHead(route, siteDataByRouteRef) {
  let isFirstUpdate = true;
  let managedHeadElements = [];
  const updateHeadTags = (newTags) => {
    if (isFirstUpdate) {
      isFirstUpdate = false;
      newTags.forEach((tag) => {
        const headEl = createHeadElement(tag);
        for (const el of document.head.children) {
          if (el.isEqualNode(headEl)) {
            managedHeadElements.push(el);
            return;
          }
        }
      });
      return;
    }
    const newElements = newTags.map(createHeadElement);
    managedHeadElements.forEach((oldEl, oldIndex) => {
      const matchedIndex = newElements.findIndex((newEl) => newEl == null ? void 0 : newEl.isEqualNode(oldEl ?? null));
      if (matchedIndex !== -1) {
        delete newElements[matchedIndex];
      } else {
        oldEl == null ? void 0 : oldEl.remove();
        delete managedHeadElements[oldIndex];
      }
    });
    newElements.forEach((el) => el && document.head.appendChild(el));
    managedHeadElements = [...managedHeadElements, ...newElements].filter(Boolean);
  };
  watchEffect(() => {
    const pageData = route.data;
    const siteData2 = siteDataByRouteRef.value;
    const pageDescription = pageData && pageData.description;
    const frontmatterHead = pageData && pageData.frontmatter.head || [];
    const title = createTitle(siteData2, pageData);
    if (title !== document.title) {
      document.title = title;
    }
    const description = pageDescription || siteData2.description;
    let metaDescriptionElement = document.querySelector(`meta[name=description]`);
    if (metaDescriptionElement) {
      if (metaDescriptionElement.getAttribute("content") !== description) {
        metaDescriptionElement.setAttribute("content", description);
      }
    } else {
      createHeadElement(["meta", { name: "description", content: description }]);
    }
    updateHeadTags(mergeHead(siteData2.head, filterOutHeadDescription(frontmatterHead)));
  });
}
function createHeadElement([tag, attrs, innerHTML]) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  if (innerHTML) {
    el.innerHTML = innerHTML;
  }
  if (tag === "script" && attrs.async == null) {
    el.async = false;
  }
  return el;
}
function isMetaDescription(headConfig) {
  return headConfig[0] === "meta" && headConfig[1] && headConfig[1].name === "description";
}
function filterOutHeadDescription(head) {
  return head.filter((h2) => !isMetaDescription(h2));
}
const hasFetched = /* @__PURE__ */ new Set();
const createLink = () => document.createElement("link");
const viaDOM = (url) => {
  const link2 = createLink();
  link2.rel = `prefetch`;
  link2.href = url;
  document.head.appendChild(link2);
};
const viaXHR = (url) => {
  const req = new XMLHttpRequest();
  req.open("GET", url, req.withCredentials = true);
  req.send();
};
let link;
const doFetch = inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports("prefetch") ? viaDOM : viaXHR;
function usePrefetch() {
  if (!inBrowser) {
    return;
  }
  if (!window.IntersectionObserver) {
    return;
  }
  let conn;
  if ((conn = navigator.connection) && (conn.saveData || /2g/.test(conn.effectiveType))) {
    return;
  }
  const rIC = window.requestIdleCallback || setTimeout;
  let observer = null;
  const observeLinks = () => {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link2 = entry.target;
          observer.unobserve(link2);
          const { pathname } = link2;
          if (!hasFetched.has(pathname)) {
            hasFetched.add(pathname);
            const pageChunkPath = pathToFile(pathname);
            if (pageChunkPath)
              doFetch(pageChunkPath);
          }
        }
      });
    });
    rIC(() => {
      document.querySelectorAll("#app a").forEach((link2) => {
        const { hostname, pathname } = new URL(link2.href instanceof SVGAnimatedString ? link2.href.animVal : link2.href, link2.baseURI);
        const extMatch = pathname.match(/\.\w+$/);
        if (extMatch && extMatch[0] !== ".html") {
          return;
        }
        if (
          // only prefetch same tab navigation, since a new tab will load
          // the lean js chunk instead.
          link2.target !== "_blank" && // only prefetch inbound links
          hostname === location.hostname
        ) {
          if (pathname !== location.pathname) {
            observer.observe(link2);
          } else {
            hasFetched.add(pathname);
          }
        }
      });
    });
  };
  onMounted(observeLinks);
  const route = useRoute();
  watch(() => route.path, observeLinks);
  onUnmounted(() => {
    observer && observer.disconnect();
  });
}
function resolveThemeExtends(theme2) {
  if (theme2.extends) {
    const base = resolveThemeExtends(theme2.extends);
    return {
      ...base,
      ...theme2,
      async enhanceApp(ctx) {
        if (base.enhanceApp)
          await base.enhanceApp(ctx);
        if (theme2.enhanceApp)
          await theme2.enhanceApp(ctx);
      }
    };
  }
  return theme2;
}
const Theme = resolveThemeExtends(RawTheme);
const VitePressApp = defineComponent({
  name: "VitePressApp",
  setup() {
    const { site, lang, dir } = useData$1();
    onMounted(() => {
      watchEffect(() => {
        document.documentElement.lang = lang.value;
        document.documentElement.dir = dir.value;
      });
    });
    if (site.value.router.prefetchLinks) {
      usePrefetch();
    }
    useCopyCode();
    useCodeGroups();
    if (Theme.setup)
      Theme.setup();
    return () => h(Theme.Layout);
  }
});
async function createApp() {
  globalThis.__VITEPRESS__ = true;
  const router = newRouter();
  const app = newApp();
  app.provide(RouterSymbol, router);
  const data2 = initData(router.route);
  app.provide(dataSymbol, data2);
  app.component("Mermaid", _sfc_main$1c);
  app.component("Content", Content);
  app.component("ClientOnly", ClientOnly);
  Object.defineProperties(app.config.globalProperties, {
    $frontmatter: {
      get() {
        return data2.frontmatter.value;
      }
    },
    $params: {
      get() {
        return data2.page.value.params;
      }
    }
  });
  if (Theme.enhanceApp) {
    await Theme.enhanceApp({
      app,
      router,
      siteData: siteDataRef
    });
  }
  return { app, router, data: data2 };
}
function newApp() {
  return createSSRApp(VitePressApp);
}
function newRouter() {
  let isInitialPageLoad = inBrowser;
  return createRouter((path) => {
    let pageFilePath = pathToFile(path);
    let pageModule = null;
    if (pageFilePath) {
      if (isInitialPageLoad) {
        pageFilePath = pageFilePath.replace(/\.js$/, ".lean.js");
      }
      if (false) ;
      else {
        pageModule = import(
          /*@vite-ignore*/
          pageFilePath
        );
      }
    }
    if (inBrowser) {
      isInitialPageLoad = false;
    }
    return pageModule;
  }, Theme.NotFound);
}
if (inBrowser) {
  createApp().then(({ app, router, data: data2 }) => {
    router.go().then(() => {
      useUpdateHead(router.route, data2.site);
      app.mount("#app");
    });
  });
}
async function render(path) {
  const { app, router } = await createApp();
  await router.go(path);
  const ctx = { content: "", vpSocialIcons: /* @__PURE__ */ new Set() };
  ctx.content = await renderToString(app, ctx);
  return ctx;
}
export {
  useRouter as a,
  createSearchTranslate as c,
  dataSymbol as d,
  escapeRegExp as e,
  inBrowser as i,
  pathToFile as p,
  render,
  useData as u
};
