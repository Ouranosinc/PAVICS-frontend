# PAVICS-Platform
#
# VERSION 0.2.12
FROM node:8.2.1
MAINTAINER Renaud Hébert-Legault <renaud.hebert-legault@crim.ca>
LABEL Description="PAVICS Platform - Based on Node.js, React, Redux, Webpack, OpenLayers, Koa and MaterialUI" Vendor="CRIM" Version="0.2.10"
WORKDIR /frontend

ENV NODE_ENV=development
ENV BIRDHOUSE_HOST=outarde.crim.ca
ADD package.json package.json
RUN npm install
ADD . .

CMD ["npm","start"]
EXPOSE 3000
