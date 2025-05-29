import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0121. 忽略文件 .eslintignore","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0121. 忽略文件 .eslintignore/README.md","filePath":"TNotes.html-css-js/0121. 忽略文件 .eslintignore/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0121. 忽略文件 .eslintignore/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0121-忽略文件-eslintignore" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0121.%20%E5%BF%BD%E7%95%A5%E6%96%87%E4%BB%B6%20.eslintignore" target="_self" rel="noopener">0121. 忽略文件 .eslintignore</a> <a class="header-anchor" href="#0121-忽略文件-eslintignore" aria-label="Permalink to &quot;[0121. 忽略文件 .eslintignore](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0121.%20%E5%BF%BD%E7%95%A5%E6%96%87%E4%BB%B6%20.eslintignore)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E5%BF%BD%E7%95%A5%E6%96%87%E4%BB%B6-eslintignore-%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">1. 📒 忽略文件 <code>.eslintignore</code> 简介</a></li></ul><h2 id="1--忽略文件-eslintignore-简介" tabindex="-1">1. 📒 忽略文件 <code>.eslintignore</code> 简介 <a class="header-anchor" href="#1--忽略文件-eslintignore-简介" aria-label="Permalink to &quot;1. 📒 忽略文件 \`.eslintignore\` 简介&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>.eslintignore</code> vs. <code>gitignore</code><ul><li><code>.eslintignore</code> 跟 git 的忽略配置文件 <code>.gitignore</code> 非常类似</li><li><code>.gitignore</code> 用于指定应该被 git 忽略的文件或目录。</li><li><code>.eslintignore</code> 用于指定应该被 ESLint 忽略的文件或目录。</li></ul></li><li>示例：</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>node_modules/</span></span>
<span class="line"><span>dist/</span></span>
<span class="line"><span>build/</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0121. 忽略文件 .eslintignore/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
