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
    async function fetchSession() {
      const { data: session } = await authClient.getSession();
      const currSession = session?.session;
      setSession(currSession);
      const user = session?.user;
      setUserProfile(user);
      console.log(session);
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
