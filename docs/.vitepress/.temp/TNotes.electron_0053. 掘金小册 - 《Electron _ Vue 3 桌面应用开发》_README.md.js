import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.electron/0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》/README.md","filePath":"TNotes.electron/0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》/README.md"}');
const _sfc_main = { name: "TNotes.electron/0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0053-掘金小册---electron--vue-3-桌面应用开发" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B" target="_self" rel="noopener">0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》</a> <a class="header-anchor" href="#0053-掘金小册---electron--vue-3-桌面应用开发" aria-label="Permalink to &quot;[0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E5%B0%8F%E5%86%8C%E7%9B%AE%E5%BD%95" target="_self" rel="noopener">2. 📒 小册目录</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>作者</strong><ul><li><code>《Electron + Vue 3 桌面应用开发》</code> 这本小册的作者和 <code>0050. 《Electron 实战：入门、进阶与性能优化》</code> 这本书的作者是同一个人 - “刘晓伦”。</li></ul></li><li><strong>个人推广链接</strong><ul><li><a href="https://s.juejin.cn/ds/iBAwDAnG/" target="_self" rel="noopener">https://s.juejin.cn/ds/iBAwDAnG/</a></li><li>这是 <code>《Electron + Vue 3 桌面应用开发》</code> 的个人推广链接。</li><li>如果有需要的话，可以通过上述推广链接下单支持一下（有几块钱的推广费）。感谢 🙏 🙏 🙏</li></ul></li></ul><h2 id="2--小册目录" tabindex="-1">2. 📒 小册目录 <a class="header-anchor" href="#2--小册目录" aria-label="Permalink to &quot;2. 📒 小册目录&quot;" target="_self" rel="noopener">​</a></h2><div class="language-txt vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 开篇：简介与主旨</span></span>
<span class="line"><span>2. Electron 是什么？可以做什么？</span></span>
<span class="line"><span>3. 如何开发 Vite 3 插件构建 Electron 开发环境？</span></span>
<span class="line"><span>4. 如何开发 Vite 3 插件打包 Electron 应用？</span></span>
<span class="line"><span>5. 如何引入 vue-router 及控制工程架构？</span></span>
<span class="line"><span>6. 如何管控应用的窗口（上）？</span></span>
<span class="line"><span>7. 如何管控应用的窗口（下）？</span></span>
<span class="line"><span>8. 如何引入 Pinia 并管控应用的数据状态？</span></span>
<span class="line"><span>9. 如何引入客户端数据库及相关工具？</span></span>
<span class="line"><span>10. 桌面应用开发需要掌握哪些数据库知识（上）？</span></span>
<span class="line"><span>11. 桌面应用开发需要掌握哪些数据库知识（下）？</span></span>
<span class="line"><span>12. 如何为 Electron 应用开发原生模块？</span></span>
<span class="line"><span>13. 如何升级 Electron 应用？</span></span>
<span class="line"><span>14. Electron 应用具备哪些特征？</span></span>
<span class="line"><span>15. 如何调试 Electron 应用？</span></span>
<span class="line"><span>16. Electron 疑难杂症解决方案</span></span>
<span class="line"><span>17. 结语：期望与未来</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.electron/0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
