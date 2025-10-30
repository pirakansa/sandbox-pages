// Entry point for the login bundle that mounts the login React tree.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/login/App.jsx'

// Mount the login application into the DOM root.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
