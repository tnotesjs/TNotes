import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0002. 25.04","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.change-log/0002. 25.04/README.md","filePath":"TNotes.change-log/0002. 25.04/README.md"}');
const _sfc_main = { name: "TNotes.change-log/0002. 25.04/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0002-2504" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.change-log/tree/main/notes/0002.%2025.04" target="_self" rel="noopener">0002. 25.04</a> <a class="header-anchor" href="#0002-2504" aria-label="Permalink to &quot;[0002. 25.04](https://github.com/Tdahuyou/TNotes.change-log/tree/main/notes/0002.%2025.04)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--250430" target="_self" rel="noopener">1. 🗓 25.04.30</a></li><li><a href="#2--250429" target="_self" rel="noopener">2. 🗓 25.04.29</a></li></ul><h2 id="1--250430" tabindex="-1">1. 🗓 25.04.30 <a class="header-anchor" href="#1--250430" aria-label="Permalink to &quot;1. 🗓 25.04.30&quot;" target="_self" rel="noopener">​</a></h2><ul><li>electron <ul><li>完成 <code>TNotes.electron</code> 仓库的初始化</li></ul></li><li>nodejs <ul><li>移除 vitepress 导入代码片段的语法 <code>&lt;&lt;&lt; @/filepath</code></li></ul></li></ul><h2 id="2--250429" tabindex="-1">2. 🗓 25.04.29 <a class="header-anchor" href="#2--250429" aria-label="Permalink to &quot;2. 🗓 25.04.29&quot;" target="_self" rel="noopener">​</a></h2><ul><li>TNotes <ul><li>知识库 <code>TNotes.xxx</code> 汇总到 TNotes 中，以便查阅 <ul><li>备注：</li><li>直接在 <code>update.js</code> 中做了修改，还存在一些问题： <ul><li>代码优化</li><li>有些笔记内容 README.md 依赖 vitepress 特性，比如动态加载文件 <code>&lt;&lt;&lt; ./demos/1/1.cjs</code> 等等，这意味着在搬运的时候需要连同 demos 目录一起搬运。</li></ul></li><li>根知识库 TNotes <ul><li>现在的效果： <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-10-23-47-06.png" alt="图 0" loading="lazy"></li><li>现在已经可以在根知识库中直接访问所有知识库的笔记了。</li></ul></li><li>新增： <ul><li>如果新增一个知识库，需要在根知识库 TNotes 中配置一下 sidebar，将新的知识库给引入到目录中。新的知识库的配置文件中需要加上 <code>&quot;rootDocsSrcDir&quot;: &quot;../\\_/docs/src&quot;,</code> 配置，值为根知识库的相对路径。</li></ul></li><li>改进： <ul><li>还有很多地方有待优化，根知识库中的一些全局文章也还没整理，还有一些旧版的知识库没有迁移。</li></ul></li></ul></li></ul></li><li>在知识库的菜单项中插入 <code>TODO.md</code>，以便查阅更新记录</li><li>每篇笔记结尾的更新时间，加上 <code>👣 xxxx</code></li><li><code>tn:new</code> 命令创建的笔记配置文件 <code>.tnotes.json</code> 中添加 id 字段</li><li>每篇笔记的评论 ID 引用当前笔记配置文件 <code>.tnotes.json</code> 中的 ID 字段</li><li>每篇笔记生成唯一的 id，丢到 <code>.tnotes.json</code> 中</li><li>每个知识库生成唯一的 id，丢到 <code>.tnotes.json</code> 中</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.change-log/0002. 25.04/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
