import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"3141. 最大汉明距离【困难】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/3141. 最大汉明距离【困难】/README.md","filePath":"TNotes.leetcode/3141. 最大汉明距离【困难】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/3141. 最大汉明距离【困难】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="3141-最大汉明距离困难" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/3141.%20%E6%9C%80%E5%A4%A7%E6%B1%89%E6%98%8E%E8%B7%9D%E7%A6%BB%E3%80%90%E5%9B%B0%E9%9A%BE%E3%80%91" target="_self" rel="noopener">3141. 最大汉明距离【困难】</a> <a class="header-anchor" href="#3141-最大汉明距离困难" aria-label="Permalink to &quot;[3141. 最大汉明距离【困难】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/3141.%20%E6%9C%80%E5%A4%A7%E6%B1%89%E6%98%8E%E8%B7%9D%E7%A6%BB%E3%80%90%E5%9B%B0%E9%9A%BE%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/3141. 最大汉明距离【困难】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
