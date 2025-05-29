import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0001. 泛型工具","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.typescript/0001. 泛型工具/README.md","filePath":"TNotes.typescript/0001. 泛型工具/README.md"}');
const _sfc_main = { name: "TNotes.typescript/0001. 泛型工具/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0001-泛型工具" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.typescript/tree/main/notes/0001.%20%E6%B3%9B%E5%9E%8B%E5%B7%A5%E5%85%B7" target="_self" rel="noopener">0001. 泛型工具</a> <a class="header-anchor" href="#0001-泛型工具" aria-label="Permalink to &quot;[0001. 泛型工具](https://github.com/Tdahuyou/TNotes.typescript/tree/main/notes/0001.%20%E6%B3%9B%E5%9E%8B%E5%B7%A5%E5%85%B7)&quot;" target="_self" rel="noopener">​</a></h1><ul><li>⏰ TODO</li></ul><h2 id="-notes" tabindex="-1">📒 notes <a class="header-anchor" href="#-notes" aria-label="Permalink to &quot;📒 notes&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.typescript/0001. 泛型工具/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
