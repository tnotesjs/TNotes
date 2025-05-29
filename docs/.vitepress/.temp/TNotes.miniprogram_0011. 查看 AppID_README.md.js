import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-23-13-38-11.DkKGNBZa.png";
const __pageData = JSON.parse('{"title":"0011. 查看 AppID","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.miniprogram/0011. 查看 AppID/README.md","filePath":"TNotes.miniprogram/0011. 查看 AppID/README.md"}');
const _sfc_main = { name: "TNotes.miniprogram/0011. 查看 AppID/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0011-查看-appid" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0011.%20%E6%9F%A5%E7%9C%8B%20AppID" target="_self" rel="noopener">0011. 查看 AppID</a> <a class="header-anchor" href="#0011-查看-appid" aria-label="Permalink to &quot;[0011. 查看 AppID](https://github.com/Tdahuyou/TNotes.miniprogram/tree/main/notes/0011.%20%E6%9F%A5%E7%9C%8B%20AppID)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%9F%A5%E7%9C%8B-appid" target="_self" rel="noopener">1. 📒 查看 AppID</a></li></ul><h2 id="1--查看-appid" tabindex="-1">1. 📒 查看 AppID <a class="header-anchor" href="#1--查看-appid" aria-label="Permalink to &quot;1. 📒 查看 AppID&quot;" target="_self" rel="noopener">​</a></h2><ul><li>在微信公众平台上查找自己的小程序 AppID，该 ID 在创建新的小程序项目时必需填写。</li><li><a href="https://mp.weixin.qq.com/" target="_self" rel="noopener">https://mp.weixin.qq.com/</a><ul><li>微信公众平台</li></ul></li><li>查阅流程： <ol><li>进入微信公众平台，完成登录。</li><li>在【开发】-&gt;【开发管理】-&gt;【开发设置】下面能够找到自己的 AppID。 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li><strong>需要清楚知道这个 AppID 在什么地方查看。我们每次创建小程序项目的时候，都需要填写这个 AppID。</strong></li></ul></li></ol></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.miniprogram/0011. 查看 AppID/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
