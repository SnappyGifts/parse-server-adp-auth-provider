# Parse-Server ADP Auth Provider
### A Parse-Server auth module for ADP

#### Auth flow
1. ADP user (client) clicks on your app's tile at ADP's appstore
2. ADP redirects user to your `REDIRECT_URL` which initiates SSO flow
3. Your app is asking for authorization code to authenticate user with ADP > User will be redirected back to ADP with the authorization code > User will authenticate and be redirected to you
4. Your app is using the authentication code to retrieve an access token to authenticate and login with your app and perform ADP API requests with it

#### Parse Server configuration

1. Add `src\server` files to your project
2. Require both `OpenIDConnectAuthenticateAdp` and `OpenIDConnectCallbackAdp` in `main.js`
3. Define the two functions in your code like this:
    * `Parse.Cloud.define('authAdp', OpenIDConnectAuthenticateAdp)`
    * `Parse.Cloud.define('callbackAdp', OpenIDConnectCallbackAdp)`

#### Parse client configuration
1. Add `src\client` files to your project
2. Define two (2) routes in your app for two stages of SSO:
    * STAGE 1 (Your app) - User clicks on tile at ADP and ADP redirect
     user to your app: `http://localhost:3000/auth?iss={provider}`
     (query for `iss`) - Initiating SSO. `iss` is for being able to
     differ between providers to perform the required authentication
      for each provider your may have. This route will call `Parse.Cloud.run('authAdp')`.
    * STAGE 2 (at ADP) - User authenticates at ADP using their ADP username and password, in return ADP grants your app a code to get access token
    * STAGE 3 (Your app) - ADP redirect again to you with the code
    from STAGE 2: `http://localhost:3000/callback?code={auth_code}` (query for `code`) -
    Authenticate user and query for access token using this authorization code.
    This route will try to perform login using `AdpParseAuthAdapter.login`