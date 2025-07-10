import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://your-domain.com"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best-of`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Return only static pages for development
      return staticPages
    }

    // Dynamic product pages
    const { data: products } = await supabase.from("products").select("id, updated_at")

    const productPages = (products || []).map((product) => ({
      url: `${baseUrl}/review/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    // Dynamic blog pages
    const { data: blogPosts } = await supabase.from("blog_posts").select("id, updated_at").eq("published", true)

    const blogPages = (blogPosts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    return [...staticPages, ...productPages, ...blogPages]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    // Return only static pages on error
    return staticPages
  }
}
