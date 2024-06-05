## Если вы хотите запустить Docker-образ

1. Предварительно установить Docker

```
https://docs.docker.com/get-docker/
```

2. Подготовить файловую структуру

```
project/
├── student-conferences
└── student-conferences-api
```

3. Открыть терминал (или командную строку) и перейти в корневую директорию сервера

```
cd student-conferences-api
```

4. Запустить команду docker compose, которая поднимет сервер, клиент и базу данных

   > При необходимости внести изменения в файл compose.yml

```
docker compose up
```

5. Открыть браузер и перейти по адресу http://localhost:80, чтобы увидеть запущенный проект.

## Для запуска проекта, необходимо выполнить следующие шаги:

1. Склонировать репозиторий с API по ссылке [https://github.com/supperley/student-conferences-api.git](https://github.com/supperley/student-conferences-api)

```
git clone https://github.com/supperley/student-conferences-api.git
```

2. Склонировать репозиторий с клиентским приложением по ссылке https://github.com/supperley/student-conferences.git

```
git clone https://github.com/supperley/student-conferences.git
```

3. Открыть терминал (или командную строку) и перейти в корневую директорию сервера

```
cd student-conferences-api
```

4. Переименовать файл .env.example (убрать .example), внести необходимые изменения

   > Указать ссылку для подключения к базе данных, JWT_SECRET (любая строка), credentials для почты

```
.env
```

5. Установить зависимости

```
npm install
```

6. Запустить сервер. Сервер должен запуститься по адресу http://localhost:3000

```
npm run start
```

7. Открыть терминал (или командную строку) и перейти в корневую директорию клиента

```
cd student-conferences
```

8. Переименовать файл .env.example (убрать .example), внести необходимые изменения (при необходимости)

```
.env
```

9. Установить зависимости

```
npm install
```

10. Запустить клиент. Клиент должен запустится по адресу http://localhost:8080

```
npm run dev
```

## Если вы хотите создать удаленную базу данных MongoDB (необходим VPN)

https://www.mongodb.com/resources/products/platform/mongodb-atlas-tutorial

## Если вы хотите создать локальный образ базы данных MongoDB

Запустить контейнер с образом MongoDB (необходим Docker)

```
  docker run --name mongodb \
       -p 27017:27017 \
       -e MONGO_INITDB_ROOT_USERNAME="root" \
       -e MONGO_INITDB_ROOT_PASSWORD="root" \
       mongodb/mongodb-community-server
```

или установить MongoDB Community Server на свое устройство

```
https://www.mongodb.com/try/download/community
```
