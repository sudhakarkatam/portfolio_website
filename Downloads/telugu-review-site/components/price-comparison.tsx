"use client"

import { useState, useEffect } from "react"
import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PriceData {
  store: string
  price: number
  originalPrice: number
  availability: "In Stock" | "Out of Stock" | "Limited Stock"
  rating: number
  link: string
  logo: string
}

export function PriceComparison({ productId, productTitle }: { productId: string; productTitle: string }) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching price data from multiple stores
    const fetchPriceData = async () => {
      setLoading(true)

      // Mock price data - in real app, this would come from APIs
      const mockPriceData: PriceData[] = [
        {
          store: "Amazon",
          price: Math.floor(Math.random() * 10000) + 20000,
          originalPrice: Math.floor(Math.random() * 15000) + 25000,
          availability: "In Stock",
          rating: 4.2,
          link: "https://amazon.in",
          logo: "🛒",
        },
        {
          store: "Flipkart",
          price: Math.floor(Math.random() * 10000) + 19000,
          originalPrice: Math.floor(Math.random() * 15000) + 24000,
          availability: "In Stock",
          rating: 4.1,
          link: "https://flipkart.com",
          logo: "🛍️",
        },
        {
          store: "Croma",
          price: Math.floor(Math.random() * 10000) + 21000,
          originalPrice: Math.floor(Math.random() * 15000) + 26000,
          availability: "Limited Stock",
          rating: 4.0,
          link: "https://croma.com",
          logo: "🏪",
        },
        {
          store: "Reliance Digital",
          price: Math.floor(Math.random() * 10000) + 20500,
          originalPrice: Math.floor(Math.random() * 15000) + 25500,
          availability: "In Stock",
          rating: 3.9,
          link: "https://reliancedigital.in",
          logo: "🏬",
        },
      ]

      // Sort by price (lowest first)
      mockPriceData.sort((a, b) => a.price - b.price)

      setTimeout(() => {
        setPriceData(mockPriceData)
        setLoading(false)
      }, 1000)
    }

    fetchPriceData()
  }, [productId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const lowestPrice = Math.min(...priceData.map((p) => p.price))
  const highestPrice = Math.max(...priceData.map((p) => p.price))
  const savings = highestPrice - lowestPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Price Comparison
          <Badge variant="secondary">Save up to ₹{savings.toLocaleString()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceData.map((store, index) => (
            <div
              key={store.store}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{store.logo}</div>
                <div>
                  <h4 className="font-semibold">{store.store}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rating: {store.rating}/5</span>
                    <Badge
                      variant={
                        store.availability === "In Stock"
                          ? "default"
                          : store.availability === "Limited Stock"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {store.availability}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-green-600">₹{store.price.toLocaleString()}</span>
                  {index === 0 && <Badge className="bg-green-600 text-xs">Best Price</Badge>}
                </div>
                <div className="text-sm text-muted-foreground line-through">
                  ₹{store.originalPrice.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {store.price < lowestPrice + 1000 ? (
                    <TrendingDown className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-red-600" />
                  )}
                  <span className={store.price < lowestPrice + 1000 ? "text-green-600" : "text-red-600"}>
                    {store.price === lowestPrice ? "Lowest" : `₹${(store.price - lowestPrice).toLocaleString()} more`}
                  </span>
                </div>
              </div>

              <Button size="sm" asChild>
                <a href={store.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Buy Now
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Pro Tip:</strong> Prices update every hour. The lowest price is currently ₹
            {lowestPrice.toLocaleString()}
            at {priceData[0].store}. Save ₹{savings.toLocaleString()} compared to the highest price!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
