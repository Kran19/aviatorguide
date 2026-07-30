# Admin Dashboard & Role-Based Access Control (RBAC)

The NextBlog Admin Dashboard is housed in the `src/app/(admin)/admin` route group. It provides content management, user administration, post publishing workflows, media organization, and system settings.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

NextBlog distinguishes between **Super Admin (`ADMIN`)** and **Content Author (`AUTHOR`)** roles.

| Feature / Section | Route Path | `ADMIN` Role | `AUTHOR` Role |
| :--- | :--- | :---: | :---: |
| **Dashboard Overview** | `/admin` | ✅ Full Access | ✅ Author Metrics |
| **Post Listing** | `/admin/posts` | ✅ All Posts | 🔒 Own Posts Only |
| **Create / Edit Post** | `/admin/posts/new`, `/admin/posts/[id]` | ✅ Publish / Reject | 📝 Draft / Submit |
| **Category Management** | `/admin/categories` | ✅ Full Management | ❌ Restricted |
| **User Management** | `/admin/users` | ✅ Create / Edit / Block | ❌ Restricted |
| **Media Library** | `/admin/media` | ✅ Full Access | ✅ Upload Own Media |
| **Site Settings** | `/admin/settings` | ✅ Edit Site SEO | ❌ Restricted |
| **My Profile** | `/admin/profile` | ✅ Edit Profile | ✅ Edit Profile |

---

## 🔄 Content Publishing & Review Workflow

```
[Author Creates Post]
        │
        ▼
   Status: DRAFT
        │
  (Submit for Review)
        │
        ▼
Status: PENDING_APPROVAL
        │
        ├──────────────────────────┐
        ▼                          ▼
 [Admin Approves]           [Admin Rejects]
        │                          │
        ▼                          ▼
Status: PUBLISHED           Status: REJECTED
                           (Includes adminRemarks)
```

1. **Drafting**: Authors create articles using the Tiptap rich text editor. The status defaults to `DRAFT`.
2. **Submission**: When ready, the author submits the article. Status changes to `PENDING_APPROVAL`.
3. **Admin Review**: Super Admins review pending posts from `/admin/posts`.
   - **Approve**: Post status is set to `PUBLISHED` and becomes publicly visible.
   - **Reject**: Admin sets status to `REJECTED` and inputs `adminRemarks` to inform the author of required modifications.

---

## 🛠️ Admin Panel Sections & Files

### 1. Dashboard Overview ([src/app/(admin)/admin/page.tsx](file:///c:/Users/Admin/Desktop/nextblog/src/app/(admin)/admin/page.tsx))
Displays high-level metric cards (Total Posts, Views, Active Authors, Categories) and quick activity logs.

### 2. Posts Management ([src/app/(admin)/admin/posts](file:///c:/Users/Admin/Desktop/nextblog/src/app/(admin)/admin/posts))
- `page.tsx`: Paginated table of articles with status filters (`DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`, `REJECTED`).
- `AdminFilters.tsx`: Search bar, category drop-downs, and status quick-filters.
- `PostActions.tsx`: Action drop-down for changing status, editing, or deleting posts.
- `[id]/page.tsx` & `new/page.tsx`: Post creation/editing interface integrating the Rich Text Editor.

### 3. User Management ([src/app/(admin)/admin/users](file:///c:/Users/Admin/Desktop/nextblog/src/app/(admin)/admin/users))
- `page.tsx`: User list featuring role badges, email verification flags, and status toggle buttons.
- `NewUserModal.tsx`: Modal for creating new users (Authors or Admins) with temporary passwords.
- `EditUserModal.tsx`: Modal for updating user roles, profile information, or setting status to `BLOCKED`.

### 4. Categories Management ([src/app/(admin)/admin/categories](file:///c:/Users/Admin/Desktop/nextblog/src/app/(admin)/admin/categories))
- `page.tsx`: Grid view of all blog categories with post counts.
- `new-category-modal.tsx`: Modal for creating categories with automatic slug generation from name input.

### 5. Media Library ([src/app/(admin)/admin/media](file:///c:/Users/Admin/Desktop/nextblog/src/app/(admin)/admin/media))
- `page.tsx`: Visual asset manager supporting file uploads, image URL copying, and media deletion.

### 6. Site Settings ([src/app/(admin)/admin/settings](file:///c:/Users/Admin/Desktop/nextblog/src/app/(admin)/admin/settings))
- `SettingsForm.tsx`: Super Admin control panel for updating global site name, SEO meta titles, meta descriptions, and default keywords.
