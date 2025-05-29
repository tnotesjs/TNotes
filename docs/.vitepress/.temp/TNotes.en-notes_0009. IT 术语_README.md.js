import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0009. IT 术语","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.en-notes/0009. IT 术语/README.md","filePath":"TNotes.en-notes/0009. IT 术语/README.md"}');
const _sfc_main = { name: "TNotes.en-notes/0009. IT 术语/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0009-it-术语" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0009.%20IT%20%E6%9C%AF%E8%AF%AD" target="_self" rel="noopener">0009. IT 术语</a> <a class="header-anchor" href="#0009-it-术语" aria-label="Permalink to &quot;[0009. IT 术语](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0009.%20IT%20%E6%9C%AF%E8%AF%AD)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>暂且先把一些 IT 相关的术语全部统一丢到这里边，等内容多了，再进一步细分。</li><li>SMS <ul><li><code>SMS</code> 是 <code>Short Message Service</code> 的缩写，中文通常称为“短信服务”。它是一种通过移动通信网络发送和接收短消息的服务。</li><li>用途: 主要用于发送和接收简短的文本消息，通常不超过 160 个字符（在某些情况下可以扩展到更长）。</li></ul></li><li>COS <ul><li>对象存储（Cloud Object Storage，COS）。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.en-notes/0009. IT 术语/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
