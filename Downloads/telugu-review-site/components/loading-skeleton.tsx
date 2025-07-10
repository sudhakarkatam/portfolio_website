import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <div className="h-48 bg-muted"></div>
        <CardContent className="p-4">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-muted rounded flex-1"></div>
            <div className="h-9 bg-muted rounded w-20"></div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <div className="h-48 bg-muted"></div>
        <CardHeader>
          <div className="h-4 bg-muted rounded w-16 mb-2"></div>
          <div className="h-5 bg-muted rounded mb-2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
      </div>
    </Card>
  )
}
