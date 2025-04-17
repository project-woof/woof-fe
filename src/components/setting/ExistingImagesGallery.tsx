import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageQuery } from "@/composables/queries/image";

interface ExistingImageGalleryProps {
	userId: string;
	preservedImageKeys: string[];
	setPreservedImageKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function ExistingImageGallery({
	userId,
	preservedImageKeys,
	setPreservedImageKeys,
}: ExistingImageGalleryProps) {
	const { getImageKeysByUserId } = useImageQuery();
	const [imagesUrl, setImagesUrl] = useState<string[]>([]);
	const { data: imagesData, isFetched: imagesFetched } =
		getImageKeysByUserId(userId);

	const handleRemoveImage = (indexToRemove: number) => {
		const updatedPreserved = preservedImageKeys.filter(
			(_, index) => index !== indexToRemove,
		);
		setPreservedImageKeys(updatedPreserved);
		const updatedImages = imagesUrl.filter(
			(_, index) => index !== indexToRemove,
		);
		setImagesUrl(updatedImages);
	};

	// const handleUndo = () => {
	// 	return;
	// };



	function getAllImageUrls(imageList: string[]): string[] {
		return imageList.map((image) => `${API_URL}/image/getImage/${image}`);
	}

	useEffect(() => {
		if (imagesFetched && imagesData) {
			setPreservedImageKeys(imagesData.images);
			setImagesUrl(getAllImageUrls(imagesData.images));
		}
	}, [imagesFetched, imagesData]);

	return (
		<div className="mt-6">
			<h3 className="text-base font-medium mb-2">Portfolio Images</h3>
			<p className="text-sm text-gray-600 mb-4">
				These are your existing petsitter images. You can only have up to 6
				petsitter images, remove old ones to upload new ones.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{imagesUrl.map((imageUrl, index) => (
					<div
						key={`${imageUrl}-${index}`}
						className="relative aspect-square rounded-md overflow-hidden group"
					>
						<img
							src={imageUrl || "/placeholder.svg"}
							alt={`Gallery image ${index + 1}`}
							className="object-cover w-full h-full"
						/>
						<Button
							size="icon"
							className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white shadow-sm"
							onClick={() => handleRemoveImage(index)}
							aria-label="Remove image"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			{/* <Button
				variant="default"
				className=""
				onClick={handleUndo}
			>
				Undo
			</Button> */}
		</div>
	);
}
