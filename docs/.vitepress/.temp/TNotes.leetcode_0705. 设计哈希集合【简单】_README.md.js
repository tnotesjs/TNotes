import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0705. 设计哈希集合【简单】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/0705. 设计哈希集合【简单】/README.md","filePath":"TNotes.leetcode/0705. 设计哈希集合【简单】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/0705. 设计哈希集合【简单】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0705-设计哈希集合简单" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0705.%20%E8%AE%BE%E8%AE%A1%E5%93%88%E5%B8%8C%E9%9B%86%E5%90%88%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91" target="_self" rel="noopener">0705. 设计哈希集合【简单】</a> <a class="header-anchor" href="#0705-设计哈希集合简单" aria-label="Permalink to &quot;[0705. 设计哈希集合【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0705.%20%E8%AE%BE%E8%AE%A1%E5%93%88%E5%B8%8C%E9%9B%86%E5%90%88%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--description" target="_self" rel="noopener">1. 📝 Description</a></li></ul><ul><li><a href="https://leetcode.cn/problems/design-hashset" target="_self" rel="noopener">leetcode</a></li></ul><h2 id="1--description" tabindex="-1">1. 📝 Description <a class="header-anchor" href="#1--description" aria-label="Permalink to &quot;1. 📝 Description&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary><a href="https://leetcode.cn" target="_self" rel="noopener">leetcode</a></summary><p>不使用任何内建的哈希表库设计一个哈希集合（HashSet）。</p><p>实现 <code>MyHashSet</code> 类：</p><ul><li><code>void add(key)</code> 向哈希集合中插入值 <code>key</code> 。</li><li><code>bool contains(key)</code> 返回哈希集合中是否存在这个值 <code>key</code> 。</li><li><code>void remove(key)</code> 将给定值 <code>key</code> 从哈希集合中删除。如果哈希集合中没有这个值，什么也不做。</li></ul><p><strong>示例：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入：</span></span>
<span class="line"><span>[&quot;MyHashSet&quot;, &quot;add&quot;, &quot;add&quot;, &quot;contains&quot;, &quot;contains&quot;, &quot;add&quot;, &quot;contains&quot;, &quot;remove&quot;, &quot;contains&quot;]</span></span>
<span class="line"><span>[[], [1], [2], [1], [3], [2], [2], [2], [2]]</span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span>[null, null, null, true, false, null, true, null, false]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解释：</span></span>
<span class="line"><span>MyHashSet myHashSet = new MyHashSet();</span></span>
<span class="line"><span>myHashSet.add(1);      // set = [1]</span></span>
<span class="line"><span>myHashSet.add(2);      // set = [1, 2]</span></span>
<span class="line"><span>myHashSet.contains(1); // 返回 True</span></span>
<span class="line"><span>myHashSet.contains(3); // 返回 False ，（未找到）</span></span>
<span class="line"><span>myHashSet.add(2);      // set = [1, 2]</span></span>
<span class="line"><span>myHashSet.contains(2); // 返回 True</span></span>
<span class="line"><span>myHashSet.remove(2);   // set = [1]</span></span>
<span class="line"><span>myHashSet.contains(2); // 返回 False ，（已移除）</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p><strong>提示：</strong></p><ul><li><code>0 &lt;= key &lt;= 10^6</code></li><li>最多调用 <code>10^4</code> 次 <code>add</code>、<code>remove</code> 和 <code>contains</code></li></ul></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/0705. 设计哈希集合【简单】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
