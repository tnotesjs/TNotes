import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"React + Vite","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.react/0037. 学习 antd Message 组件的使用/demos/2/README.md","filePath":"TNotes.react/0037. 学习 antd Message 组件的使用/demos/2/README.md"}');
const _sfc_main = { name: "TNotes.react/0037. 学习 antd Message 组件的使用/demos/2/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="react--vite" tabindex="-1">React + Vite <a class="header-anchor" href="#react--vite" aria-label="Permalink to &quot;React + Vite&quot;" target="_self" rel="noopener">​</a></h1><p>This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.</p><p>Currently, two official plugins are available:</p><ul><li><a href="https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md" target="_self" rel="noopener">@vitejs/plugin-react</a> uses <a href="https://babeljs.io/" target="_self" rel="noopener">Babel</a> for Fast Refresh</li><li><a href="https://github.com/vitejs/vite-plugin-react-swc" target="_self" rel="noopener">@vitejs/plugin-react-swc</a> uses <a href="https://swc.rs/" target="_self" rel="noopener">SWC</a> for Fast Refresh</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.react/0037. 学习 antd Message 组件的使用/demos/2/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
