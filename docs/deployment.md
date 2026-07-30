# Deployment & Environment Setup

This document covers local development, environment variables, Docker containerization, standalone production builds, and Progressive Web App (PWA) configuration for NextBlog.

---

## 🔑 Environment Variables Reference

Create a `.env` file in the root directory based on the following template:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://betsetgo_user:betsetgo_password@localhost:5433/betsetgo_db?schema=public"

# PostgreSQL Container Credentials (used by docker-compose)
POSTGRES_USER="betsetgo_user"
POSTGRES_PASSWORD="betsetgo_password"
POSTGRES_DB="betsetgo_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="your-super-secret-key-change-in-production"
AUTH_TRUST_HOST="true"

# Environment
NODE_ENV="development"
```

---

## 🐳 Docker Deployment (`docker-compose.yml`)

NextBlog includes production-ready containerization via Docker multi-stage builds.

### 1. `Dockerfile` Multi-Stage Overview

The [Dockerfile](file:///c:/Users/Admin/Desktop/nextblog/Dockerfile) optimizes bundle size using a three-stage build:
1. **`deps`**: Installs production dependencies using `pnpm`.
2. **`builder`**: Generates Prisma Client (`npx prisma generate`) and builds Next.js in standalone mode (`output: 'standalone'`).
3. **`runner`**: Minimal Alpine runtime environment executing `node server.js` as a non-root user.

### 2. `docker-compose.yml` Architecture

```
                       ┌─────────────────────────┐
                       │  Host Port 3000 / 80    │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   app Service           │
                       │   (Next.js Standalone)  │
                       └────────────┬────────────┘
                                    │
                                    │ Internal app-network
                                    ▼
                       ┌─────────────────────────┐
                       │   db Service            │
                       │   (PostgreSQL 15)       │
                       └─────────────────────────┘
```

### Running with Docker Compose

```bash
# Build and start services in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f app

# Run database migrations inside the app container
docker compose exec app npx prisma db push
```

---

## 📱 Progressive Web App (PWA) Setup (`@serwist/next`)

NextBlog integrates **Serwist** for service worker caching and offline capabilities.

### Configuration Configuration ([next.config.ts](file:///c:/Users/Admin/Desktop/nextblog/next.config.ts))

```ts
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: 'standalone',
  // ...
};

export default withSerwist(nextConfig);
```

- Service worker source is defined in `src/app/sw.ts`.
- In production builds, Serwist compiles `public/sw.js` and precaches core static assets.
- Offline fallback page route is situated at `src/app/~offline/page.tsx`.

---

## 🚀 Standalone Build Manual Commands

If deploying to a VPS (e.g. Ubuntu, AWS EC2, DigitalOcean) without Docker:

```bash
# 1. Install dependencies
pnpm install

# 2. Build Prisma Client & Next.js standalone application
pnpm prisma generate
pnpm build

# 3. Start standalone server
node .next/standalone/server.js
```
