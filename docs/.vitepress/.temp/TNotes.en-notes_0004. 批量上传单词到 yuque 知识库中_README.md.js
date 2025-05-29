import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-26-19-07-52.BL7gvUI8.png";
const __pageData = JSON.parse('{"title":"0004. 批量上传单词到 yuque 知识库中","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.en-notes/0004. 批量上传单词到 yuque 知识库中/README.md","filePath":"TNotes.en-notes/0004. 批量上传单词到 yuque 知识库中/README.md"}');
const _sfc_main = { name: "TNotes.en-notes/0004. 批量上传单词到 yuque 知识库中/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0004-批量上传单词到-yuque-知识库中" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD" target="_self" rel="noopener">0004. 批量上传单词到 yuque 知识库中</a> <a class="header-anchor" href="#0004-批量上传单词到-yuque-知识库中" aria-label="Permalink to &quot;[0004. 批量上传单词到 yuque 知识库中](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0004.%20%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%8D%95%E8%AF%8D%E5%88%B0%20yuque%20%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%AD)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">1. 📝 简介</a></li><li><a href="#2--notes" target="_self" rel="noopener">2. 📒 notes</a></li></ul><h2 id="1--简介" tabindex="-1">1. 📝 简介 <a class="header-anchor" href="#1--简介" aria-label="Permalink to &quot;1. 📝 简介&quot;" target="_self" rel="noopener">​</a></h2><ul><li>该笔记中记录的脚本，解决的问题 —— 将单词数据批量上传到 yuque 知识库上。</li><li>截止目前（2024 年 10 月 26 日）需要 yuque 超级会员，获取到 token 才能使用。</li></ul><h2 id="2--notes" tabindex="-1">2. 📒 notes <a class="header-anchor" href="#2--notes" aria-label="Permalink to &quot;2. 📒 notes&quot;" target="_self" rel="noopener">​</a></h2><ul><li>这里边的内容也是早期基于 en-notes.0002 来修改的，作用是将单词数据推送到 yuque 知识库中。yuque 官方有暴露一些文档的 API 访问权限，需要绑定自己的 token 即可访问相关接口。</li><li>最终效果 <ul><li><a href="https://www.yuque.com/tdahuyou/en/cancel" target="_self" rel="noopener">https://www.yuque.com/tdahuyou/en/cancel</a><ul><li>【注】这个知识库会清空掉，这里仅仅是放一个链接辅助说明。 <ul><li>目前（2024 年 10 月 26 日）将词汇数据的格式做了一些调整，并搬运到了 github 上。 <ul><li>比如 <a href="https://github.com/Tdahuyou/en-words/blob/main/cancel.md" target="_self" rel="noopener">https://github.com/Tdahuyou/en-words/blob/main/cancel.md</a></li><li>详情见 en-notes.0001 笔记描述。</li></ul></li></ul></li><li>有一个知识库的基地址，比如 <a href="https://www.yuque.com/tdahuyou/en/" target="_self" rel="noopener">https://www.yuque.com/tdahuyou/en/</a></li><li>解析出来的单词数据存储在一个个 .md 文件中，比如将 cancel.md 中的数据推送到语雀上的这个知识库里边后，会在路径后拼接上该单词的名称，比如 <a href="https://www.yuque.com/tdahuyou/en/cancel" target="_self" rel="noopener">https://www.yuque.com/tdahuyou/en/cancel</a> 这样就能快速查询到相关词汇了，并且如果有需要的话在 yuque 上也能对非常方便地对这些单词进行二次编辑。</li></ul></li><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li></ul></li><li>阅读脚本的时候可以参考这 en-notes.0002 里边的脚本来一起看看。</li><li>【注】目前（2024 年 10 月 26 日）脚本还未测试过是否可用，或许已经没法用了。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.en-notes/0004. 批量上传单词到 yuque 知识库中/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
