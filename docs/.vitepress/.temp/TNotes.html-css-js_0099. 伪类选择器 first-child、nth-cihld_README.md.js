import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0099. 伪类选择器 first-child、nth-cihld","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0099. 伪类选择器 first-child、nth-cihld/README.md","filePath":"TNotes.html-css-js/0099. 伪类选择器 first-child、nth-cihld/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0099. 伪类选择器 first-child、nth-cihld/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0099-伪类选择器-first-childnth-cihld" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0099.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child%E3%80%81nth-cihld" target="_self" rel="noopener">0099. 伪类选择器 first-child、nth-cihld</a> <a class="header-anchor" href="#0099-伪类选择器-first-childnth-cihld" aria-label="Permalink to &quot;[0099. 伪类选择器 first-child、nth-cihld](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0099.%20%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8%20first-child%E3%80%81nth-cihld)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--summary" target="_self" rel="noopener">1. 📝 summary</a></li></ul><h2 id="1--summary" tabindex="-1">1. 📝 summary <a class="header-anchor" href="#1--summary" aria-label="Permalink to &quot;1. 📝 summary&quot;" target="_self" rel="noopener">​</a></h2><ul><li>在 0.html 里面编码，1.html 是需要实现的最终效果。</li><li>可以先使用浏览器打开 1.html 看下最终的效果，然后在 0.html 编写 css 实现这样的效果。</li><li>common.css 是公共的基础样式。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0099. 伪类选择器 first-child、nth-cihld/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
