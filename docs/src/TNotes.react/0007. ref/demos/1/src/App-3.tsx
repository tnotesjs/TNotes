// 在类组件中通过 createRef 来获取真实 DOM。
import React, { Component, RefObject } from 'react';

class ChildComponent extends Component {
  myButton: RefObject<HTMLButtonElement> = React.createRef<HTMLButtonElement>();

  handleClick = () => {
    console.log(this.myButton.current); // 访问 DOM 节点
  };

  render() {
    return (
      <div>
        <button ref={this.myButton} onClick={this.handleClick}>Click me</button>
      </div>
    );
  }
}

class App extends Component {
  childRef: RefObject<ChildComponent> = React.createRef<ChildComponent>();

  handleClick = () => {
    if (this.childRef.current && this.childRef.current.myButton.current) {
      this.childRef.current.myButton.current.click(); // 触发子组件中的按钮点击事件
    }
  };

  render() {
    return (
      <div>
        <ChildComponent ref={this.childRef} />
        <button onClick={this.handleClick}>Trigger click</button>
      </div>
    );
  }
}

export default App;