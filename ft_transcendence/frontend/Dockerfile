FROM node:20.4-alpine

WORKDIR /app

COPY ./srcs .

RUN npm install

RUN npm install --save react-toastify

RUN npm install @headlessui/react

EXPOSE 4000

CMD [ "npm", "run", "dev" ]