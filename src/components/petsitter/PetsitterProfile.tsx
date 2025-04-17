import type { PetsitterProfile } from "@/types/profile";
import { Heart, MapPin, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTab } from "@/components/petsitter/profile-tab/ServiceTab";
import { ReviewsTab } from "@/components/petsitter/profile-tab/ReviewsTab";
import { AboutTab } from "@/components/petsitter/profile-tab/AboutTab";
import { buildImageUrl, calculateCompositeScore } from "@/util/format";
import { ImageGallery } from "./ImageGallery";
import { useEffect } from "react";
import { usePagination } from "@/context/paginationContext";
import { useImageQuery } from "@/composables/queries/image";
import type { ImageList } from "@/types/image";

interface PetsitterProfileProps {
	petsitterData: PetsitterProfile;
	activeTab: string;
	setActiveTab: (val: string) => void;
}

// hard coded image reviews location distance and availability for now

export function PetsitterProfile({
	petsitterData,
	activeTab,
	setActiveTab,
}: PetsitterProfileProps) {
	const { setReviewPagination } = usePagination();
	const { getImageKeysByUserId } = useImageQuery();
	const { data: imageData, isFetched: imagesFetched } = getImageKeysByUserId(
		petsitterData.id,
	);

	function getImageUrls(imageList: ImageList): string[] {
		return imageList.images.map((key) => buildImageUrl(key));
	}

	useEffect(() => {
		setReviewPagination(1);
	}, [setReviewPagination]);

	const imageUrls = imageData ? getImageUrls(imageData) : [];

	return (
		<div className="lg:col-span-2">
			{/* Image Gallery */}
			<div className="mb-6">
				<ImageGallery
					images={imageUrls}
					username={petsitterData.username}
					isFetched={imagesFetched}
				/>
			</div>

			{/* Petsitter Info */}
			<div className="flex justify-between items-start mb-6">
				<div>
					<h1 className="text-3xl font-bold">{petsitterData.username}</h1>
					<div className="flex items-center mt-2">
						<Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
						<span className="font-medium">
							{petsitterData.composite_score
								? petsitterData.composite_score
								: calculateCompositeScore(
										petsitterData.sum_of_rating,
										petsitterData.total_reviews,
									)}
						</span>
						<span className="text-muted-foreground ml-1">
							({petsitterData.total_reviews} reviews)
						</span>
					</div>
					<div className="flex items-center mt-1 text-muted-foreground">
						<MapPin className="h-4 w-4 mr-1" />
						<span>• {petsitterData.distance.toFixed(2)} km away</span>
					</div>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="icon">
						<Heart className="h-5 w-5" />
					</Button>
					<Button variant="outline" size="icon">
						<Share2 className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="about">About</TabsTrigger>
					<TabsTrigger value="services">Services</TabsTrigger>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
				</TabsList>

				<TabsContent value="about" className="mt-4">
					<AboutTab petsitterData={petsitterData} />
				</TabsContent>

				<TabsContent value="services" className="mt-4">
					<ServicesTab petsitterData={petsitterData} />
				</TabsContent>

				<TabsContent value="reviews" className="mt-4">
					<ReviewsTab petsitterData={petsitterData} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
