import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/cover-image-2.png";
const __pageData = JSON.parse('{"title":"What is TNotes?","description":"","frontmatter":{},"headers":[],"relativePath":"README.md","filePath":"README.md"}');
const _sfc_main = { name: "README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="what-is-tnotes" tabindex="-1">What is TNotes? <a class="header-anchor" href="#what-is-tnotes" aria-label="Permalink to &quot;What is TNotes?&quot;" target="_self" rel="noopener">​</a></h1><img${ssrRenderAttr("src", _imports_0)} alt="foot print" title="TNotes logo" style="${ssrRenderStyle({ "display": "block", "margin": "auto", "width": "50%" })}"><ul><li>TNotes（Tdahuyou の Notes）是一个“<strong>在线开源知识库</strong>”。</li><li>TNotes 是一个基于开源项目和免费工具（比如：<a href="https://pages.github.com/" target="_self" rel="noopener">github pages</a>、<a href="https://vitepress.dev/" target="_self" rel="noopener">vitepress</a>、<a href="https://giscus.app/zh-CN" target="_self" rel="noopener">giscus</a>、<a href="https://github.com/markdown-it/markdown-it" target="_self" rel="noopener">markdown-it</a> ……）搭建的个人笔记平台。</li><li>TNotes 中汇总了个人写的一些笔记内容，以便满足查阅和分享的需求。</li><li>但凡是在 TNotes 中能看到的内容，均已开源在 <a href="https://github.com/Tdahuyou" target="_self" rel="noopener">github</a> 上。</li><li>TNotes 诞生时间：<code>24.08.28</code>。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
