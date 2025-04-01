import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/profile";
import { fetcher } from "@/util/fetcher";

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
  userProfile: User | undefined;
}

const AuthContext = createContext<AuthContextType>({
  session: undefined,
  userProfile: undefined,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session] = useState<Session | undefined>(undefined);
  const [userProfile] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function fetchSession() {
      const response = await fetcher("/api/auth/get-session", {
        method: "GET",
        credentials: "include",
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
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
