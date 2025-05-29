import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0085. 理解“客户端”和“服务端”","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.nodejs/0085. 理解“客户端”和“服务端”/README.md","filePath":"TNotes.nodejs/0085. 理解“客户端”和“服务端”/README.md"}');
const _sfc_main = { name: "TNotes.nodejs/0085. 理解“客户端”和“服务端”/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0085-理解客户端和服务端" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0085.%20%E7%90%86%E8%A7%A3%E2%80%9C%E5%AE%A2%E6%88%B7%E7%AB%AF%E2%80%9D%E5%92%8C%E2%80%9C%E6%9C%8D%E5%8A%A1%E7%AB%AF%E2%80%9D" target="_self" rel="noopener">0085. 理解“客户端”和“服务端”</a> <a class="header-anchor" href="#0085-理解客户端和服务端" aria-label="Permalink to &quot;[0085. 理解“客户端”和“服务端”](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0085.%20%E7%90%86%E8%A7%A3%E2%80%9C%E5%AE%A2%E6%88%B7%E7%AB%AF%E2%80%9D%E5%92%8C%E2%80%9C%E6%9C%8D%E5%8A%A1%E7%AB%AF%E2%80%9D)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📒 概述</a></li><li><a href="#2--%E7%A4%BA%E4%BE%8B---%E5%A4%96%E5%8D%96%E7%82%B9%E9%A4%90" target="_self" rel="noopener">2. 💻 示例 - 外卖点餐</a></li><li><a href="#3--%E5%AE%A2%E6%88%B7%E7%AB%AFclient" target="_self" rel="noopener">3. 📒 客户端（Client）</a></li><li><a href="#4--%E6%9C%8D%E5%8A%A1%E7%AB%AFserver" target="_self" rel="noopener">4. 📒 服务端（Server）</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📒 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📒 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li>在计算机网络通信中，“客户端”和“服务端”是两个核心概念，它们描述了网络交互的两端角色及其功能。结合图片中的外卖点餐场景以及 Web 应用开发的类比，我们可以更直观地理解这两个概念。</li><li><strong>客户端（Client）</strong>：是发起请求的一方，通常是一个用户或设备，负责提出需求并接收服务端返回的结果。例如，在 Web 应用中，浏览器就是客户端。</li><li><strong>服务端（Server）</strong>：是接收并处理客户端请求的一方，通常是一个运行在服务器上的程序或系统，负责根据客户端的请求进行处理并返回响应。例如，在 Web 应用中，淘宝的服务器就是服务端。</li></ul><h2 id="2--示例---外卖点餐" tabindex="-1">2. 💻 示例 - 外卖点餐 <a class="header-anchor" href="#2--示例---外卖点餐" aria-label="Permalink to &quot;2. 💻 示例 - 外卖点餐&quot;" target="_self" rel="noopener">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-50",
        class: "mermaid my-class",
        graph: "graph%20TB%0A%20%20%20%20C%5BWeb%E6%9C%8D%E5%8A%A1%E5%99%A8%5D%0A%0A%20%20%20%20subgraph%20%E5%AE%A2%E6%88%B7%E7%AB%AF%20-%201%0A%20%20%20%20%20%20%20%20A%5B%E7%94%A8%E6%88%B7A%5D%0A%20%20%20%20end%0A%0A%20%20%20%20subgraph%20%E5%AE%A2%E6%88%B7%E7%AB%AF%20-%202%0A%20%20%20%20%20%20%20%20B%5B%E7%94%A8%E6%88%B7B%5D%0A%20%20%20%20end%0A%0A%20%20%20%20subgraph%20%E5%AE%A2%E6%88%B7%E7%AB%AF%20-%20n%0A%20%20%20%20%20%20%20%20N%5B%E7%94%A8%E6%88%B7N%5D%0A%20%20%20%20end%0A%0A%20%20%20%20A%20--%3E%7C%E8%AF%B7%E6%B1%82%7C%20C%0A%20%20%20%20C%20--%3E%7C%E5%93%8D%E5%BA%94%7C%20A%0A%0A%20%20%20%20B%20--%3E%7C%E8%AF%B7%E6%B1%82%7C%20C%0A%20%20%20%20C%20--%3E%7C%E5%93%8D%E5%BA%94%7C%20B%0A%0A%20%20%20%20N%20--%3E%7C%E8%AF%B7%E6%B1%82%7C%20C%0A%20%20%20%20C%20--%3E%7C%E5%93%8D%E5%BA%94%7C%20N%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li><strong>客户端</strong>：下方的用户，代表发起请求的一方，类似于点外卖的用户。</li><li><strong>服务端</strong>：上方的服务器，代表接收并处理请求的一方，类似于外卖店。</li><li><strong>请求</strong>：客户端向服务端发送的操作指令，例如用户下单。</li><li><strong>响应</strong>：服务端处理完请求后返回的结果，例如外卖店制作好外卖并送达用户手中。</li><li>这种“客户端-服务端”的模式是现代网络通信的核心架构，无论是外卖点餐还是 Web 应用开发，都遵循这一基本模式。</li></ul><h2 id="3--客户端client" tabindex="-1">3. 📒 客户端（Client） <a class="header-anchor" href="#3--客户端client" aria-label="Permalink to &quot;3. 📒 客户端（Client）&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>定义</strong>：“客户端”是指发起请求的一方，通常是一个用户或设备，它向服务器端发送请求，并等待服务器端的响应。客户端的主要任务是提出需求并接收服务端返回的结果。</li><li><strong>类比</strong>：在图中的外卖点餐场景中，“客户端”可以类比为点外卖的用户。用户通过手机下单，告诉外卖店需要什么菜品、送到哪里等信息，这个过程就是客户端的行为。</li><li><strong>Web 开发中的客户端</strong>：在 Web 应用中，浏览器就是典型的客户端。当用户在浏览器中输入一个网址（例如 <code>https://www.taobao.com/</code>），按下回车键时，浏览器作为客户端会向对应的服务器发送一个 HTTP 请求。浏览器的作用是： <ul><li><strong>发起请求</strong>：将用户的操作（如访问网页、提交表单等）转化为请求发送给服务器。</li><li><strong>接收响应</strong>：从服务器接收返回的内容（如网页内容、JSON 数据等），并将其展示给用户。</li></ul></li></ul><h2 id="4--服务端server" tabindex="-1">4. 📒 服务端（Server） <a class="header-anchor" href="#4--服务端server" aria-label="Permalink to &quot;4. 📒 服务端（Server）&quot;" target="_self" rel="noopener">​</a></h2><ul><li><strong>定义</strong>：“服务端”是指接收并处理客户端请求的一方，通常是一个运行在服务器上的程序或系统。服务端的主要任务是根据客户端的请求进行处理，并将处理结果返回给客户端。</li><li><strong>类比</strong>：在图中的外卖点餐场景中，“服务端”可以类比为外卖店。外卖店接收到用户的订单后，会制作好外卖，并通过派送人员将外卖送到用户手中，这个过程就是服务端的行为。</li><li><strong>Web 开发中的服务端</strong>：在 Web 应用中，服务器端通常是由一台或多台服务器组成的系统，负责处理客户端的请求并返回响应。例如，淘宝的服务器就是服务端。当用户访问淘宝网站时： <ul><li><strong>接收请求</strong>：服务器接收到浏览器发送的请求（如请求首页内容）。</li><li><strong>处理请求</strong>：服务器根据请求的内容进行处理，可能包括查询数据库、生成页面等内容。</li><li><strong>返回响应</strong>：服务器将处理结果（如网页内容、JSON 数据等）封装成 HTTP 响应返回给浏览器。</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.nodejs/0085. 理解“客户端”和“服务端”/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
