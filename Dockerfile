FROM node:20

WORKDIR /var/www/ghost-finance

COPY package*.json /var/www/ghost-finance/

RUN npm install

COPY . /var/www/ghost-finance

EXPOSE 3000:3000
