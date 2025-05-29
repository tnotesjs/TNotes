import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0026. nodejs 官方文档","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0026. nodejs 官方文档/README.md","filePath":"TNotes.nodejs/0026. nodejs 官方文档/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0026. nodejs 官方文档/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0026-nodejs-官方文档" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0026.%20nodejs%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3" target="_self" rel="noopener">0026. nodejs 官方文档</a> <a class="header-anchor" href="#0026-nodejs-官方文档" aria-label="Permalink to &quot;[0026. nodejs 官方文档](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0026.%20nodejs%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--nodejs-%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E9%93%BE%E6%8E%A5" target="_self" rel="noopener">1. 🔗 nodejs 官方文档链接</a></li><li><a href="#2--todo" target="_self" rel="noopener">2. ⏰ TODO</a></li></ul><h2 id="1--nodejs-官方文档链接" tabindex="-1">1. 🔗 nodejs 官方文档链接 <a class="header-anchor" href="#1--nodejs-官方文档链接" aria-label="Permalink to &quot;1. 🔗 nodejs 官方文档链接&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://nodejs.org/en" target="_self" rel="noopener">https://nodejs.org/en</a></li><li>这是 NodeJS 官方文档</li><li>有 Simplified Chinese 中文版，正在逐步支持中。 <ul><li>其中大部分内容还是英文的。</li></ul></li></ul><h2 id="2--todo" tabindex="-1">2. ⏰ TODO <a class="header-anchor" href="#2--todo" aria-label="Permalink to &quot;2. ⏰ TODO&quot;" target="_self" rel="noopener">​</a></h2><ul><li>⏰ 过一遍官方文档，在笔记中记录文档的大体结构，以便后续查阅。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0026. nodejs 官方文档/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
