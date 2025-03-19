import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Filter } from "lucide-react";

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
            <Link to="/petsitter/$id" params={{ id: petsitter.id.toString() }}>
              <Card className="h-full hover:shadow-md transition-shadow border-beige bg-cream">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={petsitter.image || "/placeholder.svg"}
                    alt={petsitter.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-navy">
                        {petsitter.name}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-navy/70">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{petsitter.distance}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium text-navy">
                        {petsitter.rating}
                      </span>
                      <span className="text-navy/70 text-sm ml-1">
                        ({petsitter.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {petsitter.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-block bg-beige text-navy text-xs px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full flex justify-between items-center">
                    <span className="font-semibold text-navy">
                      {petsitter.price}
                      <span className="text-navy/70 font-normal">/hour</span>
                    </span>
                    <Button
                      size="sm"
                      className="bg-navy hover:bg-navy-light text-cream"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
