import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  console.log("Seeding database...")

  // Clean up existing data
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash("password123", 10)
  const admin = await prisma.user.create({
    data: {
      email: "admin@betsetgo.xyz",
      name: "Gaming Admin",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("Admin user created: admin@betsetgo.xyz (password123)")

  // 2. Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "eSports", slug: "esports", description: "Competitive gaming and tournaments." } }),
    prisma.category.create({ data: { name: "RPGs", slug: "rpgs", description: "Role-playing games." } }),
    prisma.category.create({ data: { name: "FPS", slug: "fps", description: "First-person shooters." } }),
    prisma.category.create({ data: { name: "Fashion & Lifestyle", slug: "fashion", description: "Trending clothing brands and lifestyle guides." } }),
  ])
  console.log(`Created ${categories.length} categories.`)

  // 3. Create Posts
  const postsData = [
    {
      title: "The Ultimate Guide to Clothing Brands 2026: Trends, Luxury & Streetwear",
      slug: "clothing-brands",
      excerpt: "Explore the comprehensive guide to global clothing brands, sustainable fashion, luxury houses, and urban streetwear trends.",
      content: "<p>Discover the top clothing brands shaping global fashion in 2026. From iconic luxury houses to sustainable streetwear collectives, learn how modern style evolves.</p>",
      featuredImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
      status: 'PUBLISHED' as any,
      redirectEnabled: true,
      redirectUrl: "https://rocky11.club/?refercode=SEO",
      metaTitle: "The Ultimate Guide to Clothing Brands 2026 | Trends & Style",
      metaDescription: "Explore top global clothing brands, fast fashion alternatives, luxury streetwear, and sustainable fashion choices in our definitive 2026 guide.",
      focusKeyword: "clothing brands",
      categoryId: categories[3].id,
    },
    {
      title: "The Rise of Valorant in eSports",
      slug: "rise-of-valorant-esports",
      excerpt: "How Riot's tactical shooter took over the competitive gaming scene.",
      content: "Valorant has seen unprecedented growth since its release in 2020.",
      featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[0].id,
    },
  ]

  for (const postData of postsData) {
    const { categoryId, ...data } = postData
    await prisma.post.create({
      data: {
        ...data,
        authorId: admin.id,
        categories: {
          connect: { id: categoryId }
        }
      },
    })
  }
  console.log(`Created ${postsData.length} posts.`)

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
