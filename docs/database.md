# Database Schema & Models

NextBlog uses **PostgreSQL** managed through **Prisma ORM (v7.8.0)**. The schema is defined in [prisma/schema.prisma](file:///c:/Users/Admin/Desktop/nextblog/prisma/schema.prisma).

---

## 🗄️ Database Schema Diagram Overview

```
 ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
 │     User     │───1:N───│     Post     │───N:M───│   Category   │
 └──────────────┘         └──────────────┘         └──────────────┘
    │    │   │                   │                        
   1:N  1:N 1:N                 N:M                       
    │    │   │                   │                        
    ▼    ▼   ▼                   ▼                        
 ┌────┐┌───┐┌────────┐    ┌──────────────┐
 │Acct││Sess││Comment │    │     Tag      │
 └────┘└───┘└────────┘    └──────────────┘
    │        │ 
   1:N      1:N (Self-relation)
    ▼        ▼
┌──────────────┐
│ Like/Bookmark│
└──────────────┘
```

---

## 📋 Enumerations

### `Role`
- `USER`: Standard registered user.
- `AUTHOR`: Content creator capable of writing, editing, and submitting posts.
- `ADMIN`: Super admin with full access to user management, category administration, site settings, and post approvals.

### `UserStatus`
- `ACTIVE`: Account operational.
- `BLOCKED`: Account suspended; authentication attempts fail automatically.

### `PostStatus`
- `DRAFT`: Initial author draft.
- `PENDING_APPROVAL`: Submitted by Author for Admin review.
- `PUBLISHED`: Approved and visible on the public blog.
- `REJECTED`: Declined by Admin with remarks.

### `SubscriberStatus`
- `ACTIVE`: Subscribed to newsletter updates.
- `UNSUBSCRIBED`: Opted out of email communications.

---

## 📄 Database Models Breakdown

### 1. `User`
Stores user profile data, credentials, roles, bio, social links, and author metrics.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(cuid())` | Unique user identifier |
| `name` | String? | | User's full display name |
| `email` | String? | `@unique` | Unique account email address |
| `emailVerified` | DateTime? | | Email verification timestamp |
| `image` | String? | | Avatar image URL |
| `passwordHash` | String? | | Encrypted password (Bcrypt) |
| `role` | Role | `@default(USER)` | User role (`USER`, `AUTHOR`, `ADMIN`) |
| `status` | UserStatus | `@default(ACTIVE)` | Account status (`ACTIVE`, `BLOCKED`) |
| `permissions` | String[] | | Granular permission flags |
| `slug` | String? | | Unique author vanity URL slug |
| `bio` | String? | `@db.Text` | Author biography / summary |
| `designation` | String? | | Job title / designation |
| `coverImage` | String? | | Author profile banner image |
| `socialLinks` | Json? | | JSON object holding social media handles |
| `expertise` | String[] | `@default([])` | Array of author expertise tags |
| `createdAt` / `updatedAt`| DateTime | | Timestamps |

### 2. `Post`
Core content entity holding blog posts, SEO metadata, featured images, and review status.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(cuid())` | Unique post identifier |
| `title` | String | | Post title |
| `slug` | String | `@unique` | Unique URL slug |
| `content` | String | `@db.Text` | Tiptap HTML content string |
| `excerpt` | String? | `@db.Text` | Short summary for cards and meta descriptions |
| `featuredImage` | String? | | Main banner image URL |
| `featuredImageAlt`| String? | | Alt text for accessibility |
| `playImage` | String? | | Secondary video/play overlay image |
| `status` | PostStatus | `@default(DRAFT)` | Review lifecycle state |
| `adminRemarks` | String? | `@db.Text` | Feedback from Admin upon rejection |
| `metaTitle` | String? | | SEO title override |
| `metaDescription`| String? | | SEO meta description |
| `focusKeyword` | String? | | Target SEO keyword |
| `scheduledAt` | DateTime? | | Optional publishing schedule time |
| `viewCount` | Int | `@default(0)` | Cumulative page view count |
| `authorId` | String | | Foreign key to `User` |

### 3. `Category` & `Tag`
- **`Category`**: `id`, `name`, `slug` (`@unique`), `description`. (Has many-to-many relationship with `Post`).
- **`Tag`**: `id`, `name`, `slug` (`@unique`). (Has many-to-many relationship with `Post`).

### 4. `Comment`
Nested discussion comments on posts with self-referencing parent/child relationships (`CommentReplies`).

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(cuid())` | Unique comment ID |
| `content` | String | `@db.Text` | Comment body |
| `postId` | String | | Relation to `Post` |
| `authorId` | String | | Relation to `User` |
| `parentId` | String? | | Relation to parent `Comment` for threaded replies |
| `isApproved` | Boolean | `@default(false)` | Moderation status |

### 5. `Media`, `Subscriber`, `ContactMessage`, `GlobalSettings`
- **`Media`**: Tracks media library uploads with `url`, `altText`, and `uploadedById`.
- **`Subscriber`**: Stores newsletter subscriber emails (`ACTIVE` / `UNSUBSCRIBED`).
- **`ContactMessage`**: Stores submitted contact form entries (`name`, `email`, `subject`, `message`, `isRead`).
- **`GlobalSettings`**: Singleton record (`id = "global"`) storing `siteName`, `seoTitle`, `seoDescription`, and `seoKeywords`.

---

## 🌱 Seeding & Database Migrations

Initial seed data is located in [prisma/seed.ts](file:///c:/Users/Admin/Desktop/nextblog/prisma/seed.ts).

### Running Seed Command
```bash
# Seed default admin user, categories, tags, sample posts, and global settings
pnpm prisma db seed
```
