import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth";
import type { User } from "@/types/profile";

interface Session {
  user: User;
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

interface AuthContextType {
  session: Session | null;
  userProfile: User | null;
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
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userProfilePending, setUserProfilePending] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (session && session.user && session.user.id) {
        try {
          const response = await fetch(`/profile/getProfile/uuid-user1`, {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json<User>();
            console.log(data);
            setUserProfile(data);
            console.log(userProfile);
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

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`/profile/getProfile/uuid-user1`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json<User>();
          console.log(data);
          setUserProfile(data);
          console.log(userProfile);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      setUserProfilePending(false);
    }

    fetchUserProfile();
  }, []);

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
