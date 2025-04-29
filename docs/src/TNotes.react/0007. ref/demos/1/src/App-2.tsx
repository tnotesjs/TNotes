// 在函数组件中通过 useRef 来获取真实 DOM。
import { useRef } from 'react';

function App() {
  const inputRef = useRef<HTMLInputElement>(null); // 创建一个 ref

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // 聚焦到输入框
    }
  };

  return (
    <div>
      <input ref={inputRef} type='text' />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default App;