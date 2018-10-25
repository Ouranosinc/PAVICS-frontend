# PAVICS-Platform
#
# VERSION 1.1.8
FROM node:8.2.1
MAINTAINER Renaud Hébert-Legault <renaud.hebert-legault@crim.ca>
LABEL Description="PAVICS Platform - Based on Node.js, React, Redux, Webpack, OpenLayers, Koa and MaterialUI" Vendor="CRIM" Version="1.1.8"
WORKDIR /frontend

ENV NODE_ENV=development
ENV BIRDHOUSE_HOST=outarde.crim.ca
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm install
ADD . .

CMD /bin/bash ./bin/startup.sh
EXPOSE 3000
