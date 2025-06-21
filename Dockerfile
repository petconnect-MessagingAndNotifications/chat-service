# Usamos una imagen oficial de Node.js
FROM node:18

# Creamos el directorio de la app
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usará el servicio (3004 para chat-service)
EXPOSE 3004

# Comando por defecto
CMD ["npm", "start"]
