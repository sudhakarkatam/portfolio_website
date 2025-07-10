"use client"

import { useState, useEffect } from "react"
import { Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface WishlistItem {
  id: string
  title: string
  price: number
  originalPrice: number
  image: string
  category: string
}

export function WishlistButton({ product }: { product: any }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setIsInWishlist(wishlist.some((item: WishlistItem) => item.id === product.id))
  }, [product.id])

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: WishlistItem) => item.id !== product.id)
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      setIsInWishlist(false)
      toast({
        title: "Removed from Wishlist",
        description: "Product removed from your wishlist",
      })
    } else {
      const newItem: WishlistItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
      }
      wishlist.push(newItem)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
      setIsInWishlist(true)
      toast({
        title: "Added to Wishlist",
        description: "Product added to your wishlist",
      })
    }
  }

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      size="sm"
      onClick={toggleWishlist}
      className={isInWishlist ? "bg-red-500 hover:bg-red-600" : ""}
    >
      <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? "fill-white" : ""}`} />
      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  )
}

export function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlist(savedWishlist)
  }, [])

  const removeFromWishlist = (id: string) => {
    const newWishlist = wishlist.filter((item) => item.id !== id)
    setWishlist(newWishlist)
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
    toast({
      title: "Removed from Wishlist",
      description: "Product removed from your wishlist",
    })
  }

  const clearWishlist = () => {
    setWishlist([])
    localStorage.setItem("wishlist", JSON.stringify([]))
    toast({
      title: "Wishlist Cleared",
      description: "All products removed from wishlist",
    })
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">Start adding products you love to keep track of them!</p>
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
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">{wishlist.length} items saved</p>
          </div>
          <Button variant="outline" onClick={clearWishlist}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2 line-clamp-2">{item.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-green-600">₹{item.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/review/${item.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeFromWishlist(item.id)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
