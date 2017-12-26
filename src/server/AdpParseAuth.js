var config = require('AdpConfig');
/**
 *
 * @param appIds
 * @param authData
 * @returns Promise
 */
function validateAppId(appIds, authData) {
    // Returns a promise that fulfills iff this app id is valid.
    return Promise.resolve();
}


/**
 *
 * @param authData
 * @param options
 * @returns Promise
 */
function validateAuthData(authData, options) {
    return new Promise(function(resolve, reject) {
        var fs = require('fs');
        var path = require('path');
        var req = require('request');
        var keyFile = config.PRIVATE_KEY_PATH;
        var certFile = config.SSL_CERTIFICATE_PATH;
        var userInfo = 'https://api.adp.com/core/v1/userinfo';
        var tokenType = authData.token_type;
        var accessToken = authData.access_token;
        var authorizationData = [tokenType, accessToken].join(' ');
        var options = {
            url: userInfo,
            cert: fs.readFileSync(certFile),
            key: fs.readFileSync(keyFile),
            headers: {
                'Authorization': authorizationData,
                'Accept': 'application/json'
            }
        };
        req.get(options, function (error, res, body) {
            if (res.statusCode === 200) {
                var userInfo = JSON.parse(body);
                authData.email = userInfo.email;
                authData.firstName = userInfo.given_name;
                authData.lastName = userInfo.family_name;
                authData.id = userInfo.associateOID;
                authData.ooid = userInfo.organizationOID;
                resolve();
                return;
            }
            var errorObj = JSON.parse(body);
            reject(errorObj);
        });
    });
}


/**
 *
 * @type {{validateAppId: validateAppId, validateAuthData: validateAuthData}}
 */
module.exports = {
    validateAppId: validateAppId,
    validateAuthData: validateAuthData
};