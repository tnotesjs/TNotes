import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0026. mermaid 相关链接","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0026. mermaid 相关链接/README.md","filePath":"TNotes.notes/0026. mermaid 相关链接/README.md"}');
const _sfc_main = { name: "TNotes.notes/0026. mermaid 相关链接/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0026-mermaid-相关链接" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0026.%20mermaid%20%E7%9B%B8%E5%85%B3%E9%93%BE%E6%8E%A5" target="_self" rel="noopener">0026. mermaid 相关链接</a> <a class="header-anchor" href="#0026-mermaid-相关链接" aria-label="Permalink to &quot;[0026. mermaid 相关链接](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0026.%20mermaid%20%E7%9B%B8%E5%85%B3%E9%93%BE%E6%8E%A5)&quot;" target="_self" rel="noopener">​</a></h1><ul><li>记录了 mermaid 官方文档和 GitHub 社区链接，以便快速访问图表库的资源和支持。</li><li><a href="https://mermaid.js.org/" target="_self" rel="noopener">https://mermaid.js.org/</a><ul><li>mermaid 官方文档。</li></ul></li><li><a href="https://github.com/mermaid-js" target="_self" rel="noopener">https://github.com/mermaid-js</a><ul><li>github</li><li>mermaid js 社区。</li></ul></li><li><a href="https://github.com/mermaid-js/mermaid" target="_self" rel="noopener">https://github.com/mermaid-js/mermaid</a><ul><li>github mermaid.js 源码仓库</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0026. mermaid 相关链接/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
