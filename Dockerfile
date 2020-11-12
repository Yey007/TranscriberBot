FROM mhart/alpine-node:14

ENV NODE_ENV=production

LABEL maintainer="yey007tech@gmail.com"

ARG BUILD_DATE

LABEL org.label-schema.build-date=$BUILD_DATE

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig*.json ./

RUN npm install -g typescript

COPY ./src ./src

RUN tsc

COPY ./database.json ./

COPY ./resources ./resources

COPY ./migrations ./migrations

COPY ./misc/wait-for.sh ./


CMD [ "npm", "start" ]