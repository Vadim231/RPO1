import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/App.css';
import 'flyonui/flyonui';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
