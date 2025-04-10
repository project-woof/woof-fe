import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { PetsitterProfile } from "@/types/profile";
import type { Review } from "@/types/review";
import { Star } from "lucide-react";

interface ReviewsTabProps {
	petsitterData: PetsitterProfile;
}
// hard coded image reviews location and availability for now
const reviewsList: Review[] = [
	{
		review_id: "1",
		username: "John D.",
		profile_image_url: "/placeholder.svg?height=40&width=40",
		rating: 5,
		created_at: "2 weeks ago",
		comment:
			"Sarah was amazing with my dog Max! She sent photos throughout the day and was very responsive. Will definitely book again.",
	},
	{
		review_id: "2",
		username: "Emma S.",
		profile_image_url: "/placeholder.svg?height=40&width=40",
		rating: 4,
		created_at: "1 month ago",
		comment:
			"Very professional and caring. My cat was well taken care of while I was away.",
	},
	{
		review_id: "3",
		username: "Michael T.",
		profile_image_url: "/placeholder.svg?height=40&width=40",
		rating: 5,
		created_at: "2 months ago",
		comment:
			"Sarah is the best! My dogs love her and are always excited when she comes over. Highly recommend!",
	},
];
export function ReviewsTab({ petsitterData }: ReviewsTabProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">Reviews</h3>
					<div className="flex items-center">
						<Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
						<span className="font-medium">{petsitterData.composite_score}</span>
						<span className="text-muted-foreground ml-1">
							({reviewsList.length} reviews)
						</span>
					</div>
				</div>

				<div className="space-y-4">
					{reviewsList.map((review) => (
						<div key={review.review_id} className="border-b pb-4 last:border-0">
							<div className="flex justify-between items-start">
								<div className="flex items-center">
									<Avatar className="h-10 w-10 mr-3">
										<AvatarImage
											src={review.profile_image_url}
											alt={review.username}
										/>
										<AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<h4 className="font-medium">{review.username}</h4>
										<p className="text-sm text-muted-foreground">
											{review.created_at}
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
