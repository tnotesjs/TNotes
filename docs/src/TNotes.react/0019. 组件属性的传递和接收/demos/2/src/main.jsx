import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'

class ChildComponent extends Component {
  render() {
    // 【1】在类组件中，父组件传递过来的属性，会自动注入到 this.props 中，可以通过 this.props 访问这些数据。
    const { number, string, boolean, object, jsx, func } = this.props
    console.log('Received props:', { number, string, boolean, object, jsx, func })
    
    return (
      <div>
        <h3>Child Component</h3>
        <p>Number: {number}</p>
        <p>String: {string}</p>
        <p>Boolean: {boolean ? 'True' : 'False'}</p>
        <p>Object: {JSON.stringify(object)}</p>
        <p>JSX: {jsx}</p>
        <button onClick={func}>Click Me (Triggers Parent Function)</button>
      </div>
    );
  }
}

function ParentComponent() {
  const handleButtonClick = () => {
    console.log('Button in ChildComponent clicked!')
  }

  return (
    <div>
      <h2>Parent Component</h2>
      <ChildComponent
        number={123}
        string="Hello, world!"
        boolean={true}
        object={{ key: 'value', id: 1 }}
        jsx={<strong>This is JSX content!</strong>}
        func={handleButtonClick}
      />
    </div>
  )
}

// 渲染到 DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParentComponent />
  </StrictMode>
)