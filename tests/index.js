var jmcommon = require('jm-common');
var DB = jmcommon.DB;
DB.connect(null, false, function(err, db){
    require('./sso.js');
});
