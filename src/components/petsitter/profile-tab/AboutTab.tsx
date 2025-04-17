import { Card, CardContent } from "@/components/ui/card";
import type { PetsitterProfile } from "@/types/profile";

interface AboutTabProps {
	petsitterData: PetsitterProfile;
}

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
			</CardContent>
		</Card>
	);
}
