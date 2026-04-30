FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

ENV VITE_API_URL=__VITE_API_URL_PLACEHOLDER__
RUN npm run build

FROM nginx:alpine

RUN echo $'server {\n\
    listen 80;\n\
    location / {\n\
        root   /usr/share/nginx/html;\n\
        index  index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo $'#!/bin/sh\n\
for file in /usr/share/nginx/html/assets/*.js; do\n\
  if [ -f "$file" ]; then\n\
    sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" "$file"\n\
  fi\n\
done\n\
' > /docker-entrypoint.d/40-replace-env-vars.sh && chmod +x /docker-entrypoint.d/40-replace-env-vars.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]