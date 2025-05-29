import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0009. koa-static","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0009. koa-static/README.md","filePath":"TNotes.nodejs/0009. koa-static/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0009. koa-static/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0009-koa-static" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0009.%20koa-static" target="_self" rel="noopener">0009. koa-static</a> <a class="header-anchor" href="#0009-koa-static" aria-label="Permalink to &quot;[0009. koa-static](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0009.%20koa-static)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E5%BE%85%E6%90%AC%E8%BF%90" target="_self" rel="noopener">1. ⏰ 待搬运</a></li></ul><h2 id="1--待搬运" tabindex="-1">1. ⏰ 待搬运 <a class="header-anchor" href="#1--待搬运" aria-label="Permalink to &quot;1. ⏰ 待搬运&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0009. koa-static/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
