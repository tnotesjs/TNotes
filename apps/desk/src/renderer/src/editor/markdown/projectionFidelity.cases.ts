/**
 * 渲染忠实性用例集（最小片段）。
 *
 * 用途：
 * 1. 单测：每条走一遍真实投影链路（project → Milkdown 解析 → 序列化），按 `expected` 断言判定；
 * 2. 后续机制 / e2e：需要"不能忠实渲染"的样本时从这里取。
 *
 * `faithful` = 必须忠实：要么原样回来，要么命中有意为之的规范化（PROJECTION_CANONICALIZATIONS）。
 * 一旦某条从 faithful 变成不忠实，只有两种处理：修投影，或把它登记进白名单。
 * `known-deviation` = 已知偏差，暂时接受（原因写在 deviation 里）。
 */

export interface FidelityCase {
  id: string
  title: string
  /** 这条片段研究的点 */
  focus: string
  source: string
  expected: 'faithful' | 'known-deviation'
  deviation?: string
}

/** 每条用例前面都会加一层最小 frontmatter（模拟真实笔记）。 */
export const FIDELITY_CASE_FRONTMATTER = '---\nid: fidelity-case\n---\n\n'

export const FIDELITY_CASES: FidelityCase[] = [
  {
    id: 'A1',
    title: '正常 callout',
    focus: '对照组',
    source: '::: tip 💡 TIP\n\n正文\n\n:::\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'A2',
    title: 'callout body 末尾 <br />',
    focus: '曾经会吞掉后面的块并泄漏内部标记（已修）',
    source: '::: warning ⚠️ W\n\n111\n\n<br />\n\n:::\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'A3',
    title: 'callout body 末尾 <div></div>',
    focus: '同样是 HTML 结尾，不应受影响',
    source: '::: warning ⚠️ W\n\n111\n\n<div></div>\n\n:::\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'A4',
    title: 'callout body 末尾 <hr />',
    focus: '自闭合标签结尾',
    source: '::: warning ⚠️ W\n\n111\n\n<hr />\n\n:::\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'A5',
    title: '未闭合 callout',
    focus: '结尾围栏缺失（markdown 语义上延伸到文件末尾）',
    source: '::: warning ⚠️ W\n\n111\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'A6',
    title: 'callout 内嵌代码块',
    focus: '嵌套正常',
    source: '::: tip T\n\n正文\n\n```js\nconst a = 1\n```\n\n:::\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'A7',
    title: 'callout 内嵌 callout',
    focus: '围栏加长（允许的规范化）',
    source: '::: tip T\n\n外层\n\n::: info I\n\n内层\n\n:::\n\n:::\n\n222\n',
    expected: 'known-deviation',
    deviation:
      '嵌套容器的围栏宽度与闭合在纯文本层对不齐（多出一个 ::: 块）；机制接投影时改用容器感知的对账'
  },
  {
    id: 'A8',
    title: 'callout body 内连续空行',
    focus: '连续空行塌缩（允许的规范化）',
    source: '::: tip T\n\n111\n\n\n\n222\n\n:::\n\n333\n',
    expected: 'faithful'
  },
  {
    id: 'B1',
    title: '裸 HTML 块 <div>',
    focus: '不支持的内容按原文保留',
    source: '<div style="color:red">红色</div>\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'B2',
    title: '自定义标签 <my-app>',
    focus: '不支持的内容按原文保留',
    source: '<my-app>内容</my-app>\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'B3',
    title: '单独一行 HTML 注释',
    focus: '注释按原文保留',
    source: '111\n\n<!-- 我的备注 -->\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'B4',
    title: '行内 display:none 内容',
    focus: '不隐藏文件里存在的内容',
    source: '111 <span style="display:none">隐藏</span> 222\n',
    expected: 'faithful'
  },
  {
    id: 'C1',
    title: '未知语言代码围栏',
    focus: '围栏信息串不认识也要原样',
    source: '```unknownlang\nabc\n```\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'C2',
    title: '代码块内单独一行 :::',
    focus: '不能被误判成容器',
    source: '```\n:::\n```\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'C3',
    title: '未闭合代码围栏',
    focus: '结尾围栏缺失（markdown 语义上延伸到文件末尾）',
    source: '```js\nconst a = 1\n',
    expected: 'faithful'
  },
  {
    id: 'D1',
    title: '未闭合图片语法 ![图](',
    focus: '当文字时的转义等价',
    source: '111 ![图]( 222\n',
    expected: 'faithful'
  },
  {
    id: 'D2',
    title: '悬空引用 [文字][ref]',
    focus: '当文字时的转义等价',
    source: '111 [文字][ref] 222\n',
    expected: 'faithful'
  },
  {
    id: 'D4',
    title: '表格列数不一致',
    focus: '表格重排（允许的规范化）',
    source: '| A | B |\n| --- | --- |\n| 1 |\n| 2 | 3 | 4 |\n',
    expected: 'faithful'
  },
  {
    id: 'D5',
    title: '连续空行',
    focus: '连续空行塌缩（允许的规范化）',
    source: '111\n\n\n\n222\n',
    expected: 'faithful'
  },
  {
    id: 'D6',
    title: 'CRLF 与行尾空格',
    focus: 'CRLF 统一为 LF；行尾空格必须保留（硬换行）',
    source: '111  \r\n\r\n222\r\n',
    expected: 'known-deviation',
    deviation: '行尾两个空格会被序列化吃掉（硬换行语义），待修投影'
  },
  {
    id: 'E1',
    title: '无序列表统一用 -',
    focus: '单一 * 记号统一成 -（允许的规范化）',
    source: '* 第一项\n* 第二项\n',
    expected: 'faithful'
  },
  {
    id: 'E2',
    title: '相邻列表记号混用',
    focus: 'markdown 里记号变了就是新列表；源侧补空行后可与序列化结果对齐',
    source: '- 第一项\n+ 第二项\n* 第三项\n',
    expected: 'faithful'
  },
  {
    id: 'E3',
    title: '嵌套列表记号',
    focus: '嵌套层记号是否也会被统一（取决于序列化器 bulletOther 配置）',
    source: '- 一级\n  * 二级\n  * 二级二\n',
    expected: 'faithful'
  }
]

/** 用例 D3 单独放：未闭合 frontmatter 无法以文件形式保存（Desk 会回填 id）。 */
export const FIDELITY_CASE_D3: FidelityCase = {
  id: 'D3',
  title: '未闭合 frontmatter',
  focus: 'frontmatter 只有开头 ---，作为正文块参与对账',
  source: '---\nid: x\n\n正文\n',
  expected: 'faithful'
}
