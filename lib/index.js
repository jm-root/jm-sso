var service = require('./service');
var router =  require('./router');

module.exports = function(opts){
    opts = opts || {};
    var o = service(opts);
    o.router = function(opts){
        return router(o, opts);
    };
    return o;
};

