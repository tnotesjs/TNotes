import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"📒 emoji 规范","description":"","frontmatter":{},"headers":[],"relativePath":"tnotes/emoji.md","filePath":"tnotes/emoji.md"}');
const _sfc_main = { name: "tnotes/emoji.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-emoji-规范" tabindex="-1">📒 emoji 规范 <a class="header-anchor" href="#-emoji-规范" aria-label="Permalink to &quot;📒 emoji 规范&quot;" target="_self" rel="noopener">​</a></h1><div class="info custom-block"><p class="custom-block-title">概述</p><ul><li>记录在写笔记的时候常用到的一些 emoji 规范，主要包括： <ul><li>如何快速输入这些 emoji；</li><li>这些 emoji 代表的含义是什么；</li></ul></li><li>使用 emoji 的好处是阅读起来更加直观，可以快速了解某个节点下的内容大致是什么类型。</li></ul></div><ul><li>⏰ <ul><li>闹钟 <ul><li>微信输入法：输入 <code>nao zhong</code> 即可快速输入。</li></ul></li><li>表示待办事项。</li></ul></li><li>📝 <ul><li>记录 <ul><li>微信输入法：输入 <code>ji lu</code> 即可快速输入。</li></ul></li><li>summary</li><li>概述</li><li>表示总结性的一些描述信息。</li></ul></li><li>💻 <ul><li>电脑 <ul><li>微信输入法：输入 <code>dian nao</code> 即可快速输入。</li></ul></li><li>demo</li><li>表示示例。</li></ul></li><li>📒 <ul><li>笔记 <ul><li>微信输入法：输入 <code>bi ji</code> 即可快速输入。</li></ul></li><li>notes</li><li>表示笔记。</li></ul></li><li>⚙️ <ul><li>齿轮 <ul><li>微信输入法：输入 <code>chi lun</code> 即可快速输入。</li></ul></li><li>表示模块中的组成部分，工程由一个个小齿轮组成，比如： <ul><li>函数</li><li>变量</li><li>属性</li><li>成员</li></ul></li></ul></li><li>🔍 <ul><li>放大镜、查询、搜索 <ul><li>微信输入法：输入 <code>fang da jing</code>、<code>cha xun</code>、<code>sou suo</code> 即可快速输入。</li></ul></li><li>搜索</li><li>表示查看源码，或者查看某篇 具体的 文章等。</li></ul></li><li>🔗 <ul><li>链接 <ul><li>微信输入法：输入 <code>lian jie</code> 即可快速输入。</li></ul></li><li>表示链接的集合，一篇笔记中的所有链接都汇总到 🔗 中。</li></ul></li><li>🤖 <ul><li>机器人 <ul><li>微信输入法：输入 <code>ji qi ren</code> 即可快速输入。</li></ul></li><li>表示 AI 回复。</li></ul></li><li>✍️ <ul><li>写字 <ul><li>微信输入法：输入 <code>xie zi</code> 即可快速输入。</li></ul></li><li>表示“随笔”、“练习题”、“面试题”等。</li></ul></li><li>🔨 <ul><li>锤子 <ul><li>微信输入法：输入 <code>chui zi</code> 即可快速输入。</li></ul></li><li>表示“工具”、“架构”等。</li></ul></li><li>🤔 <ul><li>思考 <ul><li>微信输入法：输入 <code>si kao</code> 即可快速输入。</li></ul></li><li>表示思考问题，提出问题。</li></ul></li><li>💡 <ul><li>灯泡 <ul><li>微信输入法：输入 <code>deng pao</code> 即可快速输入。</li></ul></li><li>表示一些想法、建议等。</li></ul></li><li>👨‍🏫 <ul><li>老师 <ul><li>微信输入法：输入 <code>lao shi</code> 即可快速输入。</li></ul></li><li>表示一些学习资源，比如 Bilibili 上某些教程内容。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tnotes/emoji.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const emoji = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  emoji as default
};
