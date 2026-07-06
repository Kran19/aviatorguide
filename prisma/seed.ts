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

  // 2. Create Gaming Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "eSports", slug: "esports", description: "Competitive gaming and tournaments." } }),
    prisma.category.create({ data: { name: "RPGs", slug: "rpgs", description: "Role-playing games." } }),
    prisma.category.create({ data: { name: "FPS", slug: "fps", description: "First-person shooters." } }),
    prisma.category.create({ data: { name: "Reviews", slug: "reviews", description: "In-depth game reviews." } }),
  ])
  console.log(`Created ${categories.length} categories.`)

  // 3. Create 5 Gaming Posts
  const postsData = [
    {
      title: "The Rise of Valorant in eSports",
      slug: "rise-of-valorant-esports",
      excerpt: "How Riot's tactical shooter took over the competitive gaming scene.",
      content: "Valorant has seen unprecedented growth since its release in 2020. The combination of precise gunplay and unique agent abilities has created a compelling viewing experience for eSports fans worldwide. The VCT (Valorant Champions Tour) has consistently broken viewership records, proving that tactical shooters still have a massive place in modern gaming.",
      featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      categoryId: categories[0].id,
    },
    {
      title: "Top 5 Upcoming RPGs in 2026",
      slug: "top-5-upcoming-rpgs-2026",
      excerpt: "Get ready for a massive year in role-playing games. Here are our top picks.",
      content: "2026 is shaping up to be a legendary year for RPG fans. With massive open worlds, deep narrative choices, and next-gen graphics, here are the top 5 games you need to look out for:\n\n1. Cyber-Odyssey\n2. The Elder Scrolls VI\n3. Chrono Rebirth\n4. Space Explorers\n5. Fantasy Kingdom V",
      featuredImage: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      categoryId: categories[1].id,
    },
    {
      title: "Review: The New Doom Experience",
      slug: "review-new-doom-experience",
      excerpt: "Fast, brutal, and incredibly satisfying. Our thoughts on the latest Doom iteration.",
      content: "The latest Doom title takes everything we loved about the 2016 reboot and dials it up to eleven. The pacing is frantic, the music is heavy, and the demon-slaying action has never felt better. It's a masterclass in FPS design that keeps you in the \"fun zone\" constantly.",
      featuredImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      categoryId: categories[3].id,
    },
    {
      title: "How to Improve Your Aim in CS2",
      slug: "how-to-improve-aim-cs2",
      excerpt: "Practical tips and training routines to rank up in Counter-Strike 2.",
      content: "Aiming in CS2 isn't just about reflexes; it's about crosshair placement, movement, and map knowledge. In this guide, we break down the best workshop maps for practice and the daily routines used by professional players to keep their aim crisp.",
      featuredImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      categoryId: categories[2].id,
    },
    {
      title: "The Evolution of Indie Games",
      slug: "evolution-of-indie-games",
      excerpt: "How small studios are pushing the boundaries of creativity and game design.",
      content: "Over the last decade, indie games have transformed from niche passion projects to industry-leading masterpieces. Games like Hollow Knight, Hades, and Celeste have proven that you don't need a massive AAA budget to deliver a profound and polished gaming experience.",
      featuredImage: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      categoryId: categories[1].id,
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
