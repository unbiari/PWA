import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="256551098279-92ma80dl1jqpeeiij7ad14mp23vns84i.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker 등록 성공:', registration);
      })
      .catch(error => {
        console.log('Service Worker 등록 실패:', error);
      });
  });
}
