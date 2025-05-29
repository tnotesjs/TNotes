import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0013. 插件的配置","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.egg/0013. 插件的配置/README.md","filePath":"TNotes.egg/0013. 插件的配置/README.md"}');
const _sfc_main = { name: "TNotes.egg/0013. 插件的配置/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0013-插件的配置" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0013.%20%E6%8F%92%E4%BB%B6%E7%9A%84%E9%85%8D%E7%BD%AE" target="_self" rel="noopener">0013. 插件的配置</a> <a class="header-anchor" href="#0013-插件的配置" aria-label="Permalink to &quot;[0013. 插件的配置](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0013.%20%E6%8F%92%E4%BB%B6%E7%9A%84%E9%85%8D%E7%BD%AE)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%8F%92%E4%BB%B6%E7%9A%84%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E" target="_self" rel="noopener">1. 📒 插件的配置说明</a></li></ul><h2 id="1--插件的配置说明" tabindex="-1">1. 📒 插件的配置说明 <a class="header-anchor" href="#1--插件的配置说明" aria-label="Permalink to &quot;1. 📒 插件的配置说明&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>xxx</code> 插件的配置包括俩部分： <ul><li>1️⃣ 是否启用 <code>xxx</code> 插件 <ul><li><code>config/plugin.js</code> 只是决定用什么插件、以及控制插件的启用和关闭。</li></ul></li><li>2️⃣ <code>xxx</code> 插件的相关参数 <ul><li>插件的配置需要在 <code>config/config.default.js</code> 中完成。</li></ul></li><li>这样做的逻辑理念是： <ul><li><code>config/plugin.js</code> 集中管理</li><li><code>config/config.default.js</code> 集中配置</li></ul></li></ul></li><li><strong>不同的插件有不同的参数配置，需要阅读具体插件的官方文档。</strong></li><li><strong>示例 - mysql 插件配置</strong></li></ul><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// config/config.default.js</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">exports</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">.mysql </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  client: {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    host: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;mysql.com&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    port: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;3306&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    user: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;test_user&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    password: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;test_password&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    database: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;test&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.egg/0013. 插件的配置/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
