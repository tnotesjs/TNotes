import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0022. MySQL 8.0 新特性概述","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0022. MySQL 8.0 新特性概述/README.md","filePath":"TNotes.sql/0022. MySQL 8.0 新特性概述/README.md"}');
const _sfc_main = { name: "TNotes.sql/0022. MySQL 8.0 新特性概述/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0022-mysql-80-新特性概述" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0022.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">0022. MySQL 8.0 新特性概述</a> <a class="header-anchor" href="#0022-mysql-80-新特性概述" aria-label="Permalink to &quot;[0022. MySQL 8.0 新特性概述](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0022.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%E6%A6%82%E8%BF%B0)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>学习 MySQL 8.0 的新功能，可以参照官方的相关资料： <ul><li><a href="https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html?tdsourcetag=s_pctim_aiomsg" target="_self" rel="noopener">https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html?tdsourcetag=s_pctim_aiomsg</a></li></ul></li></ul><table tabindex="0"><thead><tr><th>功能类别</th><th>关键改进</th></tr></thead><tbody><tr><td>数据字典与 DDL</td><td>引入事务型数据字典，支持原子 DDL</td></tr><tr><td>安全与账户管理</td><td>支持角色、密码策略、双密码机制</td></tr><tr><td>资源管理</td><td>引入资源组，控制线程资源消耗</td></tr><tr><td>InnoDB 性能</td><td>自增主键持久化、死锁检测优化</td></tr><tr><td>字符集</td><td>默认使用 utf8mb4，支持更多排序规则</td></tr><tr><td>JSON</td><td>增加实用函数和聚合函数</td></tr><tr><td>数据类型默认值</td><td>支持表达式作为默认值</td></tr><tr><td>查询优化</td><td>不可见索引、降序索引</td></tr><tr><td>CTE</td><td>支持递归和非递归公共表表达式</td></tr><tr><td>窗口函数</td><td>支持多种窗口函数，提升分析能力</td></tr><tr><td>统计直方图</td><td>更精准的查询优化器统计</td></tr><tr><td>备份锁</td><td>在线备份期间允许 DML 操作</td></tr></tbody></table><ul><li>如果你正在使用 MySQL 5.7 或更早版本，强烈建议升级到 MySQL 8.0，特别是以下场景： <ul><li>需要更高的安全性和细粒度权限管理</li><li>有复杂的 OLAP 分析需求（窗口函数、CTE）</li><li>需要高可用和一致性保证（原子 DDL、持久化自增）</li><li>使用 JSON 类型字段较多</li><li>想要更好的 Unicode 支持（如 Emoji、中文、日文等）</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0022. MySQL 8.0 新特性概述/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
