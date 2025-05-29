import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-21-02-47-55.DsuK6PMz.png";
const __pageData = JSON.parse('{"title":"0017. 《Node与Express开发》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0017. 《Node与Express开发》/README.md","filePath":"TNotes.nodejs/0017. 《Node与Express开发》/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0017. 《Node与Express开发》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0017-node与express开发" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0017.%20%E3%80%8ANode%E4%B8%8EExpress%E5%BC%80%E5%8F%91%E3%80%8B" target="_self" rel="noopener">0017. 《Node与Express开发》</a> <a class="header-anchor" href="#0017-node与express开发" aria-label="Permalink to &quot;[0017. 《Node与Express开发》](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0017.%20%E3%80%8ANode%E4%B8%8EExpress%E5%BC%80%E5%8F%91%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://book.douban.com/subject/26301434/" target="_self" rel="noopener">https://book.douban.com/subject/26301434/</a><ul><li>豆瓣 - 《Node 与 Express 开发》</li></ul></li><li>豆瓣评分： <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>截图时间：<code>24.10.21</code></li></ul></li><li>内容简介 <ul><li>本书系统讲解了使用 Express 开发动态 Web 应用的流程和步骤。作者不仅讲授了开发公共站点及 REST API 的基础知识，同时还讲解了构建单页、多页及混合 Web 应用的规划方式及最佳实践。具体而言，第 1~5 章介绍 Node 和 Express，搭建一个示例网站的骨架，讨论测试和 QA。第 6~12 章介绍 Node 中更重要的结构，讲解模板，介绍 cookies、会话和表单处理器，探讨中间件以及从服务器发送电子邮件。第 13~15 章讨论持久化、URL 路由、API 的编写、流行的 MVC 范式。第 18~22 章讨论安全、社交媒体集成以及网站的调试、启用和维护。</li><li>本书适合所有前端和后端开发人员阅读。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0017. 《Node与Express开发》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
