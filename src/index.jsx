// Splash screen bundle entry point responsible for mounting the splash view.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/splash/App.jsx'

// Render the splash application inside the root container.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
