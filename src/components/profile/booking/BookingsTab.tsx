import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star } from "lucide-react";
import type { BookingResponse } from "@/types/booking";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BookingsTabProps {
	bookings: BookingResponse[] | undefined;
	isFetched: boolean;
}

export const BookingsTab = ({ bookings, isFetched }: BookingsTabProps) => {
	const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
		null,
	);
	const [rating, setRating] = useState<number>(3);
	const [comment, setComment] = useState<string>("");

	function getBookingStatus(start_date: string, end_date: string): string {
		const currentTime = new Date();
		const startTime = new Date(start_date);
		const endTime = new Date(end_date);

		if (currentTime < startTime) {
			return "Upcoming";
		} else if (currentTime >= startTime && currentTime < endTime) {
			return "Ongoing";
		} else {
			return "Completed";
		}
	}

	const handleSubmitReview = (bookingId: string) => {
		// Here you would implement the API call to submit the review

		// TODO:

		console.log(`Submitting review for booking ${bookingId}:`, {
			rating,
			comment,
		});

		// Reset form state
		setRating(3);
		setComment("");
		setSelectedBookingId(null);
	};

	// Star Rating component
	const StarRating = ({
		value,
		onChange,
	}: {
		value: number;
		onChange: (rating: number) => void;
	}) => {
		return (
			<div className="flex items-center space-x-1 mb-4">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => onChange(star)}
						className="focus:outline-none"
					>
						<Star
							className={`h-8 w-8 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
						/>
					</button>
				))}
			</div>
		);
	};

	if (!isFetched) {
		return (
			<div className="text-center py-8">
				<Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
				<h3 className="font-medium text-lg mb-1">Loading...</h3>
				<p className="text-muted-foreground mb-4">Fetching your bookings</p>
			</div>
		);
	}
	if (!bookings || bookings.length === 0) {
		return (
			<div className="text-center py-8">
				<Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
				<h3 className="font-medium text-lg mb-1">No bookings yet</h3>
				<p className="text-muted-foreground mb-4">
					Book a petsitter to see your bookings here
				</p>
			</div>
		);
	}

	// For simplicity, use provided status directly.
	return (
		<div className="space-y-4">
			{bookings.map((booking) => {
				const status = getBookingStatus(booking.start_date, booking.end_date);
				const isCompleted = status === "Completed";

				return (
					<div
						key={booking.booking_id}
						className="flex items-start p-4 border rounded-lg"
					>
						<Avatar className="h-10 w-10 mr-3">
							<AvatarImage
								src={booking.profile_image_url}
								alt={booking.username}
							/>
							<AvatarFallback>{booking.username.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-medium">{booking.username}</h3>
								</div>
								<Badge
									variant={status === "Upcoming" ? "outline" : "secondary"}
								>
									{status}
								</Badge>
							</div>
							<div className="flex items-center mt-2 text-sm text-muted-foreground">
								<Calendar className="h-4 w-4 mr-1" />
								<span>{booking.start_date}</span>
							</div>

							{isCompleted && (
								<AlertDialog
									open={selectedBookingId === booking.booking_id}
									onOpenChange={(open) => {
										if (!open) setSelectedBookingId(null);
									}}
								>
									<AlertDialogTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="mt-3"
											onClick={() => setSelectedBookingId(booking.booking_id)}
										>
											Leave a Review
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Rate your experience</AlertDialogTitle>
											<AlertDialogDescription>
												How was your experience with {booking.username}? Your
												feedback helps other pet owners.
											</AlertDialogDescription>
										</AlertDialogHeader>

										<div className="py-4">
											<StarRating value={rating} onChange={setRating} />

											<Textarea
												placeholder="Share details of your experience..."
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												className="min-h-[100px]"
											/>
										</div>

										<AlertDialogFooter>
											<AlertDialogCancel
												onClick={() => {
													setRating(0);
													setComment("");
												}}
											>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleSubmitReview(booking.booking_id)}
												disabled={rating === 0}
											>
												Submit Review
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
