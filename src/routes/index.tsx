import { createFileRoute, Link } from "@tanstack/react-router";
import { PetsitterCard } from "@/components/homepage/petsittercard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

const petsitters = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 4.8,
    reviews: 124,
    location: "Brooklyn, NY",
    distance: "0.8 miles away",
    price: "$45",
    image: "/placeholder.svg?height=300&width=300",
    services: ["Dog Walking", "Pet Sitting"],
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4.9,
    reviews: 89,
    location: "Manhattan, NY",
    distance: "1.2 miles away",
    price: "$50",
    image: "/placeholder.svg?height=300&width=300",
    services: ["Dog Walking", "Boarding", "Training"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 4.7,
    reviews: 56,
    location: "Queens, NY",
    distance: "2.5 miles away",
    price: "$40",
    image: "/placeholder.svg?height=300&width=300",
    services: ["Cat Sitting", "Pet Sitting"],
  },
  {
    id: 4,
    name: "David Wilson",
    rating: 4.6,
    reviews: 78,
    location: "Bronx, NY",
    distance: "3.1 miles away",
    price: "$35",
    image: "/placeholder.svg?height=300&width=300",
    services: ["Dog Walking", "Pet Sitting", "Boarding"],
  },
  {
    id: 5,
    name: "Jessica Lee",
    rating: 5.0,
    reviews: 42,
    location: "Brooklyn, NY",
    distance: "1.5 miles away",
    price: "$55",
    image: "/placeholder.svg?height=300&width=300",
    services: ["Dog Walking", "Training", "Pet Sitting"],
  },
  {
    id: 6,
    name: "Robert Smith",
    rating: 4.5,
    reviews: 63,
    location: "Manhattan, NY",
    distance: "2.0 miles away",
    price: "$48",
    image: "/placeholder.svg?height=300&width=300",
    services: ["Boarding", "Pet Sitting"],
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-navy">Petsitters Nearby</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-navy text-navy hover:bg-navy hover:text-cream"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {petsitters.map((petsitter) => (
            <PetsitterCard key={petsitter.id} petsitter={petsitter} />
          ))}
        </div>
      </main>
    </div>
  );
}
