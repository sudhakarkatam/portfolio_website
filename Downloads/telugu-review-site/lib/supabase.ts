import { createClient } from "@supabase/supabase-js"

const supabaseUrl ="https://hefrfwwaiaygewshqdou.supabase.co"
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZnJmd3dhaWF5Z2V3c2hxZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjY3NDcsImV4cCI6MjA2NzY0Mjc0N30.EL3RHMG7qFwhQ1o7eSppGg3SN5cVPREzC60bnsAOXzE"

// Create a mock client for development when Supabase is not configured
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase not configured. Using mock client.")

    return {
      from: (table: string) => ({
        select: (columns?: string) => ({
          data: [],
          error: null,
          eq: () => ({ data: [], error: null }),
          or: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null }),
          limit: () => ({ data: [], error: null }),
        }),
        insert: (data: any) => ({ data: null, error: null }),
        update: (data: any) => ({
          eq: () => ({ data: null, error: null }),
        }),
        delete: () => ({
          eq: () => ({ data: null, error: null }),
        }),
      }),
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          title_te: string
          description: string
          description_te: string
          price: number
          original_price: number
          rating: number
          category: string
          category_te: string
          brand: string
          model: string
          affiliate_link: string
          youtube_video: string | null
          images: string[]
          pros: string[]
          cons: string[]
          specifications: Record<string, string>
          content: string
          content_te: string
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_te: string
          description: string
          description_te: string
          price: number
          original_price: number
          rating: number
          category: string
          category_te: string
          brand: string
          model: string
          affiliate_link: string
          youtube_video?: string | null
          images: string[]
          pros: string[]
          cons: string[]
          specifications: Record<string, string>
          content: string
          content_te: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_te?: string
          description?: string
          description_te?: string
          price?: number
          original_price?: number
          rating?: number
          category?: string
          category_te?: string
          brand?: string
          model?: string
          affiliate_link?: string
          youtube_video?: string | null
          images?: string[]
          pros?: string[]
          cons?: string[]
          specifications?: Record<string, string>
          content?: string
          content_te?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          title_te: string
          slug: string
          excerpt: string
          excerpt_te: string
          content: string
          content_te: string
          image: string
          author: string
          author_te: string
          category: string
          category_te: string
          tags: string[]
          published: boolean
          featured: boolean
          read_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_te: string
          slug: string
          excerpt: string
          excerpt_te: string
          content: string
          content_te: string
          image: string
          author: string
          author_te: string
          category: string
          category_te: string
          tags: string[]
          published?: boolean
          featured?: boolean
          read_time: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_te?: string
          slug?: string
          excerpt?: string
          excerpt_te?: string
          content?: string
          content_te?: string
          image?: string
          author?: string
          author_te?: string
          category?: string
          category_te?: string
          tags?: string[]
          published?: boolean
          featured?: boolean
          read_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          product_id: string | null
          blog_post_id: string | null
          user_name: string
          user_email: string
          comment: string
          rating: number | null
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          blog_post_id?: string | null
          user_name: string
          user_email: string
          comment: string
          rating?: number | null
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          blog_post_id?: string | null
          user_name?: string
          user_email?: string
          comment?: string
          rating?: number | null
          approved?: boolean
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          subscribed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscribed?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          name_te: string
          slug: string
          description: string
          description_te: string
          icon: string
          product_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_te: string
          slug: string
          description: string
          description_te: string
          icon: string
          product_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_te?: string
          slug?: string
          description?: string
          description_te?: string
          icon?: string
          product_count?: number
          created_at?: string
        }
      }
    }
  }
}
