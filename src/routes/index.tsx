import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useIndexQuery } from "@/composables/queries";
import { PetsitterGallery } from "@/components/index/PetsittersGallery";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { getPetsitterList } = useIndexQuery();
  const { data: petsittersData, isFetched: petsittersFetched } =
    getPetsitterList();
    
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

        <PetsitterGallery petsitters={petsittersData} isFetched={petsittersFetched} />
      </main>
    </div>
  );
}
