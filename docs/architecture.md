# Architecture Overview

This document outlines the core architecture, technology stack, directory layout, and security request lifecycle for the **NextBlog** platform.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose / Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.2.10 | App Router, Server Components, Server Actions, Standalone Build |
| **UI Library** | React | 19.2.4 | Modern concurrent React features, Client & Server Components |
| **Language** | TypeScript | 5.x | Strict type safety across frontend and backend |
| **Database ORM** | Prisma | 7.8.0 | Schema definition, migrations, type-safe queries, PostgreSQL adapter |
| **Database** | PostgreSQL | 15 (Alpine) | Relational database engine hosted in Docker or managed service |
| **Authentication** | NextAuth.js (Auth.js) | 5.0.0-beta.31 | Credentials provider, JWT sessions, Prisma adapter integration |
| **Styling & UI** | Tailwind CSS / Shadcn | 4.x | Utility-first CSS, Radix/Base UI components, CSS variables |
| **Rich Text Editor** | Tiptap | 3.27.x | Custom WYSIWYG editor with table, image upload, link, and alignment support |
| **Animations** | GSAP, Framer Motion, Lenis | Latest | Smooth scrolling, particle canvas, dynamic column marquee effects |
| **Progressive Web App** | Serwist | 9.5.11 | Service worker caching, offline support (`@serwist/next`) |

---

## 📁 Repository Directory Layout

```
nextblog/
├── docker/                     # Docker configuration helper scripts/files
├── docs/                       # Project documentation directory
├── prisma/
│   ├── schema.prisma           # Complete database models & relations
│   └── seed.ts                 # Initial database seeding script
├── public/                     # Static assets, fallback media, service worker outputs
├── src/
│   ├── actions/                # Next.js Server Actions for mutation logic
│   │   ├── category.actions.ts
│   │   ├── post.actions.ts
│   │   ├── profile.actions.ts
│   │   ├── settings.actions.ts
│   │   └── user.actions.ts
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/            # Admin route group with dedicated layout
│   │   │   └── admin/          # Admin pages (/admin, /admin/posts, /admin/users, etc.)
│   │   ├── (main)/             # Public route group with header/footer layout
│   │   │   ├── about/
│   │   │   ├── author/
│   │   │   ├── blog/
│   │   │   ├── categories/
│   │   │   ├── contact/
│   │   │   └── page.tsx        # Public Homepage
│   │   ├── api/                # REST API route handlers (/api/auth, /api/media, /api/upload)
│   │   ├── globals.css         # Global Tailwind v4 styles & custom keyframes
│   │   ├── layout.tsx          # Root HTML/Font layout
│   │   ├── proxy.ts            # Authentication & Request Middleware handler
│   │   ├── manifest.ts         # Web Application Manifest
│   │   ├── sitemap.ts          # Dynamic XML Sitemap generator
│   │   └── sw.ts               # Serwist Service Worker entry point
│   ├── components/             # Modular React components
│   │   ├── analytics/          # Tracking / Google Analytics wrapper
│   │   ├── blog/               # Author card, FAQ sections, blog grid items
│   │   ├── editor/             # Tiptap Rich Text Editor & Media Library modal
│   │   ├── home/               # Dynamic hero, floating particles, card wall
│   │   ├── layout/             # Site Header, Navigation, and Footer
│   │   └── ui/                 # Reusable Shadcn UI primitives
│   ├── lib/                    # Shared infrastructure modules
│   │   ├── auth.ts             # NextAuth.js authentication configuration
│   │   ├── prisma.ts           # PrismaClient singleton instance
│   │   └── utils.ts            # Tailwind class merger & helpers
│   └── types/                  # TypeScript declaration overrides (e.g. NextAuth session extension)
├── Dockerfile                  # Multi-stage production build configuration
├── docker-compose.yml          # Local containerized orchestration (App + Postgres)
├── next.config.ts              # Next.js build & rewrite rules
├── package.json                # Project manifest and scripts
└── tsconfig.json               # TypeScript compiler rules
```

---

## 🔒 Security, Middleware & Request Pipeline (`src/proxy.ts`)

NextBlog utilizes a custom proxy middleware wrapper powered by NextAuth `auth()` in [src/proxy.ts](file:///c:/Users/Admin/Desktop/nextblog/src/proxy.ts).

```
Request ---> [src/proxy.ts Middleware]
                 │
                 ├── 1. Canonical Redirects (www -> non-www, HTTP -> HTTPS)
                 ├── 2. Trailing Slash Removal
                 ├── 3. Authentication Check for `/admin/*` and `/dashboard/*`
                 └── 4. RBAC Check for Super-Admin Routes (`/admin/users`, `/admin/categories`, `/admin/settings`)
                 │
                 ▼
         Next.js App Router Handler / Page Component
```

### Key Security & Middleware Logic

1. **URL Canonicalization**:
   - Strips `www.` from the incoming hostname.
   - Redirects insecure `http://` requests to `https://` in production mode.
   - Trims trailing slashes for standard URL consistency.

2. **Admin Route Protection**:
   - All paths starting with `/admin` (except `/admin/login`) require an authenticated user session.
   - Unauthenticated requests are immediately redirected to `/admin/login`.

3. **Super Admin RBAC Guards**:
   - Specific admin routes (`/admin/categories`, `/admin/users`, `/admin/settings`) are restricted to users with `role === "ADMIN"`.
   - Users with the `AUTHOR` role attempting to access these routes are redirected back to the primary `/admin` dashboard.

---

## 🔑 Authentication Architecture (`src/lib/auth.ts`)

- **Strategy**: JWT-based session management (`session.strategy = "jwt"`).
- **Adapter**: `@auth/prisma-adapter` connecting session tokens to Prisma.
- **Provider**: Custom `CredentialsProvider` utilizing `bcryptjs` password verification.
- **Status Validation**: Immediately rejects login attempts if `user.status === "BLOCKED"`.
- **JWT & Session Callbacks**: Enriches session payload with user `role`, `status`, `permissions`, and `id`.
