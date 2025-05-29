import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0025. 菜鸟教程","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0025. 菜鸟教程/README.md","filePath":"TNotes.nodejs/0025. 菜鸟教程/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0025. 菜鸟教程/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0025-菜鸟教程" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0025.%20%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B" target="_self" rel="noopener">0025. 菜鸟教程</a> <a class="header-anchor" href="#0025-菜鸟教程" aria-label="Permalink to &quot;[0025. 菜鸟教程](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0025.%20%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B-nodejs-%E9%93%BE%E6%8E%A5" target="_self" rel="noopener">1. 🔗 菜鸟教程 nodejs 链接</a></li></ul><h2 id="1--菜鸟教程-nodejs-链接" tabindex="-1">1. 🔗 菜鸟教程 nodejs 链接 <a class="header-anchor" href="#1--菜鸟教程-nodejs-链接" aria-label="Permalink to &quot;1. 🔗 菜鸟教程 nodejs 链接&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://www.runoob.com/nodejs/nodejs-tutorial.html" target="_self" rel="noopener">https://www.runoob.com/nodejs/nodejs-tutorial.html</a><ul><li>菜鸟教程 - nodejs - 在线免费阅读。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0025. 菜鸟教程/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
