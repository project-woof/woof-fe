import { useState } from "react";
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
import { Star, MapPin, Calendar, Edit, PawPrint } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "New York, NY",
  bio: "Pet lover and proud owner of Max, a golden retriever. Always looking for reliable pet sitters when I travel for work.",
  memberSince: "January 2023",
  avatar: "/placeholder.svg?height=150&width=150",
  pets: [
    {
      id: 1,
      name: "Max",
      type: "Dog",
      breed: "Golden Retriever",
      age: 3,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
  bookings: [
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
  ],
  reviews: [
    {
      id: 1,
      petsitter: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "May 16, 2023",
      comment:
        "Sarah was amazing with Max! She sent photos throughout the day and was very responsive. Will definitely book again.",
    },
    {
      id: 2,
      petsitter: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "June 11, 2023",
      comment:
        "Michael was great with Max. He was on time and Max seemed happy after his walk.",
    },
  ],
};

function Profile() {
  const [activeTab, setActiveTab] = useState("pets");

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
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {userData.memberSince}
                  </p>

                  <Button
                    variant="outline"
                    className="mt-4 w-full flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    {userData.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pets">My Pets</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="pets" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>My Pets</CardTitle>
                      <CardDescription>
                        Manage your pets' information
                      </CardDescription>
                    </div>
                    <Button size="sm">Add Pet</Button>
                  </CardHeader>
                  <CardContent>
                    {userData.pets.length > 0 ? (
                      <div className="space-y-4">
                        {userData.pets.map((pet) => (
                          <div
                            key={pet.id}
                            className="flex items-start p-4 border rounded-lg"
                          >
                            <img
                              src={pet.image || "/placeholder.svg"}
                              alt={pet.name}
                              className="h-16 w-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-medium">{pet.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {pet.breed}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {pet.age} years old
                              </p>
                              <div className="mt-2">
                                <Badge variant="outline" className="mr-2">
                                  {pet.type}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">
                          No pets added yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Add your pets to find the perfect sitter
                        </p>
                        <Button>Add Your First Pet</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                    <CardDescription>
                      View your past and upcoming bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userData.bookings.length > 0 ? (
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
                                        i < booking.rating
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
                      Reviews you've left for petsitters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userData.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {userData.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage
                                    src={review.avatar}
                                    alt={review.petsitter}
                                  />
                                  <AvatarFallback>
                                    {review.petsitter.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {review.petsitter}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {review.date}
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
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">
                          No reviews yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Leave a review for a petsitter you've booked
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
