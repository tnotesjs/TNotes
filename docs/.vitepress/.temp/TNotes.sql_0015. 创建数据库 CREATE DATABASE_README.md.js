import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0015. 创建数据库 CREATE DATABASE","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0015. 创建数据库 CREATE DATABASE/README.md","filePath":"TNotes.sql/0015. 创建数据库 CREATE DATABASE/README.md"}');
const _sfc_main = { name: "TNotes.sql/0015. 创建数据库 CREATE DATABASE/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0015-创建数据库-create-database" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0015.%20%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93%20CREATE%20DATABASE" target="_self" rel="noopener">0015. 创建数据库 CREATE DATABASE</a> <a class="header-anchor" href="#0015-创建数据库-create-database" aria-label="Permalink to &quot;[0015. 创建数据库 CREATE DATABASE](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0015.%20%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93%20CREATE%20DATABASE)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>创建数据库：<code>CREATE DATABASE &lt;数据库名&gt;;</code><ul><li>示例：<code>CREATE DATABASE test_db;</code></li></ul></li><li>使用数据库：<code>USE &lt;数据库名&gt;;</code><ul><li>示例：<code>USE test_db;</code></li><li>数据表属于数据库，在创建数据表之前，应该使用语句 <code>USE &lt;数据库名&gt;;</code> 指定操作是在哪个数据库中进行，如果没有选择数据库，就会抛出 <code>No database selected</code> 的错误。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0015. 创建数据库 CREATE DATABASE/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
