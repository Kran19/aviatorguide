# NextBlog Documentation

Welcome to the official technical documentation for **NextBlog**, a modern, high-performance, full-stack blogging platform built with **Next.js 16 (App Router)**, **React 19**, **Prisma ORM**, **NextAuth.js v5**, **Tailwind CSS v4**, and **PostgreSQL**.

---

## 📚 Documentation Index

1. **[Architecture Overview](file:///c:/Users/Admin/Desktop/nextblog/docs/architecture.md)**
   - Technical Stack & System Overview
   - Directory Structure
   - Middleware & Request Pipeline (`src/proxy.ts`)
   - Authentication & Authorization Flow

2. **[Database Schema & Models](file:///c:/Users/Admin/Desktop/nextblog/docs/database.md)**
   - Database Provider & Connection Config
   - Prisma Schema Models & Relationships
   - Enumerations (`Role`, `PostStatus`, `UserStatus`, `SubscriberStatus`)
   - Database Seeding & Migrations

3. **[Admin Dashboard & RBAC](file:///c:/Users/Admin/Desktop/nextblog/docs/admin-dashboard.md)**
   - Admin Routing Structure (`/admin`)
   - Role-Based Access Control (`ADMIN` vs `AUTHOR`)
   - Content Workflow (Drafting, Reviewing, Publishing)
   - User Management, Categories, Media Library & Site Settings

4. **[Component System & Rich Text Editor](file:///c:/Users/Admin/Desktop/nextblog/docs/components.md)**
   - Tiptap Rich Text Editor Extensions & Features
   - Hero Animations (GSAP, Framer Motion, Lenis)
   - Layout Components (`Header`, `Footer`, Theme Providers)
   - Blog & UI Shared Components

5. **[Server Actions & API Routes](file:///c:/Users/Admin/Desktop/nextblog/docs/api-and-actions.md)**
   - Server Actions (`user.actions`, `post.actions`, `category.actions`, `profile.actions`, `settings.actions`)
   - REST API Endpoints (`/api/auth`, `/api/media`, `/api/upload`)
   - Input Validation & Error Handling

6. **[Deployment & Environment Setup](file:///c:/Users/Admin/Desktop/nextblog/docs/deployment.md)**
   - Local Development Setup
   - Docker & Docker Compose Deployment
   - Standalone Next.js Build & Optimization
   - PWA Configuration (`@serwist/next`)
   - Environment Variables Matrix

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp .env.example .env

# 3. Setup PostgreSQL database and run migrations
npx prisma db push

# 4. Seed default data (admin account, categories, posts)
pnpm prisma db seed

# 5. Run local development server
pnpm dev
```

Visit `http://localhost:3000` to view the public application or `http://localhost:3000/admin/login` for the admin portal.
