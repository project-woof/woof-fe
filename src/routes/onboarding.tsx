import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, User, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

declare const google: any;

function Onboarding() {
  const router = useRouter();

  const [isPetsitter, setIsPetsitter] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  const handleSubmit = async () => {
    if (!userProfile) {
      setError("No user profile found. Please log in with Google first.");
      router.navigate({ to: "/login" });
    }
  };

  useEffect(() => {
    console.log(isPetsitter);
  }, [isPetsitter]);

  const renderContent = () => {
    // If coming from login (already authenticated) or if authenticated after selecting role
    if (userProfile) {
      return (
        <div className="space-y-4">
          <Tabs
            defaultValue="petowner"
            className="w-full"
            onValueChange={(value) => setIsPetsitter(value === "both")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="petowner"
                className="flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-2" />
                Pet Owner
              </TabsTrigger>
              <TabsTrigger
                value="both"
                className="flex items-center justify-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Pet Owner & Sitter
              </TabsTrigger>
            </TabsList>
            <TabsContent value="petowner" className="mt-4 text-center">
              <h3 className="font-medium text-lg mb-2">Pet Owner</h3>
              <p className="text-muted-foreground mb-4">
                Find reliable pet sitters for your furry friends when you're
                away.
              </p>
            </TabsContent>
            <TabsContent value="both" className="mt-4 text-center">
              <h3 className="font-medium text-lg mb-2">Pet Owner & Sitter</h3>
              <p className="text-muted-foreground mb-4">
                Find pet sitters for your pets and offer your services to other
                pet owners.
              </p>
            </TabsContent>
          </Tabs>

          <Button className="w-full" onClick={handleSubmit}>
            "Continue"
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-[93vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>"Choose your role to get started"</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
