FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/frontend

RUN npm install

WORKDIR /usr/src/app/backend

RUN npm run build:ui

FROM node:16-alpine as runner

COPY --from=builder /usr/src/app/backend /usr/src/app/backend

WORKDIR /usr/src/app/backend

EXPOSE 3001
CMD npm run dev