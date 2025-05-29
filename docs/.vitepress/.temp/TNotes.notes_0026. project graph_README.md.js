import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0026. project graph","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0026. project graph/README.md","filePath":"TNotes.notes/0026. project graph/README.md"}');
const _sfc_main = { name: "TNotes.notes/0026. project graph/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BilibiliOutsidePlayer = resolveComponent("BilibiliOutsidePlayer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0026-project-graph" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0026.%20project%20graph" target="_self" rel="noopener">0026. project graph</a> <a class="header-anchor" href="#0026-project-graph" aria-label="Permalink to &quot;[0026. project graph](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0026.%20project%20graph)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2>`);
  _push(ssrRenderComponent(_component_BilibiliOutsidePlayer, { id: "BV1W4k7YqEgU" }, null, _parent));
  _push(`<ul><li>视频：基于图论的思维导图开源软件：ProjectGraph 1.0 宣传片 <ul><li>看视频感觉这款软件还行，暂未实际体验过，可以找时间装一下看看效果。</li></ul></li><li><a href="https://space.bilibili.com/480804525" target="_self" rel="noopener">https://space.bilibili.com/480804525</a><ul><li>UP 主首页</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0026. project graph/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
