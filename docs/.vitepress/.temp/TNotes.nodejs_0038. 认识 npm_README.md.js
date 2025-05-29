import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0038. 认识 npm","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0038. 认识 npm/README.md","filePath":"TNotes.nodejs/0038. 认识 npm/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0038. 认识 npm/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0038-认识-npm" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0038.%20%E8%AE%A4%E8%AF%86%20npm" target="_self" rel="noopener">0038. 认识 npm</a> <a class="header-anchor" href="#0038-认识-npm" aria-label="Permalink to &quot;[0038. 认识 npm](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0038.%20%E8%AE%A4%E8%AF%86%20npm)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li><li><a href="#2--npm-%E5%8C%85%E6%95%B0%E9%87%8F" target="_self" rel="noopener">2. 📒 npm 包数量</a></li><li><a href="#3--npm-%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF" target="_self" rel="noopener">3. 📒 npm 使用场景</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>Node.js 使用 npm 对包进行管理，其全称为 Node Package Manager，开发人员可以使用它安装、更新或者卸载 Node.js 的模块。</li><li>npm 是 Node.js 的标准软件包管理器，其在 2020 年 3 月 17 日被 GitHub 收购，而且保证永久免费。</li><li>npm 是 Node.js 自带的，当你安装好 Node.js 之后，npm 就自动安装到你的计算机上了。</li></ul><h2 id="2--npm-包数量" tabindex="-1">2. 📒 npm 包数量 <a class="header-anchor" href="#2--npm-包数量" aria-label="Permalink to &quot;2. 📒 npm 包数量&quot;" target="_self" rel="noopener">​</a></h2><ul><li>在 npm 仓库中有超过 340 万个软件包，这使 npm 成为世界上最大的单一语言代码仓库，并且它几乎有可用于一切的软件包。</li><li>你可以在 npm 中登录账号，在侧边 <code>By the numbers</code> 卡片中查看当前的包数量。 <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-05-12-46-20.png" alt="图 0" loading="lazy"></li><li>注：截图时间 <code>2025 年 4 月 5 日</code></li></ul></li><li>以下是几个主流语言的包管理平台及其包数量（截至 2023 年）：</li></ul><table tabindex="0"><thead><tr><th><strong>语言</strong></th><th><strong>包管理平台</strong></th><th><strong>包数量</strong></th></tr></thead><tbody><tr><td>JavaScript</td><td>npm</td><td>&gt; 200 万</td></tr><tr><td>Python</td><td>PyPI</td><td>&gt; 40 万</td></tr><tr><td>Ruby</td><td>RubyGems</td><td>~ 18 万</td></tr><tr><td>PHP</td><td>Packagist</td><td>~ 30 万</td></tr><tr><td>Java</td><td>Maven Central</td><td>~ 50 万</td></tr></tbody></table><h2 id="3--npm-使用场景" tabindex="-1">3. 📒 npm 使用场景 <a class="header-anchor" href="#3--npm-使用场景" aria-label="Permalink to &quot;3. 📒 npm 使用场景&quot;" target="_self" rel="noopener">​</a></h2><ul><li>从 npm 服务器下载第三方包到本地使用。</li><li>从 npm 服务器下载并安装别人编写的命令行程序到本地使用。</li><li>将自己编写的包或命令行程序上传到 npm 服务器供别人使用。</li><li>npm 起初是作为下载和管理 Node.js 包依赖的方式，但其现在已经成为前端 JavaScript 中使用的通用工具。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0038. 认识 npm/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
