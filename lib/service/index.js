'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _tokenMan = require('./tokenMan');

var _tokenMan2 = _interopRequireDefault(_tokenMan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing a sso.
 */
var SSO = function () {

    /**
     * Create a sso.
     * @param {Object} opts
     * @example
     * opts参数:{
     *  redis: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
     *  secret: 安全密钥(可选，默认'')
     *  tokenKey: tokenKey, (可选, 默认'sso:token')
     *  tokenExpire: token过期时间, 单位秒(可选, 默认0永远不过期)
     * }
     */
    function SSO() {
        var _this = this;

        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, SSO);

        _jmEvent2.default.enableEvent(this);
        this.ready = false;
        this.tokenMan = new _tokenMan2.default(opts);
        this.tokenMan.once('ready', function () {
            _this.ready = true;
        });
    }

    /**
     * 登陆
     * @param {Object} opts
     * @example
     * opts参数:{
     *  id: user id
     *  token: token(可选)
     *  expire: token过期时间(可选)
     * }
     * @param {Function} cb 回调cb(err, doc)
     * @return {SSO} for chaining
     */


    _createClass(SSO, [{
        key: 'signon',
        value: function signon() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var cb = arguments[1];

            var self = this;
            self.emit('beforeSignon', opts);
            this.tokenMan.add(opts, function (err, doc) {
                if (!err && doc) {
                    self.emit('signon', opts, doc);
                }
                cb && cb(err, doc);
            });
            return this;
        }

        /**
         * 延长有效期
         * @param {String} token
         * @param {Function} cb 回调cb(err, doc)
         * @return {SSO} for chaining
         */

    }, {
        key: 'touch',
        value: function touch(token, cb) {
            var self = this;
            this.tokenMan.touch(token, function (err, doc) {
                if (!err) self.emit('touch', token, doc);
                cb && cb(err, doc);
            });
            return this;
        }

        /**
         * 登出
         * @param {String} token
         * @param {Function} cb 回调cb(err, doc)
         * @return {SSO} for chaining
         */

    }, {
        key: 'signout',
        value: function signout(token, cb) {
            var self = this;
            this.tokenMan.delete(token, function (err, doc) {
                if (!err && doc) self.emit('signout', token, doc);
                cb && cb(err, doc);
            });
            return this;
        }

        /**
         * 是否登陆
         * @param {String} token
         * @param {Function} cb 回调cb(err, doc)
         * @return {SSO} for chaining
         */

    }, {
        key: 'isSignon',
        value: function isSignon(token, cb) {
            this.tokenMan.check(token, cb);
            return this;
        }
    }]);

    return SSO;
}();

exports.default = SSO;
module.exports = exports['default'];