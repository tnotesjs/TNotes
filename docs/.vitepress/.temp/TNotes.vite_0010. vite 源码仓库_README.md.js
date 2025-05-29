import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0010. vite 源码仓库","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vite/0010. vite 源码仓库/README.md","filePath":"TNotes.vite/0010. vite 源码仓库/README.md"}');
const _sfc_main = { name: "TNotes.vite/0010. vite 源码仓库/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0010-vite-源码仓库" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vite/tree/main/notes/0010.%20vite%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93" target="_self" rel="noopener">0010. vite 源码仓库</a> <a class="header-anchor" href="#0010-vite-源码仓库" aria-label="Permalink to &quot;[0010. vite 源码仓库](https://github.com/Tdahuyou/TNotes.vite/tree/main/notes/0010.%20vite%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vite/0010. vite 源码仓库/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
