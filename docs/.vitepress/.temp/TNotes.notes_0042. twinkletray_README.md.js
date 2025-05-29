import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0042. twinkletray","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0042. twinkletray/README.md","filePath":"TNotes.notes/0042. twinkletray/README.md"}');
const _sfc_main = { name: "TNotes.notes/0042. twinkletray/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0042-twinkletray" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0042.%20twinkletray" target="_self" rel="noopener">0042. twinkletray</a> <a class="header-anchor" href="#0042-twinkletray" aria-label="Permalink to &quot;[0042. twinkletray](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0042.%20twinkletray)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://twinkletray.com/" target="_self" rel="noopener">https://twinkletray.com/</a><ul><li>官网</li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-06-19-50-48.png" alt="图 0" loading="lazy"></li></ul></li><li><a href="https://github.com/xanderfrangos/twinkle-tray" target="_self" rel="noopener">https://github.com/xanderfrangos/twinkle-tray</a><ul><li>github</li></ul></li><li>这是 Windows 端的一款免费工具，用于调节多显示器的亮度。</li><li>目前 <code>25.05</code> 正在用，感觉非常好用，界面及其简洁，操作也非常方便。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0042. twinkletray/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
