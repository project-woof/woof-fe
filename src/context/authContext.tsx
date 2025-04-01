import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth";
import type { User } from "@/types/profile";
import { fetcher } from "@/util/fetcher";

// interface Session {
//   user: User;
//   session: {
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
//     userId: string;
//     expiresAt: Date;
//     token: string;
//     ipAddress?: string | null | undefined;
//     userAgent?: string | null | undefined;
//   };
// }

interface AuthContextType {
  data: any;
  userProfile: any;
  isPending: boolean;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  data: null,
  userProfile: null,
  isPending: true,
  refreshSession: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data, isPending, refetch } = authClient.useSession();
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    console.log(data);
    async function fetchUserProfile() {
      if (data && data.user) {
        try {
          const response = await fetcher(
            `/profile/getProfile/${data.user.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
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
    }

    fetchUserProfile();
  }, [data]);

  return (
    <AuthContext.Provider
      value={{ data, userProfile, isPending, refreshSession: refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
