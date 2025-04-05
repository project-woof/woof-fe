import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
	component: Settings,
});

function Settings() {
	// Get user profile from localStorage
	const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

	const [name, setName] = useState(userProfile.name || "John Doe");
	const [email, setEmail] = useState(
		userProfile.email || "john.doe@example.com",
	);
	const [bio, setBio] = useState(
		"Pet lover and proud owner of Max, a golden retriever. Always looking for reliable pet sitters when I travel for work.",
	);
	const [location, setLocation] = useState("New York, NY");

	const handleSaveProfile = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real app, you would save the profile data to the server
		alert("Profile saved successfully!");
	};

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

							<form onSubmit={handleSaveProfile} className="space-y-6">
								<div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
									<Avatar className="h-24 w-24 bg-beige">
										<AvatarImage
											src={
												userProfile.picture ||
												"/placeholder.svg?height=150&width=150"
											}
											alt={name}
										/>
										<AvatarFallback className="text-navy text-xl">
											{name ? name[0] : "U"}
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
										<Label htmlFor="name" className="text-navy">
											Full Name
										</Label>
										<Input
											id="name"
											value={name}
											onChange={(e) => setName(e.target.value)}
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
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="border-beige bg-cream"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="location" className="text-navy">
										Location
									</Label>
									<Input
										id="location"
										value={location}
										onChange={(e) => setLocation(e.target.value)}
										className="border-beige bg-cream"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio" className="text-navy">
										Bio
									</Label>
									<Textarea
										id="bio"
										value={bio}
										onChange={(e) => setBio(e.target.value)}
										rows={4}
										className="border-beige bg-cream"
									/>
									<p className="text-xs text-navy/70">
										Brief description for your profile. URLs are hyperlinked.
									</p>
								</div>

								<div className="flex justify-end">
									<Button
										type="submit"
										className="bg-navy hover:bg-navy-light text-cream"
									>
										Save Changes
									</Button>
								</div>
							</form>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
