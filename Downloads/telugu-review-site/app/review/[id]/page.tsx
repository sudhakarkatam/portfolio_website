"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductById, getProducts } from "@/lib/mock-data"
import { SocialShare } from "@/components/social-share"
import { CommentsSection } from "@/components/comments-section"
import { YouTubeEmbed } from "@/components/youtube-embed"

interface ReviewPageProps {
  params: {
    id: string
  }
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const [product, setProduct] = useState(() => getProductById(params.id))
  const [relatedProducts, setRelatedProducts] = useState(() => getProducts().slice(0, 4))
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedProduct = getProductById(params.id)
      if (updatedProduct) {
        setProduct(updatedProduct)
      }
      setRelatedProducts(getProducts().slice(0, 4))
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [params.id])

  // Listen for storage changes (real-time updates from admin)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedProduct = getProductById(params.id)
      if (updatedProduct) {
        setProduct(updatedProduct)
      }
      setRelatedProducts(getProducts().slice(0, 4))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [params.id])

  // Check wishlist status
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setIsWishlisted(wishlist.includes(params.id))
  }, [params.id])

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    let updatedWishlist

    if (isWishlisted) {
      updatedWishlist = wishlist.filter((id: string) => id !== params.id)
    } else {
      updatedWishlist = [...wishlist, params.id]
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
    setIsWishlisted(!isWishlisted)
  }

  if (!product) {
    notFound()
  }

  const images = product.images || [product.image]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="text-muted-foreground hover:text-primary">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/category/${product.category.toLowerCase()}`}
            className="text-muted-foreground hover:text-primary"
          >
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? "border-primary" : "border-muted"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.platform && <Badge className="bg-blue-500">{product.platform}</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{product.rating}/5</span>
                <span className="text-muted-foreground">(Based on expert review)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-red-500">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button size="lg" className="flex-1" onClick={() => window.open(product.affiliateUrl, "_blank")}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
                <Button size="lg" variant="outline" onClick={toggleWishlist}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                </Button>
                <SocialShare
                  title={product.name}
                  url={`${typeof window !== "undefined" ? window.location.origin : ""}/review/${product.id}`}
                  description={`Check out this amazing ${product.name} review with detailed analysis and specifications.`}
                />
              </div>

              {/* Quick Specs */}
              {product.specifications && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(product.specifications)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Review Tabs */}
        <Tabs defaultValue="review" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
            <TabsTrigger value="video">Video Review</TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.review }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No detailed specifications available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pros-cons" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Pros</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Cons</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.videoId ? (
                  <YouTubeEmbed videoId={product.videoId} title={`${product.name} Review`} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No video review available for this product.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Image
                    src={relatedProduct.images?.[0] || relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">{relatedProduct.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-green-600">₹{relatedProduct.price.toLocaleString()}</span>
                    {relatedProduct.platform && (
                      <Badge variant="outline" className="text-xs">
                        {relatedProduct.platform}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/review/${relatedProduct.id}`}>
                    <Button size="sm" className="w-full">
                      View Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <CommentsSection productId={product.id} type="product" />
      </div>
    </div>
  )
}
