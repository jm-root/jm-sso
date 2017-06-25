'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require('../consts');

var _consts2 = _interopRequireDefault(_consts);

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _jmMq = require('jm-mq');

var _jmMq2 = _interopRequireDefault(_jmMq);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Err = _consts2.default.Err;

/**
 * Class representing a tokenMan.
 */
var TokenMan = function () {

    /**
     * Create a tokenMan.
     * @param {Object} opts
     * @example
     * opts参数:{
     *  mq: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
     *  secret: 安全密钥(可选，默认'')
     *  tokenKey: tokenKey, (可选, 默认'sso:token')
     *  tokenExpire: token过期时间, 单位秒(可选, 默认0永远不过期)
     * }
     */
    function TokenMan() {
        var _this = this;

        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TokenMan);

        _jmEvent2.default.enableEvent(this);
        this.ready = false;
        this.secret = opts.secret || '';
        this.tokenKey = opts.tokenKey || _consts2.default.TokenKey;
        this.tokenExpire = opts.tokenExpire || 0;

        var cbMQ = function cbMQ() {
            _this.ready = true;
        };
        var mq = opts.mq;
        if (typeof opts.mq === 'string') {
            mq = (0, _jmMq2.default)({ url: opts.mq }, cbMQ);
        } else if (mq) {
            this.ready = true;
        }
        mq || (mq = (0, _jmMq2.default)(null, cbMQ));
        this.mq = mq;
    }

    /**
     * 生成token
     * @param {String} id
     * @return {String} token
     */


    _createClass(TokenMan, [{
        key: 'create',
        value: function create() {
            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            id += Math.random() + Date.now().toString() + this.secret;
            var sha256 = _crypto2.default.createHash('sha256');
            sha256.update(id);
            var token = sha256.digest('hex');
            return token;
        }

        /**
         * 添加用户token
         * @param {Object} opts
         * @example
         * opts参数:{
         *  id: user id
         *  token: token(可选)
         *  expire: token过期时间, 单位秒, 0代表永不过期(可选)
         * }
         * @param {Function} cb
         * @return {TokenMan} for chaining
         */

    }, {
        key: 'add',
        value: function add() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var cb = arguments[1];

            var mq = this.mq;
            opts.expire || (opts.expire = this.tokenExpire);
            opts.token || (opts.token = this.create(opts.id));
            opts.time || (opts.time = Date.now());
            mq.hset(this.tokenKey, opts.token, JSON.stringify(opts), function (err, doc) {
                if (err) {
                    doc = Err.FA_ADD_TOKEN;
                } else {
                    doc = opts;
                }
                cb && cb(err, doc);
            });
            return this;
        }

        /**
         * 验证用户token
         * @param {String} token
         * @param {Function} cb
         * @return {TokenMan} for chaining
         */

    }, {
        key: 'check',
        value: function check(token, cb) {
            var self = this;
            var mq = this.mq;
            if (!token) {
                cb(null, Err.FA_TOKEN_INVALID);
                return this;
            }
            mq.hget(this.tokenKey, token, function (err, doc) {
                if (err) {
                    doc = Err.FA_CHECK_TOKEN;
                } else if (doc) {
                    try {
                        doc = JSON.parse(doc);
                        if (doc.expire && doc.time + doc.expire * 1000 < Date.now()) {
                            self.delete(token);
                            doc = Err.FA_TOKEN_EXPIRED;
                        }
                    } catch (e) {
                        err = e;
                        doc = Err.FA_PARSE_TOKEN;
                    }
                } else {
                    doc = Err.FA_TOKEN_INVALID;
                }
                cb && cb(err, doc);
            });
            return this;
        }

        /**
         * 延长用户token过期时间
         * @param {String} token
         * @param {Function} cb
         * @return {TokenMan} for chaining
         */

    }, {
        key: 'touch',
        value: function touch(token, cb) {
            var self = this;
            var mq = this.mq;
            if (!token) {
                cb(null, Err.FA_TOKEN_INVALID);
                return this;
            }
            this.check(token, function (err, doc) {
                if (!err && doc && !doc.err) {
                    doc.time = Date.now();
                    var ret = doc;
                    mq.hset(self.tokenKey, token, JSON.stringify(doc), function (err, doc) {
                        if (err) {
                            doc = Err.FA_TOUCH_TOKEN;
                        } else {
                            doc = ret;
                        }
                        cb && cb(err, doc);
                    });
                } else {
                    cb && cb(err, doc);
                }
            });
            return this;
        }

        /**
         * 删除用户token
         * @param {String} token
         * @param {Function} cb
         * @return {TokenMan} for chaining
         */

    }, {
        key: 'delete',
        value: function _delete(token, cb) {
            if (!token) {
                cb(null, Err.FA_TOKEN_INVALID);
                return this;
            }
            var mq = this.mq;
            mq.hdel(this.tokenKey, token, function (err, doc) {
                err && (doc = Err.FA_DELETE_TOKEN);
                cb && cb(err, doc);
            });
            return this;
        }
    }]);

    return TokenMan;
}();

exports.default = TokenMan;
module.exports = exports['default'];