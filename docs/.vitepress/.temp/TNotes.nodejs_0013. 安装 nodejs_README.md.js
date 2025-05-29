import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-04-19-31-59.CMdcJvX8.png";
const _imports_1 = "/notes/assets/2024-10-04-19-33-10.BV1LW-il.png";
const __pageData = JSON.parse('{"title":"0013. 安装 nodejs","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0013. 安装 nodejs/README.md","filePath":"TNotes.nodejs/0013. 安装 nodejs/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0013. 安装 nodejs/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0013-安装-nodejs" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0013.%20%E5%AE%89%E8%A3%85%20nodejs" target="_self" rel="noopener">0013. 安装 nodejs</a> <a class="header-anchor" href="#0013-安装-nodejs" aria-label="Permalink to &quot;[0013. 安装 nodejs](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0013.%20%E5%AE%89%E8%A3%85%20nodejs)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--links" target="_self" rel="noopener">1. 🔗 links</a></li><li><a href="#2--%E6%96%B0%E7%89%88-nodejs" target="_self" rel="noopener">2. 📒 新版 nodejs</a></li><li><a href="#3--%E6%97%A7%E7%89%88-nodejs" target="_self" rel="noopener">3. 📒 旧版 nodejs</a></li></ul><ul><li>视频：✅</li><li>⏰ 语雀知识库中存储的视频中演示流程是安装旧版 nodejs 的步骤。最新版的 nodejs 的页面发生了一些变化，可以结合着最新版的 nodejs 来重新录制一下基本的安装流程。</li></ul><h2 id="1--links" tabindex="-1">1. 🔗 links <a class="header-anchor" href="#1--links" aria-label="Permalink to &quot;1. 🔗 links&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://nodejs.org/en" target="_self" rel="noopener">https://nodejs.org/en</a> - nodejs 官网文档。</li></ul><h2 id="2--新版-nodejs" tabindex="-1">2. 📒 新版 nodejs <a class="header-anchor" href="#2--新版-nodejs" aria-label="Permalink to &quot;2. 📒 新版 nodejs&quot;" target="_self" rel="noopener">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></p><p>视频中演示的是旧版安装 nodejs 的步骤。最新版的 nodejs 的页面发生了一些变化，你可以在这里找到跟视频中一致的安装程序，然后无脑下一步（也可以跟着视频中演示的步骤）完成安装即可。</p><p><strong>查看 node 版本 - 验证 nodejs 是否成功安装</strong></p><p>无论是从旧版的页面还是新版的页面下载的 nodejs，最终验证安装成功的命令（查看 node 版本的命令）都是一致的 <code>node -v</code>。</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">$</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> node</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> -v</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># v20.10.0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="3--旧版-nodejs" tabindex="-1">3. 📒 旧版 nodejs <a class="header-anchor" href="#3--旧版-nodejs" aria-label="Permalink to &quot;3. 📒 旧版 nodejs&quot;" target="_self" rel="noopener">​</a></h2><p><strong>安装 nodejs</strong></p><p><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></p><p>建议下载左侧的稳定版，全程点击下一步，即可完成安装。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0013. 安装 nodejs/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
