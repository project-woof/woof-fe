import { useQuery } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { PetsitterProfile } from "@/types/profile";

const { getPetsitters, getPetsitterProfile } = useProfileAPI();

export const useProfileQuery = () => {
	function getPetsitterList(
		userLat: number | undefined,
		userLon: number | undefined,
		limit: number,
		offset: number,
	) {
		const { data, isFetched, error } = useQuery<PetsitterProfile[]>({
			queryKey: ["petsitters", userLat, userLon, limit, offset],
			queryFn: () => getPetsitters(userLat, userLon, limit, offset),
			// Add specific select to ensure we always return an array even if backend has issues
			select: (data) => {
				// Guard against non-array data
				if (!data || !Array.isArray(data)) {
					console.error("Received non-array data from petsitters query:", data);
					return [];
				}
				return data;
			}
		});
		
		// Always return an array even if there's an error or undefined data
		return { 
			data: data || [], 
			isFetched,
			error 
		};
	}

	function getPetsitterProfileById(
		userId: string,
		userLat: number | undefined,
		userLon: number | undefined
	) {
		const { data, isFetched, isError, error } = useQuery<PetsitterProfile>({
			queryKey: ["petsitters", userId, userLat, userLon],
			queryFn: () => getPetsitterProfile(userId, userLat, userLon),
		});
		return { data, isFetched, isError, error };
	}

	return { getPetsitterList, getPetsitterProfileById };
};
