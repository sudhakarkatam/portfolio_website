"use client"

import { useState } from "react"
import { Star, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BestOfPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceFilter, setPriceFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const bestOfLists = [
    {
      id: 1,
      title: "Best Fans Under ₹2000",
      titleTe: "₹2000 లోపు ఉత్తమ ఫ్యాన్లు",
      description: "Top ceiling fans that offer great value for money",
      descriptionTe: "డబ్బుకు మంచి విలువ ఇచ్చే టాప్ సీలింగ్ ఫ్యాన్లు",
      products: [
        {
          id: 1,
          name: "Bajaj Ceiling Fan 1200mm",
          nameTe: "బజాజ్ సీలింగ్ ఫ్యాన్ 1200mm",
          price: "₹1,899",
          originalPrice: "₹2,499",
          rating: 4.5,
          image: "/placeholder.svg?height=200&width=200",
          pros: ["తక్కువ విద్యుత్ వినియోగం", "నిశ్శబ్ద ఆపరేషన్"],
          affiliate: "https://amazon.in/dp/example1",
        },
        {
          id: 2,
          name: "Orient Electric Fan",
          nameTe: "ఓరియంట్ ఎలక్ట్రిక్ ఫ్యాన్",
          price: "₹1,699",
          originalPrice: "₹2,199",
          rating: 4.3,
          image: "/placeholder.svg?height=200&width=200",
          pros: ["అధిక గాలి ప్రవాహం", "మన్నికైన నిర్మాణం"],
          affiliate: "https://amazon.in/dp/example2",
        },
        {
          id: 3,
          name: "Crompton Fan",
          nameTe: "క్రాంప్టన్ ఫ్యాన్",
          price: "₹1,799",
          originalPrice: "₹2,299",
          rating: 4.4,
          image: "/placeholder.svg?height=200&width=200",
          pros: ["స్టైలిష్ డిజైన్", "ఎనర్జీ ఎఫిషియంట్"],
          affiliate: "https://amazon.in/dp/example3",
        },
      ],
    },
    {
      id: 2,
      title: "Best Phones Under ₹15000",
      titleTe: "₹15000 లోపు ఉత్తమ ఫోన్లు",
      description: "Top smartphones offering excellent features in budget",
      descriptionTe: "బడ్జెట్‌లో అద్భుతమైన ఫీచర్లు అందించే టాప్ స్మార్ట్‌ఫోన్లు",
      products: [
        {
          id: 4,
          name: "Redmi Note 12",
          nameTe: "రెడ్మీ నోట్ 12",
          price: "₹14,999",
          originalPrice: "₹16,999",
          rating: 4.2,
          image: "/placeholder.svg?height=200&width=200",
          pros: ["50MP కెమెరా", "5000mAh బ్యాటరీ"],
          affiliate: "https://amazon.in/dp/example4",
        },
        {
          id: 5,
          name: "Samsung Galaxy M34",
          nameTe: "సామ్సంగ్ గెలాక్సీ M34",
          price: "₹13,999",
          originalPrice: "₹15,999",
          rating: 4.3,
          image: "/placeholder.svg?height=200&width=200",
          pros: ["6000mAh బ్యాటరీ", "120Hz డిస్ప్లే"],
          affiliate: "https://amazon.in/dp/example5",
        },
      ],
    },
  ]

  const filteredLists = bestOfLists.filter((list) => {
    if (categoryFilter === "all") return true
    return list.title.toLowerCase().includes(categoryFilter.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">బెస్ట్ ఆఫ్ లిస్ట్స్</h1>
          <p className="text-xl text-muted-foreground mb-2">Best Of Lists</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">వివిధ బడ్జెట్లలో మరియు వర్గాలలో ఉత్తమ ఉత్పాదకాలను కనుగొనండి</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters:</span>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category | వర్గం" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fans">Fans | ఫ్యాన్లు</SelectItem>
                <SelectItem value="phones">Phones | ఫోన్లు</SelectItem>
                <SelectItem value="appliances">Appliances | ఉపకరణలు</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range | ధర పరిధి" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                <SelectItem value="above-15000">Above ₹15,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Best Of Lists */}
        <div className="space-y-12">
          {filteredLists.map((list) => (
            <div key={list.id} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">{list.titleTe}</h2>
                <p className="text-lg text-muted-foreground mb-1">{list.title}</p>
                <p className="text-muted-foreground">{list.descriptionTe}</p>
              </div>

              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {list.products.map((product, index) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className={`object-cover ${viewMode === "list" ? "w-full h-48" : "w-full h-48"}`}
                        />
                        <Badge className="absolute top-2 left-2 bg-orange-500">#{index + 1}</Badge>
                      </div>
                      <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.nameTe}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{product.name}</p>
                          <div className="flex items-center gap-2 mb-3">
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
                            <span className="text-sm text-muted-foreground">{product.rating}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-green-600">{product.price}</span>
                            <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                          </div>
                          <div className="space-y-2 mb-4">
                            {product.pros.map((pro, proIndex) => (
                              <div key={proIndex} className="text-sm text-green-600 flex items-center gap-1">
                                <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                                {pro}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button asChild className="flex-1">
                              <Link href={`/review/${product.id}`}>Read Review</Link>
                            </Button>
                            <Button variant="outline" asChild>
                              <a href={product.affiliate} target="_blank" rel="noopener noreferrer">
                                Buy Now
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Lists | మరిన్ని లిస్ట్‌లు లోడ్ చేయండి
          </Button>
        </div>
      </div>
    </div>
  )
}
