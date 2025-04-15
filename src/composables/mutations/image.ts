import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useImageAPI } from "@/composables/api/image";
import type { CreateImage } from "@/types/image";

export const useMutateImage = () => {
    const queryClient = useQueryClient();
    const { createProfileImage, createPetsitterImage } = useImageAPI();

    const createProfileImageMutation = useMutation({
        mutationFn: (imageDetails: CreateImage) => createProfileImage(imageDetails),
        onSuccess: (isSuccess, variables) => {
            if (isSuccess) {

                if (variables) {
                    queryClient.invalidateQueries({ queryKey: ["petsitters"] });
                }
            } else {
                console.warn("Profile update failed", variables);
            }
        },
    });

    const createPetsitterImageMutation = useMutation({
        mutationFn: (imageDetails: CreateImage) => createPetsitterImage(imageDetails),
        onSuccess: (isSuccess, variables) => {
            if (isSuccess) {

                if (variables) {
                    queryClient.invalidateQueries({ queryKey: ["petsitters"] });
                }
            } else {
                console.warn("Profile update failed", variables);
            }
        },
    });

    return {
        createProfileImageMutation,
        createPetsitterImageMutation
    };
};
