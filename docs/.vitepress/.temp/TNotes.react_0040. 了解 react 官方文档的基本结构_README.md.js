import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-12-01-04-11-28.DBV8vbdX.png";
const _imports_1 = "/notes/assets/2024-12-01-02-26-46.B9X-MbFx.png";
const _imports_2 = "/notes/assets/2025-01-17-16-00-13.o68rYU7v.png";
const __pageData = JSON.parse('{"title":"0040. 了解 react 官方文档的基本结构","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.react/0040. 了解 react 官方文档的基本结构/README.md","filePath":"TNotes.react/0040. 了解 react 官方文档的基本结构/README.md"}');
const _sfc_main = { name: "TNotes.react/0040. 了解 react 官方文档的基本结构/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Discussions = resolveComponent("Discussions");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0040-了解-react-官方文档的基本结构" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0040.%20%E4%BA%86%E8%A7%A3%20react%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E7%9A%84%E5%9F%BA%E6%9C%AC%E7%BB%93%E6%9E%84" target="_self" rel="noopener">0040. 了解 react 官方文档的基本结构</a> <a class="header-anchor" href="#0040-了解-react-官方文档的基本结构" aria-label="Permalink to &quot;[0040. 了解 react 官方文档的基本结构](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0040.%20%E4%BA%86%E8%A7%A3%20react%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E7%9A%84%E5%9F%BA%E6%9C%AC%E7%BB%93%E6%9E%84)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--react-%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E7%BB%93%E6%9E%84%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">1. 📒 react 官方文档结构简介</a></li></ul><ul><li><a href="https://react.dev/" target="_self" rel="noopener">https://react.dev/</a><ul><li>react 官网链接</li></ul></li><li>本节对 react 官网的结构做了一个简单的介绍。</li><li>熟悉 react 官方文档的大体结构是非常有必要的，在学习 react 的过程中，会经常查阅官方文档。</li></ul><h2 id="1--react-官方文档结构简介" tabindex="-1">1. 📒 react 官方文档结构简介 <a class="header-anchor" href="#1--react-官方文档结构简介" aria-label="Permalink to &quot;1. 📒 react 官方文档结构简介&quot;" target="_self" rel="noopener">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></p><ul><li>【1】点击 logo 会跳转到 react 首页。 <ul><li>首页提供了 React 的简介信息，包括： <ul><li>React 的主要特点</li><li>React 都能用来做什么事儿</li><li>React 有多么受欢迎</li></ul></li></ul></li><li>【2】点击 logo 旁边的版本号，可查看 react 的历史版本。 <ul><li>这里边包含了一系列的 react 版本。从 <code>v0.3.0 (May 2013)</code> 开始一直到目前的最新版。</li><li><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></li><li>用于了解每个版本的变更和新特性。</li><li><strong>🤔 什么时候我们可能会查阅这部分内容呢？</strong></li><li>当你用到的 react 版本和官方最新版不一致的时候。</li><li>比如你在看某人的 react 视频教程或者 react 相关书籍等其他 react 学习资料，但是你发现你所看的 react 资料的版本（比如是 react v18）和当前（2025年1月17日）官网的最新版（react v19）不一致，那么你可能需要查阅旧版本的文档。在这里边你可以切换到之前的任意版本，确保版本的一致性。</li></ul></li><li>【3】搜索区，可通过 cmd/ctrl K 来搜索官方文档中的相关内容。</li><li>【4】教程区 <ul><li>这里边包括一系列逐步指导的教程，帮助初学者从零开始构建 React 应用程序。</li><li><strong>该教程中介绍的内容涵盖了日常开发中会用到的 <code>80%</code> 的知识点。</strong></li><li><code>80%</code> 不是乱说的，是官方的原话： <ul><li><img${ssrRenderAttr("src", _imports_2)} alt="" loading="lazy"></li><li>实际上在开发 react 项目时，最常用到的知识点确实也就是官方文档提到的这么一些点了。 <ul><li>How to create and nest components</li><li>How to add markup and styles</li><li>How to display data</li><li>How to render conditions and lists</li><li>How to respond to events and update the screen</li><li>How to share data between components</li></ul></li><li>在上手 react 项目之前，掌握这些要点是必要的。</li></ul></li></ul></li><li>【5】参考区：用于查阅的详细的 API 文档。</li><li>【6】React 开发者社区</li><li>【7】React 博客：用于发布一些重要通知。</li><li>【8】主题切换：亮色/暗色</li><li>【9】语言切换：英文/中文/……</li><li>【10】github 链接：<a href="https://github.com/facebook/react/releases" target="_self" rel="noopener">https://github.com/facebook/react/releases</a></li></ul>`);
  _push(ssrRenderComponent(_component_Discussions, { id: "react.0040" }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.react/0040. 了解 react 官方文档的基本结构/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
