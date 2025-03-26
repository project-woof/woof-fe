import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Edit, Loader2 } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  type Review,
  type User,
  type ReviewsApiResponse,
  type Bookings,
  type BookingApiResponse,
} from "@/components/review/types";
import { LoadingState } from "@/components/review/loading-state";
import { ErrorState } from "@/components/review/error-state";
import { ReviewsList } from "@/components/review/review-list";
import { EmptyState } from "@/components/review/empty-state";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

// We'll use localStorage in the component instead of at the module level

function Profile() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [bookingsPage, setBookingsPage] = useState(0);
  const [hasMoreBookings, setHasMoreBookings] = useState(false);

  const reviewsLimit = 5;

  const navigate = useNavigate();

  // Get user profile from localStorage (set during Google login)
  const [googleProfile, setGoogleProfile] = useState<{
    name: string;
    email: string;
    picture: string;
  } | null>(null);

  // In a real app, we would get the user ID from auth context
  // For now, we'll just use the Google profile information from localStorage

  // Get Google profile from localStorage on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    console.log(
      "Raw userProfile from localStorage in profile.tsx:",
      storedProfile
    );

    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        console.log("Parsed userProfile in profile.tsx:", parsedProfile);
        setGoogleProfile(parsedProfile);
      } catch (err) {
        console.error("Error parsing profile from localStorage:", err);
      }
    }
  }, []);

  // Separate useEffect to fetch user data when googleProfile changes
  useEffect(() => {
    fetchUserData();
  }, [googleProfile]); // This will run fetchUserData whenever googleProfile changes

  async function fetchUserData() {
    setUserLoading(true);
    setUserError(null);

    try {
      // If we have Google profile information, use it directly
      if (googleProfile) {
        // Create a user object using the Google profile information
        const userData: User = {
          user_id: googleProfile.email, // Use email as a unique identifier
          username: googleProfile.name,
          email: googleProfile.email,
          profile_image_url: googleProfile.picture,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          location: "No location set",
          // pets: mockPets,
          // bookings: mockBookings
        };

        setUserData(userData);
      } else {
        // If we don't have Google profile information, use a default user
        const userData: User = {
          user_id: "default-user",
          username: "Guest User",
          email: "guest@example.com",
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          location: "No location set",
          // pets: mockPets,
          // bookings: mockBookings
        };

        setUserData(userData);
      }
    } catch (err) {
      setUserError("Failed to fetch user data.");
      console.error("Error fetching user data:", err);
    } finally {
      setUserLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "bookings" && userData) {
      fetchBookings();
    }
  }, [activeTab, bookingsPage, userData]);

  async function fetchBookings() {
    if (!userData) return;

    setBookingsLoading(true);
    setBookingsError(null);

    try {
      const gatewayUrl =
        import.meta.env.GATEWAY_URL ||
        "https://petsitter-gateway-worker.limqijie53.workers.dev";

      const res = await fetch(
        `${gatewayUrl}/booking/get?userId=${userData.user_id}&limit=${reviewsLimit}&offset=${bookingsPage * reviewsLimit}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res}`);
      }

      const data = (await res.json()) as BookingApiResponse;

      console.log("Fetched bookings:", data);

      setBookings((prevBookings) =>
        bookingsPage === 0 ? data.bookings : [...prevBookings, ...data.bookings]
      );

      setHasMoreBookings(data.pagination.hasMore);
    } catch (err) {
      setBookingsError("Failed to fetch bookings.");
      console.error("Error fetching bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  }

  function getBookingStatus(start_date: string, end_date: string): string {
    const currentTime = new Date(); // Get current time
    const startTime = new Date(start_date); // Convert start_date to Date object
    const endTime = new Date(end_date); // Convert end_date to Date object

    if (currentTime < startTime) {
      return "Upcoming"; // If current time is before start_date
    } else if (currentTime >= startTime && currentTime < endTime) {
      return "Ongoing"; // If current time is between start_date and end_date
    } else {
      return "Completed"; // If current time is after or equals end_date
    }
  }

  // Helper function to process the reviews from API response
  function processFetchedReviews(reviews: Review[]): Review[] {
    return reviews.map((review) => ({
      ...review,
      reviewer_name: review.username, // Map username to reviewer_name
      reviewer_avatar: review.profile_image_url, // Map profile_image_url to reviewer_avatar
    }));
  }

  // Fetch reviews when the component mounts or when tab changes to reviews
  useEffect(() => {
    if (activeTab === "reviews" && userData) {
      fetchReviews();
    }
  }, [activeTab, reviewsPage, userData]);

  async function fetchReviews() {
    if (!userData) return;

    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const gatewayUrl =
        import.meta.env.GATEWAY_URL ||
        "https://petsitter-gateway-worker.limqijie53.workers.dev";

      const res = await fetch(
        `${gatewayUrl}/review/reviewee?revieweeId=bbf7fc583d4cd42846ae8bddd0a97759&limit=${reviewsLimit}&offset=${reviewsPage * reviewsLimit}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = (await res.json()) as ReviewsApiResponse;

      console.log("Fetched reviews:", data);

      // Process the reviews to extract user info for display
      const processedReviews = processFetchedReviews(data.reviews);

      // Update reviews state based on pagination
      setReviews((prevReviews) =>
        reviewsPage === 0
          ? processedReviews
          : [...prevReviews, ...processedReviews]
      );

      // Set hasMore flag based on API response
      setHasMoreReviews(data.pagination.hasMore);
    } catch (err) {
      setReviewsError("Failed to fetch reviews.");
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }

  const loadMoreBookings = () => {
    setBookingsPage((prevPage) => prevPage + 1);
  };

  // Function to load more reviews
  const loadMoreReviews = () => {
    setReviewsPage((prevPage) => prevPage + 1);
  };

  // Format date from ISO string
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  function formatBookingDate(dateString: string): string {
    const date = new Date(dateString.replace(" ", "T")); // Convert to Date object

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Loading state UI
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (userError || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">
              Error Loading Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userError || "Failed to load user data."}</p>
            <Button variant="outline" onClick={fetchUserData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={
                        googleProfile?.picture ||
                        userData.profile_image_url ||
                        "/placeholder.svg?height=150&width=150"
                      }
                      alt={userData.username}
                    />
                    <AvatarFallback>
                      {userData.username
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {googleProfile?.name || userData.username}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {googleProfile?.email || userData.email}
                  </p>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {formatMemberSince(userData.created_at)}
                  </p>
                  <div className="mt-2">
                    <Badge variant="default">
                      {userData.is_petsitter === 1
                        ? "Pet Owner & Sitter"
                        : "Pet Owner"}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 w-full flex items-center justify-center"
                    // TODO: edit profile
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    EDIT PROFILE
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    {userData.description || "No bio provided."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <div className="md:col-span-2">
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
                    {bookingsLoading && bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading bookings...</p>
                      </div>
                    ) : bookingsError ? (
                      <div className="text-center py-8">
                        <p className="text-red-500">{bookingsError}</p>
                        <Button
                          onClick={fetchBookings}
                          variant="outline"
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div
                            key={booking.booking_id}
                            className="flex items-start p-4 border rounded-lg"
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={booking.profile_image_url}
                                alt={booking.username}
                              />
                              <AvatarFallback>
                                {booking.petsitter_id.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">
                                    {booking.username}
                                  </h3>
                                  {/* <p className="text-sm text-muted-foreground">
                                  {booking.service}
                                </p> */}
                                </div>
                                <Badge
                                  variant={
                                    getBookingStatus(
                                      booking.start_date,
                                      booking.end_date
                                    ) === "Upcoming"
                                      ? "outline"
                                      : "secondary"
                                  }
                                >
                                  {getBookingStatus(
                                    booking.start_date,
                                    booking.end_date
                                  )}
                                </Badge>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {formatBookingDate(booking.start_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {hasMoreBookings && (
                          <div className="flex justify-center mt-4">
                            <Button
                              variant="outline"
                              onClick={loadMoreBookings}
                              disabled={bookingsLoading}
                            >
                              {bookingsLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                "Load More Bookings"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">
                          No bookings yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Book a petsitter to see your bookings here
                        </p>

                        <Button onClick={() => navigate({ to: `/` })}>
                          Find a Petsitter
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>
                      Reviews others have left about you
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {reviewsLoading && reviews.length === 0 ? (
                      <LoadingState />
                    ) : reviewsError ? (
                      <ErrorState error={reviewsError} onRetry={fetchReviews} />
                    ) : reviews.length > 0 ? (
                      <ReviewsList
                        reviews={reviews}
                        hasMoreReviews={hasMoreReviews}
                        isLoading={reviewsLoading}
                        onLoadMore={loadMoreReviews}
                      />
                    ) : (
                      <EmptyState />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
