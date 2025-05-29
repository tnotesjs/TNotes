import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-12-17-23-04-18.C_0eNukE.png";
const __pageData = JSON.parse('{"title":"👀 README","description":"","frontmatter":{},"headers":[],"relativePath":"about-me/README.md","filePath":"about-me/README.md"}');
const _sfc_main = { name: "about-me/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-readme" tabindex="-1">👀 README <a class="header-anchor" href="#-readme" aria-label="Permalink to &quot;👀 README&quot;" target="_self" rel="noopener">​</a></h1><ul><li>🧑🏻‍💻 家乐</li><li>🏠 浙江、温州人</li><li>🏛️ 上海建桥学院</li><li>🏷 UP 主、铲屎官、单身、99 年、22 年毕业、码农一枚、阅读、学习、观察、思考、记录、创作、分享、成长</li><li>📺 Bilibili <ul><li><a href="https://space.bilibili.com/407241004" target="_self" rel="noopener">https://space.bilibili.com/407241004</a><ul><li>B 站主页链接。</li></ul></li><li><a href="https://message.bilibili.com/#/whisper/mid407241004" target="_self" rel="noopener">https://message.bilibili.com/#/whisper/mid407241004</a><ul><li>通过 B 站给我发私信的链接。</li><li>一种无需加好友的沟通方式，当然前提是得有 B 站账号。</li></ul></li></ul></li><li>🔗 语雀 <ul><li><a href="https://www.yuque.com/tdahuyou/" target="_self" rel="noopener">https://www.yuque.com/tdahuyou/</a><ul><li>语雀花园主页链接。</li><li>后续若有其他需要公开的语雀知识库，会统一丢到这里边。</li></ul></li></ul></li><li>🔗 github <ul><li><a href="https://github.com/Tdahuyou/" target="_self" rel="noopener">https://github.com/Tdahuyou/</a></li></ul></li><li>📮 邮箱 <ul><li><code>dahuyou_top@163.com</code></li></ul></li><li>🧑🏻‍💻 微信 <ul><li>微信号：<code>Tdahuyou</code></li><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>注： <ul><li>来者不拒。</li><li>这就是目前的主号。</li><li>基本不玩微信，不发朋友圈，早期的朋友圈内容已搬运到 <code>TNotes.footprints</code> 中。</li></ul></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about-me/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
