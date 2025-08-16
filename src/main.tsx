import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Import your context provider
import {  AuthProvider} from './lib/AuthContext'; // adjust path as needed

const container = document.getElementById('root');

if (!container) {
  throw new Error("Root container not found. Make sure there's a div with id='root' in your index.html");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);