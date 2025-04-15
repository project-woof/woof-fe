import type { CreateImage, ImageList } from "@/types/image";
import { fetcher } from "@/util/fetcher";

export function useImageAPI() {
    const getImageKeys = async (userId: string) => {
        const response = await fetcher(`/image/getByUserId/${userId}`, {
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

    const createProfileImage = async (createImage: CreateImage) => {
        const formData = new FormData();
        
        Array.from(createImage.files).forEach((file) => {
          formData.append("image", file);
        });
      
        const response = await fetcher(`/image/createImage/${createImage.userId}?type=profile`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<ImageList>();
    };
    
    const createPetsitterImage = async (createImage: CreateImage) => {
        const formData = new FormData();
        
        Array.from(createImage.files).forEach((file) => {
          formData.append("image", file);
        });
      
        const response = await fetcher(`/image/createImage/${createImage.userId}?type=petsitter`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json<ImageList>();
    };

    return { getImageKeys, createProfileImage, createPetsitterImage };
}
