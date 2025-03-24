import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PawPrint } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

declare const google: any;

function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
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

      const userProfile = decodeJwt(response.credential);
      console.log("Decoded JWT payload:", userProfile);
      
      // Store basic profile info in localStorage
      localStorage.setItem('userProfile', JSON.stringify({
        name: userProfile.name,
        email: userProfile.email,
        picture: userProfile.picture,
      }));

      // Set auth token cookie
      document.cookie = `auth_token=${response.credential}; path=/; max-age=86400`;
      
      try {
        // Use the production profile service URL directly
        const profileServiceUrl = 'https://petsitter-profile-worker.limqijie53.workers.dev';
        console.log('Profile service URL:', profileServiceUrl);
        
        // Check if user exists in database
        const checkUserResponse = await fetch(`${profileServiceUrl}/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.credential}`
          },
          body: JSON.stringify({
            email: userProfile.email
          }),
        });
        
        console.log('Check user response status:', checkUserResponse.status);
        
        if (!checkUserResponse.ok) {
          const errorText = await checkUserResponse.text();
          console.error('Error response text:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText || "Failed to check user profile" };
          }
          
          throw new Error(errorData.message || "Failed to check user profile");
        }
        
        const userData = await checkUserResponse.json() as { exists: boolean; is_petsitter?: number };
        
        if (userData.exists) {
          // User exists, update localStorage with petsitter status
          const updatedProfile = {
            ...JSON.parse(localStorage.getItem('userProfile') || '{}'),
            is_petsitter: userData.is_petsitter || 0
          };
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          
          // Navigate to home page
          router.navigate({ to: "/" });
        } else {
          // User doesn't exist, redirect to signup
          router.navigate({ 
            to: "/signup",
            search: { fromLogin: "true" }
          });
        }
      } catch (err: any) {
        console.error("Error checking user profile:", err);
        setError(err.message || "An error occurred during login");
        // Still navigate to signup as fallback
        router.navigate({ 
          to: "/signup",
          search: { fromLogin: "true" }
        });
      } finally {
        setIsLoading(false);
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: "540899016249-4t8a0kputh7m628pr492a7i4t9r6lpg6.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    };
    document.body.appendChild(script);
  }, [router]);

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
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="google-signin-button" className="flex justify-center"></div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              search={{ fromLogin: "false" }}
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
