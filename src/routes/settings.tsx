import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/authContext";
import { useMutateProfile } from "@/composables/mutations/profile";
import { useProfileQuery } from "@/composables/queries/profile";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceTag, SERVICE_TAG_OPTIONS } from "@/types/service_tags";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PetsitterProfile } from "@/types/profile";

export const Route = createFileRoute("/settings")({
	component: Settings,
});

function Settings() {
	const router = useRouter();
	const { userProfile, setUserProfile } = useAuth();
	const { updateUserProfile } = useMutateProfile();

	// General user fields
	const [username, setUsername] = useState("");
	const [description, setDescription] = useState("");

	// Petsitter fields
	const [price, setPrice] = useState<string>("25");
	const [petsitterDescription, setPetsitterDescription] = useState<string>("");
	const [selectedTags, setSelectedTags] = useState<ServiceTag[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("general");

	const { getPetsitterProfileById } = useProfileQuery();
	const [petsitterDataLoaded, setPetsitterDataLoaded] = useState(false);

	// Initialize basic user form fields
	useEffect(() => {
		if (userProfile) {
			setUsername(userProfile.username || "");
			setDescription(userProfile.description || "");
		}
	}, [userProfile]);

	// Fetch petsitter data if user is a petsitter
	useEffect(() => {
		const loadPetsitterData = async () => {
			if (
				userProfile &&
				userProfile.is_petsitter === 1 &&
				!petsitterDataLoaded
			) {
				try {
					const { data: petsitterProfile } = getPetsitterProfileById(
						userProfile.id,
						userProfile.latitude,
						userProfile.longitude,
					);

					if (petsitterProfile) {
						// Set petsitter fields
						if (petsitterProfile.price !== undefined) {
							setPrice(String(petsitterProfile.price));
						}

						if (petsitterProfile.petsitter_description !== undefined) {
							setPetsitterDescription(petsitterProfile.petsitter_description);
						}

						if (petsitterProfile.service_tags) {
							// Handle the case where service_tags might be a JSON string or an array
							let parsedTags;
							if (typeof petsitterProfile.service_tags === "string") {
								try {
									parsedTags = JSON.parse(petsitterProfile.service_tags);
								} catch (e) {
									parsedTags = [];
								}
							} else {
								parsedTags = petsitterProfile.service_tags;
							}

							if (Array.isArray(parsedTags)) {
								setSelectedTags(parsedTags as ServiceTag[]);
							}
						}

						setPetsitterDataLoaded(true);
					}
				} catch (error) {
					console.error("Error loading petsitter data:", error);
					// If we can't load petsitter data, we'll use defaults
					setPetsitterDataLoaded(true);
				}
			}
		};

		loadPetsitterData();
	}, [userProfile, petsitterDataLoaded, getPetsitterProfileById]);

	const handleTagChange = (tagId: ServiceTag) => {
		setSelectedTags((prev) => {
			if (prev.includes(tagId)) {
				return prev.filter((id) => id !== tagId);
			} else {
				return [...prev, tagId];
			}
		});
	};

	const handleSaveProfile = async () => {
		if (!userProfile) {
			toast.error("User profile not found. Please login again.");
			router.navigate({ to: "/login" });
			return;
		}

		setIsLoading(true);

		try {
			// Create profile update object
			const updatedProfile: Partial<PetsitterProfile> = {
				id: userProfile.id,
				username,
				description,
			};

			// Add petsitter fields if the user is a petsitter
			if (userProfile.is_petsitter === 1) {
				updatedProfile.price = Number(price);
				updatedProfile.petsitter_description = petsitterDescription;
				// Convert service tags array to JSON string for backend
				updatedProfile.service_tags = JSON.stringify(selectedTags);
			}

			const result = await updateUserProfile.mutateAsync(updatedProfile);

			if (result) {
				// Update local state with the new profile data
				setUserProfile({
					...userProfile,
					username,
					description,
				});

				// Reset petsitter data loaded flag to fetch fresh data
				setPetsitterDataLoaded(false);

				toast.success("Profile updated successfully!");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Failed to update profile. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (!userProfile) {
		return (
			<main className="container mx-auto px-4 py-6">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-2xl font-bold mb-6 text-navy">Settings</h1>
					<p>Please log in to access your settings.</p>
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto px-4 py-6">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-6 text-navy">Settings</h1>

				{/* Profile Information Card */}
				<Card className="border-beige bg-cream">
					<CardContent className="pt-6">
						<div>
							<h2 className="text-xl font-semibold text-navy mb-1">
								Profile Information
							</h2>
							<p className="text-navy/70 text-sm mb-6">
								Update your personal information
							</p>

							<div className="space-y-6">
								<div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
									<Avatar className="h-24 w-24 bg-beige">
										<AvatarImage
											src={userProfile.profile_image_url}
											alt={username}
										/>
										<AvatarFallback className="text-navy text-xl">
											{username ? username[0].toUpperCase() : "U"}
										</AvatarFallback>
									</Avatar>
									<div>
										<Button
											variant="outline"
											size="sm"
											className="mb-2 border-beige bg-cream text-navy hover:bg-beige hover:text-navy"
										>
											Change Avatar
										</Button>
										<p className="text-xs text-navy/70">
											JPG, GIF or PNG. Max size 2MB.
										</p>
									</div>
								</div>

								{/* Settings Tabs */}
								<Tabs
									defaultValue="general"
									className="w-full"
									onValueChange={setActiveTab}
									value={activeTab}
								>
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="general">General</TabsTrigger>
										{userProfile.is_petsitter === 1 && (
											<TabsTrigger value="petsitter">
												Petsitter Settings
											</TabsTrigger>
										)}
									</TabsList>

									{/* General Settings Tab */}
									<TabsContent value="general" className="space-y-6 mt-6">
										<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="username" className="text-navy">
													Username
												</Label>
												<Input
													id="username"
													value={username}
													onChange={(e) => setUsername(e.target.value)}
													className="border-beige bg-cream"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email" className="text-navy">
													Email
												</Label>
												<Input
													id="email"
													type="email"
													value={userProfile.email || ""}
													className="border-beige bg-cream"
													disabled
												/>
												<p className="text-xs text-navy/70">
													Email cannot be changed
												</p>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="description" className="text-navy">
												Bio
											</Label>
											<Textarea
												id="description"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												rows={4}
												className="border-beige bg-cream"
											/>
											<p className="text-xs text-navy/70">
												Brief description for your profile. URLs are
												hyperlinked.
											</p>
										</div>
									</TabsContent>

									{/* Petsitter Settings Tab */}
									{userProfile.is_petsitter === 1 && (
										<TabsContent value="petsitter" className="space-y-6 mt-6">
											<div className="space-y-2">
												<Label htmlFor="price" className="text-navy">
													Hourly Rate ($)
												</Label>
												<Input
													id="price"
													type="number"
													value={price}
													onChange={(e) => setPrice(e.target.value)}
													className="border-beige bg-cream"
												/>
												<p className="text-xs text-navy/70">
													Your hourly rate for pet sitting services
												</p>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="petsitterDescription"
													className="text-navy"
												>
													Service Description
												</Label>
												<Textarea
													id="petsitterDescription"
													value={petsitterDescription}
													onChange={(e) =>
														setPetsitterDescription(e.target.value)
													}
													rows={4}
													className="border-beige bg-cream"
												/>
												<p className="text-xs text-navy/70">
													Describe your pet sitting services and experience
												</p>
											</div>

											<div className="space-y-2">
												<Label className="text-navy block mb-2">
													Services Offered
												</Label>
												<div className="grid grid-cols-2 gap-2 border-beige bg-cream/50 p-4 rounded-md">
													{SERVICE_TAG_OPTIONS.map((tag) => (
														<div
															key={tag.id}
															className="flex items-center space-x-2"
														>
															<Checkbox
																id={tag.id}
																checked={selectedTags.includes(
																	tag.id as ServiceTag,
																)}
																onCheckedChange={() =>
																	handleTagChange(tag.id as ServiceTag)
																}
															/>
															<Label
																htmlFor={tag.id}
																className="cursor-pointer text-sm text-navy"
															>
																{tag.label}
															</Label>
														</div>
													))}
												</div>
												<p className="text-xs text-navy/70">
													Select the services you offer as a pet sitter
												</p>
											</div>
										</TabsContent>
									)}
								</Tabs>

								<div className="flex justify-end pt-4">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												className="bg-navy hover:bg-navy-light text-cream"
												disabled={isLoading}
											>
												{isLoading ? "Saving..." : "Save Changes"}
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Confirm profile update?
												</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to save these changes to your
													profile?
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction asChild>
													<Button onClick={handleSaveProfile}>
														Save Changes
													</Button>
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
