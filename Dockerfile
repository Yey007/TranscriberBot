FROM node:14-alpine

ENV CONTAINER=true

WORKDIR /app

RUN apk add --no-cache curl

RUN curl -OL https://raw.githubusercontent.com/mrako/wait-for/master/wait-for && chmod +x wait-for

COPY ./package*.json ./

RUN npm install --production=true

COPY ./tsconfig.json ./

RUN npm install -g typescript

COPY ./src ./src

#TEMPORARY (docker-compose has an issue with .dockerignore files)
RUN rm -rf ./src/test

RUN tsc

COPY ./database.json ./

COPY ./resources ./resources

COPY ./migrations ./migrations

CMD [ "npm", "start" ]