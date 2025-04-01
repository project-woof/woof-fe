import { useQuery } from "@tanstack/react-query";
import { useIndexAPI } from "@/composables/api/index";
import type { PetsitterResponse } from "@/types/petsitter";

const { getAllPetsitters } = useIndexAPI();

export const useIndexQuery = () => {
  function getPetsitterList() {
    const { data, isFetched } = useQuery<PetsitterResponse[]>({
      queryKey: ["petsitters"],
      queryFn: () => getAllPetsitters(),
    });
    return { data, isFetched };
  }

  return { getPetsitterList };
};
