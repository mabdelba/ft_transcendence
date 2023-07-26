FROM node:20.4-alpine

WORKDIR /app

# COPY ./srcs/package*.json ./
COPY ./srcs .

RUN npm install


EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]