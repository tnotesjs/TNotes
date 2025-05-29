import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0005. WXML - 列表渲染","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.miniprogram/0005. WXML - 列表渲染/README.md","filePath":"TNotes.miniprogram/0005. WXML - 列表渲染/README.md"}');
const _sfc_main = { name: "TNotes.miniprogram/0005. WXML - 列表渲染/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0005-wxml---列表渲染" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0005.%20WXML%20-%20%E5%88%97%E8%A1%A8%E6%B8%B2%E6%9F%93" target="_self" rel="noopener">0005. WXML - 列表渲染</a> <a class="header-anchor" href="#0005-wxml---列表渲染" aria-label="Permalink to &quot;[0005. WXML - 列表渲染](https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0005.%20WXML%20-%20%E5%88%97%E8%A1%A8%E6%B8%B2%E6%9F%93)&quot;" target="_self" rel="noopener">​</a></h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.miniprogram/0005. WXML - 列表渲染/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
