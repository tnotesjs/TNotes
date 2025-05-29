import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0076. exec vs. spawn","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0076. exec vs. spawn/README.md","filePath":"TNotes.nodejs/0076. exec vs. spawn/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0076. exec vs. spawn/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0076-exec-vs-spawn" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0076.%20exec%20vs.%20spawn" target="_self" rel="noopener">0076. exec vs. spawn</a> <a class="header-anchor" href="#0076-exec-vs-spawn" aria-label="Permalink to &quot;[0076. exec vs. spawn](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0076.%20exec%20vs.%20spawn)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><table tabindex="0"><thead><tr><th>特性</th><th><code>exec</code></th><th><code>spawn</code></th></tr></thead><tbody><tr><td><strong>用途</strong></td><td>短时间运行的简单命令</td><td>长时间运行的复杂命令</td></tr><tr><td><strong>输出处理</strong></td><td>缓冲输出，回调函数中获取结果</td><td>流式输出，实时传递到父进程</td></tr><tr><td><strong>缓冲区限制</strong></td><td>默认 200KB，可通过 <code>maxBuffer</code> 扩展</td><td>无缓冲区限制</td></tr><tr><td><strong>适合场景</strong></td><td>一次性命令（如 <code>ls</code>、<code>echo</code>）</td><td>持续运行的命令（如 <code>vitepress dev</code>）</td></tr><tr><td><strong>交互支持</strong></td><td>不适合需要交互的命令</td><td>支持交互，可通过 <code>stdio: &#39;inherit&#39;</code> 实现</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0076. exec vs. spawn/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
