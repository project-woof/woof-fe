import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/profile";
import { fetcher } from "@/util/fetcher";

interface AuthContextType {
  userProfile: User | undefined;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: undefined,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userProfile, setUserProfile] = useState<User | undefined>(undefined);

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
      const response = await fetcher(`/api/auth/get-user?token=${token}`);
      if (!response.ok) {
        setUserProfile(undefined);
        localStorage.setItem("bearer_token", "");
        return;
      }
      const data = await response.json<User>();
      setUserProfile(data);
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
