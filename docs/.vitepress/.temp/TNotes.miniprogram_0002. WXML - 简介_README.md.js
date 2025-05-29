import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0002. WXML - 简介","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.miniprogram/0002. WXML - 简介/README.md","filePath":"TNotes.miniprogram/0002. WXML - 简介/README.md"}');
const _sfc_main = { name: "TNotes.miniprogram/0002. WXML - 简介/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0002-wxml---简介" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0002.%20WXML%20-%20%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">0002. WXML - 简介</a> <a class="header-anchor" href="#0002-wxml---简介" aria-label="Permalink to &quot;[0002. WXML - 简介](https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0002.%20WXML%20-%20%E7%AE%80%E4%BB%8B)&quot;" target="_self" rel="noopener">​</a></h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.miniprogram/0002. WXML - 简介/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
