import { useMutation } from "@tanstack/react-query";
import { useProfileAPI } from "@/composables/api/profile";
import type { User } from "@/types/profile";

export const useMutateProfile = () => {
	// const queryClient = useQueryClient();
	const { updateProfile } = useProfileAPI();

	const updateUserProfile = useMutation({
		mutationFn: (partialUser: Partial<User>) => updateProfile(partialUser),
		onSuccess: (isSuccess, variables) => {
			if (isSuccess) {
                console.log("Profile update successful", variables);
                // TODO: invalidate user profile
            } else {
                console.warn("Profile update failed", variables);
            }
		},
	});

	return { updateUserProfile };
};
