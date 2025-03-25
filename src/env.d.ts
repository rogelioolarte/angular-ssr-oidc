// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;
  // Replace the following with your own environment variables.
  // Example: NGX_VERSION: string;
  [key: string]: any;
  readonly NG_APP_OAUTH2_SCOPE: string;
  readonly NG_APP_OAUTH2_RESPONSE_TYPE: string;
  readonly NG_APP_OAUTH2_OIDC: boolean;
  readonly NG_APP_OAUTH2_CLIENT_ID: string;
  readonly NG_APP_OAUTH2_ISSUER: string;
  readonly NG_APP_OAUTH2_REDIRECT_URI: string;
  readonly NG_APP_OAUTH2_POST_LOGOUT_REDIRECT_URI: string;
  readonly NG_APP_OAUTH2_STORAGE_PREFIX: string;
}

// Choose how to access the environment variables.
// Remove the unused options.

// 1. Use import.meta.env.YOUR_ENV_VAR in your code. (conventional)
declare interface ImportMeta {
  readonly env: Env;
}

// 2. Use _NGX_ENV_.YOUR_ENV_VAR in your code. (customizable)
// You can modify the name of the variable in angular.json.
// ngxEnv: {
//  define: '_NGX_ENV_',
// }
declare const _NGX_ENV_: Env;

// 3. Use process.env.YOUR_ENV_VAR in your code. (deprecated)
declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}
