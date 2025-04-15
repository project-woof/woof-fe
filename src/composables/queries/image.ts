import { useQuery } from "@tanstack/react-query";
import { useImageAPI } from "../api/image";
import type { ImageList } from "@/types/image";


export const useImageQuery = () => {
	const { getImageKeys } = useImageAPI();

	function getImageKeysByUserId(userId: string) {
		const { data, isFetched } = useQuery<ImageList>({
			queryKey: ["getImageKeysByUserId", userId],
			queryFn: () => getImageKeys(userId),
		});
		return { data, isFetched };
	}


	return { getImageKeysByUserId, };
};
