/*global Auth0Lock */
import {API_AUTH_CALLBACK} from '../constants/endpoints';

export default function showLogin() {
  const lock = new Auth0Lock('sz3oJ5OyuFHd8K2HgqlyGeXsooYJwGJb', 'app55004639.eu.auth0.com', {
    auth: {
      redirectUrl: API_AUTH_CALLBACK,
      responseType: 'code',
      params: {
        scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
      }
    }
  });

  lock.show();
}
