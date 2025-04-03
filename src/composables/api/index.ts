import type { PetsitterResponse } from "@/types/petsitter";
import { fetcher } from "@/util/fetcher";

export function useIndexAPI() {
	const getAllPetsitters = async () => {
		const response = await fetcher(`/profile/getPetsitterList`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const petsittersRes = await response.json<PetsitterResponse[]>();
		return petsittersRes;
	};

	return { getAllPetsitters };
}
