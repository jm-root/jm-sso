import event from 'jm-event';
import TokenMan from './tokenMan';
import t from '../locale';

/**
 * Class representing a sso.
 */
class SSO {

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
    constructor (opts = {}) {
        event.enableEvent(this);
        this.t = t;
        this.ready = false;
        this.tokenMan = new TokenMan(opts);
        this.tokenMan.once('ready', () => {
            this.ready = true;
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
    signon (opts = {}, cb) {
        let self = this;
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
    touch (token, cb) {
        let self = this;
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
    signout (token, cb) {
        let self = this;
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
    isSignon (token, cb) {
        this.tokenMan.check(token, cb);
        return this;
    }
}

export default SSO;
