FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3009

RUN npm run build

CMD [ "npm", "start" ]