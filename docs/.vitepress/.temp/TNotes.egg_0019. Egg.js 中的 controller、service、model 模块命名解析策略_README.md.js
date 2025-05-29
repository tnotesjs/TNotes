import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0019. Egg.js 中的 controller、service、model 模块命名解析策略","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.egg/0019. Egg.js 中的 controller、service、model 模块命名解析策略/README.md","filePath":"TNotes.egg/0019. Egg.js 中的 controller、service、model 模块命名解析策略/README.md"}');
const _sfc_main = { name: "TNotes.egg/0019. Egg.js 中的 controller、service、model 模块命名解析策略/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0019-eggjs-中的-controllerservicemodel-模块命名解析策略" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0019.%20Egg.js%20%E4%B8%AD%E7%9A%84%20controller%E3%80%81service%E3%80%81model%20%E6%A8%A1%E5%9D%97%E5%91%BD%E5%90%8D%E8%A7%A3%E6%9E%90%E7%AD%96%E7%95%A5" target="_self" rel="noopener">0019. Egg.js 中的 controller、service、model 模块命名解析策略</a> <a class="header-anchor" href="#0019-eggjs-中的-controllerservicemodel-模块命名解析策略" aria-label="Permalink to &quot;[0019. Egg.js 中的 controller、service、model 模块命名解析策略](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0019.%20Egg.js%20%E4%B8%AD%E7%9A%84%20controller%E3%80%81service%E3%80%81model%20%E6%A8%A1%E5%9D%97%E5%91%BD%E5%90%8D%E8%A7%A3%E6%9E%90%E7%AD%96%E7%95%A5)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>Controller 和 Service 会自动转为小驼峰的形式。</li><li>Model 会自动转为大驼峰的形式。</li><li>👇 下面以 <code>user_info.js</code> 为例来举例说明：</li></ul><table tabindex="0"><thead><tr><th>模块类型</th><th>存放路径</th><th>引用方式示例</th><th>自动解析机制</th></tr></thead><tbody><tr><td>Controller</td><td><code>app/controller/user_info.js</code></td><td>比如在 router 中访问：<code>controller.userInfo.index</code></td><td><code>user_info</code> 会被自动转为小驼峰形式 <code>userInfo</code></td></tr><tr><td>Service</td><td><code>app/service/user_info.js</code></td><td>比如在某个 Controller 中访问：<code>ctx.service.userInfo</code></td><td><code>user_info</code> 会被自动转为小驼峰形式 <code>userInfo</code></td></tr><tr><td>Model</td><td><code>app/model/user_info.js</code></td><td>比如在某个 Service 中访问：<code>ctx.model.UserInfo</code></td><td><code>user_info</code> 会被自动转为大驼峰形式 <code>UserInfo</code></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.egg/0019. Egg.js 中的 controller、service、model 模块命名解析策略/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
