FROM node:20

# Creo directorio de trabajo en el docker
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#instalo en nest (es una instalacion global que va en la maquina y no en el proyecto)
RUN npm install

# copio todo lo del directorio en el que estoy al directorio actual del docker
COPY . .

# Copia el script wait-for-it.sh
COPY wait-for-it.sh /usr/bin/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh


EXPOSE 3000

#comando para iniciar aplicación
CMD ["npm", "run", "start:dev"]