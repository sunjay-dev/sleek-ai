import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import 'highlight.js/styles/agate.css';
import { ClerkProvider } from '@clerk/clerk-react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);