import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0004. 使用 className 添加样式名","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.react/0004. 使用 className 添加样式名/README.md","filePath":"TNotes.react/0004. 使用 className 添加样式名/README.md"}');
const _sfc_main = { name: "TNotes.react/0004. 使用 className 添加样式名/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0004-使用-classname-添加样式名" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0004.%20%E4%BD%BF%E7%94%A8%20className%20%E6%B7%BB%E5%8A%A0%E6%A0%B7%E5%BC%8F%E5%90%8D" target="_self" rel="noopener">0004. 使用 className 添加样式名</a> <a class="header-anchor" href="#0004-使用-classname-添加样式名" aria-label="Permalink to &quot;[0004. 使用 className 添加样式名](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0004.%20%E4%BD%BF%E7%94%A8%20className%20%E6%B7%BB%E5%8A%A0%E6%A0%B7%E5%BC%8F%E5%90%8D)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1-" target="_self" rel="noopener">1. ⏰</a></li></ul><h2 id="1-" tabindex="-1">1. ⏰ <a class="header-anchor" href="#1-" aria-label="Permalink to &quot;1. ⏰&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.react/0004. 使用 className 添加样式名/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
