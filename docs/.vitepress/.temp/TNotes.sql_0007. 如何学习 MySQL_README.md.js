import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0007. 如何学习 MySQL","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0007. 如何学习 MySQL/README.md","filePath":"TNotes.sql/0007. 如何学习 MySQL/README.md"}');
const _sfc_main = { name: "TNotes.sql/0007. 如何学习 MySQL/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0007-如何学习-mysql" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0007.%20%E5%A6%82%E4%BD%95%E5%AD%A6%E4%B9%A0%20MySQL" target="_self" rel="noopener">0007. 如何学习 MySQL</a> <a class="header-anchor" href="#0007-如何学习-mysql" aria-label="Permalink to &quot;[0007. 如何学习 MySQL](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0007.%20%E5%A6%82%E4%BD%95%E5%AD%A6%E4%B9%A0%20MySQL)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>数据库基础 → SQL 语句 → 表操作 → 索引优化 → 事务与锁 → 存储过程与函数 → 性能调优 → 项目实战</code></li><li>学习路径建议 <ul><li>了解基础概念 <ul><li>数据库、表、字段、SQL 语句基本语法</li></ul></li><li>掌握 SQL 查询 <ul><li>SELECT、INSERT、UPDATE、DELETE</li><li>JOIN 连接、子查询、聚合函数</li></ul></li><li>深入数据库设计 <ul><li>数据范式、索引优化、视图、触发器、存储过程</li></ul></li><li>性能调优与高级特性 <ul><li>查询优化、事务控制、锁机制、分区、集群</li></ul></li><li>实战项目练习 <ul><li>构建博客系统、商城系统、论坛等</li><li>接入后端语言（如 PHP、Java、Python、Node.js）</li></ul></li></ul></li><li>SQL Roadmap <ul><li><a href="https://roadmap.sh/sql" target="_self" rel="noopener">https://roadmap.sh/sql</a></li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-17-08-14-46.png" alt="图 0" loading="lazy"></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0007. 如何学习 MySQL/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
