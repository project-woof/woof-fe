import { Card, CardContent } from "@/components/ui/card";
import type { PetsitterProfile } from "@/types/petsitter";
import { Clock, MapPin } from "lucide-react";

interface AboutTabProps {
	petsitterData: PetsitterProfile;
}
// hardcoded availability location
const availability = "Mon-Fri: 8am-6pm, Weekends: 10am-4pm";
const location = "Brooklyn, NY";

export function AboutTab({ petsitterData }: AboutTabProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<h3 className="text-lg font-semibold mb-2">
					About {petsitterData.username}
				</h3>
				<p className="text-muted-foreground mb-4">
					{petsitterData.description}
				</p>

				<h3 className="text-lg font-semibold mb-2">Availability</h3>
				<div className="flex items-start mb-4">
					<Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
					<span>{availability}</span>
				</div>

				<h3 className="text-lg font-semibold mb-2">Location</h3>
				<div className="flex items-start">
					<MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
					<span>{location}</span>
				</div>
			</CardContent>
		</Card>
	);
}
