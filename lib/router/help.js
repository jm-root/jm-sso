'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (service) {
  var router = ms.router();
  router.add('/', 'get', function (opts, cb, next) {
    opts.help || (opts.help = {});
    opts.help.status = 1;
    if (!service.ready) opts.help.status = 0;
    next();
  });
  _jmMsHelp2.default.enableHelp(router, require('../../package.json'));
  return router;
};

var _jmMsHelp = require('jm-ms-help');

var _jmMsHelp2 = _interopRequireDefault(_jmMsHelp);

var _jmMsCore = require('jm-ms-core');

var _jmMsCore2 = _interopRequireDefault(_jmMsCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ms = new _jmMsCore2.default();

;
module.exports = exports['default'];