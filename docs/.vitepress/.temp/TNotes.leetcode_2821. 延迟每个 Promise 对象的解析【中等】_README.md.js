import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"2821. 延迟每个 Promise 对象的解析【中等】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/2821. 延迟每个 Promise 对象的解析【中等】/README.md","filePath":"TNotes.leetcode/2821. 延迟每个 Promise 对象的解析【中等】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/2821. 延迟每个 Promise 对象的解析【中等】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="2821-延迟每个-promise-对象的解析中等" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2821.%20%E5%BB%B6%E8%BF%9F%E6%AF%8F%E4%B8%AA%20Promise%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E8%A7%A3%E6%9E%90%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91" target="_self" rel="noopener">2821. 延迟每个 Promise 对象的解析【中等】</a> <a class="header-anchor" href="#2821-延迟每个-promise-对象的解析中等" aria-label="Permalink to &quot;[2821. 延迟每个 Promise 对象的解析【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2821.%20%E5%BB%B6%E8%BF%9F%E6%AF%8F%E4%B8%AA%20Promise%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E8%A7%A3%E6%9E%90%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--description" target="_self" rel="noopener">1. 📝 Description</a></li><li><a href="#2--%E9%A2%98%E8%A7%A31" target="_self" rel="noopener">2. 💻 题解.1</a></li></ul><ul><li><a href="https://leetcode.cn/problems/delay-the-resolution-of-each-promise" target="_self" rel="noopener">leetcode</a></li></ul><h2 id="1--description" tabindex="-1">1. 📝 Description <a class="header-anchor" href="#1--description" aria-label="Permalink to &quot;1. 📝 Description&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary><a href="https://leetcode.cn" target="_self" rel="noopener">leetcode</a></summary><p>给定一个函数数组 <code>functions</code> 和一个数字 <code>ms</code>，返回一个新的函数数组。</p><ul><li><code>functions</code> 是一个返回 Promise 对象的函数数组。</li><li><code>ms</code> 表示延迟的时间，以毫秒为单位。它决定了在新数组中的每个函数返回的 Promise 在解析之前等待的时间。</li></ul><p>新数组中的每个函数应该返回一个 Promise 对象，在延迟了 <code>ms</code> 毫秒后解析，保持原始 <code>functions</code> 数组中的顺序。<code>delayAll</code> 函数应确保从 <code>functions</code> 中的每个 Promise 都被延迟执行，形成返回延迟的 Promise 的函数的新数组。</p><p><strong>示例 1：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>functions = [</span></span>
<span class="line"><span>   () =&gt; new Promise((resolve) =&gt; setTimeout(resolve, 30))</span></span>
<span class="line"><span>],</span></span>
<span class="line"><span>ms = 50</span></span>
<span class="line"><span>输出：[80]</span></span>
<span class="line"><span>解释：数组中的 Promise 在 30 毫秒后解析，但被延迟了 50 毫秒，所以总共延迟了 30 毫秒 + 50 毫秒 = 80 毫秒。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><strong>示例 2：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>functions = [</span></span>
<span class="line"><span>    () =&gt; new Promise((resolve) =&gt; setTimeout(resolve, 50)),</span></span>
<span class="line"><span>    () =&gt; new Promise((resolve) =&gt; setTimeout(resolve, 80))</span></span>
<span class="line"><span>],</span></span>
<span class="line"><span>ms = 70</span></span>
<span class="line"><span>输出：[120,150]</span></span>
<span class="line"><span>解释：数组中的 Promise 在 50 毫秒和 80 毫秒后解析，但它们被延迟了 70 毫秒，所以总共延迟了 50 毫秒 + 70 毫秒 = 120 毫秒 和 80 毫秒 + 70 毫秒 = 150 毫秒。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><strong>提示：</strong></p><ul><li><code>functions</code> 是一个返回 Promise 对象的函数数组</li><li><code>10 &lt;= ms &lt;= 500</code></li><li><code>1 &lt;= functions.length &lt;= 10</code></li></ul><h2 id="2--题解1" tabindex="-1">2. 💻 题解.1 <a class="header-anchor" href="#2--题解1" aria-label="Permalink to &quot;2. 💻 题解.1&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/2821. 延迟每个 Promise 对象的解析【中等】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
