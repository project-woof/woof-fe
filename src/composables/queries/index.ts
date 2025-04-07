import { useQuery } from "@tanstack/react-query";
import { useIndexAPI } from "@/composables/api/index";
import type { PetsitterProfile } from "@/types/petsitter";

const { getAllPetsitters } = useIndexAPI();

export const useIndexQuery = () => {
  function getPetsitterList() {
    const { data, isFetched } = useQuery<PetsitterProfile[]>({
      queryKey: ["petsitters"],
      queryFn: () => getAllPetsitters(),
    });
    return { data, isFetched };
  }

  return { getPetsitterList };
};
