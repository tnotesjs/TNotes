import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-21-02-49-44.CBqasb31.png";
const __pageData = JSON.parse('{"title":"0019. 《了不起的Node js 将JavaScript进行到底》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0019. 《了不起的Node js 将JavaScript进行到底》/README.md","filePath":"TNotes.nodejs/0019. 《了不起的Node js 将JavaScript进行到底》/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0019. 《了不起的Node js 将JavaScript进行到底》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0019-了不起的node-js-将javascript进行到底" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0019.%20%E3%80%8A%E4%BA%86%E4%B8%8D%E8%B5%B7%E7%9A%84Node%20js%20%E5%B0%86JavaScript%E8%BF%9B%E8%A1%8C%E5%88%B0%E5%BA%95%E3%80%8B" target="_self" rel="noopener">0019. 《了不起的Node js 将JavaScript进行到底》</a> <a class="header-anchor" href="#0019-了不起的node-js-将javascript进行到底" aria-label="Permalink to &quot;[0019. 《了不起的Node js 将JavaScript进行到底》](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0019.%20%E3%80%8A%E4%BA%86%E4%B8%8D%E8%B5%B7%E7%9A%84Node%20js%20%E5%B0%86JavaScript%E8%BF%9B%E8%A1%8C%E5%88%B0%E5%BA%95%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://book.douban.com/subject/25767596/" target="_self" rel="noopener">https://book.douban.com/subject/25767596/</a><ul><li>豆瓣 - 《了不起的 Node.js》</li></ul></li><li>豆瓣评分： <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>截图时间：<code>24.10.21</code></li></ul></li><li>内容简介 <ul><li>本书是一本经典的 Learning by Doing 的书籍。它由 Node 社区著名的 Socket.IO 作者—— Guillermo Rauch，通过大量的实践案例撰写，并由 Node 社区非常活跃的开发者—— Goddy Zhao 翻译而成。</li><li>本书内容主要由对五大部分的介绍组成： Node 核心设计理念、 Node 核心模块 API、Web 开发、数据库以及测试。从前到后、由表及里地对使用 Node 进行 Web 开发的每一个环节都进行了深入的讲解，并且最大的特点就是通过大量的实际案例、代码展示来剖析技术点，讲解最佳实践。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0019. 《了不起的Node js 将JavaScript进行到底》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
