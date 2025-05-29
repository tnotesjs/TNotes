import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.notes/0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图/README.md","filePath":"TNotes.notes/0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图/README.md"}');
const _sfc_main = { name: "TNotes.notes/0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0027-mindmap-with-mermaidjs---使用-mermaid-来绘制思维导图" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0027.%20Mindmap%20with%20Mermaid.js%20-%20%E4%BD%BF%E7%94%A8%20mermaid%20%E6%9D%A5%E7%BB%98%E5%88%B6%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE" target="_self" rel="noopener">0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图</a> <a class="header-anchor" href="#0027-mindmap-with-mermaidjs---使用-mermaid-来绘制思维导图" aria-label="Permalink to &quot;[0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0027.%20Mindmap%20with%20Mermaid.js%20-%20%E4%BD%BF%E7%94%A8%20mermaid%20%E6%9D%A5%E7%BB%98%E5%88%B6%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--youtube---mindmap-with-mermaidjs" target="_self" rel="noopener">1. 🔗 YouTube - Mindmap with Mermaid.js</a></li><li><a href="#2--mermaid-%E5%AE%98%E6%96%B9%E5%8D%9A%E5%AE%A2---mermaidchart---%E4%BB%8E%E6%B7%B7%E6%B2%8C%E5%88%B0%E6%B8%85%E6%99%B0%E4%BD%BF%E7%94%A8-mermaidjs-%E6%8E%A2%E7%B4%A2%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE" target="_self" rel="noopener">2. 🔗 mermaid 官方博客 - MermaidChart - 从混沌到清晰：使用 Mermaid.js 探索思维导图</a></li><li><a href="#3--mermaid-%E5%AE%98%E6%96%B9%E5%8D%9A%E5%AE%A2---mindmap-%E8%AF%AD%E6%B3%95" target="_self" rel="noopener">3. 🔗 mermaid 官方博客 - mindmap 语法</a></li><li><a href="#4--font-awesome-5material-design-icons-%E5%9B%BE%E6%A0%87%E5%BA%93---%E5%8F%AF%E4%BB%A5%E5%9C%A8-mermaidjs-%E7%BB%98%E5%88%B6%E7%9A%84%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E4%B8%AD%E6%8F%92%E5%85%A5%E5%9B%BE%E6%A0%87" target="_self" rel="noopener">4. 🔗 Font Awesome 5、Material Design Icons 图标库 - 可以在 mermaid.js 绘制的思维导图中插入图标</a></li><li><a href="#5--%E7%BC%A9%E8%BF%9B%E8%AF%AD%E6%B3%95" target="_self" rel="noopener">5. 📒 缩进语法</a></li><li><a href="#6--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E9%BB%98%E8%AE%A4%E5%BD%A2%E7%8A%B6%E8%8A%82%E7%82%B9" target="_self" rel="noopener">6. 📒 节点形状 - 默认形状节点</a></li><li><a href="#7--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E7%9F%A9%E5%BD%A2%E8%8A%82%E7%82%B9" target="_self" rel="noopener">7. 📒 节点形状 - 矩形节点</a></li><li><a href="#8--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%E8%8A%82%E7%82%B9" target="_self" rel="noopener">8. 📒 节点形状 - 圆角矩形节点</a></li><li><a href="#9--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E5%9C%86%E5%BD%A2%E8%8A%82%E7%82%B9" target="_self" rel="noopener">9. 📒 节点形状 - 圆形节点</a></li><li><a href="#10--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E7%88%86%E7%82%B8--%E8%8A%82%E7%82%B9" target="_self" rel="noopener">10. 📒 节点形状 - 爆炸 💥 节点</a></li><li><a href="#11--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E4%BA%91%E6%9C%B5-%EF%B8%8F-%E8%8A%82%E7%82%B9" target="_self" rel="noopener">11. 📒 节点形状 - 云朵 ☁️ 节点</a></li><li><a href="#12--%E8%8A%82%E7%82%B9%E5%BD%A2%E7%8A%B6---%E5%85%AD%E8%A7%92%E5%BD%A2%E8%8A%82%E7%82%B9" target="_self" rel="noopener">12. 📒 节点形状 - 六角形节点</a></li><li><a href="#13--%E5%9B%BE%E6%A0%87%E8%AF%AD%E6%B3%95---icon---%E6%B3%A8%E4%B8%8D%E5%A5%BD%E4%BD%BF" target="_self" rel="noopener">13. 📒 图标语法 - <code>::icon()</code> - 注：不好使</a></li><li><a href="#14--%E5%9B%BE%E6%A0%87%E7%9A%84%E6%9B%BF%E4%BB%A3%E6%96%B9%E6%A1%88---%E4%BD%BF%E7%94%A8-emoji" target="_self" rel="noopener">14. 📒 图标的替代方案 - 使用 emoji</a></li><li><a href="#15--%E6%A0%B7%E5%BC%8F%E8%AF%AD%E6%B3%95---classname---%E6%B3%A8%E4%B8%8D%E5%A5%BD%E4%BD%BF" target="_self" rel="noopener">15. 📒 样式语法 - <code>:::className</code> - 注：不好使</a></li><li><a href="#16--markdown-strings-%E7%89%B9%E6%80%A7" target="_self" rel="noopener">16. 📒 Markdown Strings 特性</a></li><li><a href="#17--%E7%BB%98%E5%88%B6%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E6%B5%8B%E8%AF%95" target="_self" rel="noopener">17. 💻 绘制思维导图测试</a></li></ul><ul><li>该笔记提供了 mermaid 思维导图的语法、缩进规则和节点形状，涵盖了如何通过不同的缩进表示层次关系及自定义节点形状（如矩形、圆形、云朵等）。</li><li>补充了图标和样式的用法，但因集成限制，该功能效果不稳定，推荐使用 emoji 作为替代。</li><li>Markdown Strings 特性使得节点支持格式化文本及多行显示，进一步增强了思维导图的表现力。</li></ul><h2 id="1--youtube---mindmap-with-mermaidjs" tabindex="-1">1. 🔗 YouTube - Mindmap with Mermaid.js <a class="header-anchor" href="#1--youtube---mindmap-with-mermaidjs" aria-label="Permalink to &quot;1. 🔗 YouTube - Mindmap with Mermaid.js&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://www.youtube.com/watch?v=dF9FAg73pQI" target="_self" rel="noopener">https://www.youtube.com/watch?v=dF9FAg73pQI</a></li></ul><h2 id="2--mermaid-官方博客---mermaidchart---从混沌到清晰使用-mermaidjs-探索思维导图" tabindex="-1">2. 🔗 mermaid 官方博客 - MermaidChart - 从混沌到清晰：使用 Mermaid.js 探索思维导图 <a class="header-anchor" href="#2--mermaid-官方博客---mermaidchart---从混沌到清晰使用-mermaidjs-探索思维导图" aria-label="Permalink to &quot;2. 🔗 mermaid 官方博客 - MermaidChart - 从混沌到清晰：使用 Mermaid.js 探索思维导图&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://www.mermaidchart.com/blog/posts/from-chaos-to-clarity-exploring-mind-maps-with-mermaidjs/" target="_self" rel="noopener">https://www.mermaidchart.com/blog/posts/from-chaos-to-clarity-exploring-mind-maps-with-mermaidjs/</a><ul><li>mermaid 官方博客 - MermaidChart</li><li>From Chaos to Clarity: Exploring Mind Maps with MermaidJS <ul><li>译：从混沌到清晰：使用 Mermaid.js 探索思维导图</li></ul></li></ul></li></ul><h2 id="3--mermaid-官方博客---mindmap-语法" tabindex="-1">3. 🔗 mermaid 官方博客 - mindmap 语法 <a class="header-anchor" href="#3--mermaid-官方博客---mindmap-语法" aria-label="Permalink to &quot;3. 🔗 mermaid 官方博客 - mindmap 语法&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://mermaid.js.org/syntax/mindmap.html" target="_self" rel="noopener">https://mermaid.js.org/syntax/mindmap.html</a><ul><li>mermaid 官方文档，这篇文档介绍的是如何使用 Mermaid 工具来创建思维导图（Mindmap）。</li></ul></li></ul><h2 id="4--font-awesome-5material-design-icons-图标库---可以在-mermaidjs-绘制的思维导图中插入图标" tabindex="-1">4. 🔗 Font Awesome 5、Material Design Icons 图标库 - 可以在 mermaid.js 绘制的思维导图中插入图标 <a class="header-anchor" href="#4--font-awesome-5material-design-icons-图标库---可以在-mermaidjs-绘制的思维导图中插入图标" aria-label="Permalink to &quot;4. 🔗 Font Awesome 5、Material Design Icons 图标库 - 可以在 mermaid.js 绘制的思维导图中插入图标&quot;" target="_self" rel="noopener">​</a></h2><ul><li><a href="https://fontawesome.com/v5/search" target="_self" rel="noopener">https://fontawesome.com/v5/search</a><ul><li>Font Awesome 5 图标库</li></ul></li><li><a href="https://pictogrammers.com/library/mdi/" target="_self" rel="noopener">https://pictogrammers.com/library/mdi/</a><ul><li>Material Design Icons 图标库</li></ul></li></ul><h2 id="5--缩进语法" tabindex="-1">5. 📒 缩进语法 <a class="header-anchor" href="#5--缩进语法" aria-label="Permalink to &quot;5. 📒 缩进语法&quot;" target="_self" rel="noopener">​</a></h2><ul><li>缩进语法</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  Root</span></span>
<span class="line"><span>    A</span></span>
<span class="line"><span>      B</span></span>
<span class="line"><span>      C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><ul><li>或者下面这种形式</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>Root</span></span>
<span class="line"><span>  A</span></span>
<span class="line"><span>    B</span></span>
<span class="line"><span>    C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><ul><li>最终渲染出来的效果如下</li></ul>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-220",
        class: "mermaid my-class",
        graph: "mindmap%0ARoot%0A%20%20A%0A%20%20%20%20B%0A%20%20%20%20C%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>在思维导图中，节点之间的缩进用于表示层次关系。但是，具体的缩进量并不重要，重要的是相对缩进。</li><li>Mermaid 会根据相对缩进来确定节点之间的关系。如果缩进不明确，Mermaid 会尝试通过已知的关系来补偿。</li><li>示例 - 假设我们有以下思维导图</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>    Root</span></span>
<span class="line"><span>        A</span></span>
<span class="line"><span>            B</span></span>
<span class="line"><span>          C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-239",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%20%20Root%0A%20%20%20%20%20%20%20%20A%0A%20%20%20%20%20%20%20%20%20%20%20%20B%0A%20%20%20%20%20%20%20%20%20%20C%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>在这个示例中： <ul><li>A 是 Root 的子节点。</li><li>B 是 A 的子节点。</li><li>C 的缩进介于 A 和 B 之间，导致层次关系不明确。</li></ul></li><li>解释 <ul><li>明确的关系： <ul><li>B 明显是 A 的子节点，因为 B 的缩进比 A 大。</li></ul></li><li>不明确的关系： <ul><li>C 的缩进比 B 小，但比 A 大。这使得 C 的层次关系不明确。</li><li>C 既不是 B 的子节点（因为它的缩进比 B 小），也不是 B 的同级节点（因为它的缩进不同）。</li></ul></li><li>Mermaid 的处理方式： <ul><li>Mermaid 会寻找最近的一个具有更小缩进的节点作为父节点。</li><li>在这个例子中，A 是最近的一个具有更小缩进的节点。</li><li>因此，Mermaid 会将 C 作为 A 的子节点，而不是 B 的子节点或兄弟节点。</li></ul></li></ul></li><li>如果想要表达的 —— C 是 B 的子节点，那么你可以这么写：</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>    Root</span></span>
<span class="line"><span>        A</span></span>
<span class="line"><span>            B</span></span>
<span class="line"><span>                C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-328",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%20%20Root%0A%20%20%20%20%20%20%20%20A%0A%20%20%20%20%20%20%20%20%20%20%20%20B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20C%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>如果想要表达的 —— C 是 B 的兄弟节点，那么你可以这么写：</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>    Root</span></span>
<span class="line"><span>        A</span></span>
<span class="line"><span>            B</span></span>
<span class="line"><span>            C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-337",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%20%20Root%0A%20%20%20%20%20%20%20%20A%0A%20%20%20%20%20%20%20%20%20%20%20%20B%0A%20%20%20%20%20%20%20%20%20%20%20%20C%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>如果想要表达的 —— C 是 A 的兄弟节点，那么你可以这么写：</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>    Root</span></span>
<span class="line"><span>        A</span></span>
<span class="line"><span>            B</span></span>
<span class="line"><span>        C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-346",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%20%20Root%0A%20%20%20%20%20%20%20%20A%0A%20%20%20%20%20%20%20%20%20%20%20%20B%0A%20%20%20%20%20%20%20%20C%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="6--节点形状---默认形状节点" tabindex="-1">6. 📒 节点形状 - 默认形状节点 <a class="header-anchor" href="#6--节点形状---默认形状节点" aria-label="Permalink to &quot;6. 📒 节点形状 - 默认形状节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  I am the default shape</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-351",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20I%20am%20the%20default%20shape%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="7--节点形状---矩形节点" tabindex="-1">7. 📒 节点形状 - 矩形节点 <a class="header-anchor" href="#7--节点形状---矩形节点" aria-label="Permalink to &quot;7. 📒 节点形状 - 矩形节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  id[I am a square]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-356",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20id%5BI%20am%20a%20square%5D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>补充：在官方文档中，并没有提及在 mermaid 中的 id 有什么用，这里可以认为它其实没啥作用，写或者不写，最终渲染的结果都是一样的。因此在写的时候，只需要给节点包裹 <code>[]</code> 即可。</li><li>下面是删除 id 后的写法。</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  [I am a square]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-370",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%5BI%20am%20a%20square%5D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="8--节点形状---圆角矩形节点" tabindex="-1">8. 📒 节点形状 - 圆角矩形节点 <a class="header-anchor" href="#8--节点形状---圆角矩形节点" aria-label="Permalink to &quot;8. 📒 节点形状 - 圆角矩形节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  (I am a rounded square)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-375",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20(I%20am%20a%20rounded%20square)%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="9--节点形状---圆形节点" tabindex="-1">9. 📒 节点形状 - 圆形节点 <a class="header-anchor" href="#9--节点形状---圆形节点" aria-label="Permalink to &quot;9. 📒 节点形状 - 圆形节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  ((I am a circle))</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-380",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20((I%20am%20a%20circle))%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="10--节点形状---爆炸--节点" tabindex="-1">10. 📒 节点形状 - 爆炸 💥 节点 <a class="header-anchor" href="#10--节点形状---爆炸--节点" aria-label="Permalink to &quot;10. 📒 节点形状 - 爆炸 💥 节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  ))I am a bang((</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-385",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20))I%20am%20a%20bang((%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="11--节点形状---云朵-️-节点" tabindex="-1">11. 📒 节点形状 - 云朵 ☁️ 节点 <a class="header-anchor" href="#11--节点形状---云朵-️-节点" aria-label="Permalink to &quot;11. 📒 节点形状 - 云朵 ☁️ 节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  )I am a cloud(</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-390",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20)I%20am%20a%20cloud(%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="12--节点形状---六角形节点" tabindex="-1">12. 📒 节点形状 - 六角形节点 <a class="header-anchor" href="#12--节点形状---六角形节点" aria-label="Permalink to &quot;12. 📒 节点形状 - 六角形节点&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  {{I am a hexagon}}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-395",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%7B%7BI%20am%20a%20hexagon%7D%7D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="13--图标语法---icon---注不好使" tabindex="-1">13. 📒 图标语法 - <code>::icon()</code> - 注：不好使 <a class="header-anchor" href="#13--图标语法---icon---注不好使" aria-label="Permalink to &quot;13. 📒 图标语法 - \`::icon()\` - 注：不好使&quot;" target="_self" rel="noopener">​</a></h2><blockquote><p>As with flowcharts you can add icons to your nodes but with an updated syntax. The styling for the font based icons are added during the integration so that they are available for the web page. This is not something a diagram author can do but has to be done with the site administrator or the integrator. Once the icon fonts are in place you add them to the mind map nodes using the ::icon() syntax. You place the classes for the icon within the parenthesis like in the following example where icons for material design and Font Awesome 5 are displayed. The intention is that this approach should be used for all diagrams supporting icons. Experimental feature: This wider scope is also the reason Mindmaps are experimental as this syntax and approach could change. from: mermaid 官方文档。</p></blockquote><div class="note custom-block github-alert"><p class="custom-block-title">NOTE</p><p>不建议使用 icon。 从官方的这一大段描述来看，大概就是在告诉我们，icon 这个功能，现在还不完善，存在一系列的问题。主要原因在于图标这玩意儿不好加，可能在编写文档的作者电脑上可以正常看到这些 icon（因为装了对应的图标库），但是在用户设备上，可能就无法正常显示了。而且有些图标可能可以正常展示，而有些图标或许又显示不了（这可能跟图标库的版本有关）。</p></div><ul><li>图标字体的集成 <ul><li>集成过程：图标字体的样式需要在网页集成过程中添加，以便在网页上可用。</li><li>管理员或集成者操作：这一步骤通常由网站管理员或集成者完成，而不是图表作者。这意味着你需要确保你的网站或应用已经集成了所需的图标字体库（如 Material Design 或 Font Awesome 5）。</li></ul></li><li>实验性功能 <ul><li>实验性质：由于这种更广泛的图标支持是实验性的，因此语法和方法可能会在未来版本中发生变化。这也是为什么思维导图被标记为实验性功能的原因之一。</li></ul></li><li><strong>问：如何搜索图标？</strong><ul><li>进入下面的站点，找图标。</li><li><a href="https://fontawesome.com/v5/search" target="_self" rel="noopener">https://fontawesome.com/v5/search</a><ul><li>Font Awesome 5 图标库</li></ul></li><li><a href="https://pictogrammers.com/library/mdi/" target="_self" rel="noopener">https://pictogrammers.com/library/mdi/</a><ul><li>Material Design Icons 图标库</li><li>比如想要添加一个房子的图标，搜索到了 home 是想要的，那么只需要在对应的节点后面加上 <code>::icon(mdi mdi-home)</code> 即可。 <ul><li>如果是在 Font Awesome 5 图标库中找到的图标，将前缀 mdi 改为 fa 即可。</li></ul></li><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-19-10-25-54.png" alt="" loading="lazy"></li></ul></li></ul></li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  root((中心主题))</span></span>
<span class="line"><span>    I am a square::icon(fa fa-square)</span></span>
<span class="line"><span>    Another node::icon(mdi mdi-home)</span></span>
<span class="line"><span>    Child node</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-494",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20root((%E4%B8%AD%E5%BF%83%E4%B8%BB%E9%A2%98))%0A%20%20%20%20I%20am%20a%20square%3A%3Aicon(fa%20fa-square)%0A%20%20%20%20Another%20node%3A%3Aicon(mdi%20mdi-home)%0A%20%20%20%20Child%20node%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li><strong>问：如果使用图标的话，可以正常渲染出来吗？</strong><ul><li>测试结果如下： <ul><li>下面的截图来自 mermaid 官方的渲染结果： <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-19-10-46-00.png" alt="" loading="lazy"></li><li>这可能是我们想要的结果，官方站点或许集成了这些图标，打开站点的时候就把这些字体图标请求过来了。</li></ul></li><li>下面的截图来自 GitHub 上的渲染结果： <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-19-10-47-10.png" alt="" loading="lazy"></li><li>两个图标都没法渲染，但是图标的位置是被保留了。</li></ul></li><li>下面的截图来自本地 VSCode 中的 markdown preview enhanced 插件的渲染结果： <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-19-10-45-27.png" alt="" loading="lazy"></li><li>成功渲染了一个图标。</li></ul></li></ul></li></ul></li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  Root</span></span>
<span class="line"><span>    A</span></span>
<span class="line"><span>    ::icon(fa fa-book)</span></span>
<span class="line"><span>    B(B)</span></span>
<span class="line"><span>    ::icon(mdi mdi-skull-outline)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-563",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20Root%0A%20%20%20%20A%0A%20%20%20%20%3A%3Aicon(fa%20fa-book)%0A%20%20%20%20B(B)%0A%20%20%20%20%3A%3Aicon(mdi%20mdi-skull-outline)%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="14--图标的替代方案---使用-emoji" tabindex="-1">14. 📒 图标的替代方案 - 使用 emoji <a class="header-anchor" href="#14--图标的替代方案---使用-emoji" aria-label="Permalink to &quot;14. 📒 图标的替代方案 - 使用 emoji&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  Root</span></span>
<span class="line"><span>    房子 emoji 👉 🏠</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-568",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20Root%0A%20%20%20%20%E6%88%BF%E5%AD%90%20emoji%20%F0%9F%91%89%20%F0%9F%8F%A0%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="15--样式语法---classname---注不好使" tabindex="-1">15. 📒 样式语法 - <code>:::className</code> - 注：不好使 <a class="header-anchor" href="#15--样式语法---classname---注不好使" aria-label="Permalink to &quot;15. 📒 样式语法 - \`:::className\` - 注：不好使&quot;" target="_self" rel="noopener">​</a></h2><ul><li>和 icon 一样，需要站点集成，才能正常渲染。</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>    Root</span></span>
<span class="line"><span>        A[A]</span></span>
<span class="line"><span>        :::urgent large</span></span>
<span class="line"><span>        B(B)</span></span>
<span class="line"><span>        C</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-580",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%20%20Root%0A%20%20%20%20%20%20%20%20A%5BA%5D%0A%20%20%20%20%20%20%20%20%3A%3A%3Aurgent%20large%0A%20%20%20%20%20%20%20%20B(B)%0A%20%20%20%20%20%20%20%20C%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="16--markdown-strings-特性" tabindex="-1">16. 📒 Markdown Strings 特性 <a class="header-anchor" href="#16--markdown-strings-特性" aria-label="Permalink to &quot;16. 📒 Markdown Strings 特性&quot;" target="_self" rel="noopener">​</a></h2><ul><li>“Markdown Strings”特性，该特性增强了思维导图的功能，支持更多的文本格式选项，并且能够自动换行。</li><li>Markdown Strings 特性 <ul><li>增强功能：通过使用更灵活的字符串类型，支持文本格式化选项，如加粗和斜体。</li><li>自动换行：自动处理标签内的文本换行，当文本过长时会自动换行。</li><li>多行文本：允许在标签内直接使用换行符来创建多行文本。</li></ul></li><li>代码示例：</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>    id1[&quot;\`**Root** with</span></span>
<span class="line"><span>a second line</span></span>
<span class="line"><span>Unicode works too: 🤓\`&quot;]</span></span>
<span class="line"><span>      id2[&quot;\`The dog in **the** hog... a *very long text* that wraps to a new line\`&quot;]</span></span>
<span class="line"><span>      id3[Regular labels still works]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-619",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20%20%20id1%5B%22%60**Root**%20with%0Aa%20second%20line%0AUnicode%20works%20too%3A%20%F0%9F%A4%93%60%22%5D%0A%20%20%20%20%20%20id2%5B%22%60The%20dog%20in%20**the**%20hog...%20a%20*very%20long%20text*%20that%20wraps%20to%20a%20new%20line%60%22%5D%0A%20%20%20%20%20%20id3%5BRegular%20labels%20still%20works%5D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>解释 <ul><li>id1： <ul><li><code>**Root**</code>：加粗显示 &quot;Root&quot;。</li><li>多行文本：文本中包含换行符，可以显示多行文本。</li><li>Unicode 支持：例如表情符号 🤓 可以正常显示。</li></ul></li><li>id2： <ul><li><code>**the**</code>：加粗显示 &quot;the&quot;。</li><li><code>*very long text*</code>：斜体显示 &quot;very long text&quot;。</li><li>自动换行：当文本过长时，会自动换行到下一行。</li></ul></li><li>id3： <ul><li>普通标签：传统的标签仍然有效，不包含任何 Markdown 格式。</li></ul></li><li>注：上述 id1、id2、id3 仅仅是为了方便笔记记录，方便标注说明。即便删除 id1、id2、id3 它们，渲染结果依旧保持不变。</li></ul></li></ul><h2 id="17--绘制思维导图测试" tabindex="-1">17. 💻 绘制思维导图测试 <a class="header-anchor" href="#17--绘制思维导图测试" aria-label="Permalink to &quot;17. 💻 绘制思维导图测试&quot;" target="_self" rel="noopener">​</a></h2><ul><li>官方示例 1</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  )Goals for 2023(</span></span>
<span class="line"><span>    ))Family((</span></span>
<span class="line"><span>        Plan a trip together</span></span>
<span class="line"><span>        Call parents weekly</span></span>
<span class="line"><span>    ))Health((</span></span>
<span class="line"><span>        Less Carbs</span></span>
<span class="line"><span>        Gym</span></span>
<span class="line"><span>        Nature walks</span></span>
<span class="line"><span>    ))Career((</span></span>
<span class="line"><span>        Learn new skill</span></span>
<span class="line"><span>        Read more books</span></span>
<span class="line"><span>    ))Fun((</span></span>
<span class="line"><span>        Join Swim class</span></span>
<span class="line"><span>        Go to theatre plays</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-701",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20)Goals%20for%202023(%0A%20%20%20%20))Family((%0A%20%20%20%20%20%20%20%20Plan%20a%20trip%20together%0A%20%20%20%20%20%20%20%20Call%20parents%20weekly%0A%20%20%20%20))Health((%0A%20%20%20%20%20%20%20%20Less%20Carbs%0A%20%20%20%20%20%20%20%20Gym%0A%20%20%20%20%20%20%20%20Nature%20walks%0A%20%20%20%20))Career((%0A%20%20%20%20%20%20%20%20Learn%20new%20skill%0A%20%20%20%20%20%20%20%20Read%20more%20books%0A%20%20%20%20))Fun((%0A%20%20%20%20%20%20%20%20Join%20Swim%20class%0A%20%20%20%20%20%20%20%20Go%20to%20theatre%20plays%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<ul><li>在 GitHub 上也是可以预览的，以下是在 VSCode 上预览的效果。 <ul><li><img src="https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-19-09-35-19.png" alt="" loading="lazy"></li></ul></li><li>官方示例 2</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mindmap</span></span>
<span class="line"><span>  root((mindmap))</span></span>
<span class="line"><span>    Origins</span></span>
<span class="line"><span>      Long history</span></span>
<span class="line"><span>      ::icon(fa fa-book)</span></span>
<span class="line"><span>      Popularisation</span></span>
<span class="line"><span>        British popular psychology author Tony Buzan</span></span>
<span class="line"><span>    Research</span></span>
<span class="line"><span>      On effectiveness&lt;br/&gt;and features</span></span>
<span class="line"><span>      On Automatic creation</span></span>
<span class="line"><span>        Uses</span></span>
<span class="line"><span>            Creative techniques</span></span>
<span class="line"><span>            Strategic planning</span></span>
<span class="line"><span>            Argument mapping</span></span>
<span class="line"><span>    Tools</span></span>
<span class="line"><span>      Pen and paper</span></span>
<span class="line"><span>      Mermaid</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-722",
        class: "mermaid my-class",
        graph: "mindmap%0A%20%20root((mindmap))%0A%20%20%20%20Origins%0A%20%20%20%20%20%20Long%20history%0A%20%20%20%20%20%20%3A%3Aicon(fa%20fa-book)%0A%20%20%20%20%20%20Popularisation%0A%20%20%20%20%20%20%20%20British%20popular%20psychology%20author%20Tony%20Buzan%0A%20%20%20%20Research%0A%20%20%20%20%20%20On%20effectiveness%3Cbr%2F%3Eand%20features%0A%20%20%20%20%20%20On%20Automatic%20creation%0A%20%20%20%20%20%20%20%20Uses%0A%20%20%20%20%20%20%20%20%20%20%20%20Creative%20techniques%0A%20%20%20%20%20%20%20%20%20%20%20%20Strategic%20planning%0A%20%20%20%20%20%20%20%20%20%20%20%20Argument%20mapping%0A%20%20%20%20Tools%0A%20%20%20%20%20%20Pen%20and%20paper%0A%20%20%20%20%20%20Mermaid%0A"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.notes/0027. Mindmap with Mermaid.js - 使用 mermaid 来绘制思维导图/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
