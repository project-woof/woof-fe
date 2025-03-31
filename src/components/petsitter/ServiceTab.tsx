import { Card, CardContent } from "@/components/ui/card";
import { PawPrint } from "lucide-react";

interface PetsitterData {
  services: string[];
  hourlyRate: number;
}

interface ServicesTabProps {
  petsitterData: PetsitterData;
}

export function ServicesTab({ petsitterData }: ServicesTabProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
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
  );
}
