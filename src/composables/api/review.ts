import type { Review } from "@/types/review";
import { fetcher } from "@/util/fetcher";

export function useReviewAPI() {
    const getReviews = async (
        reviewerId: string,
        limit: number,
        offset: number,
    ) => {
        const params = new URLSearchParams();
        
        params.append("id", reviewerId.toString());
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());

        const response = await fetcher(
            `/review/getReviews/reviewer?${params.toString()}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const reviewRes = await response.json<Review[]>();
        return reviewRes;
    };

    

    return { getReviews };
}
