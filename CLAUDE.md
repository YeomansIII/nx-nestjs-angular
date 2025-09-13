# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a generic Nx monorepo template for building full-stack applications with:
- **api-server**: GraphQL API (NestJS) with TypeORM and PostgreSQL
- **web**: Customer UI (Angular 20 with SSR and TailwindCSS)
- **Shared libraries**: Data access, GraphQL types, and shared entities

## Essential Commands

```bash
# Environment setup
cp .env.example .env
npm install

# Database
npm run db:up                    # Start PostgreSQL in Docker
npm run db:down                  # Stop PostgreSQL

# Development
npm start                        # Run both api-server and web app
nx serve api-server              # Port 3000
nx serve web                     # Port 4200

# GraphQL code generation (run after modifying .gql files)
npm run generate:schema          # Generate GraphQL schema from NestJS
npm run generate:types           # Generate TypeScript types and Angular services
npm run generate                 # Run both commands above

# Testing
nx test <project-name>           # Unit tests
nx run-many --target=test --all # All tests

# Building
nx build <project-name>
nx build <project-name> --configuration=production

# Linting
nx lint <project-name>
nx run-many --target=lint --all

# Generate new components/services
nx g @nx/angular:component component-name --project=web
nx g @nx/nest:service service-name --project=api-server
nx g @nx/nest:module module-name --project=api-server
```

## Architecture & Key Patterns

### GraphQL API Structure
- Uses `@ptc-org/nestjs-query-graphql` for automatic CRUD resolvers
- Code-first approach with TypeScript decorators
- DTOs: Separate Create/Update/Read DTOs per entity
- Authentication: JWT with refresh tokens
- Guards: `GqlAuthGuard` for protected endpoints
- GraphQL operations stored in `libs/data-access/src/lib/graphql/*.gql`

### Angular Frontend
- Angular 20 with Server-Side Rendering (SSR)
- Apollo Angular for GraphQL with auto-generated services
- Standalone components with OnPush change detection
- TailwindCSS for styling
- Authentication stored in localStorage
- GraphQL services generated from .gql files

### Database (TypeORM + PostgreSQL)
- Entity naming: snake_case tables, camelCase properties
- All entities have: id (UUID), createdAt, updatedAt
- Relations: ManyToOne, OneToMany with proper decorators
- Auto-sync in development (synchronize: true)
- Password hashing with bcrypt

### Code Organization
- Monorepo with Nx workspace
- Shared libraries under `libs/`
- Import paths: `@nx-nestjs-angular/**`
- Feature-based module organization
- Barrel exports (index.ts) for clean imports

## Development Workflow

1. **Initial Setup**:
   ```bash
   cp .env.example .env
   npm install
   npm run db:up
   ```

2. **Generate GraphQL Schema** (first time):
   ```bash
   nx serve api-server --watch=false
   # This creates apps/api-server/src/schema.gql
   ```

3. **Create GraphQL Operations**:
   - Add queries/mutations to `libs/data-access/src/lib/graphql/*.gql`
   - Run `npm run generate:types` to generate TypeScript types

4. **Add New Features**:
   - Create entity in `libs/server/orm-entities/src/lib/entities/`
   - Create DTOs in `apps/api-server/src/app/<feature>/dto/`
   - Create module with @ptc-org/nestjs-query
   - Add GraphQL operations in `libs/data-access/src/lib/graphql/`
   - Generate types and use in Angular components

## Key Libraries & Technologies
- **Frontend**: Angular 20, TailwindCSS, Apollo Angular
- **Backend**: NestJS 11, TypeORM, GraphQL, JWT, Passport
- **Infrastructure**: Docker (PostgreSQL), Nx monorepo
- **Development**: TypeScript, Jest, ESLint, GraphQL Codegen

## Authentication Flow
1. User registers/logs in via GraphQL mutation
2. Server returns access token and refresh token
3. Frontend stores tokens in localStorage
4. Apollo client adds Bearer token to all requests
5. Protected resolvers use `@UseGuards(GqlAuthGuard)`
6. Refresh token used when access token expires

## Testing Strategy
- Unit tests with Jest for all applications and libraries
- GraphQL resolvers tested with mocked services
- Angular components tested with Apollo testing module
- Run affected tests: `nx affected:test`

## Important Conventions
- File naming: kebab-case files, PascalCase classes/interfaces
- Explicit types for public APIs (avoid type inference)
- Use DTOs for all GraphQL inputs/outputs
- Follow NestJS module pattern for backend features
- Use standalone Angular components
- Store GraphQL operations in `libs/data-access/src/lib/graphql/`
- Always run code generation after modifying .gql files