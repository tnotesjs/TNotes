import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0043. 查看所有数据库","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.sql/0043. 查看所有数据库/README.md","filePath":"TNotes.sql/0043. 查看所有数据库/README.md"}');
const _sfc_main = { name: "TNotes.sql/0043. 查看所有数据库/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0043-查看所有数据库" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0043.%20%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%E5%BA%93" target="_self" rel="noopener">0043. 查看所有数据库</a> <a class="header-anchor" href="#0043-查看所有数据库" aria-label="Permalink to &quot;[0043. 查看所有数据库](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0043.%20%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%E5%BA%93)&quot;" target="_self" rel="noopener">​</a></h1><ul><li><a href="#1--%E6%A6%82%E8%BF%B0" target="_self" rel="noopener">1. 📝 概述</a></li><li><a href="#2--%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%E5%BA%93" target="_self" rel="noopener">2. 💻 查看所有数据库</a></li><li><a href="#3--mysql-%E9%BB%98%E8%AE%A4%E8%87%AA%E5%B8%A6%E7%9A%84%E6%95%B0%E6%8D%AE%E5%BA%93%E7%AE%80%E4%BB%8B" target="_self" rel="noopener">3. 📒 mysql 默认自带的数据库简介</a></li></ul><h2 id="1--概述" tabindex="-1">1. 📝 概述 <a class="header-anchor" href="#1--概述" aria-label="Permalink to &quot;1. 📝 概述&quot;" target="_self" rel="noopener">​</a></h2><ul><li><code>SHOW DATABASES;</code></li><li>作用：查看所有数据库</li></ul><h2 id="2--查看所有数据库" tabindex="-1">2. 💻 查看所有数据库 <a class="header-anchor" href="#2--查看所有数据库" aria-label="Permalink to &quot;2. 💻 查看所有数据库&quot;" target="_self" rel="noopener">​</a></h2><div class="language-sql vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 查看所有数据库</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">SHOW DATABASES;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | Database           |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | information_schema |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | mysql              |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | performance_schema |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | sys                |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 4 rows in set (0.002 sec)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 创建一个名为 test_db 的数据库</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">CREATE</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> DATABASE</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> test_db</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- Query OK, 1 row affected (0.003 sec)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 再次查看所有数据库</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">SHOW DATABASES;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | Database           |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | information_schema |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | mysql              |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | performance_schema |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | sys                |</span></span>
<span class="line highlighted"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | test_db            |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 5 rows in set (0.002 sec)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><h2 id="3--mysql-默认自带的数据库简介" tabindex="-1">3. 📒 mysql 默认自带的数据库简介 <a class="header-anchor" href="#3--mysql-默认自带的数据库简介" aria-label="Permalink to &quot;3. 📒 mysql 默认自带的数据库简介&quot;" target="_self" rel="noopener">​</a></h2><div class="language-sql vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 查看所有数据库</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">SHOW DATABASES;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | Database           |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line highlighted"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | information_schema |</span></span>
<span class="line highlighted"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | mysql              |</span></span>
<span class="line highlighted"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | performance_schema |</span></span>
<span class="line highlighted"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- | sys                |</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- +--------------------+</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 4 rows in set (0.002 sec)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 当你安装好 mysql 之后，即便你还没有创建任何数据库，</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 当你运行 \`SHOW DATABASES;\` 命令时，也会打印一些数据库出来。</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 因为这 4 个数据库是 MySQL 默认自带的系统数据库。</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">-- 以下是它们的简要介绍：</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><table tabindex="0"><thead><tr><th>Database</th><th>说明</th></tr></thead><tbody><tr><td><code>information_schema</code></td><td>提供了关于数据库元数据的信息，如数据库名、表名、列的数据类型等。</td></tr><tr><td><code>mysql</code></td><td>存储了 MySQL 的用户权限信息、日志、时区等核心数据。</td></tr><tr><td><code>performance_schema</code></td><td>用于性能监控，记录 MySQL 内部运行过程中的性能相关数据。</td></tr><tr><td><code>sys</code></td><td>基于 <code>performance_schema</code> 提供的一组视图，简化性能数据的查询和分析。</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.sql/0043. 查看所有数据库/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
