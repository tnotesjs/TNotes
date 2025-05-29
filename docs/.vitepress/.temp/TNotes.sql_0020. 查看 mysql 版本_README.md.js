import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0020. 查看 mysql 版本","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0020. 查看 mysql 版本/README.md","filePath":"TNotes.sql/0020. 查看 mysql 版本/README.md"}');
const _sfc_main = { name: "TNotes.sql/0020. 查看 mysql 版本/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0020-查看-mysql-版本" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0020.%20%E6%9F%A5%E7%9C%8B%20mysql%20%E7%89%88%E6%9C%AC" target="_self" rel="noopener">0020. 查看 mysql 版本</a> <a class="header-anchor" href="#0020-查看-mysql-版本" aria-label="Permalink to &quot;[0020. 查看 mysql 版本](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0020.%20%E6%9F%A5%E7%9C%8B%20mysql%20%E7%89%88%E6%9C%AC)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>mysql --version</code><ul><li>你可以通过这条命令查看 MySQL 的版本信息。</li><li>这也是 <strong>经常被用来检测当前设备是否安装了 mysql 的一种方式</strong>。 <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-17-08-40-27.png" alt="图 0" loading="lazy"></li><li>如果打印了 mysql 的版本信息，那么说明已经安装好了 mysql。 <ul><li>版本信息：<code>mysql Ver 8.0.33 for macos13 on arm64 (MySQL Community Server - GPL)</code></li></ul></li></ul></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0020. 查看 mysql 版本/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
