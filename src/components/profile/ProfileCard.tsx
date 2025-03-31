import { useRouter } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin } from "lucide-react";

interface ProfileCardProps {
  userData: any;
}

export const ProfileCard = ({ userData }: ProfileCardProps) => {
  const router = useRouter();
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
              src={userData.profile_image_url}
              alt={userData.username}
            />
            <AvatarFallback>
              {userData.username
                .split(" ")
                .map((n: any[]) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{userData.username}</h2>
          <div className="flex items-center mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{userData.latitude}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Member since {formatMemberSince(userData.created_at)}
          </p>
          <div className="mt-2">
            <Badge variant="default">
              {userData.is_petsitter === 1 ? "Pet Owner & Sitter" : "Pet Owner"}
            </Badge>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full flex items-center justify-center"
            onClick={() => router.navigate({ to: "/settings" })}
          >
            <Edit className="h-4 w-4 mr-2" />
            EDIT PROFILE
          </Button>
          <div className="mt-6 text-center">
            <h3 className="font-medium mb-2">About</h3>
            <p className="text-sm text-muted-foreground">
              {userData.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
