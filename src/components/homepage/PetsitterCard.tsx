import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { PetsitterProfile } from "@/types/profile";

interface PetsitterCardProps {
	petsitter: PetsitterProfile;
}

export function PetsitterCard({ petsitter }: PetsitterCardProps) {
	return (
		<Link to="/petsitter/$id" params={{ id: petsitter.id.toString() }}>
			<Card className="h-full hover:shadow-md transition-shadow border-beige bg-cream">
				<div className="aspect-square relative overflow-hidden">
					<img
						src={petsitter.profile_image_url || "/placeholder.svg"}
						alt={petsitter.username}
						className="object-cover w-full h-full"
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
								<span>{petsitter.distance.toFixed(1)} miles away</span>
							</div>
						</div>
						<div className="flex items-center">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
							<span className="font-medium text-navy">
								{petsitter.avg_rating}
							</span>
							<span className="text-navy/70 text-sm ml-1">
								({petsitter.total_reviews})
							</span>
						</div>
					</div>
					<div className="mt-2 flex flex-wrap gap-1">
						{(() => {
							try {
								return Array.isArray(petsitter.service_tags)
									? petsitter.service_tags.map((service, index) => (
											<span
												key={index}
												className="inline-block bg-beige text-navy text-xs px-2 py-1 rounded-full"
											>
												{service}
											</span>
										))
									: null;
							} catch (error) {
								console.error("Error parsing service tags:", error);
								return null;
							}
						})()}
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
