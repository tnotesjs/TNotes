import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0643. 子数组最大平均数 I【简单】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/0643. 子数组最大平均数 I【简单】/README.md","filePath":"TNotes.leetcode/0643. 子数组最大平均数 I【简单】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/0643. 子数组最大平均数 I【简单】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0643-子数组最大平均数-i简单" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0643.%20%E5%AD%90%E6%95%B0%E7%BB%84%E6%9C%80%E5%A4%A7%E5%B9%B3%E5%9D%87%E6%95%B0%20I%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91" target="_self" rel="noopener">0643. 子数组最大平均数 I【简单】</a> <a class="header-anchor" href="#0643-子数组最大平均数-i简单" aria-label="Permalink to &quot;[0643. 子数组最大平均数 I【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0643.%20%E5%AD%90%E6%95%B0%E7%BB%84%E6%9C%80%E5%A4%A7%E5%B9%B3%E5%9D%87%E6%95%B0%20I%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--description" target="_self" rel="noopener">1. 📝 Description</a></li><li><a href="#2--%E9%A2%98%E8%A7%A31" target="_self" rel="noopener">2. 💻 题解.1</a></li></ul><ul><li><a href="https://leetcode.cn/problems/maximum-average-subarray-i/" target="_self" rel="noopener">leetcode</a></li></ul><h2 id="1--description" tabindex="-1">1. 📝 Description <a class="header-anchor" href="#1--description" aria-label="Permalink to &quot;1. 📝 Description&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary><a href="https://leetcode.cn" target="_self" rel="noopener">leetcode</a></summary><p>给你一个由 <code>n</code> 个元素组成的整数数组 <code>nums</code> 和一个整数 <code>k</code> 。</p><p>请你找出平均数最大且 <strong>长度为 <code>k</code></strong> 的连续子数组，并输出该最大平均数。</p><p>任何误差小于 <code>10^-5</code> 的答案都将被视为正确答案。</p><p><strong>示例 1：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：nums = [1,12,-5,-6,50,3], k = 4</span></span>
<span class="line"><span>输出：12.75</span></span>
<span class="line"><span>解释：最大平均数 (12-5-6+50)/4 = 51/4 = 12.75</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><strong>示例 2：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：nums = [5], k = 1</span></span>
<span class="line"><span>输出：5.00000</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p><strong>提示：</strong></p><ul><li><code>n == nums.length</code></li><li><code>1 &lt;= k &lt;= n &lt;= 10^5</code></li><li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li></ul><h2 id="2--题解1" tabindex="-1">2. 💻 题解.1 <a class="header-anchor" href="#2--题解1" aria-label="Permalink to &quot;2. 💻 题解.1&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/0643. 子数组最大平均数 I【简单】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
