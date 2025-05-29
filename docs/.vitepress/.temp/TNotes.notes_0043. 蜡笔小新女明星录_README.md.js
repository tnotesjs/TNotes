import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0043. 蜡笔小新女明星录","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0043. 蜡笔小新女明星录/README.md","filePath":"TNotes.notes/0043. 蜡笔小新女明星录/README.md"}');
const _sfc_main = { name: "TNotes.notes/0043. 蜡笔小新女明星录/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BilibiliOutsidePlayer = resolveComponent("BilibiliOutsidePlayer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0043-蜡笔小新女明星录" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0043.%20%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0%E5%A5%B3%E6%98%8E%E6%98%9F%E5%BD%95" target="_self" rel="noopener">0043. 蜡笔小新女明星录</a> <a class="header-anchor" href="#0043-蜡笔小新女明星录" aria-label="Permalink to &quot;[0043. 蜡笔小新女明星录](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0043.%20%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0%E5%A5%B3%E6%98%8E%E6%98%9F%E5%BD%95)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>酒井法子</li><li>松岛菜菜子</li><li>中森名菜</li><li>大石惠</li><li>冈本夏生</li><li>山口智子</li></ul>`);
  _push(ssrRenderComponent(_component_BilibiliOutsidePlayer, { id: "BV1a54y167n6" }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0043. 蜡笔小新女明星录/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
