import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'src/App'
import './index.scss'

const root = createRoot(document.getElementById('root') as HTMLElement)
console.log('IN index')
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
