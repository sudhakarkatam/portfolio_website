import { supabase } from "@/lib/supabase"

// Mock blog posts for development
const mockBlogPosts = [
  {
    id: "1",
    title: "Top 10 Smartphones to Buy in 2024",
    excerpt: "We have reviewed the best smartphones that hit the market this year",
    created_at: "2024-01-15T10:30:00Z",
    author: "Ravi Kumar",
    category: "Technology",
  },
  {
    id: "2",
    title: "Things to Consider When Buying Home Appliances",
    excerpt: "Important tips to help you choose the right appliances for your home",
    created_at: "2024-01-12T15:45:00Z",
    author: "Sudha Reddy",
    category: "Home & Living",
  },
]

export async function GET() {
  try {
    let blogPosts = mockBlogPosts

    // Check if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(20)

      if (data && data.length > 0) {
        blogPosts = data
      }
    }

    const rssItems = blogPosts
      .map(
        (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.excerpt}]]></description>
        <link>https://your-domain.com/blog/${post.id}</link>
        <guid>https://your-domain.com/blog/${post.id}</guid>
        <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
        <author>${post.author}</author>
        <category>${post.category}</category>
      </item>
    `,
      )
      .join("")

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Telugu Review Hub - తెలుగు రివ్యూ హబ్</title>
    <description>Find the best product reviews in Telugu</description>
    <link>https://your-domain.com</link>
    <language>te</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://your-domain.com/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("RSS generation error:", error)

    // Return a basic RSS feed on error
    const basicRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Telugu Review Hub - తెలుగు రివ్యూ హబ్</title>
    <description>Find the best product reviews in Telugu</description>
    <link>https://your-domain.com</link>
    <language>te</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`

    return new Response(basicRssXml, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  }
}
