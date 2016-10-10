var express = require('express');
var routes = require('./routes');
var path = require('path');

var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var config = require('./config');
var app = express();

// all environments
app.set('port', config.port || 20100);
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'doc/webapi')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, Authorization, Accept');
    res.header('Access-Control-Allow-Methods','PUT, POST, GET, DELETE, OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    if(req.method=='OPTIONS')
        res.sendStatus(200);
    else
        next();
});

routes(app, config);

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err.stack);
});
