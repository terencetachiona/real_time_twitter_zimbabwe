FROM node:12-alpine
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]