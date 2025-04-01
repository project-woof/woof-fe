import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Clock,
  CalendarIcon,
  MessageSquare,
} from "lucide-react";
import { PetsitterProfile } from "@/components/petsitter/PetsitterProfile";

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
      petsitter: "John D.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Sarah was amazing with my dog Max! She sent photos throughout the day and was very responsive. Will definitely book again.",
    },
    {
      id: 2,
      petsitter: "Emma S.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 month ago",
      comment:
        "Very professional and caring. My cat was well taken care of while I was away.",
    },
    {
      id: 3,
      petsitter: "Michael T.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 months ago",
      comment:
        "Sarah is the best! My dogs love her and are always excited when she comes over. Highly recommend!",
    },
  ],
};

interface BookingData {
  petsitter_id: string;
  petowner_id: string;
  start_date: string;
  end_date: string;
}

async function createBooking() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;

    const bookingData: BookingData = {
      petsitter_id: "uuid-user2",
      petowner_id: "bbf7fc583d4cd42846ae8bddd0a97759",
      start_date: "2025-05-10 12:00:00",
      end_date: "2025-05-15 13:00:00",
    };

    const res = await fetch(`${apiUrl}/booking/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    const responseData = await res.json();
    console.log("Booking created:", responseData);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  } catch (err) {}
}

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

  const updateTotalPrice = (newHours: number) => {
    setHours(newHours);
    setTotalPrice(petsitterData.hourlyRate * newHours);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PetsitterProfile
            petsitterData={petsitterData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

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
                        onClick={() => updateTotalPrice(hours + 1)}
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

                <Button
                  className="w-full mt-4 mb-3 bg-navy hover:bg-navy-light text-cream"
                  onClick={() => createBooking()}
                >
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
