var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-sdk-core');
    Promise = require('bluebird');
}
var sdk = jm.sdk;
var logger = sdk.logger;
var utils = sdk.utils;
var sso = require('../lib')({
    tokenExpire: 1
});

(function(){
    var self = this;

    var users = {
        test: {
            account: 'test',
            passwd: '123',
            newPasswd: '1234',
            nick: 'test',
            ext: {
                abc: 123
            }
        }
    };

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

    logger.info('test users: \r\n %s', utils.formatJSON(users));

    var findUser = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s findUser', user);
            sso.findUser(users[user], function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };
    var findUsers = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s findUsers', user);
            sso.findUsers({account: [user]}, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };
    var signup = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s signup', user);
            var p = users[user].passwd;
            sso.signup(users[user], function(err, doc){
                if (!err) {
                    users[user].passwd = p;
                }
                done(resolve, reject, err, doc);
            });
        });
    };
    var signon = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s signon', user);
            sso.signon(users[user], function(err, doc){
                if (!err) {
                    logger.debug('token=%s', doc.token);
                    users[user].id = doc.id;
                    users[user].token = doc.token;
                }
                done(resolve, reject, err, doc);
            });
        });
    };
    var signon_guest = function(){
        return new Promise(function(resolve, reject){
            logger.debug('signon_guest');
            sso.signon_guest(function(err, doc){
                if (!err) {
                    logger.debug('token=%s', doc.token);
                }
                done(resolve, reject, err, doc);
            });
        });
    };
    var isSignon = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s isSignon', user);
            sso.isSignon(users[user].token, function(err, doc){
                if (!err) {
                    if(doc){
                        logger.debug('isSignon 用户: %s', utils.formatJSON(doc));
                    }else{
                        logger.debug('not isSignon');
                    }
                }
                done(resolve, reject, err, doc);
            });
        });
    };
    var updatePasswd = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s updatePasswd', user);
            var p = users[user].passwd;
            sso.updatePasswd(users[user], function(err, doc){
                if (!err) {
                    users[user].passwd = users[user].newPasswd;
                    users[user].newPasswd = p;
                    delete users[user].salt;
                }
                done(resolve, reject, err, doc);
            });
        });
    };
    var updateUser = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s updateUser', user);
            sso.updateUser(users[user].id, users[user], function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };
    var updateUserExt = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s updateUserExt', user);
            sso.updateUserExt(users[user].id, users[user].ext, true, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };
    var signout = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s signout', user);
            sso.signout(users[user].token, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };
    var saveVerifyCode = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s saveVerifyCode', user);
            var code = sso.createVerifyCode();
            sso.saveVerifyCode(users[user].id, code, 10, function(err, doc){
                if (!err) {
                    users[user].code = doc.code;
                }
                done(resolve, reject, err, doc);
            });
        });
    };
    var checkVerifyCode = function(user){
        return new Promise(function(resolve, reject){
            logger.debug('%s checkVerifyCode', user);
            sso.checkVerifyCode(users[user].id, users[user].code, function(err, doc){
                done(resolve, reject, err, doc);
            });
        });
    };

    findUser('test')
        .then(function(doc){
            if(doc){
                return signon('test');
            }else{
                return signup('test').then(
                    function(doc){
                        return signon('test');
                    }
                );
            }
        })
        .then(function(doc){
            return isSignon('test');
        })
        .then(function(doc){
            return updatePasswd('test');
        })
        .then(function(doc){
            return updatePasswd('test');
        })
        .then(function(doc){
            return updateUser('test');
        })
        .then(function(doc){
            return updateUserExt('test');
        })
        .then(function(doc){
            return signout('test');
        })
        .then(function(doc){
            return isSignon('test');
        })
        .then(function(doc){
            return findUsers('test');
        })
        .then(function(doc){
            return saveVerifyCode('test');
        })
        .then(function(doc){
            return checkVerifyCode('test');
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