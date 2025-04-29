// 字符串 ref 在旧版的 react 中可用，但是在当前 react 版本 v18 中是不可用的。
import { Component } from 'react';

class App extends Component {
  componentDidMount() {
    console.log(this.refs.myInput); // 获取 DOM 节点
    // react-dom.development.js:86 Warning: Component "div" contains the string ref "myInput".
    // Support for string refs will be removed in a future major release.
    // We recommend using useRef() or createRef() instead.
    // Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref
  }

  render() {
    return (
      <div>
        <input ref="myInput" type="text" />
      </div>
    );
  }
}

export default App;
