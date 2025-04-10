import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { PetsitterProfile } from "@/types/profile";

export const useMutateProfile = () => {
	const queryClient = useQueryClient();
	const { updateProfile } = useProfileAPI();

	const updateUserProfile = useMutation({
		mutationFn: (partialUser: Partial<PetsitterProfile>) => updateProfile(partialUser),
		onSuccess: (isSuccess, variables) => {
			if (isSuccess) {
                console.log("Profile update successful", variables);
                // Invalidate any cached profile data for this user
                if (variables.id) {
                    queryClient.invalidateQueries({ 
                        queryKey: ["petsitters", variables.id] 
                    });
                }
            } else {
                console.warn("Profile update failed", variables);
            }
		},
	});

	return { updateUserProfile };
};
