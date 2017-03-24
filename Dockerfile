# PAVICS-Platform
#
# VERSION 0.0.6
FROM nodesource/node:6.7
MAINTAINER Renaud Hébert-Legault <renaud.hebert-legault@crim.ca>
LABEL Description="PAVICS Platform - Based on Node.js, React, Redux, Webpack, OpenLayers, Koa and MaterialUI" Vendor="CRIM" Version="0.0.6"

ENV NODE_ENV=production
ENV BIRDHOUSE_HOST=outarde.crim.ca
ADD package.json package.json
RUN npm install
ADD . .

CMD ["npm","start"]
EXPOSE 3000
