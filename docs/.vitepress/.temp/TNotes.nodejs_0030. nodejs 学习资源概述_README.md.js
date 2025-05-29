import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0030. nodejs 学习资源概述","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0030. nodejs 学习资源概述/README.md","filePath":"TNotes.nodejs/0030. nodejs 学习资源概述/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0030. nodejs 学习资源概述/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0030-nodejs-学习资源概述" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0030.%20nodejs%20%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">0030. nodejs 学习资源概述</a> <a class="header-anchor" href="#0030-nodejs-学习资源概述" aria-label="Permalink to &quot;[0030. nodejs 学习资源概述](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0030.%20nodejs%20%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90%E6%A6%82%E8%BF%B0)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li><li><a href="#2--%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96%E7%9B%B8%E5%85%B3%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90" target="_self" rel="noopener">2. 🤔 如何获取相关学习资源？</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>nodejs 学习资源模块主要记录一些自己在学习 nodejs 时看过的一些相关内容，比如一些 nodejs 相关的书籍、在线教程等。</li><li>有链接的丢链接到笔记中，有 pdf 的，丢 pdf 到笔记中。</li></ul><h2 id="2--如何获取相关学习资源" tabindex="-1">2. 🤔 如何获取相关学习资源？ <a class="header-anchor" href="#2--如何获取相关学习资源" aria-label="Permalink to &quot;2. 🤔 如何获取相关学习资源？&quot;" target="_self" rel="noopener">​</a></h2><ul><li>会在 <code>TNotes.yuque</code> 中统一汇总查阅到的部分学习资源，比如自行在网上找到的一些相关书籍的 pdf 版本，有需要的可自行下载。</li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-02-23-30-28.png" alt="图 0" loading="lazy"></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0030. nodejs 学习资源概述/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
