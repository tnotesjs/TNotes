import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0010. 实现翻译小程序","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.miniprogram/0010. 实现翻译小程序/README.md","filePath":"TNotes.miniprogram/0010. 实现翻译小程序/README.md"}');
const _sfc_main = { name: "TNotes.miniprogram/0010. 实现翻译小程序/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0010-实现翻译小程序" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0010.%20%E5%AE%9E%E7%8E%B0%E7%BF%BB%E8%AF%91%E5%B0%8F%E7%A8%8B%E5%BA%8F" target="_self" rel="noopener">0010. 实现翻译小程序</a> <a class="header-anchor" href="#0010-实现翻译小程序" aria-label="Permalink to &quot;[0010. 实现翻译小程序](https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0010.%20%E5%AE%9E%E7%8E%B0%E7%BF%BB%E8%AF%91%E5%B0%8F%E7%A8%8B%E5%BA%8F)&quot;" target="_self" rel="noopener">​</a></h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.miniprogram/0010. 实现翻译小程序/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
