# PAVICS-Platform
#
# VERSION 0.0.4
FROM nodesource/node:6.7
MAINTAINER Renaud Hébert-Legault <renaud.hebert-legault@crim.ca>
LABEL Description="PAVICS Platform - Based on Node.js, Koa, React, Redux, Webpack, OpenLayers and Bootstrap" Vendor="CRIM" Version="0.0.4"

ENV NODE_ENV=development
ADD package.json package.json
RUN npm install
ADD . .

CMD ["npm","start"]
EXPOSE 3000
