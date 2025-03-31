import { Link } from "@tanstack/react-router"
import { MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Petsitter {
  id: string | number
  name: string
  image?: string
  distance: string
  rating: number
  reviews: number
  services: string[]
  price: string
  location?: string
}

interface PetsitterCardProps {
  petsitter: Petsitter
}

export function PetsitterCard({ petsitter }: PetsitterCardProps) {
  return (
    <Link to="/petsitter/$id" params={{ id: petsitter.id.toString() }} >
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
              <h3 className="font-semibold text-lg text-navy">{petsitter.name}</h3>
              <div className="flex items-center mt-1 text-sm text-navy/70">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{petsitter.distance}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium text-navy">{petsitter.rating}</span>
              <span className="text-navy/70 text-sm ml-1">({petsitter.reviews})</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {petsitter.services.map((service, index) => (
              <span key={index} className="inline-block bg-beige text-navy text-xs px-2 py-1 rounded-full">
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
            <Button size="sm" className="bg-navy hover:bg-navy-light text-cream">
              View Profile
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}