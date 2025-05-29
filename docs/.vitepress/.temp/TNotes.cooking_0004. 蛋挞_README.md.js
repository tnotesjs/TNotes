import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-01-03-23-22-04.BDxWroy3.png";
const _imports_1 = "/notes/assets/2025-01-03-23-24-18.CNG1pbW2.png";
const __pageData = JSON.parse('{"title":"0004. 蛋挞","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.cooking/0004. 蛋挞/README.md","filePath":"TNotes.cooking/0004. 蛋挞/README.md"}');
const _sfc_main = { name: "TNotes.cooking/0004. 蛋挞/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0004-蛋挞" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0004.%20%E8%9B%8B%E6%8C%9E" target="_self" rel="noopener">0004. 蛋挞</a> <a class="header-anchor" href="#0004-蛋挞" aria-label="Permalink to &quot;[0004. 蛋挞](https://github.com/Tdahuyou/TNotes.cooking/tree/main/notes/0004.%20%E8%9B%8B%E6%8C%9E)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E9%A3%9F%E6%9D%90%E6%B8%85%E5%8D%95" target="_self" rel="noopener">1. 📝 食材清单</a></li><li><a href="#2--%E5%9F%BA%E6%9C%AC%E6%B5%81%E7%A8%8B" target="_self" rel="noopener">2. 📒 基本流程</a></li></ul><h2 id="1--食材清单" tabindex="-1">1. 📝 食材清单 <a class="header-anchor" href="#1--食材清单" aria-label="Permalink to &quot;1. 📝 食材清单&quot;" target="_self" rel="noopener">​</a></h2><ul><li>蛋挞皮事前准备好，蛋挞液自己配。</li><li>自己配蛋挞液： <ul><li>牛奶：250ml</li><li>淡奶油：250ml</li><li>炼乳：20g</li></ul></li><li>白砂糖：凭感觉加 <ul><li>成品甜了，下次少加。</li><li>成品淡了，下次多加。</li></ul></li></ul><h2 id="2--基本流程" tabindex="-1">2. 📒 基本流程 <a class="header-anchor" href="#2--基本流程" aria-label="Permalink to &quot;2. 📒 基本流程&quot;" target="_self" rel="noopener">​</a></h2><ul><li>配置好蛋挞液倒入蛋挞皮中（盛满一半多点儿就够了，否则太容易溢出了。）</li><li>直接丢空气炸锅 200℃ 等 15min 即可。</li><li>自己调的蛋挞液 - 24.05.03 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li></ul></li><li>成品 - 24.05.03（这一份的口感有些偏淡，然后多加了一些白沙糖，第二份好吃多了～） <ul><li><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.cooking/0004. 蛋挞/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
