import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0005. 初始数据库的技术构成","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0005. 初始数据库的技术构成/README.md","filePath":"TNotes.sql/0005. 初始数据库的技术构成/README.md"}');
const _sfc_main = { name: "TNotes.sql/0005. 初始数据库的技术构成/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0005-初始数据库的技术构成" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0005.%20%E5%88%9D%E5%A7%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E6%8A%80%E6%9C%AF%E6%9E%84%E6%88%90" target="_self" rel="noopener">0005. 初始数据库的技术构成</a> <a class="header-anchor" href="#0005-初始数据库的技术构成" aria-label="Permalink to &quot;[0005. 初始数据库的技术构成](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0005.%20%E5%88%9D%E5%A7%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E6%8A%80%E6%9C%AF%E6%9E%84%E6%88%90)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0005. 初始数据库的技术构成/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
