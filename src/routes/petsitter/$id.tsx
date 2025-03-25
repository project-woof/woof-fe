import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Star,
  MapPin,
  Clock,
  CalendarIcon,
  MessageSquare,
  Heart,
  Share2,
  PawPrint,
} from "lucide-react";

export const Route = createFileRoute("/petsitter/$id")({
  component: Petsitter,
});

const petsitterData = {
  id: 1,
  name: "Sarah Johnson",
  rating: 4.8,
  reviews: 124,
  location: "Brooklyn, NY",
  distance: "0.8 miles away",
  price: "$45",
  hourlyRate: 45,
  bio: "Professional dog walker and pet sitter with over 5 years of experience. I love animals and will treat your pets like my own. Certified in pet first aid and CPR.",
  services: [
    "Dog Walking",
    "Pet Sitting",
    "Overnight Care",
    "Medication Administration",
  ],
  availability: "Mon-Fri: 8am-6pm, Weekends: 10am-4pm",
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  reviewsList: [
    {
      id: 1,
      user: "John D.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Sarah was amazing with my dog Max! She sent photos throughout the day and was very responsive. Will definitely book again.",
    },
    {
      id: 2,
      user: "Emma S.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 month ago",
      comment:
        "Very professional and caring. My cat was well taken care of while I was away.",
    },
    {
      id: 3,
      user: "Michael T.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 months ago",
      comment:
        "Sarah is the best! My dogs love her and are always excited when she comes over. Highly recommend!",
    },
  ],
};

function Petsitter() {
  // const { id } = useParams({ from: "/petsitter/$id" });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [hours, setHours] = useState<number>(2);
  const [totalPrice, setTotalPrice] = useState<number>(
    petsitterData.hourlyRate * 2
  );

  // Mock time slots
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];
  async function createBooking() {
    try {
      const gatewayUrl = import.meta.env.GATEWAY_URL || "https://petsitter-gateway-worker.limqijie53.workers.dev";
      
      const mockBookingData = {
        petsitter_id: "uuid-user3",
        petowner_id: "f79a5f0e390bfb69beb17a67a100952f",
        start_date: "2025-05-10 12:00:00",
        end_date: "2025-05-15 13:00:00"
      };

      const res = await fetch(
        `${gatewayUrl}/booking/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(mockBookingData)
        }
      );

      const responseData = await res.json();
      console.log("Booking created:", responseData);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

    } catch (err) {
      
    }
  }

  const updateTotalPrice = (newHours: number) => {
    setHours(newHours);
    setTotalPrice(petsitterData.hourlyRate * newHours);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="col-span-2">
                <img
                  src={petsitterData.images[0] || "/placeholder.svg"}
                  alt={petsitterData.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              <div>
                <img
                  src={petsitterData.images[1] || "/placeholder.svg"}
                  alt={petsitterData.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <div>
                <img
                  src={petsitterData.images[2] || "/placeholder.svg"}
                  alt={petsitterData.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Petsitter Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">{petsitterData.name}</h1>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{petsitterData.rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({petsitterData.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {petsitterData.location} • {petsitterData.distance}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      About {petsitterData.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {petsitterData.bio}
                    </p>

                    <h3 className="text-lg font-semibold mb-2">Availability</h3>
                    <div className="flex items-start mb-4">
                      <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{petsitterData.availability}</span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{petsitterData.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Services Offered
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {petsitterData.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 border rounded-lg"
                        >
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <PawPrint className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{service}</h4>
                            <p className="text-sm text-muted-foreground">
                              Starting at ${petsitterData.hourlyRate}/hour
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Reviews</h3>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">
                          {petsitterData.rating}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          ({petsitterData.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {petsitterData.reviewsList.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage
                                  src={review.avatar}
                                  alt={review.user}
                                />
                                <AvatarFallback>
                                  {review.user.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{review.user}</h4>
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">
                    ${petsitterData.hourlyRate}{" "}
                    <span className="text-muted-foreground text-base font-normal">
                      /hour
                    </span>
                  </h3>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Select Date
                  </h4>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-3"
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Select Time
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={
                          selectedTimeSlot === time ? "default" : "outline"
                        }
                        className="text-sm"
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center text-navy">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration
                  </h4>
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="hours" className="text-navy">
                      Hours:
                    </Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none border-beige text-navy"
                        onClick={() => hours > 1 && updateTotalPrice(hours - 1)}
                      >
                        <span>-</span>
                      </Button>
                      <Input
                        id="hours"
                        type="number"
                        min="1"
                        value={hours}
                        onChange={(e) =>
                          updateTotalPrice(Number.parseInt(e.target.value) || 1)
                        }
                        
                        className="h-8 w-16 rounded-none text-center border-x-0 border-beige"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none border-beige text-navy"
                        onClick={() =>
                          updateTotalPrice(hours + 1)
                        }
                      >
                        <span>+</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-beige/30 rounded-md">
                    <div className="flex justify-between items-center text-navy">
                      <span>Hourly Rate:</span>
                      <span>${petsitterData.hourlyRate}/hour</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-navy">
                      <span>Duration:</span>
                      <span>
                        {hours} hour{hours !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="border-t border-beige my-2"></div>
                    <div className="flex justify-between items-center font-semibold text-navy">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 mb-3 bg-navy hover:bg-navy-light text-cream">
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
