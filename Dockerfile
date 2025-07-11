# Etapa 1: Builder - solo dependencias necesarias
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias necesarias para producción
RUN npm install --only=production

# Copiar el resto del código
COPY . .

# Etapa 2: Imagen final optimizada
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario desde la etapa anterior
COPY --from=builder /app /app

# Exponer el puerto del microservicio
EXPOSE 3004

# Comando de inicio
CMD ["node", "src/app.js"]
