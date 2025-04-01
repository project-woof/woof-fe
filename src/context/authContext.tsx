import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth";

interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
}

interface AuthContextType {
  session: Session | undefined;
  userProfile: any | undefined;
}

const AuthContext = createContext<AuthContextType>({
  session: undefined,
  userProfile: undefined,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");
      if (tokenFromUrl) {
        localStorage.setItem("bearer_token", tokenFromUrl);
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchSession() {
      const { data, error } = await authClient.getSession();
      if (error) {
        console.error(error);
      }
      console.log(data);
      if (data) {
        setSession(data.session);
        setUserProfile(data.user);
      }
    }
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ session, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
