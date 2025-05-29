import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0022. 字面量","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0022. 字面量/README.md","filePath":"TNotes.html-css-js/0022. 字面量/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0022. 字面量/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0022-字面量" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F" target="_self" rel="noopener">0022. 字面量</a> <a class="header-anchor" href="#0022-字面量" aria-label="Permalink to &quot;[0022. 字面量](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0022.%20%E5%AD%97%E9%9D%A2%E9%87%8F)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--mdn-%E5%AF%B9-%E5%AD%97%E9%9D%A2%E9%87%8Fliteral%E7%9A%84%E6%8F%8F%E8%BF%B0" target="_self" rel="noopener">1. 🔗 MDN 对 字面量（Literal）的描述</a></li><li><a href="#2--%E5%AD%97%E9%9D%A2%E9%87%8F" target="_self" rel="noopener">2. 📒 字面量</a></li><li><a href="#3--demos1---%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%AD%97%E9%9D%A2%E9%87%8F" target="_self" rel="noopener">3. 💻 demos.1 - 不同类型的字面量</a></li></ul><ul><li>知识点： <ul><li>理解字面量是什么</li></ul></li><li>字面量就是直接写在代码中的值。</li></ul><h2 id="1--mdn-对-字面量literal的描述" tabindex="-1">1. 🔗 MDN 对 字面量（Literal）的描述 <a class="header-anchor" href="#1--mdn-对-字面量literal的描述" aria-label="Permalink to &quot;1. 🔗 MDN 对 字面量（Literal）的描述&quot;" target="_self" rel="noopener">​</a></h2><p><a href="https://developer.mozilla.org/en-US/docs/Glossary/Literal" target="_self" rel="noopener">https://developer.mozilla.org/en-US/docs/Glossary/Literal</a></p><h2 id="2--字面量" tabindex="-1">2. 📒 字面量 <a class="header-anchor" href="#2--字面量" aria-label="Permalink to &quot;2. 📒 字面量&quot;" target="_self" rel="noopener">​</a></h2><ul><li>字面量在 JavaScript 中表示值。</li><li>字面量是固定的值，不是变量。</li><li>你可以在脚本中直接书写字面量。</li><li>字面量可以是各种数据类型，包括数值、字符串、布尔值、对象、数组等。</li></ul><h2 id="3--demos1---不同类型的字面量" tabindex="-1">3. 💻 demos.1 - 不同类型的字面量 <a class="header-anchor" href="#3--demos1---不同类型的字面量" aria-label="Permalink to &quot;3. 💻 demos.1 - 不同类型的字面量&quot;" target="_self" rel="noopener">​</a></h2><div class="language-javascript vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 你在程序中，直接把值给写出来，你写出来的值其实就是字面量。</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 以下是数字字面量</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">123</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">111</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 以下是字符串字面量</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;hello&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;word!&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 以下是布尔字面量</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">true</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">false</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 以下是数组字面量</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">[</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">1</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">2</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">3</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">]</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">[</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;a&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;b&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;c&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0022. 字面量/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
