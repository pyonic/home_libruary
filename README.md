# Home library part 2

## Steps to run app:
- Clone repo ```git clone https://github.com/pyonic/home_libruary.git --branch=home_lib_p2```
- Install dependencies ```npm i --legacy-peer-deps```
- Build the app ```npm run build```
- First, rename .env.example to .env
- Run docker containers (instruction can be found below)
- Run migrations ``npm run migrations:run``
- Check tests: ```npm run test```

See more in instructions below

## Extra commands
- Scan vulnerability of images: ``docker:scan:linux`` for Linux and ``docker:scan:windows`` for Windows, but before that **you need to login into** docker ``docker login``
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

