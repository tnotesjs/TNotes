import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0046. AltTab","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0046. AltTab/README.md","filePath":"TNotes.notes/0046. AltTab/README.md"}');
const _sfc_main = { name: "TNotes.notes/0046. AltTab/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0046-alttab" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0046.%20AltTab" target="_self" rel="noopener">0046. AltTab</a> <a class="header-anchor" href="#0046-alttab" aria-label="Permalink to &quot;[0046. AltTab](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0046.%20AltTab)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://alt-tab-macos.netlify.app/" target="_self" rel="noopener">https://alt-tab-macos.netlify.app/</a></li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-24-23-17-18.png" alt="图 0" loading="lazy"></li><li>macOS 上的一款用于切换应用页面窗口的开源工具。</li><li>AltTab 可以让你向在 Windows 中那样，直接通过 <code>Alt Tab</code> 来快速切换不同的应用窗口，并且支持配置。</li><li>目前 <code>25.05</code> 试用下来体验还挺好的。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0046. AltTab/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
