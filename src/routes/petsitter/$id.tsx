import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { PetsitterProfile } from "@/components/petsitter/PetsitterProfile";
import { BookingCard } from "@/components/petsitter/BookingCard";
import { useProfileQuery } from "@/composables/queries/profile";

export const Route = createFileRoute("/petsitter/$id")({
	component: Petsitter,
});

function Petsitter() {
	const { id } = useParams({ from: "/petsitter/$id" });
	const [activeTab, setActiveTab] = useState("about");

	const { getPetsitterProfileById } = useProfileQuery();
	const {
		data: profileData,
		isFetched: profileFetched,
		isError: isProfileError,
		error: profileError,
	} = getPetsitterProfileById(id);
	// TODO: remove hardcoded info
	// hard coded image reviews location distance and availability for now

	if (!profileFetched) {
		return (
			<div className="min-h-screen bg-cream flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-navy">Loading profile...</p>
				</div>
			</div>
		);
	}

	if (isProfileError || !profileData) {
		return (
			<div className="min-h-screen bg-cream flex items-center justify-center">
				<div className="text-center p-6 max-w-md">
					<p className="text-red-600 font-medium text-lg mb-2">
						Error loading profile
					</p>
					<p className="text-navy">
						{profileError?.message || "Failed to load petsitter profile"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<main className="container mx-auto px-4 py-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Petsitter Profile */}
				<PetsitterProfile
					petsitterData={profileData}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>

				{/* Right: Booking Card */}
				<BookingCard petsitterData={profileData} />
			</div>
		</main>
	);
}
