import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-20-13-35-51.BMzwWF9w.png";
const __pageData = JSON.parse('{"title":"0051. 掘金小册 - 《Electron 应用开发实践指南》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.electron/0051. 掘金小册 - 《Electron 应用开发实践指南》/README.md","filePath":"TNotes.electron/0051. 掘金小册 - 《Electron 应用开发实践指南》/README.md"}');
const _sfc_main = { name: "TNotes.electron/0051. 掘金小册 - 《Electron 应用开发实践指南》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0051-掘金小册---electron-应用开发实践指南" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B" target="_self" rel="noopener">0051. 掘金小册 - 《Electron 应用开发实践指南》</a> <a class="header-anchor" href="#0051-掘金小册---electron-应用开发实践指南" aria-label="Permalink to &quot;[0051. 掘金小册 - 《Electron 应用开发实践指南》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E5%B0%8F%E5%86%8C%E7%9B%AE%E5%BD%95" target="_self" rel="noopener">2. 📒 小册目录</a></li><li><a href="#3--rubick-%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">3. 📒 rubick 简介</a></li><li><a href="#4--references" target="_self" rel="noopener">4. 🔗 References</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>介绍了一个 Electron 在线教程 - 掘金小册 - 《Electron 应用开发实践指南》。</li><li>该小册是一个付费内容。</li><li><strong>个人推广链接</strong><ul><li><a href="https://s.juejin.cn/ds/iBAwjM5s/" target="_self" rel="noopener">https://s.juejin.cn/ds/iBAwjM5s/</a></li><li>这是《Electron 应用开发实践指南》的个人推广链接。</li><li>如果有需要的话，可以通过上述推广链接下单支持一下（有几块钱的推广费）。感谢 🙏 🙏 🙏</li></ul></li></ul><h2 id="2--小册目录" tabindex="-1">2. 📒 小册目录 <a class="header-anchor" href="#2--小册目录" aria-label="Permalink to &quot;2. 📒 小册目录&quot;" target="_self" rel="noopener">​</a></h2><div class="language-txt vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 开篇：Electron 带来的边界扩展</span></span>
<span class="line"><span>2. 基础篇：Electron 的基础概念</span></span>
<span class="line"><span>3. 基础篇：Electron 进程间的通信</span></span>
<span class="line"><span>4. 基础篇：Electron 的原生能力</span></span>
<span class="line"><span>5. 基础篇：Electron 跨平台兼容性措施</span></span>
<span class="line"><span>6. 基础篇：Electron 菜单和托盘</span></span>
<span class="line"><span>7. 实战篇：需求概述</span></span>
<span class="line"><span>8. 实战篇：开发环境搭建</span></span>
<span class="line"><span>9. 实战篇：自定义窗口的拖拽和缩放</span></span>
<span class="line"><span>10. 实战篇：实现应用快速检索</span></span>
<span class="line"><span>11. 实战篇：如何支持工具插件化</span></span>
<span class="line"><span>12. 实战篇：插件的安装、发布、卸载</span></span>
<span class="line"><span>13. 实战篇：系统插件的加载和取色插件的开发</span></span>
<span class="line"><span>14. 实战篇：Electron 实现屏幕截图</span></span>
<span class="line"><span>15. 实战：Electron 应用注入到系统右键菜单</span></span>
<span class="line"><span>16. 实战篇：实现超级面板</span></span>
<span class="line"><span>17. 实战篇：本地数据库和多端数据同步</span></span>
<span class="line"><span>18. 通用篇：使用 Rust 开发 Electron 原生扩展</span></span>
<span class="line"><span>19. 通用篇：Electron 应用打包</span></span>
<span class="line"><span>20. 通用篇：Electron 应用更新</span></span>
<span class="line"><span>21. 通用篇：Electron 应用性能优化</span></span>
<span class="line"><span>22. 通用篇：Electron 应用安全性指南</span></span>
<span class="line"><span>23. 通用篇：Electron 应用的自动化测试</span></span>
<span class="line"><span>24. 通用篇：Electron 的一些疑难杂症</span></span>
<span class="line"><span>25. 结语：我与 Electron &amp;开源的那些事</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="3--rubick-简介" tabindex="-1">3. 📒 rubick 简介 <a class="header-anchor" href="#3--rubick-简介" aria-label="Permalink to &quot;3. 📒 rubick 简介&quot;" target="_self" rel="noopener">​</a></h2><ul><li>《Electron 应用开发实践指南》 这本小册的作者，是开源项目 <a href="https://github.com/rubickCenter/rubick" target="_self" rel="noopener">rubick</a> 的作者。</li><li>rubick 是一款插件化的工具箱，可以把 rubick 类比成微信；插件就是微信小程序。rubick 就是一个运行插件的容器，插件由三方开发者开发维护，不属于 rubick 主程序部分。 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>左侧是输入框，输入内容后可以自动匹配对应插件或者系统应用 app，点击图片可以打开功能菜单-插件市场</li><li>右侧 ... 是菜单项，有 2 个功能项 <ul><li>固定/取消固定主窗口</li><li>切换语言</li></ul></li></ul></li><li>如果你用过类似 utools 这样的工具，会发现它们是非常类似的，不过 utools 貌似有些功能是需要付费的，而 rubick 是开源的。</li></ul><h2 id="4--references" tabindex="-1">4. 🔗 References <a class="header-anchor" href="#4--references" aria-label="Permalink to &quot;4. 🔗 References&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary>Details</summary><ul><li><a href="https://github.com/rubickCenter/rubick" target="_self" rel="noopener">https://github.com/rubickCenter/rubick</a><ul><li>GitHub rubick 仓库。</li></ul></li><li><a href="https://rubickcenter.github.io/docs/" target="_self" rel="noopener">https://rubickcenter.github.io/docs/</a><ul><li>rubick 官方文档。</li></ul></li></ul></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.electron/0051. 掘金小册 - 《Electron 应用开发实践指南》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
