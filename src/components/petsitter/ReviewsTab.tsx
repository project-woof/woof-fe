import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types/review";
import { Star } from "lucide-react";

interface PetsitterData {
  rating: number;
  reviews: number;
  reviewsList: Review[];
}

interface ReviewsTabProps {
  petsitterData: PetsitterData;
}

export function ReviewsTab({ petsitterData }: ReviewsTabProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{petsitterData.rating}</span>
            <span className="text-muted-foreground ml-1">
              ({petsitterData.reviews} reviews)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {petsitterData.reviewsList.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={review.avatar} alt={review.petsitter} />
                    <AvatarFallback>{review.petsitter.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{review.petsitter}</h4>
                    <p className="text-sm text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
