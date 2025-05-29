import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0006. v-on 键盘按键修饰符","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0006. v-on 键盘按键修饰符/README.md","filePath":"TNotes.vue/0006. v-on 键盘按键修饰符/README.md"}');
const _sfc_main = { name: "TNotes.vue/0006. v-on 键盘按键修饰符/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0006-v-on-键盘按键修饰符" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0006.%20v-on%20%E9%94%AE%E7%9B%98%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6" target="_self" rel="noopener">0006. v-on 键盘按键修饰符</a> <a class="header-anchor" href="#0006-v-on-键盘按键修饰符" aria-label="Permalink to &quot;[0006. v-on 键盘按键修饰符](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0006.%20v-on%20%E9%94%AE%E7%9B%98%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)&quot;" target="_self" rel="noopener">​</a></h1><p>pending</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0006. v-on 键盘按键修饰符/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
