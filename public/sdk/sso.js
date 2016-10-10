var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../../sdk');
    Promise = require('bluebird');
}
var sdk = jm.sdk;
var logger = sdk.logger;
var utils = sdk.utils;
var sso = sdk.sso;

(function(){
    var users = {
        test: {
            account: 'test',
            passwd: '123',
            expire: 3600
        }
    };

    logger.info('测试程序, 请准备以下用户: \r\n %s', utils.formatJSON(users));

    var log = function(err, doc){
        if (err) {
            logger.error(err.stack);
        }
        if(doc){
            logger.debug('%s', utils.formatJSON(doc));
        }
    };

    var done = function(resolve, reject, err, doc){
        log(err, doc);
        if (err) {
            reject(err, doc);
        } else {
            resolve(doc);
        }
    };

    //注册
    var signup = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s 注册', user);
            sso.signup(users[user], function(err, doc){
                log(err, doc);
                resolve(doc);
            });
        });
    };


    //登录
    var signon = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s 登录', user);
            sso.signon(users[user], function(err, doc){
                if (!err) {
                    users[user] = doc;
                }
                done(resolve, reject, err, doc);
            });
        });
    };

    //退出登录
    var signout = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('退出登录');
            sso.signout({token: users[user].token}, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };

    //游客登录
    var signon_guest = function(){
        return new Promise(function(resolve, reject){
            logger.debug('游客登录');
            sso.signon_guest({}, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };

    var getVerifyCode = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s 获取验证码', user);
            sso.getVerifyCode({key: user}, function(err, doc){
                if (!err) {
                    users[user].code = doc.code;
                }
                done(resolve, reject, err, doc);
            });
        });
    };

    var checkVerifyCode = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s 验证验证码', user);
            sso.checkVerifyCode({key:user, code:users[user].code}, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };

    signup('test')
        .then(function(doc){
            return signon('test');
        })
        .then(function(doc){
            return getVerifyCode('test');
        })
        .then(function(doc){
            return checkVerifyCode('test');
        })
        .then(function(doc){
            return signout('test');
        })
        .then(function(doc){
            return signon_guest();
        })
        .catch(SyntaxError, function(e) {
            logger.error(e.stack);
        })
        .catch(function(e) {
            logger.error(e.stack);
        });

})();