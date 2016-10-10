var jmcommon = require('jm-common');
var consts = require('../consts/consts');
var ERROR = consts.ERR;
var SequenceUserId = consts.SequenceUserId;
var schema = require('../schema/user')();

/**
 * user服务
 * @class user
 * @param service
 * @param {Object} [opts={}] 参数
 * @example
 * opts参数:{
 *  modelName: 表名称(可选，默认user)
 *  schema: 表结构定义(可选, 如果不填采用默认表结构)
 *  schemaExt: 表结构扩展定义(可选, 对于schema扩展定义)
 * }
 * @returns {Object}
 */
module.exports = function (service, opts) {
    opts = opts || {};
    var mq = service.mq || opts.mq || jmcommon.mq(opts);
    var sq = jmcommon.sequence({db: opts.db});

    opts.modelName = opts.modelName || 'user';
    opts.schema = opts.schema || schema;
    var model = jmcommon.dao(opts);
    model.mq = mq;

    jmcommon.enableEvent(model);

    model.schema.pre('save', function (next) {
        var self = this;
        if (self.uid == undefined && !service.disableAutoUid) {
            model.createUid(function (err, val) {
                if (err) {
                    return next(err);
                }
                self.uid = val;
                next();
            });
        }else{
            next();
        }
    });

    /**
     * 生成uid
     * @method user#createUid
     * @param cb
     */
    model.createUid = function(cb) {
        sq.next(SequenceUserId, {}, function (err, val) {
            if (err) {
                return cb(err, ERROR.FA_CREATE_USER_UID);
            }
            cb(null, val);
        });
    };

    return model;
};

