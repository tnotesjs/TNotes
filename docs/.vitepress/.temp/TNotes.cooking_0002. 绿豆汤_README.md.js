import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-02-18-09-56-18.BwFhaWbJ.png";
const _imports_1 = "/notes/assets/2025-02-18-09-56-23.D_O5MARU.png";
const __pageData = JSON.parse('{"title":"0002. 绿豆汤","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.cooking/0002. 绿豆汤/README.md","filePath":"TNotes.cooking/0002. 绿豆汤/README.md"}');
const _sfc_main = { name: "TNotes.cooking/0002. 绿豆汤/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0002-绿豆汤" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0002.%20%E7%BB%BF%E8%B1%86%E6%B1%A4" target="_self" rel="noopener">0002. 绿豆汤</a> <a class="header-anchor" href="#0002-绿豆汤" aria-label="Permalink to &quot;[0002. 绿豆汤](https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0002.%20%E7%BB%BF%E8%B1%86%E6%B1%A4)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E9%A3%9F%E6%9D%90%E6%B8%85%E5%8D%95" target="_self" rel="noopener">1. 📝 食材清单</a></li><li><a href="#2--%E5%88%B6%E4%BD%9C%E6%B5%81%E7%A8%8B" target="_self" rel="noopener">2. 📒 制作流程</a></li></ul><h2 id="1--食材清单" tabindex="-1">1. 📝 食材清单 <a class="header-anchor" href="#1--食材清单" aria-label="Permalink to &quot;1. 📝 食材清单&quot;" target="_self" rel="noopener">​</a></h2><ul><li>绿豆</li><li>红豆</li><li>百合</li><li>枸杞</li><li>红枣</li><li>……</li><li>能加的东西蛮多的，这些玩意儿可以一起煮。</li></ul><h2 id="2--制作流程" tabindex="-1">2. 📒 制作流程 <a class="header-anchor" href="#2--制作流程" aria-label="Permalink to &quot;2. 📒 制作流程&quot;" target="_self" rel="noopener">​</a></h2><ul><li>睡前把把原材料丢到电饭煲里边，加点儿水，约个时间，隔天早上喝汤。</li></ul><div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide"><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></div><div class="swiper-slide"><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></div></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div><div class="swiper-pagination"></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.cooking/0002. 绿豆汤/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
