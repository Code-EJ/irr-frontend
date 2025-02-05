FROM node:latest

WORKDIR /app

COPY . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "build"]

EXPOSE 80