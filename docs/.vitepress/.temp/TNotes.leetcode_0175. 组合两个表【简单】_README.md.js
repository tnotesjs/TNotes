import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0175. 组合两个表【简单】","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.leetcode/0175. 组合两个表【简单】/README.md","filePath":"TNotes.leetcode/0175. 组合两个表【简单】/README.md"}');
const _sfc_main = { name: "TNotes.leetcode/0175. 组合两个表【简单】/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0175-组合两个表简单" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0175.%20%E7%BB%84%E5%90%88%E4%B8%A4%E4%B8%AA%E8%A1%A8%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91" target="_self" rel="noopener">0175. 组合两个表【简单】</a> <a class="header-anchor" href="#0175-组合两个表简单" aria-label="Permalink to &quot;[0175. 组合两个表【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0175.%20%E7%BB%84%E5%90%88%E4%B8%A4%E4%B8%AA%E8%A1%A8%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--description" target="_self" rel="noopener">1. 📝 Description</a></li><li><a href="#2--%E9%A2%98%E8%A7%A31---%E4%BD%BF%E7%94%A8-outer-join" target="_self" rel="noopener">2. 💻 题解.1 - 使用 <code>outer join</code></a></li></ul><h2 id="1--description" tabindex="-1">1. 📝 Description <a class="header-anchor" href="#1--description" aria-label="Permalink to &quot;1. 📝 Description&quot;" target="_self" rel="noopener">​</a></h2><details class="details custom-block"><summary><a href="https://leetcode.cn/problems/combine-two-tables" target="_self" rel="noopener">leetcode</a></summary><p>表: <code>Person</code></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| 列名         | 类型     |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| PersonId    | int     |</span></span>
<span class="line"><span>| FirstName   | varchar |</span></span>
<span class="line"><span>| LastName    | varchar |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>personId 是该表的主键（具有唯一值的列）。</span></span>
<span class="line"><span>该表包含一些人的 ID 和他们的姓和名的信息。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>表: <code>Address</code></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| 列名         | 类型    |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| AddressId   | int     |</span></span>
<span class="line"><span>| PersonId    | int     |</span></span>
<span class="line"><span>| City        | varchar |</span></span>
<span class="line"><span>| State       | varchar |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>addressId 是该表的主键（具有唯一值的列）。</span></span>
<span class="line"><span>该表的每一行都包含一个 ID = PersonId 的人的城市和州的信息。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>编写解决方案，报告 <code>Person</code> 表中每个人的姓、名、城市和州。如果 <code>personId</code> 的地址不在  <code>Address</code>  表中，则报告为  <code>null</code> 。</p><p>以 <strong>任意顺序</strong> 返回结果表。</p><p>结果格式如下所示。</p><hr><ul><li><strong>示例 1:</strong></li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入:</span></span>
<span class="line"><span>Person表:</span></span>
<span class="line"><span>+----------+----------+-----------+</span></span>
<span class="line"><span>| personId | lastName | firstName |</span></span>
<span class="line"><span>+----------+----------+-----------+</span></span>
<span class="line"><span>| 1        | Wang     | Allen     |</span></span>
<span class="line"><span>| 2        | Alice    | Bob       |</span></span>
<span class="line"><span>+----------+----------+-----------+</span></span>
<span class="line"><span>Address表:</span></span>
<span class="line"><span>+-----------+----------+---------------+------------+</span></span>
<span class="line"><span>| addressId | personId | city          | state      |</span></span>
<span class="line"><span>+-----------+----------+---------------+------------+</span></span>
<span class="line"><span>| 1         | 2        | New York City | New York   |</span></span>
<span class="line"><span>| 2         | 3        | Leetcode      | California |</span></span>
<span class="line"><span>+-----------+----------+---------------+------------+</span></span>
<span class="line"><span>输出:</span></span>
<span class="line"><span>+-----------+----------+---------------+----------+</span></span>
<span class="line"><span>| firstName | lastName | city          | state    |</span></span>
<span class="line"><span>+-----------+----------+---------------+----------+</span></span>
<span class="line"><span>| Allen     | Wang     | Null          | Null     |</span></span>
<span class="line"><span>| Bob       | Alice    | New York City | New York |</span></span>
<span class="line"><span>+-----------+----------+---------------+----------+</span></span>
<span class="line"><span>解释:</span></span>
<span class="line"><span>地址表中没有 personId = 1 的地址，所以它们的城市和州返回 null。</span></span>
<span class="line"><span>addressId = 1 包含了 personId = 2 的地址信息。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div></details><h2 id="2--题解1---使用-outer-join" tabindex="-1">2. 💻 题解.1 - 使用 <code>outer join</code> <a class="header-anchor" href="#2--题解1---使用-outer-join" aria-label="Permalink to &quot;2. 💻 题解.1 - 使用 \`outer join\`&quot;" target="_self" rel="noopener">​</a></h2><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-3ODEe" id="tab-1AWu2PA" checked><label data-title="mysql" for="tab-1AWu2PA">mysql</label></div><div class="blocks"><div class="language-sql vp-adaptive-theme active line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">SELECT</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> FirstName, LastName, City, </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">State</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">FROM</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Person </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">LEFT JOIN</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> Address</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">ON</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> Person</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">.</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">PersonId</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> Address</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">.</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">PersonId</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.leetcode/0175. 组合两个表【简单】/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
