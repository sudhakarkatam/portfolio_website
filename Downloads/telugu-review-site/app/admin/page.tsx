"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, TrendingUp, Users, FileText, Package, RefreshCw, Calendar } from "lucide-react"
import Link from "next/link"
import { getProducts, getBlogPosts, deleteProduct, deleteBlogPost, Product, BlogPost } from "@/lib/mock-data"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadData = () => {
    setProducts(getProducts())
    setBlogPosts(getBlogPosts())
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
    setTimeout(() => setRefreshing(false), 500)
  }

  useEffect(() => {
    loadData()

    // Set up interval to check for updates every 5 minutes
    const interval = setInterval(() => {
      loadData()
    }, 300000) // 300000ms = 5 minutes

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "review_site_products" || e.key === "review_site_blog_posts") {
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
      loadData()
    }
  }

  const handleDeleteBlogPost = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPost(id)
      loadData()
    }
  }

  const todayProducts = products.filter((p) => {
    const today = new Date().toDateString()
    const productDate = new Date(p.createdAt || "").toDateString()
    return today === productDate
  })

  const todayBlogPosts = blogPosts.filter((p) => {
    const today = new Date().toDateString()
    const postDate = new Date(p.publishedAt || "").toDateString()
    return today === postDate
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and blog posts</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              {todayProducts.length > 0 && (
                <Badge variant="secondary" className="mt-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {todayProducts.length} new today
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              {todayBlogPosts.length > 0 && (
                <Badge variant="secondary" className="mt-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {todayBlogPosts.length} new today
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.length > 0
                  ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
                  : "0.0"}
              </div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {blogPosts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Blog post views</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Products ({products.length})
                </CardTitle>
                <Button asChild>
                  <Link href="/admin/products/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No products yet</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium line-clamp-1">{product.name}</h3>
                          {todayProducts.some((p) => p.id === product.id) && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{product.category}</span>
                          <span>₹{product.price.toLocaleString()}</span>
                          <span>⭐ {product.rating}</span>
                          {product.platform && (
                            <Badge variant="outline" className="text-xs">
                              {product.platform}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/review/${product.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Posts ({blogPosts.length})
                </CardTitle>
                <Button asChild>
                  <Link href="/admin/blog/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Post
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {blogPosts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No blog posts yet</p>
                ) : (
                  blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium line-clamp-1">{post.title}</h3>
                          {todayBlogPosts.some((p) => p.id === post.id) && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{post.category}</span>
                          <span>{post.readTime}</span>
                          <span>{post.views || 0} views</span>
                          <span>By {post.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/blog/${post.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteBlogPost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
