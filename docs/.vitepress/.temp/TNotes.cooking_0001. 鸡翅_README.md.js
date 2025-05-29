import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-01-03-23-30-16.CC2TzSwZ.png";
const __pageData = JSON.parse('{"title":"0001. 鸡翅","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.cooking/0001. 鸡翅/README.md","filePath":"TNotes.cooking/0001. 鸡翅/README.md"}');
const _sfc_main = { name: "TNotes.cooking/0001. 鸡翅/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0001-鸡翅" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0001.%20%E9%B8%A1%E7%BF%85" target="_self" rel="noopener">0001. 鸡翅</a> <a class="header-anchor" href="#0001-鸡翅" aria-label="Permalink to &quot;[0001. 鸡翅](https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0001.%20%E9%B8%A1%E7%BF%85)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E9%A3%9F%E6%9D%90%E6%B8%85%E5%8D%95" target="_self" rel="noopener">1. 📝 食材清单</a></li><li><a href="#2--%E5%88%B6%E4%BD%9C%E6%B5%81%E7%A8%8B" target="_self" rel="noopener">2. 📒 制作流程</a></li></ul><h2 id="1--食材清单" tabindex="-1">1. 📝 食材清单 <a class="header-anchor" href="#1--食材清单" aria-label="Permalink to &quot;1. 📝 食材清单&quot;" target="_self" rel="noopener">​</a></h2><ul><li>鸡翅：10 个</li><li>蒜头：2 瓣</li><li>生姜：2 ~ 5 片</li><li>盐：5 ~ 10 g</li><li>鸡精：5 ~ 10 g</li><li>糖：20 ~ 30 g</li><li>耗油：10 ~ 20 g</li><li>生抽：30 ~ 40 g</li><li>纯芝麻油：10 ~ 20 g</li><li>淀粉：30 ~ 40 g</li><li>水：视情况而定，如果感觉干，下次腌制的时候可以适当加一些</li><li>腌制鸡肉，通用的配方，不仅限于鸡翅。</li></ul><h2 id="2--制作流程" tabindex="-1">2. 📒 制作流程 <a class="header-anchor" href="#2--制作流程" aria-label="Permalink to &quot;2. 📒 制作流程&quot;" target="_self" rel="noopener">​</a></h2><ul><li>将所有用料混合，抓匀，丢保鲜袋里边，放入冰箱，腌制半天到一天时间。</li><li>取出，丢空气炸锅，调 200℃、20min</li><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.cooking/0001. 鸡翅/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
