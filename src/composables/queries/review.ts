import { useQuery } from "@tanstack/react-query";
import type { Review } from "@/types/review";
import { useReviewAPI } from "@/composables/api/review";

export const useReviewQuery = () => {
	const { getReviewsByReviewer, getReviewsByReviewee } = useReviewAPI();

	function getReviewsByReviewerId(
		userId: string,
		limit: number,
		offset: number,
    ) {
		const { data, isFetched } = useQuery<Review[]>({
			queryKey: ["getReviewsByReviewerId", userId, limit, offset],
			queryFn: () => getReviewsByReviewer(userId, limit, offset),
		});
		return { data, isFetched };
	}

    function getReviewsByRevieweeId(
		userId: string,
		limit: number,
		offset: number,
    ) {
		const { data, isFetched } = useQuery<Review[]>({
			queryKey: ["getReviewsByRevieweeId", userId, limit, offset],
			queryFn: () => getReviewsByReviewee(userId, limit, offset),
		});
		return { data, isFetched };
	}

	return { getReviewsByReviewerId, getReviewsByRevieweeId };
};
