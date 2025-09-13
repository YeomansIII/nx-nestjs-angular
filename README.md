# Nx NestJS Angular Template

A modern, production-ready monorepo template for building full-stack TypeScript applications with NestJS, Angular, GraphQL, and PostgreSQL.

## 🚀 Features

- **Monorepo Architecture**: Powered by Nx for efficient development and build optimization
- **GraphQL API**: NestJS with Apollo Server and automatic CRUD operations via @ptc-org/nestjs-query
- **Angular 20 Frontend**: Server-Side Rendering (SSR) with Apollo Client
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: TypeORM with PostgreSQL
- **Code Generation**: Automatic TypeScript types and Angular services from GraphQL schema
- **Styling**: TailwindCSS with custom configuration
- **Type Safety**: End-to-end type safety from database to UI
- **Developer Experience**: Hot reload, linting, testing, and consistent code structure

## 📁 Project Structure

```
nx-nestjs-angular/
├── apps/
│   ├── api-server/          # NestJS GraphQL API
│   ├── api-server-e2e/      # API E2E tests
│   ├── web/                 # Angular application with SSR
│   └── web-e2e/             # Web E2E tests
├── libs/
│   ├── data-access/         # GraphQL operations and TypeScript types
│   ├── data-access-ng/      # Angular-specific GraphQL services
│   ├── server/
│   │   ├── orm-entities/    # Shared TypeORM entities
│   │   └── config/          # Server configuration utilities
│   └── shared-types/        # Shared TypeScript interfaces
├── docker-compose.yml       # PostgreSQL development database
├── .env.example            # Environment variables template
└── CLAUDE.md              # AI assistant documentation
```

## 🛠️ Prerequisites

- Node.js 18+
- npm or yarn
- Docker and Docker Compose (for PostgreSQL)
- Git

## 🏃 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd nx-nestjs-angular

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### 2. Start the Database

```bash
# Start PostgreSQL in Docker
npm run db:up

# To stop the database later
npm run db:down
```

### 3. Run Development Servers

```bash
# Start both API and web app
npm start

# Or run them separately
nx serve api-server  # API on http://localhost:3000
nx serve web         # Web on http://localhost:4200
```

### 4. Access the Applications

- **Web Application**: http://localhost:4200
- **GraphQL Playground**: http://localhost:3000/graphql
- **API Health Check**: http://localhost:3000/api

## 📝 Development Workflow

### Adding New Features

#### 1. Create a New Entity

```typescript
// libs/server/orm-entities/src/lib/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

#### 2. Create DTOs

```typescript
// apps/api-server/src/app/products/dto/product.dto.ts
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';

@ObjectType('Product')
export class ProductDTO {
  @IDField(() => ID)
  id: string;

  @FilterableField()
  name: string;

  @Field()
  price: number;
}

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  price: number;
}
```

#### 3. Create Module with Auto CRUD

```typescript
// apps/api-server/src/app/products/products.module.ts
import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Product])],
      dtos: [
        {
          DTOClass: ProductDTO,
          CreateDTOClass: CreateProductInput,
          UpdateDTOClass: UpdateProductInput,
        },
      ],
    }),
  ],
})
export class ProductsModule {}
```

### GraphQL Code Generation

After adding new GraphQL operations:

```bash
# 1. Add queries/mutations to libs/data-access/src/lib/graphql/*.gql

# 2. Generate TypeScript types and Angular services
npm run generate

# Or run steps separately:
npm run generate:schema  # Generate GraphQL schema from NestJS
npm run generate:types   # Generate TypeScript types and Angular services
```

### Testing

```bash
# Run all tests
npm test

# Run specific project tests
nx test api-server
nx test web

# Run affected tests (based on git changes)
nx affected:test

# Run with coverage
nx test api-server --coverage
```

### Building for Production

```bash
# Build all projects
npm run build

# Build specific project
nx build api-server --configuration=production
nx build web --configuration=production

# Analyze bundle size
nx build web --configuration=production --stats-json
```

## 🔐 Authentication

The template includes a complete JWT authentication system:

### Registration
```graphql
mutation Register($input: CreateUserInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      username
    }
  }
}
```

### Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      username
    }
  }
}
```

### Protected Routes

Backend:
```typescript
@UseGuards(GqlAuthGuard)
@Query(() => UserDTO)
async me(@CurrentUser() user: User) {
  return user;
}
```

Frontend:
```typescript
// Tokens are automatically added to requests via Apollo Link
const token = localStorage.getItem('accessToken');
```

## 🗄️ Database Management

### TypeORM Migrations

```bash
# Generate a new migration
nx run api-server:migration:generate --name=AddProductTable

# Run migrations
nx run api-server:migration:run

# Revert last migration
nx run api-server:migration:revert
```

### Database Schema Sync (Development Only)

The database schema automatically syncs in development mode. For production, use migrations.

## 📦 Available Scripts

```json
{
  "start": "Run both API and web app in development",
  "build": "Build all projects",
  "test": "Run all tests",
  "lint": "Lint all projects",
  "db:up": "Start PostgreSQL in Docker",
  "db:down": "Stop PostgreSQL",
  "generate": "Generate GraphQL schema and TypeScript types"
}
```

## 🧩 Key Technologies

### Backend
- **NestJS 11**: Progressive Node.js framework
- **Apollo Server**: GraphQL server
- **TypeORM**: Object-Relational Mapping
- **PostgreSQL**: Relational database
- **Passport + JWT**: Authentication
- **@ptc-org/nestjs-query**: Automatic CRUD operations

### Frontend
- **Angular 20**: Component-based UI framework
- **Apollo Client**: GraphQL client with caching
- **TailwindCSS**: Utility-first CSS framework
- **Server-Side Rendering**: Better SEO and initial load

### Development
- **Nx**: Monorepo build system
- **TypeScript**: Type-safe JavaScript
- **GraphQL Code Generator**: Automatic type generation
- **Jest**: Unit testing
- **ESLint**: Code linting
- **Docker**: Containerized database

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=nx_nestjs_angular_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=30d

# API
API_PORT=3000
API_PREFIX=api

# Frontend
FRONTEND_URL=http://localhost:4200
```

### Nx Configuration

Modify `nx.json` for workspace-wide settings:
- Cache configuration
- Task dependencies
- Generator defaults

### TypeORM Configuration

Edit `libs/server/config/src/lib/database.config.ts` for database settings.

### GraphQL Configuration

Modify GraphQL settings in `apps/api-server/src/app/app.module.ts`.

## 🚢 Deployment

### Docker Deployment

```dockerfile
# Build the API
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN nx build api-server --configuration=production

# Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/api-server .
CMD ["node", "main.js"]
```

### Environment-Specific Builds

```bash
# Development
nx build web --configuration=development

# Staging
nx build web --configuration=staging

# Production
nx build web --configuration=production
```

## 📚 Additional Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://nestjs.com)
- [Angular Documentation](https://angular.io)
- [GraphQL Documentation](https://graphql.org)
- [@ptc-org/nestjs-query](https://github.com/TriPSs/nestjs-query)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Nx](https://nx.dev) monorepo tools
- Inspired by modern full-stack best practices
- GraphQL CRUD operations powered by [@ptc-org/nestjs-query](https://github.com/TriPSs/nestjs-query)
