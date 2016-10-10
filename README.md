jm-sso
======

Single Sign On

use:

var express = require('express');
var jmcommon = require('jm-common');
var DB = jmcommon.DB;
var sso = require('jm-sso');

DB.connect(null, false, function(err, db){
    var s = sso();

    //use with express
    var app = express();
    app.use('/sso', s.router());

}
