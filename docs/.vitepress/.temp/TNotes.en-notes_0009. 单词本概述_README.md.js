import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0009. 单词本概述","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.en-notes/0009. 单词本概述/README.md","filePath":"TNotes.en-notes/0009. 单词本概述/README.md"}');
const _sfc_main = { name: "TNotes.en-notes/0009. 单词本概述/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0009-单词本概述" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0009.%20%E5%8D%95%E8%AF%8D%E6%9C%AC%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">0009. 单词本概述</a> <a class="header-anchor" href="#0009-单词本概述" aria-label="Permalink to &quot;[0009. 单词本概述](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0009.%20%E5%8D%95%E8%AF%8D%E6%9C%AC%E6%A6%82%E8%BF%B0)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E5%8D%95%E8%AF%8D%E6%9C%AC%E7%BB%84%E4%BB%B6-enwordlistvue-%E5%8A%9F%E8%83%BD%E4%BB%8B%E7%BB%8D" target="_self" rel="noopener">2. 📒 单词本组件 <code>EnWordList.vue</code> 功能介绍</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>每个单词本存储 100 个词。</li><li>使用自定义的 EnWordList.vue 组件，完成单词本中词汇列表的渲染。</li><li>按照字母升序排序</li><li>自动生成编号</li><li>实现 checkbox 功能，以便临时自测。 <ul><li>实现 checkbox 缓存：将 checkout 状态存储在 local storage 中，以 pathname 和 word 拼接作为 key</li></ul></li></ul><h2 id="2--单词本组件-enwordlistvue-功能介绍" tabindex="-1">2. 📒 单词本组件 <code>EnWordList.vue</code> 功能介绍 <a class="header-anchor" href="#2--单词本组件-enwordlistvue-功能介绍" aria-label="Permalink to &quot;2. 📒 单词本组件 \`EnWordList.vue\` 功能介绍&quot;" target="_self" rel="noopener">​</a></h2><ul><li>单词卡片： <ul><li>单词卡片预加载。</li><li>Pin 单词卡片。</li><li>支持配置单词卡片是否自动弹出。</li></ul></li><li>朗读 <ul><li>单个词汇。</li><li>整个单词本的所有词汇。</li></ul></li><li>选中： <ul><li>全选功能。</li><li>全部重置功能。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.en-notes/0009. 单词本概述/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
