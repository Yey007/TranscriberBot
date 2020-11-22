FROM node:14-alpine

ENV CONTAINER=true

LABEL maintainer="yey007tech@gmail.com"

ARG BUILD_DATE

LABEL org.label-schema.build-date=$BUILD_DATE

WORKDIR /tests

COPY ./package*.json ./

RUN npm install

COPY ./tsconfig.json ./

RUN npm install -g typescript

RUN npm install -g mocha

RUN npm install -g ts-node

COPY ./test ./test

CMD [ "mocha" ]