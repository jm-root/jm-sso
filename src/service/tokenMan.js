import consts from '../consts';
let Err = consts.Err;
import event from 'jm-event';
import _mq from 'jm-mq';
import crypto from 'crypto';

/**
 * Class representing a tokenMan.
 */
class TokenMan {

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
    constructor (opts = {}) {
        event.enableEvent(this);
        this.ready = false;
        this.secret = opts.secret || '';
        this.tokenKey = opts.tokenKey || consts.TokenKey;
        this.tokenExpire = opts.tokenExpire || 0;

        let cbMQ = () => {
            this.ready = true;
        };
        let mq = opts.mq;
        if (typeof opts.mq === 'string') {
            mq = _mq({url: opts.mq}, cbMQ);
        } else if (mq) {
            this.ready = true;
        }
        mq || (mq = _mq(null, cbMQ));
        this.mq = mq;
    }

    /**
     * 生成token
     * @param {String} id
     * @return {String} token
     */
    create (id = '') {
        id += Math.random() + Date.now().toString() + this.secret;
        let sha256 = crypto.createHash('sha256');
        sha256.update(id);
        let token = sha256.digest('hex');
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
    add (opts = {}, cb) {
        let mq = this.mq;
        opts.expire || (opts.expire = this.tokenExpire);
        opts.token || (opts.token = this.create(opts.id));
        opts.time || (opts.time = Date.now());
        mq.hset(this.tokenKey, opts.token,
            JSON.stringify(opts), function (err, doc) {
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
    check (token, cb) {
        let self = this;
        let mq = this.mq;
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
                    if (doc.expire &&
                        doc.time + doc.expire * 1000 < Date.now()) {
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
    touch (token, cb) {
        let self = this;
        let mq = this.mq;
        if (!token) {
            cb(null, Err.FA_TOKEN_INVALID);
            return this;
        }
        this.check(token, function (err, doc) {
            if (!err && doc && !doc.err) {
                doc.time = Date.now();
                let ret = doc;
                mq.hset(self.tokenKey, token, JSON.stringify(doc),
                    function (err, doc) {
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
    delete (token, cb) {
        if (!token) {
            cb(null, Err.FA_TOKEN_INVALID);
            return this;
        }
        let mq = this.mq;
        mq.hdel(this.tokenKey, token, function (err, doc) {
            err && (doc = Err.FA_DELETE_TOKEN);
            cb && (cb(err, doc));
        });
        return this;
    }
}

export default TokenMan;