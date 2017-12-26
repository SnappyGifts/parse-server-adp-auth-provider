var config = require('./AdpConfig');

function OpenIDConnectCallbackAdp(request, response) {
    var authCode = request.params.code;
    if (authCode) {
        var fs = require('fs');
        var path = require('path');
        var req = require('request');
        var keyFile = config.PRIVATE_KEY_PATH;
        var certFile = config.SSL_CERTIFICATE_PATH;
        var credentials = {
            clientId: config.CLIENT_ID,
            clientSecret: config.CLIENT_SECRET
        };
        var userPass = [credentials.clientId, credentials.clientSecret].join(':');
        var params = {
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: config.REDIRECT_URL
        };
        var urlParamsString = Object.keys(params).map(function(key) { return key + '=' + params[key]; }).join('&');
        var tokenUrl = 'https://' + userPass + '@accounts.adp.com/auth/oauth/v2/token?' + urlParamsString;
        var options = {
            url: tokenUrl,
            cert: fs.readFileSync(certFile),
            key: fs.readFileSync(keyFile)
        };
        req.post(options, function (error, res, body) {
            if (res.statusCode === 200) {
                var jwtDecode = require('jwt-decode');
                var token = JSON.parse(body);
                var id_token = token.id_token;
                var jwtToken = jwtDecode(id_token);
                var sub = jwtToken.sub;
                var subSplit = sub.split('/');
                var associateOID = subSplit[subSplit.length - 1];
                token.aoid = associateOID;
                response.success(token);
                return;
            }
            console.error('error: ' + response.statusCode);
            console.error(error);
            console.error(body);
            var errorObj = JSON.parse(body);
            response.error(errorObj);
        });
        return;
    }
    response.error('missing params');
}
module.exports = OpenIDConnectCallbackAdp;