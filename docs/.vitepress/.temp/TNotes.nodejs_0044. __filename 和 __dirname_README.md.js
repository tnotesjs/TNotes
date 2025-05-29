import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0044. __filename 和 __dirname","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0044. __filename 和 __dirname/README.md","filePath":"TNotes.nodejs/0044. __filename 和 __dirname/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0044. __filename 和 __dirname/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0044-__filename-和-__dirname" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0044.%20__filename%20%E5%92%8C%20__dirname" target="_self" rel="noopener">0044. __filename 和 __dirname</a> <a class="header-anchor" href="#0044-__filename-和-__dirname" aria-label="Permalink to &quot;[0044. __filename 和 __dirname](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0044.%20__filename%20%E5%92%8C%20__dirname)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li><li><a href="#2--demos1---%E6%89%93%E5%8D%B0-__filename-%E5%92%8C-__dirname" target="_self" rel="noopener">2. 💻 demos.1 - 打印 <code>__filename</code> 和 <code>__dirname</code></a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>__filename</code>：表示当前正在执行的脚本的文件名，包括文件所在位置的绝对路径，但该路径和命令行参数所指定的文件名不一定相同。如果在模块中，则返回的值是模块文件的路径。</li><li><code>__dirname</code>：表示当前执行的脚本所在的目录。</li></ul><h2 id="2--demos1---打印-__filename-和-__dirname" tabindex="-1">2. 💻 demos.1 - 打印 <code>__filename</code> 和 <code>__dirname</code> <a class="header-anchor" href="#2--demos1---打印-__filename-和-__dirname" aria-label="Permalink to &quot;2. 💻 demos.1 - 打印 \`__filename\` 和 \`__dirname\`&quot;" target="_self" rel="noopener">​</a></h2><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">console.</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">log</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;当前文件名：&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, __filename)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">console.</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">log</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;当前目录：&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, __dirname)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 当前文件名： c:\\notes\\TNotes.nodejs\\notes\\0044. Node.js 全局变量\\demos\\1\\1.cjs</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 当前目录： c:\\notes\\TNotes.nodejs\\notes\\0044. Node.js 全局变量\\demos\\1</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0044. __filename 和 __dirname/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
