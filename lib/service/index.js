var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var validator = require('validator');

var jmcommon = require('jm-common');
var utils = jmcommon.utils;

var consts = require('../consts/consts');
var ERROR = consts.ERR;
var TokenKey = consts.TokenKey;

/**
 * SSO服务
 * @class SSO
 * @param {Object} [opts={}] 参数
 * @example
 * opts参数:{
 *  mq: (可选, 如果不填，自动连接默认mq 127.0.0.1:6379)
 *  modelName: 表名称(可选，默认user)
 *  schema: 表结构定义(可选, 如果不填采用默认表结构)
 *  schemaExt: 表结构扩展定义(可选, 对于schema扩展定义)
 *  disableVerifyCode: 是否禁用验证码(可选)
 *  tokenExpire: token过期时间, 单位秒(可选, 默认0永远不过期)
 *  disableAutoUid: 是否禁止自动生成uid(可选，默认不禁止)
 * }
 * @returns {Object}
 * @example
 * 返回结果:{
 *  user: user服务
 *  mq: mq服务
 * }
 */
module.exports = function (opts) {
    opts = opts || {};
    var mq = opts.mq || jmcommon.mq(opts);
    var disableVerifyCode = opts.disableVerifyCode || false;
    var tokenExpire = opts.tokenExpire || 0;
    var disableAutoUid = opts.disableAutoUid || false;
    var model = {
        /**
         * 是否禁止验证码功能
         * @member SSO#disableVerifyCode
         */
        disableVerifyCode: disableVerifyCode,

        /**
         * 是否禁止自动生成uid
         * @member SSO#disableAutoUid
         */
        disableAutoUid: disableAutoUid,

        /**
         * token过期时间, 单位秒
         * @member SSO#tokenExpire
         */
        tokenExpire: tokenExpire,

        /**
         * mq
         * @member SSO#mq
         */
        mq: mq,

        /**
         * 对密码加密
         * @method SSO#encryptPasswd
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  id: (可选)
         *  uid: (可选)
         *  passwd: 密码明文(必填)
         * }
         * @returns {Object} 返回加密后的密码对象
         * @example
         * 返回结果:{
         *  salt: 密钥
         *  passwd: 密码密文
         * }
         */
        encryptPasswd: function (opts) {
            if (!opts.passwd) return null;
            opts.salt = jmcommon.token.createKey(opts.id || opts.uid || '');
            opts.passwd = jmcommon.token.hash(opts.passwd + opts.salt);
            return opts;
        },

        /**
         * 验证密码
         * @method SSO#checkPasswd
         * @param {Object} passwdEncrypted 密码密钥和密文
         * @example
         * passwdEncrypted参数:{
         *  salt: 密钥(必填)
         *  passwd: 密码密文(必填)
         * }
         * @param {string} passwd 密码明文
         * @example
         * passwd参数: abc123
         * @returns {boolean}
         */
        checkPasswd: function (passwdEncrypted, passwd) {
            return passwdEncrypted.passwd == jmcommon.token.hash(passwd + passwdEncrypted.salt);
        },

        /**
         * 生成用户token
         * @method SSO#createToken
         * @param id 用户id
         * @param cb
         */
        createToken: function(id, cb) {
            var token = jmcommon.token.createKey(id);
            if(cb) cb(null, token);
            return token;
        },

        /**
         * 保存用户token
         * @method SSO#saveToken
         * @param id 用户id
         * @param token 用户token
         * @param expire 过期时间, 单位秒, 0代表永不过期
         * @param cb
         */
        saveToken: function(id, token, expire, cb) {
            var numargs = arguments.length;
            if(numargs == 2) {
                cb = token;
                token = null;
                expire = 0;
            }else if(numargs == 3) {
                cb = expire;
                expire = 0;
            }
            token = token || this.createToken(id);
            var time = Date.now();
            var v = {
                id: id,
                time: time,
                expire: expire
            };
            mq.hset(TokenKey, token, JSON.stringify(v), function(err, doc) {
                if (err) {
                    cb(err, ERROR.FA_SAVE_TOKEN);
                } else {
                    cb(null, token);
                }
            });
        },

        /**
         * 验证用户token
         * @method SSO#checkToken
         * @param token
         * @param cb
         */
        checkToken: function(token, cb) {
            var self = this;
            mq.hget(TokenKey, token, function(err, doc) {
                if (err) {
                    cb(err, ERROR.FA_CHECK_TOKEN);
                } else {
                    if(!doc) return cb(null, null);
                    try{
                        doc = JSON.parse(doc);
                        if(doc.expire && doc.time + doc.expire * 1000 < Date.now()){
                            self.destroyToken(token, function(err, doc){
                                if(err){
                                    return cb(err, doc);
                                }else{
                                    return cb(new Error(ERROR.FA_TOKEN_EXPIRED.msg), ERROR.FA_TOKEN_EXPIRED);
                                }
                            });
                        }else{
                            cb(null, doc);
                        }
                    }catch(e){
                        return cb(e, ERROR.FA_PARSE_TOKEN);
                    }
                }
            });
        },

        /**
         * 延长用户token过期时间
         * @method SSO#touchToken
         * @param token
         * @param cb
         */
        touchToken: function(token, cb) {
            this.checkToken(token, function(err, doc){
                if(err) return cb(err, doc);
                if(!doc.expire) return cb(null, token);
                doc.time = Date.now();
                mq.hset(TokenKey, token, JSON.stringify(doc), function(err, doc) {
                    if (err) {
                        cb(err, ERROR.FA_TOUCH_TOKEN);
                    } else {
                        cb(null, token);
                    }
                });
            });
        },

        /**
         * 删除用户token
         * @method SSO#destroyToken
         * @param token
         * @param cb
         */
        destroyToken: function(token, cb) {
            mq.hdel(TokenKey, token, function(err, doc) {
                if (err) {
                    cb(err, ERROR.FA_DESTROY_TOKEN);
                } else {
                    cb(null, doc);
                }
            });
        },

        /**
         * 查找用户
         * @method SSO#findUser
         * @param {Object} opts 查找项目
         * @example
         * opts参数:{
         *  any: 任意匹配(可选)
         *  account: 按帐号查找(可选)
         *  id: 按id查找(可选)
         *  uid: 按uid查找(可选)
         *  email: 按email查找(可选)
         *  mobile: 按mobile查找(可选)
         * }
         * @param cb 回调cb(err,doc)
         * @example
         * 查找成功时doc为查到的用户信息，用户不存在时doc=null
         */
        findUser: function (opts, cb) {
            var query = [];
            if (opts.any != undefined) {
                var any = opts.any;
                if (validator.isInt(any)) {
                    if (opts.uid == undefined) {
                        opts.uid = any;
                    }
                    opts.mobile = opts.mobile || any;
                }
                if (validator.isEmail(any)) {
                    opts.email = opts.email || any;
                } else {
                    opts.account = opts.account || any;
                }
                if(ObjectId.isValid(any)){
                    opts.id = opts.id || any;
                }
            }
            if (opts.uid != undefined) {
                query.push({
                    uid: opts.uid
                })
            }
            if (opts.account) {
                query.push({
                    account: opts.account
                })
            }
            if (opts.email) {
                query.push({
                    email: opts.email
                })
            }
            if (opts.mobile) {
                query.push({
                    mobile: opts.mobile
                })
            }
            if (opts.id) {
                query.push({
                    _id: opts.id
                })
            }

            if (!query.length) {
                cb(null, null);
                return;
            }

            this.user.findOne({'$or': query}, function (err, doc) {
                if (err) {
                    cb(err, ERROR.FA_FIND_USER);
                } else {
                    cb(err, doc);
                }
            });
        },

        __signup: function (opts, cb) {
            var self = this;
            this.findUser(opts, function (err, doc) {
                if (err) {
                    cb(err, doc);
                    return;
                }

                if (doc) {
                    cb(new Error('SSO#signup User already exists'), ERROR.FA_USER_EXIST);
                    return;
                }

                self.encryptPasswd(opts);
                self.user.create(opts, function (err, doc) {
                    if (err) {
                        cb(err, ERROR.FA_CREATE_USER);
                    } else {
                        cb(err, doc);
                    }
                });
            })
        },

        /**
         * 用户注册
         * @method SSO#signup
         * @param opts
         * @param cb
         */
        signup: function (opts, cb) {
            var self = this;
            self.__signup(opts, function (err, doc) {
                self.emit('signup', opts, err, doc);
                cb(err, doc);
            });
        },

        __signon: function (opts, cb) {
            var self = this;
            this.findUser(opts, function (err, doc) {
                if (err) {
                    return cb(err, doc);
                }
                if (doc) {
                    if(!doc.active){
                        return cb(new Error('SSO#signon User not active'), ERROR.FA_USER_NOT_ACTIVE);
                    }
                    if(doc.status == undefined){
                        doc.status = 1;
                    }else if(doc.status == -1){
                        return cb(new Error('SSO#signon User status deleted'), ERROR.FA_USER_DELETED);
                    }else if(doc.status == 0){
                        return cb(new Error('SSO#signon User status not valid'), ERROR.FA_USER_NOT_VALID);
                    }
                    if (!opts.noauth) {
                        if (!self.checkPasswd(doc, opts.passwd)) {
                            return cb(new Error('SSO#signon Password error'), ERROR.FA_PASSWD_ERROR);
                        }
                    }
                    var id = doc.id;
                    if(opts.expire && !_.isNumber(opts.expire)) {
                        opts.expire = Number(opts.expire);
                    }
                    var expire = opts.expire || self.tokenExpire || 0;
                    self.saveToken(id, null, expire, function(err, token){
                        if (err) {
                            cb(err, token);
                        } else {
                            doc.expire = expire;
                            doc.token = token;
                            cb(null, doc);
                        }
                    });
                } else {
                    return cb(new Error('SSO#signon User not exists'), ERROR.FA_NOT_EXIST);
                }
            });
        },

        /**
         * 用户登录
         * @method SSO#signon
         * @param opts
         * @example
         * opts参数:{
         *  any: 任意匹配(可选)
         *  account: 按帐号查找(可选)
         *  id: 按id查找(可选)
         *  uid: 按uid查找(可选)
         *  email: 按email查找(可选)
         *  mobile: 按mobile查找(可选)
         *  passwd: 密码(可选)
         *  expire: token过期时间(可选)
         *  noauth: 免验证密码直接登陆(可选)
         * }
         * @param cb
         */
        signon: function (opts, cb) {
            var self = this;
            self.__signon(opts, function (err, doc) {
                self.emit('signon', opts, err, doc);
                cb(err, doc);
            });
        },

        /**
         * 免验证密码直接登陆, 用于系统内部调用
         * @method SSO#signon_noauth
         * @param opts
         * @param cb
         */
        signon_noauth: function (opts, cb) {
            opts.noauth = true;
            this.signon(opts, cb);
        },

        /**
         * 游客登录
         * @method SSO#signon_guest
         * @param opts
         * @param cb
         */
        signon_guest: function (opts, cb) {
            var self = this;
            if (arguments.length === 1 && typeof opts === 'function') {
                cb = opts;
                opts = {};
            } else {
                opts = opts || {};
                cb = cb || function () {
                    };
            }

            self.signup(opts, function (err, doc) {
                if (err) {
                    return cb(err, doc);
                } else {
                    self.signon_noauth({
                        id: doc.id
                    }, cb);
                }
            });
        },

        __signout: function (token, cb) {
            if (!token) return cb();
            this.destroyToken(token, cb);
        },

        /**
         * 用户登出
         * @method SSO#signout
         * @param token
         * @param cb
         */
        signout: function (token, cb) {
            var self = this;
            self.__signout(token, function (err, id) {
                self.emit('signout', token, err, id);
                cb(err, id);
            });
        },

        __updateUser: function (id, opts, cb) {
            var self = this;
            var c = {_id: id};

            if (opts.passwd && !opts.salt) {
                var o = {
                    id: id,
                    passwd: opts.passwd
                };
                self.encryptPasswd(o);
                opts.passwd = o.passwd;
                opts.salt = o.salt;
            }

            this.user.update(c, opts, {}, function (err, doc) {
                if (err) {
                    cb(err, ERROR.FA_UPDATE_USER);
                } else {
                    cb(err, doc);
                }
            });
        },

        /**
         * 更新用户信息
         * @method SSO#updateUser
         * @param id
         * @param opts
         * @param cb
         */
        updateUser: function (id, opts, cb) {
            var self = this;
            self.__updateUser(id, opts, function (err, doc) {
                self.emit('updateUser', id, opts, err, doc);
                cb(err, doc);
            });
        },

        __updateUserExt: function (id, opts, replaceAll, cb) {
            this.findUser({id: id}, function (err, doc) {
                if (err) {
                    cb(err, ERROR.FA_FIND_USER);
                    return;
                }

                if (!doc.ext) {
                    doc.ext = {};
                }
                var ext = doc.ext;
                if (replaceAll) {
                    doc.ext = opts;
                } else {
                    utils.clone(opts, ext);
                }
                doc.markModified('ext');
                doc.save(function (err, doc) {
                    if (err) {
                        cb(err, ERROR.FA_SAVE_USER);
                    } else {
                        cb(err, doc);
                    }
                });
            })
        },

        /**
         * 更新用户扩展信息
         * @method SSO#updateUserExt
         * @param id
         * @param opts
         * @param replaceAll
         * @param cb
         */
        updateUserExt: function (id, opts, replaceAll, cb) {
            var self = this;
            self.__updateUserExt(id, opts, replaceAll, function (err, doc) {
                self.emit('updateUserExt', id, opts, err, doc);
                cb(err, doc);
            });
        },

        /**
         * 修改密码
         * @method SSO#updatePasswd
         * @param opts
         * @param cb
         */
        updatePasswd: function (opts, cb) {
            var self = this;
            this.findUser(opts, function (err, doc) {
                if (err) {
                    cb(err, ERROR.FA_FIND_USER);
                    return;
                }

                if (!doc) {
                    cb(new Error('SSO#updatePasswd User not exists'), ERROR.FA_NOT_EXIST);
                    return;
                }

                if (!self.checkPasswd(doc, opts.passwd)) {
                    cb(new Error('SSO#updatePasswd Old password wrong'), ERROR.FA_PASSWD_ERROR);
                    return;
                }

                var id = doc.id;
                var o = {
                    id: id,
                    passwd: opts.newPasswd
                };
                self.encryptPasswd(o);
                delete o.id;
                self.updateUser(id, o, function (err, doc) {
                    if (err) {
                        cb(err, ERROR.FA_UPDATE_USER);
                    } else {
                        cb(err, doc);
                    }
                });
            })
        },

        /**
         * 是否登陆
         * @method SSO#isSignon
         * @param token
         * @param cb
         * @returns {*}
         */
        isSignon: function (token, cb) {
            if(typeof token === 'object'){
                token = token.token;
            }
            if(!token) return cb();
            this.checkToken(token, function(err, doc){
                if(err) return cb(err, doc);
                if(doc){
                    cb(null, doc.id);
                }else{
                    cb();
                }
            });
        },

        /**
         * 查找多个用户
         * @method SSO#findUsers
         * @param opts
         * @param cb
         */
        findUsers: function (opts, cb) {
            var query = [];
            if (opts.any != undefined) {
                var any = opts.any;
                if (opts.uid == undefined) {
                    opts.uid = any;
                }
                opts.account = opts.account || any;
                opts.email = opts.email || any;
                opts.mobile = opts.mobile || any;
            }
            if (opts.uid != undefined) {
                query.push({
                    uid: {'$in': opts.uid}
                })
            }
            if (opts.account) {
                query.push({
                    account: {'$in': opts.account}
                })
            }
            if (opts.email) {
                query.push({
                    email: {'$in': opts.email}
                })
            }
            if (opts.mobile) {
                query.push({
                    mobile: {'$in': opts.mobile}
                })
            }
            if (opts.id) {
                query.push({
                    _id: {'$in': opts.id}
                })
            }

            if (!query.length) {
                cb(new Error('SSO#findUsers no params'), ERROR.FA_PARAMS);
                return;
            }

            this.user.find({'$or': query}, function (err, doc) {
                if (err) {
                    cb(err, ERROR.FA_FIND_USER);
                } else {
                    cb(err, doc);
                }
            });
        },

        /**
         * 根据id数组查找多个用户
         * @method SSO#findByIds
         * @param v id数组(必填)
         * @param cb
         */
        findByIds: function (v, cb) {
            this.findUsers({id: v}, cb);
        }
    };

    jmcommon.enableEvent(model);
    model.user = require('./user')(model, opts);
    if (!model.disableVerifyCode) {

        require('./verifyCode')(model, opts);
    }

    return model;
};

