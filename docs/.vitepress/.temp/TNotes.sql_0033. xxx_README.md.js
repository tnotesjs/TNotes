import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0033. xxx","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0033. xxx/README.md","filePath":"TNotes.sql/0033. xxx/README.md"}');
const _sfc_main = { name: "TNotes.sql/0033. xxx/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0033-xxx" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0033.%20xxx" target="_self" rel="noopener">0033. xxx</a> <a class="header-anchor" href="#0033-xxx" aria-label="Permalink to &quot;[0033. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0033.%20xxx)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><p>查询的优化</p><ul><li>MySQL 8.0 在查询方面的优化表现如下：</li><li>MySQL 8.0 开始支持不可见索引。优化器根本不使用不可见索引，但会以其他方式正常维护。默认情况下，索引是可见的。通过不可见索引，数据库管理员可以检测索引对查询性能的影响，而不会进行破坏性的更改。</li><li>MySQL8.0 开始支持降序索引。DESC 在索引定义中不再被忽略，而且会降序存储索引字段。</li></ul><p>查询优化增强</p><ul><li><strong>不可见索引（Invisible Indexes）</strong>： <ul><li>可临时隐藏索引，测试其对查询性能的影响</li><li>使用方式：<code>CREATE INDEX ... INVISIBLE</code> 或 <code>ALTER INDEX ... INVISIBLE</code></li></ul></li><li><strong>降序索引（Descending Indexes）</strong>： <ul><li>支持 <code>DESC</code> 排序物理存储，提升 ORDER BY 查询效率</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0033. xxx/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
