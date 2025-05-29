import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0084. 理解“请求”和“响应”","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0084. 理解“请求”和“响应”/README.md","filePath":"TNotes.nodejs/0084. 理解“请求”和“响应”/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0084. 理解“请求”和“响应”/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0084-理解请求和响应" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0084.%20%E7%90%86%E8%A7%A3%E2%80%9C%E8%AF%B7%E6%B1%82%E2%80%9D%E5%92%8C%E2%80%9C%E5%93%8D%E5%BA%94%E2%80%9D" target="_self" rel="noopener">0084. 理解“请求”和“响应”</a> <a class="header-anchor" href="#0084-理解请求和响应" aria-label="Permalink to &quot;[0084. 理解“请求”和“响应”](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0084.%20%E7%90%86%E8%A7%A3%E2%80%9C%E8%AF%B7%E6%B1%82%E2%80%9D%E5%92%8C%E2%80%9C%E5%93%8D%E5%BA%94%E2%80%9D)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li><li><a href="#2--%E7%A4%BA%E4%BE%8B---%E5%A4%96%E5%8D%96%E7%82%B9%E9%A4%90" target="_self" rel="noopener">2. 💻 示例 - 外卖点餐</a></li><li><a href="#3--%E8%AF%B7%E6%B1%82request" target="_self" rel="noopener">3. 📒 请求（Request）</a></li><li><a href="#4--%E5%93%8D%E5%BA%94response" target="_self" rel="noopener">4. 📒 响应（Response）</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>在计算机网络通信中，“请求”和“响应”是一对常见的概念，通常用于描述客户端与服务器之间的交互过程。</li><li><strong>请求（Request）</strong>： <ul><li>客户端向服务器发起的操作指令，希望服务器完成某个任务并返回结果。</li><li>例如，用户在浏览器中输入网址并按下回车键，这就是向服务器发送了一个请求。</li></ul></li><li><strong>响应（Response）</strong>： <ul><li>服务器接收到请求后，根据请求内容进行处理，并将处理结果返回给客户端。</li><li>例如，服务器接收到用户的请求后，返回网页内容或数据给浏览器。</li></ul></li></ul><h2 id="2--示例---外卖点餐" tabindex="-1">2. 💻 示例 - 外卖点餐 <a class="header-anchor" href="#2--示例---外卖点餐" aria-label="Permalink to &quot;2. 💻 示例 - 外卖点餐&quot;" target="_self" rel="noopener">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-74",
        class: "mermaid my-class",
        graph: "graph%20TB%0A%20%20%20%20A%5B%E7%94%A8%E6%88%B7%5D%20--%3E%7C%E8%AF%B7%E6%B1%82%20-%20%E9%80%9A%E8%BF%87%E6%89%8B%E6%9C%BA%E4%B8%8B%E5%8D%95%7C%20B%5B%E5%A4%96%E5%8D%96%E5%BA%97%5D%0A%20%20%20%20B%5B%E5%A4%96%E5%8D%96%E5%BA%97%5D%20--%3E%7C%E5%93%8D%E5%BA%94%20-%20%E6%8E%A5%E6%94%B6%E5%88%B0%E8%AE%A2%E5%8D%95%7C%20D%5B%E6%B4%BE%E9%80%81%E4%BA%BA%E5%91%98%5D%0A%20%20%20%20D%5B%E6%B4%BE%E9%80%81%E4%BA%BA%E5%91%98%5D%20--%3E%7C%E5%A4%84%E7%90%86%E5%AE%8C%E8%AF%B7%E6%B1%82%EF%BC%8C%E5%AE%8C%E6%88%90%E5%93%8D%E5%BA%94%E3%80%82%7C%20A%5B%E7%94%A8%E6%88%B7%5D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li><strong>请求</strong>：用户通过手机下单，相当于客户端向服务器发送了一个请求。</li><li><strong>响应</strong>：外卖店接收到订单后，制作好外卖并通过派送人员送达用户手中，相当于服务器处理完请求后返回了响应。</li><li>这种“请求-响应”的模式是现代网络通信的核心机制，无论是外卖点餐还是 Web 应用开发，都遵循这一基本流程。</li></ul><h2 id="3--请求request" tabindex="-1">3. 📒 请求（Request） <a class="header-anchor" href="#3--请求request" aria-label="Permalink to &quot;3. 📒 请求（Request）&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>定义</strong>：“请求”是指客户端向服务器发出的一种指令或请求，希望服务器执行某个操作并返回结果。</li><li><strong>类比</strong>：在图中的外卖点餐场景中，“请求”可以类比为用户通过手机下单的行为。用户通过手机向外卖店发送了一个订单信息，这个订单就是一种“请求”，告诉外卖店需要什么菜品、送到哪里等。</li><li><strong>Web 开发中的请求</strong>：在 Web 应用中，当用户在浏览器地址栏输入一个网址（例如 <code>https://www.taobao.com/</code>），按下回车键时，浏览器会向对应的服务器发送一个 HTTP 请求。这个请求包含了用户想要访问的内容（如首页内容）、请求的方式（如 GET 或 POST）以及其他相关信息（如请求头、参数等）。</li></ul><h2 id="4--响应response" tabindex="-1">4. 📒 响应（Response） <a class="header-anchor" href="#4--响应response" aria-label="Permalink to &quot;4. 📒 响应（Response）&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>定义</strong>：“响应”是指服务器接收到客户端的请求后，根据请求的内容进行处理，并将处理结果返回给客户端的过程。</li><li><strong>类比</strong>：在图中的外卖点餐场景中，“响应”可以类比为外卖店接到订单后，制作好外卖，并通过派送人员将外卖送到用户手中的过程。外卖店的“响应”是对外卖订单的处理结果，即用户所点的外卖。</li><li><strong>Web 开发中的响应</strong>：在 Web 应用中，当服务器接收到浏览器的请求后，它会根据请求的内容进行相应的处理（如查询数据库、生成页面等），然后将处理结果（如网页内容、JSON 数据等）封装成 HTTP 响应返回给浏览器。浏览器接收到响应后，会解析并显示给用户。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0084. 理解“请求”和“响应”/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
