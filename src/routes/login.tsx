import type React from "react";

import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PawPrint } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

declare const google: any;

function Login() {
  const router = useRouter();

  useEffect(() => {
const handleCredentialResponse = (response: any) => {
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
  localStorage.setItem('userProfile', JSON.stringify({
    name: userProfile.name,
    email: userProfile.email,
    picture: userProfile.picture,
  }));

  document.cookie = `auth_token=${response.credential}; path=/; max-age=86400`;
  router.navigate({ to: "/" });
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
  }, []);

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
          <div id="google-signin-button" className="flex justify-center"></div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="." className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
