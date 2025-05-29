import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-01-02-07-26-24.CbH00DC8.png";
const _imports_1 = "/notes/assets/2025-01-02-07-26-44.CqVxtRdf.png";
const __pageData = JSON.parse('{"title":"✍️ 创 作","description":"","frontmatter":{},"headers":[],"relativePath":"about-me/creation.md","filePath":"about-me/creation.md"}');
const _sfc_main = { name: "about-me/creation.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="️-创-作" tabindex="-1">✍️ 创 作 <a class="header-anchor" href="#️-创-作" aria-label="Permalink to &quot;✍️ 创 作&quot;" target="_self" rel="noopener">​</a></h1><ul><li><strong>创作指数</strong><ul><li>基本上每天都会写点儿东西，可见 <a href="https://github.com/Tdahuyou" target="_self" rel="noopener">yuque</a>、<a href="https://github.com/Tdahuyou" target="_self" rel="noopener">github</a> 底部的创作指数。 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></li><li>从 24.08 开始逐步搬运 yuque 上的内容到 github 上。</li></ul></li></ul></li><li><strong>创作流程</strong><ol><li>输入 - 找资料学习，会在分享的文章中记录相关资料的链接。</li><li>输出 - 写文档，如果是技术类文章还会写 demos。</li><li>分享 - 录视频，认同费曼学习法，会尝试通过讲解的方式来辅助自己理解知识点。</li></ol></li><li><strong>不定期更新</strong><ul><li>闲：周更；忙：月更/年更。</li><li>每篇文档基本上都加了更新时间标注，你可以看到内容更新的具体时间。</li></ul></li><li><strong>⭐️ 所见即所得</strong><ul><li><strong>但凡你能看到的内容，都可以一键复制，或直接 git clone xxx 克隆整个仓库。</strong><ul><li><strong>如需搬运，烦请标明出处。</strong></li></ul></li><li>尤其对于技术分享中分享的内容，每个知识点都有对应的 Git 仓库链接，可直接 git clone 获取该知识点下所有的源码。也许这些 demos 也能够让你快速了解相关的知识点，通过修改 demos 中的源码，加以验证自己对技术的理解是否正确。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about-me/creation.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const creation = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  creation as default
};
