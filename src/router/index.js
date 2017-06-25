let MS = require('jm-ms-core');
let ms = new MS();
import event from 'jm-event';

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

module.exports = function (opts = {}) {
    let service = this;
    let router = ms.router();

    service.routes || (service.routes = {});
    let routes = service.routes;
    event.enableEvent(routes);

    routes.signon = function (opts = {}, cb, next) {
        service.signon(opts.data, function (err, doc) {
            if (!err) {
                routes.emit('signon', opts, doc);
            }
            cb(err, doc);
        });
    };

    routes.signout = function (opts = {}, cb, next) {
        service.signout(opts.data.token, function (err, doc) {
            if (!err) {
                routes.emit('signout', opts, doc);
                doc = {ret: doc};
            }
            cb(err, doc);
        });
    };

    routes.isSignon = function (opts = {}, cb, next) {
        service.isSignon(opts.data.token, function (err, doc) {
            if (!err) {
                routes.emit('isSignon', opts, doc);
            }
            cb(err, doc);
        });
    };

    routes.touch = function (opts = {}, cb, next) {
        service.touch(opts.data.token, function (err, doc) {
            if (!err) {
                routes.emit('touch', opts, doc);
            }
            cb(err, doc);
        });
    };

    let _signon = function (opts, cb, next) {
        routes.signon(opts, cb, next);
    };
    let _signout = function (opts, cb, next) {
        routes.signout(opts, cb, next);
    };
    let _isSignon = function (opts, cb, next) {
        routes.isSignon(opts, cb, next);
    };
    let _touch = function (opts, cb, next) {
        routes.touch(opts, cb, next);
    };

    router
        .add('/signon', 'post', _signon)
        .add('/signout', 'get', _signout)
        .add('/isSignon', 'get', _isSignon)
        .add('/touch', 'get', _touch)
    ;

    return router;
};

