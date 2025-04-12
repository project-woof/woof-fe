import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useProfileQuery } from "@/composables/queries/profile";
import { PetsitterGallery } from "@/components/homepage/PetsittersGallery";
import { useAuth } from "@/context/authContext";
import { usePagination } from "@/context/paginationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceTag } from "@/types/service_tags";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { userProfile } = useAuth();
  const { homePagination, setHomePagination } = usePagination();
  const limit = 9;
  const offset = (homePagination - 1) * limit;

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [distanceRange, setDistanceRange] = useState([10]);
  const [priceRange, setPriceRange] = useState([50, 150]);
  const [sortBy, setSortBy] = useState("distance");
  const [selectedServices, setSelectedServices] = useState<ServiceTag[]>([]);

  useEffect(() => {
    setHomePagination(1);
  }, [setHomePagination]);

  const { getPetsitterList } = useProfileQuery();
  const { data: petsittersData, isFetched: petsittersFetched, error } =
    getPetsitterList(
      userProfile ? userProfile.latitude : undefined,
      userProfile ? userProfile?.longitude : undefined,
      limit,
      offset,
    );

  // Log any errors to help with debugging
  if (error) {
    console.error("Error fetching petsitters:", error);
  }

  function handlePrevPage() {
    if (homePagination > 1) {
      setHomePagination((prev) => prev - 1);
    }
  }

  function handleNextPage() {
    setHomePagination((prev) => prev + 1);
  }

  function applyFilters() {
    // This will be implemented later
    console.log("Applying filters:", { 
      distanceRange, 
      priceRange,
      sortBy,
      selectedServices
    });
    setIsFilterOpen(false);
  }

  function toggleService(service: ServiceTag) {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  }

  if (!petsittersFetched) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-navy">Loading petsitters...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Petsitters Nearby</h1>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-navy text-navy hover:bg-navy hover:text-cream"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Card className="border-navy">
              <CardHeader className="bg-cream border-b border-navy">
                <CardTitle className="text-navy">Filter Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {/* Distance Range Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="distance" className="text-navy">Distance</Label>
                    <span className="text-sm text-navy">
                      {distanceRange[0]} km
                    </span>
                  </div>
                  <Slider
                    id="distance"
                    min={1}
                    max={50}
                    step={1}
                    value={distanceRange}
                    onValueChange={setDistanceRange}
                    className="text-navy"
                  />
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="price" className="text-navy">Price Range</Label>
                    <span className="text-sm text-navy">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    id="price"
                    min={10}
                    max={300}
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="text-navy"
                  />
                </div>

                {/* Sort by Reviews */}
                <div className="space-y-2">
                  <Label className="text-navy">Sort By</Label>
                  <RadioGroup 
                    value={sortBy} 
                    onValueChange={setSortBy}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="distance" id="sort-distance" className="border-navy text-navy" />
                      <Label htmlFor="sort-distance" className="text-navy">Distance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="most-reviews" id="sort-reviews" className="border-navy text-navy" />
                      <Label htmlFor="sort-reviews" className="text-navy">Most Reviews</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="highest-rated" id="sort-rating" className="border-navy text-navy" />
                      <Label htmlFor="sort-rating" className="text-navy">Highest Rated</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Services Filter using ServiceTag enum */}
                <div className="space-y-2">
                  <Label className="text-navy">Services</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dog-sitting" 
                        checked={selectedServices.includes(ServiceTag.DOG_SITTING)}
                        onCheckedChange={() => toggleService(ServiceTag.DOG_SITTING)}
                        className="border-navy text-navy"
                      />
                      <Label htmlFor="dog-sitting" className="text-navy text-sm">{ServiceTag.DOG_SITTING}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cat-sitting" 
                        checked={selectedServices.includes(ServiceTag.CAT_SITTING)}
                        onCheckedChange={() => toggleService(ServiceTag.CAT_SITTING)}
                        className="border-navy text-navy"
                      />
                      <Label htmlFor="cat-sitting" className="text-navy text-sm">{ServiceTag.CAT_SITTING}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dog-walking" 
                        checked={selectedServices.includes(ServiceTag.DOG_WALKING)}
                        onCheckedChange={() => toggleService(ServiceTag.DOG_WALKING)}
                        className="border-navy text-navy"
                      />
                      <Label htmlFor="dog-walking" className="text-navy text-sm">{ServiceTag.DOG_WALKING}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pet-daycare" 
                        checked={selectedServices.includes(ServiceTag.PET_DAYCARE)}
                        onCheckedChange={() => toggleService(ServiceTag.PET_DAYCARE)}
                        className="border-navy text-navy"
                      />
                      <Label htmlFor="pet-daycare" className="text-navy text-sm">{ServiceTag.PET_DAYCARE}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="long-term-care" 
                        checked={selectedServices.includes(ServiceTag.LONG_TERM_CARE)}
                        onCheckedChange={() => toggleService(ServiceTag.LONG_TERM_CARE)}
                        className="border-navy text-navy"
                      />
                      <Label htmlFor="long-term-care" className="text-navy text-sm">{ServiceTag.LONG_TERM_CARE}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pet-boarding" 
                        checked={selectedServices.includes(ServiceTag.PET_BOARDING)}
                        onCheckedChange={() => toggleService(ServiceTag.PET_BOARDING)}
                        className="border-navy text-navy"
                      />
                      <Label htmlFor="pet-boarding" className="text-navy text-sm">{ServiceTag.PET_BOARDING}</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-navy pt-4">
                <Button 
                  onClick={applyFilters} 
                  className="w-full bg-navy text-cream hover:bg-cream hover:text-navy hover:border-navy"
                >
                  Apply Filters
                </Button>
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      <PetsitterGallery
        petsitters={petsittersData}
        isFetched={petsittersFetched}
      />

      {/* Pagination Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={homePagination === 1}
        >
          Previous
        </Button>
        <span className="text-navy">Page {homePagination}</span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={!Array.isArray(petsittersData) || petsittersData.length !== limit}
        >
          Next
        </Button>
      </div>
    </main>
  );
}