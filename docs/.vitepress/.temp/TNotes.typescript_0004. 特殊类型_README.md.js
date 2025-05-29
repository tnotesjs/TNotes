import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0004. 特殊类型","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.typescript/0004. 特殊类型/README.md","filePath":"TNotes.typescript/0004. 特殊类型/README.md"}');
const _sfc_main = { name: "TNotes.typescript/0004. 特殊类型/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0004-特殊类型" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.typescript/tree/main/notes/0004.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B" target="_self" rel="noopener">0004. 特殊类型</a> <a class="header-anchor" href="#0004-特殊类型" aria-label="Permalink to &quot;[0004. 特殊类型](https://github.com/Tdahuyou/TNotes.typescript/tree/main/notes/0004.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li>⏰ TODO</li></ul><h2 id="-notes" tabindex="-1">📒 notes <a class="header-anchor" href="#-notes" aria-label="Permalink to &quot;📒 notes&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.typescript/0004. 特殊类型/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
