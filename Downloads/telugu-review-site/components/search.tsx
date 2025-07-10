"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { mockProducts, mockBlogPosts } from "@/lib/mock-data"

interface SearchResult {
  id: string
  title: string
  type: "product" | "blog"
  category: string
  image?: string
  price?: number
  rating?: number
  excerpt?: string
}

export function SearchComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = (searchQuery: string) => {
    setLoading(true)

    try {
      // Search products
      const productResults = mockProducts
        .filter(
          (product) =>
            (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.review && product.review.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
        .map((product) => ({
          id: product.id,
          title: product.name,
          type: "product" as const,
          category: product.category,
          image: product.images && product.images[0],
          price: product.price,
          rating: product.rating,
        }))

      // Search blog posts
      const blogResults = mockBlogPosts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 3)
        .map((post) => ({
          id: post.id,
          title: post.title,
          type: "blog" as const,
          category: post.category,
          image: post.image,
          excerpt: post.excerpt,
        }))

      setResults([...productResults, ...blogResults])
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <Input
          placeholder="Search products, reviews..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-64"
        />
        <Button variant="ghost" size="sm" className="ml-2" onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Search Results</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            )}

            {!loading && results.length === 0 && query.length >= 2 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>No results found for "{query}"</p>
                <Button variant="link" onClick={handleSearch} className="mt-2">
                  Search all results
                </Button>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-3">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.type === "product" ? `/review/${result.id}` : `/blog/${result.id}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                      {result.image && (
                        <Image
                          src={result.image || "/placeholder.svg"}
                          alt={result.title}
                          width={50}
                          height={50}
                          className="rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{result.title}</h4>
                        <p className="text-xs text-muted-foreground">{result.category}</p>
                        {result.type === "product" && result.price && (
                          <p className="text-xs font-semibold text-green-600">₹{result.price.toLocaleString()}</p>
                        )}
                        {result.type === "blog" && result.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{result.excerpt}</p>
                        )}
                      </div>
                      <Badge variant={result.type === "product" ? "default" : "secondary"}>{result.type}</Badge>
                    </div>
                  </Link>
                ))}

                <div className="text-center pt-2 border-t">
                  <Button variant="link" size="sm" onClick={handleSearch}>
                    View all results for "{query}"
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
