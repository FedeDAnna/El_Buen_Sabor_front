import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {Auth0ProviderWithNavigate}  from './components/Auth0/Auth0ProviderWithNavigate.tsx';
import {AuthTokenProvider }  from './components/Auth0/AuthTokenContext.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <AuthTokenProvider >
          <App />
        </AuthTokenProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
