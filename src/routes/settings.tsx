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
import { toast } from "sonner";
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
import type { User } from "@/types/profile";

export const Route = createFileRoute("/settings")({
	component: Settings,
});

function Settings() {
	const router = useRouter();
	const { userProfile, setUserProfile } = useAuth();
	const { updateUserProfile } = useMutateProfile();
	
	const [username, setUsername] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	
	// Initialize form when userProfile loads
	useEffect(() => {
		if (userProfile) {
			setUsername(userProfile.username || "");
			setDescription(userProfile.description || "");
		}
	}, [userProfile]);
	
	const handleSaveProfile = async () => {
		if (!userProfile) {
			toast.error("User profile not found. Please login again.");
			router.navigate({ to: "/login" });
			return;
		}
		
		setIsLoading(true);
		
		try {
			const updatedProfile: Partial<User> = {
				id: userProfile.id,
				username,
				description
			};
			
			const result = await updateUserProfile.mutateAsync(updatedProfile);
			
			if (result) {
				// Update local state with the new profile data
				setUserProfile({
					...userProfile,
					username,
					description
				});
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
										Brief description for your profile. URLs are hyperlinked.
									</p>
								</div>

								<div className="flex justify-end">
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
												<AlertDialogTitle>Confirm profile update?</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to save these changes to your profile?
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
