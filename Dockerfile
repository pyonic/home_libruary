FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm i --production --legacy-peer-deps && npm run build

CMD [ "node", "dist/main.js" ]