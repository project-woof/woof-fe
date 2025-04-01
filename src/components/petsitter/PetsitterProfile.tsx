import type { PetsitterData } from "@/types/petsitter";
import { Heart, MapPin, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTab } from "@/components/petsitter/ServiceTab";
import { ReviewsTab } from "@/components/petsitter/ReviewsTab";
import { AboutTab } from "@/components/petsitter/AboutTab";

interface PetsitterProfileProps {
  petsitterData: PetsitterData;
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export function PetsitterProfile({
  petsitterData,
  activeTab,
  setActiveTab,
}: PetsitterProfileProps) {
  return (
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4">
          <AboutTab petsitterData={petsitterData} />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <ServicesTab petsitterData={petsitterData} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <ReviewsTab petsitterData={petsitterData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
