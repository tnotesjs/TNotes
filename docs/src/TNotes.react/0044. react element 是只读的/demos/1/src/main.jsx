import React, { useState, useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function Counter() {
  const [num, setNum] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNum((prevNum) => prevNum + 1)
    }, 1000)

    return () => clearInterval(intervalId) // 清除定时器以避免内存泄漏
  }, [])

  return (
    <>
      计数器：<span>{num}</span>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Counter />
  </StrictMode>
)