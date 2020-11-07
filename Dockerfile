FROM mhart/alpine-node:14

ENV NODE_ENV=production

ENV CONTAINER=true

LABEL maintainer="yey007tech@gmail.com"

ARG BUILD_DATE

LABEL org.label-schema.build-date=$BUILD_DATE

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY ./src ./src

COPY ./resources ./resources

RUN npm install -g typescript

RUN npm install

RUN tsc

CMD [ "npm", "start" ]