FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN yarn install

COPY . .
RUN yarn run dev

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 4000
