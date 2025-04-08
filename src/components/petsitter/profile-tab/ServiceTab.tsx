import { Card, CardContent } from "@/components/ui/card";
import type { PetsitterProfile } from "@/types/petsitter";
import { PawPrint } from "lucide-react";

interface ServicesTabProps {
	petsitterData: PetsitterProfile;
}

export function ServicesTab({ petsitterData }: ServicesTabProps) {
	const services =
		typeof petsitterData.service_tags === "string"
			? JSON.parse(petsitterData.service_tags)
			: petsitterData.service_tags;
	return (
		<Card>
			<CardContent className="pt-6">
				<h3 className="text-lg font-semibold mb-4">Services Offered</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{services.map((service: string, index: number) => (
						<div
							key={index}
							className="flex items-center p-3 border rounded-lg"
						>
							<div className="bg-primary/10 p-2 rounded-full mr-3">
								<PawPrint className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h4 className="font-medium">{service}</h4>
								<p className="text-sm text-muted-foreground">
									Starting at ${petsitterData.price}/hour
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
