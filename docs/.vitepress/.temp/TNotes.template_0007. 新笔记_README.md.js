import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0007. 新笔记","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.template/0007. 新笔记/README.md","filePath":"TNotes.template/0007. 新笔记/README.md"}');
const _sfc_main = { name: "TNotes.template/0007. 新笔记/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0007-新笔记" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0007.%20%E6%96%B0%E7%AC%94%E8%AE%B0" target="_self" rel="noopener">0007. 新笔记</a> <a class="header-anchor" href="#0007-新笔记" aria-label="Permalink to &quot;[0007. 新笔记](https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0007.%20%E6%96%B0%E7%AC%94%E8%AE%B0)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--notes_title" target="_self" rel="noopener">1. 📒 notes_title</a></li></ul><h2 id="1--notes_title" tabindex="-1">1. 📒 notes_title <a class="header-anchor" href="#1--notes_title" aria-label="Permalink to &quot;1. 📒 notes_title&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.template/0007. 新笔记/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
