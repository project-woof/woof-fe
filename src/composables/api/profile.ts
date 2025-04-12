import type { PetsitterProfile } from "@/types/profile";
import { ServiceTag } from "@/types/service_tags";
import { fetcher } from "@/util/fetcher";

export function useProfileAPI() {
	const getPetsitters = async (
		userLat: number | undefined,
		userLon: number | undefined,
		limit: number,
		offset: number,
		filters?: {
			distance?: number;
			priceMin?: number;
			priceMax?: number;
			services?: ServiceTag[];
			sortBy?: 'distance' | 'reviews' | 'rating';
		}
	) => {
		const params = new URLSearchParams();
		
		// Add location parameters
		if (userLat !== undefined) {
			params.append("userLat", userLat.toString());
		}
		if (userLon !== undefined) {
			params.append("userLon", userLon.toString());
		}
		
		// Add pagination parameters
		params.append("limit", limit.toString());
		params.append("offset", offset.toString());

		// Add filter parameters
		if (filters) {
			if (filters.distance !== undefined) {
				params.append("distance", filters.distance.toString());
			}

			if (filters.priceMin !== undefined) {
				params.append("priceMin", filters.priceMin.toString());
			}

			if (filters.priceMax !== undefined) {
				params.append("priceMax", filters.priceMax.toString());
			}

			if (filters.services && filters.services.length > 0) {
				params.append("services", filters.services.join(','));
			}

			if (filters.sortBy) {
				params.append("sortBy", filters.sortBy);
			}
		}

		const response = await fetcher(
			`/profile/getPetsitterList?${params.toString()}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			},
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const petsittersRes = await response.json<PetsitterProfile[]>();
		return petsittersRes;
	};

	const getPetsitterProfile = async (
		userId: string,
		userLat: number | undefined,
		userLon: number | undefined
	) => {
		const params = new URLSearchParams();
		if (userLat !== undefined) {
			params.append("userLat", userLat.toString());
		}
		if (userLon !== undefined) {
			params.append("userLon", userLon.toString());
		}

		const response = await fetcher(`/profile/getPetsitterProfile/${userId}?${params.toString()}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const petsittersRes = await response.json<PetsitterProfile>();
		return petsittersRes;
	};

	const updateProfile = async (profileData: Partial<PetsitterProfile>) => {
		const response = await fetcher("/profile/updateProfile", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(profileData),
		});
		if (!response.ok) {
			const errorData = await response.text();
			console.error("Profile update failed:", errorData);
			throw new Error(errorData || "Network response was not ok");
		}
		return true; // Return a simple boolean for success
	};

	return { getPetsitters, getPetsitterProfile, updateProfile };
}