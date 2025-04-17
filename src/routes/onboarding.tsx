import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, User, Users, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceTag, SERVICE_TAG_OPTIONS } from "@/types/service_tags";
import type { Petsitter } from "@/types/profile";
import { useMutateProfile } from "@/composables/mutations/profile";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
	component: Onboarding,
});

function Onboarding() {
	const router = useRouter();
	const [isPetsitter, setIsPetsitter] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { userProfile } = useAuth();
	const [latitude, setLatitude] = useState<string>("");
	const [longitude, setLongitude] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [locationError, setLocationError] = useState<string | null>(null);

	const { updateUserProfile } = useMutateProfile();

	// Additional fields for pet sitter
	const [price, setPrice] = useState<string>("");
	const [sitterDescription, setSitterDescription] = useState<string>("");
	const [selectedTags, setSelectedTags] = useState<ServiceTag[]>([]);

	const handleTagChange = (tagId: ServiceTag) => {
		setSelectedTags((prev) => {
			if (prev.includes(tagId)) {
				return prev.filter((id) => id !== tagId);
			} else {
				return [...prev, tagId];
			}
		});
	};

	const handleSubmit = async () => {
		if (!userProfile) {
			setError("No user profile found. Please log in with Google first.");
			router.navigate({ to: "/login" });
			return;
		}

		// Validate services for petsitter
		if (isPetsitter) {
			if (price === "") {
				toast.error("Please set your hourly rate.");
				return;
			}

			if (selectedTags.length === 0) {
				toast.error("Please select at least one service you offer.");
				return;
			}
		}

		const newProfileDetails: Partial<Petsitter> = {
			id: userProfile.id,
			is_petsitter: isPetsitter ? 1 : 0,
		};

		if (latitude && longitude) {
			newProfileDetails.latitude = Number.parseFloat(latitude);
			newProfileDetails.longitude = Number.parseFloat(longitude);
		}

		if (description.trim()) {
			newProfileDetails.description = description.trim();
		}

		if (isPetsitter) {
			newProfileDetails.price = price ? Number.parseFloat(price) : undefined;
			newProfileDetails.petsitter_description =
				sitterDescription.trim() || undefined;
			newProfileDetails.service_tags =
				selectedTags.length > 0 ? JSON.stringify(selectedTags) : undefined;
		}

		try {
			await updateUserProfile.mutateAsync(newProfileDetails);
			toast("Update has been requested.");
			if (isPetsitter) {
				router.navigate({ to: "/onboardingimage" });
			} else {
				router.navigate({ to: "/profileimage" });
			}
		} catch (error) {
			toast(`Failed to send message: ${error}`);
		}
	};

	const getGeolocation = async () => {
		setIsLoading(true);
		setLocationError(null);

		try {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setLatitude(position.coords.latitude.toString());
						setLongitude(position.coords.longitude.toString());
						setIsLoading(false);
					},
					(error) => {
						console.error("Geolocation error:", error);
						setLocationError(
							"Failed to get your location. Please enter coordinates manually.",
						);
						setIsLoading(false);
					},
					{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
				);
			} else {
				setLocationError(
					"Geolocation is not supported by your browser. Please enter coordinates manually.",
				);
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error getting geolocation:", error);
			setLocationError(
				"An error occurred while getting your location. Please enter coordinates manually.",
			);
			setIsLoading(false);
		}
	};

	const renderContent = () => {
		return (
			<div className="space-y-4">
				<Tabs
					defaultValue="petowner"
					className="w-full"
					onValueChange={(value) => setIsPetsitter(value === "both")}
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="petowner"
							className="flex items-center justify-center"
						>
							<User className="h-4 w-4 mr-2" />
							Pet Owner
						</TabsTrigger>
						<TabsTrigger
							value="both"
							className="flex items-center justify-center"
						>
							<Users className="h-4 w-4 mr-2" />
							Pet Owner & Sitter
						</TabsTrigger>
					</TabsList>
					<TabsContent value="petowner" className="mt-4 text-center">
						<h3 className="font-medium text-lg mb-2">Pet Owner</h3>
						<p className="text-muted-foreground mb-4">
							Find reliable pet sitters for your furry friends when you're away.
						</p>
					</TabsContent>
					<TabsContent value="both" className="mt-4">
						<h3 className="font-medium text-lg mb-2 text-center">
							Pet Owner & Sitter
						</h3>
						<p className="text-muted-foreground mb-4 text-center">
							Find pet sitters for your pets and offer your services to other
							pet owners.
						</p>

						{/* Pet Sitter specific fields */}
						<div className="space-y-4 border rounded-md p-4 mt-4">
							<h4 className="font-medium">Petitter Information</h4>

							<div className="space-y-2">
								<Label htmlFor="price">Hourly Rate ($)</Label>
								<Input
									id="price"
									type="number"
									placeholder="E.g. 25 for $25"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="sitterDescription">Service Description</Label>
								<Textarea
									id="sitterDescription"
									placeholder="Describe your pet sitting services"
									rows={3}
									value={sitterDescription}
									onChange={(e) => setSitterDescription(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label className="block mb-2">Services Offered</Label>
								<div className="grid grid-cols-2 gap-2">
									{SERVICE_TAG_OPTIONS.map((tag) => (
										<div key={tag.id} className="flex items-center space-x-2">
											<Checkbox
												id={tag.id}
												checked={selectedTags.includes(tag.id as ServiceTag)}
												onCheckedChange={() =>
													handleTagChange(tag.id as ServiceTag)
												}
											/>
											<Label
												htmlFor={tag.id}
												className="cursor-pointer text-sm"
											>
												{tag.label}
											</Label>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Validation messages */}
						{isPetsitter && price === "" && (
							<div className="text-sm text-amber-600 text-center mt-2">
								Please set your hourly rate
							</div>
						)}
						{isPetsitter && selectedTags.length === 0 && (
							<div className="text-sm text-red-600 text-center mt-2">
								Please select at least one service you offer
							</div>
						)}
					</TabsContent>
				</Tabs>

				<div className="space-y-3">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label htmlFor="location">Location</Label>
							<Button
								variant="outline"
								size="sm"
								onClick={getGeolocation}
								disabled={isLoading}
								className="flex items-center"
								title="Get your current coordinates"
							>
								<MapPin className="h-4 w-4 mr-2" />
								{isLoading ? "Getting location..." : "Use my location"}
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="latitude">Latitude</Label>
								<Input
									id="latitude"
									placeholder="Use the location button to get coordinates"
									value={latitude}
									readOnly
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="longitude">Longitude</Label>
								<Input
									id="longitude"
									placeholder="Use the location button to get coordinates"
									value={longitude}
									readOnly
								/>
							</div>
						</div>

						{locationError && (
							<div className="text-sm text-red-500">{locationError}</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								placeholder="Tell us about yourself and your pets"
								rows={3}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<Button
					className="w-full"
					onClick={handleSubmit}
					disabled={isPetsitter && (price === "" || selectedTags.length === 0)}
				>
					Continue
				</Button>
			</div>
		);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-2">
						<PawPrint className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
					<CardDescription>Choose your role to get started</CardDescription>
				</CardHeader>
				<CardContent>
					{renderContent()}
					{error && (
						<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
							{error}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default Onboarding;
