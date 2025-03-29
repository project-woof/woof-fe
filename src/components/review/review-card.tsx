import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Review } from "@/components/review/types";
import { Star } from "lucide-react";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={
                review.profile_image_url ||
                "/placeholder.svg?height=40&width=40"
              }
              alt={review.username || "Reviewer"}
            />
            <AvatarFallback>{review.username?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.username || "Anonymous"}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()} at{" "}
              {new Date(review.created_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
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
  );
}
