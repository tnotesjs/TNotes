import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0024. MySQL 8.0 新特性 - 原子数据定义语句","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0024. MySQL 8.0 新特性 - 原子数据定义语句/README.md","filePath":"TNotes.sql/0024. MySQL 8.0 新特性 - 原子数据定义语句/README.md"}');
const _sfc_main = { name: "TNotes.sql/0024. MySQL 8.0 新特性 - 原子数据定义语句/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0024-mysql-80-新特性---原子数据定义语句" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0024.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E5%8E%9F%E5%AD%90%E6%95%B0%E6%8D%AE%E5%AE%9A%E4%B9%89%E8%AF%AD%E5%8F%A5" target="_self" rel="noopener">0024. MySQL 8.0 新特性 - 原子数据定义语句</a> <a class="header-anchor" href="#0024-mysql-80-新特性---原子数据定义语句" aria-label="Permalink to &quot;[0024. MySQL 8.0 新特性 - 原子数据定义语句](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0024.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E5%8E%9F%E5%AD%90%E6%95%B0%E6%8D%AE%E5%AE%9A%E4%B9%89%E8%AF%AD%E5%8F%A5)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>MySQL 8.0 支持原子数据定义语言（DDL）语句。</li><li>此功能称为原子 DDL。</li><li>原子 DDL 语句将与 DDL 操作关联的数据字典更新，存储引擎操作和二进制日志写入组合到单个原子事务中。</li><li>即使服务器在操作期间暂停，也会提交事务，并将适用的更改保留到数据字典、存储引擎和二进制日志，或者回滚事务。</li><li>通过在 MySQL 8.0 中引入 MySQL 数据字典，可以实现原子 DDL。</li><li>在早期的 MySQL 版本中，元数据存储在元数据文件、非事务性表和存储引擎特定的字典中，需要中间提交。</li><li>MySQL 数据字典提供的集中式事务元数据存储消除了这一障碍，使得将 DDL 语句操作重组为原子事务成为可能。</li></ul><p>原子 DDL（Atomic DDL）</p><ul><li><strong>定义</strong>：DDL 操作（如创建、修改、删除表）被封装成一个完整的事务。</li><li><strong>特点</strong>： <ul><li>成功则全部生效，失败则回滚，避免中间状态</li><li>支持事务日志写入，确保崩溃恢复后的一致性</li></ul></li><li><strong>依赖技术</strong>：基于新的事务型数据字典实现</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0024. MySQL 8.0 新特性 - 原子数据定义语句/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
