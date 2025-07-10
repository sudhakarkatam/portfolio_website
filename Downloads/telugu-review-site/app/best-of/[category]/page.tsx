import { Star, Trophy, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockProducts, mockCategories } from "@/lib/mock-data"

export default function BestOfCategoryPage({ params }: { params: { category: string } }) {
  // Find category
  const category = mockCategories.find((cat) => cat.slug === params.category) || mockCategories[0]

  // Get products for this category and create a "best of" list
  let bestProducts = mockProducts.filter(
    (product) =>
      product.category.toLowerCase().includes(category.name.toLowerCase()) ||
      category.name.toLowerCase().includes(product.category.toLowerCase()),
  )

  // Add more products if needed for demonstration
  if (bestProducts.length < 8) {
    const additionalProducts = Array.from({ length: 8 - bestProducts.length }, (_, i) => ({
      ...mockProducts[0],
      id: `best-${category.slug}-${i + 1}`,
      title: `Best ${category.name} Option ${i + 1}`,
      description: `Top-rated ${category.name.toLowerCase()} with excellent value for money`,
      price: 3000 + i * 1500,
      originalPrice: 4000 + i * 2000,
      rating: 4.2 + i * 0.1,
    }))
    bestProducts = [...bestProducts, ...additionalProducts]
  }

  // Sort by rating and take top products
  bestProducts = bestProducts.sort((a, b) => b.rating - a.rating).slice(0, 10)

  const listTitle = `Best ${category.name} in 2024`
  const listDescription = `Our expert team has tested and reviewed the top ${category.name.toLowerCase()} to bring you this comprehensive buying guide.`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/best-of" className="text-muted-foreground hover:text-primary">
            Best Of
          </Link>
          <span className="mx-2">/</span>
          <span>{category.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold">{listTitle}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">{listDescription}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Updated: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>{bestProducts.length} Products Reviewed</span>
            <span>•</span>
            <span>Expert Tested</span>
          </div>
        </div>

        {/* Winner Section */}
        {bestProducts.length > 0 && (
          <Card className="mb-12 overflow-hidden border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader className="text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Award className="w-6 h-6" />🏆 WINNER - Best Overall
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-4">{bestProducts[0].title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{bestProducts[0].description}</p>

                  <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(bestProducts[0].rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{bestProducts[0].rating}/5</span>
                    </div>
                    <Badge className="bg-green-600">Editor's Choice</Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
                    <span className="text-3xl font-bold text-green-600">₹{bestProducts[0].price.toLocaleString()}</span>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{bestProducts[0].originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive">
                      {Math.round((1 - bestProducts[0].price / bestProducts[0].originalPrice) * 100)}% OFF
                    </Badge>
                  </div>

                  <div className="flex gap-4 justify-center lg:justify-start">
                    <Button size="lg" asChild>
                      <Link href={`/review/${bestProducts[0].id}`}>Read Full Review</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href={bestProducts[0].affiliateLink} target="_blank" rel="noopener noreferrer">
                        Buy Now
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Image
                    src={bestProducts[0].images[0] || "/placeholder.svg"}
                    alt={bestProducts[0].title}
                    width={400}
                    height={400}
                    className="rounded-lg shadow-lg mx-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Rankings */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Complete Rankings</h2>

          {bestProducts.map((product, index) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Rank Number */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-orange-600"
                              : "bg-blue-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      </div>
                      {index < 3 && (
                        <Badge
                          className={index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"}
                        >
                          {index === 0 ? "Best Overall" : index === 1 ? "Runner Up" : "Best Value"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
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
                        <span className="font-semibold">{product.rating}/5</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                        <ul className="space-y-1">
                          {product.pros.slice(0, 2).map((pro, proIndex) => (
                            <li key={proIndex} className="text-sm flex items-center gap-2">
                              <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                        <ul className="space-y-1">
                          {product.cons.slice(0, 2).map((con, conIndex) => (
                            <li key={conIndex} className="text-sm flex items-center gap-2">
                              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={`/review/${product.id}`}>Read Full Review</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                          Check Price
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Buying Guide */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Buying Guide: How to Choose the Best {category.name}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              When shopping for {category.name.toLowerCase()}, there are several key factors to consider to ensure you
              make the right choice for your needs and budget.
            </p>

            <h3>Key Features to Look For:</h3>
            <ul>
              <li>
                <strong>Quality and Build:</strong> Look for products with solid construction and quality materials
              </li>
              <li>
                <strong>Performance:</strong> Check specifications and performance benchmarks
              </li>
              <li>
                <strong>Value for Money:</strong> Consider the price-to-performance ratio
              </li>
              <li>
                <strong>Brand Reputation:</strong> Choose from trusted brands with good customer service
              </li>
              <li>
                <strong>Warranty:</strong> Ensure adequate warranty coverage
              </li>
            </ul>

            <h3>Budget Considerations:</h3>
            <p>
              Set a realistic budget before shopping. Our list includes options across different price ranges, so you
              can find something that fits your budget without compromising on quality.
            </p>

            <h3>Final Thoughts:</h3>
            <p>
              All products in this list have been thoroughly tested and reviewed by our expert team. We consider factors
              like performance, build quality, value for money, and user feedback to bring you the most accurate
              recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
