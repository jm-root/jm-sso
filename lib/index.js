'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ['redis', 'tokenExpire', 'tokenKey', 'secret'].forEach(function (key) {
        process.env[key] && (opts[key] = process.env[key]);
    });

    var o = new _service2.default(opts);
    o.router = _router2.default;
    return o;
};

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * sso module.
 * @module sso
 * @param {Object} opts
 * @example
 * opts参数:{
 *  redis: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
 *  secret: 安全密钥(可选，默认'')
 *  tokenKey: tokenKey, (可选, 默认'sso:token')
 *  tokenExpire: token过期时间, 单位秒(可选, 默认0永远不过期)
 * }
 * @return {SSO}
 */
module.exports = exports['default'];