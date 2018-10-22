# based on -https://blog.codeship.com/using-docker-compose-for-nodejs-development/
FROM node:8.12-alpine

WORKDIR /usr/app

COPY package.json .
RUN npm install -quiet

CMD COPY . .