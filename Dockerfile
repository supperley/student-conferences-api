# Используем образ дистрибутив линукс Alpine с Node.js
FROM node:20-alpine

# Upgrade system libraries
RUN apk update ; apk upgrade

# Install system dependencies
RUN apk --no-cache add libreoffice

# Fonts
RUN apk add font-terminus font-inconsolata font-dejavu font-noto font-noto-cjk font-awesome font-noto-extra

# Cyrillic fonts
RUN apk add font-vollkorn font-misc-cyrillic font-mutt-misc font-screen-cyrillic font-winitzki-cyrillic font-cronyx-cyrillic

# MS Fonts
RUN apk add msttcorefonts-installer ; update-ms-fonts ; fc-cache -f

# Указываем нашу рабочую дерикторию
WORKDIR /app

# Копируем package.json и package-lock.json внутрь контейнера
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем оставшееся приложение в контейнер
COPY . .

# Открываем порт 3000 в нашем контейнере
EXPOSE 3000

# Запускаем сервер
CMD [ "npm", "start" ]