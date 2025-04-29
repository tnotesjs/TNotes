import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

function MyDynamicComponent({ isActive }) {
  const dynamicStyle = {
    color: isActive ? 'green' : 'red',
    fontWeight: isActive ? 'bold' : 'normal',
  }

  return <p style={dynamicStyle}>This is a dynamically styled paragraph.</p>
}

function App() {
  const [isActive, setIsActive] = useState(true)
  return (
    <>
      <p>
        <button onClick={() => setIsActive(!isActive)}>
          Toggle Active State
        </button>
      </p>
      <MyDynamicComponent isActive={isActive} />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
