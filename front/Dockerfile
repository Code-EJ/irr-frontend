# Etapa de build
FROM node:20 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install 

COPY . .
RUN yarn build

# Etapa de produção
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .  

# Expõe a porta usada pelo Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]