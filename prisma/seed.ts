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
      name: "Admin User",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("Admin user created: admin@betsetgo.xyz (password123)")

  // 2. Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Guides", slug: "guides", description: "In-depth game guides and strategies." } }),
    prisma.category.create({ data: { name: "Sports game", slug: "sports-game", description: "Sports game previews, schedules, and reviews." } }),
    prisma.category.create({ data: { name: "News", slug: "news", description: "Latest esports and gaming industry news." } }),
    prisma.category.create({ data: { name: "Crash game", slug: "crash-game", description: "Top crash games, mechanics, and winning tips." } }),
    prisma.category.create({ data: { name: "Fashion & Lifestyle", slug: "fashion", description: "Trending clothing brands and lifestyle guides." } }),
  ])
  console.log(`Created ${categories.length} categories.`)

  // 3. Create Posts Data (All original posts restored + Clothing Brands SEO redirect blog)
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
      categoryId: categories[4].id,
    },
    {
      title: "Chicken Crossy Game Guide: How to Play, Rules, Betting Strategy & Winning Tips",
      slug: "chicken-crossy-game-guide",
      excerpt: "Chicken Crossy is a fast-paced, multiplier-based betting game where a chicken crosses busy lanes, and each safe step pushes your reward multiplier higher.",
      content: "<h2>Chicken Crossy Game Overview</h2><p>Chicken Crossy has quickly become one of the most thrilling crash-style arcade games in online gaming. In this game, players navigate a chicken across increasingly dangerous obstacle lanes. Every successful crossing increases your payout multiplier.</p><h2>Rules & Gameplay Mechanics</h2><p>1. Place your base wager before the chicken starts moving.<br/>2. Decide when to cash out—either early for safe wins or push further for massive multiplier rewards.<br/>3. Be careful! Hitting an oncoming vehicle or trap ends the round immediately.</p><h2>Winning Strategies & Bankroll Tips</h2><p>To maximize profits, utilize a conservative cashout strategy at 1.5x to 2.0x multipliers while keeping your wagers capped at 2% of your total bankroll.</p>",
      featuredImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[0].id,
    },
    {
      title: "Types of Cricket Balls: Which Ball Is Used Where and Why",
      slug: "types-of-cricket-balls-white-red-pink",
      excerpt: "A cricket ball looks like a simple red or white ball, yet it quietly shapes how a match unfolds. Swing, bounce, spin, even the final result can hinge on the ball selection.",
      content: "<h2>Red, White, and Pink Cricket Balls Explained</h2><p>Cricket employs three distinct ball types depending on the match format, pitch conditions, and day/night schedules.</p><h3>1. The Red Cricket Ball</h3><p>Used in traditional Test cricket. The red leather retains its seam hardness and enables reverse swing over extended 80-over periods.</p><h3>2. The White Cricket Ball</h3><p>Standard for One Day Internationals (ODIs) and T20 matches. Provides high visibility under stadium floodlights and offers early seam movement.</p><h3>3. The Pink Cricket Ball</h3><p>Engineered specifically for Day/Night Test matches. Uses a pink pigment lacquer to remain clearly visible during twilight transitions.</p>",
      featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[1].id,
    },
    {
      title: "T20 World Cup 2028 New Format: Everything That's Changed",
      slug: "t20-world-cup-2028-new-format",
      excerpt: "The ICC has confirmed the T20 World Cup 2028 new format, introducing major structural changes to team groupings and knockout qualification.",
      content: "<h2>ICC T20 World Cup 2028 Format Overhaul</h2><p>The International Cricket Council (ICC) approved a streamlined tournament structure for the 2028 T20 World Cup. Featuring 20 participating nations divided into 4 initial groups of 5 teams each.</p><h2>Super 8 & Semi-Final Qualification</h2><p>The top two teams from each group advance directly into the Super 8 phase, ensuring intense high-stakes clashes before the knockout semi-finals.</p>",
      featuredImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[2].id,
    },
    {
      title: "Best Crash Games 2026: Aviator, Chicken Crossy & More",
      slug: "best-crash-games-2026",
      excerpt: "Crash games have quietly become one of the most-searched categories in online gaming. Here is our ranking of the top crash games in 2026.",
      content: "<h2>Top Crash Games of 2026</h2><p>Crash games offer rapid rounds, transparent provably-fair algorithms, and high RTP percentages. Here are the top titles dominating 2026:</p><ul><li><strong>Aviator</strong>: The pioneer of multiplier flight mechanics.</li><li><strong>Chicken Crossy</strong>: Arcade-style lane crossing with scaling payouts.</li><li><strong>JetX</strong>: High-speed rocket launch multiplier.</li></ul>",
      featuredImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[3].id,
    },
    {
      title: "ODI World Cup 2027 Format Explained: Super Series, Groups & Super 7",
      slug: "odi-world-cup-2027-format-explained",
      excerpt: "The ICC has officially approved a brand-new ODI World Cup 2027 format, introducing major changes to the Men's 50-over flagship tournament.",
      content: "<h2>2027 Men's ODI World Cup Structure</h2><p>The 2027 Men's Cricket World Cup hosted across South Africa, Zimbabwe, and Namibia will feature 14 teams. The competition format comprises two groups of seven, with the top three in each group advancing to a Super Six stage.</p>",
      featuredImage: "https://images.unsplash.com/photo-1512716676841-9ee9afdf9fdb?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[2].id,
    },
    {
      title: "Rohit Sharma Retirement News: Is It Real or Just Speculation?",
      slug: "rohit-sharma-retirement-news-real-or-fake",
      excerpt: "Rohit Sharma has not officially announced his retirement from international cricket. We analyze the facts behind the recent media headlines.",
      content: "<h2>Sorting Fact From Speculation</h2><p>Recent reports circulating online regarding Rohit Sharma's complete international retirement are unverified speculation. While Rohit stepped back from T20Is following India's 2024 World Cup triumph, he remains active in ODI cricket and Test match captaincy.</p>",
      featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[2].id,
    },
    {
      title: "India vs England 2nd ODI: Preview, Predicted XI & Match Details",
      slug: "india-vs-england-2nd-odi-preview",
      excerpt: "India take a 1-0 lead into their second match of the series after winning the opener in Birmingham. Here is our full match preview.",
      content: "<h2>Match Preview & Pitch Analysis</h2><p>India and England clash at Sophia Gardens in Cardiff for the 2nd ODI. With pitch conditions favoring pace early on, team selection will hinge on extra seam coverage.</p>",
      featuredImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[1].id,
    },
    {
      title: "Aviator Game: How to Play, Rules, Strategy, RTP & Bonuses",
      slug: "aviator-game-how-to-play-rules-strategy",
      excerpt: "What Is the Aviator Game? The Aviator Game is a crash game where the multiplier rises as a plane takes off. Learn how to cash out before the crash.",
      content: "<h2>Complete Aviator Crash Game Guide</h2><p>Aviator is built on a Provably Fair cryptographic algorithm. The multiplier curve begins at 1.00x and can climb up to 10,000x. Players must click Cash Out before the plane flies away.</p>",
      featuredImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[3].id,
    },
    {
      title: "Cricket Betting Guide: Everything You Need to Know",
      slug: "cricket-betting-guide-everything-you-need-to-know",
      excerpt: "Cricket betting has become one of the most popular sports betting markets worldwide. Learn pitch analysis, match odds, and bankroll strategy.",
      content: "<h2>Essential Cricket Betting Fundamentals</h2><p>Understanding pitch reports, weather overheads, toss advantages, and player matchups is crucial for making informed sports wagers.</p>",
      featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000",
      status: 'PUBLISHED' as any,
      redirectEnabled: false,
      redirectUrl: null,
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
  console.log(`Created ${postsData.length} posts successfully.`)

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
