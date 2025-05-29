import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-01-03-23-21-26.PUtxfcN3.png";
const __pageData = JSON.parse('{"title":"0003. 蛋羹","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.cooking/0003. 蛋羹/README.md","filePath":"TNotes.cooking/0003. 蛋羹/README.md"}');
const _sfc_main = { name: "TNotes.cooking/0003. 蛋羹/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0003-蛋羹" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0003.%20%E8%9B%8B%E7%BE%B9" target="_self" rel="noopener">0003. 蛋羹</a> <a class="header-anchor" href="#0003-蛋羹" aria-label="Permalink to &quot;[0003. 蛋羹](https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0003.%20%E8%9B%8B%E7%BE%B9)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E9%A3%9F%E6%9D%90%E6%B8%85%E5%8D%95" target="_self" rel="noopener">1. 📝 食材清单</a></li><li><a href="#2--%E5%88%B6%E4%BD%9C%E6%B5%81%E7%A8%8B" target="_self" rel="noopener">2. 📒 制作流程</a></li></ul><h2 id="1--食材清单" tabindex="-1">1. 📝 食材清单 <a class="header-anchor" href="#1--食材清单" aria-label="Permalink to &quot;1. 📝 食材清单&quot;" target="_self" rel="noopener">​</a></h2><ul><li>鸡蛋 * 2</li><li>小勺盐</li><li>温水 100ml</li><li>虾仁 * 2</li><li>酱油（在做好之后滴几滴）</li></ul><h2 id="2--制作流程" tabindex="-1">2. 📒 制作流程 <a class="header-anchor" href="#2--制作流程" aria-label="Permalink to &quot;2. 📒 制作流程&quot;" target="_self" rel="noopener">​</a></h2><ul><li>全程耗时 ≈ 20min+</li><li>打蛋 <ul><li>打完后可以用滤网过一次</li></ul></li><li>加水</li><li>开蒸 <ul><li>目前（2025.03.16）用的是米家的电煮锅</li><li>约个 20min 丢那就行</li></ul></li><li>成品 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.cooking/0003. 蛋羹/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
