// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth";

interface Session {
  user: UserProfile;
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
}

interface AuthContextType {
  session: Session | null;
  userProfile: UserProfile | null;
  isPending: boolean;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  userProfile: null,
  isPending: true,
  refreshSession: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: session,
    isPending: sessionPending,
    refetch,
  } = authClient.useSession() as {
    data: Session | null;
    isPending: boolean;
    refetch: () => void;
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfilePending, setUserProfilePending] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (session && session.user && session.user.id) {
        try {
          const response = await fetch(`/profile/getProfile/uuid-user1`, {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json<UserProfile>();
            setUserProfile(data);
          } else {
            console.error("Failed to fetch user profile:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      setUserProfilePending(false);
    }

    fetchUserProfile();
  }, [session]);

  const isPending = sessionPending || userProfilePending;

  return (
    <AuthContext.Provider
      value={{ session, userProfile, isPending, refreshSession: refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
