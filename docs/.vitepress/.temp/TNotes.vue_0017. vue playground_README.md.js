import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0017. vue playground","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0017. vue playground/README.md","filePath":"TNotes.vue/0017. vue playground/README.md"}');
const _sfc_main = { name: "TNotes.vue/0017. vue playground/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0017-vue-playground" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0017.%20vue%20playground" target="_self" rel="noopener">0017. vue playground</a> <a class="header-anchor" href="#0017-vue-playground" aria-label="Permalink to &quot;[0017. vue playground](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0017.%20vue%20playground)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://play.vuejs.org/" target="_self" rel="noopener">https://play.vuejs.org/</a><ul><li>Vue Playground，用于在线快速测试一些简单的 Vue demo。</li><li>也可以用于调试 vue-router 的 demo，只需要在 Import Map 中加上 <code>&quot;vue-router&quot;: &quot;https://unpkg.com/vue-router@4.3.0/dist/vue-router.esm-browser.js&quot;,</code> vue-router 的引用即可。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0017. vue playground/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
