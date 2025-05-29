import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-20-08-21-11.LSVEo-7n.png";
const __pageData = JSON.parse('{"title":"0053. canvas 在线学习 - html5canvas tutorials","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.canvas/0053. canvas 在线学习 - html5canvas tutorials/README.md","filePath":"TNotes.canvas/0053. canvas 在线学习 - html5canvas tutorials/README.md"}');
const _sfc_main = { name: "TNotes.canvas/0053. canvas 在线学习 - html5canvas tutorials/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0053-canvas-在线学习---html5canvas-tutorials" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0053.%20canvas%20%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%20-%20html5canvas%20tutorials" target="_self" rel="noopener">0053. canvas 在线学习 - html5canvas tutorials</a> <a class="header-anchor" href="#0053-canvas-在线学习---html5canvas-tutorials" aria-label="Permalink to &quot;[0053. canvas 在线学习 - html5canvas tutorials](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0053.%20canvas%20%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%20-%20html5canvas%20tutorials)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">1. 📝 简介</a></li><li><a href="#2--links" target="_self" rel="noopener">2. 🔗 links</a></li></ul><h2 id="1--简介" tabindex="-1">1. 📝 简介 <a class="header-anchor" href="#1--简介" aria-label="Permalink to &quot;1. 📝 简介&quot;" target="_self" rel="noopener">​</a></h2><p>记录了一个 canvas 在线学习站点 - html5canvas tutorials。</p><div class="note custom-block github-alert"><p class="custom-block-title">NOTE</p><p><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"> 目前（24.10.20）站点突然访问不了了，提示协议不受支持。</p></div><h2 id="2--links" tabindex="-1">2. 🔗 links <a class="header-anchor" href="#2--links" aria-label="Permalink to &quot;2. 🔗 links&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://www.html5canvastutorials.com/" target="_self" rel="noopener">https://www.html5canvastutorials.com/</a><ul><li>html5canvas tutorials。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.canvas/0053. canvas 在线学习 - html5canvas tutorials/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
