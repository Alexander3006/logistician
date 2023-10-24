FROM node:18-alpine

WORKDIR /var/www/back

COPY package*.json ./
RUN npm i --force

COPY . .
RUN npm run build

EXPOSE 3000
EXPOSE 3010

CMD [ "node", "dist/main.js" ]