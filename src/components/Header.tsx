import { useState } from "react";

import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PawPrint,
  Menu,
  Home,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth";
import { useAuth } from "@/context/authContext";

export default function Header() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile, setUserProfile } = useAuth();

  if (userProfile && pathname === "/onboarding") {
    return null;
  }

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Messages", href: "/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setUserProfile(null);
          localStorage.removeItem("bearer_token");
          router.navigate({ to: "/" });
        },
      },
    });
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <PawPrint className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">Woof!</span>
        </Link>

        {userProfile ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                    <Avatar>
                      <AvatarImage
                        src={userProfile?.profile_image_url}
                        alt={userProfile?.username}
                      />
                      <AvatarFallback>{userProfile?.username}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userProfile?.profile_image_url}
                        alt={userProfile?.username}
                      />
                      <AvatarFallback>{userProfile?.username}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">
                        {userProfile?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="py-4">
                      <div className="flex items-center mb-6">
                        <PawPrint className="h-6 w-6 text-primary mr-2" />
                        <span className="font-bold text-lg">Woof!</span>
                      </div>
                      <nav className="flex flex-col space-y-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-2 py-2 rounded-md ${
                              isActive(item.href)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </nav>
                    </div>
                    <div className="mt-auto pb-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
