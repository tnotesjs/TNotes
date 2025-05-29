import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0003. 什么是“数据库”","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0003. 什么是“数据库”/README.md","filePath":"TNotes.sql/0003. 什么是“数据库”/README.md"}');
const _sfc_main = { name: "TNotes.sql/0003. 什么是“数据库”/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0003-什么是数据库" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0003.%20%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E2%80%9D" target="_self" rel="noopener">0003. 什么是“数据库”</a> <a class="header-anchor" href="#0003-什么是数据库" aria-label="Permalink to &quot;[0003. 什么是“数据库”](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0003.%20%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E2%80%9D)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%8F%91%E5%B1%95%E9%98%B6%E6%AE%B5" target="_self" rel="noopener">2. 📒 数据库的发展阶段</a></li><li><a href="#3--%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E7%A7%8D%E7%B1%BB" target="_self" rel="noopener">3. 📒 数据库的种类</a></li><li><a href="#4--%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E4%B8%80%E4%BA%9B%E6%99%AE%E9%81%8D%E7%89%B9%E7%82%B9" target="_self" rel="noopener">4. 📒 数据库的一些普遍特点</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>数据库包含两层含义</strong>： <ul><li>保管数据的 <strong>“仓库”​</strong></li><li>数据管理的 <strong>“方法和技术”</strong></li></ul></li><li><strong>数据库（Database）</strong><ul><li>对于数据库的概念，没有一个完全固定的定义，随着数据库历史的发展，定义的内容也有很大的差异，其中一种比较普遍的观点认为，<strong>数据库（DataBase，DB）是一个长期存储在计算机内的、有组织的、有共享的、统一管理的数据集合</strong>。</li><li>数据库是一个按数据结构来存储和管理数据的计算机软件系统。</li><li>数据库是存储和管理数据的仓库。</li><li>数据库不仅提供对数据的高效存取功能，还支持多用户并发访问，并保证数据的安全性和一致性。</li><li>数据库是由一批数据构成有序的集合，这些数据被存放在结构化的数据表里。 <ul><li>数据表之间相互关联，反映了客观事物间的本质联系。</li><li>数据库系统提供对数据的安全控制和完整性控制。</li></ul></li></ul></li></ul><h2 id="2--数据库的发展阶段" tabindex="-1">2. 📒 数据库的发展阶段 <a class="header-anchor" href="#2--数据库的发展阶段" aria-label="Permalink to &quot;2. 📒 数据库的发展阶段&quot;" target="_self" rel="noopener">​</a></h2><ul><li>人工管理阶段</li><li>文件系统阶段</li><li>数据库系统阶段</li><li>高级数据库阶段</li><li>……</li></ul><h2 id="3--数据库的种类" tabindex="-1">3. 📒 数据库的种类 <a class="header-anchor" href="#3--数据库的种类" aria-label="Permalink to &quot;3. 📒 数据库的种类&quot;" target="_self" rel="noopener">​</a></h2><ul><li>层次式数据库</li><li>网络式数据库</li><li>关系式数据库</li><li>非关系式数据库</li><li>……</li><li>不同种类的数据库按不同的数据结构来联系和组织。</li></ul><h2 id="4--数据库的一些普遍特点" tabindex="-1">4. 📒 数据库的一些普遍特点 <a class="header-anchor" href="#4--数据库的一些普遍特点" aria-label="Permalink to &quot;4. 📒 数据库的一些普遍特点&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>结构化存储</strong>：数据按照一定的格式进行组织。</li><li><strong>高效查询</strong>：通过 SQL 语言可以快速检索、更新、删除数据。</li><li><strong>安全性高</strong>：支持权限控制，保障数据安全。</li><li><strong>支持事务</strong>：确保多个操作要么全部成功，要么全部失败。</li><li>……</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0003. 什么是“数据库”/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
