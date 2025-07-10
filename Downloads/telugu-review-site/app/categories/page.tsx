import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCategories, mockProducts } from "@/lib/mock-data"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive collection of product reviews organized by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {/* Remove category.count, use a placeholder */}
                    Products
                  </Badge>
                  <p className="text-muted-foreground text-sm">
                    Discover the best {category.name.toLowerCase()} with detailed reviews and comparisons
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Featured Products by Category */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Products by Category</h2>
            <p className="text-muted-foreground">Top-rated products from each category</p>
          </div>

          {mockCategories.slice(0, 3).map((category) => {
            const categoryProducts = mockProducts
              .filter(
                (p) =>
                  p.category.toLowerCase().includes(category.name.toLowerCase()) ||
                  category.name.toLowerCase().includes(p.category.toLowerCase()),
              )
              .slice(0, 3)

            if (categoryProducts.length === 0) return null

            return (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">📦</span>
                    {category.name}
                  </h3>
                  <Button variant="outline" asChild>
                    <Link href={`/category/${category.slug}`}>View All</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <Image
                          src={(product.images && product.images[0]) || product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-600">
                          {product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0}% OFF
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-2 line-clamp-2">{product.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/review/${product.id}`}>View Review</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                              Buy Now
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
