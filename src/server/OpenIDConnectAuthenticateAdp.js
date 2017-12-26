var config = require('./AdpConfig');

function OpenIDConnectAuthenticateAdp(request, response) {
    var adpConnection = require('adp-connection');
    var connectionOptions = {
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        granttype: 'authorization_code',
        sslKeyPath: config.PRIVATE_KEY_PATH,
        sslCertPath: config.SSL_CERTIFICATE_PATH,
        callbackUrl: config.REDIRECT_URL
    };
    try {
        var connection = adpConnection.createConnection(connectionOptions);
        var url = connection.getAuthorizationRequest();
        console.log('Redirecting to ' + url);
        response.success(url);
    } catch (error) {
        response.error(error);
    }
}
module.exports = OpenIDConnectAuthenticateAdp;