# Shared Services

A Mini Shared Post service api where user can share posts to each other.

## Prerequisites

- NodeJS runtime v16 or above.
- Docker and docker compose running in OS
- Make sure the port 8000 and 4500 are avaliable for localhost
- Postman

## Tech Stack

- TypeScript (type-safe language)
- ExpressJS (Framework)
- MySQL (RDBS)
- Prisma (ORM)
- Docker compose

## Features

- Admin can create, verify, suspend and delete user.
- Admin can create, update and delete a category.
- Both admin and user can delete post. But the user should be the author of the post.
- User can publish the drafted posts and report the post.
- Reported user are added into list of reported users.
- Only published posts can be seen by all users.
- User can fetch his own reported, draft and published posts.
- User and admin are authenticated through JWT token.
- Each request should add "Authorization : Bearer {{access_token}}" to be authenticated.
- Access token of both can be acquired by signing in with correct credentials.

## Project Setup

### Clone the project using the command below

```bash
git clone "https://github.com/harrison542002/shared-service.git"
```

### Run below command in order to start the server.

```bash
npm run db:start
npm start #Make sure db container has been initilizated before this command.
```

### Create a .env file and copy-paste below variables

```text
DATABASE_URL=mysql://root:password@localhost:4500/dev-db
PORT=8000
TOKEN_SECRET=c88571884e2a8ecb0eb10df4808e4b6cce5d0c2cec200dcdf9275b522bf19bf2a1ec9d9aa978c0a9606a9270636d3afac2d4d688d4c8a243d5436bd1b1c5627f
```

### Import JSON into your Postman Application

Import the "Shared Service.postman_collection.json" by followed this tutorial into POSTMAN
https://shorturl.at/gjlC2

Import the "gloabl_env.json" global environment variable into POSTMAN by following this tutorial
https://testfully.io/blog/import-from-postman/#import-postman-environments

### Important

Please replace these three environment variables with access token by sign in

- {{access_token}} : replace access token by sign in as a user.
- {{admin_access_token}} : replace access token by sign in as an admin.

All routes are accessible in POSTMAN.
Database schema can be read through "schema.prisma" under "prisma" folder

## Default Value

Default values are populated through "seed.ts" under "prisma" folder

### Default Admin

name - "aungthihamdy"
password - "password"

### Default User

email - "aung@gmail.com"
password - "password"
