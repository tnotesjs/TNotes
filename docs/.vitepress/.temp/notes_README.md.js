import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"👀 README","description":"","frontmatter":{},"headers":[],"relativePath":"notes/README.md","filePath":"notes/README.md"}');
const _sfc_main = { name: "notes/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TNotesDir = resolveComponent("TNotesDir");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-readme" tabindex="-1">👀 README <a class="header-anchor" href="#-readme" aria-label="Permalink to &quot;👀 README&quot;" target="_self" rel="noopener">​</a></h1><div class="info custom-block"><p class="custom-block-title">notes 概述</p><ul><li>存放个人的一些学习笔记，这些笔记都丢到了 github 上，若有需要可自行 clone。</li><li><strong>目前（25.01）正在逐步搬运个人的学习笔记到 TNotes 中。</strong><ul><li>已完成搬运的，会在对应的笔记标题前边 ✅ 打勾。</li></ul></li><li>笔记大纲的头部有“思维导图”的按钮，点击后会自动复制笔记大纲并打开 m2mm，在 m2mm 中 paste 粘贴剪切板中的笔记大纲，即可生成思维导图。</li></ul></div>`);
  _push(ssrRenderComponent(_component_TNotesDir, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
