'use client';

import { CookiesProvider } from 'next-client-cookies';

export const ClientCookiesProvider = (props) => (
  <CookiesProvider {...props} />
);