FROM node:20-alpine3.19

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install

EXPOSE 4000

CMD [ "npm", "run", "dev" ]