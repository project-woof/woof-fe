import { Star } from "lucide-react"

export function EmptyState() {
  return (
    <div className="text-center py-8">
      <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="font-medium text-lg mb-1">No reviews yet</h3>
      <p className="text-muted-foreground mb-4">There are no reviews for you yet</p>
    </div>
  )
}

