import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0012. 内置组件 keep-alive","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0012. 内置组件 keep-alive/README.md","filePath":"TNotes.vue/0012. 内置组件 keep-alive/README.md"}');
const _sfc_main = { name: "TNotes.vue/0012. 内置组件 keep-alive/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0012-内置组件-keep-alive" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0012.%20%E5%86%85%E7%BD%AE%E7%BB%84%E4%BB%B6%20keep-alive" target="_self" rel="noopener">0012. 内置组件 keep-alive</a> <a class="header-anchor" href="#0012-内置组件-keep-alive" aria-label="Permalink to &quot;[0012. 内置组件 keep-alive](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0012.%20%E5%86%85%E7%BD%AE%E7%BB%84%E4%BB%B6%20keep-alive)&quot;" target="_self" rel="noopener">​</a></h1><p>pending</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0012. 内置组件 keep-alive/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
