import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/profile";
import { fetcher } from "@/util/fetcher";
import { useRouter } from "@tanstack/react-router";

interface AuthContextType {
  userProfile: User | null;
  setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  setUserProfile: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
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
          return;
        }
        const data = await response.json<User>();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserProfile(null);
        localStorage.removeItem("bearer_token");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (userProfile) {
      if (
        !userProfile.description &&
        router.state.location.pathname !== "/signup"
      ) {
        router.navigate({ to: "/signup", search: { fromLogin: "" } });
      }
    }
  }, [userProfile, router.state.location.pathname]);

  const contextValue: AuthContextType = {
    userProfile,
    setUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
