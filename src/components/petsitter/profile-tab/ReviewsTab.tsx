import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReviewQuery } from "@/composables/queries/review";
import { usePagination } from "@/context/paginationContext";
import type { PetsitterProfile } from "@/types/profile";
import { Loader2, Star } from "lucide-react";
import { useEffect } from "react";

interface ReviewsTabProps {
	petsitterData: PetsitterProfile;
}

export function ReviewsTab({ petsitterData }: ReviewsTabProps) {
	const { reviewPagination, setReviewPagination } = usePagination();
	const limit = 5;
	const reviewOffset = (reviewPagination - 1) * limit;

	const { getReviewsByRevieweeId } = useReviewQuery();
	const { data: reviewData, isFetched: reviewFetched } = getReviewsByRevieweeId(
		petsitterData.id,
		limit,
		reviewOffset,
	);

	useEffect(() => {
		setReviewPagination(1);
	}, [setReviewPagination]);

	function handlePrevPage() {
		if (reviewPagination > 1) {
			setReviewPagination((current) => current - 1);
		}
	}

	function handleNextPage() {
		if (reviewData?.length === limit) {
			setReviewPagination((current) => current + 1);
		}
	}

	console.log(petsitterData);
	if (!reviewFetched) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="flex justify-center items-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				</CardContent>
			</Card>
		);
	}
	if (!reviewData) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center py-8">
						<h3 className="text-lg font-semibold mb-2">
							Unable to load reviews
						</h3>
						<p className="text-muted-foreground mb-4">
							There was a problem loading the reviews. Please try again later.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (reviewData.length === 0) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center py-8">
						<h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
						<p className="text-muted-foreground mb-4">
							This petsitter doesn't have any reviews yet.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">Reviews</h3>
					<div className="flex items-center">
						<Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
						<span className="font-medium">{petsitterData.composite_score}</span>
						<span className="text-muted-foreground ml-1">
							({petsitterData.total_reviews} reviews)
						</span>
					</div>
				</div>

				<div className="space-y-4">
					{reviewData.map((review) => (
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
			{/* Pagination Buttons */}
			<div className="flex items-center justify-center gap-4 mt-6">
				<Button
					variant="outline"
					onClick={handlePrevPage}
					disabled={reviewPagination === 1}
				>
					Previous
				</Button>
				<span className="text-navy">Page {reviewPagination}</span>
				<Button
					variant="outline"
					onClick={handleNextPage}
					disabled={reviewData?.length !== limit}
				>
					Next
				</Button>
			</div>
		</Card>
	);
}
