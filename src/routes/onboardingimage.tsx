import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PawPrint } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { FileUpload } from "@/components/setting/FileUpload";

export const Route = createFileRoute("/onboardingimage")({
	component: OnboardingImage,
});

function OnboardingImage() {
	const { userProfile } = useAuth();

	if (!userProfile) {
		return (
			<div className="min-h-screen bg-cream flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-navy">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-2">
						<PawPrint className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
					<CardDescription>
						Upload images to display your personality!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FileUpload
						userId={userProfile.id}
						isOnboarding={true}
						preservedImageKeys={[]}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export default OnboardingImage;
