# jm-sso

single sign on

[api doc] (https://app.swaggerhub.com/apis/jm-root/jm-sso/2.0.0)

## run:

npm start

## run in cluster mode:

npm run cluster

## config

基本配置 请参考 [jm-server] (https://github.com/jm-root/jm-server)

redis [] Redis数据库uri

secret [''] 密钥

tokenKey ['sso:token'] Redis数据库主键

tokenExpire [7200] Token 过期时间, 单位秒(可选, 默认7200秒)
