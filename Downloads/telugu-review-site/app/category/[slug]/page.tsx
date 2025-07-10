"use client"

import React, { useState } from "react"
import { Star, Grid, List, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProducts, mockCategories } from "@/lib/mock-data"

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("rating")
  const [priceFilter, setPriceFilter] = useState("all")

  // Find category by slug
  const category = mockCategories.find((cat) => cat.slug === slug) || mockCategories[0]

  // Filter products by category
  let categoryProducts = mockProducts.filter(
    (product) =>
      product.category.toLowerCase().includes(category.name.toLowerCase()) ||
      category.name.toLowerCase().includes(product.category.toLowerCase()),
  )

  // Add more mock products for demonstration
  if (categoryProducts.length < 6) {
    const additionalProducts = Array.from({ length: 6 - categoryProducts.length }, (_, i) => ({
      ...mockProducts[0],
      id: `${category.slug}-${i + 1}`,
      title: `${category.name} Product ${i + 1}`,
      description: `High-quality ${category.name.toLowerCase()} with excellent features and performance`,
      price: 5000 + i * 2000,
      originalPrice: 7000 + i * 2500,
      rating: 4.0 + i * 0.1,
    }))
    categoryProducts = [...categoryProducts, ...additionalProducts]
  }

  // Apply filters
  if (priceFilter !== "all") {
    const [min, max] = priceFilter.split("-").map(Number)
    categoryProducts = categoryProducts.filter((product) => {
      if (max) return product.price >= min && product.price <= max
      return product.price >= min
    })
  }

  // Apply sorting
  categoryProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="text-muted-foreground hover:text-primary">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <span>{category.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">📦</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{categoryProducts.length} products available</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-medium">Filters:</span>
            </div>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-5000">Under ₹5,000</SelectItem>
                <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                <SelectItem value="15000-50000">₹15,000 - ₹50,000</SelectItem>
                <SelectItem value="50000">Above ₹50,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {categoryProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`${viewMode === "list" ? "flex" : ""}`}>
                <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                  <Image
                    src={(product.images && product.images[0]) || product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className={`object-cover ${viewMode === "list" ? "w-full h-48" : "w-full h-48"}`}
                  />
                  <Badge className="absolute top-2 left-2 bg-blue-600">{category.name}</Badge>
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    {product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0}% OFF
                  </Badge>
                </div>

                <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    {/* Product description not in Product type, so skip or fallback */}
                    {/* <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p> */}

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{product.rating}/5</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      {product.pros.slice(0, 2).map((pro, index) => (
                        <div key={index} className="text-sm text-green-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                          {pro}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/review/${product.id}`}>Read Review</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                          Buy Now
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  )
}
