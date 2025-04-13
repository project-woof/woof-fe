import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { PetsitterProfile } from "@/types/profile";

export const useMutateProfile = () => {
	const queryClient = useQueryClient();
	const { updateProfile } = useProfileAPI();

	const updateUserProfile = useMutation({
		mutationFn: (partialUser: Partial<PetsitterProfile>) =>
			updateProfile(partialUser),
		onSuccess: (isSuccess, variables) => {
			if (isSuccess) {
				console.log("Profile update successful", variables);

				// Invalidate specific petsitter profile
				if (variables.id) {
					// Invalidate the specific petsitter profile
					queryClient.invalidateQueries({
						queryKey: ["petsitters", variables.id],
					});

					// Also invalidate the petsitter list to ensure home page gets fresh data
					queryClient.invalidateQueries({
						queryKey: ["petsitters"],
						exact: false,
					});
				}
			} else {
				console.warn("Profile update failed", variables);
			}
		},
	});

	return { updateUserProfile };
};
