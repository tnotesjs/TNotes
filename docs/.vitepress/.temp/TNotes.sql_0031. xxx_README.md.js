import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0031. xxx","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0031. xxx/README.md","filePath":"TNotes.sql/0031. xxx/README.md"}');
const _sfc_main = { name: "TNotes.sql/0031. xxx/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0031-xxx" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0031.%20xxx" target="_self" rel="noopener">0031. xxx</a> <a class="header-anchor" href="#0031-xxx" aria-label="Permalink to &quot;[0031. xxx](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0031.%20xxx)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>MySQL 增强 JSON 功能主要表现在以下几个方面：</li><li>添加了 <code>-&gt;&gt;</code> 运算符，相当于调用 <code>JSON_UNQUOTE()</code> 的结果。</li><li>添加了两个 JSON 聚合函数 JSON_ARRAYAGG() 和 JSON_OBJECTAGG()。 <ul><li>JSON_ARRAYAGG() 将列或表达式作为其参数，并将结果聚合为单个 JSON 数组。</li><li>JSON_OBJECTAGG() 取两个列或表达式，将其解释为键和值，并将结果作为单个 JSON 对象返回。</li></ul></li><li>添加了 JSON 实用程序功能 JSON_PRETTY()，JSON 以易于阅读的格式输出现有值；每个 JSON 对象成员或数组值都打印在一个单独的行上，子对象或数组相对于其父对象是 2 个空格。</li><li>添加的 JSON_MERGE_PATCH() 可以合并符合 RFC 7396 标准的 JSON。在两个 JSON 对象上使用时，可以将它们合并为单个 JSON 对象。</li></ul><p>JSON 功能增强</p><ul><li><strong>新增运算符 <code>-&gt;&gt;</code></strong>： <ul><li>相当于 <code>JSON_UNQUOTE(JSON_EXTRACT(...))</code></li></ul></li><li><strong>新增聚合函数</strong>： <ul><li><code>JSON_ARRAYAGG()</code>：将多行数据合并为 JSON 数组</li><li><code>JSON_OBJECTAGG(key, value)</code>：将列转换为 JSON 对象</li></ul></li><li><strong>JSON 实用函数</strong>： <ul><li><code>JSON_PRETTY()</code>：美化输出格式</li><li><code>JSON_MERGE_PATCH()</code>：按 RFC 7396 合并 JSON 对象</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0031. xxx/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
