import { useQuery } from "@tanstack/react-query";
import { useImageAPI } from "../api/image";
import type { ImageList } from "@/types/image";


export const useImageQuery = () => {
	const { getImageKeys, getProfileKey } = useImageAPI();

	function getProfileKeyByUserId(userId: string) {
		const { data, isFetched } = useQuery<ImageList>({
			queryKey: ["getProfilekeyByUserId", userId],
			queryFn: () => getProfileKey(userId),
		});
		return { data, isFetched };
	}

	function getImageKeysByUserId(userId: string) {
		const { data, isFetched } = useQuery<ImageList>({
			queryKey: ["getImageKeysByUserId", userId],
			queryFn: () => getImageKeys(userId),
		});
		return { data, isFetched };
	}


	return { getProfileKeyByUserId, getImageKeysByUserId, };
};
