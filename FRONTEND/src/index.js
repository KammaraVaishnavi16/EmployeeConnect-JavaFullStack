import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='196039960242-5moqid1c29dfe9uobu9e8fafh7b93ato.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
    
  </React.StrictMode>
);

reportWebVitals();
