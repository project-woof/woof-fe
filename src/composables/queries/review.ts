import { useQuery } from "@tanstack/react-query";
import type { Review } from "@/types/review";
import { useReviewAPI } from "@/composables/api/review";

export const useReviewQuery = () => {
	const { getReviews } = useReviewAPI();

	function getReviewsByReviewerId(
		userId: string,
		limit: number,
		offset: number,
    ) {
		const { data, isFetched } = useQuery<Review[]>({
			queryKey: ["getReviewsByReviewerId", userId],
			queryFn: () => getReviews(userId, limit, offset),
		});
		return { data, isFetched };
	}


	return { getReviewsByReviewerId };
};
