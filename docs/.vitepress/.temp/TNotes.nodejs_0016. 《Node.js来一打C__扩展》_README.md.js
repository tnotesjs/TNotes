import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-21-02-40-33.ChdGX7IA.png";
const __pageData = JSON.parse('{"title":"0016. 《Node.js来一打C++扩展》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0016. 《Node.js来一打C++扩展》/README.md","filePath":"TNotes.nodejs/0016. 《Node.js来一打C++扩展》/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0016. 《Node.js来一打C++扩展》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0016-nodejs来一打c扩展" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0016.%20%E3%80%8ANode.js%E6%9D%A5%E4%B8%80%E6%89%93C%2B%2B%E6%89%A9%E5%B1%95%E3%80%8B" target="_self" rel="noopener">0016. 《Node.js来一打C++扩展》</a> <a class="header-anchor" href="#0016-nodejs来一打c扩展" aria-label="Permalink to &quot;[0016. 《Node.js来一打C++扩展》](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0016.%20%E3%80%8ANode.js%E6%9D%A5%E4%B8%80%E6%89%93C%2B%2B%E6%89%A9%E5%B1%95%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://book.douban.com/subject/30247892/" target="_self" rel="noopener">https://book.douban.com/subject/30247892/</a><ul><li>豆瓣 - 《Node.js 来一打 C++扩展》</li></ul></li><li>豆瓣评分： <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>截图时间：<code>24.10.21</code></li></ul></li><li>内容简介 <ul><li>Node.js 作为近几年新兴的一种编程运行时，托 V8 引擎的福，在作为后端服务时有比较高的运行效率，在很多场景下对于我们的日常开发足够用了。不过，它还为开发者开了一个使用 C++ 开发 Node.js 原生扩展的口子，让开发者进行项目开发时有了更多的选择。</li><li>《Node.js：来一打 C++ 扩展》以 Chrome V8 的知识作为基础，配合 GYP 的一些内容，将教会大家如何使用 Node.js 提供的一些 API 来编写其 C++ 的原生扩展。此外，在后续的进阶章节中，还会介绍原生抽象 NAN 以及与异步相关的 libuv 知识，最后辅以几个实例来加深理解。不过，在学习本书内容之前，希望读者已经具备了初步的 Node.js 以及 C++ 基础。</li><li>阅读《Node.js：来一打 C++ 扩展》，相当于同时学习 Chrome V8 开发、libuv 开发以及 Node.js 的原生 C++ 扩展开发知识，非常值得！</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0016. 《Node.js来一打C++扩展》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
