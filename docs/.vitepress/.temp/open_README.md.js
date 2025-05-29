import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"👀 README","description":"","frontmatter":{},"headers":[],"relativePath":"open/README.md","filePath":"open/README.md"}');
const _sfc_main = { name: "open/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-readme" tabindex="-1">👀 README <a class="header-anchor" href="#-readme" aria-label="Permalink to &quot;👀 README&quot;" target="_self" rel="noopener">​</a></h1><div class="info custom-block"><p class="custom-block-title">概述</p><p>这一部分会丢一些个人写的开源工具。</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("open/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
