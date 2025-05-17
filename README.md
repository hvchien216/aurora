# Leww.space - Open Source URL Shortener

Leww.space is an open-source URL shortener and link management platform that helps you create, track, and manage your shortened URLs efficiently.

[![Tech Stacks](https://skillicons.dev/icons?i=nestjs,prisma,nextjs,ts,tailwind,react,postgresql,redis,pnpm,docker,nginx,aws&center=true&perline=13)](https://skill-icons-builder.vercel.app/)

My Skills

## Project Overview

This project is structured as a monorepo using Turborepo and pnpm for efficient package management and build orchestration.

### Monorepo Structure

```
leww.space/
├── client/           # Frontend monorepo
│   ├── apps/        # Next.js applications
│   │   └── web/     # Main web application
│   └── packages/    # Shared packages
│       ├── eslint-config/    # Shared ESLint configurations
│       ├── tailwind-config/  # Shared Tailwind CSS configurations
│       ├── typescript-config/# Shared TypeScript configurations
│       ├── ui/              # Shared UI component library
│       └── utils/           # Shared utility functions
├── server/          # Backend API
│   ├── src/         # Source code
│   └── prisma/      # Database schema and migrations
```

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Turborepo
- pnpm (Package Manager)

### Backend
- NestJS
- PostgreSQL
- Redis
- Docker
- TypeScript

## Architecture

### Frontend Architecture (FSD)

The frontend follows the Feature-Sliced Design (FSD) architectural methodology, which provides a structured approach to organizing code based on business logic and features.

#### Layer Organization
```
src/
├── app/          # Application setup layer
├── processes/    # Complex processes and flows
├── pages/        # Page components and routes
├── widgets/      # Complex reusable components
├── features/     # User interactions and business logic
├── entities/     # Business entities
└── shared/       # Shared kernel (UI, libs, API, configs)
```

### Package Dependencies

Our monorepo uses Turborepo for efficient build orchestration and caching. Key packages include:

- `@leww/ui`: Shared UI components
- `@leww/utils`: Common utility functions
- `@leww/eslint-config`: Standardized ESLint rules
- `@leww/tailwind-config`: Shared Tailwind configuration
- `@leww/typescript-config`: Shared TypeScript configuration

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/leww.space.git
cd leww.space
```

2. Install dependencies:
```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

3. Start the development environment:

```bash
# Start the backend services (PostgreSQL, Redis)
cd server
docker-compose up -d postgres redis

# Start the backend development server
pnpm start:dev

# In a new terminal, start the frontend
cd ../client
pnpm dev
```

## Development Workflow

### Running Tasks with Turborepo

```bash
# Build all packages and applications
pnpm build

# Run development server
pnpm dev

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint
```

## Contributing

Please check the individual README files in the `client/` and `server/` directories for detailed setup instructions and contribution guidelines.

## License

[MIT License](LICENSE) 