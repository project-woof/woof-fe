import { useQuery } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { PetsitterProfile } from "@/types/petsitter";

const { getPetsitters, getPetsitterProfile } = useProfileAPI();

export const useProfileQuery = () => {
  function getPetsitterList() {
    const { data, isFetched } = useQuery<PetsitterProfile[]>({
      queryKey: ["petsitters"],
      queryFn: () => getPetsitters(),
    });
    return { data, isFetched };
  }

  function getPetsitterProfileById(userId: string) {
    const { data, isFetched, isError, error } = useQuery<PetsitterProfile>({
      queryKey: ["petsitters", userId],
      queryFn: () => getPetsitterProfile(userId),
    });
    return { data, isFetched, isError, error };
  }

  return { getPetsitterList, getPetsitterProfileById };
};
