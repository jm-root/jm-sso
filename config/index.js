var config = {
    development: {
        port: 20100,
        prefix: '/sso'
    },
    production: {
        port: 20100,
        prefix: '/sso',
        tokenExpire: 3600,
        disableVerifyCode: false,
        disableAutoUid: false,
        mq: 'redis://redis:6379',
        db: 'mongodb://mongo/sso'
    }
};

var env = process.env.NODE_ENV||'development';
config = config[env]||config['development'];
config.env = env;

['port', 'prefix', 'db', 'mq'].forEach(function(key) {
    process.env[key] && (config[key]=process.env[key]);
});

module.exports = config;

