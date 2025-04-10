import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/profile";
import { fetcher } from "@/util/fetcher";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

interface AuthContextType {
	userProfile: User | null;
	setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	userProfile: null,
	setUserProfile: () => {},
	isLoading: true,
});

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [userProfile, setUserProfile] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			const tokenFromUrl = params.get("token");
			if (tokenFromUrl) {
				const token = decodeURIComponent(tokenFromUrl);
				localStorage.setItem("bearer_token", token);
				const newUrl = window.location.origin + window.location.pathname;
				window.history.replaceState({}, document.title, newUrl);
			}
		}
	}, []);

	useEffect(() => {
		async function fetchUser() {
			const token = localStorage.getItem("bearer_token");
			if (!token) {
				setIsLoading(false); // Update loading state
				return;
			}
			try {
				const response = await fetcher(`/api/auth/get-user?token=${token}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (response.status === 401) {
					setUserProfile(null);
					localStorage.removeItem("bearer_token");
					setIsLoading(false); // Update loading state
					return;
				}
				const data = await response.json<User>();
				setUserProfile(data);
				setIsLoading(false); // Update loading state
			} catch (error) {
				console.error("Error fetching user:", error);
				setUserProfile(null);
				localStorage.removeItem("bearer_token");
				setIsLoading(false); // Update loading state
			}
		}
		fetchUser();
	}, []);

	useEffect(() => {
		if (userProfile) {
			if (
				!userProfile.description &&
				router.state.location.pathname !== "/onboarding"
			) {
				toast.error("Please complete your profile.");
				router.navigate({ to: "/onboarding", search: { fromLogin: "" } });
			}
		}
	}, [userProfile]);

	const contextValue: AuthContextType = {
		userProfile,
		setUserProfile,
		isLoading,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
