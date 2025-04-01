import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useAuth } from "@/context/authContext";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const [activeTab, setActiveTab] = useState("bookings");
  const { userProfile: userData } = useAuth();

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Failed to load user data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <div className="md:col-span-1">
            <ProfileCard userData={userData} />
          </div>
          {/* Right: Tabs for Bookings and Reviews */}
          <div className="md:col-span-2">
            <ProfileTabs
              userData={userData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
