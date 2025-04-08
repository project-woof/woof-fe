import type { PetsitterProfile } from "@/types/petsitter";
import { fetcher } from "@/util/fetcher";

export function useProfileAPI() {
    const getPetsitters = async () => {
        const response = await fetcher(`/profile/getPetsitterList`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
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

    return { getPetsitters, getPetsitterProfile };
}
