# PAVICS-Platform
#
# VERSION               0.0.2
FROM nodesource/node:5.10
MAINTAINER Renaud Hébert-Legault <renaud.hebert-legault@crim.ca>
LABEL Description="PAVICS Platform - Based on Node.js, Koa, React, Redux, Webpack, OpenLayers and Bootstrap" Vendor="CRIM" Version="0.0.1"

ENV NODE_ENV=development
ADD package.json package.json
RUN npm install
ADD . .

CMD ["npm","start"]
EXPOSE 3000
