import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0003. mermaid 图表","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.template/0003. mermaid 图表/README.md","filePath":"TNotes.template/0003. mermaid 图表/README.md"}');
const _sfc_main = { name: "TNotes.template/0003. mermaid 图表/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0003-mermaid-图表" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0003.%20mermaid%20%E5%9B%BE%E8%A1%A8" target="_self" rel="noopener">0003. mermaid 图表</a> <a class="header-anchor" href="#0003-mermaid-图表" aria-label="Permalink to &quot;[0003. mermaid 图表](https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0003.%20mermaid%20%E5%9B%BE%E8%A1%A8)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--vitepress-plugin-mermaid-github-pages" target="_self" rel="noopener">1. 🔗 vitepress-plugin-mermaid github-pages</a></li><li><a href="#2--%E6%B5%8B%E8%AF%95-mermaid-%E7%9A%84%E6%B8%B2%E6%9F%93" target="_self" rel="noopener">2. 💻 测试 mermaid 的渲染</a></li></ul><h2 id="1--vitepress-plugin-mermaid-github-pages" tabindex="-1">1. 🔗 vitepress-plugin-mermaid github-pages <a class="header-anchor" href="#1--vitepress-plugin-mermaid-github-pages" aria-label="Permalink to &quot;1. 🔗 vitepress-plugin-mermaid github-pages&quot;" target="_self" rel="noopener">​</a></h2><p><a href="https://emersonbottero.github.io/vitepress-plugin-mermaid/" target="_self" rel="noopener">https://emersonbottero.github.io/vitepress-plugin-mermaid/</a></p><h2 id="2--测试-mermaid-的渲染" tabindex="-1">2. 💻 测试 mermaid 的渲染 <a class="header-anchor" href="#2--测试-mermaid-的渲染" aria-label="Permalink to &quot;2. 💻 测试 mermaid 的渲染&quot;" target="_self" rel="noopener">​</a></h2><p>Code with \`\`\`mmd</p><div class="language-mermaid vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">flowchart LR</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  Start --&gt; Stop</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Visualize with \`\`\`mermai</p>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-33",
        class: "mermaid my-class",
        graph: "flowchart%20LR%0A%20%20Start%20--%3E%20Stop%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.template/0003. mermaid 图表/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
