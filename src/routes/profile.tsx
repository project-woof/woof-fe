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
import { Star, MapPin, Calendar, Edit, Loader2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

// Define interfaces for type safety
interface Booking {
  id: number;
  petsitter: string;
  avatar: string;
  service: string;
  date: string;
  status: string;
  rating: number | null;
}

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  image: string;
}

interface User {
  user_id: string;
  username: string;
  email: string;

  profile_image_url?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_petsitter?: number; // 0: false, 1: true
  created_at: string;
  last_updated: string;
  location?: string; // We'll derive this from latitude/longitude or use a placeholder
  pets?: Pet[]; // For now we'll leave this empty or add mock data
  bookings?: Booking[]; // For now we'll leave this empty or add mock data
}

// Updated Review interface to match API response format with joined user data
interface Review {
  review_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  last_updated: string;
  // User fields from the join
  username: string;
  profile_image_url: string;
}

// Updated API response interface to match the structure
interface ReviewsApiResponse {
  reviews: Review[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface HealthResponse {
  status: string;
  timestamp: string;
}

// Mock data for bookings and pets
const mockBookings: Booking[] = [
  {
    id: 1,
    petsitter: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    service: "Pet Sitting",
    date: "May 15, 2023",
    status: "Completed",
    rating: 5,
  },
  {
    id: 2,
    petsitter: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    service: "Dog Walking",
    date: "June 10, 2023",
    status: "Completed",
    rating: 4,
  },
  {
    id: 3,
    petsitter: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    service: "Pet Sitting",
    date: "July 5, 2023",
    status: "Upcoming",
    rating: null,
  },
];

const mockPets: Pet[] = [
  {
    id: 1,
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    age: 3,
    image: "/placeholder.svg?height=100&width=100",
  },
];

function Profile() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  
  const reviewsLimit = 5;
  
  // Assuming we have a user ID - in a real app, this would come from auth context or similar
  const userId = "uuid-user3"; // Replace with actual user ID or get from auth context

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    setUserLoading(true);
    setUserError(null);

    try {
      // const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || "http://localhost:61931";
      const res = await fetch(`http://localhost:61931/get?id=${userId}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json() as User;
      
      // Enhance the user data with mock data for now
      // In a real app, you would fetch pets and bookings from their respective endpoints
      const enhancedUserData: User = {
        ...data,
        location: data.latitude && data.longitude 
          ? `${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}` 
          : "No location set",
        pets: mockPets, 
        bookings: mockBookings
      };

      setUserData(enhancedUserData);
    } catch (err) {
      setUserError("Failed to fetch user data.");
      console.error("Error fetching user data:", err);
    } finally {
      setUserLoading(false);
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
      // const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || "http://localhost:8787";
      
      const res = await fetch(
        `http://localhost:8787/reviewee?revieweeId=${userData.user_id}&limit=${reviewsLimit}&offset=${reviewsPage * reviewsLimit}`
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

  async function handleHealthCheck() {
    setLoading(true);
    setError(null);

    try {
      const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || "http://localhost:8787";
      const res = await fetch(`${gatewayUrl}/health`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = (await res.json()) as HealthResponse;
      setHealth(data);
    } catch (err) {
      setError("Failed to fetch health data.");
      console.error("Error fetching health data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Function to load more reviews
  const loadMoreReviews = () => {
    setReviewsPage((prevPage) => prevPage + 1);
  };

  // Format date from ISO string
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

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
            <CardTitle className="text-red-500">Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userError || "Failed to load user data."}</p>
            <Button 
              variant="outline" 
              onClick={fetchUserData} 
              className="mt-4"
            >
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
                      src={userData.profile_image_url || "/placeholder.svg?height=150&width=150"} 
                      alt={userData.username} 
                    />
                    <AvatarFallback>
                      {userData.username
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userData.username}</h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {formatMemberSince(userData.created_at)}
                  </p>
                  <div className="mt-2">
                    {storedProfile.userType && (
                      <Badge variant="default">
                        {storedProfile.userType === 'both' ? 'Pet Owner & Sitter' : 'Pet Owner'}
                      </Badge>
                    )}
                    
                    {userData.is_petsitter === 1 && !storedProfile.userType && (
                      <Badge variant="secondary">Pet Sitter</Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 w-full flex items-center justify-center"
                    onClick={handleHealthCheck}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {loading ? "Loading..." : "Edit Profile"}
                  </Button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  {health && (
                    <div className="mt-2 text-sm">
                      <p>Status: {health.status}</p>
                      <p>Timestamp: {health.timestamp}</p>
                    </div>
                  )}
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
                    {userData.bookings && userData.bookings.length > 0 ? (
                      <div className="space-y-4">
                        {userData.bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-start p-4 border rounded-lg"
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={booking.avatar}
                                alt={booking.petsitter}
                              />
                              <AvatarFallback>
                                {booking.petsitter.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">
                                    {booking.petsitter}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.service}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    booking.status === "Upcoming"
                                      ? "outline"
                                      : "secondary"
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{booking.date}</span>
                              </div>
                              {booking.rating !== null && (
                                <div className="flex items-center mt-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < booking.rating!
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
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
                        <Button>Find a Petsitter</Button>
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
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading reviews...</p>
                      </div>
                    ) : reviewsError ? (
                      <div className="text-center py-8">
                        <p className="text-red-500">{reviewsError}</p>
                        <Button
                          onClick={fetchReviews}
                          variant="outline"
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.review_id}
                            className="p-4 border rounded-lg"
                          >
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
                                  <AvatarFallback>
                                    {review.username?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {review.username || "Anonymous"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      review.created_at
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                      review.created_at
                                    ).toLocaleTimeString("en-US", {
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

                        {hasMoreReviews && (
                          <div className="flex justify-center mt-4">
                            <Button
                              variant="outline"
                              onClick={loadMoreReviews}
                              disabled={reviewsLoading}
                            >
                              {reviewsLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                "Load More Reviews"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">
                          No reviews yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          There are no reviews for you yet
                        </p>
                      </div>
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