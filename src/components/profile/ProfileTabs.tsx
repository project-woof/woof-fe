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
// import { ReviewsTab } from "@/components/profile/review/ReviewsTab";
import { useBookingQuery } from "@/composables/queries/booking";
import type { User } from "@/types/profile";
import { usePagination } from "@/context/paginationContext";

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
	const { bookingPagination, setBookingPagination } = usePagination();
	const limit = 5;
	const offset = (bookingPagination - 1) * limit;
	const { getBookingsByPetowner } = useBookingQuery();
	const { data: bookingData, isFetched: bookingFetched } =
		getBookingsByPetowner(userData.id, limit, offset);
	// const { data: reviewData, isFetched: reviewFetched } = getReviewsByReviewer(
	//   "uuid-user1",
	//   5,
	//   0
	// );

	useEffect(() => {
		setBookingPagination(1);
	}, [setBookingPagination]);

	function handlePrevPage() {
		if (bookingPagination > 1) {
			setBookingPagination((prev) => prev - 1);
		}
	}

	function handleNextPage() {
		setBookingPagination((prev) => prev + 1);
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
						{/* <ReviewsTab reviews={reviewData} isFetched={reviewFetched} /> */}
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
};
