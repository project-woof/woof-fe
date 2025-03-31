import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

interface PetsitterData {
  name: string;
  bio: string;
  availability: string;
  location: string;
}

interface AboutTabProps {
  petsitterData: PetsitterData;
}

export function AboutTab({ petsitterData }: AboutTabProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">
          About {petsitterData.name}
        </h3>
        <p className="text-muted-foreground mb-4">{petsitterData.bio}</p>

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
  );
}
