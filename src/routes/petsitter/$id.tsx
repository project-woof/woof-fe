import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PetsitterProfile } from "@/components/petsitter/PetsitterProfile";
import { BookingCard } from "@/components/petsitter/BookingCard";

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

function Petsitter() {
  // const { id } = useParams({ from: "/petsitter/$id" });
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Petsitter Profile */}
          <PetsitterProfile
            petsitterData={petsitterData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Right: Booking Card */}
          <BookingCard petsitterData={petsitterData} />
        </div>
      </main>
    </div>
  );
}
