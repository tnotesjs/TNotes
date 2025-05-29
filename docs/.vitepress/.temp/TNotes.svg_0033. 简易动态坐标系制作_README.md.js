import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0033. 简易动态坐标系制作","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.svg/0033. 简易动态坐标系制作/README.md","filePath":"TNotes.svg/0033. 简易动态坐标系制作/README.md"}');
const _sfc_main = { name: "TNotes.svg/0033. 简易动态坐标系制作/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0033-简易动态坐标系制作" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.svg/tree/main/notes/0033.%20%E7%AE%80%E6%98%93%E5%8A%A8%E6%80%81%E5%9D%90%E6%A0%87%E7%B3%BB%E5%88%B6%E4%BD%9C" target="_self" rel="noopener">0033. 简易动态坐标系制作</a> <a class="header-anchor" href="#0033-简易动态坐标系制作" aria-label="Permalink to &quot;[0033. 简易动态坐标系制作](https://github.com/Tdahuyou/TNotes.svg/tree/main/notes/0033.%20%E7%AE%80%E6%98%93%E5%8A%A8%E6%80%81%E5%9D%90%E6%A0%87%E7%B3%BB%E5%88%B6%E4%BD%9C)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--notes" target="_self" rel="noopener">1. 📒 notes</a></li></ul><h2 id="1--notes" tabindex="-1">1. 📒 notes <a class="header-anchor" href="#1--notes" aria-label="Permalink to &quot;1. 📒 notes&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.svg/0033. 简易动态坐标系制作/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
