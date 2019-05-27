url-signature
=============
minimal hmac-256 url signer and validator with zero npm dependencies

# notes
- adds an hmac-256 signature to the url's search param, based on the original search param, and a timestamp
- the timestamp is valid for +/-30 seconds

# usage
```
var url, url_signature, urlSigned;

// init env var $URL_SIGNATURE_SIGNING_KEY
process.env.URL_SIGNATURE_SIGNING_KEY = '17855f97-e76f-4ef8-8b6f-5aa7afd6725d';

// require module
url_signature = require('url-signature');

// init url
url = 'http://aa.com/bb?cc=1&dd=2#ff';

// sign url with $URL_SIGNATURE_SIGNING_KEY
urlSigned = url_signature.urlSign(url);
// output - http://aa.com/bb?cc=1&dd=2&signature_1452718914605=O133aaw8cVnu1C4MDlzbj%2BLMVGtMPos7wIx%2B3%2BnLJRc%3D#ff

// validate signed url with $URL_SIGNATURE_SIGNING_KEY
url_signature.urlValidate(urlSigned);
// output - true
```

# todo
- none

# changes since 5ed6f5b3
- npm publish 2015.12.2
- merge timestamp param into signature param
- none
