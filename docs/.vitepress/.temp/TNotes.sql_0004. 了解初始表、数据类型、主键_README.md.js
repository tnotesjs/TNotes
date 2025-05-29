import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0004. 了解初始表、数据类型、主键","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0004. 了解初始表、数据类型、主键/README.md","filePath":"TNotes.sql/0004. 了解初始表、数据类型、主键/README.md"}');
const _sfc_main = { name: "TNotes.sql/0004. 了解初始表、数据类型、主键/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0004-了解初始表数据类型主键" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0004.%20%E4%BA%86%E8%A7%A3%E5%88%9D%E5%A7%8B%E8%A1%A8%E3%80%81%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E3%80%81%E4%B8%BB%E9%94%AE" target="_self" rel="noopener">0004. 了解初始表、数据类型、主键</a> <a class="header-anchor" href="#0004-了解初始表数据类型主键" aria-label="Permalink to &quot;[0004. 了解初始表、数据类型、主键](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0004.%20%E4%BA%86%E8%A7%A3%E5%88%9D%E5%A7%8B%E8%A1%A8%E3%80%81%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E3%80%81%E4%B8%BB%E9%94%AE)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0004. 了解初始表、数据类型、主键/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
