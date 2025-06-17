// src/auth/Auth0ProviderWithNavigate.tsx
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import type {AppState} from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE!;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL!;

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || '/HomePage');
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
