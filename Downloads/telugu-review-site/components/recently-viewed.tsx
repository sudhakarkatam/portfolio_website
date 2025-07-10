"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface ViewedProduct {
  id: string
  title: string
  price: number
  image: string
  category: string
  viewedAt: string
}

export function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedProduct[]>([])

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    setRecentlyViewed(viewed.slice(0, 4)) // Show only last 4 items
  }, [])

  const addToRecentlyViewed = (product: any) => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    const newItem: ViewedProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
      viewedAt: new Date().toISOString(),
    }

    // Remove if already exists
    const filtered = viewed.filter((item: ViewedProduct) => item.id !== product.id)

    // Add to beginning
    const updated = [newItem, ...filtered].slice(0, 10) // Keep only 10 items

    localStorage.setItem("recentlyViewed", JSON.stringify(updated))
  }

  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentlyViewed.map((product) => (
            <Link key={product.id} href={`/review/${product.id}`}>
              <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={50}
                  height={50}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{product.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">₹{product.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(product.viewedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Hook to add products to recently viewed
export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (product: any) => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    const newItem: ViewedProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
      viewedAt: new Date().toISOString(),
    }

    const filtered = viewed.filter((item: ViewedProduct) => item.id !== product.id)
    const updated = [newItem, ...filtered].slice(0, 10)

    localStorage.setItem("recentlyViewed", JSON.stringify(updated))
  }

  return { addToRecentlyViewed }
}
