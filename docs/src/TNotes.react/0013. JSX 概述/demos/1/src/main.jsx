import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'

// function Welcome(props) {
//   return <h1>Hello, {props.name}</h1>
// }
function Welcome(props) {
  return createElement(
    "h1",
    null,
    "Hello, ",
    props.name
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Welcome name="Tdahuyou" /> */}
    {createElement(Welcome, {name: "Tdahuyou"})}
  </StrictMode>
)
