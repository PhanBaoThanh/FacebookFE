import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import socketIO from 'socket.io-client';
// import socket from 'socket.io-client'

const root = ReactDOM.createRoot(document.getElementById('root'));

let users = [];



root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

