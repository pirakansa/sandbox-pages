// Dashboard bundle entry point used by the top-level page.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/dashboard/App.jsx'

// Boot the main dashboard React tree within the DOM root.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
