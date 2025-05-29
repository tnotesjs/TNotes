import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0018. xxx","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.egg/0018. xxx/README.md","filePath":"TNotes.egg/0018. xxx/README.md"}');
const _sfc_main = { name: "TNotes.egg/0018. xxx/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0018-xxx" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0018.%20xxx" target="_self" rel="noopener">0018. xxx</a> <a class="header-anchor" href="#0018-xxx" aria-label="Permalink to &quot;[0018. xxx](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0018.%20xxx)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--title" target="_self" rel="noopener">1. 📒 title</a></li></ul><h2 id="1--title" tabindex="-1">1. 📒 title <a class="header-anchor" href="#1--title" aria-label="Permalink to &quot;1. 📒 title&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.egg/0018. xxx/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
