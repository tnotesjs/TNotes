import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.electron/0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》/README.md","filePath":"TNotes.electron/0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》/README.md"}');
const _sfc_main = { name: "TNotes.electron/0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0054-掘金小册---electron--react-从-0-到-1-实现简历平台实战" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B" target="_self" rel="noopener">0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》</a> <a class="header-anchor" href="#0054-掘金小册---electron--react-从-0-到-1-实现简历平台实战" aria-label="Permalink to &quot;[0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E5%B0%8F%E5%86%8C%E7%9B%AE%E5%BD%95" target="_self" rel="noopener">2. 📒 小册目录</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>个人推广链接</strong><ul><li><a href="https://s.juejin.cn/ds/iBAwroHA/" target="_self" rel="noopener">https://s.juejin.cn/ds/iBAwroHA/</a></li><li>这是《Electron + React 从 0 到 1 实现简历平台实战》的个人推广链接。</li><li>如果有需要的话，可以通过上述推广链接下单支持一下（有几块钱的推广费）。感谢 🙏 🙏 🙏</li></ul></li><li>备注： <ul><li>《Electron + React 从 0 到 1 实现简历平台实战》 这一本小册还没购买，其它的跟 electron 相关的都已经购买了，并阅读了一部分，也都还没读完，后续学习的时候会顺带着将相关的知识点整理到当前的笔记仓库中。</li></ul></li></ul><h2 id="2--小册目录" tabindex="-1">2. 📒 小册目录 <a class="header-anchor" href="#2--小册目录" aria-label="Permalink to &quot;2. 📒 小册目录&quot;" target="_self" rel="noopener">​</a></h2><div class="language-txt vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 开篇-技术选型和项目结构</span></span>
<span class="line"><span>2. 基础篇-Electron初步认识并掌握基础知识</span></span>
<span class="line"><span>3. 设计篇-需求功能设计与数据存储方案设计</span></span>
<span class="line"><span>4. 环境篇-动手搭建我们的简历平台</span></span>
<span class="line"><span>5. 🏆 500米里程碑｜环境搭建篇完成</span></span>
<span class="line"><span>6. 业务篇-首页开发，好的印象能加分</span></span>
<span class="line"><span>7. 业务篇-如何写我们的Redux与File</span></span>
<span class="line"><span>8. 业务篇-简历制作之常用组件设计与简历数据设计</span></span>
<span class="line"><span>9. 业务篇-简历制作之入口页面开发</span></span>
<span class="line"><span>10. 业务篇-简历制作之工具条模块与简历模版之间通信</span></span>
<span class="line"><span>11. 业务篇-简历制作之数据的录入与展示</span></span>
<span class="line"><span>12. 业务篇-简历制作之导出PDF</span></span>
<span class="line"><span>13. 🏆 1000米里程碑 ｜简历主流程完成</span></span>
<span class="line"><span>14. 🐼 支线篇-打包生成第一个桌面应用（骄傲自豪）</span></span>
<span class="line"><span>15. 业务篇-简历模版列表实现与侧边栏交互效果</span></span>
<span class="line"><span>16. 业务篇-首页主题换肤功能实现且Hooks优化逻辑</span></span>
<span class="line"><span>17. 业务篇-简历数据存档且自定义存储路径（多窗口）</span></span>
<span class="line"><span>18. 业务篇-思考并补全遗漏的功能细节，整体优化代码，让应用更健壮</span></span>
<span class="line"><span>19. 🏆 1500米里程碑 ｜丰富功能</span></span>
<span class="line"><span>20. 优化篇-公共弹窗拆解优化，让职能更加单一</span></span>
<span class="line"><span>21. 定制篇-自定义 Electron 原生应用菜单</span></span>
<span class="line"><span>22. 打包篇-应用程序生产环境构建</span></span>
<span class="line"><span>23. 打包篇-生产环境疑难杂症的解决</span></span>
<span class="line"><span>24. 打包篇-Webpack打包优化</span></span>
<span class="line"><span>25. 打包篇-Electron打包体积优化</span></span>
<span class="line"><span>26. 🏆 到达目的地-应用程序发布</span></span>
<span class="line"><span>27. 结尾篇-行而不辍，未来可期</span></span>
<span class="line"><span>28. 彩蛋篇-Webpack基础介绍与两大利器</span></span>
<span class="line"><span>29. 彩蛋篇-RcReduxModel中间件开发设计</span></span>
<span class="line"><span>30. 期望篇-可视化自定义独特的简历模版</span></span>
<span class="line"><span>31. 问题篇-常见问题解决</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.electron/0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
