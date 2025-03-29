import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Review } from "@/components/review/types";
import { ReviewsList } from "@/components/review/review-list";
import { ReviewEmptyState } from "./empty-state";
import { ReviewErrorState } from "./error-state";
import { ReviewLoadingState } from "./loading-state";

interface ReviewsContentProps {
  reviews: Review[];
  reviewsLoading: boolean;
  reviewsError: string | null;
  hasMoreReviews: boolean;
  fetchReviews: () => void;
  loadMoreReviews: () => void;
}

export function ReviewsContent({
  reviews,
  reviewsLoading,
  reviewsError,
  hasMoreReviews,
  fetchReviews,
  loadMoreReviews,
}: ReviewsContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>Reviews others have left about you</CardDescription>
      </CardHeader>
      <CardContent>
        {reviewsLoading && reviews.length === 0 ? (
          <ReviewLoadingState />
        ) : reviewsError ? (
          <ReviewErrorState error={reviewsError} onRetry={fetchReviews} />
        ) : reviews.length > 0 ? (
          <ReviewsList
            reviews={reviews}
            hasMoreReviews={hasMoreReviews}
            isLoading={reviewsLoading}
            onLoadMore={loadMoreReviews}
          />
        ) : (
          <ReviewEmptyState />
        )}
      </CardContent>
    </Card>
  );
}
