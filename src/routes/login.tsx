import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PawPrint } from "lucide-react";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const handleGoogleLogin = async () => {
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/api/auth/",
				newUserCallbackURL: "/api/auth/signup",
			});
		} catch (error) {
			console.error("Error during Google SSO sign in:", error);
		}
	};

  return (
    <div className="min-h-[93vh] flex items-center justify-center bg-gray-50">
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
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-md"
            style={{
              fontFamily: 'Roboto, Arial, sans-serif',
              fontWeight: 500,
              color: '#444',
              transition: 'background-color 0.3s'
            }}
          >
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google logo" 
              style={{ width: '18px', height: '18px' }} 
            />
            <span>Sign in with Google</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
