FROM node:20.4-alpine

WORKDIR /app

COPY ./srcs .

RUN npm install


EXPOSE 4000

CMD [ "npm", "run", "dev" ]