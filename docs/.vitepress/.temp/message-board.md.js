import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"💭 Discussions","description":"","frontmatter":{},"headers":[],"relativePath":"message-board.md","filePath":"message-board.md"}');
const _sfc_main = { name: "message-board.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_MyGiscusComp = resolveComponent("MyGiscusComp");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-discussions" tabindex="-1">💭 Discussions <a class="header-anchor" href="#-discussions" aria-label="Permalink to &quot;💭 Discussions&quot;" target="_self" rel="noopener">​</a></h1><div class="tip custom-block"><p class="custom-block-title">概述</p><ul><li>这就相当于是一个留言板，只要有个邮箱，注册一个 github 账号即可发表评论。</li><li>问题反馈……</li><li>学习打卡……</li><li>……</li></ul></div>`);
  _push(ssrRenderComponent(_component_MyGiscusComp, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("message-board.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const messageBoard = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  messageBoard as default
};
