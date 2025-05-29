import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2025-01-22-10-01-55.CC01t5fW.png";
const _imports_1 = "/notes/assets/2025-01-22-10-02-00.N0UKVgRj.png";
const __pageData = JSON.parse('{"title":"💭 TNotes 评论模块（Discussions）的技术实现","description":"","frontmatter":{},"headers":[],"relativePath":"tnotes/message-board.md","filePath":"tnotes/message-board.md"}');
const _sfc_main = { name: "tnotes/message-board.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="-tnotes-评论模块discussions的技术实现" tabindex="-1">💭 TNotes 评论模块（Discussions）的技术实现 <a class="header-anchor" href="#-tnotes-评论模块discussions的技术实现" aria-label="Permalink to &quot;💭 TNotes 评论模块（Discussions）的技术实现&quot;" target="_self" rel="noopener">​</a></h1><ul><li>评论功能是基于 <a href="https://giscus.app/zh-CN" target="_self" rel="noopener">Giscus</a> 实现的。</li><li>Giscus 是基于 GitHub Discussions 的评论系统。</li><li>用户通过 GitHub 登录后可以发表评论，评论会同步到你指定的 GitHub Discussion 中。</li><li>优点： <ul><li>免费，易于集成。</li><li>评论内容存储在 GitHub 对应仓库的 Discussions 中，不需要服务器。</li><li>支持 Markdown，SEO 友好。</li></ul></li><li>缺点： <ul><li>发布评论的前提是得有 GitHub 账号。</li><li>Giscus 提供的输入框不支持直接上传附件，如果要上传图片等 <code>📎附件资源</code> 需要通过原生的 Discusstions 来发。 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li><img${ssrRenderAttr("src", _imports_1)} alt="" loading="lazy"></li><li>在发布图片的时候，如果已经有了图片的超链接地址，那么可以直接采用 markdown 语法来发布。</li></ul></li></ul></li><li>集成步骤： <ol><li>前往 <a href="https://giscus.app/" target="_self" rel="noopener">Giscus</a> 配置页面。</li><li>填入你的 GitHub 仓库信息，选择是否使用 Discussions。</li><li>根据配置生成一段代码，将其添加到 VitePress 的 <code>themeConfig</code> 或自定义组件中。</li><li>发布后即可启用评论。</li></ol></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tnotes/message-board.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const messageBoard = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  messageBoard as default
};
