import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/notes/assets/javascript.0014.yuque_mind.Bw0e41oZ.jpeg";
const __pageData = JSON.parse('{"title":"0014. 标识符","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.html-css-js/0014. 标识符/README.md","filePath":"TNotes.html-css-js/0014. 标识符/README.md"}');
const _sfc_main = { name: "TNotes.html-css-js/0014. 标识符/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0014-标识符" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0014.%20%E6%A0%87%E8%AF%86%E7%AC%A6" target="_self" rel="noopener">0014. 标识符</a> <a class="header-anchor" href="#0014-标识符" aria-label="Permalink to &quot;[0014. 标识符](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0014.%20%E6%A0%87%E8%AF%86%E7%AC%A6)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A0%87%E8%AF%86%E7%AC%A6" target="_self" rel="noopener">1. 📒 标识符</a></li><li><a href="#2--%E9%9D%A2%E8%AF%95%E9%A2%981---%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%BA%9B%E6%A0%87%E8%AF%86%E7%AC%A6%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84" target="_self" rel="noopener">2. 💼 面试题.1 - 以下哪些标识符是合法的？</a></li></ul><ul><li>知识点： <ul><li>标识符是什么</li><li>标识符的命名规范</li></ul></li><li>标识符其实就是一个名字。程序中需要你指定名字的地方有很多，比如：变量名、函数名、参数名。需要掌握标识符的命名规则，可以拿笔记中的面试题练练手。</li></ul><h2 id="1--标识符" tabindex="-1">1. 📒 标识符 <a class="header-anchor" href="#1--标识符" aria-label="Permalink to &quot;1. 📒 标识符&quot;" target="_self" rel="noopener">​</a></h2><ul><li>思维导图 <ul><li><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy"></li></ul></li><li><strong>标识符（identifier）指的是用来识别各种值的合法名称。</strong></li><li>最常见的标识符就是 <strong>变量名</strong>，以及后面要提到的 <strong>函数名、参数名</strong>。</li><li>JavaScript 语言的标识符对大小写敏感，所以 <code>a</code> 和 <code>A</code> 是两个不同的标识符。</li><li>标识符应该做到 <strong>望文知义（语义化）</strong>，比如： <ul><li>宽度：width</li><li>高度：height</li><li>尺寸：size</li><li>性别：gender、sex、isMale</li><li>横坐标：x</li><li>…… 等等</li><li>一个完整的程序中，会涉及成百上千的标识符，好的名称不仅可以减少名称冲突，更有利于程序的阅读和维护。</li></ul></li><li><strong>标识符命名规范</strong><ul><li><strong>开头位置：只能以英文字母、下划线 _ 、美元符 $ 开头</strong></li><li><strong>其他位置：其他位置可以出现数字、英文字母、下划线、$</strong></li><li><strong>注意事项：标识符不可以与关键字、保留词重复</strong></li><li><strong>特殊情况：标识符可以是中文（但最好别怎么做）</strong></li></ul></li></ul><h2 id="2--面试题1---以下哪些标识符是合法的" tabindex="-1">2. 💼 面试题.1 - 以下哪些标识符是合法的？ <a class="header-anchor" href="#2--面试题1---以下哪些标识符是合法的" aria-label="Permalink to &quot;2. 💼 面试题.1 - 以下哪些标识符是合法的？&quot;" target="_self" rel="noopener">​</a></h2><div class="language-javascript vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 问：以下哪些标识符是合法的？</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a1 = $</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a2 = _</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a3 = 1$</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a4 = list-style</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a5 = list_style</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a6 = list style</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a7 = $$</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a8 = $emit</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a9 = var</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><div class="language-javascript vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a1 = $</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"> // ✅</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a2 = _</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"> // ✅</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a5 = list_style</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"> // ✅</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a7 = $$</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"> // ✅</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a8 = $emit</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"> // ✅</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a3 = 1$</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// ❌</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 必须以字母或下划线打头</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a4 = list-style</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a6 = list style</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// ❌</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 开头位置：只能以英文字母、下划线 _ 、美元符 $ 开头</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 其他位置：其他位置可以出现数字、英文字母、下划线、$</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 其他任何符号都是非法的</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// var a9 = var</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// ❌</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">// 标识符不可以与关键字、保留词重复</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.html-css-js/0014. 标识符/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
