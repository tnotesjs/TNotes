import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0005. 了解数据库的组成","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0005. 了解数据库的组成/README.md","filePath":"TNotes.sql/0005. 了解数据库的组成/README.md"}');
const _sfc_main = { name: "TNotes.sql/0005. 了解数据库的组成/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0005-了解数据库的组成" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0005.%20%E4%BA%86%E8%A7%A3%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E7%BB%84%E6%88%90" target="_self" rel="noopener">0005. 了解数据库的组成</a> <a class="header-anchor" href="#0005-了解数据库的组成" aria-label="Permalink to &quot;[0005. 了解数据库的组成](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0005.%20%E4%BA%86%E8%A7%A3%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E7%BB%84%E6%88%90)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><table tabindex="0"><thead><tr><th>组成部分</th><th>功能说明</th></tr></thead><tbody><tr><td><strong>数据库管理系统（DBMS）</strong></td><td>负责数据库的创建、管理和维护</td></tr><tr><td><strong>SQL 语言</strong></td><td>结构化查询语言，用于操作数据库</td></tr><tr><td><strong>数据库应用程序接口（如 JDBC、ODBC、MySQL Connector）</strong></td><td>支持程序连接数据库并进行交互</td></tr><tr><td><strong>数据库服务器</strong></td><td>提供数据库服务，处理客户端请求</td></tr><tr><td><strong>数据库客户端工具</strong></td><td>如 MySQL Workbench、Navicat，用于图形化操作数据库</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0005. 了解数据库的组成/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
