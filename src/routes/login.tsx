import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
        newUserCallbackURL: "/signup",
      });
    } catch (error) {
      console.error("Error during Google SSO sign in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Sign in with Google
          </button>
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
