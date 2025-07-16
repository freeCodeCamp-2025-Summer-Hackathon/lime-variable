# ChoreChampion

ChoreChampion is a fun app that helps families keep track of household chores. It turns chores into a game where everyone earns points and rewards for completing tasks.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Api Documentation

Access the Swagger UI at `http://localhost:<port>/api`.

## Run tests

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Docker & Database Setup

This project uses Docker Compose to run a local PostgreSQL database for development.

### Start PostgreSQL with Docker Compose

1. Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
2. Create a `.env.development`, `.env.test`, or `.env.production` file in the `backend` directory with the following example content using the ".env.example":

```bash
  # Example for .env.development
  POSTGRES_USER=sample
  POSTGRES_PASSWORD=sample
  POSTGRES_DB=sample
  DOCKER_PORT=5431
  # For test: DOCKER_PORT=5432, for prod: DOCKER_PORT=5433 (or any free port)
```

3. install globally dotenv-cli:

```bash
pnpm add -g dotenv-cli
```

4. To start the database for a specific environment, run one of the following in the `backend` directory:

   **Development:**

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development -p lime-variable-dev up -d
```

or

```bash
pnpm docker:dev:up
```

**Test:**

```bash
docker compose -f docker-compose.test.yml --env-file .env.test -p lime-variable-test up -d
```

or

```bash
pnpm docker:test:up
```

**Production:**

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production -p lime-variable-prod up -d
```

or

```bash
pnpm docker:prod:up
```

This will start a PostgreSQL database on the port specified by `DOCKER_PORT` in your `.env` file, mapped to 5432 in the container.

## Quick Start (Development)

To launch both the backend and the database in development mode with a single command:

1. Make sure you have created a `.env.development` file as described above.
2. In the `backend` directory, run:

   ```bash
   pnpm docker:start:dev
   ```

This will:

- Start the PostgreSQL database using Docker Compose
- Push the latest Prisma schema to the database
- Generate the Prisma client
- Start the NestJS backend in development mode

---

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
