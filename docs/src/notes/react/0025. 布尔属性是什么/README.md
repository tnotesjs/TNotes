# [0025. 布尔属性是什么](https://github.com/Tdahuyou/react/tree/main/0025.%20%E5%B8%83%E5%B0%94%E5%B1%9E%E6%80%A7%E6%98%AF%E4%BB%80%E4%B9%88)

<!-- region:toc -->
- [1. 📒 什么是布尔属性](#1--什么是布尔属性)
- [2. 📒 布尔属性名称的由来](#2--布尔属性名称的由来)
- [3. 📒 布尔属性的特点](#3--布尔属性的特点)
- [4. 📒 常见的布尔属性示例](#4--常见的布尔属性示例)
- [5. 💻 布尔属性使用示例](#5--布尔属性使用示例)
- [6. 💻 布尔属性在 React 中的应用](#6--布尔属性在-react-中的应用)
  - [6.1. 注意事项](#61-注意事项)
- [7. 【0026】布尔属性的简写](#7-0026布尔属性的简写)
- [8. 💻 布尔属性的简写](#8--布尔属性的简写)
<!-- endregion:toc -->

## 1. 📒 什么是布尔属性

- 在 HTML 中，布尔属性（Boolean attributes）是一种特殊的属性类型，它们的存在与否决定了属性的值。也就是说，**如果一个布尔属性被设置在元素上，无论其值是什么，该属性都被视为 `true`。如果该属性不存在，则它的值被视为 `false`。**

## 2. 📒 布尔属性名称的由来

- 布尔属性的名称来源于数学和计算机科学中的布尔逻辑，这是以19世纪英国数学家乔治·布尔（George Boole）的名字命名的。布尔逻辑是一种代数系统，用于处理逻辑命题，它只有两个值：真（`true`）和假（`false`）。在编程中，布尔类型（boolean type）就是基于这种逻辑，用来表示二元状态的数据类型。
- 在 HTML 中，布尔属性的存在与否直接反映了这种二元状态。当一个布尔属性出现在元素上时，它的存在即代表了 `true` 的状态；而如果该属性没有出现在元素上，则意味着它的值为 `false`。这样的设计简化了标记语言的语法，并且使得这些属性的语义更加清晰明了。
- 例如，`<input type="checkbox" checked>` 中的 `checked` 属性就是一个布尔属性。它的存在表明这个复选框默认是被选中的，而不需要额外指定 `checked="true"` 或者 `checked="checked"` 这样的值。同样地，如果去掉了 `checked` 属性，那么复选框就默认为未选中状态。
- 这种设计符合布尔逻辑的基本原则，即一种属性要么具有某种特性（`true`），要么不具有（`false`），没有中间状态。因此，这些属性被称为“布尔属性”。它们在Web开发中提供了一种简洁的方式来表达特定的状态或行为，特别是在表单控件和其他交互元素中。

## 3. 📒 布尔属性的特点

- **不需要指定值**：当布尔属性出现在元素上时，它默认为 `true`。
- **忽略属性值**：即使你给布尔属性指定了任何值（如 `checked="false"`），浏览器仍然会将其视为 `true`。
- **只有存在或不存在两种状态**：布尔属性要么存在并表示 `true`，要么不存在并表示 `false`。

## 4. 📒 常见的布尔属性示例

- `disabled`：用于表单控件（如 `<input>` 或 `<button>`），用来禁用控件，使其不可交互。
- `readonly`：用于输入框（如 `<input type="text">` 或 `<textarea>`），防止用户修改内容。
- `checked`：用于复选框（`<input type="checkbox">`）和单选按钮（`<input type="radio">`），表示是否被选中。
- `selected`：用于下拉列表中的选项（`<option>`），表示该项是否被预先选择。
- `required`：用于表单字段（如 `<input>`、`<textarea>` 和 `<select>`），表示该字段必须填写才能提交表单。
- `open`：用于某些元素（如 `<details>`），表示该元素是否展开显示。

## 5. 💻 布尔属性使用示例

```html
<!-- 禁用按钮 -->
<button disabled>Click Me</button>

<!-- 只读文本框 -->
<input type="text" value="Read-only text" readonly />

<!-- 预先选中的单选按钮 -->
<input type="radio" name="choice" id="yes" checked />
<label for="yes">Yes</label>
```

- 在上面的例子中，`disabled`、`readonly` 和 `checked` 属性都是布尔属性。注意这些属性并没有显式地赋值为 `"true"` 或 `"false"`，而是简单地通过它们的存在来表达 `true` 的状态。
- 在 JavaScript 中，你可以通过检查元素的相应属性来判断布尔属性的状态。例如：

```javascript
const button = document.querySelector('button');
console.log(button.disabled);  // 输出 true 或 false
```

- 如果需要改变布尔属性的状态，可以直接设置属性的值为 `true` 或 `false`：

```javascript
// 启用按钮
button.disabled = false;

// 禁用按钮
button.disabled = true;
```

- 当你设置布尔属性为 `false` 时，实际上是从元素中移除了这个属性，这相当于将属性值设为 `false`。同样，设置为 `true` 则是添加了这个属性到元素上。

## 6. 💻 布尔属性在 React 中的应用

- 在 React 中，布尔属性的处理方式与原生 HTML 非常相似。当你在 JSX 中使用布尔属性时，React 会根据这些属性的存在与否来决定是否将其添加到最终生成的 DOM 元素上。如果布尔属性存在且值为 `true`，则该属性会被设置；如果值为 `false` 或者属性不存在，则不会被设置。
- 假设你有一个按钮，你想控制它是否禁用：
  - 在这个例子中，`disabled` 是一个布尔属性。当 `isDisabled` 为 `true` 时，`disabled` 属性会被应用到按钮上，使得按钮不可点击；当 `isDisabled` 为 `false` 时，`disabled` 属性不会被应用，按钮可以正常点击。

```jsx
const App = () => {
  const [isDisabled, setIsDisabled] = React.useState(true);

  return (
    <button disabled={isDisabled} onClick={() => setIsDisabled(!isDisabled)}>
      Click Me
    </button>
  );
};
```

- 你也可以根据条件来决定是否渲染带有布尔属性的元素：
  - 这里，`checked` 是一个布尔属性，用于表示复选框是否被选中。同时，我们还使用了条件渲染来显示文本信息，只有当复选框被选中（即 `isChecked` 为 `true`）时，才会渲染 `<p>` 标签。
  - 如果你学习过 vue，那么这里的 `{isChecked && <p>Checkbox is checked</p>}` 其实就非常类似于 `<p v-if="isChecked">Checkbox is checked</p>`。

```jsx
const App = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      {isChecked && <p>Checkbox is checked</p>}
    </div>
  );
};
```

- 如果你创建了一个自定义组件，并希望传递布尔属性给它，你可以通过 props 来实现这一点。例如，一个可展开/折叠的面板组件：
  - 在这个例子中，`isOpen` 虽然不是标准的布尔属性，但它作为一个 prop 传递给了 `Panel` 组件，用来控制内容的显示或隐藏。这种模式很常见，尤其是在构建复杂的 UI 时。

```jsx
// Panel.js
const Panel = ({ isOpen, children }) => (
  <div style={{ display: isOpen ? 'block' : 'none' }}>
    {children}
  </div>
);

// App.js
const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Panel</button>
      <Panel isOpen={isOpen}>
        <p>This is the content of the panel.</p>
      </Panel>
    </div>
  );
};
```

### 6.1. 注意事项

- 当你在 JSX 中使用布尔属性时，确保只传入布尔值。传入非布尔值（如字符串 "true" 或 "false"）可能会导致意外的行为。
- 如果你的布尔属性总是需要默认值，可以在组件内部设定默认值，或者在父组件中提供默认值。
- 在某些情况下，可能需要额外的逻辑来处理状态变化，比如使用 `useEffect` 来响应状态的变化并执行副作用。


## 7. 【0026】布尔属性的简写

- 如果在调用某个组件时，需要传递一个布尔属性，并且值为 true，可以简写属性名，不需要写属性值。
  - 写法1：`<Comp boolProp />`
  - 写法2：`<Comp boolProp={true} />`
  - 上述两种写法等效。
- 注意：如果直接在页面上渲染一个 true，需要将其转为字符串类型后才能渲染出来。
  - `{true}` 不会渲染出来。
  - `{'true'}` 可以正常渲染。

## 8. 💻 布尔属性的简写

```jsx
function App(props) {
  return <p>props.boolProp: {props.boolProp + ''}</p>
}
```

```jsx
<App boolProp />{/* 这是一种布尔属性的简写形式，相当于 boolProp={true} */}
<App boolProp={true} />
<App boolProp={false} />
```

![](assets/2024-09-30-17-48-54.png)
