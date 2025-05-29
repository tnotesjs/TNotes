import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0038. VSCode 简介","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0038. VSCode 简介/README.md","filePath":"TNotes.notes/0038. VSCode 简介/README.md"}');
const _sfc_main = { name: "TNotes.notes/0038. VSCode 简介/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0038-vscode-简介" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0038.%20VSCode%20%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">0038. VSCode 简介</a> <a class="header-anchor" href="#0038-vscode-简介" aria-label="Permalink to &quot;[0038. VSCode 简介](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0038.%20VSCode%20%E7%AE%80%E4%BB%8B)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>Visual Studio Code（简称 VS Code）是由 <strong>微软</strong> 开发的 <strong>免费、开源、跨平台</strong> 的代码编辑器。</li><li>VS Code 支持多种编程语言，并通过丰富的扩展生态系统，能够胜任从网页开发到数据分析等各类开发任务。</li><li>VS Code 是目前最流行的开发工具之一，凭借其高性能、易用性和强大的社区支持，成为开发者构建现代化应用的理想选择。</li><li>有关 VS Code 的详细介绍，请参考官方文档。 <ul><li>🔗 VS Code 官方文档</li><li><a href="https://code.visualstudio.com/" target="_self" rel="noopener">https://code.visualstudio.com/</a></li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-24-23-47-04.png" alt="图 0" loading="lazy"></li></ul></li><li>有关 VS Code 的实现原理，请参考 VS Code 源码。 <ul><li>🔗 VS Code Github</li><li><a href="https://github.com/microsoft/vscode" target="_self" rel="noopener">https://github.com/microsoft/vscode</a></li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-24-23-47-44.png" alt="图 1" loading="lazy"></li></ul></li><li><strong>VS Code 主要特性</strong><ul><li><strong>轻量快速</strong>：VS Code 启动速度快，资源占用低。</li><li><strong>智能代码补全（IntelliSense）</strong>：提供自动补全、参数提示、类型推断等功能。</li><li><strong>内建 Git 支持</strong>：可直接在编辑器中进行版本控制操作，如提交、分支切换等。</li><li><strong>调试功能强大</strong>：支持断点调试、变量查看、调用栈追踪等。</li><li><strong>插件扩展性强</strong>：通过 <code>Extension Marketplace</code> 可安装各种插件增强功能，例如 Python、Java、Docker 支持等。</li><li><strong>集成终端</strong>：内置终端，无需切换窗口即可执行命令行操作。</li><li><strong>多光标与分屏编辑</strong>：提升编码效率。</li><li><strong>主题和界面自定义</strong>：支持深色/浅色模式切换，界面高度可定制。</li></ul></li><li><strong>VS Code 支持的平台</strong><ul><li>Windows</li><li>macOS</li><li>Linux（Ubuntu、Debian、Fedora 等）</li></ul></li><li><strong>VS Code 的安装方式</strong><ul><li>直接到 VS Code 官网 -&gt; <a href="https://code.visualstudio.com" target="_self" rel="noopener">https://code.visualstudio.com</a> 下载安装包即可。</li><li>如果在安装过程中出现问题，请自行上网查阅相关教程，图文、视频教程有一堆。 <ul><li>或找 AI 求助。（推荐）</li></ul></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0038. VSCode 简介/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
