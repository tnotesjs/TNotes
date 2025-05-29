import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-21-02-35-32.DxB_ticD.png";
const __pageData = JSON.parse('{"title":"0015. 《深入浅出 Node.js》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0015. 《深入浅出 Node.js》/README.md","filePath":"TNotes.nodejs/0015. 《深入浅出 Node.js》/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0015. 《深入浅出 Node.js》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0015-深入浅出-nodejs" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0015.%20%E3%80%8A%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Node.js%E3%80%8B" target="_self" rel="noopener">0015. 《深入浅出 Node.js》</a> <a class="header-anchor" href="#0015-深入浅出-nodejs" aria-label="Permalink to &quot;[0015. 《深入浅出 Node.js》](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0015.%20%E3%80%8A%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Node.js%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://book.douban.com/subject/25768396/" target="_self" rel="noopener">https://book.douban.com/subject/25768396/</a><ul><li>豆瓣 - 深入浅出 Node.js</li></ul></li><li>《深入浅出 Node.js》 这本书看过一部分，它是 13 年出版的，即便是放到现在来看，依旧能学到不少内容。</li><li>豆瓣评分： <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>截图时间：<code>24.10.21</code></li></ul></li><li>内容简介 <ul><li>本书从不同的视角介绍了 Node 内在的特点和结构。由首章 Node 介绍为索引，涉及 Node 的各个方面，主要内容包含模块机制的揭示、异步 I/O 实现原理的展现、异步编程的探讨、内存控制的介绍、二进制数据 Buffer 的细节、Node 中的网络编程基础、Node 中的 Web 开发、进程间的消息传递、Node 测试以及通过 Node 构建产品需要的注意事项。最后的附录介绍了 Node 的安装、调试、编码规范和 NPM 仓库等事宜。</li><li>本书适合想深入了解 Node 的人员阅读。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0015. 《深入浅出 Node.js》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
