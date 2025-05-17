# Leww.space Frontend

This is the frontend application for Leww.space, built with Next.js 15, React 19, and TypeScript.

## Monorepo & Packages

Leww.space frontend is managed as a monorepo using Turborepo and pnpm, with shared packages:

```
client/
├── apps/
│   └── web/               # Main Next.js application
└── packages/              # Shared packages
    ├── eslint-config/     # Shared ESLint configuration
    ├── tailwind-config/   # Shared Tailwind CSS configuration
    ├── typescript-config/ # Shared TypeScript configuration
    ├── ui/                # Shared UI component library
    └── utils/             # Shared utility functions
```

## Tech Stack

- Next.js 15  
- React 19  
- TypeScript  
- Tailwind CSS  
- Shadcn UI  
- Turborepo  
- pnpm (Package Manager)

## Architecture Overview

The frontend follows a modern Next.js application structure with the following patterns:

```
client/
├── apps/
│   └── web/              # Main web application
│       ├── src/
│       │   ├── app/      # Next.js App Router pages
│       │   ├── components/# Reusable UI components
│       │   ├── lib/      # Utility functions and shared logic
│       │   └── styles/   # Global styles and Tailwind config
└── packages/             # Shared packages (if any)
```

### Key Architectural Patterns

- **App Router**: Using Next.js 15 App Router for routing and layouts
- **Component Architecture**: Following atomic design principles
- **State Management**: Using React Query for server state and Zustand for client state
- **Styling**: Tailwind CSS with Shadcn UI components
- **Type Safety**: Strong TypeScript implementation throughout

## Feature-Sliced Design (FSD)

The frontend architecture is inspired by Feature-Sliced Design (FSD), organizing code by business features and layers.

#### Layer Organization

```
src/
├── app/          # Application setup and skeleton
├── pages/        # Route-level page components
├── widgets/      # Complex, reusable UI blocks
├── features/     # Single feature modules with UI and logic
├── entities/     # Business entities and domain models
└── shared/       # Shared modules (UI, utils, configs, API)
```

### Dependency Graph

![Dependency Graph][dependency-graph-domain]

[dependency-graph-domain]: ./aaaa.svg

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
```

3. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Adding New Features

## Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch
```

## Build

```bash
# Create production build
pnpm build

# Preview production build
pnpm start
```

## Style Guide

- Follow the [Next.js Style Guide](https://nextjs.org/docs/app/building-your-application/routing/colocation#project-organization-strategies)
- Use TypeScript for all new code
- Follow the existing component patterns
- Use Tailwind CSS for styling
- Implement proper error boundaries and loading states 