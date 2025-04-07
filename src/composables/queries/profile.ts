import { useQuery } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { PetsitterProfile } from "@/types/petsitter";

const { getAllPetsitters } = useProfileAPI();

export const useProfileQuery = () => {
  function getPetsitterList() {
    const { data, isFetched } = useQuery<PetsitterProfile[]>({
      queryKey: ["petsitters"],
      queryFn: () => getAllPetsitters(),
    });
    return { data, isFetched };
  }

  return { getPetsitterList };
};
