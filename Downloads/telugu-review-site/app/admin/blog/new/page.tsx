"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { addBlogPost, BlogPost } from "@/lib/mock-data"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const blogPostData: Omit<BlogPost, 'id'> = {
        title: formData.get("title") as string,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as string,
        image: (formData.get("image") as string) || "/placeholder.svg",
        author: formData.get("author") as string,
        publishedAt: new Date().toISOString(),
        readTime: formData.get("readTime") as string,
        views: 0,
        tags: tags.length > 0 ? tags : undefined,
      }

      // addBlogPost expects Omit<BlogPost, 'id'>
      addBlogPost(blogPostData)
      router.push("/admin")
    } catch (error) {
      console.error("Error creating blog post:", error)
      alert("Error creating blog post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i: number) => i !== index))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  placeholder="Brief description of the blog post..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product Reviews">Product Reviews</SelectItem>
                      <SelectItem value="Buying Guides">Buying Guides</SelectItem>
                      <SelectItem value="Comparisons">Comparisons</SelectItem>
                      <SelectItem value="Tech News">Tech News</SelectItem>
                      <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                      <SelectItem value="Deals & Offers">Deals & Offers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input id="author" name="author" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time *</Label>
                  <Input id="readTime" name="readTime" placeholder="e.g., 5 min read" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input id="image" name="image" type="url" placeholder="https://example.com/image.jpg" />
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                    placeholder="Enter a tag"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge key={"tag-" + index} variant="secondary" className="flex items-center gap-2">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={15}
                  placeholder="Write your blog post content in HTML format..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Blog Post"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
