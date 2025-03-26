import { Tabs, TabsContent } from "@/components/ui/tabs"
import { type Review } from "@/components/review/types";
import { ReviewsContent } from "@/components/review/review-content"

interface ReviewsTabProps {
  reviews: Review[]
  reviewsLoading: boolean
  reviewsError: string | null
  hasMoreReviews: boolean
  fetchReviews: () => void
  loadMoreReviews: () => void
}

export function ReviewsTab({
  reviews,
  reviewsLoading,
  reviewsError,
  hasMoreReviews,
  fetchReviews,
  loadMoreReviews,
}: ReviewsTabProps) {
  return (
    <Tabs>
      <TabsContent value="reviews" className="mt-4">
        <ReviewsContent
          reviews={reviews}
          reviewsLoading={reviewsLoading}
          reviewsError={reviewsError}
          hasMoreReviews={hasMoreReviews}
          fetchReviews={fetchReviews}
          loadMoreReviews={loadMoreReviews}
        />
      </TabsContent>
    </Tabs>
  )
}