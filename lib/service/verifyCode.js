var consts = require('../consts/consts');
var ERROR = consts.ERR;
var VerifyCodeKey = consts.VerifyCodeKey;
var _ = require('lodash');

module.exports = function (model, opts) {
    opts = opts || {};
    var mq = model.mq;

    /**
     * 生成验证码
     * @method SSO#createVerifyCode
     * @param opts
     * @example
     * opts参数:{
     *  length: 验证码长度(可选, 默认6)
     * }
     * @param cb
     * @returns {string} 生成的验证码
     */
    model.createVerifyCode = function (opts, cb) {
        opts = opts || {};
        var length = opts.length || consts.VerifyCodeLength;
        if(!_.isInteger(length)) length = consts.VerifyCodeLength;
        var Num = '';
        for (var i = 0; i < length; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        if(cb) cb(null, Num);
        return Num;
    };

    /**
     * 保存验证码
     * @method SSO#saveVerifyCode
     * @param key
     * @param code
     * @param expire 过期时间，单位秒(可选，默认60秒)
     * @param cb
     */
    model.saveVerifyCode = function (key, code, expire, cb) {
        var numargs = arguments.length;
        if(numargs == 3) {
            cb = expire;
            expire = 60;
        }
        var time = Date.now();
        if(!code){
            code = this.createVerifyCode();
        }
        var v = {
            code: code,
            time: time,
            expire: expire
        };
        mq.hset(VerifyCodeKey, key, JSON.stringify(v), function(err, doc) {
            if (err) {
                cb(err, ERROR.FA_SAVE_VERIFYCODE);
            } else {
                cb(null, v);
            }
        });
    };

    /**
     * 校验验证码
     * @method SSO#checkVerifyCode
     * @param key
     * @param code
     * @param cb
     */
    model.checkVerifyCode = function (key, code, cb) {
        var self = this;
        mq.hget(VerifyCodeKey, key, function (err, doc) {
            if (err) {
                cb(err, ERROR.FA_CHECK_VERIFYCODE);
            } else {
                if(!doc) return cb(null, false);
                try{
                    doc = JSON.parse(doc);
                    if(doc.expire && doc.time + doc.expire * 1000 < Date.now()){
                        self.destroyVerifyCode(key, function(err, doc){
                            if(err){
                                return cb(err, doc);
                            }else{
                                return cb(new Error(ERROR.FA_VERIFYCODE_EXPIRED.msg), ERROR.FA_VERIFYCODE_EXPIRED);
                            }
                        });
                    }else{
                        cb(null, doc.code === code);
                    }
                }catch(e){
                    return cb(e, ERROR.FA_PARSE_VERIFYCODE);
                }
            }
        });
    };

    /**
     * 删除验证码
     * @method SSO#destroyVerifyCode
     * @param key
     * @param cb
     */
    model.destroyVerifyCode = function(key, cb) {
        mq.hdel(VerifyCodeKey, key, function(err, doc) {
            if (err) {
                cb(err, ERROR.FA_DESTROY_VERIFYCODE);
            } else {
                cb(null, doc);
            }
        });
    };

    return model;
};

