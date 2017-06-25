'use strict';

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MS = require('jm-ms-core');
var ms = new MS();


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

module.exports = function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var service = this;
    var router = ms.router();

    service.routes || (service.routes = {});
    var routes = service.routes;
    _jmEvent2.default.enableEvent(routes);

    routes.signon = function () {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cb = arguments[1];
        var next = arguments[2];

        service.signon(opts.data, function (err, doc) {
            if (!err) {
                routes.emit('signon', opts, doc);
            }
            cb(err, doc);
        });
    };

    routes.signout = function () {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cb = arguments[1];
        var next = arguments[2];

        service.signout(opts.data.token, function (err, doc) {
            if (!err) {
                routes.emit('signout', opts, doc);
                doc = { ret: doc };
            }
            cb(err, doc);
        });
    };

    routes.isSignon = function () {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cb = arguments[1];
        var next = arguments[2];

        service.isSignon(opts.data.token, function (err, doc) {
            if (!err) {
                routes.emit('isSignon', opts, doc);
            }
            cb(err, doc);
        });
    };

    routes.touch = function () {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cb = arguments[1];
        var next = arguments[2];

        service.touch(opts.data.token, function (err, doc) {
            if (!err) {
                routes.emit('touch', opts, doc);
            }
            cb(err, doc);
        });
    };

    var _signon = function _signon(opts, cb, next) {
        routes.signon(opts, cb, next);
    };
    var _signout = function _signout(opts, cb, next) {
        routes.signout(opts, cb, next);
    };
    var _isSignon = function _isSignon(opts, cb, next) {
        routes.isSignon(opts, cb, next);
    };
    var _touch = function _touch(opts, cb, next) {
        routes.touch(opts, cb, next);
    };

    router.add('/signon', 'post', _signon).add('/signout', 'get', _signout).add('/isSignon', 'get', _isSignon).add('/touch', 'get', _touch);

    return router;
};