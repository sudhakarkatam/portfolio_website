"use client"

import { useState } from "react"
import { Plus, X, VoteIcon as Vs } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

interface ComparisonProduct {
  id: string
  title: string
  price: number
  originalPrice: number
  rating: number
  image: string
  category: string
  specifications: Record<string, string>
  pros: string[]
  cons: string[]
}

export function CompareButton({ product }: { product: any }) {
  const { toast } = useToast()

  const addToComparison = () => {
    const comparison = JSON.parse(localStorage.getItem("comparison") || "[]")

    if (comparison.length >= 3) {
      toast({
        title: "Comparison Limit Reached",
        description: "You can compare up to 3 products at once",
        variant: "destructive",
      })
      return
    }

    if (comparison.some((p: ComparisonProduct) => p.id === product.id)) {
      toast({
        title: "Already in Comparison",
        description: "This product is already in your comparison list",
      })
      return
    }

    const comparisonProduct: ComparisonProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      image: product.images[0],
      category: product.category,
      specifications: product.specifications,
      pros: product.pros,
      cons: product.cons,
    }

    comparison.push(comparisonProduct)
    localStorage.setItem("comparison", JSON.stringify(comparison))

    toast({
      title: "Added to Comparison",
      description: `${product.title} added to comparison (${comparison.length}/3)`,
    })
  }

  return (
    <Button variant="outline" onClick={addToComparison} className="bg-transparent">
      <Plus className="w-4 h-4 mr-2" />
      Compare
    </Button>
  )
}

export function ComparisonPage() {
  const [comparison, setComparison] = useState<ComparisonProduct[]>([])
  const { toast } = useToast()

  useState(() => {
    const saved = JSON.parse(localStorage.getItem("comparison") || "[]")
    setComparison(saved)
  })

  const removeFromComparison = (id: string) => {
    const filtered = comparison.filter((p) => p.id !== id)
    setComparison(filtered)
    localStorage.setItem("comparison", JSON.stringify(filtered))

    toast({
      title: "Removed from Comparison",
      description: "Product removed from comparison",
    })
  }

  const clearComparison = () => {
    setComparison([])
    localStorage.setItem("comparison", JSON.stringify([]))

    toast({
      title: "Comparison Cleared",
      description: "All products removed from comparison",
    })
  }

  if (comparison.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Vs className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">No Products to Compare</h1>
            <p className="text-muted-foreground mb-8">
              Add products to comparison to see detailed side-by-side analysis
            </p>
            <Button asChild>
              <Link href="/categories">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Comparison</h1>
            <p className="text-muted-foreground">{comparison.length} products selected</p>
          </div>
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {comparison.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                    <div>
                      <h3 className="font-bold line-clamp-2">{product.title}</h3>
                      <Badge>{product.category}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFromComparison(product.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>Rating: {product.rating}/5</div>
                  <div>
                    <h4 className="font-semibold mb-2">Specifications:</h4>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span>{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparison.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeFromComparison(product.id)}
                >
                  <X className="w-4 h-4" />
                </Button>

                <CardHeader className="text-center">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={200}
                    height={200}
                    className="mx-auto rounded object-cover"
                  />
                  <CardTitle className="line-clamp-2">{product.title}</CardTitle>
                  <Badge>{product.category}</Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{product.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm">Rating: {product.rating}/5</div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Specifications:</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-green-600 mb-1">Pros:</h5>
                      <ul className="text-xs space-y-1">
                        {product.pros.slice(0, 3).map((pro, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-600">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-600 mb-1">Cons:</h5>
                      <ul className="text-xs space-y-1">
                        {product.cons.slice(0, 3).map((con, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-600">-</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/review/${product.id}`}>View Full Review</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
