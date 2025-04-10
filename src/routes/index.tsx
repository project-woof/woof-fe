import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useProfileQuery } from "@/composables/queries/profile";
import { PetsitterGallery } from "@/components/homepage/PetsittersGallery";
import { useAuth } from "@/context/authContext";
import { usePagination } from "@/context/paginationContext";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { userProfile } = useAuth();
	const { homePagination, setHomePagination } = usePagination();
	const limit = 9;
	const offset = (homePagination - 1) * limit;

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
				<Button
					variant="outline"
					size="sm"
					className="flex items-center gap-1 border-navy text-navy hover:bg-navy hover:text-cream"
				>
					<Filter className="h-4 w-4" />
					Filter
				</Button>
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
