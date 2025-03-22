import { createFileRoute, useRouter, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, User, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/signup")({
  component: Signup,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromLogin: search.fromLogin === "true" ? "true" : undefined
    };
  },
});

declare const google: any;

function Signup() {
  const router = useRouter();
  const search = useSearch({ from: "/signup" });
  const fromLogin = search.fromLogin === "true";
  
  const [userType, setUserType] = useState<"petowner" | "both">("petowner");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleFirst] = useState(!fromLogin);

  useEffect(() => {
    // Check if user is already authenticated
    const authCookie = document.cookie.includes("auth_token=");
    const storedProfile = localStorage.getItem('userProfile');
    
    if (authCookie && storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Only set up Google Sign-In if not authenticated
    if (!isAuthenticated) {
      // Set up Google Sign-In
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        google.accounts.id.initialize({
          client_id: "540899016249-4t8a0kputh7m628pr492a7i4t9r6lpg6.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        
        // Render all Google Sign-In buttons on the page
        document.querySelectorAll('#google-signin-button').forEach(button => {
          if (button) {
            google.accounts.id.renderButton(
              button,
              { theme: "outline", size: "large" }
            );
          }
        });
      };
      document.body.appendChild(script);

      return () => {
        // Clean up script when component unmounts
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isAuthenticated]);

  const handleCredentialResponse = async (credential: any) => {
    setIsLoading(true);
    setError(null);
    
    const decodeJwt = (token: string) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    };

    const decodedProfile = decodeJwt(credential.credential);
    console.log("Decoded JWT payload:", decodedProfile);
    
    try {
      // Store basic profile info in localStorage
      localStorage.setItem('userProfile', JSON.stringify({
        name: decodedProfile.name,
        email: decodedProfile.email,
        picture: decodedProfile.picture,
      }));

      // Set auth token cookie
      document.cookie = `auth_token=${credential.credential}; path=/; max-age=86400`;
      
      // Update state
      setUserProfile({
        name: decodedProfile.name,
        email: decodedProfile.email,
        picture: decodedProfile.picture,
      });
      setIsAuthenticated(true);
      
      // Get the profile service URL from environment variables or use default
      const profileServiceUrl = import.meta.env.VITE_PROFILE_SERVICE_URL || 'http://localhost:8787';
      
      // First check if user already exists
      const checkUserResponse = await fetch(`${profileServiceUrl}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credential.credential}`
        },
        body: JSON.stringify({
          email: decodedProfile.email
        }),
      });
      
      if (!checkUserResponse.ok) {
        const errorData = await checkUserResponse.json() as { message?: string };
        throw new Error(errorData.message || "Failed to check user profile");
      }
      
      const userData = await checkUserResponse.json() as { exists: boolean; userType?: string };
      
      if (userData.exists) {
        // User already exists, update localStorage with user type and redirect to dashboard
        const updatedProfile = {
          name: decodedProfile.name,
          email: decodedProfile.email,
          picture: decodedProfile.picture,
          userType: userData.userType,
          is_petsitter: userData.userType === 'both' ? 1 : 0
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        // Redirect to home page
        router.navigate({ to: "/" });
      } 
      // If user doesn't exist and we're on the signup page with role selection, create the profile
      else if (roleFirst) {
        // Create user profile in database
        const createResponse = await fetch(`${profileServiceUrl}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credential.credential}`
          },
          body: JSON.stringify({
            email: decodedProfile.email,
            username: decodedProfile.name,
            profile_image_url: decodedProfile.picture,
            is_petsitter: userType === 'both' ? 1 : 0
          }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json() as { error?: string };
          throw new Error(errorData.error || "Failed to create profile");
        }

        // Update localStorage with user type
        const updatedProfile = {
          name: decodedProfile.name,
          email: decodedProfile.email,
          picture: decodedProfile.picture,
          userType: userType,
          is_petsitter: userType === 'both' ? 1 : 0
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

        // Redirect to home page
        router.navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // This function is no longer needed since we automatically create the profile after Google authentication
  // Keeping it commented for reference
  // const handleRoleSelect = () => {
  //   setRoleFirst(false);
  // };

  const handleSubmit = async () => {
    if (!userProfile) {
      setError("No user profile found. Please log in with Google first.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get auth token from cookie
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      // Get the profile service URL from environment variables or use default
      const profileServiceUrl = import.meta.env.VITE_PROFILE_SERVICE_URL || 'http://localhost:8787';

      // First check if user already exists
      const checkUserResponse = await fetch(`${profileServiceUrl}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userProfile.email
        }),
      });
      
      if (!checkUserResponse.ok) {
        const errorData = await checkUserResponse.json() as { message?: string };
        throw new Error(errorData.message || "Failed to check user profile");
      }
      
      const userData = await checkUserResponse.json() as { exists: boolean; userType?: string };
      
      if (userData.exists) {
        // User already exists, update localStorage with user type and redirect to dashboard
        const updatedProfile = {
          ...userProfile,
          userType: userData.userType
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        // Redirect to home page
        router.navigate({ to: "/" });
        return;
      }

      // If user doesn't exist, create the profile
      const response = await fetch(`${profileServiceUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userProfile.email,
          username: userProfile.name,
          profile_image_url: userProfile.picture,
          is_petsitter: userType === 'both' ? 1 : 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to create profile");
      }

      // Update localStorage with user type
      const updatedProfile = {
        ...userProfile,
        userType: userType,
        is_petsitter: userType === 'both' ? 1 : 0
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      // Redirect to home page
      router.navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine what to show based on the current state
  const renderContent = () => {
    // If coming from login (already authenticated) or if authenticated after selecting role
    if (isAuthenticated) {
      return (
        <div className="space-y-4">
          <Tabs 
            defaultValue="petowner" 
            className="w-full" 
            onValueChange={(value) => setUserType(value as "petowner" | "both")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="petowner" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                Pet Owner
              </TabsTrigger>
              <TabsTrigger value="both" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Pet Owner & Sitter
              </TabsTrigger>
            </TabsList>
            <TabsContent value="petowner" className="mt-4 text-center">
              <h3 className="font-medium text-lg mb-2">Pet Owner</h3>
              <p className="text-muted-foreground mb-4">
                Find reliable pet sitters for your furry friends when you're away.
              </p>
            </TabsContent>
            <TabsContent value="both" className="mt-4 text-center">
              <h3 className="font-medium text-lg mb-2">Pet Owner & Sitter</h3>
              <p className="text-muted-foreground mb-4">
                Find pet sitters for your pets and offer your services to other pet owners.
              </p>
            </TabsContent>
          </Tabs>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Profile..." : "Continue"}
          </Button>
        </div>
      );
    }
    
    // If not authenticated and role selection comes first (direct signup)
    if (roleFirst) {
      return (
        <div className="space-y-4">
          <Tabs 
            defaultValue="petowner" 
            className="w-full" 
            onValueChange={(value) => setUserType(value as "petowner" | "both")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="petowner" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                Pet Owner
              </TabsTrigger>
              <TabsTrigger value="both" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Pet Owner & Sitter
              </TabsTrigger>
            </TabsList>
            <TabsContent value="petowner" className="mt-4 text-center">
              <h3 className="font-medium text-lg mb-2">Pet Owner</h3>
              <p className="text-muted-foreground mb-4">
                Find reliable pet sitters for your furry friends when you're away.
              </p>
            </TabsContent>
            <TabsContent value="both" className="mt-4 text-center">
              <h3 className="font-medium text-lg mb-2">Pet Owner & Sitter</h3>
              <p className="text-muted-foreground mb-4">
                Find pet sitters for your pets and offer your services to other pet owners.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-4"></div>
        </div>
      );
    }
    
    // If not authenticated and need to sign in with Google
    return (
      <div id="google-signin-button" className="flex justify-center"></div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <p className="text-center">Logging in...</p>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            {isAuthenticated 
              ? "Choose your role to get started" 
              : roleFirst 
                ? "Choose your role to get started"
                : "Sign in with Google to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-4 pt-0">
          {!isAuthenticated && (
            <div id="google-signin-button" className="flex justify-center -mt-9"></div>
          )}
          
          {!fromLogin && !isAuthenticated && (
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
