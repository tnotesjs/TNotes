import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-09-29-15-11-04.HKKP_9zz.png";
const __pageData = JSON.parse('{"title":"0062. ESM 绑定再导出","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0062. ESM 绑定再导出/README.md","filePath":"TNotes.html-css-js/0062. ESM 绑定再导出/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0062. ESM 绑定再导出/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0062-esm-绑定再导出" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0062.%20ESM%20%E7%BB%91%E5%AE%9A%E5%86%8D%E5%AF%BC%E5%87%BA" target="_self" rel="noopener">0062. ESM 绑定再导出</a> <a class="header-anchor" href="#0062-esm-绑定再导出" aria-label="Permalink to &quot;[0062. ESM 绑定再导出](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0062.%20ESM%20%E7%BB%91%E5%AE%9A%E5%86%8D%E5%AF%BC%E5%87%BA)&quot;" target="_self" rel="noopener">​</a></h1><p>某个目录下提供一个导出该目录下所有需要导出的文件的入口文件。 <img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"><code>demo/utils/index.js</code> 用于导入所有 <code>demo/utils/*.js</code> 模块导出的内容，然后再将这些导入的内容统一导出，外部如果需要使用 <code>demo/utils</code> 中的模块，只需要导入 <code>demo/utils/index.js</code> 即可。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0062. ESM 绑定再导出/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
