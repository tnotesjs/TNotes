import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0029. 固定的标签换行展示","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0029. 固定的标签换行展示/README.md","filePath":"TNotes.notes/0029. 固定的标签换行展示/README.md"}');
const _sfc_main = { name: "TNotes.notes/0029. 固定的标签换行展示/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0029-固定的标签换行展示" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0029.%20%E5%9B%BA%E5%AE%9A%E7%9A%84%E6%A0%87%E7%AD%BE%E6%8D%A2%E8%A1%8C%E5%B1%95%E7%A4%BA" target="_self" rel="noopener">0029. 固定的标签换行展示</a> <a class="header-anchor" href="#0029-固定的标签换行展示" aria-label="Permalink to &quot;[0029. 固定的标签换行展示](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0029.%20%E5%9B%BA%E5%AE%9A%E7%9A%84%E6%A0%87%E7%AD%BE%E6%8D%A2%E8%A1%8C%E5%B1%95%E7%A4%BA)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E5%9B%BA%E5%AE%9A%E7%9A%84%E6%A0%87%E7%AD%BE%E6%8D%A2%E8%A1%8C%E5%B1%95%E7%A4%BA" target="_self" rel="noopener">2. 📒 固定的标签换行展示</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>介绍了如何在 vsocde 中，将固定的 tab 和非固定的 tab 换行显示的配置，以及换行显示的应用场景。</li></ul><h2 id="2--固定的标签换行展示" tabindex="-1">2. 📒 固定的标签换行展示 <a class="header-anchor" href="#2--固定的标签换行展示" aria-label="Permalink to &quot;2. 📒 固定的标签换行展示&quot;" target="_self" rel="noopener">​</a></h2><ul><li>在配置中，找到 <code>Wrokbench &gt; Editor: Pinned Tabs On Separate Row</code>，将其勾选上。这可以让固定的标签展示在非固定标签的上边，可以更方便地管理固定的标签。 <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-09-22-50-28.png" alt="" loading="lazy"></li></ul></li><li>在阅读一些大型项目的源码时，通常会将一些比较重要的模块设置为固定标签，以防不小心被关闭掉。</li><li>如果想要将不重要的标签给关闭掉，可以使用快捷键 <code>cmd k cmd w</code> （macOS） <code>ctrl k ctrl w</code> （windows） 来关闭，这不会对固定标签有影响。</li><li><strong>拖拽</strong>：将非固定的标签拖到固定标签所在的行，非固定标签就自动转为固定标签。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0029. 固定的标签换行展示/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
