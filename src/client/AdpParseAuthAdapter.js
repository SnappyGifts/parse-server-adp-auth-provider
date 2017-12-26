import Parse from 'parse';
import ParseUser from 'parse/lib/browser/ParseUser';


function authDataAdpUsingAuthCode(code) {
  // callbackAdp is a Parse Cloud defined function at OpenIDConnectCallbackAdp.js
  return Parse.Cloud.run('callbackAdp', {code: code});
}

const LOGOUT_URL = 'https://accounts.adp.com/auth/oauth/v2/logout?post_logout_redirect_uri=https://partners.adp.com';

const provider = {
  authCode: null,
  authenticate(options) {
    authDataAdpUsingAuthCode(this.authCode)
      .then(authData => {
        if (authData) {
          if (options.success) {
            const token = {
              id: authData.aoid,
              token_type: authData.token_type,
              access_token: authData.access_token,
              refresh_token: authData.refresh_token,
              expiration_date: new Date(authData.expires_in * 1000 +
                (new Date()).getTime()).toJSON(),
              scope: authData.scope
            };
            options.success(this, token);
            return;
          }
          options.error(this, authData);
          return;
        }
        if (options.error) {
          options.error(this, authData);
        }
      })
      .fail(err => {
        console.error(err);
        if (options.error) {
          options.error(this, err);
        }
      });
  },
  restoreAuthentication(authData) {
    if (authData) {
      return true;
    }
    Parse.User.logOut();
  },
  getAuthType() {
    return 'adp';
  },
  deauthenticate() {
    window.location = LOGOUT_URL;
    this.restoreAuthentication(null);
  }
};

/**
 *
 * @type {{init(): void, isLinked(*): *, logIn(*=): *, logOut()}}
 */
const ADP = {
  init(options) {
    provider.authCode = options.authCode;
    ParseUser._registerAuthenticationProvider(provider);
  },
  isLinked(user) {
    return user._isLinked('adp');
  },
  logIn(options) {
    return ParseUser._logInWith('adp', options);
  },
  logOut() {
    return ParseUser._logOutWith('adp');
  }
};

export default ADP;
