FROM node:14-alpine

ENV CONTAINER=true

WORKDIR /app

RUN apk add --no-cache curl

RUN curl -OL https://raw.githubusercontent.com/mrako/wait-for/master/wait-for && chmod +x wait-for

COPY ./package*.json ./

RUN npm ci --production=true

COPY ./tsconfig.prod.json ./tsconfig.json

RUN npm install -g ts-node typescript

COPY ./src ./src

#TEMPORARY (docker-compose has an issue with .dockerignore files)
RUN rm -rf ./src/test

COPY ./ormconfig.js ./

COPY ./resources ./resources

CMD [ "npm", "start" ]