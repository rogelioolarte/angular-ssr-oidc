export const environment = {
  authConfig: {
    scope: import.meta.env.NG_APP_OAUTH2_SCOPE,
    responseType: import.meta.env.NG_APP_OAUTH2_RESPONSE_TYPE,
    oidc: import.meta.env.NG_APP_OAUTH2_OIDC,
    clientId: import.meta.env.NG_APP_OAUTH2_CLIENT_ID,
    issuer: import.meta.env.NG_APP_OAUTH2_ISSUER,
    redirectUri: import.meta.env.NG_APP_OAUTH2_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.NG_APP_OAUTH2_POST_LOGOUT_REDIRECT_URI,
    requireHttps: false, // required for running locally
  },
  storage_prefix: import.meta.env.NG_APP_OAUTH2_STORAGE_PREFIX,
  production: true,
};
