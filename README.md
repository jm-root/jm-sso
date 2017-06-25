# jm-sso

single sign on

## run:

npm start

## run in cluster mode:

npm run cluster

## config

基本配置 请参考 [jm-server] (https://github.com/jm-root/jm-server)

redis [] Redis数据库uri

secret [''] 密钥

tokenKey ['sso:token'] Redis数据库主键

tokenExpire [0] Token 过期时间, 单位秒(可选, 默认0永远不过期)
