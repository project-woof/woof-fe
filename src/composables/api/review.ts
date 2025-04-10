import type { CreateReview, Review } from "@/types/review";
import { fetcher } from "@/util/fetcher";

export function useReviewAPI() {
    const getReviewsByReviewer = async (
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

    const getReviewsByReviewee = async (
        revieweeId: string,
        limit: number,
        offset: number,
    ) => {
        const params = new URLSearchParams();
        
        params.append("id", revieweeId.toString());
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());

        const response = await fetcher(
            `/review/getReviews/reviewee?${params.toString()}`,
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

    const createReview = async (body: CreateReview) => {
        const response = await fetcher(`/review/createReview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<Review>();
    };

    return { getReviewsByReviewer, getReviewsByReviewee, createReview };
}
