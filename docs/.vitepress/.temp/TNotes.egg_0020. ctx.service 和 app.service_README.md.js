import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0020. ctx.service 和 app.service","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.egg/0020. ctx.service 和 app.service/README.md","filePath":"TNotes.egg/0020. ctx.service 和 app.service/README.md"}');
const _sfc_main = { name: "TNotes.egg/0020. ctx.service 和 app.service/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0020-ctxservice-和-appservice" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0020.%20ctx.service%20%E5%92%8C%20app.service" target="_self" rel="noopener">0020. ctx.service 和 app.service</a> <a class="header-anchor" href="#0020-ctxservice-和-appservice" aria-label="Permalink to &quot;[0020. ctx.service 和 app.service](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0020.%20ctx.service%20%E5%92%8C%20app.service)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>ctx.service</code> 和 <code>app.service</code> 在 Egg.js 中是不一样的，虽然它们都指向项目中的 Service 类，但使用方式和含义不同。</li><li><code>ctx.service</code><ul><li>请求上下文中的 service 实例，绑定当前请求的上下文（如 ctx, app, request, response 等）</li></ul></li><li><code>app.service</code><ul><li>应用级别的 service 构造函数或命名空间，不绑定任何请求上下文</li></ul></li></ul><table tabindex="0"><thead><tr><th>使用场景</th><th>推荐写法</th></tr></thead><tbody><tr><td>在 Controller 中调用服务层</td><td>✅ <code>ctx.service.xxx</code></td></tr><tr><td>在 Service 内部调用其他 Service</td><td>✅ <code>ctx.service.xxx</code></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.egg/0020. ctx.service 和 app.service/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
