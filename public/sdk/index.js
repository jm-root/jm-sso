var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../../sdk');
}

var sdkConfig = sdkConfig || {
    uri: 'http://localhost:20100'
};
jm.sdk.init(sdkConfig);

if (typeof module !== 'undefined' && module.exports) {
    require('./sso.js');
}
