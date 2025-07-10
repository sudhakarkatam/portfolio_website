"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/lib/mock-data"

export function TrendingProducts() {
  const [products, setProducts] = useState(getProducts())

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(getProducts())
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  // Listen for storage changes (real-time updates from admin)
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getProducts())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Sort by rating and get top 6 trending products
  const trendingProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 6)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trendingProducts.map((product, index) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-orange-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />#{index + 1}
            </Badge>
          </div>
          <div className="relative">
            <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-48 object-cover" />
            <Badge className="absolute top-2 right-2 bg-blue-500">{product.platform || "Amazon"}</Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.rating})</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/review/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View Review
                </Button>
              </Link>
              <Button className="flex-1" onClick={() => window.open(product.affiliateUrl, "_blank")}>
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
