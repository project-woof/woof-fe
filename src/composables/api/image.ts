import type { CreatePetsitterImages, CreateProfileImage, ImageList } from "@/types/image";
import { fetcher } from "@/util/fetcher";

export function useImageAPI() {
    const getProfileKey = async (userId: string) => {
        const response = await fetcher(`/image/getProfileByUserId/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<ImageList>();
    };

    const getImageKeys = async (userId: string) => {
        const response = await fetcher(`/image/getPetsitterImagesByUserId/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<ImageList>();
    };

    const createProfileImage = async (createImage: CreateProfileImage) => {
        const formData = new FormData();
        formData.append("image", createImage.file);

        const response = await fetcher(`/image/createImage/${createImage.userId}?type=profile`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<ImageList>();
    };
    
    const createPetsitterImage = async (createImage: CreatePetsitterImages) => {
        const formData = new FormData();
        
        Array.from(createImage.files).forEach((file) => {
          formData.append("image", file);
        });
        
        if (createImage.preserve) {
            formData.append("preserve", JSON.stringify(createImage.preserve));
        }
      
        const response = await fetcher(`/image/createImage/${createImage.userId}?type=petsitter`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<ImageList>();
    };

    return { getProfileKey, getImageKeys, createProfileImage, createPetsitterImage };
}
