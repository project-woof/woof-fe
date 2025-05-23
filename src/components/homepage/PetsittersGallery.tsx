import type { PetsitterProfile } from "@/types/profile";
import { PetsitterCard } from "@/components/homepage/PetsitterCard";

interface PetsitterGalleryProps {
	petsitters: PetsitterProfile[] | undefined;
	isFetched: boolean;
}

export function PetsitterGallery({ petsitters = [] }: PetsitterGalleryProps) {
	// With the improved query, we should always get an array, but keep a defensive check
	const petsitterArray = Array.isArray(petsitters) ? petsitters : [];
	
	if (petsitterArray.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-navy text-lg">No petsitters found nearby.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{petsitterArray.map((petsitter) => (
				<PetsitterCard key={petsitter.id} petsitter={petsitter} />
			))}
		</div>
	);
}
