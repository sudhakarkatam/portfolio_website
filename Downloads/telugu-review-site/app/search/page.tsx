"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProducts, mockCategories } from "@/lib/mock-data"

function SearchResults() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      setQuery(searchQuery)
      performSearch(searchQuery)
    }
  }, [searchParams])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Simulate search across products
      const productResults = mockProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setResults(productResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResults =
    filter === "all" ? results : results.filter((product) => product.category.toLowerCase() === filter.toLowerCase())

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Search Results</h1>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                onKeyPress={(e) => e.key === "Enter" && performSearch(query)}
              />
              <Button onClick={() => performSearch(query)}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {query && (
              <p className="text-muted-foreground mt-4">
                Search results for: <strong>"{query}"</strong>
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-8">
            <Filter className="w-4 h-4" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Searching...</p>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-muted-foreground">Found {filteredResults.length} results</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 left-2">{product.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/review/${product.id}`}>View Product</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredResults.length === 0 && query && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search terms or browse our categories</p>
                  <Button asChild>
                    <Link href="/categories">Browse Categories</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  )
}
