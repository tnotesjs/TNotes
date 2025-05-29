import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0013. 了解 Roolup","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vite/0013. 了解 Roolup/README.md","filePath":"TNotes.vite/0013. 了解 Roolup/README.md"}');
const _sfc_main = { name: "TNotes.vite/0013. 了解 Roolup/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0013-了解-roolup" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vite/tree/main/notes/0013.%20%E4%BA%86%E8%A7%A3%20Roolup" target="_self" rel="noopener">0013. 了解 Roolup</a> <a class="header-anchor" href="#0013-了解-roolup" aria-label="Permalink to &quot;[0013. 了解 Roolup](https://github.com/Tdahuyou/TNotes.vite/tree/main/notes/0013.%20%E4%BA%86%E8%A7%A3%20Roolup)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://rollupjs.org/" target="_self" rel="noopener">https://rollupjs.org/</a><ul><li>Rollup 官方文档。</li></ul></li><li><a href="https://github.com/rollup/rollup" target="_self" rel="noopener">https://github.com/rollup/rollup</a><ul><li>Rollup Github 源码仓库。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vite/0013. 了解 Roolup/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
