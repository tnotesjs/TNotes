import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0050. 原型链","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0050. 原型链/README.md","filePath":"TNotes.html-css-js/0050. 原型链/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0050. 原型链/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0050-原型链" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE" target="_self" rel="noopener">0050. 原型链</a> <a class="header-anchor" href="#0050-原型链" aria-label="Permalink to &quot;[0050. 原型链](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0050.%20%E5%8E%9F%E5%9E%8B%E9%93%BE)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--summary" target="_self" rel="noopener">1. 📝 summary</a></li><li><a href="#2--links" target="_self" rel="noopener">2. 🔗 links</a></li><li><a href="#3--notes" target="_self" rel="noopener">3. 📒 notes</a></li><li><a href="#4--demo" target="_self" rel="noopener">4. 💻 demo</a></li><li><a href="#5--ai" target="_self" rel="noopener">5. 🤖 AI</a></li></ul><h2 id="1--summary" tabindex="-1">1. 📝 summary <a class="header-anchor" href="#1--summary" aria-label="Permalink to &quot;1. 📝 summary&quot;" target="_self" rel="noopener">​</a></h2><ul><li>如果 A 是由 B new 出来的，那么 A 的隐式原型 <code>A.__proto__</code> 指向 B 的原型 <code>B.prototype</code>。</li></ul><h2 id="2--links" tabindex="-1">2. 🔗 links <a class="header-anchor" href="#2--links" aria-label="Permalink to &quot;2. 🔗 links&quot;" target="_self" rel="noopener">​</a></h2><h2 id="3--notes" tabindex="-1">3. 📒 notes <a class="header-anchor" href="#3--notes" aria-label="Permalink to &quot;3. 📒 notes&quot;" target="_self" rel="noopener">​</a></h2><h2 id="4--demo" tabindex="-1">4. 💻 demo <a class="header-anchor" href="#4--demo" aria-label="Permalink to &quot;4. 💻 demo&quot;" target="_self" rel="noopener">​</a></h2><h2 id="5--ai" tabindex="-1">5. 🤖 AI <a class="header-anchor" href="#5--ai" aria-label="Permalink to &quot;5. 🤖 AI&quot;" target="_self" rel="noopener">​</a></h2></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0050. 原型链/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
