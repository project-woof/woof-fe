import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReviewAPI } from "@/composables/api/review";
import type { CreateReview, Review } from "@/types/review";

export const useMutateReview = () => {
	const queryClient = useQueryClient();
	const { createReview } = useReviewAPI();

	const createReviewMutation = useMutation({
		mutationFn: (review: CreateReview) => createReview(review),
		onSuccess: (data, variables) => {
			const newReview: Review = {
				review_id: data.review_id,
				username: data.username,
				profile_image_url: data.profile_image_url,
				created_at: data.created_at,
				rating: data.rating,
				comment: data.comment,
			};
			queryClient.setQueryData(
				["getReviewsByReviewerId", variables.reviewer_id],
				(oldData: Review[] = []) => [newReview, ...oldData],
			);
			queryClient.invalidateQueries({ queryKey: ["getReviewsByReviewerId"] });
		},
	});

	return { createReviewMutation  };
};
