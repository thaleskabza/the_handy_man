# The Handy Man

Mobile-first platform connecting clients with vetted artisanal professionals (plumbers, painters, carpenters, electricians, tilers, cleaners, and general handymen).

## 🚀 Quick Start

### Prerequisites

- **Bun v1.3.6+** - [Installation Guide](https://bun.sh)
- **Docker & Docker Compose** - For local database services
- **Node.js 18+** - For Next.js web app
- **PostgreSQL 15+** - Via Docker or local install
- **Redis 7+** - Via Docker or local install

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/the-handy-man.git
cd the-handy-man
```

2. **Install Bun (if not already installed)**
```bash
curl -fsSL https://bun.sh/install | bash
```

3. **Install dependencies**
```bash
bun install
```

4. **Start Docker services**
```bash
cd infrastructure/docker
docker-compose up -d
```

5. **Setup environment variables**
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit .env with your configuration
```

6. **Run database migrations**
```bash
bun run db:migrate
```

7. **Seed the database**
```bash
bun run db:seed
```

8. **Start development server**
```bash
bun run dev
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
the-handy-man/
├── packages/
│   ├── backend/          # Bun + Elysia API server
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── shared/   # Shared utilities
│   │   │   ├── websocket/# WebSocket server
│   │   │   ├── jobs/     # Background jobs
│   │   │   └── server.ts # Main entry point
│   │   └── prisma/       # Database schema & migrations
│   ├── mobile/           # React Native mobile app
│   ├── web/              # Next.js web dashboard
│   └── shared/           # Shared types & utilities
├── infrastructure/       # Docker, Terraform, K8s configs
├── docs/                 # Documentation
├── scripts/              # Utility scripts
└── .github/              # GitHub Actions CI/CD
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Bun v1.3.6
- **Framework:** Elysia v1.0
- **Database:** PostgreSQL 15+ with PostGIS
- **ORM:** Prisma 5.8.0
- **Cache:** Redis 7+
- **Search:** Meilisearch 1.6
- **Queue:** BullMQ
- **Validation:** Zod 3.22.4
- **Authentication:** JWT + bcrypt
- **Payments:** Stripe
- **WebSocket:** Bun native WebSocket

### Mobile
- **Framework:** React Native 0.73.2
- **Language:** TypeScript
- **State:** Redux Toolkit
- **Navigation:** React Navigation
- **API:** React Query + Axios

### Web
- **Framework:** Next.js 14+
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui

## 🏗️ Development

### Available Scripts

```bash
# Development
bun run dev              # Start backend dev server
bun run dev:backend      # Start backend only
bun run dev:web          # Start web dashboard

# Database
bun run db:migrate       # Run migrations
bun run db:seed          # Seed database
bun run db:studio        # Open Prisma Studio

# Testing
bun test                 # Run all tests
bun test:watch           # Watch mode

# Code Quality
bun run lint             # Lint code
bun run format           # Format code

# Build
bun run build            # Build all packages
```

### Environment Variables

See `packages/backend/.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `SENDGRID_API_KEY` - Email service

## 📊 Database

### Migrations

```bash
# Create a new migration
cd packages/backend
bunx prisma migrate dev --name description

# Apply migrations to production
bunx prisma migrate deploy

# Reset database (DESTRUCTIVE)
bunx prisma migrate reset
```

### Prisma Studio

View and edit database data:
```bash
bun run db:studio
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test src/modules/auth/__tests__/auth.test.ts

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

## 🚢 Deployment

### Production Build

```bash
bun run build
```

### Docker

```bash
# Build Docker image
docker build -t the-handy-man-api -f infrastructure/docker/Dockerfile .

# Run container
docker run -p 3000:3000 --env-file .env the-handy-man-api
```

### AWS ECS

See `.github/workflows/deploy.yml` for CI/CD pipeline.

## 📚 Documentation

- [User Stories](./docs/01_USER_STORIES.md)
- [Database Schema](./docs/02_DATABASE_SCHEMA.md)
- [Wireframes & User Flows](./docs/03_WIREFRAMES_USER_FLOWS.md)
- [Technical Architecture](./docs/04_TECHNICAL_ARCHITECTURE_API.md)
- [API Documentation](http://localhost:3000/swagger)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

Copyright © 2026 The Handy Man. All rights reserved.

## 🆘 Support

For support, email support@thehandyman.com or open an issue.

## 👥 Team

- Full-Stack Lead
- Backend Developer
- Frontend Developer (x2)
- UI/UX Designer
- QA Engineer
- Product Manager

---

**Built with ❤️ using Bun v1.3.6**
