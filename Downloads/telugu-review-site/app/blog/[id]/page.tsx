"use client"

import React, { useState, useEffect } from "react"
import { Calendar, User, Clock, Tag, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getBlogPostById, getBlogPosts } from "@/lib/mock-data"
import { SocialShare } from "@/components/social-share"
import { CommentsSection } from "@/components/comments-section"

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [currentPost, setCurrentPost] = useState(() => getBlogPostById(id))
  const [relatedPosts, setRelatedPosts] = useState(() => getBlogPosts().slice(0, 3))

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPost = getBlogPostById(id)
      if (updatedPost) {
        setCurrentPost(updatedPost)
      }
      setRelatedPosts(getBlogPosts().slice(0, 3))
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [id])

  // Listen for storage changes (real-time updates from admin)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPost = getBlogPostById(id)
      if (updatedPost) {
        setCurrentPost(updatedPost)
      }
      setRelatedPosts(getBlogPosts().slice(0, 3))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [id])

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="text-muted-foreground hover:text-primary">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span>{currentPost.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article>
              {/* Header */}
              <div className="mb-8">
                <Badge className="mb-4">{currentPost.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentPost.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{currentPost.excerpt}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{currentPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(currentPost.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentPost.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <SocialShare
                    title={currentPost.title}
                    url={`${typeof window !== "undefined" ? window.location.origin : ""}/blog/${currentPost.id}`}
                    description={currentPost.excerpt}
                  />
                </div>
              </div>

              {/* Featured Image */}
              {currentPost.image && (
                <div className="mb-8">
                  <Image
                    src={currentPost.image || "/placeholder.svg"}
                    alt={currentPost.title}
                    width={800}
                    height={400}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-gray max-w-none mb-12">
                <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
              </div>

              {/* Tags */}
              {currentPost.tags && currentPost.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPost.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="mb-8" />

              {/* Author Bio */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {currentPost.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">About {currentPost.author}</h3>
                      <p className="text-muted-foreground">
                        {currentPost.author} is a technology expert and product reviewer with over 5 years of experience
                        in testing and reviewing consumer electronics and gadgets.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <CommentsSection blogPostId={currentPost.id} type="blog" />
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <div className="flex gap-3 hover:bg-muted p-2 rounded-lg transition-colors">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          width={60}
                          height={60}
                          className="rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">{relatedPost.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(relatedPost.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {["Technology", "Home & Living", "Kitchen", "Safety", "Reviews"].map((category) => (
                    <Link key={category} href={`/blog?category=${category.toLowerCase()}`}>
                      <div className="flex items-center justify-between hover:bg-muted p-2 rounded transition-colors">
                        <span className="text-sm">{category}</span>
                        <Badge variant="secondary">{Math.floor(Math.random() * 20) + 5}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest reviews and tech news delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input type="email" placeholder="Your email" className="w-full px-3 py-2 border rounded-md text-sm" />
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
