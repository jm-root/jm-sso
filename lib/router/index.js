var cluster = require('cluster');
var _ = require('lodash');
var validator = require('validator');
var jmcommon = require('jm-common');
var consts = require('../consts/consts');
var ERROR = consts.ERR;
var express = require('express');

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */
module.exports = function(service, opts) {
    var router = express.Router(opts);

    opts = opts || {};

    service.routes = service.routes || {};
    var routes = service.routes;
    jmcommon.enableEvent(routes);

    var isMobile = function(mobile){
        var pattern = /^1[3,4,5,8]{1}[0-9]{9}$/;
        return pattern.test(mobile);
    };

    var package = require('../../package.json');
    routes.help = function(req, res, next){
        var o = {
            name: package.name,
            version: package.version
        };
        if (cluster.isWorker) {
            o.clusterId = cluster.worker.id;
        }
        res.send(o);
    };

    routes.all = function(req, res, next){
        var token = req.query.token || req.body.token;
        if(!token) return next();

        service.isSignon(token, function(err, id){
            if(err || !id) {
                return next();
            }

            req.id = id;
            req.token = token;
            next();
        });
    };

    routes.needSignon = function(req, res, next){
        if(!req.token){
            res.send(jmcommon.ERR.FA_NOAUTH);
            return;
        }
        next();
    };

    routes.validator = function(req, res, next){
        var id = req.body.id;
        var account = req.body.account;
        var uid = req.body.uid;
        var email = req.body.email;
        var mobile = req.body.mobile;
        var passwd = req.body.passwd;
        var expire = req.body.expire;
        var msg = [];
        if(uid && !validator.isInt(uid)){
            msg.push('请输入正确的ID号');
        }
        if(email && !validator.isEmail(email)){
            msg.push('请输入正确邮箱');
        }
        if(mobile && !isMobile(mobile)){
            msg.push('请输入正确的手机号码');
        }
        if(_.isNull(passwd)){
            msg.push('密码不能为空');
        }
        if(msg.length){
            res.send({err:ERROR.FA_PARAMS.err, msg: msg});
            return;
        }

        var data = {
        };

        if(id){
            data.id = id;
        }

        if(account){
            data.account = account;
        }

        if(uid){
            data.uid = uid;
        }

        if(email){
            data.email = email;
        }

        if(mobile){
            data.mobile = mobile;
        }

        if(passwd){
            data.passwd = passwd;
        }

        if(expire){
            data.expire = expire;
        }

        req.data = data;
        next();
    };

    routes.loadUser = function(req, res, next){
        service.user.findById(req.id, function (err, doc){
            if(err){
                return res.send(ERROR.FA_FIND_USER);
            }

            if(doc){
                req.user = doc;
                next();
            }else{
                res.send(ERROR.FA_NOT_EXIST);
            }
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /signon 登录
     * @apiName signon
     *
     * @apiParam {String} passwd 密码
     * @apiParam {String} [id] id
     * @apiParam {String} [uid] uid
     * @apiParam {String} [account] 账户
     * @apiParam {String} [mobile] 手机号
     * @apiParam {String} [email] 邮箱
     * @apiParam {Number} [expire] token过期时间(可选, 如果不填，采用系统默认值)
     *
     * @apiSuccess {String} token token
     * @apiSuccess {String} id id
     * @apiSuccess {Number} expire token过期时间(单位秒, 0表示不过期)
     * @apiExample {json} 成功:
     *     {
     *       token: token,
     *       id: id
     *     }
     */
    routes.signon = function(req, res) {
        var data = req.data;
        if(data.account){
            data.any = data.account;
            delete data.account;
        }
        service.signon(data, function (err, doc) {
            routes.emit('signon', req, res, err, doc);
            if (err) {
                res.send(doc);
            } else {
                res.send({token: doc.token, id: doc.id, expire: doc.expire});
            }
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /signon_guest 游客登录
     * @apiName signon_guest
     *
     * @apiParam {String} [passwd] 密码
     * @apiParam {String} [nick] 昵称
     * @apiParam {String} [creator] 创建者id
     *
     * @apiSuccess {String} token token
     * @apiSuccess {String} id id
     * @apiSuccess {String} [nick] 昵称
     * @apiSuccess {String} [creator] 创建者id
     * @apiExample {json} 成功:
     *     {
     *       nick: 昵称,
     *       creator: 创建者id,
     *       token: token,
     *       id: id
     *     }
     */
    routes.signon_guest = function(req, res) {
        var data = req.data || req.body || {};
        if(!service.disableVerifyCode){
            data.passwd = data.passwd || service.createVerifyCode();
        }
        service.signon_guest(_.clone(data), function (err, doc) {
            routes.emit('signon', req, res, err, doc);
            if (err) {
                res.send(doc);
            } else {
                data.token = doc.token;
                data.id = doc.id;
                data.expire = doc.expire;
                res.send(data);
            }
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /signup 注册
     * @apiName signup
     *
     * @apiParam {String} [passwd] 密码
     * @apiParam {String} [account] 账户
     * @apiParam {String} [mobile] 手机号
     * @apiParam {String} [email] 邮箱
     * @apiParam {String} [nick] 昵称
     * @apiParam {String} [creator] 创建者id
     *
     * @apiSuccess {String} id id
     * @apiExample {json} 成功:
     *     {
     *       id: id
     *     }
     */
    routes.signup = function (req, res) {
        var nick = req.body.nick;
        var data = req.data;

        if(data.email && !nick){
            var result=data.email.split("@");
            nick = result[0];
        }

        if(nick){
            data.nick = nick;
        }

        if(routes.onSignup){
            data = routes.onSignup(req, res, data);
        }

        routes.emit('before_signup', req, res, data);

        //注册
        service.signup(data, function(err, doc){
            routes.emit('signup', req, res, err, doc);
            if(err) {
                res.send(doc);
            }else{
                res.send({id: doc.id});
            }
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /isSignon 是否登录
     * @apiName isSignon
     *
     * @apiParam {String} [token] token
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
    routes.isSignon = function (req, res) {
        var isSignon = false;
        if(req.token){
            isSignon = true;
        }
        res.send({ret: isSignon});
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /signout 注销
     * @apiName signout
     *
     * @apiParam {String} [token] token
     *
     * @apiExample {json} 成功:
     *     {
     *     }
     */
    routes.signout = function (req, res) {
        if (req.token) {
            service.signout(req.token, function (err, id) {
                routes.emit('signout', req, res, err, req.id);
                res.send({});
            });
        } else {
            res.send({});
        }
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /user 获取个人用户信息
     * @apiName getUser
     *
     * @apiParam {String} [token] token
     *
     * @apiSuccess {String} id id
     * @apiSuccess {String} [uid] uid
     * @apiSuccess {String} [nick] 昵称
     * @apiSuccess {String} [creator] 创建者id
     * @apiExample {json} 成功:
     *     {
     *       nick: 昵称,
     *       creator: 创建者id,
     *       id: id
     *     }
     */
    routes.getUser = function(req, res){
        if(req.user) {
            var doc = req.user;
            var o = {
                id: doc.id,
                nick: doc.nick
            }
            routes.emit('getUser', req, res, doc, o);
            if(routes.onGetUser){
                o = routes.onGetUser(req, res, doc);
            }
            res.send(o);
        }
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /user 更新个人用户信息
     * @apiName updateUser
     *
     * @apiParam {String} [token] token
     * @apiParam {String} [nick] 昵称
     *
     * @apiExample {json} 成功:
     *     {
     *     }
     */
    routes.updateUser = function(req, res){
        service.updateUser(req.id, req.body, function (err, doc){
            routes.emit('updateUser', req, res, err, doc);
            if(err){
                res.send(doc);
                return;
            }
            res.send({});
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /user/ext 更新个人扩展用户信息
     * @apiName updateUserExt
     *
     * @apiParam {String} [token] token
     * @apiParam {String} [key] 键
     *
     * @apiExample {json} 成功:
     *     {
     *     }
     */
    routes.updateUserExt = function(req, res){
        service.updateUserExt(req.id, req.body, false, function (err, doc){
            routes.emit('updateUserExt', req, res, err, doc);
            if(err){
                res.send(doc);
                return;
            }
            res.send({});
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /user/ext 更新个人密码
     * @apiName updatePasswd
     *
     * @apiParam {String} [token] token
     * @apiParam {String} [newPasswd] 新密码
     *
     * @apiExample {json} 成功:
     *     {
     *     }
     */
    routes.updatePasswd = function(req, res){
        var data = req.data;
        data.newPasswd = req.body.newPasswd;
        data.id = req.id;
        service.updatePasswd(data, function (err, doc){
            routes.emit('updatePasswd', req, res, err, doc);
            if(err){
                res.send(doc);
                return;
            }
            res.send({});
        });
    };

    var _help = function(req, res, next){routes.help(req, res, next);};
    var _all = function(req, res, next){routes.all(req, res, next);};
    var _needSignon = function(req, res, next){routes.needSignon(req, res, next);};
    var _validator = function(req, res, next){routes.validator(req, res, next);};
    var _loadUser = function(req, res, next){routes.loadUser(req, res, next);};
    var _signon = function(req, res, next){routes.signon(req, res, next);};
    var _signon_guest = function(req, res, next){routes.signon_guest(req, res, next);};
    var _signup = function(req, res, next){routes.signup(req, res, next);};
    var _isSignon = function(req, res, next){routes.isSignon(req, res, next);};
    var _signout = function(req, res, next){routes.signout(req, res, next);};
    var _getUser = function(req, res, next){routes.getUser(req, res, next);};
    var _updateUser = function(req, res, next){routes.updateUser(req, res, next);};
    var _updateUserExt = function(req, res, next){routes.updateUserExt(req, res, next);};
    var _updatePasswd = function(req, res, next){routes.updatePasswd(req, res, next);};

    router
        .get('/', _help)
        .use(_all)
        .post('/signup', _validator, _signup)
        .post('/signon', _validator, _signon)
        .post('/signon_guest', _signon_guest)
        .all ('/signout', _signout)
        .all ('/isSignon', _isSignon)
        .post('/user/passwd', _needSignon, _validator, _updatePasswd)
        .get ('/user', _needSignon, _loadUser, _getUser)
        .post('/user', _needSignon, _updateUser)
        .post('/user/ext', _needSignon, _updateUserExt)
    ;
    //router.use('/' + service.user.modelName + 's', jmcommon.router(service.user, opts));


    if (!service.disableVerifyCode) {
        router.use('/verifyCode', require('./verifyCode')(service, opts));
    }

    return router;
};

