var express = require('express');
var consts = require('../consts/consts');
var ERR = consts.ERR;

module.exports = function(service, opts) {
    var router = express.Router(opts);
    opts = opts || {};
    var routes = service.routes;

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /verifyCode 获取验证码
     * @apiName getVerifyCode
     *
     * @apiParam {String} key 保存验证码的key
     * @apiParam {Number} [length] 长度
     * @apiParam {Number} [expire] 过期时间,单位秒
     *
     * @apiSuccess {String} code 验证码
     * @apiSuccess {Number} time 生成时间
     * @apiSuccess {Number} expire 过期时间
     * @apiExample {json} 成功:
     *     {
     *       code: 验证码,
     *       time: 生成时间,
     *       expire: 过期时间
     *     }
     */
    routes.getVerifyCode = function(req, res) {
        var key = req.query.key || req.body.key;
        if(!key){
            return res.send(ERR.FA_PARAMS);
        }

        var length = req.query.length || req.body.length;
        var expire = req.query.expire || req.body.expire || 0;
        var code = service.createVerifyCode({length: length});
        service.saveVerifyCode(key, code, expire, function(err, doc){
            routes.emit('getVerifyCode', req, res, err, doc);
            if(err){
                return res.send(doc);
            }
            res.send(doc);
        });
    };

    /**
     * @apiGroup sso
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /verifyCode/check 验证验证码
     * @apiName checkVerifyCode
     *
     * @apiParam {String} key 保存验证码的key
     * @apiParam {String} code 验证码
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
    routes.checkVerifyCode = function(req, res, next) {
        var key = req.query.key || req.body.key;
        if(!key){
            return res.send(ERR.FA_PARAMS);
        }
        var code = req.query.code || req.body.code;
        if(!key){
            return res.send(ERR.FA_PARAMS);
        }

        service.checkVerifyCode(key, code, function(err, doc){
            routes.emit('checkVerifyCode', req, res, err, doc);
            if(err){
                return res.send(doc);
            }
            res.send({ret: doc});
        });
    };

    var _getVerifyCode = function(req, res, next){routes.getVerifyCode(req, res, next);};
    var _checkVerifyCode = function(req, res, next){routes.checkVerifyCode(req, res, next);};

    router.get('/', _getVerifyCode);
    router.get('/check', _checkVerifyCode);
    router.post('/check', _checkVerifyCode);

    return router;
};
