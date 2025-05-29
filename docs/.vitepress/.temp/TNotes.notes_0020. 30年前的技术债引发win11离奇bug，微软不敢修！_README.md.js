import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0020. 30年前的技术债引发win11离奇bug，微软不敢修！","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0020. 30年前的技术债引发win11离奇bug，微软不敢修！/README.md","filePath":"TNotes.notes/0020. 30年前的技术债引发win11离奇bug，微软不敢修！/README.md"}');
const _sfc_main = { name: "TNotes.notes/0020. 30年前的技术债引发win11离奇bug，微软不敢修！/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BilibiliOutsidePlayer = resolveComponent("BilibiliOutsidePlayer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0020-30年前的技术债引发win11离奇bug微软不敢修" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0020.%2030%E5%B9%B4%E5%89%8D%E7%9A%84%E6%8A%80%E6%9C%AF%E5%80%BA%E5%BC%95%E5%8F%91win11%E7%A6%BB%E5%A5%87bug%EF%BC%8C%E5%BE%AE%E8%BD%AF%E4%B8%8D%E6%95%A2%E4%BF%AE%EF%BC%81" target="_self" rel="noopener">0020. 30年前的技术债引发win11离奇bug，微软不敢修！</a> <a class="header-anchor" href="#0020-30年前的技术债引发win11离奇bug微软不敢修" aria-label="Permalink to &quot;[0020. 30年前的技术债引发win11离奇bug，微软不敢修！](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0020.%2030%E5%B9%B4%E5%89%8D%E7%9A%84%E6%8A%80%E6%9C%AF%E5%80%BA%E5%BC%95%E5%8F%91win11%E7%A6%BB%E5%A5%87bug%EF%BC%8C%E5%BE%AE%E8%BD%AF%E4%B8%8D%E6%95%A2%E4%BF%AE%EF%BC%81)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2>`);
  _push(ssrRenderComponent(_component_BilibiliOutsidePlayer, { id: "BV1Rf421v73F" }, null, _parent));
  _push(`<ul><li><a href="https://www.bilibili.com/video/BV1Rf421v73F" target="_self" rel="noopener">https://www.bilibili.com/video/BV1Rf421v73F</a></li><li>介绍了 Windows 环境下路径过长的历史 bug</li><li>提到了 macOS 和 windows 在升级的时候所选择的策略：</li><li>macOS 舍弃技术债，不对旧程序做兼容。</li><li>Windows 保留技术债，尽可能对旧程序做兼容。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0020. 30年前的技术债引发win11离奇bug，微软不敢修！/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
