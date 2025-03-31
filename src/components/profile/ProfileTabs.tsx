import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookingsTab } from "@/components/profile/booking/BookingsTab";
// import { ReviewsTab } from "@/components/profile/review/ReviewsTab";
import { useBookingQuery } from "@/composables/queries/booking";
import type { User } from "@/types/profile";

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
  const { getBookingsByPetowner } = useBookingQuery();
  const { data: bookingData, isFetched: bookingFetched } =
    getBookingsByPetowner(userData.id, 5, 0);
  // const { data: reviewData, isFetched: reviewFetched } = getReviewsByReviewer(
  //   "uuid-user1",
  //   5,
  //   0
  // );
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
