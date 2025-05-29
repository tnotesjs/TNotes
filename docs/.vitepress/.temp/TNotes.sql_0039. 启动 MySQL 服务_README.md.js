import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0039. 启动 MySQL 服务","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0039. 启动 MySQL 服务/README.md","filePath":"TNotes.sql/0039. 启动 MySQL 服务/README.md"}');
const _sfc_main = { name: "TNotes.sql/0039. 启动 MySQL 服务/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0039-启动-mysql-服务" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0039.%20%E5%90%AF%E5%8A%A8%20MySQL%20%E6%9C%8D%E5%8A%A1" target="_self" rel="noopener">0039. 启动 MySQL 服务</a> <a class="header-anchor" href="#0039-启动-mysql-服务" aria-label="Permalink to &quot;[0039. 启动 MySQL 服务](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0039.%20%E5%90%AF%E5%8A%A8%20MySQL%20%E6%9C%8D%E5%8A%A1)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>macOS 环境的基本操作流程： <ul><li>检查是否已经安装了 mysql： <ul><li><code>which mysql</code><ul><li>打印 mysql 的安装位置</li></ul></li><li><code>mysql --version</code><ul><li>打印 mysql 的版本信息</li></ul></li></ul></li><li>连接 mysql 服务器： <ul><li><code>mysql -u root -p</code><ul><li>这是一条用于连接 MySQL 数据库服务器的命令，常用于登录数据库并进行操作。</li><li><code>mysql</code> MySQL 提供的客户端命令行工具，用于与 MySQL 服务器交互。</li><li><code>-u root</code> 指定以用户名为 root 的身份登录（-u 表示 user）。</li><li><code>-p</code> 表示需要输入密码（password）进行认证。</li></ul></li></ul></li><li>输入正确的密码后，将进入 MySQL 的交互式命令行界面： <ul><li><code>mysql&gt;</code></li><li>接下来你就可以自由输入 mysql 命令来和数据库之间进行交互了。</li></ul></li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-21-20-25-58.png" alt="图 1" loading="lazy"></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0039. 启动 MySQL 服务/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
