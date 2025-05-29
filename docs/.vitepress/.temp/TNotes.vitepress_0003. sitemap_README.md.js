import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0003. sitemap","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vitepress/0003. sitemap/README.md","filePath":"TNotes.vitepress/0003. sitemap/README.md"}');
const _sfc_main = { name: "TNotes.vitepress/0003. sitemap/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0003-sitemap" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vitepress/tree/main/notes/0003.%20sitemap" target="_self" rel="noopener">0003. sitemap</a> <a class="header-anchor" href="#0003-sitemap" aria-label="Permalink to &quot;[0003. sitemap](https://github.com/Tdahuyou/TNotes.vitepress/tree/main/notes/0003.%20sitemap)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--references" target="_self" rel="noopener">1. 🔗 References</a></li></ul><h2 id="1--references" tabindex="-1">1. 🔗 References <a class="header-anchor" href="#1--references" aria-label="Permalink to &quot;1. 🔗 References&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary>Details</summary><ul><li><a href="https://www.bing.com/webmasters" target="_self" rel="noopener">https://www.bing.com/webmasters</a><ul><li>Bing Webmaster Tools</li></ul></li><li><a href="https://analytics.google.com/analytics/web/?hl=zh-cn" target="_self" rel="noopener">https://analytics.google.com/analytics/web/?hl=zh-cn</a><ul><li>Google Analytics</li></ul></li><li><a href="https://search.google.com/search-console" target="_self" rel="noopener">https://search.google.com/search-console</a><ul><li>Google Search Console</li></ul></li></ul></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vitepress/0003. sitemap/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
