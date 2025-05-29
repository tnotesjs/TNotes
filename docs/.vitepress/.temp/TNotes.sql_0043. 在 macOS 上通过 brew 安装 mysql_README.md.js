import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0043. 在 macOS 上通过 brew 安装 mysql","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0043. 在 macOS 上通过 brew 安装 mysql/README.md","filePath":"TNotes.sql/0043. 在 macOS 上通过 brew 安装 mysql/README.md"}');
const _sfc_main = { name: "TNotes.sql/0043. 在 macOS 上通过 brew 安装 mysql/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0043-在-macos-上通过-brew-安装-mysql" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0043.%20%E5%9C%A8%20macOS%20%E4%B8%8A%E9%80%9A%E8%BF%87%20brew%20%E5%AE%89%E8%A3%85%20mysql" target="_self" rel="noopener">0043. 在 macOS 上通过 brew 安装 mysql</a> <a class="header-anchor" href="#0043-在-macos-上通过-brew-安装-mysql" aria-label="Permalink to &quot;[0043. 在 macOS 上通过 brew 安装 mysql](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0043.%20%E5%9C%A8%20macOS%20%E4%B8%8A%E9%80%9A%E8%BF%87%20brew%20%E5%AE%89%E8%A3%85%20mysql)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>brew install mysql</code></li><li>如果是 <code>macOS 15.x.x</code> 那么可能会出现如下错误： <ul><li><code>Error: unknown or unsupported macOS version: :dunno</code></li><li>因为 <code>macOS 15.x.x</code> 是一个预览版本，，而 Homebrew 尚未正式支持这个版本。</li></ul></li></ul><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">$</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> brew</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> install</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> mysql</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Warning: You are using macOS 15.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># We do not provide support for this pre-release version.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># It is expected behaviour that some formulae will fail to build in this pre-release version.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># It is expected behaviour that Homebrew will be buggy and slow.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Do not create any issues about this on Homebrew&#39;s GitHub repositories.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Do not create any issues even if you think this message is unrelated.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Any opened issues will be immediately closed without response.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Do not ask for help from Homebrew or its maintainers on social media.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># You may ask for help in Homebrew&#39;s discussions but are unlikely to receive a response.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Try to figure out the problem yourself and submit a fix as a pull request.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># We will review it but may or may not accept it.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">#</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Error: unknown or unsupported macOS version: :dunno</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0043. 在 macOS 上通过 brew 安装 mysql/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
