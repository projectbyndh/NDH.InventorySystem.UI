import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import ErrorBoundary from './Components/UI/ErrorBoundary'
import { showToast } from './Components/UI/toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <ToastContainer position="top-right" newestOnTop closeOnClick pauseOnHover hideProgressBar={false} />
  </StrictMode>,
)

// Global runtime error handlers (surface toasts + log)
window.addEventListener('error', (ev) => {
  try {
    const msg = ev?.message || (ev?.error && ev.error.message) || 'Unexpected error';
    console.error('Global error:', ev.error || ev);
    showToast(`Unhandled error: ${msg}`, 'error', 10000);
  } catch (e) {
    console.error(e);
  }
});

window.addEventListener('unhandledrejection', (ev) => {
  try {
    const reason = ev?.reason;
    const msg = (reason && (reason.message || String(reason))) || 'Unhandled promise rejection';
    console.error('Unhandled rejection:', reason);
    showToast(`Unhandled rejection: ${msg}`, 'error', 10000);
  } catch (e) {
    console.error(e);
  }
});
