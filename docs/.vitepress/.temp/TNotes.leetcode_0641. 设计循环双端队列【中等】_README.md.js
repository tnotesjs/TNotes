import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0641. 设计循环双端队列【中等】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/0641. 设计循环双端队列【中等】/README.md","filePath":"TNotes.leetcode/0641. 设计循环双端队列【中等】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/0641. 设计循环双端队列【中等】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0641-设计循环双端队列中等" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0641.%20%E8%AE%BE%E8%AE%A1%E5%BE%AA%E7%8E%AF%E5%8F%8C%E7%AB%AF%E9%98%9F%E5%88%97%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91" target="_self" rel="noopener">0641. 设计循环双端队列【中等】</a> <a class="header-anchor" href="#0641-设计循环双端队列中等" aria-label="Permalink to &quot;[0641. 设计循环双端队列【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0641.%20%E8%AE%BE%E8%AE%A1%E5%BE%AA%E7%8E%AF%E5%8F%8C%E7%AB%AF%E9%98%9F%E5%88%97%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--description" target="_self" rel="noopener">1. 📝 Description</a></li><li><a href="#2--%E9%A2%98%E8%A7%A31" target="_self" rel="noopener">2. 💻 题解.1</a></li></ul><ul><li><a href="https://leetcode.cn/problems/design-circular-deque/" target="_self" rel="noopener">leetcode</a></li></ul><h2 id="1--description" tabindex="-1">1. 📝 Description <a class="header-anchor" href="#1--description" aria-label="Permalink to &quot;1. 📝 Description&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary><a href="https://leetcode.cn" target="_self" rel="noopener">leetcode</a></summary><p>设计实现双端队列。</p><p>实现 <code>MyCircularDeque</code> 类:</p><ul><li><code>MyCircularDeque(int k)</code> ：构造函数,双端队列最大为 <code>k</code> 。</li><li><code>boolean insertFront()</code>：将一个元素添加到双端队列头部。 如果操作成功返回 <code>true</code> ，否则返回 <code>false</code> 。</li><li><code>boolean insertLast()</code> ：将一个元素添加到双端队列尾部。如果操作成功返回 <code>true</code> ，否则返回 <code>false</code> 。</li><li><code>boolean deleteFront()</code> ：从双端队列头部删除一个元素。 如果操作成功返回 <code>true</code> ，否则返回 <code>false</code> 。</li><li><code>boolean deleteLast()</code> ：从双端队列尾部删除一个元素。如果操作成功返回 <code>true</code> ，否则返回 <code>false</code> 。</li><li><code>int getFront()</code> )：从双端队列头部获得一个元素。如果双端队列为空，返回 <code>-1</code> 。</li><li><code>int getRear()</code> ：获得双端队列的最后一个元素。 如果双端队列为空，返回 <code>-1</code> 。</li><li><code>boolean isEmpty()</code> ：若双端队列为空，则返回 <code>true</code> ，否则返回 <code>false</code>  。</li><li><code>boolean isFull()</code> ：若双端队列满了，则返回 <code>true</code> ，否则返回 <code>false</code> 。</li></ul><p><strong>示例 1：</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入</span></span>
<span class="line"><span>[&quot;MyCircularDeque&quot;, &quot;insertLast&quot;, &quot;insertLast&quot;, &quot;insertFront&quot;, &quot;insertFront&quot;, &quot;getRear&quot;, &quot;isFull&quot;, &quot;deleteLast&quot;, &quot;insertFront&quot;, &quot;getFront&quot;]</span></span>
<span class="line"><span>[[3], [1], [2], [3], [4], [], [], [], [4], []]</span></span>
<span class="line"><span>输出</span></span>
<span class="line"><span>[null, true, true, true, false, 2, true, true, true, 4]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解释</span></span>
<span class="line"><span>MyCircularDeque circularDeque = new MycircularDeque(3); // 设置容量大小为3</span></span>
<span class="line"><span>circularDeque.insertLast(1);			        // 返回 true</span></span>
<span class="line"><span>circularDeque.insertLast(2);			        // 返回 true</span></span>
<span class="line"><span>circularDeque.insertFront(3);			        // 返回 true</span></span>
<span class="line"><span>circularDeque.insertFront(4);			        // 已经满了，返回 false</span></span>
<span class="line"><span>circularDeque.getRear();  				// 返回 2</span></span>
<span class="line"><span>circularDeque.isFull();				        // 返回 true</span></span>
<span class="line"><span>circularDeque.deleteLast();			        // 返回 true</span></span>
<span class="line"><span>circularDeque.insertFront(4);			        // 返回 true</span></span>
<span class="line"><span>circularDeque.getFront();				// 返回 4</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p><strong>提示：</strong></p><ul><li><code>1 &lt;= k &lt;= 1000</code></li><li><code>0 &lt;= value &lt;= 1000</code></li><li><code>insertFront</code>, <code>insertLast</code>, <code>deleteFront</code>, <code>deleteLast</code>, <code>getFront</code>, <code>getRear</code>, <code>isEmpty</code>, <code>isFull</code>  调用次数不大于 <code>2000</code> 次</li></ul><h2 id="2--题解1" tabindex="-1">2. 💻 题解.1 <a class="header-anchor" href="#2--题解1" aria-label="Permalink to &quot;2. 💻 题解.1&quot;" target="_self" rel="noopener">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></details></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/0641. 设计循环双端队列【中等】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
