"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProductById, updateProduct, type Product } from "@/lib/mock-data"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState("")
  const [pros, setPros] = useState<string[]>([])
  const [newPro, setNewPro] = useState("")
  const [cons, setCons] = useState<string[]>([])
  const [newCon, setNewCon] = useState("")
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  useEffect(() => {
    const foundProduct = getProductById(params.id)
    if (foundProduct) {
      setProduct(foundProduct)
      setImages(foundProduct.images || [foundProduct.image])
      setPros(foundProduct.pros)
      setCons(foundProduct.cons)
      setSpecifications(foundProduct.specifications || {})
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const productData = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        platform: formData.get("platform") as string,
        price: Number.parseInt(formData.get("price") as string),
        originalPrice: formData.get("originalPrice")
          ? Number.parseInt(formData.get("originalPrice") as string)
          : undefined,
        rating: Number.parseFloat(formData.get("rating") as string),
        image: images[0] || "/placeholder.svg",
        images: images.length > 0 ? images : ["/placeholder.svg"],
        affiliateUrl: formData.get("affiliateUrl") as string,
        review: formData.get("review") as string,
        pros,
        cons,
        specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
        videoId: (formData.get("videoId") as string) || undefined,
      }

      updateProduct(params.id, productData)
      router.push("/admin")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error updating product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()])
      setNewPro("")
    }
  }

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index))
  }

  const addCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()])
      setNewCon("")
    }
  }

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications({
        ...specifications,
        [newSpecKey.trim()]: newSpecValue.trim(),
      })
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications }
    delete newSpecs[key]
    setSpecifications(newSpecs)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Product: {product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" name="name" defaultValue={product.name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" defaultValue={product.category} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Home Appliances">Home Appliances</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Beauty">Beauty</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select name="platform" defaultValue={product.platform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amazon">Amazon</SelectItem>
                      <SelectItem value="Flipkart">Flipkart</SelectItem>
                      <SelectItem value="Myntra">Myntra</SelectItem>
                      <SelectItem value="Nykaa">Nykaa</SelectItem>
                      <SelectItem value="Ajio">Ajio</SelectItem>
                      <SelectItem value="Meesho">Meesho</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5) *</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue={product.rating}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Current Price (₹) *</Label>
                  <Input id="price" name="price" type="number" defaultValue={product.price} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input id="originalPrice" name="originalPrice" type="number" defaultValue={product.originalPrice} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliateUrl">Affiliate URL *</Label>
                <Input id="affiliateUrl" name="affiliateUrl" type="url" defaultValue={product.affiliateUrl} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoId">YouTube Video ID (optional)</Label>
                <Input id="videoId" name="videoId" defaultValue={product.videoId} placeholder="e.g., dQw4w9WgXcQ" />
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <Label>Product Images</Label>
                <div className="flex gap-2">
                  <Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Enter image URL" />
                  <Button type="button" onClick={addImage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      Image {index + 1}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeImage(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pros Section */}
              <div className="space-y-4">
                <Label>Pros</Label>
                <div className="flex gap-2">
                  <Input
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    placeholder="Enter a positive point"
                  />
                  <Button type="button" onClick={addPro}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pros.map((pro, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      {pro.length > 30 ? `${pro.substring(0, 30)}...` : pro}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removePro(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Cons Section */}
              <div className="space-y-4">
                <Label>Cons</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    placeholder="Enter a negative point"
                  />
                  <Button type="button" onClick={addCon}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cons.map((con, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      {con.length > 30 ? `${con.substring(0, 30)}...` : con}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeCon(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Specifications Section */}
              <div className="space-y-4">
                <Label>Specifications</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Specification name"
                  />
                  <Input
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="Specification value"
                  />
                  <Button type="button" onClick={addSpecification}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="flex items-center gap-2">
                      {key}: {value}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeSpecification(key)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Detailed Review *</Label>
                <Textarea
                  id="review"
                  name="review"
                  rows={10}
                  defaultValue={product.review}
                  placeholder="Write a detailed review in HTML format..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
