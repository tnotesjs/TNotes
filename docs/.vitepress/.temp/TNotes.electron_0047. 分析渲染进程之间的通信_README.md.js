import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/2024-10-05-23-50-07.Dt5ChDcr.png";
const __pageData = JSON.parse('{"title":"0047. 分析渲染进程之间的通信","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.electron/0047. 分析渲染进程之间的通信/README.md","filePath":"TNotes.electron/0047. 分析渲染进程之间的通信/README.md"}');
const _sfc_main = { name: "TNotes.electron/0047. 分析渲染进程之间的通信/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0047-分析渲染进程之间的通信" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1" target="_self" rel="noopener">0047. 分析渲染进程之间的通信</a> <a class="header-anchor" href="#0047-分析渲染进程之间的通信" aria-label="Permalink to &quot;[0047. 分析渲染进程之间的通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E9%94%99%E8%AF%AF%E5%81%9A%E6%B3%95-" target="_self" rel="noopener">1. 📒 错误做法 ❌</a></li><li><a href="#2--%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF" target="_self" rel="noopener">2. 📒 主进程转发消息</a></li><li><a href="#3--%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91-id" target="_self" rel="noopener">3. 📒 主进程转发 ID</a></li><li><a href="#4--%E8%B5%B0%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3" target="_self" rel="noopener">4. 📒 走消息端口</a></li></ul><ul><li>注意：mermaid 在 vitepress 中无法正常渲染，后续会将 mermaid 集成到 TNotes 中，在看笔记的时候，先点击标题，跳转到 github 上查看 mermaid 图。</li></ul><h2 id="1--错误做法-" tabindex="-1">1. 📒 错误做法 ❌ <a class="header-anchor" href="#1--错误做法-" aria-label="Permalink to &quot;1. 📒 错误做法 ❌&quot;" target="_self" rel="noopener">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-37",
        class: "mermaid my-class",
        graph: "sequenceDiagram%0A%20%20%20%20%20%20participant%20renderer1%0A%20%20%20%20%20%20participant%20renderer2%0A%20%20%20%20%20%20renderer1-%3E%3Erenderer2%3A%20%E5%98%BF%EF%BC%8C%E5%91%8A%E8%AF%89%E6%88%91%201%20%2B%202%20%E7%9A%84%E7%BB%93%E6%9E%9C%0A%20%20%20%20%20%20renderer2-%3E%3Erenderer1%3A%20%E5%A5%BD%E7%9A%84%EF%BC%8C%E7%BB%93%E6%9E%9C%E6%98%AF%203%0A%09%09%09Note%20over%20renderer1%2Crenderer2%3A%20%E9%94%99%E8%AF%AF%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>在 Electron 中，主进程只能有一个，但是渲染进程可以有多个，并且每个渲染进程之间是相互独立的，也就是说渲染进程和渲染进程之间互相并不知道彼此的存在，那么又何谈渲染进程之间的通信呢？</li><li>这时候就需要依赖主进程了，如果你想要实现渲染进程之间的互相通信。</li></ul><h2 id="2--主进程转发消息" tabindex="-1">2. 📒 主进程转发消息 <a class="header-anchor" href="#2--主进程转发消息" aria-label="Permalink to &quot;2. 📒 主进程转发消息&quot;" target="_self" rel="noopener">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-53",
        class: "mermaid my-class",
        graph: "sequenceDiagram%0A%20%20%20%20%20%20participant%20renderer1%0A%09%09%20%20participant%20main%0A%20%20%20%20%20%20participant%20renderer2%0A%20%20%20%20%20%20renderer1-%3E%3Emain%3A%20%E5%98%BF%EF%BC%8C%E6%88%91%E9%9C%80%E8%A6%81%20renderer2%20%E5%91%8A%E8%AF%89%E6%88%91%201%20%2B%202%20%E7%9A%84%E7%BB%93%E6%9E%9C%0A%09%09%09main-%3E%3Erenderer2%3A%20renderer1%20%E8%AF%A2%E9%97%AE%E4%BD%A0%201%20%2B%202%20%E7%9A%84%E7%BB%93%E6%9E%9C%0A%20%20%20%20%20%20renderer2-%3E%3Emain%3A%20%E5%A5%BD%E7%9A%84%EF%BC%8C%E7%BB%93%E6%9E%9C%E6%98%AF%203%0A%09%09%09main-%3E%3Erenderer1%3A%20%E7%BB%93%E6%9E%9C%E6%98%AF%203%0A%09%09%09Note%20over%20renderer1%2Crenderer2%3A%20%E6%AD%A3%E7%A1%AE%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>让主进程来帮你做转发消息。</li><li>electron.0042 这个笔记中的 demo1、demo2 使用的都是这种通信方式。</li></ul><h2 id="3--主进程转发-id" tabindex="-1">3. 📒 主进程转发 ID <a class="header-anchor" href="#3--主进程转发-id" aria-label="Permalink to &quot;3. 📒 主进程转发 ID&quot;" target="_self" rel="noopener">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-69",
        class: "mermaid my-class",
        graph: "sequenceDiagram%0A%20%20%20%20%20%20participant%20renderer1%0A%09%09%20%20participant%20main%0A%20%20%20%20%20%20participant%20renderer2%0A%20%20%20%20%20%20renderer1-%3E%3Emain%3A%20%E5%98%BF%EF%BC%8C%E8%AF%B7%E5%91%8A%E8%AF%89%E6%88%91%20renderer2%20%E7%9A%84%20ID%EF%BC%8C%E6%88%91%E9%9C%80%E8%A6%81%E8%B7%9F%E5%AE%83%E9%80%9A%E4%BF%A1%E3%80%82%0A%09%09%09main-%3E%3Erenderer1%3A%20renderer2%20%E7%9A%84%20ID%20%E6%98%AF%20xxx%0A%20%20%20%20%20%20renderer1-%3E%3Erenderer2%3A%20%E5%98%BF%EF%BC%8CID%20%E4%B8%BA%20xxx%20%E7%9A%84%E8%AF%B7%E5%91%8A%E8%AF%89%E6%88%91%201%20%2B%202%20%E7%9A%84%E7%BB%93%E6%9E%9C%0A%09%09%09renderer2-%3E%3Erenderer1%3A%20%E7%BB%93%E6%9E%9C%E6%98%AF%203%0A%09%09%09Note%20over%20renderer1%2Crenderer2%3A%20%E6%AD%A3%E7%A1%AE%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>让主进程告诉你，你想要与之通信的那个渲染进程的 ID，然后你再根据 ID 来给指定的渲染进程发消息。</li><li>electron.0041 该笔记中的 demo 采用的是这种通信方式。</li><li>上述两种方式都可以实现渲染进程之间的 <strong>间接</strong> 相互通信。在后续的内容中，我们将结合具体的示例来看看代码实现。</li></ul><h2 id="4--走消息端口" tabindex="-1">4. 📒 走消息端口 <a class="header-anchor" href="#4--走消息端口" aria-label="Permalink to &quot;4. 📒 走消息端口&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>🔍 查阅官方文档 &gt; Electron 中的消息端口</strong><ul><li><a href="https://www.electronjs.org/zh/docs/latest/tutorial/message-ports" target="_self" rel="noopener">https://www.electronjs.org/zh/docs/latest/tutorial/message-ports</a></li></ul></li><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li><li>使用 <strong>Electron 中的消息端口</strong> 来实现两个渲染进程之间的通信。</li><li>electron.0040 该笔记中的 demo 介绍了这种方式实现的详细步骤。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.electron/0047. 分析渲染进程之间的通信/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
