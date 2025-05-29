import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0002. 事件","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0002. 事件/README.md","filePath":"TNotes.vue/0002. 事件/README.md"}');
const _sfc_main = { name: "TNotes.vue/0002. 事件/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0002-事件" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0002.%20%E4%BA%8B%E4%BB%B6" target="_self" rel="noopener">0002. 事件</a> <a class="header-anchor" href="#0002-事件" aria-label="Permalink to &quot;[0002. 事件](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0002.%20%E4%BA%8B%E4%BB%B6)&quot;" target="_self" rel="noopener">​</a></h1><p>pending</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0002. 事件/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
