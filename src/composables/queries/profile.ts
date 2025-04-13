import { useQuery } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { PetsitterProfile } from "@/types/profile";
import { ServiceTag } from "@/types/service_tags";

export const useProfileQuery = () => {
	const { getPetsitters, getPetsitterProfile } = useProfileAPI();

	function getPetsitterList(
		userLat: number | undefined,
		userLon: number | undefined,
		limit: number,
		offset: number,
		filters?: {
			distance?: number;
			priceMin?: number;
			priceMax?: number;
			services?: ServiceTag[];
			sortBy?: "distance" | "reviews" | "rating";
		},
	) {
		const { data, isFetched, error, refetch } = useQuery<PetsitterProfile[]>({
			queryKey: [
				"petsitters",
				userLat,
				userLon,
				limit,
				offset,
				// Include filter properties in query key to trigger refetch when filters change
				filters?.distance,
				filters?.priceMin,
				filters?.priceMax,
				filters?.services?.sort().join(","),
				filters?.sortBy,
			],
			queryFn: () => getPetsitters(userLat, userLon, limit, offset, filters),
			// Add specific select to ensure we always return an array even if backend has issues
			select: (data) => {
				// Guard against non-array data
				if (!data || !Array.isArray(data)) {
					console.error("Received non-array data from petsitters query:", data);
					return [];
				}
				return data;
			},
		});

		// Always return an array even if there's an error or undefined data
		return {
			data: data || [],
			isFetched,
			error,
			refetch,
		};
	}

	function getPetsitterProfileById(
		userId: string,
		userLat: number | undefined,
		userLon: number | undefined,
	) {
		const { data, isFetched, isError, error } = useQuery<PetsitterProfile>({
			queryKey: ["petsitters", userId, userLat, userLon],
			queryFn: () => getPetsitterProfile(userId, userLat, userLon),
		});
		return { data, isFetched, isError, error };
	}

	return { getPetsitterList, getPetsitterProfileById };
};
