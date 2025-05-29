import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"2823. 深度对象筛选【中等】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/2823. 深度对象筛选【中等】/README.md","filePath":"TNotes.leetcode/2823. 深度对象筛选【中等】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/2823. 深度对象筛选【中等】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="2823-深度对象筛选中等" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2823.%20%E6%B7%B1%E5%BA%A6%E5%AF%B9%E8%B1%A1%E7%AD%9B%E9%80%89%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91" target="_self" rel="noopener">2823. 深度对象筛选【中等】</a> <a class="header-anchor" href="#2823-深度对象筛选中等" aria-label="Permalink to &quot;[2823. 深度对象筛选【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2823.%20%E6%B7%B1%E5%BA%A6%E5%AF%B9%E8%B1%A1%E7%AD%9B%E9%80%89%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--description" target="_self" rel="noopener">1. 📝 Description</a></li><li><a href="#2--%E9%A2%98%E8%A7%A31" target="_self" rel="noopener">2. 💻 题解.1</a></li></ul><ul><li><a href="https://leetcode.cn/problems/deep-object-filter" target="_self" rel="noopener">leetcode</a></li></ul><h2 id="1--description" tabindex="-1">1. 📝 Description <a class="header-anchor" href="#1--description" aria-label="Permalink to &quot;1. 📝 Description&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary><a href="https://leetcode.cn" target="_self" rel="noopener">leetcode</a></summary><p>给定一个对象 <code>obj</code> 和一个函数 <code>fn</code>，返回一个经过筛选的对象 <code>filteredObject</code>。</p><p>函数 <code>deepFilter</code> 应该在对象 <code>obj</code> 上执行深度筛选操作。深度筛选操作应该移除筛选函数 <code>fn</code> 输出为 <code>false</code> 的属性，以及在键被移除后仍然存在的任何空对象或数组。</p><p>如果深度筛选操作导致对象或数组为空，没有剩余属性，<code>deepFilter</code> 应该返回 <code>undefined</code>，表示在 <code>filteredObject</code> 中没有有效数据。</p><p><strong>示例 1：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>obj = [-5, -4, -3, -2, -1, 0, 1],</span></span>
<span class="line"><span>fn = (x) =&gt; x &gt; 0</span></span>
<span class="line"><span>输出：[1]</span></span>
<span class="line"><span>解释：所有不大于 0 的值都被移除。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><strong>示例 2：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>obj = {&quot;a&quot;: 1, &quot;b&quot;: &quot;2&quot;, &quot;c&quot;: 3, &quot;d&quot;: &quot;4&quot;, &quot;e&quot;: 5, &quot;f&quot;: 6, &quot;g&quot;: {&quot;a&quot;: 1}},</span></span>
<span class="line"><span>fn = (x) =&gt; typeof x === &quot;string&quot;</span></span>
<span class="line"><span>输出：{&quot;b&quot;:&quot;2&quot;,&quot;d&quot;:&quot;4&quot;}</span></span>
<span class="line"><span>解释：所有值不是字符串的键都被移除。在筛选过程中移除键后，任何导致为空的对象也被移除。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><strong>示例 3：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>obj = [-1, [-1, -1, 5, -1, 10], -1, [-1], [-5]],</span></span>
<span class="line"><span>fn = (x) =&gt; x &gt; 0</span></span>
<span class="line"><span>输出：[[5,10]]</span></span>
<span class="line"><span>解释：所有不大于 0 的值都被移除。在筛选过程中移除值后，任何导致为空的数组也被移除。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><strong>示例 4：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>obj = [[[[5]]]],</span></span>
<span class="line"><span>fn = (x) =&gt; Array.isArray(x)</span></span>
<span class="line"><span>输出：undefined</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p><strong>提示：</strong></p><ul><li><code>fn</code> 是一个返回布尔值的函数</li><li><code>obj</code> 是一个有效的 JSON 对象</li><li><code>2 &lt;= JSON.stringify(obj).length &lt;= 10**5</code></li></ul><h2 id="2--题解1" tabindex="-1">2. 💻 题解.1 <a class="header-anchor" href="#2--题解1" aria-label="Permalink to &quot;2. 💻 题解.1&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/2823. 深度对象筛选【中等】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
