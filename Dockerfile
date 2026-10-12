FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=http://localhost:9191/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.28-alpine@sha256:7377697a821c131a924a7105fafbe7414db4e9fcc77a6f08f776f33f141ec3f8
# Apply compatible Alpine 3.23 security updates; retain the Nginx 1.28 line.
# Maintainer: Enzo Ribas (https://github.com/oEnzoRibas).
USER root
RUN cp /etc/nginx/nginx.conf /tmp/irr-nginx.conf \
    && apk del nginx-module-geoip nginx-module-image-filter nginx-module-njs nginx-module-xslt \
    && apk upgrade --no-cache \
    && apk add --no-cache nginx=1.28.3-r7 \
    && cp /tmp/irr-nginx.conf /etc/nginx/nginx.conf \
    && rm /tmp/irr-nginx.conf
USER 101
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
