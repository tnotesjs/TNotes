import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0003. toRef","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0003. toRef/README.md","filePath":"TNotes.vue/0003. toRef/README.md"}');
const _sfc_main = { name: "TNotes.vue/0003. toRef/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0003-toref" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0003.%20toRef" target="_self" rel="noopener">0003. toRef</a> <a class="header-anchor" href="#0003-toref" aria-label="Permalink to &quot;[0003. toRef](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0003.%20toRef)&quot;" target="_self" rel="noopener">​</a></h1><p>pending</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0003. toRef/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
