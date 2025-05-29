import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0101. 伪类选择器 first-child","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0101. 伪类选择器 first-child/README.md","filePath":"TNotes.html-css-js/0101. 伪类选择器 first-child/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0101. 伪类选择器 first-child/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0101-伪类选择器-first-child" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0101.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child" target="_self" rel="noopener">0101. 伪类选择器 first-child</a> <a class="header-anchor" href="#0101-伪类选择器-first-child" aria-label="Permalink to &quot;[0101. 伪类选择器 first-child](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0101.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E4%BB%8E%E8%AF%AD%E9%9B%80%E6%90%AC%E8%BF%90%E7%AC%94%E8%AE%B0" target="_self" rel="noopener">1. ⏰ 从语雀搬运笔记</a></li></ul><h2 id="1--从语雀搬运笔记" tabindex="-1">1. ⏰ 从语雀搬运笔记 <a class="header-anchor" href="#1--从语雀搬运笔记" aria-label="Permalink to &quot;1. ⏰ 从语雀搬运笔记&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0101. 伪类选择器 first-child/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
