import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0044. weread-helper","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.electron/0044. weread-helper/README.md","filePath":"TNotes.electron/0044. weread-helper/README.md"}');
const _sfc_main = { name: "TNotes.electron/0044. weread-helper/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0044-weread-helper" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0044.%20weread-helper" target="_self" rel="noopener">0044. weread-helper</a> <a class="header-anchor" href="#0044-weread-helper" aria-label="Permalink to &quot;[0044. weread-helper](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0044.%20weread-helper)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--links" target="_self" rel="noopener">1. 🔗 links</a></li><li><a href="#2-quick-start" target="_self" rel="noopener">2. 📒Quick Start</a></li></ul><ul><li>套壳了微信读书的网页版，并注入了一些自定义脚本。</li></ul><h2 id="1--links" tabindex="-1">1. 🔗 links <a class="header-anchor" href="#1--links" aria-label="Permalink to &quot;1. 🔗 links&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://www.bilibili.com/video/BV1sZ421p7fW/" target="_self" rel="noopener">https://www.bilibili.com/video/BV1sZ421p7fW/</a><ul><li>bilibili--微信读书桌面版。</li><li>🔍 查看桌面版的安装流程和 preload.js 脚本功能演示。</li></ul></li><li><a href="https://www.yuque.com/huyouda" target="_self" rel="noopener">https://www.yuque.com/huyouda</a><ul><li>yuque--tools--微信读书。</li><li>📂 可在工具分享 tools 中获取安装包。</li></ul></li></ul><h2 id="2-quick-start" tabindex="-1">2. 📒Quick Start <a class="header-anchor" href="#2-quick-start" aria-label="Permalink to &quot;2. 📒Quick Start&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>npm i</code></li><li><code>npm run dev</code> 启 dev 环境</li><li><code>npm run build</code> 出包</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.electron/0044. weread-helper/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
