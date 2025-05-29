import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-01-02-20-36-22.ir4LcVo2.png";
const _imports_1 = "/notes/assets/2025-01-02-20-36-28.PsR4bj_i.png";
const _imports_2 = "/notes/assets/2025-01-02-20-36-57.CDyCrxfH.png";
const __pageData = JSON.parse('{"title":"🐱 我家 の 神兽","description":"","frontmatter":{},"headers":[],"relativePath":"about-me/we.md","filePath":"about-me/we.md"}');
const _sfc_main = { name: "about-me/we.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-我家-の-神兽" tabindex="-1">🐱 我家 の 神兽 <a class="header-anchor" href="#-我家-の-神兽" aria-label="Permalink to &quot;🐱 我家 の 神兽&quot;" target="_self" rel="noopener">​</a></h1><ul><li>姓名：we、week、wink</li><li>性别：和我相反</li><li>技能：抛媚眼 —— 单只眼睛 👀 眨眼 (^_&lt;) 的那种，杀伤力 100% ～</li><li>最常睡觉的地方： <ul><li>夏天 - 飘窗台</li><li>冬天 - 猫毯</li></ul></li><li>最爱吃的零食： <ul><li>猫条</li><li>猫罐头</li><li>……</li><li>应该说零食基本都爱吃</li></ul></li><li>写真：</li></ul><details class="details custom-block"><summary>表盘背景</summary><p><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></p></details><details class="details custom-block"><summary>手机背景</summary><p><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></p></details><details class="details custom-block"><summary>电脑背景</summary><p><img${ssrRenderAttr("src", _imports_2)} alt="" loading="lazy"></p></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about-me/we.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const we = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  we as default
};
