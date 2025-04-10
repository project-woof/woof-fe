import type { PetsitterProfile } from "@/types/profile";
import { fetcher } from "@/util/fetcher";

export function useProfileAPI() {
	const getPetsitters = async (
		userLat: number | undefined,
		userLon: number | undefined,
		limit: number,
		offset: number,
	) => {
		const params = new URLSearchParams();
		if (userLat !== undefined) {
			params.append("userLat", userLat.toString());
		}
		if (userLon !== undefined) {
			params.append("userLon", userLon.toString());
		}
		params.append("limit", limit.toString());
		params.append("offset", offset.toString());

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
