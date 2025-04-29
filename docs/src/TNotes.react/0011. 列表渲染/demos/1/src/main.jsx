import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
]

function ShoppingList() {
  const listItems = products.map((product) => (
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen',
      }}
    >
      {product.title}
    </li>
  ))

  return <ul>{listItems}</ul>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShoppingList />
  </StrictMode>
)
