import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-21-02-49-21.C_PiU4sr.png";
const __pageData = JSON.parse('{"title":"0018. 《Node.js开发指南》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0018. 《Node.js开发指南》/README.md","filePath":"TNotes.nodejs/0018. 《Node.js开发指南》/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0018. 《Node.js开发指南》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0018-nodejs开发指南" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0018.%20%E3%80%8ANode.js%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97%E3%80%8B" target="_self" rel="noopener">0018. 《Node.js开发指南》</a> <a class="header-anchor" href="#0018-nodejs开发指南" aria-label="Permalink to &quot;[0018. 《Node.js开发指南》](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0018.%20%E3%80%8ANode.js%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://book.douban.com/subject/30247892/" target="_self" rel="noopener">https://book.douban.com/subject/30247892/</a><ul><li>豆瓣 - 《Node.js 开发指南》</li></ul></li><li>豆瓣评分： <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>截图时间：<code>24.10.21</code></li></ul></li><li>内容简介 <ul><li>Node.js 是一种方兴未艾的新技术，诞生于 2009 年。经过两年的快速变化，Node.js 生态圈已经逐渐走向稳定。Node.js 采用了以往类似语言和框架中非常罕见的技术，总结为关键词就是：非阻塞式控制流、异步 I/O、单线程消息循环。不少开发者在入门时总要经历一个痛苦的思维转变过程，给学习带来巨大的障碍。 而本书的目的就是帮助读者扫清这些障碍，学会使用 Node.js 进行 Web 后端开发，同时掌握事件驱动的异步式编程风格，以便进一步利用 Node.js 的高级特性。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0018. 《Node.js开发指南》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
