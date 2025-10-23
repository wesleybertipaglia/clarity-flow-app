export const config = {
  useMockServices: true,
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  },
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  },
  storage: {
    geminiApiKey: 'gemini_api_key',
  },
} as const;

export type Config = typeof config;
