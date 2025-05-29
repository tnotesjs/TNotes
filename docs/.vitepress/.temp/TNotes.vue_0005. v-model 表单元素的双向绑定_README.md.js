import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0005. v-model 表单元素的双向绑定","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0005. v-model 表单元素的双向绑定/README.md","filePath":"TNotes.vue/0005. v-model 表单元素的双向绑定/README.md"}');
const _sfc_main = { name: "TNotes.vue/0005. v-model 表单元素的双向绑定/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0005-v-model-表单元素的双向绑定" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0005.%20v-model%20%E8%A1%A8%E5%8D%95%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A" target="_self" rel="noopener">0005. v-model 表单元素的双向绑定</a> <a class="header-anchor" href="#0005-v-model-表单元素的双向绑定" aria-label="Permalink to &quot;[0005. v-model 表单元素的双向绑定](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0005.%20v-model%20%E8%A1%A8%E5%8D%95%E5%85%83%E7%B4%A0%E7%9A%84%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A)&quot;" target="_self" rel="noopener">​</a></h1><p>pending</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0005. v-model 表单元素的双向绑定/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
