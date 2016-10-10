var jm = require('jm-common');
var DB = jm.DB;
var sso = require('../lib');

module.exports = function (app, opts) {
    opts = opts || {};
    DB.connect(opts.db);
    var mq = jm.mq({url: opts.mq});
    var s = sso({
        mq: mq,
        tokenExpire: opts.tokenExpire || 3600,
        disableVerifyCode: opts.disableVerifyCode || false,
        disableAutoUid: opts.disableAutoUid || false
    });

    app.use(opts.prefix || '', s.router());
};
