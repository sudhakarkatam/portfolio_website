"use client"

import { useState, useEffect } from "react"
import { Bell, BellRing, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface PriceAlert {
  id: string
  productId: string
  productTitle: string
  targetPrice: number
  currentPrice: number
  email: string
  createdAt: string
}

export function PriceAlertButton({ product }: { product: any }) {
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("")
  const [targetPrice, setTargetPrice] = useState("")
  const [hasAlert, setHasAlert] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
    setHasAlert(alerts.some((alert: PriceAlert) => alert.productId === product.id))
  }, [product.id])

  const createAlert = () => {
    if (!email || !targetPrice) return

    const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      productId: product.id,
      productTitle: product.title,
      targetPrice: Number.parseInt(targetPrice),
      currentPrice: product.price,
      email,
      createdAt: new Date().toISOString(),
    }

    alerts.push(newAlert)
    localStorage.setItem("priceAlerts", JSON.stringify(alerts))

    setHasAlert(true)
    setShowForm(false)
    setEmail("")
    setTargetPrice("")

    toast({
      title: "Price Alert Created!",
      description: `We'll notify you when the price drops to ₹${Number.parseInt(targetPrice).toLocaleString()}`,
    })
  }

  const removeAlert = () => {
    const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
    const filtered = alerts.filter((alert: PriceAlert) => alert.productId !== product.id)
    localStorage.setItem("priceAlerts", JSON.stringify(filtered))
    setHasAlert(false)

    toast({
      title: "Price Alert Removed",
      description: "You'll no longer receive notifications for this product",
    })
  }

  if (hasAlert) {
    return (
      <Button variant="outline" onClick={removeAlert} className="bg-transparent">
        <BellRing className="w-4 h-4 mr-2" />
        Alert Active
      </Button>
    )
  }

  if (showForm) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Set Price Alert
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="targetPrice">Target Price (₹)</Label>
            <Input
              id="targetPrice"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={`Less than ₹${product.price.toLocaleString()}`}
              max={product.price - 1}
            />
            <p className="text-xs text-muted-foreground mt-1">Current price: ₹{product.price.toLocaleString()}</p>
          </div>
          <Button onClick={createAlert} className="w-full">
            Create Alert
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button variant="outline" onClick={() => setShowForm(true)} className="bg-transparent">
      <Bell className="w-4 h-4 mr-2" />
      Price Alert
    </Button>
  )
}

export function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
    setAlerts(savedAlerts)
  }, [])

  const removeAlert = (id: string) => {
    const filtered = alerts.filter((alert) => alert.id !== id)
    setAlerts(filtered)
    localStorage.setItem("priceAlerts", JSON.stringify(filtered))

    toast({
      title: "Alert Removed",
      description: "Price alert has been removed",
    })
  }

  if (alerts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">No Price Alerts</h1>
            <p className="text-muted-foreground mb-8">Set up price alerts to get notified when products go on sale!</p>
            <Button asChild>
              <a href="/categories">Browse Products</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
          <p className="text-muted-foreground">{alerts.length} active alerts</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{alert.productTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Target: ₹{alert.targetPrice.toLocaleString()}</span>
                      <span>Current: ₹{alert.currentPrice.toLocaleString()}</span>
                      <span>Email: {alert.email}</span>
                    </div>
                    <div className="mt-2">
                      {alert.currentPrice <= alert.targetPrice ? (
                        <Badge className="bg-green-600">Target Reached!</Badge>
                      ) : (
                        <Badge variant="secondary">
                          ₹{(alert.currentPrice - alert.targetPrice).toLocaleString()} to go
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => removeAlert(alert.id)}>
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
