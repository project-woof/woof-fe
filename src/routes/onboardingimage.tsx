import { createFileRoute, useRouter } from "@tanstack/react-router";
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
	component: Onboarding,
});

function Onboarding() {
	const router = useRouter();
	const { userProfile } = useAuth();

	if (!userProfile) {
		router.navigate({ to: "/login" });
		return;
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
					<FileUpload userId={userProfile.id} isOnboarding={true}/>
				</CardContent>
			</Card>
		</div>
	);
}

export default Onboarding;
