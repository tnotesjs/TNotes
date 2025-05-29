import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-03-15-00-38-32.B7okBIMO.png";
const __pageData = JSON.parse('{"title":"0005. BilibiliOutsidePlayer","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.template/0005. BilibiliOutsidePlayer/README.md","filePath":"TNotes.template/0005. BilibiliOutsidePlayer/README.md"}');
const _sfc_main = { name: "TNotes.template/0005. BilibiliOutsidePlayer/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BilibiliOutsidePlayer = resolveComponent("BilibiliOutsidePlayer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0005-bilibilioutsideplayer" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0005.%20BilibiliOutsidePlayer" target="_self" rel="noopener">0005. BilibiliOutsidePlayer</a> <a class="header-anchor" href="#0005-bilibilioutsideplayer" aria-label="Permalink to &quot;[0005. BilibiliOutsidePlayer](https://github.com/Tdahuyou/TNotes.template/tree/main/notes/0005.%20BilibiliOutsidePlayer)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E5%B5%8C%E5%85%A5-b-%E7%AB%99%E8%A7%86%E9%A2%91" target="_self" rel="noopener">1. 💻 嵌入 B 站视频</a></li></ul><h2 id="1--嵌入-b-站视频" tabindex="-1">1. 💻 嵌入 B 站视频 <a class="header-anchor" href="#1--嵌入-b-站视频" aria-label="Permalink to &quot;1. 💻 嵌入 B 站视频&quot;" target="_self" rel="noopener">​</a></h2><ul><li>找到需要插入的视频 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li></ul></li><li>获取需要插入视频的 BVID - <code>BV1QR4y1y7GG</code></li></ul><div class="language-md vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#22863A", "--shiki-dark": "#85E89D" })}">BilibiliOutsidePlayer</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> id</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;BV1QR4y1y7GG&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> /&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>`);
  _push(ssrRenderComponent(_component_BilibiliOutsidePlayer, { id: "BV1QR4y1y7GG" }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.template/0005. BilibiliOutsidePlayer/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
