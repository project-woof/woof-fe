import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { PetsitterProfile } from "@/types/profile";

interface PetsitterCardProps {
	petsitter: PetsitterProfile;
}

export function PetsitterCard({ petsitter }: PetsitterCardProps) {
	const getServices = (): string[] => {
		try {
			// If it's a string, try to parse it as JSON
			if (typeof petsitter.service_tags === "string") {
				// Handle the specific case where it's exactly the string "[]"
				if (petsitter.service_tags === "[]") {
					return [];
				}
				
				const parsed = JSON.parse(petsitter.service_tags);
				// Make sure the parsed result is an array
				return Array.isArray(parsed) ? parsed : [];
			}
			// If it's already an array, return it
			else if (Array.isArray(petsitter.service_tags)) {
				return petsitter.service_tags;
			}
			// Default to empty array if service_tags is undefined or invalid
			return [];
		} catch (error) {
			console.error("Error parsing service_tags", error);
			return []; // Return empty array if parsing fails
		}
	};

	const services = getServices();
	
	return (
		<Link to="/petsitter/$id" params={{ id: petsitter.id.toString() }}>
			<Card className="h-full hover:shadow-md transition-shadow border-beige bg-cream pt-0">
				<div className="aspect-square relative overflow-hidden">
					<img
						src={petsitter.first_image || "/placeholder.svg"}
						alt={petsitter.username}
						className="object-cover w-full h-full overflow-hidden rounded-tl-lg rounded-tr-lg"
					/>
				</div>
				<CardContent className="pt-4">
					<div className="flex justify-between items-start">
						<div>
							<h3 className="font-semibold text-lg text-navy">
								{petsitter.username}
							</h3>
							<div className="flex items-center mt-1 text-sm text-navy/70">
								<MapPin className="h-3.5 w-3.5 mr-1" />
								<span>{petsitter.distance.toFixed(1)} km away</span>
							</div>
						</div>
						<div className="flex items-center">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
							<span className="font-medium text-navy">
								{petsitter?.avg_rating?.toFixed(2) ?? "0"}
							</span>
							<span className="text-navy/70 text-sm ml-1">
								({petsitter?.total_reviews ?? 0})
							</span>
						</div>
					</div>
					<div className="mt-2 flex flex-wrap gap-1">
						{Array.isArray(services) && services.length > 0 ? (
							services.map((service: string, index: number) => (
								<span
									key={index}
									className="inline-block bg-beige text-navy text-xs px-2 py-1 rounded-full"
								>
									{service}
								</span>
							))
						) : (
							<span className="text-sm text-navy/70">No services listed</span>
						)}
					</div>
				</CardContent>
				<CardFooter className="pt-0">
					<div className="w-full flex justify-between items-center">
						<span className="font-semibold text-navy">
							${petsitter.price}
							<span className="text-navy/70 font-normal">/hour</span>
						</span>
						<Button
							size="sm"
							className="bg-navy hover:bg-navy-light text-cream"
						>
							View Profile
						</Button>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}