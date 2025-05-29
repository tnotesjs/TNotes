import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0031. 在 redux 中，store、reducer、action 三者之间的关系","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.react/0031. 在 redux 中，store、reducer、action 三者之间的关系/README.md","filePath":"TNotes.react/0031. 在 redux 中，store、reducer、action 三者之间的关系/README.md"}');
const _sfc_main = { name: "TNotes.react/0031. 在 redux 中，store、reducer、action 三者之间的关系/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0031-在-redux-中storereduceraction-三者之间的关系" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0031.%20%E5%9C%A8%20redux%20%E4%B8%AD%EF%BC%8Cstore%E3%80%81reducer%E3%80%81action%20%E4%B8%89%E8%80%85%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB" target="_self" rel="noopener">0031. 在 redux 中，store、reducer、action 三者之间的关系</a> <a class="header-anchor" href="#0031-在-redux-中storereduceraction-三者之间的关系" aria-label="Permalink to &quot;[0031. 在 redux 中，store、reducer、action 三者之间的关系](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0031.%20%E5%9C%A8%20redux%20%E4%B8%AD%EF%BC%8Cstore%E3%80%81reducer%E3%80%81action%20%E4%B8%89%E8%80%85%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--store" target="_self" rel="noopener">1. 📒 store</a></li><li><a href="#2--reducer" target="_self" rel="noopener">2. 📒 reducer</a></li><li><a href="#3--action" target="_self" rel="noopener">3. 📒 action</a></li></ul><ul><li>了解 redux 中的 3 个核心组成部分 store、reducer、action，并清楚它们之间的关系。</li></ul><h2 id="1--store" tabindex="-1">1. 📒 store <a class="header-anchor" href="#1--store" aria-label="Permalink to &quot;1. 📒 store&quot;" target="_self" rel="noopener">​</a></h2><ul><li>craeteStore 是用来创建仓库的方法，它接收两个参数 reducer、defaultState，返回一个仓库对象 store。 <ul><li>reducer 是封装了一系列处理 action 逻辑的纯函数，它会根据传入的 action 匹配不同的分支来改变仓库状态。</li><li>defaultState 这是仓库的默认值，该参数是可选的，在创建仓库的时候，可以通过 craeteStore 的第二个仓库来给仓库指定默认值。</li></ul></li></ul>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-51",
        class: "mermaid my-class",
        graph: "flowchart%20TD%0A%09%20%20reducer%20%20%09%09%09--%3E%20%20craeteStore%0A%09%20%20defaultState%20%20--%3E%20%20craeteStore%0A%09%20%20craeteStore%20%20%09--%3E%20%20store%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="2--reducer" tabindex="-1">2. 📒 reducer <a class="header-anchor" href="#2--reducer" aria-label="Permalink to &quot;2. 📒 reducer&quot;" target="_self" rel="noopener">​</a></h2><ul><li>reducer 是用来改变状态的，它需要接收两个参数 oldState、action，返回新的状态。 <ul><li>oldState 表示旧的状态值。</li><li>action 用于描述需要执行什么操作的平面对象 plain-object。</li></ul></li></ul>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-74",
        class: "mermaid my-class",
        graph: "flowchart%20TD%0A%09%20%20oldState%20%20--%3E%20%20reducer%0A%20%20%20%20action%20%20%20%20--%3E%20%20reducer%0A%09%09reducer%20%20%20--%3E%20%20newState%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="3--action" tabindex="-1">3. 📒 action <a class="header-anchor" href="#3--action" aria-label="Permalink to &quot;3. 📒 action&quot;" target="_self" rel="noopener">​</a></h2><ul><li>action 用于描述需要执行什么操作的平面对象 plain-object。</li><li>通过分发 action 来改变仓库的状态。</li><li>分发 action 的写法：store.dispatch(action)</li></ul>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-95",
        class: "mermaid my-class",
        graph: "stateDiagram-v2%0A%09%20%20action%20%20--%3E%20%20store%3A%20%09%09store.dispatch(action)%0A%09%09store%20%20%20--%3E%20%20reducer%3A%20%09store%20%E4%BC%9A%E6%8A%8A%E6%97%A7%E7%8A%B6%E6%80%81%E5%92%8C%20action%20%E4%BC%A0%E9%80%92%E7%BB%99%20reducer%20%E5%A4%84%E7%90%86%E3%80%82%0A%09%09reducer%20--%3E%20%20newState%3A%20%09reducer%20%E6%A0%B9%E6%8D%AE%E6%97%A7%E7%8A%B6%E6%80%81%E5%92%8C%20action%20%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84%E7%8A%B6%E6%80%81%E3%80%82%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.react/0031. 在 redux 中，store、reducer、action 三者之间的关系/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
