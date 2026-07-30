# Component System & Rich Text Editor

NextBlog features a modular component hierarchy divided into **Editor**, **Home/Hero**, **Layout**, **Blog**, and **Shadcn UI** component suites.

---

## ✏️ Rich Text Editor (`src/components/editor`)

The core editing workspace is built on **Tiptap v3** and integrates custom extensions and media management modals.

```
RichTextEditor.tsx
├── Tiptap StarterKit Extensions
├── Table Extension (@tiptap/extension-table)
├── Custom Extensions:
│   ├── CustomImage.tsx      (Handles image alignment, captions, alt text)
│   └── InlineHeading.ts     (Formats inline headings seamlessly)
└── MediaLibraryModal.tsx    (Selects or uploads media directly from editor)
```

### Key Components

1. **`RichTextEditor.tsx`**:
   - Manages editor toolbar (Headings, Bold, Italic, Strikethrough, Text Alignment, Lists, Quotes, Tables, Links, and Media insertion).
   - Syncs content changes to parent React forms.

2. **`CustomImage.tsx`**:
   - Custom Tiptap Node extension rendering responsive HTML images.
   - Supports caption editing, alignment toggles (left, center, right), and alt text specification.

3. **`InlineHeading.ts`**:
   - Tailored heading node allowing inline editing without breaking block layouts.

4. **`MediaLibraryModal.tsx`**:
   - Embedded dialog allowing authors to choose existing uploaded images from `src/app/api/media` or upload new images on the fly.

---

## 🎨 Hero & Animation Components (`src/components/home`)

The homepage features high-impact interactive visuals powered by **GSAP**, **Framer Motion**, and **Lenis**.

```
src/components/home/
├── Hero.tsx                     # Main Hero Section wrapper
├── HeroContent.tsx              # Typography, action buttons, and animated badges
├── CardWall.tsx                 # Dynamic grid wall of blog post feature cards
├── CasinoCard.tsx               # Animated interactive card component
├── FloatingParticles.tsx        # HTML5 Canvas particle system powered by GSAP
├── GlowBackground.tsx           # Radial ambient lighting overlay
└── hero/
    ├── FloatingParticles.tsx    # Sub-component particle canvas
    ├── GradientBackground.tsx   # Custom CSS gradient animation container
    ├── HeroColumns.tsx          # Multi-column animated layout
    └── PortraitColumn.tsx       # Vertical scrolling image marquee
```

### Motion Libraries Used

- **GSAP (`gsap`)**: Drives frame-rate optimized canvas particle math in `FloatingParticles.tsx`.
- **Framer Motion (`framer-motion`)**: Manages UI state transitions, card hover physics, and staggered entrances.
- **Lenis (`lenis`)**: Delivers smooth kinetic momentum scrolling across web views.

---

## 🧩 Layout & Shared Components (`src/components/layout` & `src/components/blog`)

### 1. Layout (`src/components/layout`)
- **`Header.tsx`**: Navigation header with brand logo, main navigation links, search trigger, theme switcher, and mobile drawer.
- **`Footer.tsx`**: Site footer with category links, newsletter subscription form, copyright info, and legal links.

### 2. Blog Components (`src/components/blog`)
- **`AuthorCard.tsx`**: Displays author avatar, designation, bio, social media handles, and expertise badges.
- **`FAQSection.tsx`**: Accordion component displaying common reader questions.

### 3. Theme & UI (`src/components/`)
- **`theme-provider.tsx`**: Wrapper around `next-themes` enforcing system dark/light modes.
- **`theme-toggle.tsx`**: Animated toggle button switching between light, dark, and system color themes.
- **`ui/`**: Base UI component primitives built with Tailwind CSS and Radix/Base UI (Button, Input, Dialog, Dropdown, Table, Modal).
