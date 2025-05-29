import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0018. demo-图片定时切换","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.react/0018. demo-图片定时切换/README.md","filePath":"TNotes.react/0018. demo-图片定时切换/README.md"}');
const _sfc_main = { name: "TNotes.react/0018. demo-图片定时切换/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0018-demo-图片定时切换" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0018.%20demo-%E5%9B%BE%E7%89%87%E5%AE%9A%E6%97%B6%E5%88%87%E6%8D%A2" target="_self" rel="noopener">0018. demo-图片定时切换</a> <a class="header-anchor" href="#0018-demo-图片定时切换" aria-label="Permalink to &quot;[0018. demo-图片定时切换](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0018.%20demo-%E5%9B%BE%E7%89%87%E5%AE%9A%E6%97%B6%E5%88%87%E6%8D%A2)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1-" target="_self" rel="noopener">1. ⏰</a></li></ul><h2 id="1-" tabindex="-1">1. ⏰ <a class="header-anchor" href="#1-" aria-label="Permalink to &quot;1. ⏰&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.react/0018. demo-图片定时切换/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
