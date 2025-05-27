# Usar Node.js 18 Alpine para menor tamaño
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="Singletone Team"
LABEL version="1.0.0"
LABEL description="Singletone Backend Service"

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S singletone -u 1001

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (para mejor cache de Docker)
COPY --chown=singletone:nodejs package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev && npm cache clean --force

# Copiar todo el código de la aplicación (ya que el context apunta a apps/backend-service)
COPY --chown=singletone:nodejs . ./

# Crear directorio para logs
RUN mkdir -p /app/logs && chown -R singletone:nodejs /app/logs

# Cambiar al usuario no-root
USER singletone

# Exponer el puerto
EXPOSE 8000

# Configurar variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]