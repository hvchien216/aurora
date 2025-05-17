<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Leww.space Backend

This is the backend API for Leww.space, built with NestJS, PostgreSQL, and Redis.

## Architecture Overview

The backend follows a modular architecture based on NestJS best practices:

```
server/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/         # Authentication module
│   │   ├── links/        # URL shortening module
│   │   └── users/        # User management module
│   ├── share/            # Shared resources
│   │   ├── decorators/   # Custom decorators
│   │   ├── filters/      # Exception filters
│   │   └── guards/       # Authentication guards
│   └── utils/            # Utility functions
├── prisma/               # Database schema and migrations
└── test/                 # End-to-end tests
```

### Key Architectural Patterns

- **Modular Architecture**: Each feature is a separate module
- **Repository Pattern**: Database access through Prisma
- **CQRS Pattern**: Separation of command and query responsibilities
- **Caching Strategy**: Redis for caching and rate limiting
- **Clean Architecture**: Separation of concerns between layers

## Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Start the development database and Redis:

```bash
docker-compose up -d postgres redis
```

4. Run database migrations:

```bash
pnpm prisma migrate dev
```

5. Start the development server:

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`

## Docker Development Environment

To run the complete development environment using Docker:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run tests with coverage
pnpm test:cov
```

## Style Guide

- Follow [NestJS style guide](https://docs.nestjs.com/guidelines/style-guide)
- Use TypeScript decorators for dependency injection
- Implement proper validation using DTOs
- Use meaningful exception filters
- Document APIs using Swagger decorators

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

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
