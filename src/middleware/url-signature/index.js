/*jslint
    bitwise: true,
    browser: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;
    // init local
    local = module.exports;
    // require modules
    local.crypto = require('crypto');
    // init functions
    local.nop = function () {
    /*
     * this function will do nothing - nop
     */
        return;
    };
    local.urlSign = function (url) {
    /*
     * this function will sign the url-search-param with an hmac signature
     */
        var hmac, urlParsed;
        // init url-search-param
        urlParsed = {};
        urlParsed.search = url.split('#')[0];
        urlParsed.hash = url.split('#').slice(1);
        urlParsed.hash = urlParsed.hash.length > 0
            ? '#' + urlParsed.hash.join('#')
            : '';
        urlParsed.prefix = urlParsed.search.split('?')[0];
        urlParsed.search = urlParsed.search.split('?').slice(1).join('?');
        urlParsed.search = '?' + urlParsed.search + (urlParsed.search.slice(-1) === '&'
            ? ''
            : '&');
        // add timestamp
        urlParsed.search += 'signature_' + Date.now();
        // init hmac
        hmac = new local.crypto.Hmac(
            'sha256',
            new Buffer(process.env.URL_SIGNATURE_SIGNING_KEY ||
                Math.random().toString(16).slice(2))
        );
        // create hmac-256-signature from url-search-param
        urlParsed.search += '=' + encodeURIComponent(
            hmac.update(urlParsed.search).digest('base64')
        );
        return urlParsed.prefix + urlParsed.search + urlParsed.hash;
    };
    local.urlValidate = function (url) {
    /*
     * this function will validate the hmac-256-signature in the url-search-param
     */
        var hmac, validated;
        try {
            url.split('#')[0].replace(
                (/(\?.*?signature_([^&]+?))=([^&]+?)$/),
                function (match0, match1, match2, match3) {
                    // jslint-hack
                    local.nop(match0);
                    // init hmac
                    hmac = new local.crypto.Hmac(
                        'sha256',
                        new Buffer(process.env.URL_SIGNATURE_SIGNING_KEY ||
                            Math.random().toString(16).slice(2))
                    );
                    // validate timestamp with 30000 ms discrepancy
                    validated = (Date.now() - 600000) <= match2 &&
                        match2 <= (Date.now() + 600000) &&
                        // validate hmac-256-signature
                        hmac
                        .update(new Buffer(match1))
                        .digest('base64') === decodeURIComponent(match3);
                }
            );
        } catch (ignore) {
        }
        return !!validated;
    };
}());
