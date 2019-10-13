FROM node:9.11.2-stretch

ARG env

ADD ./sources/app /app
WORKDIR /app
RUN npm i -g pm2
RUN npm install
CMD ["npm", "run", $env]