FROM node:20.10.0-alpine3.18

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8083

CMD [ "node", "index.js" ]