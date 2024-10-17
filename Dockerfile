FROM node:18.0-alpine3.14 AS base

RUN npm install -g pnpm@8.12.1

FROM base AS build-stage

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/ && pnpm install --frozen-lockfile && pnpm run build

# production stage
FROM nginx:stable AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
