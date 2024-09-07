FROM node:20-alpine3.19

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]