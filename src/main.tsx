import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import { config } from './config/environment';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={config.auth0.domain}
        clientId={config.auth0.clientId}
        cacheLocation="localstorage"
        useRefreshTokens={true}
        authorizationParams={{
          redirect_uri: window.location.origin + '/dashboard',
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>
);
