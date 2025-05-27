# Etapa 1: Build de la app
FROM node:18 AS builder
WORKDIR /app

# Copiar todo el monorepo (ajustado según tus rutas relativas)
COPY ../../ ./

# Entrar a la carpeta del frontend
WORKDIR /app/apps/frontend

# Instalar dependencias
RUN npm install

# Build de la app
RUN npm run build

# Etapa 2: Servidor estático con Nginx
FROM nginx:alpine

# Copiamos el build generado al folder estático de Nginx
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY ../../docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]