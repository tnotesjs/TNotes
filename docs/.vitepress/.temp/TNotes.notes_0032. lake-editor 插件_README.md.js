import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0032. lake-editor 插件","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0032. lake-editor 插件/README.md","filePath":"TNotes.notes/0032. lake-editor 插件/README.md"}');
const _sfc_main = { name: "TNotes.notes/0032. lake-editor 插件/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0032-lake-editor-插件" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0032.%20lake-editor%20%E6%8F%92%E4%BB%B6" target="_self" rel="noopener">0032. lake-editor 插件</a> <a class="header-anchor" href="#0032-lake-editor-插件" aria-label="Permalink to &quot;[0032. lake-editor 插件](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0032.%20lake-editor%20%E6%8F%92%E4%BB%B6)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--lake-editor-%E6%8F%92%E4%BB%B6%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">2. 📒 lake-editor 插件简介</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>介绍了一款在 vsocde 中编写语雀文档的插件。</li></ul><h2 id="2--lake-editor-插件简介" tabindex="-1">2. 📒 lake-editor 插件简介 <a class="header-anchor" href="#2--lake-editor-插件简介" aria-label="Permalink to &quot;2. 📒 lake-editor 插件简介&quot;" target="_self" rel="noopener">​</a></h2><ul><li>lake-editor 插件 <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-11-17-22-15-01.png" alt="" loading="lazy"></li></ul></li><li>问：lake-editor 有啥用？ <ul><li>官方描述：use yuque editor edit local lake file and lakebook viewer</li><li>lake-editor 可以让你在本地能够使用语雀可视化编辑器，并且编写的内容能够直接搬运到语雀文档中，不会破坏原有的样式、格式。</li></ul></li><li>使用流程： <ul><li>在 VSCode 中搜索 lake-editor 插件并安装好。</li><li>在本地新建一个 .lake 文件，比如 <code>1.lake</code>。</li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-11-17-22-16-24.png" alt="" loading="lazy"></li></ul></li><li>使用评价： <ul><li>功能阉割：有很多功能是不支持的，比如插入图片、附件……。</li><li>使用场景：如果仅仅是处理一些简单的文本编辑需求，勉强还是可以用一下的。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0032. lake-editor 插件/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
