FROM node:lts-alpine

WORKDIR /app

COPY ./srcs .

RUN npm install


EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]