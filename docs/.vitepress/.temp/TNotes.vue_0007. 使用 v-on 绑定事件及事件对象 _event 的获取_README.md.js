import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0007. 使用 v-on 绑定事件及事件对象 $event 的获取","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.vue/0007. 使用 v-on 绑定事件及事件对象 $event 的获取/README.md","filePath":"TNotes.vue/0007. 使用 v-on 绑定事件及事件对象 $event 的获取/README.md"}');
const _sfc_main = { name: "TNotes.vue/0007. 使用 v-on 绑定事件及事件对象 $event 的获取/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0007-使用-v-on-绑定事件及事件对象-event-的获取" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0007.%20%E4%BD%BF%E7%94%A8%20v-on%20%E7%BB%91%E5%AE%9A%E4%BA%8B%E4%BB%B6%E5%8F%8A%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%20%24event%20%E7%9A%84%E8%8E%B7%E5%8F%96" target="_self" rel="noopener">0007. 使用 v-on 绑定事件及事件对象 $event 的获取</a> <a class="header-anchor" href="#0007-使用-v-on-绑定事件及事件对象-event-的获取" aria-label="Permalink to &quot;[0007. 使用 v-on 绑定事件及事件对象 $event 的获取](https://github.com/Tdahuyou/TNotes.vue/tree/main/notes/0007.%20%E4%BD%BF%E7%94%A8%20v-on%20%E7%BB%91%E5%AE%9A%E4%BA%8B%E4%BB%B6%E5%8F%8A%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%20%24event%20%E7%9A%84%E8%8E%B7%E5%8F%96)&quot;" target="_self" rel="noopener">​</a></h1><p>pending</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.vue/0007. 使用 v-on 绑定事件及事件对象 $event 的获取/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
