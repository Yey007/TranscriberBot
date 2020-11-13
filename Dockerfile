FROM node:14-alpine

ENV NODE_ENV=production

ENV CONTAINER=true

LABEL maintainer="yey007tech@gmail.com"

ARG BUILD_DATE

LABEL org.label-schema.build-date=$BUILD_DATE

WORKDIR /app

RUN apk add --no-cache curl

RUN curl -OL https://raw.githubusercontent.com/mrako/wait-for/master/wait-for && chmod +x wait-for

COPY package*.json ./

RUN npm install

COPY tsconfig*.json ./

RUN npm install -g typescript

COPY ./src ./src

RUN tsc

COPY ./database.json ./

COPY ./resources ./resources

COPY ./migrations ./migrations

CMD [ "npm", "start" ]