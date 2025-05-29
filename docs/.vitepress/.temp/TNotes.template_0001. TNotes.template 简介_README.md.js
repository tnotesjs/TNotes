import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0001. TNotes.template 简介","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.template/0001. TNotes.template 简介/README.md","filePath":"TNotes.template/0001. TNotes.template 简介/README.md"}');
const _sfc_main = { name: "TNotes.template/0001. TNotes.template 简介/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0001-tnotestemplate-简介" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0001.%20TNotes.template%20%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">0001. TNotes.template 简介</a> <a class="header-anchor" href="#0001-tnotestemplate-简介" aria-label="Permalink to &quot;[0001. TNotes.template 简介](https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0001.%20TNotes.template%20%E7%AE%80%E4%BB%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">1. 📒 简介</a></li></ul><h2 id="1--简介" tabindex="-1">1. 📒 简介 <a class="header-anchor" href="#1--简介" aria-label="Permalink to &quot;1. 📒 简介&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>TNotes.template</code> 是一个开源的笔记模板，基于 <a href="https://github.com/vuejs/vitepress" target="_self" rel="noopener">vitepress</a> 实现的一个快速搭建个人知识库的工具。</li></ul><div class="info custom-block"><p class="custom-block-title">初版</p><ul><li>目前 <code>2025 年 3 月 2 日 01:54:18</code> 发了初版，先自行体验一段时间看看效果。</li><li>计划： <ul><li>先按照 <code>TNotes</code> 笔记编写规范整理一些个人的学习笔记。</li><li>再完善文档。</li></ul></li></ul></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.template/0001. TNotes.template 简介/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
