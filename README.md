# Home library part 2

## Steps to run app:

- Step 1 First, rename .env.example to .env
- Step 2 Run docker containers
- Step 3 Run migrations
- Check tests: ```npm run test```

## Extra commands
- Scan vulnerability of images: ``docker:scan:linux`` for Linux and ``docker:scan:windows`` for Windows, but before that you need to login into docker ``docker login``
- Containers live rebuild after **/src** changes -> See **Auto rebuild containers** section below
  
## Run docker containers
On Linux

```sudo docker compose up -d```

On Windows

```docker-compose up -d```

## Run migrations

``npm run migrations:run``

## Auto rebuild containers

On Linux

```npm run auto:rebuild:linux```

On Windows

```npm run auto:rebuild:windows```

Container size is less then 500mb

![Api image size](image.png)

![Postgres image size](image-1.png)

