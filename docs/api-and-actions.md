# Server Actions & API Routes

NextBlog uses Next.js Server Actions for data mutations and standard REST API endpoints for authentication and file delivery.

---

## ⚡ Server Actions (`src/actions/`)

All server actions are located in `src/actions/` and execute on the server with full access to Prisma ORM and NextAuth sessions.

### 1. User Actions ([src/actions/user.actions.ts](file:///c:/Users/Admin/Desktop/nextblog/src/actions/user.actions.ts))

| Action Function | Parameters | Permissions | Description |
| :--- | :--- | :--- | :--- |
| `createUserAction(data)` | `name`, `email`, `password`, `role` | `ADMIN` | Creates a new user with bcrypt-hashed password. |
| `updateUserAction(id, data)` | `id`, `name`, `email`, `role`, `status` | `ADMIN` | Updates user details or toggles account status (`ACTIVE` / `BLOCKED`). |
| `deleteUserAction(id)` | `id` | `ADMIN` | Deletes a user record. |
| `toggleUserStatusAction(id)` | `id` | `ADMIN` | Quick action to switch user status between `ACTIVE` and `BLOCKED`. |

---

### 2. Post Actions ([src/actions/post.actions.ts](file:///c:/Users/Admin/Desktop/nextblog/src/actions/post.actions.ts))

| Action Function | Parameters | Permissions | Description |
| :--- | :--- | :--- | :--- |
| `createPostAction(data)` | Post fields | Auth User | Creates a new post in `DRAFT` or `PENDING_APPROVAL` status. |
| `updatePostAction(id, data)` | `id`, Post fields | Author/Admin | Updates post content, title, excerpt, tags, or status. |
| `updatePostStatusAction(id, status, remarks)` | `id`, `PostStatus`, `adminRemarks` | `ADMIN` | Updates review status (e.g. approve to `PUBLISHED` or reject with `remarks`). |
| `deletePostAction(id)` | `id` | Author/Admin | Deletes a post record from database. |

---

### 3. Category Actions ([src/actions/category.actions.ts](file:///c:/Users/Admin/Desktop/nextblog/src/actions/category.actions.ts))

| Action Function | Parameters | Permissions | Description |
| :--- | :--- | :--- | :--- |
| `createCategoryAction(data)` | `name`, `slug`, `description` | `ADMIN` | Creates a new blog category. |
| `updateCategoryAction(id, data)` | `id`, category fields | `ADMIN` | Modifies existing category parameters. |
| `deleteCategoryAction(id)` | `id` | `ADMIN` | Deletes a category. |

---

### 4. Profile Actions ([src/actions/profile.actions.ts](file:///c:/Users/Admin/Desktop/nextblog/src/actions/profile.actions.ts))

| Action Function | Parameters | Permissions | Description |
| :--- | :--- | :--- | :--- |
| `updateProfileAction(data)` | `name`, `bio`, `designation`, `image`, `coverImage`, `socialLinks`, `expertise` | Auth User | Updates the authenticated user's public author profile. |

---

### 5. Settings Actions ([src/actions/settings.actions.ts](file:///c:/Users/Admin/Desktop/nextblog/src/actions/settings.actions.ts))

| Action Function | Parameters | Permissions | Description |
| :--- | :--- | :--- | :--- |
| `updateGlobalSettingsAction(data)` | `siteName`, `seoTitle`, `seoDescription`, `seoKeywords` | `ADMIN` | Upserts the singleton global configuration record in `GlobalSettings`. |

---

## 🌐 API Routes (`src/app/api/`)

### 1. NextAuth Endpoint (`/api/auth/[...nextauth]`)
- Location: `src/app/api/auth/[...nextauth]/route.ts`
- Handled by Auth.js `handlers.GET` and `handlers.POST`. Handles sign-in, session verification, and sign-out routes.

### 2. Media Upload & Serving (`/api/upload` and `/api/media/[...path]`)
- **Upload Route** (`src/app/api/upload/route.ts`): Accepts `multipart/form-data` image uploads, stores them in `public/uploads/` (or mounted volume), and creates a record in the `Media` database table.
- **Media Rewrite Route** (`src/app/api/media/[...path]/route.ts`): Stream uploads out to clients. Configured with rewrite rule in `next.config.ts`:
  ```ts
  async rewrites() {
    return [{ source: '/media/:path*', destination: '/api/media/:path*' }]
  }
  ```
