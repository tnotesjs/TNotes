import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0020. 术语","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0020. 术语/README.md","filePath":"TNotes.vue/0020. 术语/README.md"}');
const _sfc_main = { name: "TNotes.vue/0020. 术语/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0020-术语" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0020.%20%E6%9C%AF%E8%AF%AD" target="_self" rel="noopener">0020. 术语</a> <a class="header-anchor" href="#0020-术语" aria-label="Permalink to &quot;[0020. 术语](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0020.%20%E6%9C%AF%E8%AF%AD)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--summary" target="_self" rel="noopener">1. 📝 summary</a></li><li><a href="#2--mindmap" target="_self" rel="noopener">2. 💡 mindmap</a></li><li><a href="#3--links" target="_self" rel="noopener">3. 🔗 links</a></li></ul><h2 id="1--summary" tabindex="-1">1. 📝 summary <a class="header-anchor" href="#1--summary" aria-label="Permalink to &quot;1. 📝 summary&quot;" target="_self" rel="noopener">​</a></h2><ul><li>了解术语 i18n、l10n、g11n</li></ul><h2 id="2--mindmap" tabindex="-1">2. 💡 mindmap <a class="header-anchor" href="#2--mindmap" aria-label="Permalink to &quot;2. 💡 mindmap&quot;" target="_self" rel="noopener">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-35",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20i18n%20%E6%9C%AF%E8%AF%AD%0A%20%20%20%20%E5%9B%BD%E9%99%85%E5%8C%96%20-%20i18n%0A%20%20%20%20%20%20%20%20internationalization%0A%20%20%20%20%20%20%20%2018%20%E6%84%8F%E5%91%B3%E7%9D%80%E2%80%9Cinternationalization%E2%80%9D%E8%BF%99%E4%B8%AA%E5%8D%95%E8%AF%8D%E4%B8%AD%EF%BC%8Ci%20%E5%92%8C%20n%20%E4%B9%8B%E9%97%B4%E6%9C%89%2018%20%E4%B8%AA%E5%AD%97%E6%AF%8D%0A%20%20%20%20%E6%9C%AC%E5%9C%B0%E5%8C%96%20-%20l10n%0A%20%20%20%20%20%20%20%20localization%0A%20%20%20%20%20%20%20%2010%20%E6%84%8F%E5%91%B3%E7%9D%80%E2%80%9Clocalization%E2%80%9D%E8%BF%99%E4%B8%AA%E5%8D%95%E8%AF%8D%E4%B8%AD%EF%BC%8Cl%20%E5%92%8C%20n%20%E4%B9%8B%E9%97%B4%E6%9C%89%2010%20%E4%B8%AA%E5%AD%97%E6%AF%8D%0A%20%20%20%20%E5%85%A8%E7%90%83%E5%8C%96%20-%20g11n%0A%20%20%20%20%20%20%20%20globalization%0A%20%20%20%20%20%20%20%2011%20%E6%84%8F%E5%91%B3%E7%9D%80%E2%80%9Cglobalization%E2%80%9D%E8%BF%99%E4%B8%AA%E5%8D%95%E8%AF%8D%E4%B8%AD%EF%BC%8Cg%20%E5%92%8C%20n%20%E4%B9%8B%E9%97%B4%E6%9C%89%2011%20%E4%B8%AA%E5%AD%97%E6%AF%8D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="3--links" tabindex="-1">3. 🔗 links <a class="header-anchor" href="#3--links" aria-label="Permalink to &quot;3. 🔗 links&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://www.w3.org/International/i18n-drafts/nav/about.zh-hans.html" target="_self" rel="noopener">https://www.w3.org/International/i18n-drafts/nav/about.zh-hans.html</a><ul><li>W3C 文章 - 关于国际化</li></ul></li><li><a href="https://www.w3.org/International/questions/qa-i18n" target="_self" rel="noopener">https://www.w3.org/International/questions/qa-i18n</a><ul><li>W3C 文章 - 本地化与国际化有什么关系？</li></ul></li><li><a href="https://zh.wikipedia.org/zh-cn/%E5%9B%BD%E9%99%85%E5%8C%96%E4%B8%8E%E6%9C%AC%E5%9C%B0%E5%8C%96" target="_self" rel="noopener">https://zh.wikipedia.org/zh-cn/国际化与本地化</a><ul><li>wiki - 国际化与本地化</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0020. 术语/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
