import type { PetsitterProfile } from "@/types/profile";
import { PetsitterCard } from "@/components/homepage/PetsitterCard";

interface PetsitterGalleryProps {
	petsitters: PetsitterProfile[] | undefined;
	isFetched: boolean;
}

export function PetsitterGallery({ petsitters }: PetsitterGalleryProps) {
	// Handle all possible edge cases to prevent the "map is not a function" error
	if (!petsitters) {
		return (
			<div className="text-center py-12">
				<p className="text-navy text-lg">No petsitters found nearby.</p>
			</div>
		);
	}
	
	// Ensure petsitters is an array before trying to map over it
	if (!Array.isArray(petsitters) || petsitters.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-navy text-lg">No petsitters found nearby.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{petsitters.map((petsitter) => (
				<PetsitterCard key={petsitter.id} petsitter={petsitter} />
			))}
		</div>
	);
}
