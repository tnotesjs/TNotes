import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0006. 了解一些常见的 MySQL 工具","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0006. 了解一些常见的 mysql 工具/README.md","filePath":"TNotes.sql/0006. 了解一些常见的 mysql 工具/README.md"}');
const _sfc_main = { name: "TNotes.sql/0006. 了解一些常见的 mysql 工具/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0006-了解一些常见的-mysql-工具" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0006.%20%E4%BA%86%E8%A7%A3%E4%B8%80%E4%BA%9B%E5%B8%B8%E8%A7%81%E7%9A%84%20MySQL%20%E5%B7%A5%E5%85%B7" target="_self" rel="noopener">0006. 了解一些常见的 MySQL 工具</a> <a class="header-anchor" href="#0006-了解一些常见的-mysql-工具" aria-label="Permalink to &quot;[0006. 了解一些常见的 MySQL 工具](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0006.%20%E4%BA%86%E8%A7%A3%E4%B8%80%E4%BA%9B%E5%B8%B8%E8%A7%81%E7%9A%84%20MySQL%20%E5%B7%A5%E5%85%B7)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--mysql-%E8%87%AA%E5%B8%A6%E5%B7%A5%E5%85%B7" target="_self" rel="noopener">2. 📒 MySQL 自带工具</a></li><li><a href="#3--%E7%AC%AC%E4%B8%89%E6%96%B9%E7%9A%84%E4%B8%80%E4%BA%9B%E5%9B%BE%E5%BD%A2%E5%8C%96%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7" target="_self" rel="noopener">3. 📒 第三方的一些图形化管理工具</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>MySQL 工具可以分为两类： <ul><li>MySQL 自带工具</li><li>第三方的一些图形化管理工具</li></ul></li></ul><h2 id="2--mysql-自带工具" tabindex="-1">2. 📒 MySQL 自带工具 <a class="header-anchor" href="#2--mysql-自带工具" aria-label="Permalink to &quot;2. 📒 MySQL 自带工具&quot;" target="_self" rel="noopener">​</a></h2><table tabindex="0"><thead><tr><th>工具名称</th><th>功能说明</th></tr></thead><tbody><tr><td><code>mysql</code> 命令行客户端</td><td>执行 SQL 语句，查看结果</td></tr><tr><td><code>mysqldump</code></td><td>备份数据库</td></tr><tr><td><code>mysqladmin</code></td><td>管理 MySQL 服务器（如启动/停止、修改密码等）</td></tr><tr><td><code>mysqlimport</code></td><td>导入文本文件数据到数据库</td></tr></tbody></table><h2 id="3--第三方的一些图形化管理工具" tabindex="-1">3. 📒 第三方的一些图形化管理工具 <a class="header-anchor" href="#3--第三方的一些图形化管理工具" aria-label="Permalink to &quot;3. 📒 第三方的一些图形化管理工具&quot;" target="_self" rel="noopener">​</a></h2><table tabindex="0"><thead><tr><th>工具名称</th><th>功能说明</th></tr></thead><tbody><tr><td><strong>MySQL Workbench</strong></td><td>官方推荐工具，支持建模、SQL 开发、管理等功能</td></tr><tr><td><strong>Navicat for MySQL</strong></td><td>强大的图形界面工具，支持远程连接、数据同步</td></tr><tr><td><strong>phpMyAdmin</strong></td><td>基于 PHP 的网页管理工具，常用于 Web 项目后台管理</td></tr><tr><td><strong>DBeaver</strong></td><td>支持多种数据库的通用数据库管理工具</td></tr></tbody></table><blockquote><p><code>2025.05.11</code> 目前在使用的是 <code>DBeaver</code>。</p></blockquote></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0006. 了解一些常见的 mysql 工具/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
