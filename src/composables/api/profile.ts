import type { PetsitterProfile, User } from "@/types/profile";
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

	const getPetsitterProfile = async (userId: string) => {
		const response = await fetcher(`/profile/getPetsitterProfile/${userId}`, {
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

	const updateProfile = async (booking: Partial<User>) => {
		const response = await fetcher("/profile/updateProfile", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(booking),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.body;
	};

	return { getPetsitters, getPetsitterProfile, updateProfile };
}
