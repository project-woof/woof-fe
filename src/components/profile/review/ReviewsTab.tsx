import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
  id: number;
  petsitter: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsTabProps {
  reviews: Review[];
}

export const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">No reviews yet</h3>
        <p className="text-muted-foreground mb-4">
          Leave a review for a petsitter you've booked
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={review.avatar} alt={review.petsitter} />
                <AvatarFallback>{review.petsitter.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{review.petsitter}</h3>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};
