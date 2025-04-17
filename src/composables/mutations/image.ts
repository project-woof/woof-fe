import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useImageAPI } from "@/composables/api/image";
import type { CreatePetsitterImages, CreateProfileImage } from "@/types/image";

export const useMutateImage = () => {
    const queryClient = useQueryClient();
    const { createProfileImage, createPetsitterImage } = useImageAPI();

    const createProfileImageMutation = useMutation({
        mutationFn: (imageDetails: CreateProfileImage) => createProfileImage(imageDetails),
        onSuccess: (response, variables) => {
            if (response) {
                queryClient.invalidateQueries({
                    queryKey: ["getProfilekeyByUserId", variables.userId],
                  })
            } else {
                console.warn("Profile update failed", variables);
            }
        },
    });

    const createPetsitterImageMutation = useMutation({
        mutationFn: (imageDetails: CreatePetsitterImages) => createPetsitterImage(imageDetails),
        onSuccess: (response, variables) => {
            if (response) {
                queryClient.invalidateQueries({
                    queryKey: ["getImageKeysByUserId", variables.userId],
                  })
                queryClient.invalidateQueries({ queryKey: ["petsitters"] });
                if (response && response.images) {
                    queryClient.setQueryData(["getImageKeysByUserId", variables.userId], response)
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
