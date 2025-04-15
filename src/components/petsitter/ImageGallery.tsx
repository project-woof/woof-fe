import { Loader2, PawPrint } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface ImageGalleryProps {
	images: string[];
	username: string;
	isFetched: boolean;
}

export function ImageGallery({
	images,
	username,
	isFetched,
}: ImageGalleryProps) {
	// Filter out any undefined or empty image URLs
	const validImages = images.filter((img) => img && img !== "undefined");

	// Limit to maximum 6 images
	const limitedImages = validImages.slice(0, 6);
	const imageCount = limitedImages.length;
	if (!isFetched) {
    return (
      <Card className="w-full h-80 flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading petsitter images...</p>
        </CardContent>
      </Card>
    )
	}

	if (imageCount === 0) {
		return (
			<div className="w-full h-80  rounded-lg flex items-center justify-center">
				<p className="text-muted-foreground">
					{" "}
					No images of the petsitter is available
				</p>
				<PawPrint />
			</div>
		);
	}

	if (imageCount === 1) {
		return (
			<div className="w-full">
				<img
					src={limitedImages[0] || "/placeholder.svg"}
					alt={`${username}'s profile`}
					className="w-full h-80 object-cover rounded-lg"
				/>
			</div>
		);
	}

	// For multiple images, create a dynamic grid
	return (
		<div
			className="grid gap-2"
			style={{
				gridTemplateColumns: `repeat(${Math.min(imageCount, 3)}, 1fr)`,
				gridAutoRows: "minmax(130px, auto)",
			}}
		>
			{limitedImages.map((image, index) => {
				// Calculate if this image should be featured (larger)
				const isFeatured = index === 0 && imageCount > 1;

				// Calculate grid span based on image position and count
				const colSpan = isFeatured ? Math.min(2, imageCount - 1) : 1;
				const rowSpan = isFeatured ? 2 : 1;

				// Calculate height based on position
				const height = isFeatured
					? "400px"
					: imageCount <= 3 || (index < 3 && imageCount > 3)
						? "195px"
						: "130px";

				return (
					<div
						key={index}
						style={{
							gridColumn: isFeatured ? `span ${colSpan}` : "span 1",
							gridRow: isFeatured ? `span ${rowSpan}` : "span 1",
						}}
					>
						<img
							src={image || "/placeholder.svg"}
							alt={`${username}'s profile ${index + 1}`}
							className="w-full h-full object-cover rounded-lg"
							style={{ height }}
						/>
					</div>
				);
			})}
		</div>
	);
}
