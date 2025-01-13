# Ecommerce Platform
![Docker](https://img.shields.io/badge/docker-27.3.1-green)
![Nginx](https://img.shields.io/badge/nginx-alpine-green)
![Typescript](https://img.shields.io/badge/typescript-5.2.2-green.svg)
![Node 18](https://img.shields.io/badge/node-18_alpine-green)
![Express 4.x.x](https://img.shields.io/badge/express-4.19.2-green.svg)
![React 18](https://img.shields.io/badge/react-18.2.0-green.svg)
![Postgresql 17](https://img.shields.io/badge/postgresql-14_alpine-green.svg)
![Prisma 5.x.x](https://img.shields.io/badge/prisma-5.20.0-green.svg)
![Tsoa 6.x.x](https://img.shields.io/badge/tsoa-6.4.0-green.svg)
![Swagger 5.x.x](https://img.shields.io/badge/swagger_api_docs-5.0.1-green.svg)

**Go live:** https://vps-3131144f.vps.ovh.net/  

**Admin credentials on prod** 
- admin@ecm.fr
- azerty  

**Default seller credentials on prod (admin can create seller)**
- seller@ecm.fr
- azerty


By using Docker, we avoid populating your host machine. Simply install Docker, and you're ready to go.


## PORN stack overview
FYI, PORN stack is postgresql, react, node. Here is the details stack breakdown:
- **Infrastructure:** Nginx, Docker, Postgresql, TLS-SSL for local development environment, Let's Encrypt for production
- **Programming Language:** Typescript, Bash Script
- **Backend:** Express (server framework), Tsoa-Swagger(controller & auto API docs), Postgresql (relational database), Prisma (ORM) 
- **Frontend:** React
- **Automation Test (TODO: nyi):** Unit Test, End-to-End test (E2E), Performance Test

## How to run
Create .env file in root project and copy this. This is for running local dev environment.  
```shell
###############
# DEV .env
POSTGRES_USER=user
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=fullstack_boilerplate_db
DATABASE_URL=postgresql://user:qwerty@postgres-db:5432/fullstack_boilerplate_db?schema=public
HMAC_SECRET=azerty
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=raphaelle.stamm95@ethereal.email
SMTP_PASSWORD=ujDd9JezSyrnNvxCZA
MINIO_ROOT_USER=miniouser
MINIO_ROOT_PASSWORD=miniopassword
```
From root project, `./runner` is the entry point
command to run different environments: development, production, reset environment, etc.
#### Run Development
``` bash
./runner dev
```
Local admin/seller credentials:
```shell
admin email: admin@ecm.fr
password: azerty

seller email: seller@ecm.fr
password: azerty
```
#### Run Staging
``` bash
./runner prod
```
#### See manual
To see all options of the command `./runner` run:
``` bash
./runner --help
```
#### Check prerequisite installed
To list all prerequisite. Run:
``` bash
./runner list-prerequisite
```
To check prerequisite on your environment. Run:
``` bash
./runner prerequisite
```
#### Clean
To clean development environment. Notice: the development data mounted in docker will be lost
``` bash
./runner clean
```

#### Install package
Best practice: Run `./runner clean` before running any below commands

To install every dependencies listed in packages/*/package.json
``` bash
pnpm install
```  
To install dev-dependency for specific package
``` bash
pnpm --filter <backend | frontend | shared-utils | shared-models> add --save-dev <package>
```  

To install dependency for specific package
``` bash
pnpm --filter <backend | frontend | shared-utils | shared-models> add <package>
```

#### Working with prisma
Typically, workflows is around changing the model schema, to do that, you need:
1. Stop application (if you already run it)
2. Change your schema in packages/backend/prisma/schema.prisma
3. Start application again (./entrypoint.sh dev). Prisma will automatically create
   a sql script reflecting your schema change. This script is called `migration` and will be
   in packages/backend/prisma/migrations
4. In case your `migration` is failed, you need to stop application, manually delete the migration in folder
   packages/backend/prisma/migrations and start your application again.

Note: Whenever change a model inside schema.prisma, always clean restart app:
```shell
./runner clean
./runner dev
```

## Feature
User can see all products, add products to cart, order cart and manage
their historical orders. Order will be validated by seller
![img_6.png](pictures-for-docs/img_6.png)
![img_7.png](pictures-for-docs/img_7.png)
![img_8.png](pictures-for-docs/img_8.png)
Admin can add/edit shop item
![img_10.png](pictures-for-docs/img_10.png)
Admin can add/delete shop seller
![img_9.png](pictures-for-docs/img_9.png)
![img_11.png](pictures-for-docs/img_11.png)
The seller must be not existed on platform for seller creation. After adding seller, the seller's 
password for the first sign-in is `azerty`. Don't worry about the hard coded password. Seller
is always asked to reset their password on the first sign-in.
![img_12.png](pictures-for-docs/img_12.png)
![img_13.png](pictures-for-docs/img_13.png)
![img_14.png](pictures-for-docs/img_14.png)
![img_15.png](pictures-for-docs/img_15.png)
![img_16.png](pictures-for-docs/img_16.png)
After successfully sign in as seller. Seller can now validate the orders.
![img_17.png](pictures-for-docs/img_17.png)
![img_18.png](pictures-for-docs/img_18.png)

## Architecture
#### Development infrastructure  
![img_1.png](pictures-for-docs/img_1.png)
#### Staging infrastructure
On staging, the data is not seeded, frontend is built to static file and is served directly 
by nginx which simulates production environment
![img_2.png](pictures-for-docs/img_2.png)
#### Production infrastructure
![img_3.png](pictures-for-docs/img_3.png)
#### Model
![img.png](pictures-for-docs/img.png)
#### Authentication & Authorization system
Our system implements **Claim-Based Access Control (CBAC)** for authentication and authorization.
Each resource has two security claims: resource.read (read) and resource.write (create, update, delete).
Each role of application is assigned specific claims based on the defined 
policy of our application and each API endpoint which manages resource has required claims for the access.
![img_4.png](pictures-for-docs/img_4.png)

The process is like that: sign in to get API access token -> Use API access token to perform read/write
resource request to API -> Authorization system fetches subject user of this token, see their role, assign the
claims for the request based on user's role -> Controller compares whether the required claims match with the request's 
claims to allow read/write or refuse the request
![img_5.png](pictures-for-docs/img_5.png)

## TODO
- [ ] MFA
- [ ] End-to-End test, Security test, Performance test.

