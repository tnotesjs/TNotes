import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0008. 单词本-2","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.en-notes/0008. 单词本-2/README.md","filePath":"TNotes.en-notes/0008. 单词本-2/README.md"}');
const _sfc_main = { name: "TNotes.en-notes/0008. 单词本-2/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_EnWordList = resolveComponent("EnWordList");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0008-单词本-2" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2" target="_self" rel="noopener">0008. 单词本-2</a> <a class="header-anchor" href="#0008-单词本-2" aria-label="Permalink to &quot;[0008. 单词本-2](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1-%EF%B8%8F-enwordlist" target="_self" rel="noopener">1. ⚙️ EnWordList</a></li></ul><h2 id="1-️-enwordlist" tabindex="-1">1. ⚙️ EnWordList <a class="header-anchor" href="#1-️-enwordlist" aria-label="Permalink to &quot;1. ⚙️ EnWordList&quot;" target="_self" rel="noopener">​</a></h2>`);
  _push(ssrRenderComponent(_component_EnWordList, { words: [
    "accord",
    "archive",
    "authentication",
    "badge",
    "bevel",
    "Bezier",
    "cabbage",
    "Cascade",
    "cave",
    "compose",
    "course",
    "cubic",
    "curve",
    "darkgreen",
    "decompose",
    "dimension",
    "elliptical",
    "enrollment",
    "foreign",
    "garlic",
    "graphics",
    "horizontal",
    "lineto",
    "magenta",
    "manipulation",
    "miter",
    "moveto",
    "mutator",
    "orientation",
    "patrol",
    "police",
    "populate",
    "prose",
    "purify",
    "quadratic",
    "represent",
    "restrict",
    "rint",
    "runoob",
    "saturation",
    "scalable",
    "serial",
    "sophisticated",
    "unoccupied",
    "vector",
    "vertical",
    "consecutive",
    "dual",
    "clash",
    "grant",
    "SMS"
  ] }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.en-notes/0008. 单词本-2/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
