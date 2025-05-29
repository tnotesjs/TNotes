import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0016. 使用主键约束","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0016. 使用主键约束/README.md","filePath":"TNotes.sql/0016. 使用主键约束/README.md"}');
const _sfc_main = { name: "TNotes.sql/0016. 使用主键约束/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0016-使用主键约束" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0016.%20%E4%BD%BF%E7%94%A8%E4%B8%BB%E9%94%AE%E7%BA%A6%E6%9D%9F" target="_self" rel="noopener">0016. 使用主键约束</a> <a class="header-anchor" href="#0016-使用主键约束" aria-label="Permalink to &quot;[0016. 使用主键约束](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0016.%20%E4%BD%BF%E7%94%A8%E4%B8%BB%E9%94%AE%E7%BA%A6%E6%9D%9F)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>主键 <ul><li>主键，又称主码，是表中一列或多列的组合。</li><li>主键约束（Primary Key Constraint）要求主键列的数据唯一，并且不允许为空。</li><li>主键能够唯一地标识表中的一条记录，可以结合外键来定义不同数据表之间的关系，并且可以加快数据库查询的速度。</li><li>主键和记录之间的关系如同身份证和人之间的关系，它们之间是一一对应的。</li></ul></li><li>主键分为两种类型： <ul><li>单字段主键和多字段联合主键。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0016. 使用主键约束/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
