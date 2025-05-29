import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0114. empty","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0114. __empty__/README.md","filePath":"TNotes.html-css-js/0114. __empty__/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0114. __empty__/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0114-empty" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0114.%20__empty__" target="_self" rel="noopener">0114. <strong>empty</strong></a> <a class="header-anchor" href="#0114-empty" aria-label="Permalink to &quot;[0114. __empty__](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0114.%20__empty__)&quot;" target="_self" rel="noopener">​</a></h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0114. __empty__/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
