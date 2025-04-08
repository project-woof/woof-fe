import type { PetsitterProfile } from "@/types/petsitter";
import type { Review } from "@/types/review";
import { Heart, MapPin, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTab } from "@/components/petsitter/profile-tab/ServiceTab";
import { ReviewsTab } from "@/components/petsitter/profile-tab/ReviewsTab";
import { AboutTab } from "@/components/petsitter/profile-tab/AboutTab";
import { calculateCompositeScore } from "@/util/format";

interface PetsitterProfileProps {
	petsitterData: PetsitterProfile;
	activeTab: string;
	setActiveTab: (val: string) => void;
}

// hard coded image reviews location distance and availability for now
const reviewsList: Review[] = [
	{
		id: 1,
		petsitter: "John D.",
		avatar: "/placeholder.svg?height=40&width=40",
		rating: 5,
		date: "2 weeks ago",
		comment:
			"Sarah was amazing with my dog Max! She sent photos throughout the day and was very responsive. Will definitely book again.",
	},
	{
		id: 2,
		petsitter: "Emma S.",
		avatar: "/placeholder.svg?height=40&width=40",
		rating: 4,
		date: "1 month ago",
		comment:
			"Very professional and caring. My cat was well taken care of while I was away.",
	},
	{
		id: 3,
		petsitter: "Michael T.",
		avatar: "/placeholder.svg?height=40&width=40",
		rating: 5,
		date: "2 months ago",
		comment:
			"Sarah is the best! My dogs love her and are always excited when she comes over. Highly recommend!",
	},
];
const images = [
	"/placeholder.svg?height=600&width=800",
	"/placeholder.svg?height=600&width=800",
	"/placeholder.svg?height=600&width=800",
	"/placeholder.svg?height=600&width=800",
];
const location = "Brooklyn, NY";
const distance = 0.8;

export function PetsitterProfile({
	petsitterData,
	activeTab,
	setActiveTab,
}: PetsitterProfileProps) {
	return (
		<div className="lg:col-span-2">
			{/* Image Gallery */}
			<div className="grid grid-cols-2 gap-2 mb-6">
				<div className="col-span-2">
					<img
						src={images[0] || "/placeholder.svg"}
						alt={petsitterData.username}
						className="w-full h-80 object-cover rounded-lg"
					/>
				</div>
				<div>
					<img
						src={images[1] || "/placeholder.svg"}
						alt={petsitterData.username}
						className="w-full h-40 object-cover rounded-lg"
					/>
				</div>
				<div>
					<img
						src={images[2] || "/placeholder.svg"}
						alt={petsitterData.username}
						className="w-full h-40 object-cover rounded-lg"
					/>
				</div>
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
							({reviewsList.length} reviews)
						</span>
					</div>
					<div className="flex items-center mt-1 text-muted-foreground">
						<MapPin className="h-4 w-4 mr-1" />
						<span>
							{location} • {distance} miles away
						</span>
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
