FROM node:alpine AS build

WORKDIR /app

COPY  package.json .

COPY package-lock.json .

RUN npm install --silent

COPY . .

RUN npm run build

FROM nginx:apline

COPY --from=build /app/build/ /var/www/

COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
