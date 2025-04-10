import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingsTab } from "@/components/profile/booking/BookingsTab";
import { ReviewsTab } from "@/components/profile/review/ReviewsTab";
import { useBookingQuery } from "@/composables/queries/booking";
import type { User } from "@/types/profile";
import { usePagination } from "@/context/paginationContext";
import { useReviewQuery } from "@/composables/queries/review";

interface ProfileTabsProps {
	userData: User;
	activeTab: string;
	setActiveTab: (val: string) => void;
}

export const ProfileTabs = ({
	userData,
	activeTab,
	setActiveTab,
}: ProfileTabsProps) => {
	const { bookingPagination, reviewPagination, setBookingPagination, setReviewPagination } = usePagination();
	const limit = 5;
	const bookingOffset = (bookingPagination - 1) * limit;
	const reviewOffset = (reviewPagination - 1) * limit;

	const { getBookingsByPetowner } = useBookingQuery();
	const { data: bookingData, isFetched: bookingFetched } =
		getBookingsByPetowner(userData.id, limit, bookingOffset);
	
	const { getReviewsByReviewerId } = useReviewQuery();
	const { data: reviewData, isFetched: reviewFetched } = getReviewsByReviewerId(
		userData.id,
		limit,
		reviewOffset,
	);

	useEffect(() => {
		setBookingPagination(1);
	}, [setBookingPagination]);

	useEffect(() => {
		setReviewPagination(1);
	}, [setReviewPagination]);

	function handlePrevPage() {
		if (activeTab === "bookings" && bookingPagination > 1) {
			setBookingPagination((current) => current - 1);
		}
		if (activeTab === "reviews" && reviewPagination > 1) {
			setReviewPagination((current) => current - 1);
		}
	}

	function handleNextPage() {
		if (activeTab === "bookings" && bookingData?.length === limit) {
			setBookingPagination((current) => current + 1);
		}
		if (activeTab === "reviews" && reviewData?.length === limit) {
			setReviewPagination((current) => current + 1);
		}
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="bookings">Bookings</TabsTrigger>
				<TabsTrigger value="reviews">Reviews</TabsTrigger>
			</TabsList>

			<TabsContent value="bookings" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Bookings</CardTitle>
						<CardDescription>
							View your past and upcoming bookings
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BookingsTab bookings={bookingData} isFetched={bookingFetched} />
						{/* Pagination Buttons */}
						<div className="flex items-center justify-center gap-4 mt-6">
							<Button
								variant="outline"
								onClick={handlePrevPage}
								disabled={bookingPagination === 1}
							>
								Previous
							</Button>
							<span className="text-navy">Page {bookingPagination}</span>
							<Button
								variant="outline"
								onClick={handleNextPage}
								disabled={bookingData?.length !== limit}
							>
								Next
							</Button>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="reviews" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Reviews</CardTitle>
						<CardDescription>
							Reviews you've left for petsitters
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ReviewsTab reviews={reviewData} isFetched={reviewFetched} />
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
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
};
