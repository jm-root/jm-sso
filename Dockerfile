# npm install --registry=https://registry.npm.taobao.org
# docker build -t jm-sso:latest .
# docker run -p 20100:20100 --link redis:redis --link mongo:mongo --name jm-sso -d jm-sso
FROM dashersw/node-pm2:alpine
MAINTAINER Jeff YU, 2651339@qq.com
ADD . /app
ENV APP app.json
