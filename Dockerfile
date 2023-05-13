FROM node:16

EXPOSE 3001

WORKDIR /usr/src/app

COPY . .

WORKDIR ./frontend

RUN npm install

WORKDIR ../backend

RUN npm run build:ui

CMD npm run dev