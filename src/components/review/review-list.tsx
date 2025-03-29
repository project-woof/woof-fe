"use client";

import { Button } from "@/components/ui/button";
import { type Review } from "@/components/review/types";
import { Loader2 } from "lucide-react";
import { ReviewCard } from "./review-card";

interface ReviewsListProps {
  reviews: Review[];
  hasMoreReviews: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function ReviewsList({
  reviews,
  hasMoreReviews,
  isLoading,
  onLoadMore,
}: ReviewsListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.review_id} review={review} />
      ))}

      {hasMoreReviews && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Reviews"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
