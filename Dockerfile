FROM mhart/alpine-node:14

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY ./.env ./

COPY ./src ./src

COPY ./resources ./resources

RUN npm install -g typescript

RUN npm install

RUN tsc

CMD [ "npm", "start" ]